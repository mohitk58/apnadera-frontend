import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Heart, 
  Share2, 
  Phone, 
  Mail,
  Eye,
  Car,
  Home,
  Wifi,
  Shield,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { formatPrice, formatDate } from '../utils/formatters'
import { useProperty, useToggleFavorite } from '../hooks/useProperties'
import { useAuth } from '../contexts/AuthContext'
import { sendContactInquiry } from '../services/api'
import { toast } from 'react-hot-toast'

const PropertyDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeImage, setActiveImage] = useState(0)
  const [contactForm, setContactForm] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch property data
  const { data: property, isLoading, error } = useProperty(id)
  const toggleFavoriteMutation = useToggleFavorite()

  // Check if current user has favorited this property
  const isFavorited = property?.favorites?.some(favId => favId.toString() === user?._id?.toString())

  // Handle favorite toggle
  const handleFavorite = async () => {
    if (!user) {
      toast.error('Please login to add favorites')
      return
    }

    try {
      await toggleFavoriteMutation.mutateAsync(id)
      toast.success('Favorite updated successfully')
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault()
    
    if (!contactForm.contactName || !contactForm.contactEmail || !contactForm.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const contactData = {
        propertyId: property._id,
        propertyTitle: property.title,
        contactName: contactForm.contactName,
        contactEmail: contactForm.contactEmail,
        contactPhone: contactForm.contactPhone,
        message: contactForm.message,
        recipientEmail: property.agent?.email || property.owner?.email,
        recipientName: property.agent?.name || property.owner?.name,
        recipientType: property.agent ? 'agent' : 'owner'
      }

      await sendContactInquiry(contactData)
      toast.success('Inquiry sent successfully! You will receive a confirmation email.')
      
      // Reset form
      setContactForm({
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        message: ''
      })
    } catch (error) {
      toast.error(error.message || 'Failed to send inquiry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load property details</p>
          <button 
            onClick={() => navigate(-1)} 
            className="btn-outline"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Show not found state
  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Property not found</p>
          <button 
            onClick={() => navigate(-1)} 
            className="btn-outline"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Amenity icons mapping
  const amenityIcons = {
    'pool': '🏊',
    'gym': '💪',
    'security': '🔒',
    'air-conditioning': '❄️',
    'heating': '🔥',
    'dishwasher': '🍽️',
    'washer': '👕',
    'dryer': '👕',
    'parking': '🚗',
    'garden': '🌱',
    'fireplace': '🔥',
    'balcony': '🏠',
    'elevator': '🛗',
    'pet-friendly': '🐾',
    'furnished': '🪑'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="container-custom pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Properties
        </button>
      </div>

      {/* Image Gallery */}
      <div className="relative h-96 md:h-[500px] bg-gray-200">
        {property.images && property.images.length > 0 ? (
          <>
            <div className="absolute inset-0">
              <img
                src={property.images[activeImage]?.url || property.images[0]?.url}
                alt={property.images[activeImage]?.caption || 'Property image'}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-3 h-3 rounded-full ${
                    activeImage === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Home className="w-16 h-16 mx-auto mb-4" />
              <p>No images available</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={handleFavorite}
            disabled={toggleFavoriteMutation.isPending}
            className={`p-2 rounded-full transition-colors ${
              isFavorited 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          {/* Edit button for property owners */}
          {(property.owner?._id === user?._id || user?.role === 'admin') && (
            <button 
              onClick={() => navigate(`/properties/edit/${property._id}`)}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`badge-${property.status === 'available' ? 'success' : property.status === 'sold' ? 'error' : 'warning'}`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="heading-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.location?.address}, {property.location?.city}, {property.location?.state} {property.location?.zipCode}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {formatPrice(property.price)}
                  </div>
                  {property.originalPrice > property.price && (
                    <div className="text-lg text-gray-500 line-through">
                      {formatPrice(property.originalPrice)}
                    </div>
                  )}
                </div>
              </div>

              {/* Property Stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  <span>{property.details?.bedrooms || 0} Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  <span>{property.details?.bathrooms || 0} Bathrooms</span>
                </div>
                <div className="flex items-center">
                  <Square className="w-4 h-4 mr-1" />
                  <span>{property.details?.squareFeet?.toLocaleString() || 'N/A'} sq ft</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Built in {property.details?.yearBuilt || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6 mb-8">
              <h3 className="heading-3 mb-4">Description</h3>
              <p className="text-body leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="card p-6 mb-8">
                <h3 className="heading-3 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-xl">{amenityIcons[amenity] || '🏠'}</span>
                      <span className="text-sm text-gray-700 capitalize">
                        {amenity.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Details */}
            <div className="card p-6 mb-8">
              <h3 className="heading-3 mb-4">Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-medium capitalize">{property.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built</span>
                    <span className="font-medium">{property.details?.yearBuilt || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Square Feet</span>
                    <span className="font-medium">{property.details?.squareFeet?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heating</span>
                    <span className="font-medium capitalize">{property.details?.heating || 'N/A'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cooling</span>
                    <span className="font-medium capitalize">{property.details?.cooling || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parking</span>
                    <span className="font-medium capitalize">{property.details?.parking || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listed</span>
                    <span className="font-medium">{formatDate(property.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Views</span>
                    <span className="font-medium">{property.views || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Form */}
            <div className="card p-6 mb-6 top-8">
              <h3 className="heading-3 mb-4">Contact {property.agent ? 'Agent' : 'Owner'}</h3>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">
                    {(property.agent?.name || property.owner?.name || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold">{property.agent?.name || property.owner?.name || 'Contact'}</h4>
                  <p className="text-sm text-gray-600">{property.agent ? 'Real Estate Agent' : 'Property Owner'}</p>
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  name="contactName"
                  value={contactForm.contactName}
                  onChange={handleInputChange}
                  placeholder="Your Name *"
                  className="input"
                  required
                />
                <input
                  type="email"
                  name="contactEmail"
                  value={contactForm.contactEmail}
                  onChange={handleInputChange}
                  placeholder="Your Email *"
                  className="input"
                  required
                />
                <input
                  type="tel"
                  name="contactPhone"
                  value={contactForm.contactPhone}
                  onChange={handleInputChange}
                  placeholder="Your Phone (optional)"
                  className="input"
                />
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleInputChange}
                  placeholder="Your Message *"
                  rows={4}
                  className="input"
                  required
                />
                <button 
                  type="submit" 
                  className="btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-gray-200">
                {(property.agent?.phone || property.owner?.phone) && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Phone</span>
                    <a href={`tel:${property.agent?.phone || property.owner?.phone}`} className="text-primary-600 hover:text-primary-700">
                      {property.agent?.phone || property.owner?.phone}
                    </a>
                  </div>
                )}
                {(property.agent?.email || property.owner?.email) && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Email</span>
                    <a href={`mailto:${property.agent?.email || property.owner?.email}`} className="text-primary-600 hover:text-primary-700">
                      {property.agent?.email || property.owner?.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Price History */}
            {property.priceHistory && property.priceHistory.length > 0 && (
              <div className="card p-6">
                <h3 className="heading-3 mb-4">Price History</h3>
                <div className="space-y-3">
                  {property.priceHistory.map((entry, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{formatDate(entry.date)}</span>
                      <span className="font-medium">{formatPrice(entry.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailPage 