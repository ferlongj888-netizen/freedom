import enum


class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"


class OrderStatus(str, enum.Enum):
    CREATED = "created"
    PAID = "paid"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"