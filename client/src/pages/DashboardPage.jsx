import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, MessageSquare, Heart, Settings, Edit, Shield, MapPin, Phone, Briefcase, Star, Clock, X, Save, Plus, Trash } from 'lucide-react';
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
  const [editingProfile, setEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    category: '',
    subcategory: '',
    description: '',
    hourlyRate: 0,
    experienceYears: 0,
    availability: 'AVAILABLE',
    skills: [],
    languages: [],
    serviceArea: []
  });
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newArea, setNewArea] = useState('');
  const [saving, setSaving] = useState(false);

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
          setFormData({
            firstName: workers.workers[0].firstName || '',
            lastName: workers.workers[0].lastName || '',
            phone: workers.workers[0].phone || '',
            location: workers.workers[0].location || '',
            category: workers.workers[0].category || '',
            subcategory: workers.workers[0].subcategory || '',
            description: workers.workers[0].description || '',
            hourlyRate: workers.workers[0].hourlyRate || 0,
            experienceYears: workers.workers[0].experienceYears || 0,
            availability: workers.workers[0].availability || 'AVAILABLE',
            skills: workers.workers[0].skills || [],
            languages: workers.workers[0].languages || [],
            serviceArea: workers.workers[0].serviceArea || []
          });
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

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      if (workerProfile) {
        await workerService.update(workerProfile.id, formData);
      } else {
        await workerService.create(formData);
      }
      setEditingProfile(false);
      fetchData();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) });
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData({ ...formData, languages: [...formData.languages, newLanguage.trim()] });
      setNewLanguage('');
    }
  };

  const removeLanguage = (index) => {
    setFormData({ ...formData, languages: formData.languages.filter((_, i) => i !== index) });
  };

  const addServiceArea = () => {
    if (newArea.trim()) {
      setFormData({ ...formData, serviceArea: [...formData.serviceArea, newArea.trim()] });
      setNewArea('');
    }
  };

  const removeServiceArea = (index) => {
    setFormData({ ...formData, serviceArea: formData.serviceArea.filter((_, i) => i !== index) });
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
                    {(workerProfile && !editingProfile) && (
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
                          <div className="flex gap-2">
                            <Link to={`/workers/${workerProfile.id}`} className="btn-secondary text-sm">
                              Pogledaj profil
                            </Link>
                            <button onClick={() => setEditingProfile(true)} className="btn-secondary text-sm flex items-center gap-1">
                              <Edit className="w-4 h-4" /> Uredi
                            </button>
                          </div>
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
                    )}

                    {editingProfile && (
                      <div className="card p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-semibold text-white">
                            {workerProfile ? 'Uredi profil' : 'Kreiraj profil'}
                          </h3>
                          <button onClick={() => setEditingProfile(false)} className="text-gray-400 hover:text-white">
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="input-label">Ime *</label>
                            <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="input-field" required />
                          </div>
                          <div>
                            <label className="input-label">Prezime *</label>
                            <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="input-field" required />
                          </div>
                          <div>
                            <label className="input-label">Telefon</label>
                            <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="input-field" />
                          </div>
                          <div>
                            <label className="input-label">Lokacija *</label>
                            <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="input-field" placeholder="Grad" required />
                          </div>
                          <div>
                            <label className="input-label"> Kategorija *</label>
                            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="input-field" required>
                              <option value="">Izaberi kategoriju</option>
                              {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="input-label">Podkategorija</label>
                            <select value={formData.subcategory} onChange={(e) => setFormData({...formData, subcategory: e.target.value})} className="input-field">
                              <option value="">Izaberi podkategoriju</option>
                              {CATEGORIES.find(c => c.id === formData.category)?.subcategories.map(sub => (
                                <option key={sub} value={sub.toLowerCase()}>{sub}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="input-label">Cijena po satu (KM)</label>
                            <input type="number" value={formData.hourlyRate} onChange={(e) => setFormData({...formData, hourlyRate: parseFloat(e.target.value) || 0})} className="input-field" min="0" />
                          </div>
                          <div>
                            <label className="input-label">Godine iskustva</label>
                            <input type="number" value={formData.experienceYears} onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})} className="input-field" min="0" />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="input-label">Opis / O meni</label>
                          <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input-field h-32" placeholder="Opišite vaše iskustvo, vještine i usluge..." />
                        </div>

                        <div className="mt-4">
                          <label className="input-label">Dostupnost</label>
                          <select value={formData.availability} onChange={(e) => setFormData({...formData, availability: e.target.value})} className="input-field">
                            <option value="AVAILABLE">Dostupan</option>
                            <option value="BUSY">Zauzet</option>
                            <option value="NOT_AVAILABLE">Nedostupan</option>
                          </select>
                        </div>

                        <div className="mt-4">
                          <label className="input-label">Vještine</label>
                          <div className="flex gap-2 mb-2">
                            <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="input-field flex-1" placeholder="Dodaj vještinu" />
                            <button type="button" onClick={addSkill} className="btn-secondary"><Plus className="w-5 h-5" /></button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, i) => (
                              <span key={i} className="inline-flex items-center gap-1 bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full">
                                {skill}
                                <button type="button" onClick={() => removeSkill(i)}><X className="w-4 h-4" /></button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="input-label">Jezici</label>
                          <div className="flex gap-2 mb-2">
                            <input type="text" value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} className="input-field flex-1" placeholder="Dodaj jezik" />
                            <button type="button" onClick={addLanguage} className="btn-secondary"><Plus className="w-5 h-5" /></button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.languages.map((lang, i) => (
                              <span key={i} className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                                {lang}
                                <button type="button" onClick={() => removeLanguage(i)}><X className="w-4 h-4" /></button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="input-label">Područje rada</label>
                          <div className="flex gap-2 mb-2">
                            <input type="text" value={newArea} onChange={(e) => setNewArea(e.target.value)} className="input-field flex-1" placeholder="Dodaj grad/područje" />
                            <button type="button" onClick={addServiceArea} className="btn-secondary"><Plus className="w-5 h-5" /></button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.serviceArea.map((area, i) => (
                              <span key={i} className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
                                {area}
                                <button type="button" onClick={() => removeServiceArea(i)}><X className="w-4 h-4" /></button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 flex gap-4">
                          <button onClick={handleSaveProfile} disabled={saving} className="btn-primary flex items-center gap-2">
                            <Save className="w-5 h-5" />
                            {saving ? 'Spremanje...' : 'Spremi profil'}
                          </button>
                          <button onClick={() => setEditingProfile(false)} className="btn-secondary">Odustani</button>
                        </div>
                      </div>
                    )}

                    {!workerProfile && !editingProfile && (
                      <div className="card p-8 text-center">
                        <h3 className="text-xl font-semibold text-white mb-2">Nemate profil radnika</h3>
                        <p className="text-gray-400 mb-4">Kreirajte svoj profil da počnete dobijati poslove</p>
                        <button onClick={() => setEditingProfile(true)} className="btn-primary">Kreiraj profil</button>
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
