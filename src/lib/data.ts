import chocolateTruffle from "@/assets/chocolate-truffle.jpg";
import gummyBears from "@/assets/gummy-bears.jpg";
import candyCane from "@/assets/candy-cane.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  in_stock: number;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Dark Chocolate Truffle",
    price: 1143.52,
    category: "chocolate",
    image: chocolateTruffle,
    rating: 4.9,
    in_stock: 15,
    description: "Handcrafted dark chocolate truffle with a silky smooth ganache center, dusted with premium cocoa powder."
  },
  {
    id: "2",
    name: "Organic Gummy Bears",
    price: 748.85,
    category: "gummy",
    image: gummyBears,
    rating: 4.7,
    in_stock: 32,
    description: "Made with real fruit juice and organic ingredients. Soft, chewy, and bursting with natural flavors."
  },
  {
    id: "3",
    name: "Classic Peppermint Candy Cane",
    price: 286.33,
    category: "hard-candy",
    image: candyCane,
    rating: 4.8,
    in_stock: 2,
    description: "Traditional peppermint candy cane with refreshing mint flavor and classic red and white stripes."
  },
  {
    id: "4",
    name: "Artisan Caramel Lollipop",
    price: 506.58,
    category: "lollipops",
    image: chocolateTruffle,
    rating: 4.6,
    in_stock: 0,
    description: "Handmade caramel lollipop with a rich, buttery flavor that melts perfectly in your mouth."
  },
  {
    id: "5",
    name: "Ruby Chocolate Hearts",
    price: 1408.92,
    category: "chocolate",
    image: chocolateTruffle,
    rating: 4.9,
    in_stock: 8,
    description: "Elegant ruby chocolate hearts with a naturally fruity taste and beautiful pink color. Perfect for special occasions."
  },
  {
    id: "6",
    name: "Sour Rainbow Strips",
    price: 550.63,
    category: "gummy",
    image: gummyBears,
    rating: 4.4,
    in_stock: 25,
    description: "Tangy and colorful sour strips that pack a punch of flavor. Sweet and sour in perfect harmony."
  }
];

export const categories = [
  "all",
  "chocolate",
  "gummy", 
  "hard-candy",
  "lollipops",
  "seasonal"
];