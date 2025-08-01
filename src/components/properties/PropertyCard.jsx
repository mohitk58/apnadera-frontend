import { Link } from 'react-router-dom'
import { MapPin, Bed, Bath, Square, Heart, Eye, Edit } from 'lucide-react'
import { formatPrice } from '../../utils/formatters'

const PropertyCard = ({ property, user, showEditButton = false, onFavoriteToggle }) => {
  const {
    _id,
    title,
    price,
    location,
    details,
    images,
    type,
    status,
    views,
    isFeatured
  } = property

  const primaryImage = images?.[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500'

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'badge-success'
      case 'sold':
        return 'badge-error'
      case 'pending':
        return 'badge-warning'
      case 'rented':
        return 'badge-secondary'
      default:
        return 'badge-secondary'
    }
  }

  const getTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <Link to={`/properties/${_id}`} className="block">
      <div className="card-hover group">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <img
            src={primaryImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="badge-primary">Featured</span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className={`badge ${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          {/* Edit button for property owners */}
          {showEditButton && (property.owner?._id === user?._id || user?.role === 'admin') && (
            <div className="absolute top-3 left-3">
              <Link 
                to={`/properties/edit/${_id}`}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors inline-flex"
                onClick={(e) => e.stopPropagation()}
              >
                <Edit className="w-4 h-4" />
              </Link>
            </div>
          )}
          <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
            <Eye className="w-3 h-3 inline mr-1" />
            {views}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
              {title}
            </h3>
            {onFavoriteToggle && (
              <button 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onFavoriteToggle(_id)
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart className={`w-5 h-5 ${property.favorites?.some(favId => favId.toString() === user?._id?.toString()) ? 'fill-current text-red-500' : ''}`} />
              </button>
            )}
          </div>

          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {location.city}, {location.state}
            </span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {details.bedrooms && (
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  <span>{details.bedrooms}</span>
                </div>
              )}
              {details.bathrooms && (
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  <span>{details.bathrooms}</span>
                </div>
              )}
              {details.squareFeet && (
                <div className="flex items-center">
                  <Square className="w-4 h-4 mr-1" />
                  <span>{details.squareFeet.toLocaleString()} sq ft</span>
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500">{getTypeLabel(type)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(price)}
            </div>
            <div className="text-sm text-gray-500">
              {details.squareFeet && `$${Math.round(price / details.squareFeet)}/sq ft`}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard 