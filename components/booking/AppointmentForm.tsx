
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";

// Available time slots
const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", 
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", 
  "4:00 PM", "4:30 PM"
];

// Specialties
const specialties = [
  "Primary Care", "Cardiology", "Neurology", "Pediatrics", 
  "Orthopedics", "Dermatology", "Ophthalmology", "ENT", 
  "Gynecology", "Urology", "Psychiatry", "Internal Medicine"
];

const AppointmentForm = () => {
  const [date, setDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFormVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedTime || !fullName || !email || !phone || !specialty) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Appointment booked successfully! We'll contact you soon to confirm.");
      setIsSubmitting(false);
      
      // Reset form
      setDate(undefined);
      setSelectedTime(undefined);
      setFullName("");
      setEmail("");
      setPhone("");
      setSpecialty("");
      setSymptoms("");
    }, 1500);
  };

  return (
    <section id="appointment" className="section bg-white">
      <div className="container-custom">
        <div className="section-title">
          <div className="inline-block animate-fade-in">
            <Badge className="bg-hospital-100 text-hospital-800 mb-4 hover:bg-hospital-200">Appointments</Badge>
          </div>
          <h2 className="h2 text-hospital-900 animate-fade-in" style={{ animationDelay: '0.1s' }}>Book Your Appointment</h2>
        </div>
        
        <p className="section-description animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Schedule an appointment with our specialists. We'll get back to you promptly to confirm your booking.
        </p>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="hidden lg:block lg:col-span-2 bg-hospital-600 text-white p-8">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Your Health Journey Starts Here</h3>
                    <p className="text-hospital-100/90 leading-relaxed">
                      Book an appointment with our expert healthcare providers and take the first step towards better health.
                    </p>
                    
                    <div className="mt-8 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-hospital-500/30 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span>Online appointment scheduling</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-hospital-500/30 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span>Expert doctors in every specialty</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-hospital-500/30 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span>Confirmation within 24 hours</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-hospital-500/30 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span>Insurance verification</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 border-t border-hospital-500/30 pt-6">
                    <p className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>24/7 Emergency Care</span>
                    </p>
                    <p className="text-sm text-hospital-100/80 mt-2">
                      For emergencies, please call (123) 456-7999 or visit our emergency department.
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className={cn(
                  "lg:col-span-3 p-8",
                  "transition-all duration-700 transform",
                  isFormVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="appointment-date">Appointment Date <span className="text-red-500">*</span></Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="appointment-date"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              
                              // Disable past dates and weekends
                              const day = date.getDay();
                              return date < today || day === 0 || day === 6;
                            }}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="appointment-time">Appointment Time <span className="text-red-500">*</span></Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger id="appointment-time" className="w-full">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="full-name" 
                      type="text" 
                      placeholder="Your full name" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your.email@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="(123) 456-7890" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty <span className="text-red-500">*</span></Label>
                    <Select value={specialty} onValueChange={setSpecialty}>
                      <SelectTrigger id="specialty" className="w-full">
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Symptoms & Notes</Label>
                    <Textarea 
                      id="symptoms" 
                      placeholder="Please describe your symptoms or reason for the appointment..." 
                      className="min-h-[100px]" 
                      value={symptoms} 
                      onChange={(e) => setSymptoms(e.target.value)} 
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-hospital-600 hover:bg-hospital-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Booking..." : "Book Appointment"}
                  </Button>
                  
                  <p className="text-sm text-gray-500 text-center pt-2">
                    By booking, you agree to our <a href="#" className="text-hospital-600 hover:underline">terms and conditions</a> and <a href="#" className="text-hospital-600 hover:underline">privacy policy</a>.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;
