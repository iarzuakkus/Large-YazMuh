from app.db import db
from datetime import datetime

post_topics = db.Table(
    "post_topics",
    db.Column("post_id", db.Integer, db.ForeignKey("blog_posts.id"), primary_key=True),
    db.Column("topic_id", db.Integer, db.ForeignKey("topics.id"), primary_key=True)
)

class Post(db.Model):
    __tablename__ = "blog_posts"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('blog_users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    topics = db.relationship("Topic", secondary=post_topics, backref="posts")
    
    # Burada author ilişkisi eklendi:
    author = db.relationship("User", backref="posts")
