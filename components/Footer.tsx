'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, Send, Heart, ExternalLink } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubscribing(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubscriptionStatus('success')
      setEmail('')
      setTimeout(() => setSubscriptionStatus('idle'), 3000)
    } catch (error) {
      setSubscriptionStatus('error')
      setTimeout(() => setSubscriptionStatus('idle'), 3000)
    } finally {
      setIsSubscribing(false)
    }
  }

  const footerLinks = {
    content: [
      { name: 'Latest News', href: '/news' },
      { name: 'Car Reviews', href: '/reviews' },
      { name: 'Viral Content', href: '/viral' },
      { name: 'Buyer\'s Guides', href: '/guides' },
      { name: 'Video Reviews', href: '/videos' },
      { name: 'Electric Cars', href: '/electric' },
    ],
    categories: [
      { name: 'Supercars', href: '/category/supercars' },
      { name: 'Electric Vehicles', href: '/category/electric' },
      { name: 'Luxury Cars', href: '/category/luxury' },
      { name: 'Performance', href: '/category/performance' },
      { name: 'Classics', href: '/category/classics' },
      { name: 'Motorcycles', href: '/category/motorcycles' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/team' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press Kit', href: '/press' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Advertise', href: '/advertise' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Editorial Guidelines', href: '/editorial-guidelines' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ]
  }

  const socialLinks = [
    { 
      icon: Facebook, 
      href: 'https://facebook.com/viralmotors', 
      label: 'Facebook',
      followers: '2.5M'
    },
    { 
      icon: Twitter, 
      href: 'https://twitter.com/viralmotors', 
      label: 'Twitter',
      followers: '1.8M'
    },
    { 
      icon: Instagram, 
      href: 'https://instagram.com/viralmotors', 
      label: 'Instagram',
      followers: '3.2M'
    },
    { 
      icon: Youtube, 
      href: 'https://youtube.com/viralmotors', 
      label: 'YouTube',
      followers: '4.1M'
    },
  ]

  const partnerBrands = [
    'BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Ferrari', 'Lamborghini',
    'Porsche', 'McLaren', 'Bugatti', 'Rolls-Royce'
  ]

  return (
    <footer className="bg-black text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary-red to-primary-red-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left mb-8 lg:mb-0">
              <h3 className="text-2xl md:text-3xl font-black mb-2">
                Stay in the Fast Lane
              </h3>
              <p className="text-white/90 text-lg">
                Get the latest automotive news, reviews, and viral content delivered to your inbox
              </p>
            </div>

            {/* Newsletter Form */}
            <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row gap-4 lg:w-96">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isSubscribing}
                    className="w-full px-4 py-3 bg-white text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribing || !email.trim()}
                  className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Subscribe
                    </>
                  )}
                </button>
              </div>
              
              {/* Success/Error Messages */}
              {subscriptionStatus === 'success' && (
                <p className="text-white mt-2 text-sm flex items-center">
                  <Heart size={16} className="mr-2" />
                  Thank you for subscribing! Check your inbox for confirmation.
                </p>
              )}
              {subscriptionStatus === 'error' && (
                <p className="text-white/90 mt-2 text-sm">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <Image
                src="/images/vm-logo.png"
                alt="Viral Motors"
                width={64}
                height={64}
                className="transition-transform duration-200 group-hover:scale-105"
              />
              <Image
                src="/images/viral-motors-text.png"
                alt="Viral Motors"
                width={160}
                height={36}
                className="transition-opacity duration-200 group-hover:opacity-80"
              />
            </Link>

            {/* Description */}
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your premier destination for automotive news, reviews, and viral content. 
              Driving the conversation in the automotive world.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center">
                <MapPin size={16} className="mr-3 text-primary-red" />
                <span>Los Angeles, California</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-3 text-primary-red" />
                <span>+1 (555) 123-MOTORS</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-3 text-primary-red" />
                <span>hello@viralmotors.com</span>
              </div>
            </div>
          </div>

          {/* Content Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Content</h4>
            <ul className="space-y-3">
              {footerLinks.content.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-red transition-colors duration-200 flex items-center group"
                  >
                    {link.name}
                    <ExternalLink size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6">Categories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-red transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-red transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold mb-6">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-red transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-8 lg:mb-0">
              <h4 className="text-xl font-bold mb-4 text-center lg:text-left">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative"
                    >
                      <div className="w-12 h-12 bg-gray-800 hover:bg-primary-red rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                        <IconComponent size={20} className="text-gray-400 group-hover:text-white" />
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {social.followers} followers
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Partner Brands */}
            <div className="text-center lg:text-right">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Trusted by Leading Brands</h4>
              <div className="flex flex-wrap justify-center lg:justify-end gap-4 text-xs text-gray-500">
                {partnerBrands.map((brand) => (
                  <span key={brand} className="hover:text-primary-red transition-colors duration-200 cursor-default">
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2024 Viral Motors. All rights reserved.</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <span>Made with</span>
              <Heart size={16} className="text-primary-red animate-pulse" />
              <span>for car enthusiasts worldwide</span>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span>Powered by Next.js</span>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <span>Hosted on Vercel</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
