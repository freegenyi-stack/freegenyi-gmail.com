import uvicorn
import os
import sys

# Add the project root to sys.path to allow imports from apps.api
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../")))

from apps.api.src.main.app import create_app

from apps.api.src.infrastructure.persistence.database import create_db_and_tables
create_db_and_tables()
app = create_app()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
