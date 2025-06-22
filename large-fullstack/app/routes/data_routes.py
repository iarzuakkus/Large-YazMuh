from flask import Blueprint, jsonify, request
from app.models import Topic, User, Post
from sqlalchemy import func


data_bp = Blueprint("data", __name__, url_prefix="/api")

@data_bp.route("/topics", methods=["GET"])
def get_topics():
    topics = Topic.query.order_by(Topic.name).all()
    return jsonify([{"id": t.id, "name": t.name} for t in topics])

@data_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.limit(5).all()
    return jsonify([{"id": u.id, "username": u.username} for u in users])

@data_bp.route("/posts", methods=["GET"])
def get_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    result = []
    for post in posts:
        result.append({
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "author": {
                "id": post.author_id,
                "username": post.author.username if post.author else None
            },
            "created_at": post.created_at.isoformat(),
            "topics": [{"id": t.id, "name": t.name} for t in post.topics]
        })
    return jsonify(result)


from flask import request, jsonify
from app.models import Post, User, Topic

@data_bp.route("/search")
def api_search():
    query = request.args.get("q", "").strip()
    if not query:
        return jsonify({"posts": [], "users": [], "topics": []})

    # Post araması
    posts = Post.query.filter(Post.title.ilike(f"%{query}%")).all()
    posts_result = [
        {
            "id": post.id,
            "title": post.title,
            "excerpt": post.content[:150],
            "author": post.author.username,
            "created_at": post.created_at.strftime("%b %d, %Y")
        }
        for post in posts
    ]

    # Kullanıcı araması
    users = User.query.filter(func.lower(User.username).like(f"%{query}%")).all()
    users_result = [
        {"id": user.id, "username": user.username}
        for user in users
    ]

    # Konu araması
    topics = Topic.query.filter(Topic.name.ilike(f"%{query}%")).all()
    topics_result = [
        {
            "id": topic.id,
            "name": topic.name
        }
        for topic in topics
    ]

    return jsonify({
        "posts": posts_result,
        "users": users_result,
        "topics": topics_result
    })
