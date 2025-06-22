from app.db import db
from datetime import datetime

user_topics = db.Table('user_topics',
    db.Column('user_id', db.Integer, db.ForeignKey('blog_users.id'), primary_key=True),
    db.Column('topic_id', db.Integer, db.ForeignKey('topics.id'), primary_key=True),
    db.Column('created_at', db.DateTime, default=datetime.utcnow)
)

class User(db.Model):
    __tablename__ = "blog_users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    followed_topics = db.relationship('Topic', secondary='user_topics', backref='followers')
