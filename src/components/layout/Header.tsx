
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Users, BarChart3, Plus, Menu, X } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-dourado to-dourado-light shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center justify-between mb-4 md:mb-0">
            <div className="flex items-center">
              <div className="text-white mr-2">
                <BarChart3 size={28} />
              </div>
              <h1 className="text-2xl font-bold text-white">Paz Financeira Pro</h1>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-white/20 p-2">
                    <Menu size={24} />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[80vh] bg-white">
                  <div className="p-4">
                    <div className="flex justify-end mb-4">
                      <DrawerClose asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-6 w-6 text-dourado" />
                        </Button>
                      </DrawerClose>
                    </div>
                    <nav className="flex flex-col space-y-4">
                      <NavItem to="/" icon={<Home size={18} />} text="Dashboard" onClick={() => setIsOpen(false)} />
                      <NavItem to="/clientes" icon={<Users size={18} />} text="Clientes" onClick={() => setIsOpen(false)} />
                      <NavItem to="/investimentos/novo" icon={<Plus size={18} />} text="Novo Investimento" onClick={() => setIsOpen(false)} />
                      <NavItem to="/investimentos" icon={<BarChart3 size={18} />} text="Investimentos" onClick={() => setIsOpen(false)} />
                    </nav>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            <NavItem to="/" icon={<Home size={18} />} text="Dashboard" />
            <NavItem to="/clientes" icon={<Users size={18} />} text="Clientes" />
            <NavItem to="/investimentos/novo" icon={<Plus size={18} />} text="Novo Investimento" />
            <NavItem to="/investimentos" icon={<BarChart3 size={18} />} text="Investimentos" end />
          </nav>
        </div>
      </div>
    </header>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  end?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, text, onClick, end }) => {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) => cn(
        "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-white text-dourado" // Active state is white background with dourado text (already inverted as requested)
          : "text-gray-800 hover:bg-dourado/10" // Non-active has subtle hover effect
      )}
    >
      <span className="mr-2">{icon}</span>
      <span>{text}</span>
    </NavLink>
  );
};

export default Header;
