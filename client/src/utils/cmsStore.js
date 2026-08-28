import axios from 'axios';

// Shared space for real-time parallel synchronization between Admin CMS and Public Website

// Shared helper to upload an image file and return a clean, short permanent URL (/uploads/file.jpg)
export const uploadImageFile = async (file) => {
  if (!file) return null;
  const safeName = file.name.replace(/\s+/g, '_');
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result;
      try {
        const res = await axios.post('/upload-media', { fileName: file.name, base64 });
        if (res.data && res.data.success && res.data.url) {
          resolve(res.data.url);
          return;
        }
      } catch (err) {
        console.warn('/upload-media endpoint warning:', err);
      }
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });
};

export const STORAGE_KEYS = {
  PROJECTS: 'espacio_cms_projects',
  PRODUCTS: 'espacio_cms_products',
  SETTINGS: 'espacio_cms_settings',
  TESTIMONIALS: 'espacio_cms_testimonials',
  FAQS: 'espacio_cms_faqs',
  ENQUIRIES: 'espacio_cms_enquiries',
  ADMIN_USERS: 'espacio_cms_admin_users',
  AUDIT_LOGS: 'espacio_cms_audit_logs',
  MEDIA: 'espacio_cms_media',
};

// Dispatch change event to all tabs and active components
export const notifyCMSUpdate = () => {
  window.dispatchEvent(new Event('espacio_cms_update'));
};

// Get stored data with fallback
export const getCMSData = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const data = JSON.parse(raw);
        if (Array.isArray(data.hero_bg_images) && (data.hero_bg_images.some(img => typeof img === 'string' && (img.includes('unsplash.com') || img.includes('user_uploaded') || img.includes('company/duplex') || data.hero_bg_images.length !== 4)))) {
          data.hero_bg_images = [
            '/images/hero/hero_bedroom.jpg',
            '/images/hero/hero_kitchen.jpg',
            '/images/hero/hero_kids_bedroom.jpg',
            '/images/hero/hero_dining.jpg'
          ];
          try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
        }
        if (!Array.isArray(data.showcase_slides) || data.showcase_slides.length !== 4 || data.showcase_slides.some(s => s.projectImg?.includes('company/'))) {
          data.showcase_slides = [
            {
              projectImg: "/images/about/about_showcase_1.jpg",
              memberImg: "/reviews/paladugu_raju.png",
              name: "Spatial Design Lead",
              role: "Thematic Spatial Planning",
              projectLabel: "Cosmic Odyssey Kids Suite"
            },
            {
              projectImg: "/images/about/about_showcase_2.jpg",
              memberImg: "/reviews/kishor_kumar.png",
              name: "Interior Specialist",
              role: "Classical Boiserie Styling",
              projectLabel: "Sage Classical Lounge"
            },
            {
              projectImg: "/images/about/about_showcase_3.jpg",
              memberImg: "/reviews/amresh_kumar.png",
              name: "Joinery & Detailing",
              role: "Bespoke Study & Atelier",
              projectLabel: "Executive Study & Atelier"
            },
            {
              projectImg: "/images/about/about_showcase_4.jpg",
              memberImg: "/reviews/imtiyaz_shaik.png",
              name: "Modular Specialist",
              role: "High-Gloss Modular Kitchens",
              projectLabel: "Modern Quartzite Kitchen"
            }
          ];
          try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
        }
        if (key === STORAGE_KEYS.FAQS && Array.isArray(data)) {
          let modified = false;
          data.forEach(item => {
            if (typeof item.image === 'string' && item.image.includes('Guest_restaurant_18')) {
              item.image = '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_5-20260813-110615.jpg';
              modified = true;
            }
          });
          if (modified) {
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          }
        }
      return data;
    }
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
  }
  return fallback;
};

// Set stored data and broadcast real-time update
export const setCMSData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyCMSUpdate();
  } catch (err) {
    console.warn(`Error saving ${key} to localStorage:`, err);
  }
};

