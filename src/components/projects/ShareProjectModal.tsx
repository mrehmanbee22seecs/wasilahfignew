import React, { useState } from 'react';
import { X, Link2, Mail, Copy, Facebook, Linkedin, CheckCircle } from 'lucide-react';

interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    title: string;
    slug: string;
  };
}

export function ShareProjectModal({ isOpen, onClose, project }: ShareProjectModalProps) {
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  if (!isOpen) return null;

  const projectUrl = `${window.location.origin}/projects/${project.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(projectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailShare = () => {
    if (!emailInput) {
      alert('Please enter an email address');
      return;
    }
    // In production, this would call an API to send email
    console.log('Send email to:', emailInput);
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
      setEmailInput('');
    }, 2000);
  };

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(projectUrl);
    const encodedTitle = encodeURIComponent(project.title);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-slate-200">
            <h3 className="text-slate-900">Share Project</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Project Title */}
            <div className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
              <p className="text-slate-900 font-medium">{project.title}</p>
              <p className="text-slate-600 text-sm mt-1">{projectUrl}</p>
            </div>

            {/* Copy Link */}
            <div>
              <label className="block text-slate-700 mb-2">Share Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={projectUrl}
                  readOnly
                  className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg bg-slate-50 text-slate-600 text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Email Share */}
            <div>
              <label className="block text-slate-700 mb-2">Share via Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="colleague@company.com"
                  className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
                <button
                  onClick={handleEmailShare}
                  disabled={emailSent}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {emailSent ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Sent
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <label className="block text-slate-700 mb-3">Share on Social Media</label>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSocialShare('facebook')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#0e62cc] transition-colors"
                >
                  <Facebook className="w-5 h-5" fill="currentColor" />
                  <span className="hidden sm:inline">Facebook</span>
                </button>
                <button
                  onClick={() => handleSocialShare('linkedin')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors"
                >
                  <Linkedin className="w-5 h-5" fill="currentColor" />
                  <span className="hidden sm:inline">LinkedIn</span>
                </button>
                <button
                  onClick={() => handleSocialShare('twitter')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="hidden sm:inline">X</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t-2 border-slate-200">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
