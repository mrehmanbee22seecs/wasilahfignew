import React, { useState, useRef, useEffect } from 'react';
import { ImpactHero } from '../components/impact/ImpactHero';
import { CaseStudyCard, CaseStudyCardSkeleton } from '../components/impact/CaseStudyCard';
import { CaseStudyDetailModal } from '../components/impact/CaseStudyDetailModal';
import { ImpactReportModal } from '../components/impact/ImpactReportModal';
import { TestimonialsCarousel } from '../components/impact/TestimonialsCarousel';
import { LogoGrid } from '../components/impact/LogoGrid';
import { CASE_STUDIES, TESTIMONIALS, TRUST_LOGOS } from '../data/mockImpactData';
import type { CaseStudy } from '../types/impact';
import { FileDown, Sparkles } from 'lucide-react';

export function ImpactPage() {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const caseStudiesRef = useRef<HTMLDivElement>(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const scrollToCaseStudies = () => {
    caseStudiesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDownloadReport = () => {
    console.log('Downloading impact report...');
    // Simulate download
    const link = document.createElement('a');
    link.href = '/sample-impact-report.pdf';
    link.download = 'wasilah-sample-impact-report.pdf';
    link.click();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <ImpactHero
        onViewCaseStudies={scrollToCaseStudies}
        onDownloadSample={() => setShowReportModal(true)}
      />

      {/* Case Studies Grid */}
      <section ref={caseStudiesRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-slate-900 text-3xl md:text-4xl mb-3">
              Proven Impact, Verified Results
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Real case studies from corporate partners who trusted Wasilah to deliver measurable, 
              SDG-aligned social impact across Pakistan.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <>
                <CaseStudyCardSkeleton />
                <CaseStudyCardSkeleton />
                <CaseStudyCardSkeleton />
                <CaseStudyCardSkeleton />
                <CaseStudyCardSkeleton />
                <CaseStudyCardSkeleton />
              </>
            ) : (
              CASE_STUDIES.map((caseStudy) => (
                <CaseStudyCard
                  key={caseStudy.id}
                  caseStudy={caseStudy}
                  onClick={() => setSelectedCaseStudy(caseStudy)}
                />
              ))
            )}
          </div>

          {/* Pilot Programs Note */}
          <div className="mt-12 p-6 bg-violet-50 border-2 border-violet-200 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-violet-100 text-violet-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-violet-900 mb-2">
                  Pilot Programs Welcome
                </h3>
                <p className="text-violet-800 text-sm leading-relaxed">
                  New to CSR? We offer structured pilot programs with reduced scope and budget, 
                  allowing you to test impact, measure results, and build internal buy-in before scaling. 
                  Full impact reports included — even for pilots.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-slate-900 text-3xl md:text-4xl mb-3">
              What Corporate Partners Say
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Testimonials from CSR leaders who've worked with Wasilah
            </p>
          </div>

          <TestimonialsCarousel testimonials={TESTIMONIALS} />
        </div>
      </section>

      {/* Trust Logos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <LogoGrid
            logos={TRUST_LOGOS}
            title="Trusted By Leading Organizations"
            subtitle="Corporate partners, NGOs, and universities working together to create measurable social impact"
          />
        </div>
      </section>

      {/* Impact Methodology Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-slate-900 text-3xl md:text-4xl mb-3">
              How We Measure Impact
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Transparent, rigorous methodology that stands up to board-level scrutiny
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Methodology Cards */}
            <div className="bg-white rounded-xl p-8 border-2 border-slate-200 hover:border-teal-300 transition-all">
              <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-slate-900 text-lg mb-3">
                Baseline Assessment
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pre-project data collection establishing measurable starting points for all KPIs. 
                Independent verification by NGO partners ensures credibility.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border-2 border-slate-200 hover:border-teal-300 transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-slate-900 text-lg mb-3">
                Continuous Monitoring
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Real-time tracking through our dashboard with photo documentation, 
                volunteer timesheets, and milestone completion verified by all stakeholders.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border-2 border-slate-200 hover:border-teal-300 transition-all">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-slate-900 text-lg mb-3">
                Third-Party Validation
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Post-project impact assessment with NGO sign-off on all outcomes. 
                Optional external audit available for high-stakes reporting requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-white text-3xl md:text-4xl mb-4">
            Ready to Create Measurable Impact?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Download our sample impact report or schedule a consultation to discuss your CSR goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowReportModal(true)}
              className="px-8 py-4 bg-white text-teal-700 rounded-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <FileDown className="w-5 h-5" />
              Download Sample Report
            </button>
            <button className="px-8 py-4 bg-teal-800 text-white rounded-lg hover:bg-teal-900 transition-all">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Modals */}
      {selectedCaseStudy && (
        <CaseStudyDetailModal
          caseStudy={selectedCaseStudy}
          onClose={() => setSelectedCaseStudy(null)}
          onDownloadReport={handleDownloadReport}
          onViewSampleReport={() => {
            setSelectedCaseStudy(null);
            setShowReportModal(true);
          }}
        />
      )}

      {showReportModal && (
        <ImpactReportModal
          onClose={() => setShowReportModal(false)}
          onDownload={handleDownloadReport}
        />
      )}
    </div>
  );
}
