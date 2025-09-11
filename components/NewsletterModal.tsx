'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Send, Heart, Check } from 'lucide-react'

interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
}

const NewsletterModal = ({ isOpen, onClose }: NewsletterModalProps) => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const interestOptions = [
    'Electric Vehicles',
    'Supercars',
    'Classic Cars',
    'Motorcycles',
    'Racing',
    'Car Reviews',
    'Industry News',
    'Viral Content'
  ]

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleInterestToggle = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Email address is required')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock success
      setIsSuccess(true)
      
      // Auto close after success
      setTimeout(() => {
        onClose()
        setTimeout(() => {
          setIsSuccess(false)
          setEmail('')
          setName('')
          setInterests([])
        }, 300)
      }, 2000)

    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
          <div className="bg-black border border-primary-red/30 rounded-2xl shadow-2xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-800/80 hover:bg-primary-red/80 text-white rounded-full flex items-center justify-center transition-all duration-200"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="relative bg-gradient-to-br from-primary-red to-primary-red-light p-8 text-white">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3Ccircle cx='53' cy='7' r='7'/%3E%3Ccircle cx='7' cy='53' r='7'/%3E%3Ccircle cx='53' cy='53' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
              </div>
              
              <div className="relative text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={32} />
                </div>
                <h2 className="text-2xl font-black mb-2">
                  Stay In The Loop
                </h2>
                <p className="text-white/90 text-sm">
                  Get exclusive automotive content, breaking news, and viral stories delivered straight to your inbox
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {isSuccess ? (
                // Success State
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Welcome to the Family!
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Check your inbox for a confirmation email. We can't wait to share amazing automotive content with you!
                  </p>
                  <div className="flex items-center justify-center text-primary-red">
                    <Heart size={20} className="mr-2 animate-pulse" />
                    <span className="text-sm font-medium">Thanks for joining us!</span>
                  </div>
                </div>
              ) : (
                // Form State
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your first name"
                      className="w-full px-4 py-3 bg-gray-900 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red transition-colors duration-200"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError('')
                      }}
                      placeholder="your.email@example.com"
                      required
                      className="w-full px-4 py-3 bg-gray-900 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red transition-colors duration-200"
                    />
                    {error && (
                      <p className="text-red-400 text-sm mt-2">{error}</p>
                    )}
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      What interests you most? (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {interestOptions.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleInterestToggle(interest)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                            interests.includes(interest)
                              ? 'bg-primary-red text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-white mb-2">
                      What you'll get:
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-400">
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary-red rounded-full mr-2"></div>
                        Breaking automotive news
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary-red rounded-full mr-2"></div>
                        Exclusive reviews & first looks
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary-red rounded-full mr-2"></div>
                        Viral automotive content
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary-red rounded-full mr-2"></div>
                        Weekly digest (no spam!)
                      </li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !email.trim()}
                    className="w-full bg-primary-red hover:bg-primary-red-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center group"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      <>
                        Subscribe Now
                        <Send size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </button>

                  {/* Privacy Note */}
                  <p className="text-xs text-gray-500 text-center">
                    We respect your privacy. Unsubscribe anytime.
                    <br />
                    By subscribing, you agree to our{' '}
                    <button 
                      type="button"
                      className="text-primary-red hover:text-primary-red-light transition-colors duration-200"
                    >
                      Privacy Policy
                    </button>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsletterModal
