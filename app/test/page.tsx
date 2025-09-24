'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function TestPage() {
  const router = useRouter()
  const [clicks, setClicks] = useState(0)

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-8">TEST PAGE</h1>

          <div className="bg-dark-card p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Test 1: Simple Button</h2>
            <button
              onClick={() => {
                setClicks(prev => prev + 1)
                alert('Button clicked! Clicks: ' + (clicks + 1))
              }}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold"
            >
              CLICK ME (Should work!)
            </button>
            <p className="text-gray-300 mt-2">Clicks: {clicks}</p>
          </div>

          <div className="bg-dark-card p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Test 2: Router Navigation</h2>
            <button
              onClick={() => {
                alert('Navigating to home...')
                router.push('/')
              }}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold mr-4"
            >
              Go Home
            </button>
            <button
              onClick={() => {
                alert('Navigating to /admin/articles/new...')
                router.push('/admin/articles/new')
              }}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold"
            >
              Go to Create Article
            </button>
          </div>

          <div className="bg-dark-card p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Test 3: Console Check</h2>
            <button
              onClick={() => {
                console.log('Console test - check browser console')
                alert('Check browser console (F12)')
              }}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg font-bold"
            >
              Check Console
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
