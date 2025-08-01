import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Home, TrendingUp, Shield, Users } from 'lucide-react'
import PropertyCard from '../components/properties/PropertyCard'
import { useProperties } from '../hooks/useProperties'

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch featured properties from API
  const { data: featuredProperties = [], isLoading, error } = useProperties({ 
    isFeatured: true, 
    limit: 6 
  })

  const features = [
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Find your perfect property with our comprehensive search filters and location-based recommendations.'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Your data and transactions are protected with bank-level security and encryption.'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Get help from our team of real estate experts and professional agents.'
    },
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Access real-time market data and property value trends to make informed decisions.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="heading-1 text-white">
                Find Your Dream Home
              </h1>
              <p className="text-xl text-primary-100 leading-relaxed">
                Discover thousands of properties across the country. From cozy apartments to luxury estates, 
                we have the perfect place for you to call home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/properties" className="btn bg-white text-primary-600 hover:bg-gray-100">
                  Browse Properties
                </Link>
                <Link to="/register" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600">
                  List Your Property
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-xl font-semibold mb-4">Search Properties</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter location, property type, or keywords..."
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Link 
                    to={`/properties?q=${searchQuery}`}
                    className="btn-primary w-full justify-center"
                  >
                    Search Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2">Why Choose ApnaDera?</h2>
            <p className="text-body max-w-2xl mx-auto">
              We provide a comprehensive real estate platform that connects buyers, sellers, and agents 
              with cutting-edge technology and exceptional service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="heading-3">{feature.title}</h3>
                  <p className="text-body">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="section">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="heading-2">Featured Properties</h2>
              <p className="text-body">Discover our handpicked selection of premium properties</p>
            </div>
            <Link to="/properties" className="btn-outline">
              View All Properties
            </Link>
          </div>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="text-gray-600">Loading featured properties...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-error-600">Failed to load featured properties</p>
              <button 
                onClick={() => window.location.reload()} 
                className="btn-outline mt-4"
              >
                Try Again
              </button>
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured properties available</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-primary-600 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-primary-100">Properties Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5,000+</div>
              <div className="text-primary-100">Happy Clients</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Expert Agents</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-primary-100">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gray-900 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-2 text-white mb-4">Ready to Find Your Perfect Home?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their dream property through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary">
              Get Started Today
            </Link>
            <Link to="/properties" className="btn-outline text-black border-white hover:bg-white hover:text-gray-900">
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage 