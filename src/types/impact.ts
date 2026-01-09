export interface MediaItem {
  id: string;
  url: string;
  caption: string;
  timestamp?: string;
  type: 'image' | 'video';
}

export interface KPI {
  label: string;
  value: string;
  icon?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  location: string;
  year: number;
  duration: string;
  sdgs: number[];
  heroImage: string;
  corporatePartner: {
    name: string;
    logo?: string;
  };
  kpiSnippet: string;
  kpis: KPI[];
  problem: string;
  approach: string;
  outcomes: string[];
  ngoPartner?: string;
  media: MediaItem[];
  reportPdfUrl: string;
  isPilot?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  designation: string;
  organization: string;
  isPilot?: boolean;
  avatar?: string;
}

export interface TrustLogo {
  id: string;
  name: string;
  logo: string;
  type: 'corporate' | 'ngo' | 'university';
}
