import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import heroImage from "@/assets/hero-sweets.jpg";

const Hero = () => {
  const { openCart } = useCart();

  const handleViewCatalog = () => {
    const catalogSection = document.getElementById('catalog-section');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShopNow = () => {
    openCart();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-background/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-primary-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Premium Quality Sweets</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              Indulge in
              <span className="block bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                Sweet Perfection
              </span>
            </h1>
            
            <p className="text-xl text-primary-foreground/80 max-w-lg">
              Discover our handcrafted collection of premium chocolates, artisanal candies, 
              and delightful confections made with love and the finest ingredients.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="hero"
                size="xl"
                className="group"
                onClick={handleShopNow}
              >
                Shop Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={handleViewCatalog}
              >
                View Catalog
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Delicious sweets and confections"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-background rounded-xl p-4 shadow-sweet">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-background rounded-xl p-4 shadow-sweet">
              <div className="text-2xl font-bold text-primary">4.9★</div>
              <div className="text-sm text-muted-foreground">Customer Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;