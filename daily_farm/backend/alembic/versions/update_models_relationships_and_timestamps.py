"""update models relationships and timestamps

Revision ID: fb5dcea26ea5
Revises: 
Create Date: 2024-01-20 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'fb5dcea26ea5'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # ### Message model changes ###
    
    # Create new columns
    op.add_column('messages', sa.Column('sender_id', sa.Integer(), nullable=True))
    op.add_column('messages', sa.Column('receiver_id', sa.Integer(), nullable=True))
    
    # Copy data from user_id to sender_id (if needed)
    op.execute('UPDATE messages SET sender_id = user_id')
    
    # Create foreign keys
    op.create_foreign_key('fk_message_sender', 'messages', 'users', ['sender_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('fk_message_receiver', 'messages', 'users', ['receiver_id'], ['id'], ondelete='CASCADE')
    
    # Drop old column
    op.drop_column('messages', 'user_id')
    
    # ### Order system changes ###
    
    # Create order_items table
    op.create_table('order_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=True),
        sa.Column('crop_id', sa.Integer(), nullable=True),
        sa.Column('quantity', sa.Float(), nullable=True),
        sa.Column('price_per_unit', sa.Float(), nullable=True),
        sa.Column('total_price', sa.Float(), nullable=True),
        sa.Column('created_at', sa.String(), nullable=True),
        sa.Column('updated_at', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['crop_id'], ['crops.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Copy data from orders to order_items
    op.execute('''
        INSERT INTO order_items (order_id, crop_id, quantity, price_per_unit, total_price, created_at, updated_at)
        SELECT id, crop_id, quantity, total_price/quantity, total_price, created_at, updated_at
        FROM orders WHERE crop_id IS NOT NULL
    ''')
    
    # Drop old columns from orders
    op.drop_column('orders', 'crop_id')
    op.drop_column('orders', 'quantity')
    
    # ### Update foreign key constraints ###
    
    # Update Cart foreign key
    op.drop_constraint('carts_user_id_fkey', 'carts')
    op.create_foreign_key('carts_user_id_fkey', 'carts', 'users', ['user_id'], ['id'], ondelete='CASCADE')
    
    # Update CartItem foreign keys
    op.drop_constraint('cart_items_cart_id_fkey', 'cart_items')
    op.drop_constraint('cart_items_crop_id_fkey', 'cart_items')
    op.create_foreign_key('cart_items_cart_id_fkey', 'cart_items', 'carts', ['cart_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('cart_items_crop_id_fkey', 'cart_items', 'crops', ['crop_id'], ['id'], ondelete='CASCADE')
    
    # Update Crop foreign key
    op.drop_constraint('crops_farmer_id_fkey', 'crops')
    op.create_foreign_key('crops_farmer_id_fkey', 'crops', 'users', ['farmer_id'], ['id'], ondelete='CASCADE')
    
    # Update default value for Crop.images
    op.alter_column('crops', 'images',
        existing_type=postgresql.JSON(astext_type=sa.Text()),
        server_default='[]',
        existing_nullable=True)

def downgrade():
    # ### Message model changes ###
    op.add_column('messages', sa.Column('user_id', sa.Integer(), nullable=True))
    op.execute('UPDATE messages SET user_id = sender_id')
    op.drop_constraint('fk_message_sender', 'messages', type_='foreignkey')
    op.drop_constraint('fk_message_receiver', 'messages', type_='foreignkey')
    op.drop_column('messages', 'sender_id')
    op.drop_column('messages', 'receiver_id')
    
    # ### Order system changes ###
    op.add_column('orders', sa.Column('crop_id', sa.Integer(), nullable=True))
    op.add_column('orders', sa.Column('quantity', sa.Float(), nullable=True))
    
    # Copy first order_item back to order (this might lose data if multiple items exist)
    op.execute('''
        UPDATE orders o
        SET crop_id = oi.crop_id,
            quantity = oi.quantity
        FROM order_items oi
        WHERE o.id = oi.order_id
        AND oi.id IN (
            SELECT MIN(id)
            FROM order_items
            GROUP BY order_id
        )
    ''')
    
    op.drop_table('order_items')
    
    # ### Revert foreign key constraints ###
    op.drop_constraint('carts_user_id_fkey', 'carts')
    op.create_foreign_key('carts_user_id_fkey', 'carts', 'users', ['user_id'], ['id'])
    
    op.drop_constraint('cart_items_cart_id_fkey', 'cart_items')
    op.drop_constraint('cart_items_crop_id_fkey', 'cart_items')
    op.create_foreign_key('cart_items_cart_id_fkey', 'cart_items', 'carts', ['cart_id'], ['id'])
    op.create_foreign_key('cart_items_crop_id_fkey', 'cart_items', 'crops', ['crop_id'], ['id'])
    
    op.drop_constraint('crops_farmer_id_fkey', 'crops')
    op.create_foreign_key('crops_farmer_id_fkey', 'crops', 'users', ['farmer_id'], ['id'])
    
    op.alter_column('crops', 'images',
        existing_type=postgresql.JSON(astext_type=sa.Text()),
        server_default=None,
        existing_nullable=True) 