import boto3
from botocore.exceptions import ClientError
from app.core.config import settings
import logging

class MinioClient:
    def __init__(self):
        self.s3_client = boto3.client(
            "s3",
            endpoint_url=f"http://{settings.MINIO_ENDPOINT}",
            aws_access_key_id=settings.MINIO_ACCESS_KEY,
            aws_secret_access_key=settings.MINIO_SECRET_KEY,
            config=boto3.session.Config(signature_version='s3v4'),
            region_name="us-east-1"
        )
        # Client for generating presigned URLs (external access)
        external_endpoint = settings.MINIO_EXTERNAL_ENDPOINT or settings.MINIO_ENDPOINT
        self.s3_signer = boto3.client(
            "s3",
            endpoint_url=f"http://{external_endpoint}",
            aws_access_key_id=settings.MINIO_ACCESS_KEY,
            aws_secret_access_key=settings.MINIO_SECRET_KEY,
            config=boto3.session.Config(signature_version='s3v4'),
            region_name="us-east-1"
        )
        self.bucket_name = settings.MINIO_BUCKET_NAME
        self._ensure_bucket_exists()

    def _ensure_bucket_exists(self):
        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
        except ClientError:
            try:
                self.s3_client.create_bucket(Bucket=self.bucket_name)
            except ClientError as e:
                logging.error(f"Could not create bucket: {e}")

    def upload_file(self, file_obj, object_name):
        try:
            self.s3_client.upload_fileobj(file_obj, self.bucket_name, object_name)
            return f"{object_name}"
        except ClientError as e:
            logging.error(e)
            return None

    def get_file_url(self, object_name):
        # Generate presigned URL
        try:
            response = self.s3_signer.generate_presigned_url('get_object',
                                                             Params={'Bucket': self.bucket_name,
                                                                     'Key': object_name},
                                                             ExpiresIn=3600)
        except ClientError as e:
            logging.error(e)
            return None
        return response

storage = MinioClient()
