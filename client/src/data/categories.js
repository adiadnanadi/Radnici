export const CATEGORIES = [
  { id: 'gradjevina', name: 'Građevina', icon: '🏗️', subcategories: ['Zidar', 'Fasader', 'Krovopokrivač', 'Tesar', 'Betonirac', 'Armirač', 'Građevinski radnik'] },
  { id: 'elektrika', name: 'Elektrika', icon: '⚡', subcategories: ['Električar', 'Elektroinstalater', 'Serviser solar sistema', 'Auto električar'] },
  { id: 'vodoinstalacije', name: 'Vodoinstalacije', icon: '🚰', subcategories: ['Vodoinstalater', 'Grijanje i ventilacija', 'Klimatizacija', 'Bojler servis'] },
  { id: 'stolarstvo', name: 'Stolarstvo', icon: '🪚', subcategories: ['Stolar', 'Montažer namještaja', 'Parketar', 'Bravari za drvo'] },
  { id: 'moleraj', name: 'Moleraj i Farbanje', icon: '🎨', subcategories: ['Moler', 'Farbar', 'Dekorater', 'Krečenje'] },
  { id: 'keramika', name: 'Keramika', icon: '🧱', subcategories: ['Keramicar', 'Popločavač', 'Mozaik majstor'] },
  { id: 'bravarija', name: 'Bravarija', icon: '🔧', subcategories: ['Bravarija', 'Metalostrugar', 'Varilac', 'Kovač'] },
  { id: 'informatika', name: 'IT i Tehnika', icon: '💻', subcategories: ['IT podrška', 'Računarski serviser', 'Web developer', 'Software developer'] },
  { id: 'elektronika', name: 'Elektronika', icon: '📱', subcategories: ['Serviser elektronike', 'TV serviser', 'Audio tehnika'] },
  { id: 'automobili', name: 'Automobili', icon: '🚗', subcategories: ['Auto mehaničar', 'Auto električar', 'Limar', 'Lakirer', 'Vulkanizer'] },
  { id: 'transport', name: 'Transport', icon: '🚚', subcategories: ['Vozač', 'Dostavljač', 'Taksista'] },
  { id: 'ciscenje', name: 'Čišćenje', icon: '🧹', subcategories: ['Čistač/ica', 'Deep cleaning', 'Čišćenje prozora'] },
  { id: 'pomockuci', name: 'Pomoć u Kući', icon: '🏠', subcategories: ['Domaćica', 'Kućni majordom', 'Peglanje'] },
  { id: 'vrt', name: 'Bašta i DVorište', icon: '🌳', subcategories: ['Baštovan', 'Pejzažni arhitekta', 'Održavanje travnjaka'] },
  { id: 'frizer', name: 'Frizerstvo', icon: '✂️', subcategories: ['Muški frizer', 'Ženski frizer', 'Kozmetičar', 'Manikir', 'Pedikir'] },
  { id: 'zdravlje', name: 'Zdravlje i Ljepota', icon: '💆', subcategories: ['Masažni terapeut', 'Fitnes trener', 'Joga instruktor'] },
  { id: 'kuhinja', name: 'Kuhinja', icon: '👨‍🍳', subcategories: ['Kuvar', 'Pekar', 'Poslastičar', 'Barista', 'Barman'] },
  { id: 'obrazovanje', name: 'Obrazovanje', icon: '📚', subcategories: ['Privatni nastavnik', 'Profesor jezika', 'Tutor'] },
  { id: 'umjetnost', name: 'Umjetnost', icon: '🎭', subcategories: ['Fotograf', 'Videograf', 'Grafički dizajner', 'Muzičar'] },
  { id: 'pravne', name: 'Pravne Usluge', icon: '⚖️', subcategories: ['Advokat', 'Pravni savjetnik', 'Notar'] },
  { id: 'finansije', name: 'Finansije', icon: '💰', subcategories: ['Računovođa', 'Knjigovođa', 'Poreski savjetnik'] },
  { id: 'marketing', name: 'Marketing', icon: '📢', subcategories: ['Marketing stručnjak', 'Copywriter', 'SEO specijalista'] },
  { id: 'zdravstvo', name: 'Zdravstvo', icon: '🏥', subcategories: ['Medicinska sestra', 'Njegovatelj', 'Fizioterapeut'] },
  { id: 'negapomoc', name: 'Njega i Pomoć', icon: '👴', subcategories: ['Gerontodomaćica', 'Negovatelj za starije', 'Dadilja'] },
  { id: 'poljoprivreda', name: 'Poljoprivreda', icon: '🌾', subcategories: ['Poljoprivrednik', 'Pčelar', 'Stočar', 'Voćar'] },
  { id: 'zivotinje', name: 'Životinje', icon: '🐕', subcategories: ['Veterinarski tehničar', 'Frizer za kućne ljubimce', 'Šetač pasa'] },
  { id: 'selidbe', name: 'Selidbe', icon: '📦', subcategories: ['Selidbena ekipa', 'Montažer', 'Vozač kamiona'] },
  { id: 'sport', name: 'Sport', icon: '⚽', subcategories: ['Trener', 'Sportski instruktor', 'Organizator događaja'] },
  { id: 'masinerija', name: 'Mašine', icon: '🚜', subcategories: ['Buldožerista', 'Bagerista', 'Kranista', 'Viljuškarista'] },
  { id: 'projektovanje', name: 'Projektovanje', icon: '📐', subcategories: ['Arhitekta', 'Građevinski inženjer', 'Interijer dizajner'] },
  { id: 'popravke', name: 'Popravke', icon: '🔩', subcategories: ['Serviser kućanskih aparata', 'Dimnjačar'] },
  { id: 'specijalni', name: 'Specijalne Usluge', icon: '🎯', subcategories: ['Ključ za bravu', 'Dezinfekcija', 'Deratizacija'] }
];

export const LOCATIONS = [
  'Sarajevo', 'Banja Luka', 'Mostar', 'Tuzla', 'Zenica', 
  'Istočno Sarajevo', 'Prijedor', 'Trebinje', 'Doboj', 
  'Bihać', 'Brčko'
];

export const AVAILABILITY_OPTIONS = [
  { value: 'AVAILABLE', label: 'Dostupan', color: 'text-green-400' },
  { value: 'BUSY', label: 'Zauzet', color: 'text-yellow-400' },
  { value: 'NOT_AVAILABLE', label: 'Nedostupan', color: 'text-red-400' }
];
