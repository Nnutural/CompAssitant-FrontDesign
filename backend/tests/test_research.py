from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_list_research_funds() -> None:
    response = client.get("/api/v1/research/funds?direction=AI%20安全")

    assert response.status_code == 200
    data = response.json()
    assert data
    assert data[0]["evidence_sources"][0]["updated_at"]
    assert "CN2025XXXXXX" not in str(data)


def test_toggle_compare_and_read_compare_items() -> None:
    payload = {"item_type": "fund", "item_id": "fund-edu-industry"}
    toggle_response = client.post("/api/v1/research/compare/toggle", json=payload)

    assert toggle_response.status_code == 200
    assert toggle_response.json()["compared"] is True

    compare_response = client.get("/api/v1/research/compare")
    assert compare_response.status_code == 200
    assert any(item["item_id"] == "fund-edu-industry" for item in compare_response.json())


def test_get_research_detail() -> None:
    response = client.get("/api/v1/research/items/paper/paper-jailbreak-chain")

    assert response.status_code == 200
    data = response.json()
    assert data["item_type"] == "paper"
    assert data["item"]["doi_url"]
