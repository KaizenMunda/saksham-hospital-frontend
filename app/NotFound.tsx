
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container-custom text-center max-w-lg">
          <div className="text-hospital-600 text-9xl font-bold mb-4 animate-fade-in">404</div>
          <h1 className="text-3xl font-bold text-hospital-950 mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>Page Not Found</h1>
          <p className="text-gray-600 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            We're sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          
          <Button 
            asChild 
            className="animate-fade-in bg-hospital-600 hover:bg-hospital-700"
            style={{ animationDelay: '0.3s' }}
          >
            <a href="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </a>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
