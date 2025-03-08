
import { useState, useEffect } from 'react';
import DoctorCard, { DoctorProps } from './DoctorCard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Sample doctor data
const doctors: DoctorProps[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 124,
    availableToday: true,
    experience: '15 years'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 98,
    availableToday: false,
    experience: '12 years'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1887&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 156,
    availableToday: true,
    experience: '10 years'
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 87,
    availableToday: true,
    experience: '18 years'
  },
  {
    id: '5',
    name: 'Dr. Olivia Thompson',
    specialty: 'Dermatology',
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=1887&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 210,
    availableToday: false,
    experience: '14 years'
  },
  {
    id: '6',
    name: 'Dr. Robert Kim',
    specialty: 'Internal Medicine',
    image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=1887&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 132,
    availableToday: true,
    experience: '16 years'
  }
];

// List of all specialties
const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));

const DoctorGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter doctors based on search term, specialty, and availability
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty ? doctor.specialty === selectedSpecialty : true;
    const matchesAvailability = showOnlyAvailable ? doctor.availableToday : true;
    
    return matchesSearch && matchesSpecialty && matchesAvailability;
  });

  return (
    <section id="doctors" className="section bg-gray-50">
      <div className="container-custom">
        <div className="section-title">
          <div className="inline-block animate-fade-in">
            <Badge className="bg-hospital-100 text-hospital-800 mb-4 hover:bg-hospital-200">Our Team</Badge>
          </div>
          <h2 className="h2 text-hospital-900 animate-fade-in" style={{ animationDelay: '0.1s' }}>Meet Our Expert Doctors</h2>
        </div>
        
        <p className="section-description animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Our team of highly qualified and experienced doctors are ready to provide you with the best possible care.
        </p>
        
        <div className="mb-10 md:flex items-center justify-between gap-4 space-y-4 md:space-y-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search doctors..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-start md:justify-end">
            <Button
              variant={selectedSpecialty === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialty(null)}
              className={selectedSpecialty === null ? "bg-hospital-600 hover:bg-hospital-700" : ""}
            >
              All Specialties
            </Button>
            
            {specialties.map(specialty => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSpecialty(specialty)}
                className={selectedSpecialty === specialty ? "bg-hospital-600 hover:bg-hospital-700" : ""}
              >
                {specialty}
              </Button>
            ))}
            
            <Button
              variant={showOnlyAvailable ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
              className={cn(
                "ml-2",
                showOnlyAvailable ? "bg-green-600 hover:bg-green-700" : ""
              )}
            >
              {showOnlyAvailable ? "✓ Available Today" : "Available Today"}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor, index) => (
            <div
              key={doctor.id}
              className={cn(
                "transition-all duration-700 transform",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              )}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <DoctorCard {...doctor} />
            </div>
          ))}
        </div>
        
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg animate-fade-in">
            <h3 className="text-xl font-medium text-gray-700">No doctors match your search criteria</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorGrid;
