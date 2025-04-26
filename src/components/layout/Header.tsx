
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Users, BarChart3, Plus } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-dourado to-dourado-light shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="text-white mr-2">
              <BarChart3 size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white">Paz Financeira Pro</h1>
          </div>
          
          <nav className="flex space-x-1">
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
  end?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, text, end }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => cn(
        "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-white text-dourado-dark"
          : "text-white hover:bg-white/20"
      )}
    >
      <span className="mr-2">{icon}</span>
      <span>{text}</span>
    </NavLink>
  );
};

export default Header;
