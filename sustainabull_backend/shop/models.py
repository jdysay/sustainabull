from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey, CheckConstraint, UniqueConstraint, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class Cow(Base):
    __tablename__ = 'cows'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), unique=True)
    cow_name = Column(String(100), nullable=False)
    cow_level = Column(Integer, default=1)
    experience_points = Column(Integer, default=0)
    mood = Column(Integer, CheckConstraint('mood BETWEEN 0 AND 100'), default=100)
    hunger = Column(Integer, CheckConstraint('hunger BETWEEN 0 AND 100'), default=100)
    co2_emissions = Column(Integer, CheckConstraint('co2_emissions BETWEEN 0 AND 100'), default=0)
    exercise = Column(Integer, default=0)
    alive = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="cow")
    decorations = relationship("CowDecoration", back_populates="cow", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Cow(id={self.id}, name='{self.cow_name}', level={self.cow_level})>"


class ShopItem(Base):
    __tablename__ = 'shop_items'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    item_name = Column(String(100), nullable=False)
    item_type = Column(String(20), nullable=False)
    price = Column(Integer, nullable=False)
    effect_element = Column(Integer, nullable=False)
    effect_value = Column(Integer)
    item_description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    inventories = relationship("Inventory", back_populates="item")
    cow_decorations = relationship("CowDecoration", back_populates="item")
    
    def __repr__(self):
        return f"<ShopItem(id={self.id}, name='{self.item_name}', type='{self.item_type}')>"


class Inventory(Base):
    __tablename__ = 'inventories'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    item_id = Column(Integer, ForeignKey('shop_items.id', ondelete='CASCADE'))
    quantity = Column(Integer, nullable=False, default=1)
    acquired_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="inventory_items")
    item = relationship("ShopItem", back_populates="inventories")
    
    def __repr__(self):
        return f"<Inventory(id={self.id}, user_id={self.user_id}, item_id={self.item_id}, quantity={self.quantity})>"


class CowDecoration(Base):
    __tablename__ = 'cow_decorations'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    cow_id = Column(Integer, ForeignKey('cows.id', ondelete='CASCADE'))
    item_id = Column(Integer, ForeignKey('shop_items.id', ondelete='CASCADE'))
    equipped_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    cow = relationship("Cow", back_populates="decorations")
    item = relationship("ShopItem", back_populates="cow_decorations")
    
    def __repr__(self):
        return f"<CowDecoration(id={self.id}, cow_id={self.cow_id}, item_id={self.item_id})>"