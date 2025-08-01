import { useAuth } from '../contexts/AuthContext'
import { 
  Home, 
  Heart, 
  Plus, 
  Eye, 
  TrendingUp, 
  DollarSign, 
  MapPin,
  Calendar,
  Settings
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatters'
import { useUserStats, useUserProperties, useUserFavorites } from '../hooks/useUser'

const DashboardPage = () => {
  const { user } = useAuth()

  // Fetch real data from API (only for property owners, not agents)
  const { data: userStats, isLoading: statsLoading } = useUserStats({
    enabled: user?.role === 'seller' || user?.role === 'admin'
  })
  const { data: userProperties = [], isLoading: propertiesLoading } = useUserProperties()
  // const { data: userFavorites = [], isLoading: favoritesLoading } = useUserFavorites()

  // Calculate stats from real data
  const stats = [
    {
      title: 'Total Properties',
      value: userStats?.totalProperties || '0',
      change: userStats?.propertiesChange || '+0',
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Favorites',
      value: userStats?.totalFavorites || '0',
      change: userStats?.favoritesChange || '+0',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Total Views',
      value: userStats?.totalViews || '0',
      change: userStats?.viewsChange || '+0%',
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Value',
      value: formatPrice(userStats?.totalValue || 0),
      change: userStats?.valueChange || '+0%',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  // Use real properties data (limit to 5 recent ones)
  const recentProperties = Array.isArray(userProperties) ? userProperties.slice(0, 5) : []

  const quickActions = [
    {
      title: 'Add New Property',
      description: 'List a new property for sale',
      icon: Plus,
      href: '/properties/add',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'View Favorites',
      description: 'See your saved properties',
      icon: Heart,
      href: '/dashboard/favorites',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Market Analysis',
      description: 'View market trends and insights',
      icon: TrendingUp,
      href: '/dashboard/analytics',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Profile Settings',
      description: 'Update your account information',
      icon: Settings,
      href: '/dashboard/profile',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-2">Dashboard</h1>
              <p className="text-body mt-2">
                Welcome back, {user?.name}! Here's what's happening with your properties on ApnaDera.
              </p>
            </div>
            <Link to="/properties/add" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Link>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Stats Grid - Only show for property owners */}
        {(user?.role === 'seller' || user?.role === 'admin') && (
          statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="card p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.change}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}

        {/* Agent Welcome Message */}
        {user?.role === 'agent' && (
          <div className="card p-6 mb-8">
            <div className="text-center">
              <h3 className="heading-3 mb-4">Welcome, {user.name}!</h3>
              <p className="text-body text-gray-600 mb-6">
                As a real estate agent on ApnaDera, you can help clients find their perfect properties. 
                Browse available properties and connect with potential buyers.
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/properties" className="btn-primary">
                  Browse Properties
                </Link>
                <Link to="/dashboard/profile" className="btn-outline">
                  Update Profile
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h3 className="heading-3 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={index}
                      to={action.href}
                      className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <div className={`p-3 rounded-full ${action.bgColor} mr-4`}>
                        <Icon className={`w-5 h-5 ${action.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{action.title}</h4>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Recent Properties */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="heading-3">Recent Properties</h3>
                <Link to="/dashboard/properties" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              
              {propertiesLoading ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                    <span className="text-gray-600">Loading properties...</span>
                  </div>
                </div>
              ) : recentProperties.length > 0 ? (
                <div className="space-y-4">
                  {recentProperties.map((property) => (
                    <div key={property._id} className="relative p-4 border border-gray-200 rounded-lg">
                      {/* Status badge positioned in top right corner */}
                      <div className="absolute top-2 right-2 z-10">
                        <span className={`badge ${
                          property.status === 'available' ? 'badge-success' : 'badge-warning'
                        }`}>
                          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-lg mr-4 overflow-hidden flex-shrink-0">
                          {property.images && property.images.length > 0 ? (
                            <img 
                              src={property.images.find(img => img.isPrimary)?.url || property.images[0].url} 
                              alt={property.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEMyNC4yNjgxIDIwIDE4IDI2LjI2ODEgMTggMzRDMTggNDEuNzMxOSAyNC4yNjgxIDQ4IDMyIDQ4QzM5LjczMTkgNDggNDYgNDEuNzMxOSA0NiAzNEM0NiAyNi4yNjgxIDM5LjczMTkgMjAgMzIgMjBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xNiA1NkMxNiA1MS41ODE3IDE5LjU4MTcgNDggMjQgNDhINDBDNDQuNDE4MyA0OCA0OCA1MS41ODE3IDQ4IDU2VjU4QzQ4IDU5LjEwNDYgNDcuMTA0NiA2MCA0NiA2MEgxOEMxNi44OTU0IDYwIDE2IDU5LjEwNDYgMTYgNThWNjBaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{property.title}</h4>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {property.location.city}, {property.location.state}
                          </div>
                          <div className="flex items-center mt-2">
                            <span className="font-semibold text-gray-900">
                              {formatPrice(property.price)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {property.views}
                          </div>
                          <div className="flex items-center mt-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(property.createdAt).toLocaleDateString()}
                          </div>
                          {/* Edit button for property owners */}
                          {(property.owner?._id === user?._id || user?.role === 'admin') && (
                            <div className="mt-2">
                              <Link 
                                to={`/properties/edit/${property._id}`}
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-xs"
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No properties found</p>
                  <Link to="/properties/add" className="btn-primary mt-4">
                    Add Your First Property
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Market Insights */}
        <div className="mt-8">
          <div className="card p-6">
            <h3 className="heading-3 mb-6">Market Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900">Market Trend</h4>
                <p className="text-2xl font-bold text-green-600">+5.2%</p>
                <p className="text-sm text-gray-600">Average price increase</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <Home className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900">Active Listings</h4>
                <p className="text-2xl font-bold text-blue-600">1,234</p>
                <p className="text-sm text-gray-600">Properties available</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900">Average Price</h4>
                <p className="text-2xl font-bold text-purple-600">$450K</p>
                <p className="text-sm text-gray-600">Median property value</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage 