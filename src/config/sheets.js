// Configuration for User's Live Google Sheet & AdPulse Analytics

export const USER_LIVE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1LLvUhgc55mqXU0MYirIZhEGdtGJ63o2faOkEdUlyhm4/edit?usp=sharing';
export const USER_LIVE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1LLvUhgc55mqXU0MYirIZhEGdtGJ63o2faOkEdUlyhm4/export?format=csv';

export const STORAGE_KEYS = {
  SHEET_URL: 'adpulse_sheet_url',
  COLUMN_MAP: 'adpulse_column_map',
  REFRESH_INTERVAL: 'adpulse_refresh_interval',
  CUSTOM_LEADS: 'adpulse_custom_leads',
  DATE_RANGE: 'adpulse_date_range'
};

// Preferred Contact Time Slots
export const CONTACT_SLOTS = ['Morning', 'Afternoon', 'Evening', 'Night'];

// Column Mappings tailored strictly to the 7 exact headers in your Google Sheet:
// [Timestamp, Full Name, Phone, City, Previus Attemps , Contact , Time]
export const DEFAULT_COLUMN_MAP = {
  leadName: {
    label: 'Full Name',
    defaultKey: 'Full Name',
    aliases: ['full name', 'name', 'lead name', 'customer name', 'client name']
  },
  phone: {
    label: 'Phone Number',
    defaultKey: 'Phone',
    aliases: ['phone', 'mobile', 'phone number', 'contact number', 'tel', 'whatsapp']
  },
  city: {
    label: 'City / Location',
    defaultKey: 'City',
    aliases: ['city', 'location', 'place', 'town', 'state', 'address']
  },
  contactTime: {
    label: 'Preferred Contact Slot',
    defaultKey: 'Contact ',
    aliases: ['contact ', 'contact', 'preferred time', 'call time', 'slot', 'contact time']
  },
  attempts: {
    label: 'Previous Attempts',
    defaultKey: 'Previus Attemps ',
    aliases: ['previus attemps ', 'previous attempts', 'attempts', 'previus attemps', 'call count', 'follow ups']
  },
  time: {
    label: 'Specific Time',
    defaultKey: 'Time',
    aliases: ['time', 'time slot', 'schedule time', 'exact time']
  },
  date: {
    label: 'Submission Date',
    defaultKey: 'Timestamp',
    aliases: ['timestamp', 'date', 'submission date', 'created at', 'lead date']
  }
};

// Smart auto-mapper that normalizes column headers and fuzzy matches
export function autoDetectColumnMap(headers = []) {
  const map = {};
  const lowerHeaders = headers.map(h => String(h).trim().toLowerCase());

  Object.entries(DEFAULT_COLUMN_MAP).forEach(([fieldKey, config]) => {
    let matchedHeader = null;

    // 1. Exact or alias match
    for (const alias of config.aliases) {
      const idx = lowerHeaders.indexOf(alias.trim());
      if (idx !== -1) {
        matchedHeader = headers[idx];
        break;
      }
    }

    // 2. Substring match
    if (!matchedHeader) {
      for (const alias of config.aliases) {
        const cleanAlias = alias.trim();
        const idx = lowerHeaders.findIndex(h => h.includes(cleanAlias) || cleanAlias.includes(h));
        if (idx !== -1) {
          matchedHeader = headers[idx];
          break;
        }
      }
    }

    map[fieldKey] = matchedHeader || config.defaultKey;
  });

  return map;
}

// Generate realistic 30-day mock dataset matching exact 7 sheet headers
export function generateMockData() {
  const cities = ['Hyderabad', 'Bangalore', 'Mumbai', 'Delhi NCR', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'];
  const contactSlots = ['Morning', 'Afternoon', 'Evening'];
  const firstNames = ['Aarav', 'Priya', 'Rohan', 'Ananya', 'Vikram', 'Sneha', 'Aditya', 'Neha', 'Rahul', 'Pooja', 'Karan', 'Meera', 'Arjun', 'Divya', 'Siddharth'];
  const lastNames = ['Sharma', 'Patel', 'Verma', 'Reddy', 'Gupta', 'Mehta', 'Nair', 'Singh', 'Chopra', 'Iyer'];

  const rows = [];
  const today = new Date();

  for (let d = 20; d >= 0; d--) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - d);
    const dateStr = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

    const count = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < count; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${fName} ${lName}`;
      const phone = `98${Math.floor(Math.random() * 90000000 + 10000000)}`;
      const city = cities[Math.floor(Math.random() * cities.length)];
      const slot = contactSlots[Math.floor(Math.random() * contactSlots.length)];
      const attempts = Math.floor(Math.random() * 2) + 1;
      const time = slot === 'Morning' ? '10:30 AM' : (slot === 'Afternoon' ? '02:45 PM' : '06:15 PM');

      rows.push({
        'Timestamp': dateStr,
        'Full Name': fullName,
        'Phone': phone,
        'City': city,
        'Previus Attemps ': attempts,
        'Contact ': slot,
        'Time': time
      });
    }
  }

  return rows;
}
