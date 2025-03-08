
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DoctorProps {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  reviewCount: number;
  availableToday?: boolean;
  experience: string;
}

const DoctorCard = ({
  id,
  name,
  specialty,
  image,
  rating,
  reviewCount,
  availableToday = false,
  experience
}: DoctorProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group card-hover">
      <div className="relative overflow-hidden h-64">
        <div 
          className={cn(
            "absolute inset-0 bg-hospital-200",
            "lazy-image",
            isImageLoaded ? "lazy-image-loaded" : "lazy-image-loading"
          )}
        ></div>
        <img
          src={image}
          alt={`Dr. ${name}`}
          className={cn(
            "w-full h-full object-cover object-center scale-105 transition-transform duration-500 group-hover:scale-110",
            "lazy-image",
            isImageLoaded ? "lazy-image-loaded" : "lazy-image-loading"
          )}
          onLoad={() => setIsImageLoaded(true)}
        />
        
        {availableToday && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center space-x-1 px-3 py-1">
              <Clock className="h-3 w-3" />
              <span>Available Today</span>
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <p className="text-hospital-600 font-medium">{specialty}</p>
        
        <div className="flex items-center mt-2 mb-4">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={cn(
                  "h-4 w-4", 
                  i < Math.floor(rating) 
                    ? "text-yellow-500 fill-yellow-500" 
                    : "text-gray-300"
                )} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({reviewCount} reviews)</span>
        </div>
        
        <div className="border-t border-gray-100 pt-4 mt-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{experience} experience</span>
            </div>
            
            <Button 
              size="sm" 
              className="bg-hospital-600 hover:bg-hospital-700"
              asChild
            >
              <a href="#appointment">Book Now</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
