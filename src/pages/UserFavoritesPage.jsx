import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Search, ArrowLeft } from 'lucide-react'
import PropertyCard from '../components/properties/PropertyCard'
import { useUserFavorites } from '../hooks/useUser'
import { useAuth } from '../contexts/AuthContext'

const UserFavoritesPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data, isLoading, error } = useUserFavorites()
  const favorites = data?.favorites || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load your favorites</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-outline"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="container-custom pt-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="heading-2">My Favorites</h1>
              <p className="text-body mt-2">
                Your {favorites.length} favorite properties
              </p>
            </div>
            
            <Link
              to="/properties"
              className="btn-outline inline-flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Properties
            </Link>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {favorites.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {favorites.map((property) => (
              <PropertyCard 
                key={property._id} 
                property={property}
                user={user}
                showEditButton={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start browsing properties and add them to your favorites.
              </p>
              <Link to="/properties" className="btn-primary">
                Browse Properties
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserFavoritesPage 