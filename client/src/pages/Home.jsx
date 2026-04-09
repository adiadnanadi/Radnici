import { Link, useNavigate } from 'react-router-dom';
import { Search, CheckCircle, ArrowRight, Star, Shield, Clock, Wrench, MapPin, Users, Building2 } from 'lucide-react';
import { useState } from 'react';
import { CATEGORIES } from '../data/categories';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    navigate(`/workers?${params.toString()}`);
  };

  const features = [
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Provjereni radnici',
      description: 'Svi radnici prolaze verifikaciju za pouzdane usluge',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Star className="w-7 h-7" />,
      title: 'Stvarnе recenzije',
      description: 'Iskustva pravih korisnika za bolju odluku',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Clock className="w-7 h-7" />,
      title: 'Brza komunikacija',
      description: 'Kontaktirajte radnike direktno - bez posrednika',
      color: 'from-primary-500 to-cyan-500'
    },
    {
      icon: <MapPin className="w-7 h-7" />,
      title: 'Lokalni radnici',
      description: 'Pronađite radnike u vašem gradu i okolini',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { value: '2,500+', label: 'Registrovanih radnika', icon: Users },
    { value: '150+', label: 'Različitih usluga', icon: Wrench },
    { value: '12', label: 'Gradova u BiH', icon: Building2 },
  ];

  const popularCategories = CATEGORIES.slice(0, 8);

  return (
    <div className="min-h-screen">
      <section className="relative py-16 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">500+ aktivnih radnika čeka vaš poziv</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">Pogodite </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-cyan-400 to-accent-400">savršenog radnika</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Pronađite pouzdane majstore, serviserе i zanatlije u vašem gradu. 
              Bez posrednika, direktan kontakt, brza pomoć.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-12">
            <div className="bg-dark-200/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 md:p-4 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Šta vam treba? (npr. vodoinstalater, električar...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="lg:w-56 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary-500/50 cursor-pointer"
                >
                  <option value="" className="bg-dark-200">Sve kategorije</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-dark-200">
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-glow hover:shadow-glow-lg flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">Pretraži</span>
                </button>
              </div>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="text-sm text-gray-500">Popularno:</span>
            {['Građevina', 'Elektrika', 'Vodoinstalacije', 'Automehaničar'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="text-sm px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 border-y border-white/5 bg-dark-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 mb-3">
                  <stat.icon className="w-6 h-6 text-primary-400" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Kategorije usluga</h2>
            <p className="text-gray-400">Pronađite radnika za bilo koju vrstu posla</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {popularCategories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/workers?category=${cat.id}`}
                className="group p-4 bg-white/5 border border-white/10 rounded-xl hover:border-primary-500/30 hover:bg-white/10 transition-all duration-200 text-center"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wrench className="w-5 h-5 text-primary-400" />
                </div>
                <h3 className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/categories" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors">
              Pogledaj sve kategorije <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary-500/10 via-transparent to-accent-500/10 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Jeste li majstor ili radnik?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Kreirajte svoj besplatan profil i počnite dobijati poslove već danas. 
            Povežite se sa hiljadama klijenata u potrazi za kvalitetnim uslugama.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register?type=worker" 
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-glow hover:shadow-glow-lg"
            >
              <Wrench className="w-5 h-5" />
              Registruj se kao radnik
            </Link>
            <Link 
              to="/register?type=client" 
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200"
            >
              Tražim radnika
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;