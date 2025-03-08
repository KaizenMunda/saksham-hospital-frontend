
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Heart, Award, UserCheck, Clock } from 'lucide-react';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('about');
      if (element) {
        const position = element.getBoundingClientRect();
        
        // If element is in viewport
        if (position.top < window.innerHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Check on initial load
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Statistics
  const stats = [
    { value: '25+', label: 'Years of Experience' },
    { value: '100+', label: 'Expert Doctors' },
    { value: '50,000+', label: 'Happy Patients' },
    { value: '24/7', label: 'Emergency Care' }
  ];

  return (
    <section id="about" className="section bg-gray-50 relative">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={cn(
            "space-y-8",
            "transition-all duration-700 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <div className="section-title text-left section-title">
              <div className="inline-block">
                <Badge className="bg-hospital-100 text-hospital-800 mb-4 hover:bg-hospital-200">About Us</Badge>
              </div>
              <h2 className="h2 text-hospital-900">A Legacy of Excellence in Healthcare</h2>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              For over 25 years, MediCare Hospital has been a beacon of exceptional healthcare, combining compassionate service with cutting-edge medical technology. Our mission is to deliver personalized care that addresses the unique needs of each patient.
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              Our team of dedicated healthcare professionals works tirelessly to ensure that every patient receives the highest standard of care in a welcoming and comfortable environment. We believe in treating not just the ailment, but the entire person.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-hospital-100 flex items-center justify-center text-hospital-700 shrink-0">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-hospital-900">Compassionate Care</h4>
                  <p className="text-gray-600">We treat each patient with dignity, respect, and genuine concern for their wellbeing.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-hospital-100 flex items-center justify-center text-hospital-700 shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-hospital-900">Medical Excellence</h4>
                  <p className="text-gray-600">Our physicians and staff are at the forefront of modern medical practices and technologies.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-hospital-100 flex items-center justify-center text-hospital-700 shrink-0">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-hospital-900">Patient-Centered Approach</h4>
                  <p className="text-gray-600">Your health goals and concerns are at the center of every decision we make.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-hospital-100 flex items-center justify-center text-hospital-700 shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-hospital-900">Always Available</h4>
                  <p className="text-gray-600">Our emergency services are available 24/7, because healthcare needs don't follow a schedule.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "lg:ml-auto",
            "transition-all duration-700 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )} style={{ transitionDelay: '0.2s' }}>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop" 
                  alt="Hospital building" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-xl shadow-lg max-w-xs hidden lg:block">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-hospital-600 text-2xl font-bold">{stat.value}</div>
                      <div className="text-gray-600 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-6 lg:hidden">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white p-4 rounded-lg shadow-md">
                  <div className="text-hospital-600 text-2xl font-bold">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
