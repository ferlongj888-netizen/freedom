from pydantic import BaseModel, ConfigDict, Field
from app.schemas.product import ProductRead

class CartItemCreate(BaseModel):
    product_id: int
    size: str = Field(..., min_length=1, max_length=10)
    quantity: int = Field(default=1, ge=1)

class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=1)

class CartItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    product_id: int
    size: str
    quantity: int
    product: ProductRead