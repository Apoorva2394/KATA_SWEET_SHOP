import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-muted text-foreground">
      <div className="container mx-auto px-4 py-12">
        {/* Centered copyright */}
        <div className="text-center">
          <p className="text-sm">© {new Date().getFullYear()} Sweet Shop. All rights reserved.</p>
        </div>

        {/* Contact row below copyright */}
        <ul className="mt-8 flex flex-col items-center gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-2 md:justify-around">
          <li>
            <a
              href="mailto:support@sweetshop.com"
              className="underline underline-offset-4 hover:text-foreground"
            >
              support@sweetshop.com
            </a>
          </li>
          <li>
            <a
              href="tel:+91 5551234567"
              className="underline underline-offset-4 hover:text-foreground"
            >
              +91 5551234871
            </a>
          </li>
          <li className="text-center">56 Main Street, Sweet City, SC 248010</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;