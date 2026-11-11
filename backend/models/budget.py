from models import db


class Budget(db.Model):
    __tablename__ = "budgets"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)

    category = db.Column(db.String(60), nullable=False)
    monthly_limit = db.Column(db.Float, nullable=False)
    month = db.Column(db.String(7), nullable=False)  # 'YYYY-MM'

    __table_args__ = (
        db.UniqueConstraint("user_id", "category", "month", name="uq_budget_user_cat_month"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "monthly_limit": self.monthly_limit,
            "month": self.month,
        }
