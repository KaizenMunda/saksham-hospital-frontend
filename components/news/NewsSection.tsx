
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  imageUrl?: string;
}

const NewsSection = () => {
  const [newsItems] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'New Pediatric Wing Opening Next Month',
      date: 'June 15, 2023',
      summary: 'We are excited to announce the opening of our new state-of-the-art pediatric wing, designed to provide the best care for our youngest patients.',
      imageUrl: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      title: 'Community Health Fair Coming This Summer',
      date: 'July 8, 2023',
      summary: 'Join us for our annual Community Health Fair offering free screenings, health education, and family activities.',
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      title: 'Dr. Sarah Johnson Joins Our Cardiology Team',
      date: 'May 30, 2023',
      summary: 'We are pleased to welcome Dr. Sarah Johnson, an experienced cardiologist specializing in preventative heart care.',
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    }
  ]);

  return (
    <section id="news" className="section bg-gray-50">
      <div className="container-custom">
        <div className="section-title">
          <div className="inline-block animate-fade-in">
            <Badge className="bg-hospital-100 text-hospital-800 mb-4 hover:bg-hospital-200">Latest Updates</Badge>
          </div>
          <h2 className="h2 text-hospital-900 animate-fade-in" style={{ animationDelay: '0.1s' }}>News & Updates</h2>
        </div>
        
        <p className="section-description animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Stay informed about the latest developments, events, and healthcare innovations at our hospital.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((news, index) => (
            <div 
              key={news.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 card-hover animate-fade-in"
              style={{ animationDelay: `${0.1 * (index + 3)}s` }}
            >
              {news.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center text-hospital-600 text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  {news.date}
                </div>
                <h3 className="text-xl font-bold text-hospital-950 mb-3">{news.title}</h3>
                <p className="text-gray-600 mb-4">{news.summary}</p>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-hospital-600 hover:text-hospital-800 hover:bg-transparent group"
                  asChild
                >
                  <a href="#" className="inline-flex items-center">
                    Read more
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button className="bg-hospital-600 hover:bg-hospital-700">
            <Newspaper className="mr-2 h-4 w-4" />
            View All News
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
