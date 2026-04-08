import pkg from 'express';
const { Request, Response } = pkg;
import { z } from 'zod';
import pool from '../db.js';

const createWorkerProfileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  description: z.string().optional(),
  hourlyRate: z.number().optional(),
  experienceYears: z.number().optional(),
  availability: z.enum(['AVAILABLE', 'BUSY', 'NOT_AVAILABLE']).optional(),
  serviceArea: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
});

export const getAllWorkers = async (req, res) => {
  try {
    const { location, category, minPrice, maxPrice, minExperience, availability, search, sort } = req.query;
    
    let query = 'SELECT * FROM worker_profiles WHERE "isActive" = true';
    const params = [];

    if (location) {
      params.push(`%${location}%`);
      query += ` AND location ILIKE $${params.length}`;
    }

    if (category) {
      params.push(category.toLowerCase());
      query += ` AND (LOWER(category) = $${params.length} OR LOWER(subcategory) = $${params.length})`;
    }

    if (minPrice) {
      params.push(parseFloat(minPrice));
      query += ` AND "hourlyRate" >= $${params.length}`;
    }

    if (maxPrice) {
      params.push(parseFloat(maxPrice));
      query += ` AND "hourlyRate" <= $${params.length}`;
    }

    if (minExperience) {
      params.push(parseInt(minExperience));
      query += ` AND "experienceYears" >= $${params.length}`;
    }

    if (availability) {
      params.push(availability);
      query += ` AND availability = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND ("firstName" ILIKE $${params.length} OR "lastName" ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    if (sort === 'price_low') {
      query += ' ORDER BY "hourlyRate" ASC';
    } else if (sort === 'price_high') {
      query += ' ORDER BY "hourlyRate" DESC';
    } else if (sort === 'rating') {
      query += ' ORDER BY rating DESC';
    } else if (sort === 'experience') {
      query += ' ORDER BY "experienceYears" DESC';
    }

    const result = await pool.query(query, params);
    res.json({ workers: result.rows, total: result.rows.length });
  } catch (error) {
    console.error('Get workers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getWorkerById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM worker_profiles WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get worker error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createWorkerProfile = async (req, res) => {
  try {
    const data = createWorkerProfileSchema.parse(req.body);

    const existingProfile = await pool.query('SELECT id FROM worker_profiles WHERE "userId" = $1', [req.user.userId]);
    if (existingProfile.rows.length > 0) {
      return res.status(400).json({ error: 'Worker profile already exists' });
    }

    const result = await pool.query(
      `INSERT INTO worker_profiles ("userId", "firstName", "lastName", phone, location, category, subcategory, description, "hourlyRate", "experienceYears", availability, "serviceArea", languages, skills, "isActive")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13::jsonb, $14::jsonb, true)
       RETURNING *`,
      [
        req.user.userId,
        data.firstName,
        data.lastName,
        data.phone || '',
        data.location,
        data.category,
        data.subcategory || '',
        data.description || '',
        data.hourlyRate || 0,
        data.experienceYears || 0,
        data.availability || 'AVAILABLE',
        JSON.stringify(data.serviceArea || []),
        JSON.stringify(data.languages || []),
        JSON.stringify(data.skills || [])
      ]
    );

    res.status(201).json({
      message: 'Worker profile created successfully',
      workerProfile: result.rows[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Create worker error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateWorkerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const data = createWorkerProfileSchema.partial().parse(req.body);

    const existing = await pool.query('SELECT "userId" FROM worker_profiles WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    if (existing.rows[0].userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updates = [];
    const params = [];
    let paramCount = 0;

    Object.entries(data).forEach(([key, value]) => {
      paramCount++;
      if (key === 'skills' || key === 'languages' || key === 'serviceArea') {
        if (value && typeof value === 'object') {
          params.push(JSON.stringify(value));
        } else {
          params.push(JSON.stringify([]));
        }
        updates.push(`"${key}" = $${paramCount}::jsonb`);
      } else {
        params.push(value);
        updates.push(`"${key}" = $${paramCount}`);
      }
    });

    if (updates.length > 0) {
      params.push(id);
      await pool.query(`UPDATE worker_profiles SET ${updates.join(', ')}, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $${paramCount}`, params);
    }

    const result = await pool.query('SELECT * FROM worker_profiles WHERE id = $1', [id]);
    res.json({ message: 'Worker profile updated successfully', workerProfile: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Update worker error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteWorkerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query('SELECT "userId" FROM worker_profiles WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    if (existing.rows[0].userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await pool.query('DELETE FROM worker_profiles WHERE id = $1', [id]);
    res.json({ message: 'Worker profile deleted successfully' });
  } catch (error) {
    console.error('Delete worker error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCategories = (req, res) => {
  const categories = [
    { id: 'gradjevina', name: 'Građevina', subcategories: ['Zidar', 'Fasader', 'Krovopokrivač', 'Tesar', 'Betonirac', 'Armirač', 'Građevinski radnik'] },
    { id: 'elektrika', name: 'Elektrika', subcategories: ['Električar', 'Elektroinstalater', 'Serviser solar sistema', 'Auto električar'] },
    { id: 'vodoinstalacije', name: 'Vodoinstalacije', subcategories: ['Vodoinstalater', 'Grijanje i ventilacija', 'Klimatizacija', 'Bojler servis'] },
    { id: 'stolarstvo', name: 'Stolarstvo', subcategories: ['Stolar', 'Montažer namještaja', 'Parketar', 'Bravari za drvo'] },
    { id: 'moleraj', name: 'Moleraj i Farbanje', subcategories: ['Moler', 'Farbar', 'Dekorater', 'Krečenje'] },
    { id: 'keramika', name: 'Keramika', subcategories: ['Keramicar', 'Popločavač', 'Mozaik majstor'] },
    { id: 'bravarija', name: 'Bravarija', subcategories: ['Bravarija', 'Metalostrugar', 'Varilac', 'Kovač'] },
    { id: 'informatika', name: 'IT i Tehnika', subcategories: ['IT podrška', 'Računarski serviser', 'Web developer', 'Software developer'] },
    { id: 'elektronika', name: 'Elektronika', subcategories: ['Serviser elektronike', 'TV serviser', 'Audio tehnika'] },
    { id: 'automobili', name: 'Automobili', subcategories: ['Auto mehaničar', 'Auto električar', 'Limar', 'Lakirer', 'Vulkanizer'] },
    { id: 'transport', name: 'Transport', subcategories: ['Vozač', 'Dostavljač', 'Taksista'] },
    { id: 'ciscenje', name: 'Čišćenje', subcategories: ['Čistač/ica', 'Deep cleaning', 'Čišćenje prozora'] },
    { id: 'pomockuci', name: 'Pomoć u Kući', subcategories: ['Domaćica', 'Kućni majordom', 'Peglanje'] },
    { id: 'vrt', name: 'Bašta i DVorište', subcategories: ['Baštovan', 'Pejzažni arhitekta', 'Održavanje travnjaka'] },
    { id: 'frizer', name: 'Frizerstvo', subcategories: ['Muški frizer', 'Ženski frizer', 'Kozmetičar', 'Manikir', 'Pedikir'] },
    { id: 'zdravlje', name: 'Zdravlje i Ljepota', subcategories: ['Masažni terapeut', 'Fitnes trener', 'Joga instruktor'] },
    { id: 'kuhinja', name: 'Kuhinja', subcategories: ['Kuvar', 'Pekar', 'Poslastičar', 'Barista', 'Barman'] },
    { id: 'obrazovanje', name: 'Obrazovanje', subcategories: ['Privatni nastavnik', 'Profesor jezika', 'Tutor'] },
    { id: 'umjetnost', name: 'Umjetnost', subcategories: ['Fotograf', 'Videograf', 'Grafički dizajner', 'Muzičar'] },
    { id: 'pravne', name: 'Pravne Usluge', subcategories: ['Advokat', 'Pravni savjetnik', 'Notar'] },
    { id: 'finansije', name: 'Finansije', subcategories: ['Računovođa', 'Knjigovođa', 'Poreski savjetnik'] },
    { id: 'marketing', name: 'Marketing', subcategories: ['Marketing stručnjak', 'Copywriter', 'SEO specijalista'] },
    { id: 'zdravstvo', name: 'Zdravstvo', subcategories: ['Medicinska sestra', 'Njegovatelj', 'Fizioterapeut'] },
    { id: 'negapomoc', name: 'Njega i Pomoć', subcategories: ['Gerontodomaćica', 'Negovatelj za starije', 'Dadilja'] },
    { id: 'poljoprivreda', name: 'Poljoprivreda', subcategories: ['Poljoprivrednik', 'Pčelar', 'Stočar', 'Voćar'] },
    { id: 'zivotinje', name: 'Životinje', subcategories: ['Veterinarski tehničar', 'Frizer za kućne ljubimce', 'Šetač pasa'] },
    { id: 'selidbe', name: 'Selidbe', subcategories: ['Selidbena ekipa', 'Montažer', 'Vozač kamiona'] },
    { id: 'sport', name: 'Sport', subcategories: ['Trener', 'Sportski instruktor', 'Organizator događaja'] },
    { id: 'masinerija', name: 'Mašine', subcategories: ['Buldožerista', 'Bagerista', 'Kranista', 'Viljuškarista'] },
    { id: 'projektovanje', name: 'Projektovanje', subcategories: ['Arhitekta', 'Građevinski inženjer', 'Interijer dizajner'] },
    { id: 'popravke', name: 'Popravke', subcategories: ['Serviser kućanskih aparata', 'Dimnjačar'] },
    { id: 'specijalni', name: 'Specijalne Usluge', subcategories: ['Ključ za bravu', 'Dezinfekcija', 'Deratizacija'] }
  ];
  res.json(categories);
};

export const getLocations = (req, res) => {
  const locations = [
    'Sarajevo', 'Banja Luka', 'Mostar', 'Tuzla', 'Zenica', 'Mostar',
    'Istočno Sarajevo', 'Prijedor', 'Trebinje', 'Doboj', 'Bihać',
    'Brčko', 'Užice', 'Kragujevac', 'Niš', 'Novi Sad', 'Beograd'
  ];
  res.json(locations);
};