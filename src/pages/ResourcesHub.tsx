import React, { useState, useMemo } from 'react';
import { ResourceTabBar } from '../components/resources/ResourceTabBar';
import { SearchInput } from '../components/resources/SearchInput';
import { FilterDropdown } from '../components/resources/FilterDropdown';
import { ArticleCard, ArticleCardSkeleton } from '../components/resources/ArticleCard';
import { GuideCard, GuideCardSkeleton } from '../components/resources/GuideCard';
import { ReportRow, ReportRowSkeleton } from '../components/resources/ReportRow';
import { EmptyState } from '../components/resources/EmptyState';
import { ArticleDetailView } from '../components/resources/ArticleDetailView';
import { MOCK_ARTICLES, MOCK_GUIDES, MOCK_REPORTS, ALL_TAGS, ALL_SDGS, SECTORS } from '../data/mockResourcesData';
import type { Article, CSRGuide, Report, FilterState } from '../types/resources';

type TabId = 'articles' | 'guides' | 'reports';

export function ResourcesHub() {
  const [activeTab, setActiveTab] = useState<TabId>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSdgs, setSelectedSdgs] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Simulate loading when switching tabs
  const handleTabChange = (tab: TabId) => {
    setLoading(true);
    setActiveTab(tab);
    setTimeout(() => setLoading(false), 500);
  };

  // Filter function
  const filterResources = <T extends Article | CSRGuide | Report>(
    resources: T[],
    type: 'article' | 'guide' | 'report'
  ): T[] => {
    return resources.filter((resource) => {
      // Search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesTitle = resource.title.toLowerCase().includes(searchLower);
        const matchesDescription = 
          ('excerpt' in resource && resource.excerpt.toLowerCase().includes(searchLower)) ||
          ('description' in resource && resource.description.toLowerCase().includes(searchLower));
        const matchesProject = 
          type === 'report' && 'projectName' in resource && resource.projectName.toLowerCase().includes(searchLower);
        
        if (!matchesTitle && !matchesDescription && !matchesProject) return false;
      }

      // Tags
      if (selectedTags.length > 0) {
        const hasTag = selectedTags.some(tag => resource.tags.includes(tag));
        if (!hasTag) return false;
      }

      // SDGs
      if (selectedSdgs.length > 0) {
        const hasSdg = selectedSdgs.some(sdg => resource.sdgs.includes(sdg));
        if (!hasSdg) return false;
      }

      // Sectors (reports only)
      if (type === 'report' && selectedSectors.length > 0) {
        const report = resource as Report;
        if (!selectedSectors.includes(report.sector)) return false;
      }

      // Year (reports only)
      if (type === 'report' && selectedYear) {
        const report = resource as Report;
        if (report.reportingYear !== selectedYear) return false;
      }

      return true;
    });
  };

  // Filtered data
  const filteredArticles = useMemo(() => filterResources(MOCK_ARTICLES, 'article'), [
    searchQuery, selectedTags, selectedSdgs
  ]);

  const filteredGuides = useMemo(() => filterResources(MOCK_GUIDES, 'guide'), [
    searchQuery, selectedTags, selectedSdgs
  ]);

  const filteredReports = useMemo(() => filterResources(MOCK_REPORTS, 'report'), [
    searchQuery, selectedTags, selectedSdgs, selectedSectors, selectedYear
  ]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedSdgs([]);
    setSelectedSectors([]);
    setSelectedYear(undefined);
  };

  const tabs = [
    { id: 'articles' as TabId, label: 'Articles', count: filteredArticles.length },
    { id: 'guides' as TabId, label: 'CSR Guides', count: filteredGuides.length },
    { id: 'reports' as TabId, label: 'Reports', count: filteredReports.length }
  ];

  const availableYears = useMemo(() => {
    const years = [...new Set(MOCK_REPORTS.map(r => r.reportingYear))];
    return years.sort((a, b) => b - a);
  }, []);

  const getRelatedArticles = (article: Article): Article[] => {
    return MOCK_ARTICLES
      .filter(a => a.id !== article.id)
      .filter(a => {
        const sharedTags = a.tags.some(tag => article.tags.includes(tag));
        const sharedSdgs = a.sdgs.some(sdg => article.sdgs.includes(sdg));
        return sharedTags || sharedSdgs;
      })
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-slate-900 mb-3">Resources</h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Guides, insights, and impact documentation to help you run credible CSR programs
          </p>
        </div>
      </div>

      {/* Tab Bar */}
      <ResourceTabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabs}
      />

      {/* Controls */}
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                loading={loading}
              />
            </div>
            <FilterDropdown
              tags={ALL_TAGS}
              sdgs={ALL_SDGS}
              selectedTags={selectedTags}
              selectedSdgs={selectedSdgs}
              onTagsChange={setSelectedTags}
              onSdgsChange={setSelectedSdgs}
              onClearAll={handleClearFilters}
              sectors={activeTab === 'reports' ? SECTORS : undefined}
              selectedSectors={selectedSectors}
              onSectorsChange={activeTab === 'reports' ? setSelectedSectors : undefined}
              years={activeTab === 'reports' ? availableYears : undefined}
              selectedYear={selectedYear}
              onYearChange={activeTab === 'reports' ? setSelectedYear : undefined}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div
            role="tabpanel"
            id="articles-panel"
            aria-labelledby="articles-tab"
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredArticles.length === 0 ? (
              <EmptyState
                title="No articles found"
                description="Try adjusting your filters or search query"
                action={{
                  label: 'Clear filters',
                  onClick: handleClearFilters
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onClick={() => setSelectedArticle(article)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Guides Tab */}
        {activeTab === 'guides' && (
          <div
            role="tabpanel"
            id="guides-panel"
            aria-labelledby="guides-tab"
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <GuideCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredGuides.length === 0 ? (
              <EmptyState
                title="No guides found"
                description="Try adjusting your filters or search query"
                action={{
                  label: 'Clear filters',
                  onClick: handleClearFilters
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div
            role="tabpanel"
            id="reports-panel"
            aria-labelledby="reports-tab"
          >
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <ReportRowSkeleton key={i} />
                ))}
              </div>
            ) : filteredReports.length === 0 ? (
              <EmptyState
                title="No reports found"
                description="Try adjusting your filters or search query"
                action={{
                  label: 'Clear filters',
                  onClick: handleClearFilters
                }}
              />
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  {filteredReports.map((report) => (
                    <ReportRow key={report.id} report={report} />
                  ))}
                </div>

                {/* Request Custom Report CTA */}
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
                  <h3 className="text-xl text-slate-900 mb-2">Need a custom report?</h3>
                  <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                    Contact our team to request tailored impact reports for your CSR programs
                  </p>
                  <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium">
                    Request Custom Report
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Article Detail View */}
      {selectedArticle && (
        <ArticleDetailView
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          relatedArticles={getRelatedArticles(selectedArticle)}
        />
      )}
    </div>
  );
}
