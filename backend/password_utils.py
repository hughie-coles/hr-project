"""
Secure password hashing and verification utilities.

Uses bcrypt for password hashing, which is more secure than werkzeug's default
PBKDF2. Bcrypt automatically handles salting and uses a configurable cost factor.
"""
import bcrypt
from werkzeug.security import generate_password_hash as werkzeug_hash, check_password_hash as werkzeug_check


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt with a secure cost factor.
    
    Args:
        password: Plain text password to hash
        
    Returns:
        Hashed password string (bcrypt format)
    """
    if not password:
        raise ValueError("Password cannot be empty")
    
    # Generate salt and hash password with bcrypt
    # Cost factor of 12 is a good balance between security and performance
    # (higher = more secure but slower)
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(password: str, password_hash: str) -> bool:
    """
    Verify a password against a hash.
    
    Supports both bcrypt hashes (new) and werkzeug hashes (legacy compatibility).
    
    Args:
        password: Plain text password to verify
        password_hash: Stored password hash to verify against
        
    Returns:
        True if password matches, False otherwise
    """
    if not password or not password_hash:
        return False
    
    # Try bcrypt first (starts with $2a$, $2b$, or $2y$)
    if password_hash.startswith('$2'):
        try:
            return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
        except (ValueError, TypeError):
            # Invalid bcrypt hash format, fall through to werkzeug
            pass
    
    # Fall back to werkzeug for legacy hashes (pbkdf2:sha256)
    return werkzeug_check(password_hash, password)


def needs_rehash(password_hash: str) -> bool:
    """
    Check if a password hash needs to be rehashed (e.g., for legacy formats
    or when security requirements change).
    
    Args:
        password_hash: The stored password hash
        
    Returns:
        True if the hash should be rehashed, False otherwise
    """
    # Rehash if it's not a bcrypt hash (werkzeug legacy)
    if not password_hash.startswith('$2'):
        return True
    
    # Could also check bcrypt cost factor here if we want to upgrade
    # For now, any bcrypt hash is considered good
    return False
