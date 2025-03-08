
import { useState, useEffect } from 'react';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className={cn(
            "absolute inset-0 bg-green-800/30 z-10",
            "lazy-image",
            isLoaded ? "lazy-image-loaded" : "lazy-image-loading"
          )}
        ></div>
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center",
            "lazy-image",
            isLoaded ? "lazy-image-loaded" : "lazy-image-loading"
          )}
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop")'
          }}
        ></div>
      </div>

      <div className="container-custom relative z-20 pt-10 md:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={cn(
            "text-white space-y-6 max-w-2xl",
            "transition-all duration-700 transform",
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <div className="inline-block bg-orange-500/90 backdrop-blur-sm px-4 py-1 rounded-full animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <span className="text-sm font-medium">Trusted Healthcare Provider</span>
            </div>
            
            <h1 className="h1 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Your Health Is Our <span className="text-orange-300">Top Priority</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed">
              Experience exceptional care with our dedicated team of healthcare professionals using the latest medical technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full group"
                asChild
              >
                <a href="#appointment">
                  Book Appointment
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white font-medium rounded-full"
                asChild
              >
                <a href="#services">
                  Our Services
                </a>
              </Button>
            </div>
          </div>

          <div className={cn(
            "bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-xl hidden lg:block max-w-md ml-auto",
            "transition-all duration-700 transform",
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )} style={{ animationDelay: '0.5s' }}>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Quick Information</h3>
              <p className="text-muted-foreground">Everything you need to know</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors bg-white">
                <Clock className="h-6 w-6 text-orange-500 mt-1 shrink-0" />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Working Hours</h4>
                  <p className="text-muted-foreground">Emergency: 24/7</p>
                  <p className="text-muted-foreground">Regular: 8:00 AM - 8:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors bg-white">
                <Phone className="h-6 w-6 text-orange-500 mt-1 shrink-0" />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Emergency Contact</h4>
                  <p className="text-muted-foreground">Main: (123) 456-7890</p>
                  <p className="text-muted-foreground">Ambulance: (123) 456-7999</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors bg-white">
                <MapPin className="h-6 w-6 text-orange-500 mt-1 shrink-0" />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Location</h4>
                  <p className="text-muted-foreground">123 Healing Avenue</p>
                  <p className="text-muted-foreground">Cityville, State 12345</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
