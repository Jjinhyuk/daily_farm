import logging
from pathlib import Path
from typing import Any, Dict

import emails
from emails.template import JinjaTemplate

from app.core.config import settings

def send_email(
    email_to: str,
    subject_template: str = "",
    html_template: str = "",
    environment: Dict[str, Any] = {},
) -> None:
    """
    Send email using configured SMTP server.
    For development, we'll just log the email content.
    """
    # For development, just log the email
    logging.info(f"Would send email to {email_to}")
    logging.info(f"Subject: {subject_template}")
    logging.info(f"Content: {html_template}")
    logging.info(f"Variables: {environment}")

def send_reset_password_email(email_to: str, email: str, token: str) -> None:
    """
    Send password reset email with token.
    """
    subject = f"Password recovery for {email}"
    
    # For development, using simple text template
    html_template = f"""
    <p>Password Reset</p>
    <p>To reset your password, click the following link:</p>
    <p><a href="http://localhost:3000/auth/reset-password?token={token}">
        Reset Password
    </a></p>
    <p>If you didn't request this, please ignore this email.</p>
    """
    
    send_email(
        email_to=email_to,
        subject_template=subject,
        html_template=html_template,
        environment={
            "project_name": "Daily Farm",
            "email": email,
            "valid_hours": 24,
        },
    ) 