
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import CampaignList from "@/components/campaign/CampaignList";
import { Campaign } from "@/types";
import { mockCampaigns, mockCategories } from "@/lib/mockData";
import { ArrowRight, BadgeCheck, Heart, Search, TrendingUp, Users } from "lucide-react";

const featuredCategories = mockCategories.slice(0, 6);

const Homepage = () => {
  const [featuredCampaigns, setFeaturedCampaigns] = useState<Campaign[]>([]);
  const [trendingCampaigns, setTrendingCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Get random featured campaigns
      setFeaturedCampaigns(mockCampaigns.slice(0, 3));
      // Get trending campaigns (sorted by backers)
      setTrendingCampaigns([...mockCampaigns].sort((a, b) => (b.backers || 0) - (a.backers || 0)).slice(0, 3));
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Bring Your Ideas to Life
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Join thousands of creators and backers on FundBoost. Whether you're starting a creative project or supporting one, we're here to help make it happen.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <Button size="lg" asChild className="rounded-full">
                  <Link to="/dashboard/campaigns/create">Start a Project</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full">
                  <Link to="/explore">Explore Projects</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] w-full animate-fade-in">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl filter blur-3xl"></div>
              <div className="absolute inset-0 grid grid-cols-2 gap-4 p-4">
                <div className="space-y-4">
                  <div className="h-40 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg transform translate-y-4 animate-float overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdhdGVyJTIwYm90dGxlfGVufDB8fDB8fHww" 
                      alt="Project Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="h-32 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg animate-float overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Project Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-32 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg animate-float overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Project Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="h-40 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg transform translate-y-4 animate-float overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                      alt="Project Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-primary">$120M+</h3>
              <p className="text-gray-600 dark:text-gray-400">Total Funding</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-primary">15k+</h3>
              <p className="text-gray-600 dark:text-gray-400">Projects Funded</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-primary">200k+</h3>
              <p className="text-gray-600 dark:text-gray-400">Backers</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-primary">95%</h3>
              <p className="text-gray-600 dark:text-gray-400">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <Button variant="ghost" asChild className="group">
              <Link to="/explore" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <CampaignList campaigns={featuredCampaigns} loading={loading} />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              FundBoost makes it easy to bring your creative projects to life or support projects you're passionate about.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <Card className="border-0 shadow-md glass">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Discover</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Browse through thousands of creative projects in various categories and find ones that inspire you.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md glass">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fund</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Support projects you believe in with secure payment options and track their progress.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md glass">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BadgeCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Receive</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get rewards from creators for your contributions as they bring their projects to life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trending Projects Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-3xl font-bold">Trending Projects</h2>
            </div>
            <Button variant="ghost" asChild className="group">
              <Link to="/explore?sort=trending" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <CampaignList campaigns={trendingCampaigns} loading={loading} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Categories</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover projects from a wide range of categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredCategories.map((category, index) => (
              <Link 
                key={index} 
                to={`/explore?category=${category}`}
                className="block group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
                  <h3 className="text-lg font-medium group-hover:text-primary transition-colors">
                    {category}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/explore">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Project?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join our community of creators and bring your ideas to life with the support of backers around the world.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" asChild className="rounded-full">
                <Link to="/dashboard/campaigns/create">Start a Project</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full">
                <Link to="/explore">Explore Projects</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Hear from creators who successfully funded their projects on FundBoost
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                      alt="Testimonial" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Eco-Friendly Startup</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "FundBoost helped me raise over $50k for my sustainable product line. The platform was easy to use and the community support was incredible."
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                      alt="Testimonial" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">David Chen</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tech Innovator</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "Our smart home device got funded in just 3 days! The analytics tools and campaign tips from FundBoost were invaluable for our success."
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                      alt="Testimonial" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Maya Rodriguez</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Documentary Filmmaker</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "I couldn't have completed my documentary without FundBoost. The platform connected me with passionate supporters who believed in my vision."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Homepage;
