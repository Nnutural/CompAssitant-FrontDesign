from typing import Any, Literal

from pydantic import BaseModel, Field

ResearchItemType = Literal["fund", "news", "innovation", "paper", "patent", "lab"]


class EvidenceSource(BaseModel):
    title: str
    url: str
    source_type: str
    updated_at: str


class BaseResearchItem(BaseModel):
    id: str
    evidence_sources: list[EvidenceSource]
    updated_at: str


class FundItem(BaseResearchItem):
    title: str
    source: str
    level: str
    amount: str
    deadline: str
    direction: str
    match_score: int = Field(ge=0, le=100)
    tags: list[str]
    summary: str
    requirements: list[str]
    recommendation_reason: str
    favorited: bool = False
    subscribed: bool = False
    compared: bool = False


class NewsItem(BaseResearchItem):
    title: str
    source: str
    source_type: str
    published_at: str
    summary: str
    url: str
    tags: list[str]
    read: bool = False
    favorited: bool = False


class InnovationItem(BaseResearchItem):
    title: str
    direction: str
    growth: int
    window: str
    representative_papers: list[str]
    representative_teams: list[str]
    engineering_difficulty: str
    academic_value: str
    summary: str
    recommendation_reason: str


class PaperItem(BaseResearchItem):
    title: str
    venue: str
    year: int
    authors: list[str]
    citation_count: int
    abstract: str
    reading_guide: str
    doi_url: str | None = None
    pdf_url: str | None = None
    tags: list[str]
    favorited: bool = False
    in_reading_list: bool = False
    compared: bool = False


class LegalTimelineEntry(BaseModel):
    date: str
    status: str
    description: str


class PatentItem(BaseResearchItem):
    title: str
    patent_no: str
    status: str
    applicant: str
    direction: str
    legal_timeline: list[LegalTimelineEntry]
    abstract: str
    similarity_hint: str
    favorited: bool = False
    compared: bool = False


class LabItem(BaseResearchItem):
    id: str
    name: str
    institution: str
    region: str
    topics: list[str]
    mentor: str
    requirements: list[str]
    deadline: str
    contact: str
    cooperation_cases: list[str]
    datasets_or_code_links: list[str]
    favorited: bool = False
    subscribed: bool = False
    compared: bool = False


class ToggleRequest(BaseModel):
    item_type: ResearchItemType
    item_id: str


class ToggleResponse(BaseModel):
    item_id: str
    favorited: bool | None = None
    subscribed: bool | None = None
    compared: bool | None = None
    read: bool | None = None
    in_reading_list: bool | None = None


class CompareItem(BaseModel):
    item_type: ResearchItemType
    item_id: str
    title: str
    source: str
    deadline_or_year: str
    metric_label: str
    metric_value: str
    recommendation_reason: str


class DetailResponse(BaseModel):
    item_type: ResearchItemType
    item: dict[str, Any]
