import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SectionBlock from '../../components/SectionBlock'
import VideoBlock from '../../components/VideoBlock'

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-dark-text">Videos</h1>
            <p className="text-dark-text-secondary mt-2">Track tests, POV drives, tech breakdowns and more.</p>
          </header>

          <SectionBlock title="" layout="minimal">
            <VideoBlock />
          </SectionBlock>
        </div>
      </main>

      <Footer />
    </div>
  )
}


