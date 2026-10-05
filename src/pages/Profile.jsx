import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'
import toast from 'react-hot-toast'
import { User, Phone, Mail, Shield, Calendar, Edit3, Key, Save, X, Sparkles } from 'lucide-react'

export default function Profile() {
  const { user, setUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Edit Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    profilePicture: user?.profilePicture || '',
  })

  // Change Password Form State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  if (!user) {
    return (
      <div className="flex h-[80vh] items-center justify-center p-6 text-sm text-slate-500">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  // Generate initials for default avatar
  const getInitials = (name) => {
    if (!name) return 'U'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  const initials = getInitials(user.name)

  // Handle Profile Update Submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }
    
    setIsLoading(true)
    try {
      const response = await authService.updateProfile({
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        profilePicture: formData.profilePicture.trim(),
      })

      if (response && response.success) {
        setUser(response.data)
        toast.success(response.message || 'Profile updated successfully')
        setIsEditing(false)
      } else {
        throw new Error(response.message || 'Failed to update profile')
      }
    } catch (err) {
      console.error('[ProfilePage] Error updating profile:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update profile'
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Password Update Submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!passwordData.oldPassword) {
      toast.error('Please enter your current password')
      return
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const response = await authService.updateProfile({
        name: user.name,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })

      if (response && response.success) {
        toast.success('Password updated successfully')
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
        setIsChangingPassword(false)
      } else {
        throw new Error(response.message || 'Failed to update password')
      }
    } catch (err) {
      console.error('[ProfilePage] Error updating password:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update password'
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  // Format creation date
  const formatAccountCreatedDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(dateStr))
    } catch (error) {
      console.error('[ProfilePage] Date format error:', error)
      return 'N/A'
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8 dark:bg-gray-900 transition-colors duration-200">
      
      {/* Header section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          My Account Profile
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your personal details, role preferences, and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Card 1: Visual identity (Avatar, Name, Role, Date) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 text-center flex flex-col items-center">
            
            {/* User Avatar Image or Initials Bubble */}
            <div className="relative group mb-4">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="h-28 w-28 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : null}
              
              <div
                className="h-28 w-28 items-center justify-center rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 text-white text-3xl font-bold shadow-md border-4 border-white dark:border-gray-700"
                style={{ display: user.profilePicture ? 'none' : 'flex' }}
              >
                {initials}
              </div>

              {/* Decorative subtle pulse overlay */}
              <div className="absolute inset-0 rounded-full bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate max-w-full">
              {user.name}
            </h3>
            
            <p className="text-sm font-semibold text-gray-550 dark:text-gray-400 truncate max-w-full mt-1">
              {user.email}
            </p>

            <div className="mt-4 flex flex-col gap-2.5 w-full border-t border-gray-100 pt-4 dark:border-gray-700/50">
              <div className="flex items-center justify-between text-xs font-semibold px-2">
                <span className="text-gray-400 dark:text-gray-500">System Role</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                  <Shield className="h-2.5 w-2.5" />
                  {user.role || 'user'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold px-2">
                <span className="text-gray-400 dark:text-gray-550">Member Since</span>
                <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                  {formatAccountCreatedDate(user.createdAt)}
                </span>
              </div>
            </div>

            {/* Quick Actions triggers */}
            {!isEditing && (
              <button
                onClick={() => {
                  setFormData({
                    name: user.name,
                    phoneNumber: user.phoneNumber || '',
                    profilePicture: user.profilePicture || '',
                  })
                  setIsEditing(true)
                  setIsChangingPassword(false)
                }}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 text-sm cursor-pointer shadow-xs transition-all duration-200"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}

            {!isChangingPassword && (
              <button
                onClick={() => {
                  setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
                  setIsChangingPassword(true)
                  setIsEditing(false)
                }}
                className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2.5 text-sm cursor-pointer transition-all duration-250"
              >
                <Key className="h-4 w-4" />
                <span>Change Password</span>
              </button>
            )}
          </div>
        </div>

        {/* Card 2 & 3: Detailed view OR editing state */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Main Account details (Visible when not editing profile or changing password) */}
          {!isEditing && !isChangingPassword && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 pb-3 dark:border-gray-700/50">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Full Name</span>
                  <div className="mt-1.5 flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white">
                    <User className="h-4 w-4 text-gray-400 dark:text-gray-550 shrink-0" />
                    <span>{user.name}</span>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider">Email Address</span>
                  <div className="mt-1.5 flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white">
                    <Mail className="h-4 w-4 text-gray-400 dark:text-gray-550 shrink-0" />
                    <span>{user.email}</span>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider">Phone Number</span>
                  <div className="mt-1.5 flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white">
                    <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
                    <span>{user.phoneNumber || <span className="text-gray-400 font-normal italic">No phone number set</span>}</span>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">System Role</span>
                  <div className="mt-1.5 flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white">
                    <Shield className="h-4 w-4 text-gray-400 dark:text-gray-550 shrink-0" />
                    <span className="capitalize">{user.role || 'user'}</span>
                  </div>
                </div>
              </div>

              {/* Decorative Sparkles info panel */}
              <div className="mt-4 flex items-start gap-3 rounded-xl bg-blue-50/50 p-4 border border-blue-100/30 dark:bg-blue-950/20 dark:border-blue-900/10">
                <Sparkles className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">Profile Synchronized</span>
                  <span className="text-xs text-gray-500 dark:text-gray-450 leading-relaxed mt-1">
                    Your profile details are stored dynamically in the remote MongoDB cluster. All updates are broadcasted to the top bar and sidebar.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* EDIT PROFILE FORM */}
          {isEditing && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 flex flex-col gap-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Edit Personal Details
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="edit-name" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    className="mt-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-900 focus:border-blue-600 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-phone" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="edit-phone"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleProfileChange}
                    placeholder="e.g. +1 555 123 4567"
                    disabled={isLoading}
                    className="mt-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-900 focus:border-blue-600 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="edit-pic" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Profile Picture URL (Optional)
                  </label>
                  <input
                    type="url"
                    id="edit-pic"
                    name="profilePicture"
                    value={formData.profilePicture}
                    onChange={handleProfileChange}
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    disabled={isLoading}
                    className="mt-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-900 focus:border-blue-600 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 transition-colors"
                  />
                  <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-550 leading-relaxed font-semibold">
                    Provide a URL link of a public image. If empty, the system defaults to your initials.
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4 dark:border-gray-700/50">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-250 hover:bg-gray-50 text-gray-700 font-bold text-sm cursor-pointer dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-300 transition-all duration-200"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm cursor-pointer shadow-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CHANGE PASSWORD FORM */}
          {isChangingPassword && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 flex flex-col gap-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Update Password Credentials
                </h3>
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-750 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="old-password" className="block text-xs font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="old-password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current account password"
                    disabled={isLoading}
                    className="mt-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-900 focus:border-blue-600 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="new-password" className="block text-xs font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Choose a strong new password"
                    disabled={isLoading}
                    className="mt-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-900 focus:border-blue-600 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 transition-colors"
                    required
                  />
                  <p className="mt-1 text-[10px] text-gray-450 dark:text-gray-500 leading-relaxed font-semibold">
                    Must be at least 6 characters in length.
                  </p>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-xs font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    disabled={isLoading}
                    className="mt-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-900 focus:border-blue-600 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4 dark:border-gray-700/50">
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-250 hover:bg-gray-50 text-gray-700 font-bold text-sm cursor-pointer dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-300 transition-all duration-200"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm cursor-pointer shadow-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>Change Password</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
