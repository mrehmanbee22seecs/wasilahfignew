/**
 * Resources Hub Types
 */

export type ResourceType = 'article' | 'guide' | 'report';

export type ReportStatus = 'final' | 'draft' | 'sample';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown content
  tags: string[];
  sdgs: string[];
  readingTime: number; // in minutes
  publishedAt: string;
  slug: string;
  author: {
    name: string;
    avatar?: string;
  };
  coverImage?: string;
}

export interface CSRGuide {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileSize: string;
  fileType: 'pdf' | 'docx' | 'xlsx';
  updatedAt: string;
  tags: string[];
  sdgs: string[];
  coverImage?: string;
  tableOfContents?: string[];
}

export interface Report {
  id: string;
  title: string;
  projectName: string;
  sdgs: string[];
  period: string;
  status: ReportStatus;
  downloadUrl: string;
  tags: string[];
  reportingYear: number;
  sector: string;
  fileSize: string;
  publishedAt: string;
}

export interface FilterState {
  searchQuery: string;
  tags: string[];
  sdgs: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  year?: number;
  sector?: string;
  status?: ReportStatus[];
}

export interface ResourcesState {
  articles: Article[];
  guides: CSRGuide[];
  reports: Report[];
  filters: FilterState;
  loading: boolean;
  error: string | null;
}
