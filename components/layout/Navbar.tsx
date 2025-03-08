
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, User, UserCog } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'About', href: '/#about' },
    { name: 'News', href: '/#news' },
    { name: 'Doctors', href: '/#doctors' },
    { name: 'Appointments', href: '/#appointments' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link to="/" className="relative z-10" onClick={closeMenu}>
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/3b545125-c507-4139-ab4c-62a3bbc8933c.png" 
                alt="Saksham" 
                className="h-10 w-auto" 
              />
              <div className={`ml-2 font-bold text-xl ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                Saksham
              </div>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isScrolled ? 'text-gray-700 hover:text-green-600' : 'text-white hover:text-green-200'
                } ${
                  (location.pathname === link.href || (location.pathname === '/' && link.href.startsWith('/#'))) 
                    ? 'underline underline-offset-4' : ''
                }`}
              >
                {link.name}
              </a>
            ))}
            
            <div className="flex items-center space-x-2">
              <Link to="/patient-portal">
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  size="sm"
                >
                  <User className="mr-2 h-4 w-4" />
                  Patient Portal
                </Button>
              </Link>
              
              <Link to="/staff-portal">
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  Staff Portal
                </Button>
              </Link>
            </div>
          </div>
          
          <button 
            className="md:hidden relative z-10"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full bg-white shadow-lg pt-24 pb-6 px-6 z-0 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="text-gray-900 hover:text-green-600 font-medium py-2"
                onClick={closeMenu}
              >
                {link.name}
              </a>
            ))}
            <Link 
              to="/patient-portal" 
              className="inline-flex items-center justify-center rounded-md bg-orange-500 text-white px-4 py-2 text-sm font-medium hover:bg-orange-600"
              onClick={closeMenu}
            >
              <User className="mr-2 h-4 w-4" />
              Patient Portal
            </Link>
            <Link 
              to="/staff-portal" 
              className="inline-flex items-center justify-center rounded-md bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700"
              onClick={closeMenu}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Staff Portal
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
