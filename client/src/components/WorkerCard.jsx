import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, Shield, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { favoriteService } from '../services/api';

const WorkerCard = ({ worker }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      if (isFavorite) {
        await favoriteService.remove(worker.id);
      } else {
        await favoriteService.add(worker.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Favorite error:', error);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="card card-hover group relative overflow-hidden">
      <button
        onClick={handleFavorite}
        className={`absolute top-4 right-4 p-2 rounded-full transition-all z-10 ${
          isFavorite 
            ? 'bg-red-500/20 text-red-400' 
            : 'bg-white/10 text-white/60 hover:text-red-400'
        }`}
      >
        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      <Link to={`/workers/${worker.id}`} className="block p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            {worker.avatarUrl ? (
              <img 
                src={worker.avatarUrl} 
                alt={`${worker.firstName} ${worker.lastName}`}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl">
                {getInitials(worker.firstName, worker.lastName)}
              </div>
            )}
            {worker.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {worker.firstName} {worker.lastName}
            </h3>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{worker.location}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {worker.description || 'Radnik bez opisa'}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {worker.skills?.slice(0, 3).map((skill, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300"
            >
              {skill}
            </span>
          ))}
          {worker.skills?.length > 3 && (
            <span className="px-3 py-1 bg-primary-500/20 rounded-full text-xs text-primary-400">
              +{worker.skills.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-4">
            {worker.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-medium">{worker.rating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({worker.reviewCount || 0})</span>
              </div>
            )}
            {worker.experienceYears > 0 && (
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>{worker.experienceYears} god</span>
              </div>
            )}
          </div>

          {worker.hourlyRate > 0 && (
            <div className="text-right">
              <span className="text-xl font-bold gradient-text">{worker.hourlyRate} KM</span>
              <span className="text-gray-400 text-sm">/sat</span>
            </div>
          )}
        </div>
      </Link>

      {showAuthModal && (
        <div className="absolute inset-0 bg-dark-300/90 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20">
          <div className="text-center p-6">
            <p className="text-white mb-4">Prijavite se da dodate u favorite</p>
            <div className="flex gap-2 justify-center">
              <Link 
                to="/login" 
                className="btn-primary text-sm"
                onClick={() => setShowAuthModal(false)}
              >
                Prijava
              </Link>
              <Link 
                to="/register" 
                className="btn-secondary text-sm"
                onClick={() => setShowAuthModal(false)}
              >
                Registracija
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerCard;
