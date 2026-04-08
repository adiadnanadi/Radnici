import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Star, Clock, Shield, Calendar, MessageSquare, Heart, ChevronLeft } from 'lucide-react';
import { workerService, reviewService, favoriteService, messageService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const WorkerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState({ subject: '', content: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchWorkerData();
  }, [id]);

  const fetchWorkerData = async () => {
    setLoading(true);
    try {
      const [workerData, reviewsData] = await Promise.all([
        workerService.getById(id),
        reviewService.getWorkerReviews(id)
      ]);
      setWorker(workerData);
      setReviews(reviewsData);

      if (isAuthenticated) {
        try {
          const favData = await favoriteService.check(id);
          setIsFavorite(favData.isFavorite);
        } catch (e) {}
      }
    } catch (error) {
      console.error('Error fetching worker:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      if (isFavorite) {
        await favoriteService.remove(id);
      } else {
        await favoriteService.add(id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Favorite error:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await messageService.send({
        receiverId: worker.userId,
        workerId: worker.id,
        subject: message.subject,
        content: message.content
      });
      setShowContactModal(false);
      setMessage({ subject: '', content: '' });
      alert('Poruka poslana!');
    } catch (error) {
      alert('Greška pri slanju poruke');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-64 bg-white/5 rounded-2xl mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-white/10 rounded w-1/3" />
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
              </div>
              <div className="h-64 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Radnik nije pronađen</h2>
        <Link to="/workers" className="btn-primary">Pogledaj sve radnike</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-6 flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          Nazad
        </button>

        <div className="card overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-primary-500/30 to-purple-500/30" />
          
          <div className="px-6 pb-6 -mt-16 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="relative">
                {worker.avatarUrl ? (
                  <img 
                    src={worker.avatarUrl} 
                    alt={`${worker.firstName} ${worker.lastName}`}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-dark-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-4xl font-bold text-white border-4 border-dark-100">
                    {worker.firstName?.[0]}{worker.lastName?.[0]}
                  </div>
                )}
                {worker.isVerified && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-dark-100">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">
                  {worker.firstName} {worker.lastName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {worker.location}
                  </span>
                  <span className="px-3 py-1 bg-primary-500/20 rounded-full text-primary-400">
                    {worker.category}
                  </span>
                  {worker.experienceYears > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {worker.experienceYears} godina iskustva
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleFavorite}
                  className={`p-3 rounded-xl border transition-all ${
                    isFavorite 
                      ? 'bg-red-500/20 border-red-500 text-red-400' 
                      : 'bg-white/5 border-white/10 text-white hover:border-white/30'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={() => isAuthenticated ? setShowContactModal(true) : navigate('/login')}
                  className="btn-primary flex items-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Kontaktiraj
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">O meni</h2>
              <p className="text-gray-300 whitespace-pre-line">
                {worker.description || 'Korisnik nije dodao opis.'}
              </p>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Vještine</h2>
              <div className="flex flex-wrap gap-2">
                {worker.skills?.length > 0 ? (
                  worker.skills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-primary-500/20 rounded-full text-primary-400">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400">Nema vještina navedenih</p>
                )}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Recenzije ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <p className="text-gray-400">Nema recenzija za ovog radnika</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-white/10 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-gray-400 text-sm">
                          {new Date(review.createdAt).toLocaleDateString('bs-BA')}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-300">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Informacije</h2>
              
              {worker.hourlyRate > 0 && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Cijena po satu</p>
                  <p className="text-3xl font-bold gradient-text">{worker.hourlyRate} KM</p>
                </div>
              )}

              <div className="space-y-3">
                {worker.phone && (
                  <a href={`tel:${worker.phone}`} className="flex items-center gap-3 text-gray-300 hover:text-primary-400 transition-colors">
                    <Phone className="w-5 h-5" />
                    {worker.phone}
                  </a>
                )}
                {worker.whatsapp && (
                  <a 
                    href={`https://wa.me/${worker.whatsapp.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-green-400 hover:text-green-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.162-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297a11.815 11.815 0 00-1.45-5.91c-.61-1.293-1.074-1.3-1.507-1.308-1.08-.024-2.133.09-3.112.632-.95.527-1.64 1.478-1.81 1.862-.174.397-.058.803.12 1.147.161.327.364.805.544 1.215.18.41.382.826.648 1.182.266.356.56.706.96.96.398.254 1.17.443 1.893.567.723.124 1.246.09 1.71.05.464-.04 1.077-.625 1.227-1.228.15-.604.15-1.18-.046-1.7-.197-.52-.726-1.13-1.49-1.943z"/>
                    </svg>
                    WhatsApp
                  </a>
                )}
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5" />
                  <span className={worker.availability === 'AVAILABLE' ? 'text-green-400' : 'text-yellow-400'}>
                    {worker.availability === 'AVAILABLE' ? 'Dostupan' : worker.availability === 'BUSY' ? 'Zauzet' : 'Nedostupan'}
                  </span>
                </div>
              </div>
            </div>

            {worker.galleryImages?.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Galerija radova</h2>
                <div className="grid grid-cols-2 gap-2">
                  {worker.galleryImages.map((img, i) => (
                    <img key={i} src={img} alt={`Work ${i + 1}`} className="rounded-lg w-full h-32 object-cover" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Pošaljite poruku</h3>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="input-label">Predmet</label>
                <input
                  type="text"
                  value={message.subject}
                  onChange={(e) => setMessage({ ...message, subject: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="input-label">Poruka</label>
                <textarea
                  value={message.content}
                  onChange={(e) => setMessage({ ...message, content: e.target.value })}
                  className="input-field min-h-[120px]"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowContactModal(false)} className="btn-secondary flex-1">
                  Otkaži
                </button>
                <button type="submit" disabled={sending} className="btn-primary flex-1">
                  {sending ? 'Slanje...' : 'Pošalji'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerDetailPage;
