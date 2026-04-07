# Radnici.ba - Platforma za Pronalaženje Radnika

Profesionalna web aplikacija za povezivanje kvalifikovanih radnika sa klijentima u Bosni i Hercegovini.

## 🚀 Funkcionalnosti

- ✅ Registracija i prijava korisnika (JWT autentifikacija)
- ✅ Pretraga radnika po kategoriji, lokaciji, cijeni i iskustvu
- ✅ 32 kategorije sa 100+ podkategorija
- ✅ Detaljni profili radnika
- ✅ Recenzije i ocjene
- ✅ Favoriti - sačuvajte omiljene radnike
- ✅ Direktne poruke između korisnika i radnika
- ✅ Dashboard za korisnike
- ✅ Responzivni dizajn

## 🛠️ Tehnologije

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Zustand (state management)
- Axios
- Lucide React (ikone)

### Backend
- Node.js + Express
- JWT autentifikacija
- bcryptjs (enkripcija lozinki)
- Zod (validacija)
- Nodemailer (email notifikacije - opciono)

## 📦 Instalacija

### 1. Klonirajte projekat
```bash
cd radnici-app
```

### 2. Instalirajte sve zavisnosti
```bash
npm run install:all
```

### 3. Pokrenite razvoj
```bash
npm run dev
```

Ovo će pokrenuti:
- Frontend na http://localhost:5173
- Backend na http://localhost:5000

## 🚀 Deployment na Render

### Backend (Web Service)
1. Kreirajte novi Web Service na Render
2. Povežite GitHub repo
3. Build Command: `cd server && npm install`
4. Start Command: `cd server && npm start`
5. Dodajte environment varijable:
   - `PORT`: 5000
   - `NODE_ENV`: production
   - `JWT_SECRET`: vaš-sigurnosni-ključ
   - `CLIENT_URL`: URL vašeg frontend-a

### Frontend (Static Site)
1. Kreirajte novi Static Site na Render
2. Povežite GitHub repo
3. Root Directory: `client`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`
6. Dodajte environment varijable:
   - `VITE_API_URL`: URL vašeg backend-a

### PostgreSQL
1. Kreirajte PostgreSQL instancu na Render
2. Kopirajte DATABASE_URL
3. Dodajte u backend environment varijable

## 📁 Struktura Projekta

```
radnici-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI komponente
│   │   ├── pages/         # Stranice
│   │   ├── context/       # React Context
│   │   ├── services/      # API pozivi
│   │   ├── data/          # Statički podaci
│   │   └── hooks/         # Custom hooks
│   └── ...
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/     # Auth, validation
│   │   ├── routes/        # API routes
│   │   └── utils/         # Helpers
│   └── ...
└── package.json
```

## 🔐 Environment Varijable

### Server (.env)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-super-secret-key
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📝 Kategorije Radnika

1. Građevina (Zidar, Fasader, Tesar...)
2. Elektrika (Električar, Instalater...)
3. Vodoinstalacije (Vodoinstalater, Klimatizacija...)
4. Stolarstvo (Stolar, Montažer namještaja...)
5. Moleraj i Farbanje
6. Keramika
7. Bravarija
8. IT i Tehnika
9. Elektronika
10. Automobili
11. Transport
12. Čišćenje
13. Pomoć u Kući
14. Bašta i DVorište
15. Frizerstvo
16. Zdravlje i Ljepota
17. Kuhinja
18. Obrazovanje
19. Umjetnost
20. Pravne Usluge
21. Finansije
22. Marketing
23. Zdravstvo
24. Njega i Pomoć
25. Poljoprivreda
26. Životinje
27. Selidbe
28. Sport
29. Mašine
30. Projektovanje
31. Popravke
32. Specijalne Usluge

## 📧 Kontakt

- Email: info@radnici.ba
- Web: www.radnici.ba

## 📄 Licenca

MIT License
