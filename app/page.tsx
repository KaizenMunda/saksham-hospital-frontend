'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from '@/components/ui/nav'
import { PatientsTable } from '@/components/patients/PatientsTable'
import { EditPatientDialog } from '@/components/patients/EditPatientDialog'
import { type Patient } from "@/app/patients/types"
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

// Mock users with hospital-specific roles
const USERS = [
  { id: '1', name: 'Dr. Saksham', role: 'Admin', department: 'Management' },
  { id: '2', name: 'Dr. Sarah', role: 'Doctor', department: 'Cardiology' },
  { id: '3', name: 'Dr. John', role: 'Doctor', department: 'Pediatrics' },
  { id: '4', name: 'Nurse Jane', role: 'Nurse', department: 'ICU' },
  { id: '5', name: 'Mr. Smith', role: 'Reception', department: 'Front Desk' }
]

// Mock patients data
const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    patientId: 'P0000001',
    name: 'John Doe',
    dateOfBirth: new Date('1978-05-15'),
    gender: 'Male',
    contact: '+91 98765 43210',
    address: '123 Main St',
    createdAt: new Date(),
    lastVisit: new Date(),
    lastVisitType: 'OPD'
  },
  {
    id: '2',
    patientId: 'P0000002',
    name: 'Jane Smith',
    dateOfBirth: new Date('1991-08-23'),
    gender: 'Female',
    contact: '+91 98765 43211',
    address: '456 Oak St',
    createdAt: new Date(),
    lastVisit: new Date(),
    lastVisitType: 'IPD'
  },
  // Add more mock patients as needed
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Saksham Logo" 
              width={40} 
              height={40} 
            />
            <span className="text-xl font-bold">Saksham</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#" className="hover:text-primary font-medium">Home</a>
            <a href="#services" className="hover:text-primary font-medium">Services</a>
            <a href="#about" className="hover:text-primary font-medium">About</a>
            <a href="#news" className="hover:text-primary font-medium">News</a>
            <a href="#doctors" className="hover:text-primary font-medium">Doctors</a>
            <a href="#contact" className="hover:text-primary font-medium">Appointments</a>
          </nav>
          <div className="flex gap-4">
            <Link href="/login" passHref>
              <Button variant="outline" className="bg-orange-500 text-white border-orange-500 hover:bg-orange-600">
                Patient Portal
              </Button>
            </Link>
            <Link href="/login" passHref>
              <Button className="bg-green-500 text-white hover:bg-green-600">
                Staff Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-0 bg-cover bg-center" style={{ backgroundImage: 'url(/dental-clinic.jpg)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container relative z-10 mx-auto px-6 py-24 md:py-36">
          <div className="max-w-xl">
            <div className="inline-block px-4 py-2 bg-orange-500 text-white rounded-full mb-6">
              Trusted Healthcare Provider
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Your Health Is Our <span className="text-orange-500">Top Priority</span>
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Experience exceptional care with our dedicated team of healthcare professionals using the latest medical technology.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Book Appointment
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                Our Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Information Box */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="col-span-2">
              {/* Services preview would go here */}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-2">Quick Information</h2>
              <p className="text-gray-600 mb-6">Everything you need to know</p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-full text-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Working Hours</h3>
                    <p className="text-gray-600">Emergency: 24/7</p>
                    <p className="text-gray-600">Regular: 8:00 AM - 8:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-full text-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Emergency Contact</h3>
                    <p className="text-gray-600">Main: (123) 456-7890</p>
                    <p className="text-gray-600">Ambulance: (123) 456-7999</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-full text-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-gray-600">123 Healing Avenue</p>
                    <p className="text-gray-600">Cityville, State 12345</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Primary Care',
                description: 'Comprehensive healthcare services for all your basic medical needs.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              },
              {
                title: 'Specialized Treatment',
                description: 'Advanced medical care for specific conditions and specialized needs.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              },
              {
                title: 'Emergency Care',
                description: '24/7 emergency services for immediate medical attention when you need it most.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                )
              }
            ].map((service, index) => (
              <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Saksham</h3>
              <p className="text-gray-400">
                Providing quality healthcare services for over 20 years.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white">Services</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <address className="text-gray-400 not-italic">
                123 Healthcare Avenue<br />
                Medical District<br />
                City, State 12345<br />
                <a href="tel:+1234567890" className="hover:text-white">Phone: (123) 456-7890</a>
              </address>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Staff</h3>
              <Link href="/login" passHref>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                  Staff Portal
                </Button>
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Saksham. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

