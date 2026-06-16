'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    title: 'Concept Development',
    description: 'Strategic ideation, storyboarding, and creative direction that sets the foundation for unforgettable work.',
  },
  {
    title: 'Production',
    description: 'End-to-end commercial video production, from casting to set design to the final shoot day.',
  },
  {
    title: 'Animation & VFX',
    description: 'Cutting-edge CGI, motion graphics, and visual effects that push creative boundaries.',
  },
  {
    title: 'Post-Production',
    description: 'Editing, color grading, sound design, and finishing — polished to perfection.',
  },
  {
    title: 'Social Media Management',
    description: 'Content strategy, creation, and community management that drives engagement.',
  },
]

const clients = [
  'Powerade', 'Fanatics', 'NBA', 'Mercedes AMG', 'NFL',
  'Warner Bros', 'Celsius', 'Hublot', 'JD Sports', 'Bleacher Report',
  'BodyArmor', 'Crumbl Cookies',
]

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const logosRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.3,
        }
      )

      gsap.fromTo(
        contentRef.current?.children || [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          delay: 0.6,
        }
      )

      // Services animation
      if (servicesRef.current) {
        gsap.fromTo(
          servicesRef.current.querySelectorAll('.service-item'),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: servicesRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Logos animation
      if (logosRef.current) {
        gsap.fromTo(
          logosRef.current.querySelectorAll('.client-logo'),
          { opacity: 0, scale: 0.9 },
          {
            opacity: 0.5,
            scale: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: logosRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[80vh] flex flex-col justify-center px-6 md:px-12 pt-24 pb-16">
        <h1
          ref={headingRef}
          className="font-display text-[10vw] md:text-[8vw] font-bold uppercase text-white leading-[0.9] tracking-tight opacity-0"
        >
          We are Major
        </h1>
        <div ref={contentRef} className="mt-8 max-w-2xl">
          <p className="text-xl md:text-2xl text-gray-light font-light">
            A creative agency built for the modern era.
          </p>
          <p className="mt-6 text-base text-white/80 leading-relaxed">
            We craft bold narratives and striking visuals for brands that refuse to blend in.
            From concept to final cut, we deliver work that commands attention. Our team of
            directors, producers, and creative strategists partner with the world&apos;s leading
            brands to create content that moves people.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-6 md:px-12 py-20 border-t border-gray-mid/30">
        <h2 className="text-3xl md:text-4xl font-medium text-white mb-12">Services</h2>
        <div
          ref={servicesRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10"
        >
          {services.map((service, i) => (
            <div key={i} className="service-item">
              <h3 className="text-xl font-medium text-white mb-3">{service.title}</h3>
              <p className="text-gray-light leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Client Logos */}
      <section className="px-6 md:px-12 py-16 border-t border-b border-gray-mid/30">
        <p className="text-center text-sm text-gray-light uppercase tracking-widest mb-12">
          Trusted by
        </p>
        <div
          ref={logosRef}
          className="flex flex-wrap justify-center gap-8 md:gap-12"
        >
          {clients.map((client, i) => (
            <div
              key={i}
              className="client-logo text-white/50 font-display text-lg md:text-xl font-semibold uppercase tracking-wide hover:text-white/80 transition-colors duration-300 cursor-default"
            >
              {client}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase text-white mb-6">
          Ready to create?
        </h2>
        <p className="text-gray-light mb-8 max-w-lg mx-auto">
          Let&apos;s collaborate on your next project and make something unforgettable.
        </p>
        <a
          href="/contact"
          className="inline-block bg-white text-black px-10 py-4 rounded-full font-medium text-sm hover:bg-blue-accent hover:text-white transition-all duration-300"
        >
          Get in Touch
        </a>
      </section>

      <Footer />
    </div>
  )
}
