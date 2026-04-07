import { Link, useNavigate } from 'react-router-dom';
import { Search, CheckCircle, ArrowRight, Star, Shield, Clock } from 'lucide-react';
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
      icon: <Shield className="w-8 h-8" />,
      title: 'Provjereni radnici',
      description: 'Svi radnici prolaze verifikaciju za pouzdane usluge'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Recenzije korisnika',
      description: 'Čitajte iskustva drugih klijenata prije odluke'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Brza komunikacija',
      description: 'Direktan kontakt sa radnicima bez posrednika'
    }
  ];

  const popularCategories = CATEGORIES.slice(0, 8);

  return (
    <div className="min-h-screen">
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-purple-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Pronađite idealnog</span>
              <br />
              <span className="text-white">radnika za vaš projekt</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Platforma koja povezuje kvalifikovane radnike sa klijentima širom Bosne i Hercegovine
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Pretražite radnike, vještine..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-12"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field md:w-64"
                >
                  <option value="">Sve kategorije</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Pretraži
                </button>
              </div>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-gray-400">
            <span>Popularno:</span>
            {['Električar', 'Vodoinstalater', 'Moler', 'Stolar', 'IT podrška'].map((term) => (
              <button
                key={term}
                onClick={() => navigate(`/workers?search=${term}`)}
                className="hover:text-primary-400 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-dark-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 text-center hover:border-primary-500/50 transition-all">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500/20 text-primary-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Popularne kategorije</h2>
            <Link to="/categories" className="btn-ghost flex items-center gap-2">
              Sve kategorije <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularCategories.map((category) => (
              <Link
                key={category.id}
                to={`/workers?category=${category.id}`}
                className="card p-6 text-center card-hover group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {category.subcategories.length} podkategorija
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary-500/20 to-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-4">Postanite naš partner</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Prijavite se kao radnik i dosegnite nove klijente u vašoj oblasti
          </p>
          <Link to="/register?type=worker" className="btn-primary inline-flex items-center gap-2">
            Registrujte se kao radnik <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8 text-center">Kako funkcioniše</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Pretražite', desc: 'Pretražite radnike po kategoriji, lokaciji ili vještini' },
              { step: '2', title: 'Kontaktirajte', desc: 'Kontaktirajte radnika direktno putem platforme' },
              { step: '3', title: 'Sarađujte', desc: 'Završite posao uz ocjenu i recenziju' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-dark-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="section-title mb-4">Trebate pomoć?</h2>
              <p className="text-gray-300 mb-6">
                Naš tim je uvijek spreman pomoći. Kontaktirajte nas za sva pitanja.
              </p>
              <Link to="/contact" className="btn-secondary">
                Kontaktirajte nas
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                { icon: '📞', label: '+387 60 123 456' },
                { icon: '✉️', label: 'info@radnici.ba' },
                { icon: '📍', label: 'Sarajevo, BIH' },
                { icon: '⏰', label: 'Pon-Pet: 9-17h' }
              ].map((item) => (
                <div key={item.label} className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-gray-300 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
