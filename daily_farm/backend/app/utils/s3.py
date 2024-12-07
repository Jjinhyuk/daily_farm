import boto3
from botocore.exceptions import ClientError
import os
from fastapi import UploadFile
from typing import Optional, List
import uuid
from datetime import datetime
from app.core.config import settings

class S3Client:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        ) if settings.USE_S3 else None
        self.bucket_name = settings.S3_BUCKET_NAME if settings.USE_S3 else None
        
    async def upload_image(self, file: UploadFile, folder: str = "crops") -> Optional[str]:
        """실제 S3 업로드 또는 로컬 저장소에 저장"""
        if not file:
            return None
            
        # 파일 확장자 확인
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png', '.gif']:
            raise ValueError("Unsupported file format")
            
        # 고유한 파일명 생성
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_id = str(uuid.uuid4())[:8]
        filename = f"{folder}/{timestamp}_{unique_id}{ext}"
        
        if settings.USE_S3:
            try:
                contents = await file.read()
                self.s3_client.put_object(
                    Bucket=self.bucket_name,
                    Key=filename,
                    Body=contents,
                    ContentType=file.content_type
                )
                return f"https://{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{filename}"
            except ClientError as e:
                print(f"Error uploading to S3: {e}")
                return None
            finally:
                await file.seek(0)
        else:
            # 로컬 저장소에 저장 (테스트용)
            local_storage_path = os.path.join(settings.LOCAL_STORAGE_PATH, folder)
            os.makedirs(local_storage_path, exist_ok=True)
            
            local_path = os.path.join(local_storage_path, os.path.basename(filename))
            contents = await file.read()
            
            with open(local_path, "wb") as f:
                f.write(contents)
            
            return f"/static/{folder}/{os.path.basename(filename)}"
            
    async def delete_image(self, image_url: str) -> bool:
        """S3 또는 로컬 ��장소에서 이미지 삭제"""
        if not image_url:
            return False
            
        if settings.USE_S3:
            try:
                # S3 URL에서 키 추출
                key = image_url.split(f"{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/")[1]
                self.s3_client.delete_object(
                    Bucket=self.bucket_name,
                    Key=key
                )
                return True
            except ClientError as e:
                print(f"Error deleting from S3: {e}")
                return False
        else:
            try:
                # 로컬 경로에서 파일 삭제
                local_path = os.path.join(
                    settings.LOCAL_STORAGE_PATH,
                    image_url.replace("/static/", "")
                )
                if os.path.exists(local_path):
                    os.remove(local_path)
                return True
            except Exception as e:
                print(f"Error deleting local file: {e}")
                return False

s3_client = S3Client() 