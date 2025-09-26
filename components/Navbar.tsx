'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu, X, Facebook, Twitter, Instagram, Youtube, User, LogOut, Settings, Bookmark, Bell } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './auth/AuthModal'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin')
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  
  const { user, profile, signOut, loading } = useAuth()

  const navigationItems = [
    { name: 'News', href: '/news' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Viral', href: '/viral' },
    { name: 'Guides', href: '/guides' },
    { name: 'Videos', href: '/videos' },
  ]

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/viralmotors', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/viralmotors', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/viralmotors', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com/viralmotors', label: 'YouTube' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log('Searching for:', searchQuery)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setUserDropdownOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Error signing out: ' + (error as Error).message)
    }
  }

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode)
    setAuthModalOpen(true)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md shadow-lg transition-all duration-300">
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/images/vm-logo.png"
              alt="Viral Motors"
              width={56}
              height={56}
              className="transition-transform duration-200 group-hover:scale-105"
            />
            <Image
              src="/images/viral-motors-text.png"
              alt="Viral Motors"
              width={140}
              height={32}
              className="transition-opacity duration-200 group-hover:opacity-80"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-dark-text hover:text-primary-red font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-red group-hover:w-full transition-all duration-200"></span>
              </Link>
            ))}
          </div>

          {/* Search Bar & Social Icons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 bg-dark-card text-dark-text placeholder-gray-400 rounded-lg border border-gray-600 focus:border-primary-red focus:outline-none focus:ring-1 focus:ring-primary-red transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-red transition-colors duration-200"
              >
                <Search size={18} />
              </button>
            </form>

            {/* User Authentication */}
            <div className="flex items-center space-x-4 border-l border-gray-600 pl-4">
              {user ? (
                /* User Dropdown */
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-3 text-dark-text hover:text-primary-red transition-colors duration-200"
                  >
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name || profile.username || user.email || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-red rounded-full flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                    <span className="font-medium">
                      {profile?.full_name || profile?.username || user.email || 'User'}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-dark-card border border-gray-600 rounded-lg shadow-xl py-2 z-50">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-3 text-dark-text hover:bg-gray-700 hover:text-primary-red transition-colors duration-200"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <User size={16} className="mr-3" />
                        View Profile
                      </Link>
                      {profile?.role === 'admin' && (
                        <>
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-3 text-dark-text hover:bg-gray-700 hover:text-primary-red transition-colors duration-200"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <Settings size={16} className="mr-3" />
                            Admin Dashboard
                          </Link>
                          <Link
                            href="/admin/articles/new"
                            className="flex items-center px-4 py-3 text-dark-text hover:bg-gray-700 hover:text-primary-red transition-colors duration-200"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <Bookmark size={16} className="mr-3" />
                            Create Article
                          </Link>
                          <div className="border-t border-gray-600 my-2"></div>
                        </>
                      )}
                      <Link
                        href="/bookmarks"
                        className="flex items-center px-4 py-3 text-dark-text hover:bg-gray-700 hover:text-primary-red transition-colors duration-200"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Bookmark size={16} className="mr-3" />
                        Saved Articles
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-3 text-dark-text hover:bg-gray-700 hover:text-primary-red transition-colors duration-200"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Settings size={16} className="mr-3" />
                        Settings
                      </Link>
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-3 text-dark-text hover:bg-gray-700 hover:text-primary-red transition-colors duration-200"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Settings size={16} className="mr-3" />
                        Admin Panel
                      </Link>
                      <div className="border-t border-gray-600 my-2"></div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-3 text-dark-text hover:bg-gray-700 hover:text-primary-red transition-colors duration-200"
                      >
                        <LogOut size={16} className="mr-3" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Auth Buttons */
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="text-dark-text hover:text-primary-red font-medium transition-colors duration-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="bg-primary-red hover:bg-primary-red-light text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-dark-text hover:text-primary-red transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-dark-bg/95 backdrop-blur-md border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-6">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-dark-card text-dark-text placeholder-gray-400 rounded-lg border border-gray-600 focus:border-primary-red focus:outline-none focus:ring-1 focus:ring-primary-red transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-red transition-colors duration-200"
              >
                <Search size={20} />
              </button>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-4 mb-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-dark-text hover:text-primary-red font-medium py-2 transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile User Actions */}
            <div className="pt-4 border-t border-gray-700">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 py-2">
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name || profile.username || user.email || 'User'}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary-red rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-dark-text font-medium">
                        {profile?.full_name || profile?.username || user.email || 'User'}
                      </p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center text-dark-text hover:text-primary-red py-2 transition-colors duration-200"
                    >
                      <User size={18} className="mr-3" />
                      View Profile
                    </Link>
                    <Link
                      href="/bookmarks"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center text-dark-text hover:text-primary-red py-2 transition-colors duration-200"
                    >
                      <Bookmark size={18} className="mr-3" />
                      Saved Articles
                    </Link>
                    {profile?.role === 'admin' && (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center text-dark-text hover:text-primary-red py-2 transition-colors duration-200"
                        >
                          <Settings size={18} className="mr-3" />
                          Admin Dashboard
                        </Link>
                        <Link
                          href="/admin/articles/new"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center text-dark-text hover:text-primary-red py-2 transition-colors duration-200"
                        >
                          <Bookmark size={18} className="mr-3" />
                          Create Article
                        </Link>
                      </>
                    )}
                    <Link
                      href="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center text-dark-text hover:text-primary-red py-2 transition-colors duration-200"
                    >
                      <Settings size={18} className="mr-3" />
                      Settings
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center text-dark-text hover:text-primary-red py-2 transition-colors duration-200"
                    >
                      <Settings size={18} className="mr-3" />
                      Admin Panel
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center text-dark-text hover:text-primary-red py-2 transition-colors duration-200 w-full text-left"
                    >
                      <LogOut size={18} className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      openAuthModal('signin')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full text-center text-dark-text hover:text-primary-red font-medium py-3 border border-gray-600 rounded-lg transition-colors duration-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal('signup')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full bg-primary-red hover:bg-primary-red-light text-white py-3 rounded-lg font-medium transition-all duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </nav>
  )
}

export default Navbar
