from flask import Blueprint, request, jsonify, session, flash
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy import text, func
from app.models import User, Topic, Post, Like, Save, Comment
from app import db
from config import redis_client
import json
import pika

def publish_comment_event(data):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()
    channel.queue_declare(queue='comment_events')  # Kuyruğu tanımla
    channel.basic_publish(exchange='', routing_key='comment_events', body=json.dumps(data))
    connection.close()
    
def publish_post_event(data):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()
    channel.queue_declare(queue='post_events')
    channel.basic_publish(exchange='', routing_key='post_events', body=json.dumps(data))
    connection.close()

auth_bp = Blueprint("auth", __name__, url_prefix="/api")

@auth_bp.route("/session-check")
def session_check():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"logged_in": False}), 401
    return jsonify({
        "logged_in": True,
        "user_id": user_id  # ← buraya ekle
    }), 200

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        session["user_id"] = user.id
        return jsonify({"message": "Giriş başarılı.", "user_id": user.id}), 200
    return jsonify({"error": "Geçersiz e-posta veya şifre."}), 401

@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)  # Kullanıcı oturumunu sil
    return jsonify({"message": "Başarıyla çıkış yapıldı."}), 200

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirm_password")

    if not all([username, email, password, confirm_password]):
        return jsonify({"error": "Tüm alanlar zorunludur."}), 400

    if password != confirm_password:
        return jsonify({"error": "Şifreler uyuşmuyor."}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Bu e-posta zaten kayıtlı."}), 409
    
  
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Bu kullanıcı adı zaten alınmış."}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id
    return jsonify({"message": "Kayıt başarılı."}), 201

@auth_bp.route("/follow-topic", methods=["POST"])
def follow_topic():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Giriş yapılmamış"}), 401

    topic_id = request.json.get("topic_id")
    if not topic_id:
        return jsonify({"error": "Topic ID eksik"}), 400

    db.session.execute(
        text("INSERT INTO user_topics (user_id, topic_id) VALUES (:user_id, :topic_id) ON CONFLICT DO NOTHING"),
        {"user_id": user_id, "topic_id": topic_id}
    )
    db.session.commit()
    return jsonify({"message": "Konu takip edildi."}), 200


@auth_bp.route("/follow-user", methods=["POST"])
def follow_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Giriş yapılmamış"}), 401

    followed_id = request.json.get("user_id")
    if not followed_id or int(followed_id) == user_id:
        return jsonify({"error": "Hedef kullanıcı geçersiz"}), 400

    db.session.execute(
        text("INSERT INTO user_follows (follower_id, followed_id) VALUES (:follower_id, :followed_id) ON CONFLICT DO NOTHING"),
        {"follower_id": user_id, "followed_id": followed_id}
    )
    db.session.commit()
    return jsonify({"message": "Kullanıcı takip edildi."}), 200



@auth_bp.route("/posts", methods=["POST"])
def create_post():
    if "user_id" not in session:
        return jsonify({"error": "Giriş yapılmamış"}), 401

    data = request.get_json()
    title = data.get("title")
    content = data.get("content")
    topic_ids = data.get("topic_ids", [])

    if not title or not content:
        return jsonify({"error": "Başlık ve içerik zorunludur."}), 400

    new_post = Post(
        title=title,
        content=content,
        author_id=session["user_id"]
    )

    if topic_ids:
        topics = Topic.query.filter(Topic.id.in_(topic_ids)).all()
        new_post.topics = topics

    db.session.add(new_post)
    db.session.commit()

    # ✅ Post oluşturulduktan sonra RabbitMQ mesajı gönder
    publish_post_event({
        "type": "post_created",
        "post_id": new_post.id,
        "user_id": session["user_id"],
        "title": new_post.title
    })

    return jsonify({"message": "Post başarıyla oluşturuldu.", "post_id": new_post.id}), 201

@auth_bp.route("/like-post", methods=["POST"])
def like_post():
    if "user_id" not in session:
        return jsonify({"error": "Giriş yapılmamış"}), 401

    data = request.get_json()
    post_id = data.get("post_id")
    user_id = session["user_id"]

    if not post_id:
        return jsonify({"error": "Post ID eksik"}), 400

    existing_like = Like.query.filter_by(user_id=user_id, post_id=post_id).first()
    if existing_like:
        db.session.delete(existing_like)
        db.session.commit()
        return jsonify({"message": "Beğeni kaldırıldı", "liked": False}), 200
    else:
        new_like = Like(user_id=user_id, post_id=post_id)
        db.session.add(new_like)
        db.session.commit()
        return jsonify({"message": "Post beğenildi", "liked": True}), 200

@auth_bp.route("/save-post", methods=["POST"])
def save_post():
    if "user_id" not in session:
        return jsonify({"error": "Giriş yapılmamış"}), 401

    data = request.get_json()
    post_id = data.get("post_id")
    user_id = session["user_id"]

    if not post_id:
        return jsonify({"error": "Post ID eksik"}), 400

    existing_save = Save.query.filter_by(user_id=user_id, post_id=post_id).first()
    if existing_save:
        db.session.delete(existing_save)
        db.session.commit()
        return jsonify({"message": "Kaydetme kaldırıldı", "saved": False}), 200
    else:
        new_save = Save(user_id=user_id, post_id=post_id)
        db.session.add(new_save)
        db.session.commit()
        return jsonify({"message": "Post kaydedildi", "saved": True}), 200


@auth_bp.route("/posts/<int:post_id>/comment", methods=["POST"])
def api_comment_post(post_id):
    if "user_id" not in session:
        return jsonify({"error": "Giriş yapılmamış"}), 401

    data = request.get_json()
    content = data.get("content", "").strip()

    if not content:
        return jsonify({"error": "Yorum boş olamaz"}), 400

    comment = Comment(
        content=content,
        user_id=session["user_id"],
        post_id=post_id
    )
    db.session.add(comment)
    db.session.commit()

    # ✅ Redis güncellemeleri
    redis_client.zincrby("comment_ranking", 1, f"post:{post_id}")
    redis_client.delete("top_commented_posts")

    # ✅ RabbitMQ mesajı gönder
    publish_comment_event({
        "type": "comment_created",
        "comment_id": comment.id,
        "post_id": post_id,
        "user_id": session["user_id"]
    })

    return jsonify({
        "message": "Yorum başarıyla eklendi.",
        "comment": {
            "author": comment.user.username,
            "content": comment.content,
            "created_at": comment.created_at.strftime("%Y-%m-%d %H:%M")
        }
    }), 201


@auth_bp.route("/top-commented-posts", methods=["GET"])
def get_top_commented_posts():
    # Önce Redis'ten kontrol et
    cached = redis_client.get("top_commented_posts")
    if cached:
        try:
            return jsonify(json.loads(cached)), 200
        except:
            pass  # Redis bozuksa devam et

    # Redis'te yoksa veritabanından çek
    top_posts = (
        Post.query
        .outerjoin(Comment)
        .group_by(Post.id)
        .order_by(func.count(Comment.id).desc())
        .limit(5)
        .all()
    )

    result = []
    for post in top_posts:
        result.append({
            "id": post.id,
            "title": post.title,
            "comment_count": len(post.comments)
        })

    # Redis'e yaz - 10 dakika süreyle sakla
    redis_client.setex("top_commented_posts", 600, json.dumps(result))

    return jsonify(result), 200