// Seed default media library items with authentic company project images
const DEFAULT_MEDIA_ITEMS = [
  {
    id: 'media-1',
    fileName: 'Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_18-20260813-110611.jpg',
    originalName: 'Duplex Guest Restaurant Lounge',
    imageUrl: '/images/company/3bhk_lux/open_hall.png',
    thumbnailUrl: '/images/company/3bhk_lux/open_hall.png',
    altText: 'Exquisite Duplex 4BHK Living & Dining Lounge with Italian Marble',
    caption: 'Duplex 4BHK Grand Living Lounge',
    category: 'Home',
    fileType: 'JPG',
    fileSize: '2.07 MB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-26T12:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  },
  {
    id: 'media-2',
    fileName: 'Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_3-20260810-124909.jpg',
    originalName: 'Minimalist Beige Living Room',
    imageUrl: '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_3-20260810-124909.jpg',
    thumbnailUrl: '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_3-20260810-124909.jpg',
    altText: 'Minimalist Beige Contemporary Living Room with Warm Ambient Lighting',
    caption: 'Minimalist Beige Sanctuary Living Area',
    category: 'Home',
    fileType: 'JPG',
    fileSize: '2.03 MB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-26T12:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  },
  {
    id: 'media-3',
    fileName: '3BHK-Guest_restaurant_4-20260810-164320.jpg',
    originalName: 'Indo Classical 3BHK Living & Dining',
    imageUrl: '/images/company/indo_classical_elegance_3bhk/3BHK-Guest_restaurant_4-20260810-164320.jpg',
    thumbnailUrl: '/images/company/indo_classical_elegance_3bhk/3BHK-Guest_restaurant_4-20260810-164320.jpg',
    altText: 'Indo-Classical Elegance 3BHK Grand Living Lounge with Brass Accents',
    caption: 'Indo-Classical Elegance 3BHK Showcase',
    category: 'Projects',
    fileType: 'JPG',
    fileSize: '2.12 MB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-26T12:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  },
  {
    id: 'media-4',
    fileName: 'open_hall.png',
    originalName: '3BHK Lux Open Hall Penthouse',
    imageUrl: '/images/company/3bhk_lux/open_hall.png',
    thumbnailUrl: '/images/company/3bhk_lux/open_hall.png',
    altText: 'Grand 3BHK Penthouse Luxe Open Hall with Ambient Profile Lighting',
    caption: 'Grand 3BHK Penthouse Luxe Living Space',
    category: 'Projects',
    fileType: 'PNG',
    fileSize: '1.98 MB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-26T12:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  },
  {
    id: 'media-5',
    fileName: 'Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_2-20260810-173514.jpg',
    originalName: 'Contemporary Modular Kitchen Suite',
    imageUrl: '/images/company/2bhk_urban/Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_2-20260810-173514.jpg',
    thumbnailUrl: '/images/company/2bhk_urban/Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_2-20260810-173514.jpg',
    altText: 'Sleek Contemporary Grey Modular Kitchen with Quartz Countertops',
    caption: 'Precision Modular Kitchen Fitout',
    category: 'Services',
    fileType: 'JPG',
    fileSize: '2.33 MB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-26T12:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  },
  {
    id: 'media-6',
    fileName: 'tv_unit_2_1.png',
    originalName: 'Bespoke TV Entertainment Console',
    imageUrl: '/images/company/2bhk_lux/tv_unit_2_1.png',
    thumbnailUrl: '/images/company/2bhk_lux/tv_unit_2_1.png',
    altText: 'Architectural Fluted TV Console with Ambient LED Backlighting',
    caption: 'Custom TV & Media Console Unit',
    category: 'Products',
    fileType: 'PNG',
    fileSize: '1.85 MB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-26T12:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  },
  {
    id: 'media-7',
    fileName: '3BHK-Master_Bedroom_0-20260810-164320.jpg',
    originalName: 'Indo Classical Master Bedroom Suite',
    imageUrl: '/images/company/indo_classical_elegance_3bhk/3BHK-Master_Bedroom_0-20260810-164320.jpg',
    thumbnailUrl: '/images/company/indo_classical_elegance_3bhk/3BHK-Master_Bedroom_0-20260810-164320.jpg',
    altText: 'Master Bedroom Suite with Custom Acoustic Headboard and Profile Lighting',
    caption: 'Bespoke Master Bedroom Sanctuary',
    category: 'Home',
    fileType: 'JPG',
    fileSize: '2.02 MB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-26T12:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  },
  {
    id: 'media-8',
    fileName: 'crockery1_1.png',
    originalName: 'Illuminated Crockery & Bar Unit',
    imageUrl: '/images/company/2bhk_lux/crockery1_1.png',
    thumbnailUrl: '/images/company/2bhk_lux/crockery1_1.png',
    altText: 'Luxury Fluted Glass Crockery & Bar Console with Integrated Lighting',
    caption: 'Dining Crockery & Bar Console Unit',
    category: 'Products',
    fileType: 'PNG',
    fileSize: '1.92 MB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-26T12:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  }
];

// Retrieve media items with fallback and ensure uploaded bedroom image is present
export const getMediaItems = () => {
  const stored = getCMSData(STORAGE_KEYS.MEDIA);
  const settingsStored = getCMSData(STORAGE_KEYS.SETTINGS);
  
  let items = [];
  if (stored && Array.isArray(stored) && stored.length > 0) {
    items = stored;
  } else if (settingsStored && Array.isArray(settingsStored.media_gallery_items) && settingsStored.media_gallery_items.length > 0) {
    items = settingsStored.media_gallery_items;
  } else {
    items = DEFAULT_MEDIA_ITEMS;
  }

  const hasBedroom = items.some(item => 
    item.imageUrl === '/images/user_uploaded_bedroom.jpg' || 
    item.fileName === 'user_uploaded_bedroom.jpg' ||
    item.originalName === 'media_1787072367913.jpg'
  );

  if (!hasBedroom) {
    items = [DEFAULT_MEDIA_ITEMS[0], ...items];
  }

  setCMSData(STORAGE_KEYS.MEDIA, items);
  return items;
};

// Save media items locally and persist permanently to Database (source of truth)
export const saveMediaItems = async (items) => {
  setCMSData(STORAGE_KEYS.MEDIA, items);
  const settings = getCMSData(STORAGE_KEYS.SETTINGS) || {};
  const updatedSettings = { ...settings, media_gallery_items: items };
  setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);

  // Clean dataUrl Base64 string from network payload to keep document size < 1KB
  const cleanPayload = (Array.isArray(items) ? items : [items]).map(item => {
    if (!item || typeof item !== 'object') return item;
    const copy = { ...item };
    delete copy.dataUrl;
    delete copy.base64;
    return copy;
  });

  try {
    await Promise.all([
      axios.post('/media', cleanPayload).catch(() => {}),
      axios.put('/settings', { media_gallery_items: cleanPayload }).catch(() => {})
    ]);
  } catch (err) {
    console.warn('Database sync error:', err);
  }
};

// Check if an image URL is currently in use across the CMS settings, projects, or products
export const checkImageUsageInCMS = (imageUrl) => {
  if (!imageUrl) return [];
  const locations = [];
  const target = imageUrl.trim();

  // 1. Check Site Settings
  const settings = getCMSData(STORAGE_KEYS.SETTINGS) || {};
  if (Array.isArray(settings.hero_bg_images) && settings.hero_bg_images.includes(target)) {
    locations.push('Home Page Hero Background Slider');
  }
  if (settings.hero_card_image === target) {
    locations.push('Home Page Floating Feature Card');
  }
  if (settings.services_bg_image === target) {
    locations.push('Services CMS Header Background');
  }
  if (settings.spaces_bg_image === target) {
    locations.push('Spaces CMS Header Background');
  }
  if (settings.materials_bg_image === target) {
    locations.push('Materials CMS Header Background');
  }
  if (settings.about_bg_image === target) {
    locations.push('About CMS Header Background');
  }
  if (settings.contact_bg_image === target) {
    locations.push('Contact CMS Header Background');
  }
  if (settings.footer_bg_image === target) {
    locations.push('Footer CMS Background');
  }
  if (settings.cta_bg_image === target) {
    locations.push('Global CTA Banner Background');
  }

  // 2. Check Projects
  const projects = getCMSData(STORAGE_KEYS.PROJECTS) || [];
  projects.forEach((proj) => {
    if (proj.heroImage === target) {
      locations.push(`Projects CMS: "${proj.title || 'Untitled'}" (Hero Cover)`);
    }
    if (Array.isArray(proj.gallery) && proj.gallery.includes(target)) {
      locations.push(`Projects CMS: "${proj.title || 'Untitled'}" (Gallery)`);
    }
  });

  // 3. Check Products
  const products = getCMSData(STORAGE_KEYS.PRODUCTS) || [];
  products.forEach((prod) => {
    if (prod.heroImage === target || prod.image === target) {
      locations.push(`Products CMS: "${prod.title || prod.name || 'Untitled'}" (Cover)`);
    }
    if (Array.isArray(prod.images) && prod.images.includes(target)) {
      locations.push(`Products CMS: "${prod.title || prod.name || 'Untitled'}" (Gallery)`);
    }
  });

  return locations;
};

// Robust multi-key helper to read CTA settings across all possible admin keys
export const getCtaDataForPage = (settings = {}, pageKey = 'home', defaultCta = {}) => {
  const pk = (pageKey || 'home').toLowerCase();
  const ctaObj = settings[`cta_${pk}`] || {};

  const pageTitle = settings[`${pk}_cta_title`] || settings[`${pk}_cta_headline`] || settings.cta_headline;
  const pageDesc  = settings[`${pk}_cta_desc`]  || settings[`${pk}_cta_subtext`]  || settings.cta_subtext;
  const pageBtn   = settings[`${pk}_cta_btn_text`] || settings[`${pk}_cta_button_text`] || settings.cta_button_text;
  const pageLink  = settings[`${pk}_cta_btn_link`] || settings[`${pk}_cta_button_link`];
  const pageBg    = settings[`${pk}_cta_bgImage`] || settings[`${pk}_cta_image`];
  const pageVis   = settings[`${pk}_cta_visible`];

  const headline = ctaObj.heading || pageTitle || defaultCta.headline || defaultCta.heading || 'Ready to Transform Your Space?';
  const subtext  = ctaObj.description || pageDesc || defaultCta.subtext || defaultCta.description || "Every great space starts with a single conversation. Let's talk about your vision and bring it to life together.";
  const buttonText = ctaObj.buttonText || pageBtn || defaultCta.buttonText || "LET'S TALK ↗";
  const buttonLink = ctaObj.buttonLink || pageLink || defaultCta.path || defaultCta.buttonLink || '/contact';
  const bgImage    = ctaObj.bgImage || pageBg || defaultCta.bgImage || '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_3-20260810-124909.jpg';
  const opacity    = ctaObj.opacity !== undefined ? Number(ctaObj.opacity) : (defaultCta.opacity ?? 80);

  let enabled = true;
  if (ctaObj.enabled === false) enabled = false;
  if (pageVis === false) enabled = false;
  if (settings.cta_visible === false && !settings[`cta_${pk}`]) enabled = false;

  return {
    heading: headline,
    headline,
    description: subtext,
    subtext,
    buttonText,
    buttonLink,
    bgImage,
    opacity,
    enabled
  };
};

