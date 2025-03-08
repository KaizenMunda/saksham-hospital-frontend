
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowRight, Heart, Brain, Baby, Bone, User, Stethoscope, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const ServiceCard = ({ icon, title, description, delay = 0 }: ServiceCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100 + delay);
    
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={cn(
        "bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group card-hover border border-gray-100",
        "transition-all duration-700 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="h-14 w-14 rounded-full bg-hospital-100 flex items-center justify-center text-hospital-600 mb-6 group-hover:bg-hospital-200 transition-colors">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-hospital-950 mb-3 group-hover:text-hospital-700 transition-colors">{title}</h3>
      
      <p className="text-gray-600 mb-4">{description}</p>
      
      <Button 
        variant="ghost" 
        className="p-0 h-auto text-hospital-600 hover:text-hospital-800 hover:bg-transparent group"
        asChild
      >
        <a href="#" className="inline-flex items-center">
          Learn more
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </Button>
    </div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      icon: <Heart className="h-7 w-7" />,
      title: "Cardiology",
      description: "Expert care for heart conditions using the latest diagnostic and treatment technologies."
    },
    {
      icon: <Brain className="h-7 w-7" />,
      title: "Neurology",
      description: "Specialized treatment for disorders of the brain, spine, and nervous system."
    },
    {
      icon: <Baby className="h-7 w-7" />,
      title: "Pediatrics",
      description: "Comprehensive healthcare services for children from infancy through adolescence."
    },
    {
      icon: <Bone className="h-7 w-7" />,
      title: "Orthopedics",
      description: "Treatment for injuries and diseases affecting the musculoskeletal system."
    },
    {
      icon: <User className="h-7 w-7" />,
      title: "Primary Care",
      description: "Preventative care and management of acute and chronic illnesses for patients of all ages."
    },
    {
      icon: <Stethoscope className="h-7 w-7" />,
      title: "Internal Medicine",
      description: "Diagnosis and treatment of adult diseases with a focus on preventative care."
    }
  ];

  return (
    <section id="services" className="section bg-white">
      <div className="container-custom">
        <div className="section-title">
          <div className="inline-block animate-fade-in">
            <Badge className="bg-hospital-100 text-hospital-800 mb-4 hover:bg-hospital-200">Our Services</Badge>
          </div>
          <h2 className="h2 text-hospital-900 animate-fade-in" style={{ animationDelay: '0.1s' }}>Comprehensive Healthcare Solutions</h2>
        </div>
        
        <p className="section-description animate-fade-in" style={{ animationDelay: '0.2s' }}>
          We offer a wide range of medical services to meet the diverse needs of our patients, combining cutting-edge technology with compassionate care.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              delay={index * 100}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="inline-flex items-center justify-center p-8 bg-hospital-50 rounded-xl border border-hospital-100">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-hospital-100 flex items-center justify-center text-hospital-600">
                <Thermometer className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-hospital-900">Emergency Services Available 24/7</h3>
                <p className="text-gray-600">For medical emergencies, please call (123) 456-7999 or visit our emergency department.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
