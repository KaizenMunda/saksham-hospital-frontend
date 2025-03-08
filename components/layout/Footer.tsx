
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-hospital-950 text-white">
      <div className="container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <a 
              href="/" 
              className="text-2xl font-bold flex items-center space-x-2"
            >
              <span className="text-hospital-300 text-3xl">+</span>
              <span>MediCare</span>
            </a>
            <p className="text-hospital-100/80 max-w-xs">
              Providing exceptional healthcare with compassion and cutting-edge technology for over 25 years.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-hospital-800/50 flex items-center justify-center hover:bg-hospital-700/50 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                </svg>
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-hospital-800/50 flex items-center justify-center hover:bg-hospital-700/50 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z" />
                </svg>
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-hospital-800/50 flex items-center justify-center hover:bg-hospital-700/50 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-hospital-800/50 flex items-center justify-center hover:bg-hospital-700/50 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight text-hospital-100">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#services" className="text-hospital-100/80 hover:text-hospital-300 transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#doctors" className="text-hospital-100/80 hover:text-hospital-300 transition-colors">
                  Our Doctors
                </a>
              </li>
              <li>
                <a href="#about" className="text-hospital-100/80 hover:text-hospital-300 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#appointment" className="text-hospital-100/80 hover:text-hospital-300 transition-colors">
                  Book Appointment
                </a>
              </li>
              <li>
                <a href="#" className="text-hospital-100/80 hover:text-hospital-300 transition-colors">
                  Patient Portal
                </a>
              </li>
              <li>
                <a href="#" className="text-hospital-100/80 hover:text-hospital-300 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight text-hospital-100">Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-hospital-100/80 hover:text-hospital-300 transition-colors">
                  Emergency Care
                </a>
              </li>
              <li>
                <a href="#" className="text-hospital-100/80 hover:text-hospital-300 transition-colors">
                  Primary Care
                </a>
              </li>
              <li>
                <a href="#" className="text-hospital-100/80 hover:text-hospital-300 transition-colors">
                  Pediatrics
                </a>
              </li>
              <li>
                <a href="#" className="text-hospital-100/80 hover:text-hospital-300 transition-colors">
                  Cardiology
                </a>
              </li>
              <li>
                <a href="#" className="text-hospital-100/80 hover:text-hospital-300 transition-colors">
                  Neurology
                </a>
              </li>
              <li>
                <a href="#" className="text-hospital-100/80 hover:text-hospital-300 transition-colors">
                  Orthopedics
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight text-hospital-100">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-hospital-300 shrink-0 mt-1" />
                <span className="text-hospital-100/80">
                  123 Healing Avenue<br />
                  Medical District<br />
                  Cityville, State 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-hospital-300" />
                <span className="text-hospital-100/80">(123) 456-7890</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-hospital-300" />
                <span className="text-hospital-100/80">info@medicare.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-hospital-800/50 text-center text-hospital-100/60 text-sm">
          <p>&copy; {currentYear} MediCare Hospital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
