import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { Search } from 'lucide-react';

const CategoriesPage = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Kategorije</h1>
          <p className="text-gray-400">Pregledajte sve dostupne kategorije usluga</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to={`/workers?category=${category.id}`}
              className="card p-6 card-hover group"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {category.subcategories.length} podkategorija
              </p>
              <div className="flex flex-wrap gap-1">
                {category.subcategories.slice(0, 3).map((sub) => (
                  <span key={sub} className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400">
                    {sub}
                  </span>
                ))}
                {category.subcategories.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-primary-500/20 rounded text-primary-400">
                    +{category.subcategories.length - 3}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
