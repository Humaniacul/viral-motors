'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Clock, Star } from 'lucide-react'

interface SectionBlockProps {
  title: string
  subtitle?: string
  children: ReactNode
  viewAllLink?: string
  icon?: 'trending' | 'clock' | 'star' | null
  layout?: 'default' | 'centered' | 'minimal'
  className?: string
}

const SectionBlock = ({ 
  title, 
  subtitle, 
  children, 
  viewAllLink, 
  icon = null,
  layout = 'default',
  className = '' 
}: SectionBlockProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'trending':
        return <TrendingUp size={24} className="text-primary-red" />
      case 'clock':
        return <Clock size={24} className="text-primary-red" />
      case 'star':
        return <Star size={24} className="text-primary-red" />
      default:
        return null
    }
  }

  if (layout === 'centered') {
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Header */}
          <div className="text-center mb-12">
            {icon && (
              <div className="flex justify-center mb-4">
                {getIcon()}
              </div>
            )}
            <h2 className="text-3xl md:text-4xl font-black text-dark-text mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-dark-text-secondary max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="animate-fadeIn">
            {children}
          </div>

          {/* View All Button */}
          {viewAllLink && (
            <div className="text-center mt-12">
              <Link
                href={viewAllLink}
                className="inline-flex items-center btn-secondary hover:btn-primary group"
              >
                View All Articles
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          )}
        </div>
      </section>
    )
  }

  if (layout === 'minimal') {
    return (
      <section className={`py-8 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Minimal Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {icon && getIcon()}
              <h2 className="text-2xl font-bold text-dark-text">
                {title}
              </h2>
            </div>
            {viewAllLink && (
              <Link
                href={viewAllLink}
                className="text-primary-red hover:text-primary-red-light text-sm font-semibold flex items-center group transition-colors duration-200"
              >
                View All
                <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            )}
          </div>

          {/* Content */}
          <div className="animate-slideUp">
            {children}
          </div>
        </div>
      </section>
    )
  }

  // Default Layout
  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            {icon && getIcon()}
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-dark-text">
                {title}
              </h2>
              {subtitle && (
                <p className="text-dark-text-secondary mt-2">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* View All Link */}
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="inline-flex items-center text-primary-red hover:text-primary-red-light font-semibold group transition-colors duration-200"
            >
              View All
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          )}
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {children}
        </div>
      </div>
    </section>
  )
}

// Sub-components for common section patterns
export const TrendingSection = ({ children, ...props }: Omit<SectionBlockProps, 'icon'>) => (
  <SectionBlock icon="trending" {...props}>
    {children}
  </SectionBlock>
)

export const LatestSection = ({ children, ...props }: Omit<SectionBlockProps, 'icon'>) => (
  <SectionBlock icon="clock" {...props}>
    {children}
  </SectionBlock>
)

export const FeaturedSection = ({ children, ...props }: Omit<SectionBlockProps, 'icon'>) => (
  <SectionBlock icon="star" {...props}>
    {children}
  </SectionBlock>
)

// Loading skeleton component
export const SectionSkeleton = ({ layout = 'default' }: { layout?: 'default' | 'centered' | 'minimal' }) => {
  if (layout === 'centered') {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="skeleton w-8 h-8 mx-auto mb-4"></div>
            <div className="skeleton w-64 h-10 mx-auto mb-4"></div>
            <div className="skeleton w-96 h-6 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (layout === 'minimal') {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="skeleton w-6 h-6"></div>
              <div className="skeleton w-48 h-8"></div>
            </div>
            <div className="skeleton w-20 h-6"></div>
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Default skeleton
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="skeleton w-6 h-6"></div>
            <div className="skeleton w-64 h-10"></div>
          </div>
          <div className="skeleton w-24 h-6"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-96 rounded-xl"></div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SectionBlock
