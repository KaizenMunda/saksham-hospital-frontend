
import { useState } from "react";
import { User, Key, Smartphone, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

// Simple phone number validation
const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

// Simple OTP validation (typically 4-6 digits)
const isValidOTP = (otp: string): boolean => {
  const otpRegex = /^\d{4,6}$/;
  return otpRegex.test(otp);
};

const PatientPortal = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidPhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
      
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${phoneNumber}`,
      });
      
      // For demo purposes, we'll use 123456 as the OTP
      console.log("Demo OTP: 123456");
    }, 1500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidOTP(otp)) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid verification code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to verify OTP
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, accept 123456 as valid OTP
      if (otp === "123456") {
        toast({
          title: "Login Successful",
          description: "You are now logged into your patient portal",
        });
        // In a real app, you would redirect to dashboard or set auth state
        console.log("User authenticated successfully");
      } else {
        toast({
          title: "Invalid OTP",
          description: "The verification code you entered is incorrect",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 bg-gray-50">
        <div className="container-custom max-w-md">
          <div className="bg-white rounded-xl shadow-md p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="h-16 w-16 bg-hospital-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-hospital-600" />
              </div>
              <h1 className="text-2xl font-bold text-hospital-900">Patient Portal</h1>
              <p className="text-gray-600 mt-2">Access your health records securely</p>
            </div>
            
            {step === "phone" ? (
              <form onSubmit={handlePhoneSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile Number</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your 10-digit mobile number"
                        className="pl-10"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-hospital-600 hover:bg-hospital-700" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">◌</span>
                        Sending OTP...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Continue with OTP
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>By continuing, you agree to our <a href="#" className="text-hospital-600 hover:underline">Terms of Service</a> and <a href="#" className="text-hospital-600 hover:underline">Privacy Policy</a></p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-auto p-0 text-hospital-600 text-sm hover:text-hospital-800"
                      onClick={() => {
                        toast({
                          title: "Resending OTP",
                          description: `A new verification code has been sent to ${phoneNumber}`,
                        });
                      }}
                    >
                      Resend OTP
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Enter the 6-digit code sent to your phone"
                      className="pl-10"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-hospital-600 hover:bg-hospital-700" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">◌</span>
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Verify & Login
                      </span>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep("phone")}
                  >
                    Back to Phone Entry
                  </Button>
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>Having trouble? <a href="#" className="text-hospital-600 hover:underline">Contact Support</a></p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PatientPortal;
