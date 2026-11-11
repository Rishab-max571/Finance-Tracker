from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from models.user import User  # noqa: E402,F401
from models.transaction import Transaction  # noqa: E402,F401
from models.budget import Budget  # noqa: E402,F401
