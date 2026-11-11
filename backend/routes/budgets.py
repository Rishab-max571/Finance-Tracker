from datetime import date

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError

from models import db
from models.budget import Budget
from models.transaction import Transaction

budgets_bp = Blueprint("budgets", __name__)


@budgets_bp.get("/budgets")
@jwt_required()
def list_budgets():
    user_id = int(get_jwt_identity())
    month = request.args.get("month", date.today().strftime("%Y-%m"))

    budgets = Budget.query.filter_by(user_id=user_id, month=month).all()

    spent_by_category = {}
    txs = Transaction.query.filter(
        Transaction.user_id == user_id,
        Transaction.type == "expense",
    ).all()
    for t in txs:
        if t.date.strftime("%Y-%m") == month:
            spent_by_category[t.category] = spent_by_category.get(t.category, 0) + t.amount

    result = []
    for b in budgets:
        d = b.to_dict()
        d["spent"] = spent_by_category.get(b.category, 0)
        d["remaining"] = b.monthly_limit - d["spent"]
        result.append(d)
    return jsonify(result)


@budgets_bp.post("/budgets")
@jwt_required()
def create_or_update_budget():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}

    category = (data.get("category") or "").strip()
    monthly_limit = data.get("monthly_limit")
    month = data.get("month", date.today().strftime("%Y-%m"))

    if not category:
        return jsonify({"error": "category is required"}), 400
    if not isinstance(monthly_limit, (int, float)) or monthly_limit <= 0:
        return jsonify({"error": "monthly_limit must be a positive number"}), 400

    budget = Budget.query.filter_by(user_id=user_id, category=category, month=month).first()
    if budget:
        budget.monthly_limit = monthly_limit
    else:
        budget = Budget(user_id=user_id, category=category, monthly_limit=monthly_limit, month=month)
        db.session.add(budget)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "could not save budget"}), 400

    return jsonify(budget.to_dict()), 201


@budgets_bp.delete("/budgets/<int:budget_id>")
@jwt_required()
def delete_budget(budget_id):
    user_id = int(get_jwt_identity())
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first_or_404()
    db.session.delete(budget)
    db.session.commit()
    return jsonify({"deleted": True})
