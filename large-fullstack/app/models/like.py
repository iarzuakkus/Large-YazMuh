from app.db import db
from datetime import datetime

class Like(db.Model):
    __tablename__ = "post_likes"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('blog_users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('blog_posts.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
