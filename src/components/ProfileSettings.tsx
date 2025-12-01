import { useState, useEffect } from 'react';
import { User, Mail, Save, Loader, CheckCircle } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface ProfileSettingsProps {
  user: any;
  onUpdateUser: (user: any) => void;
}

export function ProfileSettings({ user, onUpdateUser }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-83197308/user/${user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({
            name: formData.name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      onUpdateUser({ ...user, name: formData.name });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="mb-2 bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Picture Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-purple-100 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-xl">
              <span className="text-4xl">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-gray-800 mb-1">{user.name || 'User'}</h3>
              <p className="text-gray-500 mb-3">{user.email}</p>
              <p className="text-sm text-gray-400">Member since {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="mb-6 text-gray-800">Personal Information</h3>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700">Profile updated successfully!</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Email cannot be changed. Contact support if you need assistance.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Account Statistics */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-8 border border-purple-100 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="mb-6 text-gray-800">Account Statistics</h3>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl">
              <p className="text-sm text-cyan-700 mb-1">Account Status</p>
              <p className="text-cyan-900">Active</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <p className="text-sm text-purple-700 mb-1">Privacy</p>
              <p className="text-purple-900">All data encrypted</p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h4 className="text-blue-900 mb-2">Privacy & Data Security</h4>
          <p className="text-blue-700 text-sm">
            Your personal information and medical data are encrypted and stored securely. We never share your data with third parties without your explicit consent. All analysis images are stored in secure cloud storage with restricted access.
          </p>
        </div>

        {/* Danger Zone */}
        <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h4 className="text-red-900 mb-2">Danger Zone</h4>
          <p className="text-red-700 text-sm mb-4">
            Once you delete your account, there is no going back. All your data, including scan history and analysis results, will be permanently deleted.
          </p>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                alert('Account deletion feature will be implemented. Please contact support for now.');
              }
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
