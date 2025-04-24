
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';

export default function GlassHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3 bg-black/60 backdrop-blur-xl shadow-md' : 'py-5 bg-transparent backdrop-blur-sm'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-white"
        >
          <span>Infinity CRM</span>
        </Link>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white">Cadastre-se</Button>
            </Link>
          </div>
        )}
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        )}
      </div>
      
      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 pt-20">
          <div className="container mx-auto px-4 flex flex-col gap-4 items-center">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full text-white hover:text-white hover:bg-white/10 text-xl py-4">Entrar</Button>
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white text-xl py-4">Cadastre-se</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
