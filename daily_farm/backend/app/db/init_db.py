from sqlalchemy import create_engine, text
from app.core.config import settings

def init_db():
    engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))
    
    with engine.connect() as conn:
        # Drop existing enums if they exist
        conn.execute(text("DROP TYPE IF EXISTS usertype CASCADE"))
        conn.execute(text("DROP TYPE IF EXISTS authprovider CASCADE"))
        
        # Drop all tables
        conn.execute(text("DROP SCHEMA public CASCADE"))
        conn.execute(text("CREATE SCHEMA public"))
        
        conn.commit()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully") 