import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Star } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import AuthModal from "./AuthModal";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  in_stock: number;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();

  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="group overflow-hidden bg-gradient-card border-border/50 hover:shadow-sweet transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background ${
            isFavorite ? "text-red-500" : "text-muted-foreground"
          }`}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>

        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
          {product.category}
        </Badge>

        {product.in_stock <= 5 && product.in_stock > 0 && (
          <Badge variant="destructive" className="absolute bottom-2 left-2">
            Only {product.in_stock} left!
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span>{product.rating}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="text-2xl font-bold text-primary">
            ₹{product.price.toFixed(2)}
          </div>

          {user ? (
            <Button
              variant="sweet"
              size="sm"
              disabled={product.in_stock === 0}
              className="group/btn"
              onClick={handleAddToCart}
            >
              {product.in_stock === 0 ? (
                "Out of Stock"
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1 group-hover/btn:rotate-90 transition-transform" />
                  Add to Cart
                </>
              )}
            </Button>
          ) : (
            <AuthModal>
              <Button
                variant="sweet"
                size="sm"
                className="group/btn"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            </AuthModal>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;