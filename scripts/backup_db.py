import os
import shutil
import sqlite3
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'prisma', 'cms.db')
BACKUP_DIR = os.path.join(os.path.dirname(__file__), '..', 'prisma', 'backups')

def backup_database():
    if not os.path.exists(DB_PATH):
        print(f"Error: Database file not found at {DB_PATH}")
        return False

    os.makedirs(BACKUP_DIR, exist_ok=True)

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = os.path.join(BACKUP_DIR, f"cms_backup_{timestamp}.db")
    master_backup = os.path.join(BACKUP_DIR, "cms_master_latest.db")

    # Perform safe SQLite online backup
    try:
        src = sqlite3.connect(DB_PATH)
        dst = sqlite3.connect(backup_file)
        with dst:
            src.backup(dst)
        dst.close()
        src.close()

        # Copy to master_latest
        shutil.copy2(backup_file, master_backup)
        print(f"[SUCCESS] Database backed up successfully to: {backup_file}")
        return True
    except Exception as e:
        print(f"Backup error: {e}")
        return False

if __name__ == '__main__':
    backup_database()
