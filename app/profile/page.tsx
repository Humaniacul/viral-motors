'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { User, Edit2, Camera, MapPin, Globe, Calendar, BookOpen, Heart, Eye, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Profile } from '../../lib/supabase'

const ProfilePage = () => {
  const { user, profile, loading, updateUserProfile } = useAuth()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Profile>>({})
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
    
    if (profile) {
      setEditForm({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        website: profile.website || '',
        location: profile.location || '',
        interests: profile.interests || []
      })
    }
  }, [user, profile, loading, router])

  const handleSaveProfile = async () => {
    if (!user || !profile) return

    try {
      await updateUserProfile(editForm)
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUploadingAvatar(true)
    try {
      // For now, we'll use a placeholder implementation
      // In a real app, you'd upload to Supabase Storage
      console.log('Avatar upload not implemented yet:', file.name)
    } catch (error) {
      console.error('Error uploading avatar:', error)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const interestOptions = [
    'Electric Vehicles',
    'Supercars',
    'Classic Cars',
    'Motorcycles',
    'Racing',
    'Car Reviews',
    'Industry News',
    'Viral Content',
    'Technology',
    'Automotive Culture'
  ]

  const toggleInterest = (interest: string) => {
    const currentInterests = editForm.interests || []
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest]
    
    setEditForm({ ...editForm, interests: newInterests })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-red border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-dark-text">Please sign in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-dark-card rounded-2xl p-8 mb-8 shadow-card">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name || profile.username || 'User'}
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-30 h-30 bg-primary-red rounded-full flex items-center justify-center">
                    <User size={48} className="text-white" />
                  </div>
                )}
                
                {editing && (
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary-red rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-red-light transition-colors duration-200">
                    <Camera size={20} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploadingAvatar}
                    />
                  </label>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-black text-dark-text mb-2">
                      {profile.full_name || profile.username || 'User'}
                    </h1>
                    {profile.username && (
                      <p className="text-primary-red text-lg mb-2">@{profile.username}</p>
                    )}
                    {profile.bio && (
                      <p className="text-dark-text-secondary mb-4 max-w-2xl leading-relaxed">
                        {profile.bio}
                      </p>
                    )}
                    
                    {/* Profile Details */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                      {profile.location && (
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      {profile.website && (
                        <div className="flex items-center">
                          <Globe size={16} className="mr-2" />
                          <a 
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-red hover:text-primary-red-light transition-colors duration-200"
                          >
                            {profile.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        <span>Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center bg-primary-red hover:bg-primary-red-light text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
                    >
                      <Edit2 size={18} className="mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setEditing(false)
                          setEditForm({
                            full_name: profile.full_name || '',
                            username: profile.username || '',
                            bio: profile.bio || '',
                            website: profile.website || '',
                            location: profile.location || '',
                            interests: profile.interests || []
                          })
                        }}
                        className="px-6 py-3 border border-gray-600 text-dark-text rounded-lg font-medium hover:bg-gray-700 transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="bg-primary-red hover:bg-primary-red-light text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Interests */}
            {(profile.interests && profile.interests.length > 0) || editing ? (
              <div className="mt-8 pt-8 border-t border-gray-700">
                <h3 className="text-lg font-bold text-dark-text mb-4">Interests</h3>
                {editing ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          (editForm.interests || []).includes(interest)
                            ? 'bg-primary-red text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.interests?.map((interest) => (
                      <span
                        key={interest}
                        className="bg-primary-red/20 text-primary-red px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Edit Form */}
          {editing && (
            <div className="bg-dark-card rounded-2xl p-8 mb-8 shadow-card">
              <h2 className="text-2xl font-bold text-dark-text mb-6">Edit Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-dark-text mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.full_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red transition-colors duration-200"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark-text mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editForm.username || ''}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                    className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red transition-colors duration-200"
                    placeholder="Your username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark-text mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red transition-colors duration-200"
                    placeholder="Your location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark-text mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={editForm.website || ''}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red transition-colors duration-200"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-dark-text mb-2">
                  Bio
                </label>
                <textarea
                  value={editForm.bio || ''}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red transition-colors duration-200 resize-none"
                  placeholder="Tell us about yourself and your automotive interests..."
                  maxLength={500}
                />
                <p className="text-gray-500 text-sm mt-2">
                  {(editForm.bio || '').length}/500 characters
                </p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-dark-card rounded-xl p-6 shadow-card">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen size={24} className="text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-dark-text">42</p>
                  <p className="text-gray-400 text-sm">Articles Read</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-card rounded-xl p-6 shadow-card">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Heart size={24} className="text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-dark-text">128</p>
                  <p className="text-gray-400 text-sm">Articles Liked</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-card rounded-xl p-6 shadow-card">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Eye size={24} className="text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-dark-text">1.2K</p>
                  <p className="text-gray-400 text-sm">Profile Views</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Placeholder */}
          <div className="bg-dark-card rounded-2xl p-8 shadow-card">
            <h2 className="text-2xl font-bold text-dark-text mb-6">Recent Activity</h2>
            <div className="text-center py-12">
              <User size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No recent activity to show.</p>
              <p className="text-gray-500 text-sm mt-2">Start reading and interacting with articles to see your activity here.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ProfilePage
