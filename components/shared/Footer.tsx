import React from 'react';
import { Bot } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <footer className={`bg-black text-white border-t border-white/10 ${className}`}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="bg-white rounded-lg p-2 transition-transform duration-200 hover:scale-105">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
            </div>
            <div className="text-center lg:text-left">
              <h3 className="text-lg sm:text-xl font-semibold tracking-tight">Mockrithm</h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Face the Machine</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
            {navigationLinks.map((link, index) => (
              <React.Fragment key={link.label}>
                <a
                  href={link.href}
                  className="text-sm sm:text-base text-gray-300 hover:text-white transition-all duration-200 font-medium relative group px-2 py-1 rounded-md hover:bg-white/5"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-3/4" />
                </a>
                {/* Separator - only show on larger screens between items */}
                {index < navigationLinks.length - 1 && (
                  <Separator 
                    orientation="vertical" 
                    className="hidden sm:block h-4 lg:h-5 bg-white/20" 
                  />
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <Separator className="my-6 sm:my-8 bg-white/10" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Copyright */}
          <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left order-2 sm:order-1">
            © {currentYear} AI Interview. All rights reserved.
          </p>
          
          {/* Powered by indicator */}
          <div className="flex items-center space-x-2 order-1 sm:order-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">
              Powered by AI Technology
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;