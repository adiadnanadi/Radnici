import { Link } from 'react-router-dom';
import { Search, Mail, MapPin, Wrench, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-300 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                <span className="text-primary-400">Radnici</span>
                <span className="text-gray-500">.ba</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              Najveća platforma za pronalaženje pouzdanih radnika u Bosni i Hercegovini. 
              Povezujemo majstore sa klijentima od 2024.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-primary-400 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-primary-400 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-primary-400 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Brzi linkovi</h4>
            <ul className="space-y-3">
              <li><Link to="/workers" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Pronađi radnika</Link></li>
              <li><Link to="/categories" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Sve kategorije</Link></li>
              <li><Link to="/register?type=worker" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Postani radnik</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Kako funkcioniše</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Popularne kategorije</h4>
            <ul className="space-y-3">
              <li><Link to="/workers?category=gradjevina" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Građevina</Link></li>
              <li><Link to="/workers?category=elektrika" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Elektrika</Link></li>
              <li><Link to="/workers?category=vodoinstalacije" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Vodoinstalacije</Link></li>
              <li><Link to="/workers?category=automobili" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Automehaničar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-primary-500" />
                Sarajevo, Bosna i Hercegovina
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-primary-500" />
                info@radnici.ba
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Radnici.ba. Sva prava pridržana.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-gray-500 hover:text-gray-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-gray-400 transition-colors">Uslovi korištenja</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;