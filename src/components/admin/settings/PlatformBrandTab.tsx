import React, { useState } from 'react';
import { Palette, Upload, Save, Globe, Type, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type BrandSettings = {
  platformName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  faviconUrl: string;
  supportEmail: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
};

export function PlatformBrandTab() {
  const [settings, setSettings] = useState<BrandSettings>({
    platformName: 'Wasilah',
    tagline: 'Connecting Purpose with Impact',
    primaryColor: '#1e40af',
    secondaryColor: '#059669',
    accentColor: '#0891b2',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    supportEmail: 'support@wasilah.pk',
    socialLinks: {
      facebook: 'https://facebook.com/wasilah',
      twitter: 'https://twitter.com/wasilah',
      linkedin: 'https://linkedin.com/company/wasilah',
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof BrandSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.success('Platform branding updated successfully');
      setHasChanges(false);
      console.log('Branding saved:', settings);
      // In production: PATCH to /admin/settings/branding
    } catch (error) {
      console.error('Error saving branding:', error);
      toast.error('Failed to save branding settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (type: 'logo' | 'favicon') => {
    toast.info(`Upload ${type} - Coming soon`);
    // In production: implement file upload
  };

  return (
    <div className="space-y-6">
      {/* Platform Identity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900">Platform Identity</h3>
            <p className="text-sm text-gray-600 mt-1">
              Configure your platform's name and messaging
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Platform Name</label>
            <input
              type="text"
              value={settings.platformName}
              onChange={(e) => handleChange('platformName', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => handleChange('supportEmail', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Brand Colors */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900">Brand Colors</h3>
            <p className="text-sm text-gray-600 mt-1">
              Customize the color scheme across the platform
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Primary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Secondary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => handleChange('secondaryColor', e.target.value)}
                className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={settings.secondaryColor}
                onChange={(e) => handleChange('secondaryColor', e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Accent Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => handleChange('accentColor', e.target.value)}
                className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={settings.accentColor}
                onChange={(e) => handleChange('accentColor', e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Color Preview */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">Preview:</p>
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-lg border border-gray-200"
              style={{ backgroundColor: settings.primaryColor }}
            />
            <div
              className="w-16 h-16 rounded-lg border border-gray-200"
              style={{ backgroundColor: settings.secondaryColor }}
            />
            <div
              className="w-16 h-16 rounded-lg border border-gray-200"
              style={{ backgroundColor: settings.accentColor }}
            />
          </div>
        </div>
      </div>

      {/* Logo & Favicon */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900">Logo & Favicon</h3>
            <p className="text-sm text-gray-600 mt-1">
              Upload your brand assets
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Platform Logo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <button
                onClick={() => handleFileUpload('logo')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Upload Logo
              </button>
              <p className="text-xs text-gray-500 mt-1">SVG, PNG (max 2MB)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Favicon</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <button
                onClick={() => handleFileUpload('favicon')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Upload Favicon
              </button>
              <p className="text-xs text-gray-500 mt-1">ICO, PNG 32x32</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-pink-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900">Social Links</h3>
            <p className="text-sm text-gray-600 mt-1">
              Connect your social media profiles
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {['facebook', 'twitter', 'linkedin', 'instagram'].map((platform) => (
            <div key={platform}>
              <label className="block text-sm text-gray-700 mb-1 capitalize">
                {platform}
              </label>
              <input
                type="url"
                value={settings.socialLinks[platform as keyof typeof settings.socialLinks] || ''}
                onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                placeholder={`https://${platform}.com/yourpage`}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
