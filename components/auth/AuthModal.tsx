'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Lock, User, Github, Chrome, Twitter } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup'
}

const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { signIn, signUp, signInWithProvider } = useAuth()

  useEffect(() => {
    if (isOpen) {
      // Only prevent scroll on mobile (full screen modal)
      const isMobile = window.innerWidth < 1024
      if (isMobile) {
        document.body.style.overflow = 'hidden'
      }
      
      setMode(initialMode)
      setError('')
      setSuccess('')
    } else {
      // Restore scroll
      document.body.style.overflow = ''
      
      setEmail('')
      setPassword('')
      setFullName('')
      setUsername('')
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, initialMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) throw error
        
        setSuccess('Successfully signed in! Welcome back.')
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        const { error } = await signUp(email, password, {
          full_name: fullName,
          username: username,
        })
        if (error) throw error
        
        setSuccess('Account created! Please check your email to verify your account.')
        setTimeout(() => {
          onClose()
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleProviderAuth = async (provider: 'google' | 'github' | 'twitter') => {
    setLoading(true)
    setError('')

    try {
      const { error } = await signInWithProvider(provider)
      if (error) throw error
      
      // The redirect will happen automatically
      setSuccess(`Redirecting to ${provider}...`)
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`)
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <div className="bg-black border border-primary-red/30 rounded-2xl shadow-2xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-[10001] w-8 h-8 bg-gray-800/80 hover:bg-primary-red/80 text-white rounded-full flex items-center justify-center transition-all duration-200"
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
                  <User size={32} />
                </div>
                <h2 className="text-2xl font-black mb-2">
                  {mode === 'signin' ? 'Welcome Back' : 'Join Viral Motors'}
                </h2>
                <p className="text-white/90 text-sm">
                  {mode === 'signin' 
                    ? 'Sign in to access your personalized automotive experience'
                    : 'Create your account and join the automotive community'
                  }
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {success ? (
                // Success State
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {mode === 'signin' ? 'Welcome Back!' : 'Account Created!'}
                  </h3>
                  <p className="text-gray-400 mb-4">{success}</p>
                </div>
              ) : (
                <>
                  {/* Social Login */}
                  <div className="space-y-3 mb-6">
                    <button
                      onClick={() => handleProviderAuth('google')}
                      disabled={loading}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                      <Chrome size={20} className="mr-3" />
                      Continue with Google
                    </button>
                    <button
                      onClick={() => handleProviderAuth('github')}
                      disabled={loading}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                      <Github size={20} className="mr-3" />
                      Continue with GitHub
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-black px-2 text-gray-400">Or continue with email</span>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                      <>
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-semibold text-white mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <User size={20} className="absolute left-3 top-3 text-gray-400" />
                            <input
                              type="text"
                              id="fullName"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Your full name"
                              required
                              className="w-full pl-10 pr-4 py-3 bg-gray-900 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red transition-colors duration-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="username" className="block text-sm font-semibold text-white mb-2">
                            Username
                          </label>
                          <div className="relative">
                            <User size={20} className="absolute left-3 top-3 text-gray-400" />
                            <input
                              type="text"
                              id="username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                              placeholder="Choose a username"
                              required
                              className="w-full pl-10 pr-4 py-3 bg-gray-900 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red transition-colors duration-200"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={20} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          required
                          className="w-full pl-10 pr-4 py-3 bg-gray-900 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red transition-colors duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock size={20} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          minLength={6}
                          className="w-full pl-10 pr-4 py-3 bg-gray-900 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red transition-colors duration-200"
                        />
                      </div>
                      {mode === 'signup' && (
                        <p className="mt-2 text-xs text-gray-500">
                          Password must be at least 6 characters long
                        </p>
                      )}
                    </div>

                    {error && (
                      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary-red hover:bg-primary-red-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
                    >
                      {loading ? (
                        <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                      ) : (
                        mode === 'signin' ? 'Sign In' : 'Create Account'
                      )}
                    </button>

                    {/* Mode Switch */}
                    <div className="text-center pt-4 border-t border-gray-700">
                      <p className="text-gray-400 text-sm">
                        {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setMode(mode === 'signin' ? 'signup' : 'signin')
                            setError('')
                            setSuccess('')
                          }}
                          className="text-primary-red hover:text-primary-red-light font-semibold transition-colors duration-200"
                        >
                          {mode === 'signin' ? 'Sign up' : 'Sign in'}
                        </button>
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
    </div>
  )

  return (
    <>
      {/* Mobile: Full screen modal */}
      <div className="lg:hidden fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm">
        <div 
          className="absolute inset-0"
          onClick={onClose}
        />
        
        <div className="flex min-h-full items-start justify-center pt-8 p-4 overflow-y-auto">
          <div className="relative w-full max-w-md z-10 animate-slide-down">
            {modalContent}
          </div>
        </div>
      </div>

      {/* Desktop: Simple dropdown from navbar */}
      <div className="hidden lg:block fixed top-16 right-6 z-[9999] w-96 animate-dropdown">
        {modalContent}
      </div>
    </>
  )
}

export default AuthModal
