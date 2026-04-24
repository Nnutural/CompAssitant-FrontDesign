from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from urllib.parse import urljoin

router = APIRouter()


class PolicyItem(BaseModel):
    title: str
    url: str


class PolicyResponse(BaseModel):
    items: List[PolicyItem]


def fetch_page(url: str) -> str:
    try:
        import requests

        r = requests.get(url, timeout=5)
        return r.text
    except Exception:
        return ""


def parse_policies(html: str, base_url: str) -> List[PolicyItem]:
    from lxml import etree

    items = []
    if not html:
        return items
    try:
        doc = etree.HTML(html)
    except Exception:
        return items
    for a in doc.xpath("//a")[:15]:
        title = "".join(a.xpath(".//text()")).strip()
        href = a.xpath("./@href")
        if href and len(title) > 8:
            items.append(PolicyItem(title=title, url=urljoin(base_url, href[0])))
            if len(items) >= 15:
                break
    return items
    doc = etree.HTML(html)
    for a in doc.xpath("//a")[:15]:
        title = "".join(a.xpath(".//text()")).strip()
        href = a.xpath("./@href")
        if href and len(title) > 8:
            items.append(PolicyItem(title=title, url=urljoin(base_url, href[0])))
            if len(items) >= 15:
                break
    return items


@router.get("/policies", response_model=PolicyResponse)
def fetch_policies() -> PolicyResponse:
    url = "https://www.cac.gov.cn/yaowen/wxyw/A093602index_1.htm"
    html = fetch_page(url)
    items = parse_policies(html, url)
    return PolicyResponse(items=items)
