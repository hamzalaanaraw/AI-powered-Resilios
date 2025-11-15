def test_import_app():
    # Smoke test: import app and ensure routes exist
    from app import app
    routes = list(app.routes)
    assert len(routes) >= 8

def test_chat_store_basic():
    from chat_store import add_message, get_history
    user = 'ci-test-user'
    add_message(user, 'user', 'ci test')
    h = get_history(user, limit=5)
    assert isinstance(h, list)
