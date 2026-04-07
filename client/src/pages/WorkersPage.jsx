import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import WorkerCard from '../components/WorkerCard';
import { workerService } from '../services/api';
import { CATEGORIES, LOCATIONS, AVAILABILITY_OPTIONS } from '../data/categories';

const WorkersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minExperience: searchParams.get('minExperience') || '',
    availability: searchParams.get('availability') || '',
    sort: searchParams.get('sort') || '',
  });

  useEffect(() => {
    fetchWorkers();
  }, [searchParams]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams);
      const data = await workerService.getAll(params);
      setWorkers(data.workers);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
    });
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      minExperience: '',
      availability: '',
      sort: '',
    });
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Pronađite radnike</h1>
          <p className="text-gray-400">Pregledajte profile i pronađite idealnog radnika za vaš projekt</p>
        </div>

        <div className="card p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Pretražite po imenu, vještini..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center gap-2 md:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filteri
            </button>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="input-field md:w-48"
            >
              <option value="">Sortiraj</option>
              <option value="rating">Najbolje ocjenjeni</option>
              <option value="experience">Najviše iskustva</option>
              <option value="price_low">Cijena: manja</option>
              <option value="price_high">Cijena: veća</option>
            </select>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-field"
              >
                <option value="">Sve kategorije</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="input-field"
              >
                <option value="">Sve lokacije</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="input-field"
              >
                <option value="">Dostupnost</option>
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                value={filters.minExperience}
                onChange={(e) => handleFilterChange('minExperience', e.target.value)}
                className="input-field"
              >
                <option value="">Iskustvo</option>
                <option value="1">1+ godina</option>
                <option value="3">3+ godina</option>
                <option value="5">5+ godina</option>
                <option value="10">10+ godina</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            <span className="text-white font-medium">{total}</span> radnika pronađeno
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-primary-400 hover:text-primary-300 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Očisti filtere
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/10 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-5 bg-white/10 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-white/10 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-white/10 rounded w-full mb-2" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">Nema rezultata</h3>
            <p className="text-gray-400 mb-4">Pokušajte promijeniti filtere pretrage</p>
            <button onClick={clearFilters} className="btn-primary">
              Očisti filtere
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkersPage;
