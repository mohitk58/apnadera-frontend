import { Link } from 'react-router-dom'
import { Home, Search, ArrowLeft } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="heading-2 mb-4">Page Not Found</h1>
          <p className="text-body max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track to finding your perfect property.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
          <Link to="/properties" className="btn-outline">
            <Search className="w-4 h-4 mr-2" />
            Browse Properties
          </Link>
        </div>

        <div className="mt-8">
          <Link to="/" className="text-primary-600 hover:text-primary-700 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage 