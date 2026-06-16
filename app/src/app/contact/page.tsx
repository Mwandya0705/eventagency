'use client'

import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react'
import gsap from 'gsap'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    hearAbout: '',
    budget: '',
    message: '',
  })

  const heroRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current?.querySelectorAll('.animate-in') || [],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      )

      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 }
      )
    })

    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Thank you for reaching out! We will get back to you soon.')
    setFormData({ name: '', organization: '', email: '', hearAbout: '', budget: '', message: '' })
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const inputClass =
    'w-full bg-[#0A0A0A] border border-gray-mid rounded-lg px-4 py-3.5 text-white text-sm placeholder-gray-light focus:outline-none focus:border-blue-accent transition-colors'

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <section className="min-h-screen flex items-center px-6 md:px-12 pt-24 pb-20">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column */}
          <div ref={heroRef} className="lg:sticky lg:top-32">
            <h1 className="animate-in font-display text-[12vw] lg:text-[8vw] font-bold uppercase text-white leading-[0.85]">
              Let&apos;s Build
            </h1>
            <p className="animate-in mt-8 text-gray-light text-base leading-relaxed max-w-md">
              Whether it&apos;s to discuss a project, explore our services, or join the team, reach
              out and start the conversation. Let&apos;s make it Major.
            </p>
          </div>

          {/* Right Column - Form */}
          <div ref={formRef} className="bg-gray-dark border border-gray-mid rounded-2xl p-8 md:p-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-white text-lg font-medium">Contact Us</h2>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-gray-light"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name*"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  type="text"
                  name="organization"
                  placeholder="Organization*"
                  required
                  value={formData.organization}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email*"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
              />

              <select
                name="hearAbout"
                value={formData.hearAbout}
                onChange={handleChange}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="" disabled>
                  How did you hear about us?
                </option>
                <option value="social">Social Media</option>
                <option value="referral">Referral</option>
                <option value="search">Search Engine</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
              </select>

              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="" disabled>
                  Estimated Budget?
                </option>
                <option value="10k-25k">$10k - $25k</option>
                <option value="25k-50k">$25k - $50k</option>
                <option value="50k-100k">$50k - $100k</option>
                <option value="100k+">$100k+</option>
              </select>

              <textarea
                name="message"
                placeholder="Message*"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
              />

              <button
                type="submit"
                className="w-full bg-white text-black font-medium py-3.5 rounded-lg hover:bg-blue-accent hover:text-white transition-all duration-300 text-sm"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
