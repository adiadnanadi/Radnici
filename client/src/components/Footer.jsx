import { Link } from 'react-router-dom';
import { Search, Mail, Phone, MapPin, Globe, Heart, Share2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-200 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Radnici.ba</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Platforma za povezivanje kvalifikovanih radnika sa klijentima koji trebaju njihove usluge.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Brzi linkovi</h4>
            <ul className="space-y-2">
              <li><Link to="/workers" className="text-gray-400 hover:text-white transition-colors">Pronađi radnika</Link></li>
              <li><Link to="/categories" className="text-gray-400 hover:text-white transition-colors">Kategorije</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">O nama</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Kontakt</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Kategorije</h4>
            <ul className="space-y-2">
              <li><Link to="/workers?category=gradjevina" className="text-gray-400 hover:text-white transition-colors">Građevina</Link></li>
              <li><Link to="/workers?category=elektrika" className="text-gray-400 hover:text-white transition-colors">Elektrika</Link></li>
              <li><Link to="/workers?category=informatika" className="text-gray-400 hover:text-white transition-colors">IT i Tehnika</Link></li>
              <li><Link to="/workers?category=automobili" className="text-gray-400 hover:text-white transition-colors">Automobili</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                Sarajevo, Bosna i Hercegovina
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                +387 60 123 456
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                info@radnici.ba
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Heart className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Radnici.ba. Sva prava pridržana.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
