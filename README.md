# 🚗 Viral Motors - Modern Automotive News Website

A cutting-edge, responsive automotive news website built with Next.js 14, TypeScript, and Tailwind CSS. Features a dark-mode-first design with premium styling, smooth animations, and modern UX patterns.

![Viral Motors Preview](https://via.placeholder.com/1200x600/1a1a1a/e50914?text=Viral+Motors)

## ✨ Features

### 🎨 Design & UI
- **Dark Mode First** - Sleek black (#1a1a1a) background with red (#e50914) accents
- **Premium Typography** - Inter font family for optimal readability
- **Smooth Animations** - Subtle hover effects, fade-ins, and scale transitions
- **Modern Cards** - Rounded corners, shadows, and hover effects
- **Responsive Grid** - Mobile-first design that works on all devices

### 🏗️ Core Components
- **Hero Section** - Full-width featured stories with image overlays
- **Navigation** - Sticky navbar with search, categories, and social icons
- **Article Cards** - Multiple layouts (vertical, horizontal, minimal, large)
- **Viral Section** - Horizontal scrolling trending content
- **Video Block** - Embedded YouTube/TikTok content with hover effects
- **Newsletter Modal** - Elegant subscription popup with interest selection
- **Footer** - Comprehensive links, social media, and company info

### 🚀 Performance & SEO
- **Next.js 14** - Latest React framework with App Router
- **Image Optimization** - Automatic WebP/AVIF conversion and lazy loading
- **SEO Ready** - Meta tags, Open Graph, Twitter Cards, structured data
- **Fast Loading** - Optimized CSS, tree-shaking, and code splitting
- **Accessibility** - ARIA labels, focus states, keyboard navigation

### 📱 Responsive Design
- **Mobile First** - Optimized for mobile devices
- **Tablet Friendly** - Perfect experience on iPads and tablets  
- **Desktop Enhanced** - Rich experience on large screens
- **Touch Optimized** - Gesture-friendly interface

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Deployment**: [Vercel](https://vercel.com/) (recommended)

## 📁 Project Structure

```
viral-motors/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout with SEO and metadata
│   └── page.tsx           # Homepage component
├── components/            # Reusable React components
│   ├── ArticleCard.tsx    # Article display component (4 layouts)
│   ├── Footer.tsx         # Site footer with links and newsletter
│   ├── Hero.tsx           # Featured story carousel
│   ├── Navbar.tsx         # Navigation with search and mobile menu
│   ├── NewsletterModal.tsx # Newsletter subscription popup
│   ├── SectionBlock.tsx   # Layout component for content sections
│   ├── VideoBlock.tsx     # Video content with embedded players
│   └── ViralSection.tsx   # Horizontal scrolling viral content
├── public/                # Static assets
└── styles/                # Additional CSS files (if needed)
```

## 🎯 Color Palette

```css
/* Primary Colors */
--primary-red: #e50914;      /* Main brand color */
--primary-red-dark: #b8070f; /* Hover states */
--primary-red-light: #ff1e2d; /* Accents */

/* Dark Theme */
--dark-bg: #1a1a1a;         /* Main background */
--dark-card: #333333;       /* Card backgrounds */
--dark-text: #f5f5f5;       /* Primary text */
--dark-text-secondary: #cccccc; /* Secondary text */

/* Light Theme (Optional) */
--light-bg: #ffffff;        /* Light background */
--light-card: #f8f9fa;      /* Light card backgrounds */
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd viral-motors
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## 🎨 Customization

### Colors
Edit the color scheme in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    red: '#e50914',           // Change brand color
    'red-dark': '#b8070f',
    'red-light': '#ff1e2d',
  },
  // ... other colors
}
```

### Fonts
Update fonts in `app/layout.tsx` and `tailwind.config.js`:
```javascript
import { Roboto } from 'next/font/google' // Change font

const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'] 
})
```

### Content
Replace sample data in `app/page.tsx` with your CMS or API integration:
```typescript
// Replace sampleArticles array with API calls
const articles = await fetchArticles()
```

## 📊 SEO Features

### Meta Tags
- Complete Open Graph implementation
- Twitter Cards for social sharing
- Proper meta descriptions and keywords
- Canonical URLs

### Structured Data
- NewsMediaOrganization schema
- Article schemas for individual posts
- Breadcrumb navigation
- FAQ schemas (when applicable)

### Performance
- Automatic image optimization
- Lazy loading for images and components
- Tree-shaking and code splitting
- Critical CSS inlining

## 🔧 Configuration

### Environment Variables
Create `.env.local` for environment-specific settings:
```bash
NEXT_PUBLIC_SITE_URL=https://viralmotors.com
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEWSLETTER_API_URL=your-newsletter-service-url
```

### Deployment
The site is optimized for Vercel deployment:
1. Connect your Git repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

## 🎯 Future Enhancements

### Phase 2 Features
- [ ] User authentication and profiles
- [ ] Comment system with moderation
- [ ] Advanced search with filters
- [ ] Content management system integration
- [ ] Push notifications
- [ ] Progressive Web App (PWA) features

### Phase 3 Features
- [ ] Membership/subscription tiers
- [ ] Live streaming integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern automotive publications
- Community feedback and suggestions
- Open source contributors and maintainers

---

**Built with ❤️ for car enthusiasts worldwide**

For questions or support, reach out to [hello@viralmotors.com](mailto:hello@viralmotors.com)
