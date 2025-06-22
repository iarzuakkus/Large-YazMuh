from app.db import db
from datetime import datetime

class Follow(db.Model):
    __tablename__ = "user_follows"

    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('blog_users.id'))
    followed_id = db.Column(db.Integer, db.ForeignKey('blog_users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
