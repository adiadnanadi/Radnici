import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, User, MessageSquare, Heart, LogOut, Menu, X, Wrench } from 'lucide-react';
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
    <header className="bg-dark-300/95 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              <span className="text-primary-400">Radnici</span>
              <span className="text-gray-500">.ba</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/workers" className="text-gray-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-all duration-200">
              Pronađi radnika
            </Link>
            <Link to="/categories" className="text-gray-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-all duration-200">
              Kategorije
            </Link>
            <Link to="/about" className="text-gray-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-all duration-200">
              Kako funkcioniše
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 bg-white/5 rounded-full pr-2 pl-1 py-1">
                <Link 
                  to="/messages" 
                  className="p-2 text-gray-400 hover:text-primary-400 hover:bg-white/10 rounded-lg transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>
                <Link 
                  to="/favorites" 
                  className="p-2 text-gray-400 hover:text-primary-400 hover:bg-white/10 rounded-lg transition-all"
                >
                  <Heart className="w-4 h-4" />
                </Link>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 pl-2 pr-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
                    {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                  </div>
                  <span className="text-sm">{user?.firstName || 'Profil'}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                  Prijava
                </Link>
                <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-medium rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-200">
                  Registracija
                </Link>
              </>
            )}
          </div>

          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            <nav className="flex flex-col gap-2">
              <Link to="/workers" className="text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Pronađi radnika
              </Link>
              <Link to="/categories" className="text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                Kategorije
              </Link>
              {isAuthenticated ? (
                <>
                  <div className="border-t border-white/5 my-2 pt-2">
                    <Link to="/dashboard" className="text-gray-300 hover:text-white px-4 py-3 block" onClick={() => setMobileMenuOpen(false)}>
                      Moj profil
                    </Link>
                    <Link to="/messages" className="text-gray-300 hover:text-white px-4 py-3 block" onClick={() => setMobileMenuOpen(false)}>
                      Poruke
                    </Link>
                  </div>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left text-red-400 px-4 py-3">
                    Odjava
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 border-t border-white/5 mt-2 pt-2">
                  <Link to="/login" className="text-center text-gray-300 hover:text-white py-3" onClick={() => setMobileMenuOpen(false)}>
                    Prijava
                  </Link>
                  <Link to="/register" className="text-center py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    Registracija
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;