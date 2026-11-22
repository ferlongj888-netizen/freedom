from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    brand: str = Field(..., min_length=1, max_length=100)
    description: str = ""
    style: str = ""
    price: Decimal = Field(..., gt=0)
    image_url: str | None = None
    stock_quantity: int = Field(default=0, ge=0)
    category_id: int | None = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    brand: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = None
    style: str | None = None
    price: Decimal | None = Field(default=None, gt=0)
    image_url: str | None = None
    stock_quantity: int | None = Field(default=None, ge=0)
    category_id: int | None = None


class ProductRead(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int