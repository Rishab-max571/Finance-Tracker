from datetime import datetime, timezone

from models import db


class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)

    type = db.Column(db.String(10), nullable=False)  # 'income' | 'expense'
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(60), nullable=False)
    description = db.Column(db.String(255))
    date = db.Column(db.Date, nullable=False)

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "amount": self.amount,
            "category": self.category,
            "description": self.description,
            "date": self.date.isoformat() if self.date else None,
        }
