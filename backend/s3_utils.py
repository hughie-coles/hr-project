import os
import boto3
from botocore.exceptions import ClientError
from typing import Optional, BinaryIO

# S3 Configuration
S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME', 'hc-hr-resources')
S3_REGION = os.getenv('S3_REGION', 'us-east-1')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
S3_ENDPOINT_URL = os.getenv('S3_ENDPOINT_URL')  # For local S3-compatible services like LocalStack

def get_s3_client():
    """Create and return an S3 client."""
    kwargs = {
        'region_name': S3_REGION,
    }
    
    if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
        kwargs['aws_access_key_id'] = AWS_ACCESS_KEY_ID
        kwargs['aws_secret_access_key'] = AWS_SECRET_ACCESS_KEY
    
    if S3_ENDPOINT_URL:
        kwargs['endpoint_url'] = S3_ENDPOINT_URL
    
    return boto3.client('s3', **kwargs)


def upload_file_to_s3(file_content: BinaryIO, s3_key: str, content_type: str = 'application/pdf') -> tuple:
    """
    Upload a file to S3.
    
    Args:
        file_content: File-like object to upload
        s3_key: S3 object key (path in bucket)
        content_type: MIME type of the file
    
    Returns:
        Tuple of (success: bool, error_message: Optional[str])
    """
    try:
        # Validate credentials
        if not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY:
            return False, "AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env file"
        
        if not S3_BUCKET_NAME:
            return False, "S3_BUCKET_NAME not configured"
        
        s3_client = get_s3_client()
        
        # Reset file pointer to beginning
        file_content.seek(0)
        
        s3_client.upload_fileobj(
            file_content,
            S3_BUCKET_NAME,
            s3_key,
            ExtraArgs={'ContentType': content_type}
        )
        return True, None
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code', 'Unknown')
        error_msg = e.response.get('Error', {}).get('Message', str(e))
        error_message = f"S3 ClientError ({error_code}): {error_msg}"
        print(f"Error uploading file to S3: {error_message}")
        return False, error_message
    except Exception as e:
        error_message = f"Unexpected error uploading to S3: {str(e)}"
        print(error_message)
        return False, error_message


def download_file_from_s3(s3_key: str) -> Optional[bytes]:
    """
    Download a file from S3.
    
    Args:
        s3_key: S3 object key (path in bucket)
    
    Returns:
        File content as bytes, or None if error
    """
    try:
        s3_client = get_s3_client()
        response = s3_client.get_object(Bucket=S3_BUCKET_NAME, Key=s3_key)
        return response['Body'].read()
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchKey':
            print(f"File not found in S3: {s3_key}")
        else:
            print(f"Error downloading file from S3: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error downloading from S3: {e}")
        return None


def delete_file_from_s3(s3_key: str) -> bool:
    """
    Delete a file from S3.
    
    Args:
        s3_key: S3 object key (path in bucket)
    
    Returns:
        True if successful, False otherwise
    """
    try:
        s3_client = get_s3_client()
        s3_client.delete_object(Bucket=S3_BUCKET_NAME, Key=s3_key)
        return True
    except ClientError as e:
        print(f"Error deleting file from S3: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error deleting from S3: {e}")
        return False


def get_s3_presigned_url(s3_key: str, expiration: int = 3600) -> Optional[str]:
    """
    Generate a presigned URL for temporary access to an S3 object.
    
    Args:
        s3_key: S3 object key (path in bucket)
        expiration: URL expiration time in seconds (default: 1 hour)
    
    Returns:
        Presigned URL string, or None if error
    """
    try:
        s3_client = get_s3_client()
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': S3_BUCKET_NAME, 'Key': s3_key},
            ExpiresIn=expiration
        )
        return url
    except ClientError as e:
        print(f"Error generating presigned URL: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error generating presigned URL: {e}")
        return None
