import React, { useState } from 'react';
import { Cookie, Settings, BarChart, Shield, Check, X, ArrowLeft } from 'lucide-react';
import { BRAND } from '../../constants/brand';

interface CookiePolicyPageProps {
  onBack?: () => void;
}

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export function CookiePolicyPage({ onBack }: CookiePolicyPageProps) {
  const lastUpdated = 'February 1, 2026';
  
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always required
    analytics: true,
    marketing: false,
    preferences: true,
  });
  
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const handleSavePreferences = () => {
    // In a real app, this would save to localStorage/cookies
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const cookieTypes = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      icon: Shield,
      required: true,
      description: 'These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as logging in or filling in forms.',
      examples: ['Session management', 'Authentication', 'Security tokens', 'Load balancing']
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      icon: BarChart,
      required: false,
      description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us understand which pages are the most and least popular.',
      examples: ['Page view tracking', 'User journey analysis', 'Feature usage stats', 'Error monitoring']
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      icon: Cookie,
      required: false,
      description: 'These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests and show you relevant adverts on other sites.',
      examples: ['Remarketing', 'Social media integration', 'Ad personalization', 'Campaign tracking']
    },
    {
      id: 'preferences',
      title: 'Preference Cookies',
      icon: Settings,
      required: false,
      description: 'These cookies enable the website to provide enhanced functionality and personalization based on your preferences, such as language settings and display options.',
      examples: ['Language preferences', 'Theme settings', 'Display preferences', 'Timezone settings']
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: BRAND.creamLight }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-8 text-sm font-medium transition-colors"
            style={{ color: BRAND.navy }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            <Cookie className="w-4 h-4" />
            Legal Document
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: BRAND.navy }}>
            Cookie Policy
          </h1>
          <p className="text-gray-600">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <div 
          className="bg-white rounded-xl p-8 mb-8 border"
          style={{ borderColor: `${BRAND.navy}15` }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: BRAND.navy }}>
            What are Cookies?
          </h2>
          <p className="mb-4" style={{ color: BRAND.gray600 }}>
            Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
            They are widely used to make websites work more efficiently and provide information to website owners.
          </p>
          <p style={{ color: BRAND.gray600 }}>
            We use cookies to enhance your experience on our platform, remember your preferences, 
            and understand how you use our services so we can improve them.
          </p>
        </div>

        {/* Cookie Types & Settings */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold" style={{ color: BRAND.navy }}>
            Cookie Settings
          </h2>
          <p style={{ color: BRAND.gray600 }}>
            You can customize your cookie preferences below. Essential cookies cannot be disabled as they are required for the website to function.
          </p>

          {cookieTypes.map((cookie) => {
            const Icon = cookie.icon;
            const isEnabled = preferences[cookie.id as keyof CookiePreferences];
            
            return (
              <div 
                key={cookie.id}
                className="bg-white rounded-xl p-6 border"
                style={{ borderColor: `${BRAND.navy}15` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${BRAND.teal}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: BRAND.teal }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold" style={{ color: BRAND.navy }}>
                          {cookie.title}
                        </h3>
                        {cookie.required && (
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${BRAND.navy}10`, color: BRAND.navy }}
                          >
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-3" style={{ color: BRAND.gray600 }}>
                        {cookie.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cookie.examples.map((example) => (
                          <span 
                            key={example}
                            className="text-xs px-2 py-1 rounded-full"
                            style={{ backgroundColor: BRAND.cream, color: BRAND.gray600 }}
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Toggle */}
                  <button
                    onClick={() => {
                      if (!cookie.required) {
                        setPreferences(prev => ({
                          ...prev,
                          [cookie.id]: !prev[cookie.id as keyof CookiePreferences]
                        }));
                      }
                    }}
                    disabled={cookie.required}
                    className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${
                      cookie.required ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                    }`}
                    style={{ 
                      backgroundColor: isEnabled ? BRAND.teal : '#D1D5DB'
                    }}
                    aria-label={`Toggle ${cookie.title}`}
                  >
                    <span 
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                        isEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    >
                      {isEnabled ? (
                        <Check className="w-4 h-4 m-1" style={{ color: BRAND.teal }} />
                      ) : (
                        <X className="w-4 h-4 m-1 text-gray-400" />
                      )}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={handleSavePreferences}
            className="px-8 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: BRAND.navy }}
          >
            Save Cookie Preferences
          </button>
          
          {showSavedMessage && (
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ backgroundColor: `${BRAND.teal}15`, color: BRAND.teal }}
            >
              <Check className="w-4 h-4" />
              Preferences saved!
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div 
          className="bg-white rounded-xl p-8 border"
          style={{ borderColor: `${BRAND.navy}15` }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: BRAND.navy }}>
            Managing Cookies in Your Browser
          </h2>
          <p className="mb-4" style={{ color: BRAND.gray600 }}>
            Most web browsers allow you to manage cookies through their settings. You can usually find these settings 
            in the "Options" or "Preferences" menu of your browser.
          </p>
          <p style={{ color: BRAND.gray600 }}>
            Please note that disabling certain cookies may affect the functionality of our website and your ability 
            to use certain features.
          </p>
        </div>

        {/* Contact */}
        <div className="mt-8 text-center text-sm" style={{ color: BRAND.gray500 }}>
          <p>
            For questions about our use of cookies, please contact us at{' '}
            <a 
              href="mailto:privacy@wasilah.pk" 
              className="underline"
              style={{ color: BRAND.teal }}
            >
              privacy@wasilah.pk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
