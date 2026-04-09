import { Link } from 'react-router-dom';
import { Search, MessageSquare, Star, Shield, CheckCircle, ArrowRight, Wrench, Users, Handshake, Zap, MapPin, Clock, Phone } from 'lucide-react';

const AboutPage = () => {
  const steps = [
    {
      number: '01',
      icon: <Search className="w-8 h-8" />,
      title: 'Pretražite radnike',
      description: 'Pregledajte hiljade provjerenih majstora po kategoriji, lokaciji ili vještinama. Koristite filtere za preciznu pretragu.'
    },
    {
      number: '02',
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Kontaktirajte direktno',
      description: 'Pošaljite poruku ili pozovite radnika direktno bez posrednika. Dogovorite cijenu i termin usluge.'
    },
    {
      number: '03',
      icon: <Handshake className="w-8 h-8" />,
      title: 'Dogovorite uslugu',
      description: 'Direktno sa radnikom dogovorite sve detalje - cijenu, vrijeme, način plaćanja. Nema skrivenih troškova.'
    },
    {
      number: '04',
      icon: <Star className="w-8 h-8" />,
      title: 'Ocijenite iskustvo',
      description: 'Nakon završenog posla podijelite svoje iskustvo sa drugim korisnicima. Pomozite drugima da pronađu najbolje.'
    }
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Provjereni radnici',
      description: 'Svi registrovani radnici prolaze osnovnu verifikaciju.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Brza komunikacija',
      description: 'WhatsApp i telefon dostupni na svakom profilu.'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Lokalni radnici',
      description: 'Pronađite majstore u vašem gradu i okolini.'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Recenzije i ocjene',
      description: 'Iskustva drugih korisnika pomažu vam u odabiru.'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Dostupnost 24/7',
      description: 'Platforma je dostupna non-stop. Pretražujte kad vam odgovara.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Besplatno korištenje',
      description: 'Za klijente je potpuno besplatno. Platite samo radniku.'
    }
  ];

  const stats = [
    { value: '2,500+', label: 'Registrovanih radnika' },
    { value: '15,000+', label: 'Završenih projekata' },
    { value: '4.8', label: 'Prosječna ocjena' },
    { value: '12', label: 'Gradova u BiH' }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Kako <span className="text-gradient">funkcioniše</span>?
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Radnici.ba je <span className="text-primary-400 font-semibold">besplatna platforma</span> koja povezuje 
            kvalifikovane radnike sa klijentima širom Bosne i Hercegovine. 
            Bez posrednika, direktan kontakt, pouzdana usluga.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((step, i) => (
            <div key={i} className="card p-6 text-center group hover:border-primary-500/30 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-glow group-hover:shadow-glow-lg transition-all">
                {step.icon}
              </div>
              <div className="text-primary-400 font-bold text-sm mb-2">{step.number}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.description}</p>
            </div>
          ))}
        </section>

        <section className="mb-20">
          <div className="card p-8 md:p-12 bg-gradient-to-r from-primary-500/10 via-dark-200 to-accent-500/10 border border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
            Zašto <span className="text-primary-400">Radnici.ba</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Česta pitanja</h2>
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-white font-medium mb-2">Koliko košta korištenje platforme?</h3>
                <p className="text-gray-400">Korištenje platforme je potpuno besplatno za klijente. Platite samo radniku direktno za obavljeni posao.</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-white font-medium mb-2">Kako se radnici verificiraju?</h3>
                <p className="text-gray-400">Svi radnici prolaze verifikaciju email adrese i telefona. Također imamo sistem recenzija koji pomaže u procjeni kvalitete.</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-white font-medium mb-2">Šta ako nisam zadovoljan uslugom?</h3>
                <p className="text-gray-400">Možete ostaviti recenziju i ocjenu. Također možete kontaktirati podršku ako imate problema.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Kako mogu postati radnik?</h3>
                <p className="text-gray-400">Registrujte se kao radnik, popunite profil sa svojim vještinama i počnite dobijati upite od klijenata!</p>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Spremni da pronađete svog radnika?
          </h2>
          <p className="text-gray-400 mb-8">
            Pridružite se hiljadama zadovoljnih korisnika širom BiH
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/workers" 
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-glow hover:shadow-glow-lg"
            >
              <Search className="w-5 h-5" />
              Pronađi radnika
            </Link>
            <Link 
              to="/register?type=worker" 
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200"
            >
              <Wrench className="w-5 h-5" />
              Postani radnik
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;