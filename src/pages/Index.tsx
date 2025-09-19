import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { products as mockProducts } from "@/lib/data";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { products: dbProducts, loading, addProduct } = useProducts();
  const { user } = useAuth();

  // Initialize database with mock products if empty (for demo purposes)
  useEffect(() => {
    const initializeProducts = async () => {
      if (!loading && dbProducts.length === 0 && user) {
        for (const product of mockProducts) {
          await addProduct({
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            rating: product.rating,
            in_stock: product.in_stock,
            description: product.description,
          });
        }
      }
    };
    
    initializeProducts();
  }, [loading, dbProducts.length, user, addProduct]);

  // Use database products if available, otherwise use mock products
  const products = dbProducts.length > 0 ? dbProducts : mockProducts;

  const filteredProducts = products.filter(product => {
    // Filter by category
    const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;

    // Filter by search query
    const searchMatch = searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <Hero />
      
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Categories */}
        <section id="catalog-section">
          <h2 className="text-3xl font-bold text-center mb-8">
            Our Sweet Collection
          </h2>
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </section>

        {/* Products Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {searchQuery ? `No sweets found matching "${searchQuery}". Try a different search or clear the search.` : "No sweets found in this category. Try another one!"}
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
