'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useAuth } from '../../contexts/AuthContext'

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-black text-dark-text mb-8">Settings</h1>
          <div className="bg-dark-card rounded-2xl p-8 shadow-card text-gray-300">
            <p>Account ID: {user?.id}</p>
            <p className="mt-2">More settings coming soon.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


