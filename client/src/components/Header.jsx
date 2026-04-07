import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, User, MessageSquare, Heart, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-dark-200/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Radnici.ba</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/workers" className="text-gray-300 hover:text-white transition-colors">
              Pronađi radnika
            </Link>
            <Link to="/categories" className="text-gray-300 hover:text-white transition-colors">
              Kategorije
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
              O nama
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/messages" 
                  className="p-2 text-gray-300 hover:text-white transition-colors relative"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <Link 
                  to="/favorites" 
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Heart className="w-5 h-5" />
                </Link>
                <Link 
                  to="/dashboard" 
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <User className="w-5 h-5" />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">
                  Prijava
                </Link>
                <Link to="/register" className="btn-primary">
                  Registracija
                </Link>
              </>
            )}
          </div>

          <button 
            className="md:hidden p-2 text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col gap-4">
              <Link 
                to="/workers" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pronađi radnika
              </Link>
              <Link 
                to="/categories" 
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kategorije
              </Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/messages" 
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Poruke
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="text-left text-red-400"
                  >
                    Odjava
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Prijava
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Registracija
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
