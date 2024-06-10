import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

import config

# Create an engine for the test database
engine = create_engine(config.TEST_DATABASE_URL)

# Create a session factory for testing
SessionTesting = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a regular session factory for local use
Local = sessionmaker(engine)

# Create a base class for declarative data models
Base = declarative_base()


@pytest.fixture(scope="session")
def database_engine():
    """Fixture for providing the test database engine."""
    Base.metadata.create_all(bind=engine)
    yield engine


@pytest.fixture(scope="function")
def get_test_db(database_engine):
    """Fixture for providing a test database session for each test function."""
    try:
        connection = database_engine.connect()
        transaction = connection.begin()
        session = SessionTesting(bind=connection)
        yield session  # Provide the session to the test functions.
    finally:
        session.close()
        transaction.rollback()
        connection.close()
