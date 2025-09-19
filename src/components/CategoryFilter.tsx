import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  { id: "all", name: "All Sweets", emoji: "🍭" },
  { id: "chocolate", name: "Chocolate", emoji: "🍫" },
  { id: "gummy", name: "Gummy", emoji: "🐻" },
  { id: "hard-candy", name: "Hard Candy", emoji: "🍬" },
  { id: "lollipops", name: "Lollipops", emoji: "🍭" },
  { id: "seasonal", name: "Seasonal", emoji: "🎃" },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
        <TabsList className="grid w-full grid-cols-6 bg-muted/50 p-1 h-auto">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex flex-col items-center space-y-1 py-3 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sweet transition-all duration-200"
            >
              <span className="text-xl">{category.emoji}</span>
              <span className="text-xs font-medium">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default CategoryFilter;