import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
