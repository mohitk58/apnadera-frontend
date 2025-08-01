import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight, X } from 'lucide-react'
import PropertyCard from '../components/properties/PropertyCard'
import { useProperties, useToggleFavorite } from '../hooks/useProperties'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-hot-toast'

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')

  // Update search value when URL params change
  React.useEffect(() => {
    setSearchValue(searchParams.get('search') || '')
  }, [searchParams])

  // Get filters from URL params
  const filters = {
    page: searchParams.get('page') || '1',
    limit: '12',
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    status: searchParams.get('status') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
  }
  
  const { user } = useAuth()
  const toggleFavoriteMutation = useToggleFavorite()
  
  // Fetch properties from API
  const { data, isLoading, error } = useProperties(filters)
  const properties = data?.properties || []
  const pagination = data?.pagination

  // Handle favorite toggle
  const handleFavoriteToggle = async (propertyId) => {
    if (!user) {
      toast.error('Please login to add favorites')
      return
    }

    try {
      await toggleFavoriteMutation.mutateAsync(propertyId)
      toast.success('Favorite updated successfully')
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchValue.trim()) {
      setSearchParams({ search: searchValue.trim() })
    }
  }

  const handleClearSearch = () => {
    setSearchValue('')
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('search')
    setSearchParams(newParams)
  }

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', page.toString())
    setSearchParams(newParams)
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newParams = new URLSearchParams()
    
    // Add search
    const search = formData.get('search')
    if (search) newParams.set('search', search)
    
    // Add filters
    const minPrice = formData.get('minPrice')
    const maxPrice = formData.get('maxPrice')
    const type = formData.get('type')
    const bedrooms = formData.get('bedrooms')
    const bathrooms = formData.get('bathrooms')
    const status = formData.get('status')
    
    if (minPrice) newParams.set('minPrice', minPrice)
    if (maxPrice) newParams.set('maxPrice', maxPrice)
    if (type) newParams.set('type', type)
    if (bedrooms) newParams.set('bedrooms', bedrooms)
    if (bathrooms) newParams.set('bathrooms', bathrooms)
    if (status) newParams.set('status', status)
    
    newParams.set('page', '1') // Reset to first page
    setSearchParams(newParams)
  }

  const handleClearFilters = () => {
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="heading-2">Properties</h1>
              <p className="text-body mt-2">
                Discover {properties.length} properties available for sale
              </p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search properties..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="input pl-10 pr-10 w-full"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-3">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden btn-outline"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
              
              <form onSubmit={handleFilterSubmit} className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Search in Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="search"
                      placeholder="Search properties..."
                      defaultValue={searchParams.get('search') || ''}
                      className="input pl-9 pr-9"
                    />
                    {searchParams.get('search') && (
                      <button
                        type="button"
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams)
                          newParams.delete('search')
                          setSearchParams(newParams)
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Min Price"
                      defaultValue={searchParams.get('minPrice') || ''}
                      className="input"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Max Price"
                      defaultValue={searchParams.get('maxPrice') || ''}
                      className="input"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <div className="space-y-2">
                    {['house', 'apartment', 'condo', 'townhouse'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          name="type"
                          value={type}
                          defaultChecked={searchParams.get('type') === type}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select name="bedrooms" className="input" defaultValue={searchParams.get('bedrooms') || ''}>
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <select name="bathrooms" className="input" defaultValue={searchParams.get('bathrooms') || ''}>
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="space-y-2">
                    {['available', 'pending', 'sold'].map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          name="status"
                          value={status}
                          defaultChecked={searchParams.get('status') === status}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {status}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <button type="submit" className="btn-primary w-full">
                    Apply Filters
                  </button>
                  <button 
                    type="button" 
                    onClick={handleClearFilters}
                    className="btn-outline w-full"
                  >
                    Clear All Filters
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                Showing {properties.length} of {pagination?.totalProperties || 0} properties
              </div>
            </div>

            {/* Properties Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="text-gray-600">Loading properties...</span>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-error-600">Failed to load properties</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn-outline mt-4"
                >
                  Try Again
                </button>
              </div>
            ) : properties.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {properties.map((property) => (
                  <PropertyCard 
                    key={property._id} 
                    property={property} 
                    user={user}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No properties found</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center">
                <nav className="flex items-center space-x-2">
                  <button 
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="btn-outline px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm ${
                          page === pagination.currentPage 
                            ? 'btn-primary' 
                            : 'btn-outline'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  
                  <button 
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="btn-outline px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertiesPage 