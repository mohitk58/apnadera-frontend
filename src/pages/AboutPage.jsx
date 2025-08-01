import { Link } from 'react-router-dom'
import { ArrowLeft, Github, Mail, MapPin, Home, Users, Shield, Heart } from 'lucide-react'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="heading-2">About ApnaDera</h1>
            <p className="text-body mt-2">
              Your trusted partner in finding the perfect property
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* Mission Section */}
          <div className="card p-8 mb-8">
            <h2 className="heading-2 mb-6">Our Mission</h2>
            <p className="text-body mb-6">
              ApnaDera is a comprehensive real estate platform designed to connect buyers, sellers, and agents 
              in a seamless and user-friendly environment. We believe everyone deserves to find their perfect home, 
              and we're committed to making that journey as smooth as possible.
            </p>
            <p className="text-body">
              Our platform combines cutting-edge technology with personalized service to provide you with 
              the most comprehensive property search and listing experience available.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <Home className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="heading-3 mb-3">Property Search</h3>
              <p className="text-body">
                Find your dream home with our advanced search filters and detailed property listings.
              </p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="heading-3 mb-3">Agent Network</h3>
              <p className="text-body">
                Connect with trusted real estate agents and property owners directly through our platform.
              </p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="heading-3 mb-3">Secure Platform</h3>
              <p className="text-body">
                Your data and transactions are protected with industry-standard security measures.
              </p>
            </div>
          </div>

          {/* Developer Section */}
          <div className="card p-8 mb-8">
            <h2 className="heading-2 mb-6">Meet the Developer</h2>
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">M</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Mohit Kumar</h3>
                <p className="text-gray-600">Full Stack Developer</p>
                <p className="text-sm text-gray-500 mt-1">
                  Passionate about creating user-friendly web applications and contributing to open source projects.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Skills & Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-primary">React</span>
                  <span className="badge badge-primary">Node.js</span>
                  <span className="badge badge-primary">MongoDB</span>
                  <span className="badge badge-primary">Express.js</span>
                  <span className="badge badge-primary">Tailwind CSS</span>
                  <span className="badge badge-primary">JavaScript</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Connect</h4>
                <div className="space-y-3">
                  <a 
                    href="https://github.com/mohitk58" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub Profile</span>
                  </a>
                  <a 
                    href="mailto:mk581991@gmail.com"
                    className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>mk581991@gmail.com</span>
                  </a>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Open Source Section */}
          <div className="card p-8">
            <div className="text-center">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="heading-2 mb-4">Open Source</h2>
              <p className="text-body mb-6">
                This project is open source and available on GitHub. Feel free to contribute, 
                report issues, or suggest new features.
              </p>
              <a 
                href="https://github.com/mohitk58" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center"
              >
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage 