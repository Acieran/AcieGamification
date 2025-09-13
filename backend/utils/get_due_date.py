from datetime import datetime, timedelta


def get_midnight_in_days(days: int = 1):
    """Returns tomorrow's date at 00:00 (midnight)"""
    today = datetime.now()
    tomorrow = today + timedelta(days=days)
    return tomorrow.replace(hour=0, minute=0, second=0, microsecond=0)


def get_today_midnight():
    """Returns today's date at 00:00 (midnight)"""
    today = datetime.now()
    return today.replace(hour=0, minute=0, second=0, microsecond=0)
