# ============================================================
# backend/tests/test_api.py
# ============================================================
"""
API端点测试
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    """测试根路径"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_health_check():
    """测试健康检查"""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "embedding_model" in data

def test_upload_invalid_file():
    """测试上传无效文件"""
    files = {"file": ("test.xyz", b"test content", "text/plain")}
    response = client.post("/api/v1/upload", files=files)
    assert response.status_code == 400

def test_query_without_documents():
    """测试没有文档时的查询"""
    response = client.post(
        "/api/v1/query",
        json={"question": "测试问题", "top_k": 3}
    )
    # 即使没有文档，API也应该正常响应
    assert response.status_code == 200