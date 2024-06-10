import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

import config

engine = create_engine(config.TEST_DATABASE_URL)
SessionTesting = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)  # now we create test-session
Local = sessionmaker(engine)

Base = declarative_base()


@pytest.fixture(scope="session")
def database_engine():
    Base.metadata.create_all(bind=engine)
    yield engine


@pytest.fixture(scope="function")
def get_test_db(database_engine):
    try:
        connection = database_engine.connect()
        transaction = connection.begin()
        session = SessionTesting(bind=connection)
        yield session  # use the session in tests.
    finally:
        session.close()
        transaction.rollback()
        connection.close()
