from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from app.models import User, Topic, Post, Comment
from app import db
from config import redis_client

page_bp = Blueprint("pages", __name__)

@page_bp.route("/")
def index():
    user_id = session.get("user_id")
    is_logged_in = user_id is not None

    posts = Post.query.order_by(Post.created_at.desc()).limit(10).all()
    suggested_topics = Topic.query.limit(5).all()
    suggested_users = User.query.limit(5).all()

    return render_template(
        "index.html",
        posts=posts,
        suggested_topics=suggested_topics,
        suggested_users=suggested_users,
        is_logged_in=is_logged_in
    )


@page_bp.route("/interests")
def interests():
    if "user_id" not in session:
        return redirect(url_for("pages.login_page"))
    return render_template("interests.html")

@page_bp.route("/login")
def login_page():
    return render_template("login.html")

@page_bp.route("/register")
def register_page():
    return render_template("register.html")

@page_bp.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("pages.index"))

@page_bp.route("/profile")
def profile():
    user_id = session.get("user_id")
    if not user_id:
        return redirect(url_for("pages.login_page"))

    user = User.query.get_or_404(user_id)
    posts = Post.query.filter_by(author_id=user.id).order_by(Post.created_at.desc()).all()
    return render_template("profile.html", current_user=user, posts=posts)

@page_bp.route("/write")
def write():
    if "user_id" not in session:
        return redirect(url_for("pages.login_page"))
    return render_template("write.html")

@page_bp.route('/posts/<int:post_id>')
def post(post_id):
    post = Post.query.get_or_404(post_id)
    return render_template("post.html", post=post, is_logged_in=session.get("user_id") is not None)

@page_bp.route("/search")
def search():
    query = request.args.get("q", "")
    posts = Post.query.filter(
        Post.title.ilike(f"%{query}%") | Post.content.ilike(f"%{query}%")
    ).all()
    return render_template("search_results.html", posts=posts, query=query)

@page_bp.route("/health")
def health():
    return "OK", 200

