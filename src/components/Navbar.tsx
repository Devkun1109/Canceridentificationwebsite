import { useState } from 'react';
import { Menu, X, User, LogOut, History, Settings, Home, Upload } from 'lucide-react';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  userName?: string;
}

export function Navbar({ isLoggedIn, onLogout, onNavigate, currentPage, userName }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = isLoggedIn ? [
    { name: 'Dashboard', icon: Home, page: 'dashboard' },
    { name: 'Analyze', icon: Upload, page: 'analyze' },
    { name: 'History', icon: History, page: 'history' },
    { name: 'Profile', icon: Settings, page: 'profile' },
  ] : [];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'landing')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white">🩺</span>
            </div>
            <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
              SkinCare AI
            </span>
          </div>

          {/* Desktop Navigation */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentPage === item.page
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-purple-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              ))}
              <div className="flex items-center gap-3 pl-4 border-l border-purple-200">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Welcome,</p>
                  <p className="text-sm text-purple-600">{userName || 'User'}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}

          {!isLoggedIn && (
            <button
              onClick={() => onNavigate('auth')}
              className="hidden md:block px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all"
            >
              Get Started
            </button>
          )}

          {/* Mobile menu button */}
          {isLoggedIn && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-purple-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isLoggedIn && mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-purple-100 shadow-lg animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === item.page
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                    : 'text-gray-700 hover:bg-purple-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </button>
            ))}
            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
