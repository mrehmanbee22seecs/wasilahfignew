import React, { useState } from 'react';
import { Edit, Globe, Facebook, Twitter, Linkedin, Instagram, MapPin, Mail, Phone, User, CheckCircle, AlertCircle, X } from 'lucide-react';
import { VerificationTimeline } from '../VerificationTimeline';
import type { NGO, VettingAudit, VerificationStatus } from '../../../types/ngo';
import { toast } from 'sonner@2.0.3';

interface ProfileVerificationTabProps {
  ngo: NGO;
  timeline: VettingAudit[];
  currentStatus: VerificationStatus;
  onRequestVerification?: () => void;
}

export function ProfileVerificationTab({ 
  ngo, 
  timeline, 
  currentStatus,
  onRequestVerification 
}: ProfileVerificationTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedNGO, setEditedNGO] = useState(ngo);

  // Calculate profile completeness
  const calculateCompleteness = () => {
    const fields = [
      { name: 'Logo', value: ngo.logo_url, required: false },
      { name: 'Organization Name', value: ngo.name, required: true },
      { name: 'Mission Statement', value: ngo.mission, required: true },
      { name: 'Website', value: ngo.website, required: false },
      { name: 'Primary Contact Name', value: ngo.primary_contact?.name, required: true },
      { name: 'Primary Contact Email', value: ngo.primary_contact?.email, required: true },
      { name: 'Primary Contact Phone', value: ngo.primary_contact?.phone, required: true },
      { name: 'Street Address', value: ngo.address?.street, required: false },
      { name: 'City', value: ngo.address?.city, required: true },
      { name: 'Province', value: ngo.address?.province, required: true },
      { name: 'Country', value: ngo.address?.country, required: true },
      { name: 'Postal Code', value: ngo.address?.postal_code, required: false },
      { name: 'Facebook', value: ngo.social_links?.facebook, required: false },
      { name: 'Twitter', value: ngo.social_links?.twitter, required: false },
      { name: 'LinkedIn', value: ngo.social_links?.linkedin, required: false },
      { name: 'Instagram', value: ngo.social_links?.instagram, required: false }
    ];

    const requiredFields = fields.filter(f => f.required);
    const optionalFields = fields.filter(f => !f.required);
    
    const completedRequired = requiredFields.filter(f => f.value && f.value.trim() !== '').length;
    const completedOptional = optionalFields.filter(f => f.value && f.value.trim() !== '').length;
    
    const totalFields = fields.length;
    const completedFields = completedRequired + completedOptional;
    
    const percentage = Math.round((completedFields / totalFields) * 100);
    
    const incomplete = requiredFields.filter(f => !f.value || f.value.trim() === '');
    
    return {
      percentage,
      completedRequired,
      totalRequired: requiredFields.length,
      completedOptional,
      totalOptional: optionalFields.length,
      incompleteRequired: incomplete
    };
  };

  const completeness = calculateCompleteness();

  const handleEdit = () => {
    setEditedNGO(ngo);
    setShowEditModal(true);
  };

  const handleSave = () => {
    setShowEditModal(false);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setEditedNGO(ngo);
    setShowEditModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Profile Completeness */}
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-slate-900 mb-1">Profile Completeness</h3>
            <p className="text-sm text-slate-600">
              Complete your profile to improve visibility and verification chances
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl text-slate-900 font-semibold">{completeness.percentage}%</div>
            <div className="text-xs text-slate-500">
              {completeness.completedRequired}/{completeness.totalRequired} required
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              completeness.percentage === 100 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                : completeness.percentage >= 70 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-600'
            }`}
            style={{ width: `${completeness.percentage}%` }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-600">
              {completeness.completedRequired} of {completeness.totalRequired} required fields
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="text-slate-600">
              {completeness.completedOptional} of {completeness.totalOptional} optional fields
            </span>
          </div>
        </div>

        {/* Incomplete Fields Alert */}
        {completeness.incompleteRequired.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 border-2 border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-amber-900 font-medium mb-1">
                  Required fields incomplete
                </p>
                <p className="text-xs text-amber-700">
                  Please complete: {completeness.incompleteRequired.map(f => f.name).join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Organization Profile */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-900">Organization Profile</h2>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        <div className="bg-white rounded-xl border-2 border-slate-200 p-6 space-y-6">
          {/* Logo & Name */}
          <div className="flex items-start gap-6">
            {ngo.logo_url && (
              <img
                src={ngo.logo_url}
                alt={ngo.name}
                className="w-24 h-24 rounded-xl object-cover border-2 border-slate-200"
              />
            )}
            <div className="flex-1">
              <h3 className="text-2xl text-slate-900 mb-2">{ngo.name}</h3>
              <p className="text-slate-600">{ngo.mission}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t-2 border-slate-100">
            <div>
              <h4 className="text-sm text-slate-700 mb-3">Primary Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-900">{ngo.primary_contact.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a href={`mailto:${ngo.primary_contact.email}`} className="text-sm text-indigo-600 hover:text-indigo-700">
                    {ngo.primary_contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-900">{ngo.primary_contact.phone}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-slate-700 mb-3">Address</h4>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-900">
                  {ngo.address.street && <p>{ngo.address.street}</p>}
                  <p>{ngo.address.city}, {ngo.address.province}</p>
                  <p>{ngo.address.country}</p>
                  {ngo.address.postal_code && <p>{ngo.address.postal_code}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Website & Social Links */}
          {(ngo.website || ngo.social_links) && (
            <div className="pt-6 border-t-2 border-slate-100">
              <h4 className="text-sm text-slate-700 mb-3">Online Presence</h4>
              <div className="flex flex-wrap gap-3">
                {ngo.website && (
                  <a
                    href={ngo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg transition-colors text-sm"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
                {ngo.social_links?.facebook && (
                  <a
                    href={ngo.social_links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg transition-colors text-sm"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>
                )}
                {ngo.social_links?.twitter && (
                  <a
                    href={ngo.social_links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-lg transition-colors text-sm"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                )}
                {ngo.social_links?.linkedin && (
                  <a
                    href={ngo.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg transition-colors text-sm"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {ngo.social_links?.instagram && (
                  <a
                    href={ngo.social_links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-pink-50 text-slate-700 hover:text-pink-700 rounded-lg transition-colors text-sm"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Timeline */}
      <div>
        <VerificationTimeline 
          timeline={timeline}
          currentStatus={currentStatus}
        />
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-slate-900">Edit Organization Profile</h3>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-sm text-slate-700 mb-3">Basic Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">
                      Organization Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editedNGO.name}
                      onChange={(e) => setEditedNGO({ ...editedNGO, name: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">
                      Mission Statement <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      value={editedNGO.mission}
                      onChange={(e) => setEditedNGO({ ...editedNGO, mission: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                      rows={3}
                      placeholder="Describe your organization's mission"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={editedNGO.website || ''}
                      onChange={(e) => setEditedNGO({ ...editedNGO, website: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                      placeholder="https://www.example.org"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-6 border-t-2 border-slate-100">
                <h4 className="text-sm text-slate-700 mb-3">Primary Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">
                      Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editedNGO.primary_contact.name}
                      onChange={(e) => setEditedNGO({ 
                        ...editedNGO, 
                        primary_contact: { ...editedNGO.primary_contact, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={editedNGO.primary_contact.email}
                      onChange={(e) => setEditedNGO({ 
                        ...editedNGO, 
                        primary_contact: { ...editedNGO.primary_contact, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-700 mb-1">
                      Phone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={editedNGO.primary_contact.phone}
                      onChange={(e) => setEditedNGO({ 
                        ...editedNGO, 
                        primary_contact: { ...editedNGO.primary_contact, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="pt-6 border-t-2 border-slate-100">
                <h4 className="text-sm text-slate-700 mb-3">Address</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={editedNGO.address.street || ''}
                      onChange={(e) => setEditedNGO({ 
                        ...editedNGO, 
                        address: { ...editedNGO.address, street: e.target.value }
                      })}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editedNGO.address.city}
                        onChange={(e) => setEditedNGO({ 
                          ...editedNGO, 
                          address: { ...editedNGO.address, city: e.target.value }
                        })}
                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">
                        Province <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editedNGO.address.province}
                        onChange={(e) => setEditedNGO({ 
                          ...editedNGO, 
                          address: { ...editedNGO.address, province: e.target.value }
                        })}
                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">
                        Country <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editedNGO.address.country}
                        onChange={(e) => setEditedNGO({ 
                          ...editedNGO, 
                          address: { ...editedNGO.address, country: e.target.value }
                        })}
                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={editedNGO.address.postal_code || ''}
                        onChange={(e) => setEditedNGO({ 
                          ...editedNGO, 
                          address: { ...editedNGO.address, postal_code: e.target.value }
                        })}
                        className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-6 border-t-2 border-slate-100">
                <h4 className="text-sm text-slate-700 mb-3">Social Media</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Facebook</label>
                    <input
                      type="url"
                      value={editedNGO.social_links?.facebook || ''}
                      onChange={(e) => setEditedNGO({ 
                        ...editedNGO, 
                        social_links: { ...editedNGO.social_links, facebook: e.target.value }
                      })}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Twitter</label>
                    <input
                      type="url"
                      value={editedNGO.social_links?.twitter || ''}
                      onChange={(e) => setEditedNGO({ 
                        ...editedNGO, 
                        social_links: { ...editedNGO.social_links, twitter: e.target.value }
                      })}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      value={editedNGO.social_links?.linkedin || ''}
                      onChange={(e) => setEditedNGO({ 
                        ...editedNGO, 
                        social_links: { ...editedNGO.social_links, linkedin: e.target.value }
                      })}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Instagram</label>
                    <input
                      type="url"
                      value={editedNGO.social_links?.instagram || ''}
                      onChange={(e) => setEditedNGO({ 
                        ...editedNGO, 
                        social_links: { ...editedNGO.social_links, instagram: e.target.value }
                      })}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-300 focus:outline-none"
                      placeholder="https://instagram.com/yourhandle"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t-2 border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}