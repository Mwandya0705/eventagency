export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 px-6 md:px-12 py-4">
      <div className="flex items-center justify-between text-xs text-gray-light">
        <span>&copy; 2026 Pamedia. All rights reserved.</span>
        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/thiswaspamedia/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/pamedia-media-agency/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white transition-colors cursor-pointer">Terms of Services</span>
          <a
            href="https://wearestokt.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Site by Stōkt
          </a>
        </div>
      </div>
    </footer>
  )
}
