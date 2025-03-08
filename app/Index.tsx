
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/hero/Hero";
import ServicesSection from "@/components/services/ServicesSection";
import DoctorGrid from "@/components/doctors/DoctorGrid";
import AboutSection from "@/components/about/AboutSection";
import AppointmentForm from "@/components/booking/AppointmentForm";
import NewsSection from "@/components/news/NewsSection";
import { useEffect } from "react";

const Index = () => {
  // Smooth scroll to sections when navigating through anchor links
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href') || "");
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Check for hash in URL on page load and scroll to it
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }, 500);
      }
    }
    
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', function (e) {
          e.preventDefault();
        });
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ServicesSection />
        <AboutSection />
        <NewsSection />
        <DoctorGrid />
        <AppointmentForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
