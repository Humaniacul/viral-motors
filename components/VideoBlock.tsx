'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Pause, Volume2, VolumeX, Maximize, Clock, Eye } from 'lucide-react'

interface VideoContent {
  id: string
  title: string
  thumbnail: string
  duration: string
  views: number
  category: string
  slug: string
  videoUrl?: string
  isYouTube?: boolean
  youtubeId?: string
  isTikTok?: boolean
  tiktokId?: string
  author: string
  publishedAt: string
}

const VideoBlock = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Sample video content - replace with real data
  const videoContent: VideoContent[] = [
    {
      id: '1',
      title: 'Lamborghini Huracán vs McLaren 720S: Ultimate Supercar Battle',
      thumbnail: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop',
      duration: '12:45',
      views: 2500000,
      category: 'Reviews',
      slug: 'lamborghini-vs-mclaren-battle',
      isYouTube: true,
      youtubeId: 'dQw4w9WgXcQ',
      author: 'Viral Motors',
      publishedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Tesla Model S Plaid 0-200 mph in 60 Seconds',
      thumbnail: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop',
      duration: '8:32',
      views: 1800000,
      category: 'Performance',
      slug: 'tesla-plaid-acceleration-test',
      isYouTube: true,
      youtubeId: 'dQw4w9WgXcQ',
      author: 'Viral Motors',
      publishedAt: '2024-01-14'
    },
    {
      id: '3',
      title: 'POV: Driving the New BMW M3 Competition',
      thumbnail: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop',
      duration: '15:20',
      views: 950000,
      category: 'POV',
      slug: 'bmw-m3-pov-drive',
      isTikTok: true,
      tiktokId: '7234567890123456789',
      author: 'Viral Motors',
      publishedAt: '2024-01-13'
    },
    {
      id: '4',
      title: 'Restoring a 1967 Ford Mustang: Complete Build',
      thumbnail: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=600&h=400&fit=crop',
      duration: '25:10',
      views: 3200000,
      category: 'Restoration',
      slug: 'ford-mustang-restoration',
      isYouTube: true,
      youtubeId: 'dQw4w9WgXcQ',
      author: 'Viral Motors',
      publishedAt: '2024-01-12'
    },
    {
      id: '5',
      title: 'Track Day Special: Porsche 911 GT3 RS at Laguna Seca',
      thumbnail: 'https://images.unsplash.com/photo-1611566026373-c6c8da0ea861?w=600&h=400&fit=crop',
      duration: '18:45',
      views: 1200000,
      category: 'Track',
      slug: 'porsche-gt3-rs-track-day',
      isYouTube: true,
      youtubeId: 'dQw4w9WgXcQ',
      author: 'Viral Motors',
      publishedAt: '2024-01-11'
    },
    {
      id: '6',
      title: 'Electric vs Gas: The Future of Supercars',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      duration: '22:30',
      views: 4100000,
      category: 'Analysis',
      slug: 'electric-vs-gas-supercars',
      isYouTube: true,
      youtubeId: 'dQw4w9WgXcQ',
      author: 'Viral Motors',
      publishedAt: '2024-01-10'
    }
  ]

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`
    return views.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    return `${Math.ceil(diffDays / 7)} weeks ago`
  }

  const handleVideoSelect = (video: VideoContent) => {
    setSelectedVideo(video)
    setIsPlaying(false)
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const mainVideo = selectedVideo || videoContent[0]
  const sidebarVideos = videoContent.filter(video => video.id !== mainVideo.id).slice(0, 4)

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-primary-red rounded-xl flex items-center justify-center mx-auto mb-4">
            <Play size={24} className="text-white ml-1" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-dark-text mb-4">
            Latest Videos
          </h2>
          <p className="text-lg text-dark-text-secondary max-w-2xl mx-auto">
            Experience the thrill through our exclusive video content - from track tests to detailed reviews
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            <div className="relative bg-dark-card rounded-xl overflow-hidden shadow-card group">
              {/* Video Container */}
              <div className="relative aspect-video bg-black">
                {mainVideo.isYouTube ? (
                  // YouTube Embed
                  <iframe
                    src={`https://www.youtube.com/embed/${mainVideo.youtubeId}?autoplay=0&mute=1&controls=1&rel=0`}
                    title={mainVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : mainVideo.isTikTok ? (
                  // TikTok Embed Placeholder
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play size={48} className="mx-auto mb-4 opacity-60" />
                      <p className="text-sm opacity-80">TikTok Video</p>
                      <p className="text-xs opacity-60">{mainVideo.title}</p>
                    </div>
                  </div>
                ) : (
                  // Custom Video Player
                  <div className="relative w-full h-full">
                    <Image
                      src={mainVideo.thumbnail}
                      alt={mainVideo.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={togglePlayPause}
                        className="w-20 h-20 bg-primary-red/90 hover:bg-primary-red rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                      >
                        <Play size={32} className="text-white ml-1" />
                      </button>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                      {mainVideo.duration}
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 mr-4">
                    <span className="inline-block bg-primary-red text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
                      {mainVideo.category}
                    </span>
                    <h3 className="text-2xl font-bold text-dark-text mb-3 leading-tight">
                      {mainVideo.title}
                    </h3>
                    
                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Eye size={16} className="mr-2" />
                        <span>{formatViews(mainVideo.views)} views</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2" />
                        <span>{mainVideo.duration}</span>
                      </div>
                      <span>{formatDate(mainVideo.publishedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    by <span className="text-primary-red font-semibold">{mainVideo.author}</span>
                  </div>
                  
                  <Link
                    href={`/videos/${mainVideo.slug}`}
                    className="btn-primary text-sm px-6 py-2"
                  >
                    Watch Full Video
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Video Sidebar */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-dark-text mb-6">More Videos</h3>
            
            {sidebarVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoSelect(video)}
                className="flex space-x-4 p-4 rounded-lg hover:bg-dark-card cursor-pointer transition-colors duration-200 group"
              >
                {/* Thumbnail */}
                <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="128px"
                  />
                  
                  {/* Duration */}
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white px-2 py-0.5 rounded text-xs font-medium">
                    {video.duration}
                  </div>
                  
                  {/* Play Icon */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Play size={20} className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span className="text-primary-red text-xs font-semibold uppercase tracking-wide">
                    {video.category}
                  </span>
                  <h4 className="text-dark-text font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary-red transition-colors duration-200">
                    {video.title}
                  </h4>
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <span>{formatViews(video.views)} views</span>
                    <span>{formatDate(video.publishedAt)}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* View All Videos Button */}
            <Link
              href="/videos"
              className="block w-full text-center bg-dark-card hover:bg-primary-red text-dark-text hover:text-white py-4 rounded-lg font-semibold transition-all duration-200 mt-6"
            >
              View All Videos
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoBlock
