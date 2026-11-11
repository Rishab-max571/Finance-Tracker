from datetime import datetime

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db
from models.transaction import Transaction

transactions_bp = Blueprint("transactions", __name__)


def _parse_date(value):
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except (TypeError, ValueError):
        return None


@transactions_bp.get("/transactions")
@jwt_required()
def list_transactions():
    user_id = int(get_jwt_identity())
    query = Transaction.query.filter_by(user_id=user_id)

    category = request.args.get("category")
    ttype = request.args.get("type")
    start = _parse_date(request.args.get("start"))
    end = _parse_date(request.args.get("end"))
    search = request.args.get("search")

    if category:
        query = query.filter(Transaction.category == category)
    if ttype in ("income", "expense"):
        query = query.filter(Transaction.type == ttype)
    if start:
        query = query.filter(Transaction.date >= start)
    if end:
        query = query.filter(Transaction.date <= end)
    if search:
        query = query.filter(Transaction.description.ilike(f"%{search}%"))

    items = query.order_by(Transaction.date.desc(), Transaction.id.desc()).all()
    return jsonify([t.to_dict() for t in items])


@transactions_bp.post("/transactions")
@jwt_required()
def create_transaction():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}

    ttype = data.get("type")
    amount = data.get("amount")
    category = (data.get("category") or "").strip()
    date = _parse_date(data.get("date"))

    if ttype not in ("income", "expense"):
        return jsonify({"error": "type must be 'income' or 'expense'"}), 400
    if not isinstance(amount, (int, float)) or amount <= 0:
        return jsonify({"error": "amount must be a positive number"}), 400
    if not category:
        return jsonify({"error": "category is required"}), 400
    if not date:
        return jsonify({"error": "date must be in YYYY-MM-DD format"}), 400

    tx = Transaction(
        user_id=user_id,
        type=ttype,
        amount=amount,
        category=category,
        description=data.get("description", ""),
        date=date,
    )
    db.session.add(tx)
    db.session.commit()
    return jsonify(tx.to_dict()), 201


@transactions_bp.put("/transactions/<int:tx_id>")
@jwt_required()
def update_transaction(tx_id):
    user_id = int(get_jwt_identity())
    tx = Transaction.query.filter_by(id=tx_id, user_id=user_id).first_or_404()
    data = request.get_json(silent=True) or {}

    if "type" in data:
        if data["type"] not in ("income", "expense"):
            return jsonify({"error": "type must be 'income' or 'expense'"}), 400
        tx.type = data["type"]
    if "amount" in data:
        if not isinstance(data["amount"], (int, float)) or data["amount"] <= 0:
            return jsonify({"error": "amount must be a positive number"}), 400
        tx.amount = data["amount"]
    if "category" in data:
        tx.category = data["category"].strip()
    if "description" in data:
        tx.description = data["description"]
    if "date" in data:
        parsed = _parse_date(data["date"])
        if not parsed:
            return jsonify({"error": "date must be in YYYY-MM-DD format"}), 400
        tx.date = parsed

    db.session.commit()
    return jsonify(tx.to_dict())


@transactions_bp.delete("/transactions/<int:tx_id>")
@jwt_required()
def delete_transaction(tx_id):
    user_id = int(get_jwt_identity())
    tx = Transaction.query.filter_by(id=tx_id, user_id=user_id).first_or_404()
    db.session.delete(tx)
    db.session.commit()
    return jsonify({"deleted": True})


@transactions_bp.get("/dashboard")
@jwt_required()
def dashboard():
    user_id = int(get_jwt_identity())
    items = Transaction.query.filter_by(user_id=user_id).all()

    income = sum(t.amount for t in items if t.type == "income")
    expenses = sum(t.amount for t in items if t.type == "expense")
    balance = income - expenses

    by_category = {}
    for t in items:
        if t.type == "expense":
            by_category[t.category] = by_category.get(t.category, 0) + t.amount

    return jsonify(
        {
            "balance": balance,
            "income": income,
            "expenses": expenses,
            "savings": balance,
            "expenses_by_category": by_category,
        }
    )
