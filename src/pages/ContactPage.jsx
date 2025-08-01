import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Mail, Phone, MapPin, Send } from 'lucide-react'
import { sendContactInquiry } from '../services/api'
import { toast } from 'react-hot-toast'

const ContactPage = () => {
  const [contactForm, setContactForm] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    
    if (!contactForm.contactName || !contactForm.contactEmail || !contactForm.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const contactData = {
        propertyId: 'general-inquiry',
        propertyTitle: 'General Inquiry',
        contactName: contactForm.contactName,
        contactEmail: contactForm.contactEmail,
        contactPhone: contactForm.contactPhone,
        message: contactForm.message,
        recipientEmail: 'mk581991@gmail.com',
        recipientName: 'ApnaDera Support',
        recipientType: 'support'
      }

      await sendContactInquiry(contactData)
      toast.success('Message sent successfully! We will get back to you soon.')
      
      setContactForm({
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        message: ''
      })
    } catch (error) {
      toast.error(error.message || 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="heading-2">Contact Us</h1>
            <p className="text-body mt-2">
              Get in touch with us for any questions or support
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="heading-3 mb-4">Get in Touch</h2>
                <p className="text-body text-gray-600 mb-6">
                  Have questions about our properties or need assistance? 
                  We're here to help! Send us a message and we'll get back to you as soon as possible.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">mk581991@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+91 8851715097</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-600">200 Muzaffarnagar, UP 251315</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h3 className="heading-3 mb-6">Send us a Message</h3>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    id="contactName"
                    type="text"
                    name="contactName"
                    value={contactForm.contactName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    name="contactEmail"
                    value={contactForm.contactEmail}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="contactPhone"
                    type="tel"
                    name="contactPhone"
                    value={contactForm.contactPhone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number (optional)"
                    className="input"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    className="input"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-primary w-full flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage 