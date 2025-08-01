import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Upload, MapPin, Home, DollarSign, Bed, Bath, Square } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCreateProperty } from '../hooks/useProperties'

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description must be less than 2000 characters'),
  type: z.enum(['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial']),
  price: z.number().min(0, 'Price must be 0 or greater'),
  location: z.object({
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required')
  }),
  details: z.object({
    bedrooms: z.number().min(0, 'Bedrooms must be 0 or more'),
    bathrooms: z.number().min(0, 'Bathrooms must be 0 or more'),
    sqft: z.number().min(1, 'Square footage is required'),
    yearBuilt: z.number().min(1800, 'Year built must be 1800 or later').max(new Date().getFullYear(), 'Year built cannot be in the future')
  }),
  amenities: z.array(z.string()).optional(),
  status: z.enum(['available', 'pending', 'sold', 'rented']).default('available')
})

const AddPropertyPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [images, setImages] = useState([])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  
  const createPropertyMutation = useCreateProperty()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: 'house',
      status: 'available',
      location: {
        country: 'United States'
      },
      details: {
        bedrooms: 0,
        bathrooms: 0,
        sqft: 0,
        yearBuilt: new Date().getFullYear()
      }
    }
  })

  const propertyType = watch('type')

  const propertyTypes = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' }
  ]

  const amenitiesList = [
    'air-conditioning', 'heating', 'dishwasher', 'washer', 'dryer', 'parking',
    'garden', 'pool', 'gym', 'security', 'fireplace', 'balcony',
    'elevator', 'pet-friendly', 'furnished'
  ]

  const amenityLabels = {
    'air-conditioning': 'Air Conditioning',
    'heating': 'Heating',
    'dishwasher': 'Dishwasher',
    'washer': 'Washer',
    'dryer': 'Dryer',
    'parking': 'Parking',
    'garden': 'Garden',
    'pool': 'Pool',
    'gym': 'Gym',
    'security': 'Security System',
    'fireplace': 'Fireplace',
    'balcony': 'Balcony',
    'elevator': 'Elevator',
    'pet-friendly': 'Pet Friendly',
    'furnished': 'Furnished'
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }
    setImages(prev => [...prev, ...files])
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      
      // Add basic property data
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('type', data.type)
      formData.append('price', data.price.toString())
      formData.append('status', data.status)
      
      // Add location data - backend expects nested object format
      formData.append('location[address]', data.location.address.toString())
      formData.append('location[city]', data.location.city.toString())
      formData.append('location[state]', data.location.state.toString())
      formData.append('location[zipCode]', data.location.zipCode.toString())
      formData.append('location[country]', data.location.country.toString())
      
      // Add property details - backend expects nested object format
      formData.append('details[bedrooms]', data.details.bedrooms.toString())
      formData.append('details[bathrooms]', data.details.bathrooms.toString())
      formData.append('details[sqft]', data.details.sqft.toString())
      formData.append('details[yearBuilt]', data.details.yearBuilt.toString())
      
      // Add amenities
      if (selectedAmenities.length > 0) {
        selectedAmenities.forEach(amenity => {
          formData.append('amenities[]', amenity)
        })
      }
      
      // Add images
      images.forEach(image => {
        formData.append('images', image)
      })

      await createPropertyMutation.mutateAsync(formData)
      toast.success('Property added successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Add property error:', error)
      if (error.response?.data?.details) {
        // Handle validation errors
        const validationErrors = error.response.data.details
        validationErrors.forEach(error => {
          toast.error(`${error.path}: ${error.msg}`)
        })
      } else {
        toast.error(error.response?.data?.message || 'Failed to add property')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
                <p className="text-gray-600 mt-2 text-lg">List your property for sale or rent</p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Step 1 of 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
                  <p className="text-gray-500 text-sm">Tell us about your property</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('title')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter property title"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select {...register('type')} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white">
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.type.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      {...register('price', { valueAsNumber: true })}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      placeholder="0"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select {...register('status')} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white">
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                    placeholder="Describe your property in detail..."
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Location</h3>
                  <p className="text-gray-500 text-sm">Where is your property located?</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('location.address')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter full address"
                  />
                  {errors.location?.address && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.location.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('location.city')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter city"
                  />
                  {errors.location?.city && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.location.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('location.state')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter state"
                  />
                  {errors.location?.state && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.location.state.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('location.zipCode')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter ZIP code"
                  />
                  {errors.location?.zipCode && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.location.zipCode.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('location.country')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter country"
                  />
                  {errors.location?.country && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.location.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Square className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Property Details</h3>
                  <p className="text-gray-500 text-sm">Specifications and features</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <div className="relative">
                    <Bed className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      {...register('details.bedrooms', { valueAsNumber: true })}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      placeholder="0"
                    />
                  </div>
                  {errors.details?.bedrooms && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.details.bedrooms.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <div className="relative">
                    <Bath className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      {...register('details.bathrooms', { valueAsNumber: true })}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      placeholder="0"
                    />
                  </div>
                  {errors.details?.bathrooms && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.details.bathrooms.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Square Feet <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Square className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      {...register('details.sqft', { valueAsNumber: true })}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      placeholder="0"
                    />
                  </div>
                  {errors.details?.sqft && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.details.sqft.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Built
                  </label>
                  <input
                    type="number"
                    {...register('details.yearBuilt', { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="2024"
                  />
                  {errors.details?.yearBuilt && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.details.yearBuilt.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Amenities</h3>
                  <p className="text-gray-500 text-sm">What features does your property offer?</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">{amenityLabels[amenity]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Upload className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Property Images</h3>
                  <p className="text-gray-500 text-sm">Upload photos of your property</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2 text-lg font-medium">Upload property images</p>
                  <p className="text-sm text-gray-500 mb-6">Maximum 10 images, JPG, PNG, or WebP</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200">
                    Choose Images
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Property ${index + 1}`}
                          className="w-full h-40 object-cover rounded-xl shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-lg"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 rounded-b-xl">
                          <p className="text-white text-xs font-medium">Image {index + 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Ready to list your property?</h3>
                  <p className="text-gray-500 text-sm mt-1">Review your information and submit when ready</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || createPropertyMutation.isPending}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting || createPropertyMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Adding Property...</span>
                      </div>
                    ) : (
                      'Add Property'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddPropertyPage 