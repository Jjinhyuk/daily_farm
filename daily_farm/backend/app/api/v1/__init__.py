from fastapi import APIRouter

from app.api.v1.endpoints import auth, crops, cart, orders, reviews, messages

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(crops.router, prefix="/crops", tags=["crops"])
api_router.include_router(cart.router, prefix="/cart", tags=["cart"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(messages.router, prefix="/messages", tags=["messages"]) 