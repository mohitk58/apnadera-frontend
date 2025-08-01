import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, MapPin, Camera, Save, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { formatPhoneNumber } from '../utils/formatters'
import { Link } from 'react-router-dom'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
})

const ProfilePage = () => {
  const { user, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [avatar, setAvatar] = useState(user?.avatar || '')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const result = await updateProfile({
        ...data,
        avatar,
      })
      if (result.success) {
        // Success is handled by the auth context
      }
    } catch (error) {
      console.error('Profile update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="heading-2">Profile Settings</h1>
            <p className="text-body mt-2">
              Manage your account information and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card p-8">
            {/* Avatar Section */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-gray-600">{user?.email}</p>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="name"
                      type="text"
                      {...register('name')}
                      className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className={`input pl-10 ${errors.phone ? 'input-error' : ''}`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="location"
                      type="text"
                      {...register('location')}
                      className={`input pl-10 ${errors.location ? 'input-error' : ''}`}
                      placeholder="Enter your location"
                    />
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-sm text-error-600">{errors.location.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  {...register('bio')}
                  className={`input ${errors.bio ? 'input-error' : ''}`}
                  placeholder="Tell us about yourself..."
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-error-600">{errors.bio.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Account Information</h4>
                  <p className="text-sm text-gray-600">
                    Role: <span className="capitalize">{user?.role}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Member since: {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 