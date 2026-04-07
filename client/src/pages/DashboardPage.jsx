import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, MessageSquare, Heart, Settings, Edit, Shield, MapPin, Phone, Briefcase, Star, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { workerService, messageService, favoriteService } from '../services/api';
import { CATEGORIES } from '../data/categories';

const DashboardPage = () => {
  const { user, isWorker, isClient } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [workerProfile, setWorkerProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (isWorker) {
        const workers = await workerService.getAll({ search: user?.firstName });
        if (workers.workers.length > 0) {
          setWorkerProfile(workers.workers[0]);
        }
      }
      
      if (isClient) {
        const [msgsData, favsData] = await Promise.all([
          messageService.getInbox(),
          favoriteService.getAll()
        ]);
        setMessages(msgsData.slice(0, 5));
        setFavorites(favsData.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Pregled', icon: User },
    { id: 'messages', label: 'Poruke', icon: Mail, count: messages.filter(m => !m.isRead).length },
    { id: 'favorites', label: 'Favoriti', icon: Heart },
    { id: 'settings', label: 'Postavke', icon: Settings }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Dobrodošli, {user?.firstName || user?.email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="card p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {isWorker && (
                  <>
                    {workerProfile ? (
                      <div className="card p-6">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            {workerProfile.avatarUrl ? (
                              <img src={workerProfile.avatarUrl} alt="" className="w-20 h-20 rounded-xl object-cover" />
                            ) : (
                              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl font-bold text-white">
                                {workerProfile.firstName?.[0]}{workerProfile.lastName?.[0]}
                              </div>
                            )}
                            <div>
                              <h2 className="text-xl font-semibold text-white">
                                {workerProfile.firstName} {workerProfile.lastName}
                              </h2>
                              <p className="text-gray-400">{workerProfile.category}</p>
                              {workerProfile.isVerified && (
                                <span className="inline-flex items-center gap-1 text-green-400 text-sm mt-1">
                                  <Shield className="w-4 h-4" /> Verifikovan
                                </span>
                              )}
                            </div>
                          </div>
                          <Link to={`/workers/${workerProfile.id}`} className="btn-secondary text-sm">
                            Pogledaj profil
                          </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-white/5 rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold gradient-text">{workerProfile.hourlyRate || 0} KM</p>
                            <p className="text-gray-400 text-sm">Po satu</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                              <p className="text-2xl font-bold text-white">{workerProfile.rating || 0}</p>
                            </div>
                            <p className="text-gray-400 text-sm">Ocjena</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-white">{workerProfile.experienceYears || 0}</p>
                            <p className="text-gray-400 text-sm">Godina iskustva</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-white">{workerProfile.reviewCount || 0}</p>
                            <p className="text-gray-400 text-sm">Recenzija</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="card p-8 text-center">
                        <h3 className="text-xl font-semibold text-white mb-2">Nemate profil radnika</h3>
                        <p className="text-gray-400 mb-4">Kreirajte svoj profil da počnete dobijati poslove</p>
                        <button className="btn-primary">Kreiraj profil</button>
                      </div>
                    )}
                  </>
                )}

                {isClient && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="card p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                            <Heart className="w-6 h-6 text-primary-400" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-white">{favorites.length}</p>
                            <p className="text-gray-400 text-sm">Omiljenih radnika</p>
                          </div>
                        </div>
                      </div>
                      <div className="card p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-green-400" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-white">{messages.length}</p>
                            <p className="text-gray-400 text-sm">Poruka</p>
                          </div>
                        </div>
                      </div>
                      <div className="card p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                            <Star className="w-6 h-6 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-white">0</p>
                            <p className="text-gray-400 text-sm">Recenzija</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Omiljeni radnici</h3>
                        <Link to="/favorites" className="text-primary-400 text-sm">Vidi sve</Link>
                      </div>
                      {favorites.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">Nemate omiljenih radnika</p>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {favorites.map((fav) => (
                            <Link key={fav.id} to={`/workers/${fav.workerId}`} className="card p-4 text-center card-hover">
                              <p className="text-white font-medium">Radnik</p>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="card">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">Poruke</h3>
                </div>
                {messages.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Nemate poruka</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`p-4 ${!msg.isRead ? 'bg-primary-500/10' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-white font-medium">{msg.subject}</p>
                            <p className="text-gray-400 text-sm mt-1">{msg.content}</p>
                          </div>
                          <span className="text-gray-500 text-xs">
                            {new Date(msg.createdAt).toLocaleDateString('bs-BA')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Omiljeni radnici</h3>
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Nemate omiljenih radnika</p>
                    <Link to="/workers" className="btn-primary">Pronađi radnike</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {favorites.map((fav) => (
                      <Link key={fav.id} to={`/workers/${fav.workerId}`} className="card p-4 card-hover">
                        <p className="text-white font-medium">ID: {fav.workerId}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Postavke računa</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="input-label">Email</label>
                    <input type="email" value={user?.email || ''} className="input-field" disabled />
                  </div>
                  <div>
                    <label className="input-label">Tip računa</label>
                    <input type="text" value={isWorker ? 'Radnik' : 'Klijent'} className="input-field" disabled />
                  </div>
                  <button className="btn-secondary">Promijeni lozinku</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
