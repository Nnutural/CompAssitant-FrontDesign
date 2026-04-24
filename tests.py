from playwright.sync_api import sync_playwright
from lxml import etree
from urllib.parse import urljoin

url = "https://www.cac.gov.cn/yaowen/wxyw/A093602index_1.htm"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(url)

    # 等 JS 执行完
    page.wait_for_timeout(3000)

    html = page.content()
    browser.close()

doc = etree.HTML(html)

links = doc.xpath('//a')

count = 0
for a in links:
    title = "".join(a.xpath(".//text()")).strip()
    href = a.xpath("./@href")

    if href and len(title) > 8:
        full_url = urljoin(url, href[0])
        print(title)
        print(full_url)

        count += 1
        if count >= 15:
            break
