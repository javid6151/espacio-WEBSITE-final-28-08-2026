import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Layers, Award, Sparkles, DraftingCompass, CheckCircle2 } from 'lucide-react';
import SEO from '../components/common/SEO';
import ScrollDownIndicator from '../components/common/ScrollDownIndicator';
import { getCMSData, STORAGE_KEYS } from '../utils/cmsStore';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

const defaultStats = [
  { value: '25+', label: 'Projects Completed' },
  { value: '100+', label: 'Happy Clients' },
  { value: '40+', label: 'Years Legacy' }
];

const defaultGenerations = [
  {
    gen: 'Generation I',
    title: 'The Civil Foundation',
    company: 'Founding Stone Masonry & Engineering',
    desc: 'Our great-grandfather laid the structural foundation of our family construction legacy in Hyderabad. Built on load-bearing precision, structural integrity, and honest material sourcing.',
    image: '/images/company/2bhk_mordern_retro/hall_3.jpg'
  },
  {
    gen: 'Generation II',
    title: 'Mantana Constructions',
    company: 'Commercial & Multi-Family Residential',
    desc: 'Expanded into large-scale residential complexes and commercial landmarks across Hyderabad. Built a reputation for zero material compromises and strict engineering tolerances.',
    image: '/images/company/2bhk_urban/Ideas_2_2-_1-20260810-173541.jpg'
  },
  {
    gen: 'Generation III',
    title: 'Mastana Infra',
    company: 'Iconic Private Estates & Infrastructure',
    desc: 'Pioneered luxury architectural builds and bespoke private lakefront residences — including the lakeside estate chosen as a primary filming location in the movie Guntur Kaaram.',
    image: '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_15-20260813-110616.jpg'
  },
  {
    gen: 'Generation IV',
    title: 'ESPACIO Interiors & Modular',
    company: 'Engineering-First Bespoke Interiors',
    desc: 'Fusing structural construction mastery with luxury interior architecture. We don\'t just style spaces — we engineer every wall, cabinet, and finish for lifetime permanence.',
    image: '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_23-20260810-124912.jpg'
  }
];

const defaultGalleryImages = [
  {
    url: '/images/company/indo_classical_elegance_3bhk/3BHK-Master_Bedroom_0-20260810-121310.jpg',
    title: 'Architectural Cornice & Fluted Wainscoting',
    subtitle: 'Jubilee Hills Master Suite'
  },
  {
    url: '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Parents_Room_1-20260813-110616.jpg',
    title: 'Bespoke Solid Walnut Veneer Joinery',
    subtitle: 'Contemporary Luxury Suite'
  },
  {
    url: '/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-Guest_restaurant_20-20260810-120432.jpg',
    title: 'Curved Archways & Classical Plaster Trim',
    subtitle: 'Bespoke Living Lounge'
  },
  {
    url: '/images/company/2bhk_mordern_retro/hall_2.jpg',
    title: 'Halo Luminaire & Wall Paneling Architecture',
    subtitle: 'Modern Retro Residence'
  }
];

const getNonEmpty = (val, fallback) => (val && typeof val === 'string' && val.trim().length > 0 ? val : fallback);

/* ── Animated Counter Component ───────────────────────────────────── */
const Counter = ({ value, duration = 2 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const [displayValue, setDisplayValue] = useState(0);

  // Extract number and suffix/prefix (e.g., "100+" -> num: 100, suffix: "+", "25+" -> num: 25, suffix: "+")
  const strVal = String(value || '');
  const match = strVal.match(/^([^0-9]*)([0-9]+)([^0-9]*)$/);
  const prefix = match ? match[1] : '';
  const targetNum = match ? parseInt(match[2], 10) : null;
  const suffix = match ? match[3] : '';

  useEffect(() => {
    if (!inView || targetNum === null) return;
    let startTimestamp = null;
    let frameId;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // Smooth cubic-out easing
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easeProgress * targetNum));
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };
    frameId = window.requestAnimationFrame(step);
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [inView, targetNum, duration]);

  if (targetNum === null) {
    return <span>{value}</span>;
  }

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{displayValue}{suffix}
    </span>
  );
};

/* ── Scroll Reveal Wrapper ─────────────────────────────────────────── */
const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

const defaultAboutHeroImage = '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_22-20260813-110617.jpg';
const defaultAboutStoryImage = '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_10-20260813-110615.jpg';

const getValidHeroImage = (val, fallback = defaultAboutHeroImage) => {
  if (!val || typeof val !== 'string' || !val.trim() || val.includes('unsplash.com') || val.includes('photo-1600585154340-be6161a56a0c')) {
    return fallback;
  }
  return val;
};

const getValidStoryImage = (val, fallback = defaultAboutStoryImage) => {
  if (!val || typeof val !== 'string' || !val.trim() || val.includes('unsplash.com') || val.includes('3bhk_lux/open_hall.png') || val.includes('photo-1600585154340-be6161a56a0c')) {
    return fallback;
  }
  return val;
};

const getValidGenerations = (val) => {
  if (Array.isArray(val) && val.length > 0) {
    // If user's stored generations still have old duplicate open_hall image, replace with new defaults
    const hasDuplicates = val.some(g => g.image && (g.image.includes('3bhk_lux/open_hall.png') || g.image.includes('unsplash.com')));
    if (!hasDuplicates) return val;
  }
  return defaultGenerations;
};

const getValidGallery = (val) => {
  if (Array.isArray(val) && val.length > 0) {
    const hasDuplicates = val.some(g => g.url && (g.url.includes('3bhk_lux/open_hall.png') || g.url.includes('unsplash.com')));
    if (!hasDuplicates) return val;
  }
  return defaultGalleryImages;
};

const About = () => {
  const [activeTimeline, setActiveTimeline] = useState(null);
  const heroRef = useRef(null);

  // Page-level scroll for subtle parallax on the background image
  const { scrollYProgress } = useScroll();
  const bgScale = useTransform(scrollYProgress, [0, 0.25], [1.05, 0.98]);
  const bgY     = useTransform(scrollYProgress, [0, 0.25], ['0%', '8%']);

  // Hero exit scroll animation (scales down, fades, and moves with exit curve matching Home page)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroExitScale = useTransform(heroScroll, [0, 1], [1, 0.85]);
  const heroExitOpacity = useTransform(heroScroll, [0, 1], [1, 0]);
  const heroExitY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);

  const [aboutData, setAboutData] = useState(() => {
    const s = getCMSData(STORAGE_KEYS.SETTINGS);
    return {
      heroBadge: getNonEmpty(s?.about_hero_badge, 'About ESPACIO'),
      heroTitle: getNonEmpty(s?.about_hero_title, 'Four generations of construction.\nOne new standard for design.'),
      heroSubtitle: getNonEmpty(s?.about_hero_subtitle, 'Long before ESPACIO existed, our family was already building across Hyderabad through Mantana Constructions and Mastana Infra. We bring 40 years of load-bearing precision and structural engineering to luxury interior architecture.'),
      heroImage: getValidHeroImage(s?.about_hero_image, defaultAboutHeroImage),
      heroStats: (Array.isArray(s?.about_hero_stats) && s.about_hero_stats.length > 0) ? s.about_hero_stats : defaultStats,
      heroVisible: s?.about_hero_visible !== false,

      storyBadge: getNonEmpty(s?.about_story_badge, 'OUR ORIGIN STORY'),
      storyMain: getNonEmpty(s?.about_story_main, "Most interiors don't fail because of bad design. They fail because of what's hiding behind the design — walls that were never built right in the first place."),
      storyHighlight: getNonEmpty(s?.about_story_highlight, "We've spent four generations making sure that never happens."),
      storyP1: getNonEmpty(s?.about_story_p1, 'Long before Espacio existed, our family was already building, as builders. Our great-grandfather laid the literal foundation of a construction legacy that would run four generations deep, through two companies, Mantana Constructions and Mastana Infra, and 40+ years of homes, commercial spaces, and landmark builds across Hyderabad.'),
      storyP2: getNonEmpty(s?.about_story_p2, 'One of those builds is the lakeside home which was later chosen as a filming location for the movie Guntur Kaaram. Not because it was decorated well. Because it was built to be unforgettable.'),
      storyP3: getNonEmpty(s?.about_story_p3, "That's the world this brand comes from. Not showrooms. Job sites. Not mood boards. Load-bearing walls, material tolerances, what actually holds up over decades and what doesn't."),
      storyImage: getValidStoryImage(s?.about_story_image, defaultAboutStoryImage),
      milestoneLabel: getNonEmpty(s?.about_milestone_label, 'Engineering Milestone'),
      milestoneText: getNonEmpty(s?.about_milestone_text, 'Lakeside residence chosen as filming location for Guntur Kaaram'),
      milestoneVisible: s?.about_milestone_visible !== false,

      genBadge: getNonEmpty(s?.about_gen_badge, 'The Evolution'),
      genTitle: getNonEmpty(s?.about_gen_title, 'Four Generations of Mastery'),
      genSubtitle: getNonEmpty(s?.about_gen_subtitle, 'Hover to Expand Era'),
      generations: getValidGenerations(s?.about_generations),

      missionQuote: getNonEmpty(s?.about_mission_quote, '"We design spaces with intention — engineered first, styled second — so every home we touch is as functional as it is beautiful."'),
      visionQuote: getNonEmpty(s?.about_vision_quote, '"To redefine what interior design means — proving that real craftsmanship, not trends, is what makes a space timeless."'),

      galleryBadge: getNonEmpty(s?.about_gallery_badge, 'Visual Standards'),
      galleryTitle: getNonEmpty(s?.about_gallery_title, 'Craftsmanship in Detail'),
      galleryImages: getValidGallery(s?.about_gallery_images),

      ctaBadge: getNonEmpty(s?.about_cta_badge, 'GET IN TOUCH'),
      ctaTitle: getNonEmpty(s?.about_cta_title, 'Ready to Transform Your Space?'),
      ctaDesc: getNonEmpty(s?.about_cta_desc, "Let's discuss your luxury interior design and engineering requirements with our master team."),
      ctaBtnText: getNonEmpty(s?.about_cta_btn_text, "LET'S TALK ↗"),
      ctaBtnLink: getNonEmpty(s?.about_cta_btn_link, '/contact')
    };
  });

  useEffect(() => {
    const syncCMS = () => {
      const s = getCMSData(STORAGE_KEYS.SETTINGS);
      if (s) {
        setAboutData({
          heroBadge: getNonEmpty(s.about_hero_badge, 'About ESPACIO'),
          heroTitle: getNonEmpty(s.about_hero_title, 'Four generations of construction.\nOne new standard for design.'),
          heroSubtitle: getNonEmpty(s.about_hero_subtitle, 'Long before ESPACIO existed, our family was already building across Hyderabad through Mantana Constructions and Mastana Infra. We bring 40 years of load-bearing precision and structural engineering to luxury interior architecture.'),
          heroImage: getValidHeroImage(s.about_hero_image, defaultAboutHeroImage),
          heroStats: (Array.isArray(s.about_hero_stats) && s.about_hero_stats.length > 0) ? s.about_hero_stats : defaultStats,
          heroVisible: s.about_hero_visible !== false,

          storyBadge: getNonEmpty(s.about_story_badge, 'OUR ORIGIN STORY'),
          storyMain: getNonEmpty(s.about_story_main, "Most interiors don't fail because of bad design. They fail because of what's hiding behind the design — walls that were never built right in the first place."),
          storyHighlight: getNonEmpty(s.about_story_highlight, "We've spent four generations making sure that never happens."),
          storyP1: getNonEmpty(s.about_story_p1, 'Long before Espacio existed, our family was already building, as builders. Our great-grandfather laid the literal foundation of a construction legacy that would run four generations deep, through two companies, Mantana Constructions and Mastana Infra, and 40+ years of homes, commercial spaces, and landmark builds across Hyderabad.'),
          storyP2: getNonEmpty(s.about_story_p2, 'One of those builds is the lakeside home which was later chosen as a filming location for the movie Guntur Kaaram. Not because it was decorated well. Because it was built to be unforgettable.'),
          storyP3: getNonEmpty(s.about_story_p3, "That's the world this brand comes from. Not showrooms. Job sites. Not mood boards. Load-bearing walls, material tolerances, what actually holds up over decades and what doesn't."),
          storyImage: getValidStoryImage(s.about_story_image, defaultAboutStoryImage),
          milestoneLabel: getNonEmpty(s.about_milestone_label, 'Engineering Milestone'),
          milestoneText: getNonEmpty(s.about_milestone_text, 'Lakeside residence chosen as filming location for Guntur Kaaram'),
          milestoneVisible: s.about_milestone_visible !== false,

          genBadge: getNonEmpty(s.about_gen_badge, 'The Evolution'),
          genTitle: getNonEmpty(s.about_gen_title, 'Four Generations of Mastery'),
          genSubtitle: getNonEmpty(s.about_gen_subtitle, 'Hover to Expand Era'),
          generations: getValidGenerations(s.about_generations),

          missionQuote: getNonEmpty(s.about_mission_quote, '"We design spaces with intention — engineered first, styled second — so every home we touch is as functional as it is beautiful."'),
          visionQuote: getNonEmpty(s.about_vision_quote, '"To redefine what interior design means — proving that real craftsmanship, not trends, is what makes a space timeless."'),

          galleryBadge: getNonEmpty(s.about_gallery_badge, 'Visual Standards'),
          galleryTitle: getNonEmpty(s.about_gallery_title, 'Craftsmanship in Detail'),
          galleryImages: getValidGallery(s.about_gallery_images),

          ctaBadge: getNonEmpty(s.about_cta_badge, 'GET IN TOUCH'),
          ctaTitle: getNonEmpty(s.about_cta_title, 'Ready to Transform Your Space?'),
          ctaDesc: getNonEmpty(s.about_cta_desc, "Let's discuss your luxury interior design and engineering requirements with our master team."),
          ctaBtnText: getNonEmpty(s.about_cta_btn_text, "LET'S TALK ↗"),
          ctaBtnLink: getNonEmpty(s.about_cta_btn_link, '/contact')
        });
      }
    };

    syncCMS();

    window.addEventListener('espacio_cms_update', syncCMS);
    window.addEventListener('storage', syncCMS);
    return () => {
      window.removeEventListener('espacio_cms_update', syncCMS);
      window.removeEventListener('storage', syncCMS);
    };
  }, []);

  const values = [
    {
      num: '01',
      title: 'Engineering First',
      icon: DraftingCompass,
      desc: 'Every design decision is backed by structural calculations, acoustic isolation, and load tolerances. We build spaces to thrive over decades — not just look good in photos.'
    },
    {
      num: '02',
      title: 'Material Honesty',
      icon: ShieldCheck,
      desc: 'We source premium materials globally from trusted manufacturers, ensuring exceptional quality, authentic craftsmanship, and uncompromising standards in every project.'
    },
    {
      num: '03',
      title: 'Turnkey Accountability',
      icon: Layers,
      desc: 'Design, civil modifications, electrical, procurement, bespoke joinery, and handover — managed by a single unified engineering team with zero blame-shifting.'
    },
    {
      num: '04',
      title: '40-Year Heritage',
      icon: Award,
      desc: 'Four generations of construction trust in Hyderabad — from Mantana & Mastana to ESPACIO. We stand behind every millimetre of our work.'
    }
  ];

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
      title: 'Besoke Villa Interior',
      subtitle: 'Jubilee Hills Private Residence'
    },
    {
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
      title: 'Modular Precision Joinery',
      subtitle: 'ESPACIO Studio & Workshop'
    },
    {
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
      title: 'Italian Marble Architecture',
      subtitle: 'Gachibowli Modern Estate'
    },
    {
      url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80',
      title: 'Lakeside Architectural Build',
      subtitle: 'Featured in Guntur Kaaram'
    }
  ];

  return (
    <div className="bg-bg text-ink min-h-screen selection:bg-gold selection:text-ink">
      <SEO
        title="About — ESPACIO Interiors"
        description="ESPACIO is Hyderabad's premier engineering-first interior design studio, backed by 40 years of family construction legacy across Mantana & Mastana."
        url="/about"
      />

      {/* ── 1. SIGNATURE HERO BANNER (Rounded Dark Hero Card — 100% Full Screen View) ────────────── */}
      {aboutData.heroVisible !== false && (
        <section ref={heroRef} className="relative h-[94vh] lg:h-[98vh] min-h-[660px] lg:min-h-0 px-4 sm:px-6 pt-2 sm:pt-2.5 lg:pt-3 pb-2 sm:pb-3 lg:px-10 z-0">
          {/* Rounded card — fills the section with smooth exit transition matching Home page */}
          <motion.div
            style={{ scale: heroExitScale, opacity: heroExitOpacity, y: heroExitY }}
            className="relative w-full h-full overflow-hidden rounded-[24px] lg:rounded-[40px] bg-bg-dark text-white p-6 sm:p-10 md:p-14 lg:p-16 xl:p-20 shadow-2xl flex flex-col justify-between origin-top"
          >
            
            {/* Hero Background Image with Parallax & Overlay */}
            <div className="absolute inset-0 z-0 opacity-35 overflow-hidden">
              <motion.img
                style={{ scale: bgScale, y: bgY }}
                src={aboutData.heroImage}
                alt="ESPACIO Luxury Background"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/70 to-[#101014]/35" />
            </div>

            <div className="relative z-10 max-w-[1280px] w-full mx-auto space-y-4 md:space-y-6 pt-8 md:pt-4">
              {/* Clean White Pill Badge matching site standard */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-white text-[#101014] px-4 py-1.5 rounded-full text-[13px] font-sans font-medium shadow-lg border border-black/5 select-none tracking-normal mb-1 w-fit"
              >
                <Award size={14} className="text-[#101014] shrink-0" />
                <span>{aboutData.heroBadge || 'About ESPACIO'}</span>
              </motion.div>

              {/* Editorial Title */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(32px,5vw,72px)] font-normal leading-[1.08] tracking-tight text-white max-w-[950px] whitespace-pre-line"
              >
                {aboutData.heroTitle}
              </motion.h1>

              {/* Hero Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-sans text-[14px] md:text-[16px] text-white/70 max-w-[720px] leading-relaxed line-clamp-3 md:line-clamp-none"
              >
                {aboutData.heroSubtitle}
              </motion.p>
            </div>

            {/* Dynamic Hero Statistics Cards pinned to bottom of full-screen card */}
            <div className="relative z-10 max-w-[1280px] w-full mx-auto pt-6">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 border-t border-white/10 pt-4 md:pt-6"
              >
                {(aboutData.heroStats || defaultStats).map((st, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="p-4 sm:p-6 rounded-[18px] md:rounded-[20px] bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-xl border border-white/10 hover:border-gold/40 flex flex-col justify-between transition-all duration-300 group shadow-lg"
                  >
                    <div>
                      <p className="font-display text-[clamp(28px,2.8vw,44px)] font-bold text-gold leading-none tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left">
                        <Counter value={st.value} duration={2} />
                      </p>
                      <p className="font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60 group-hover:text-white/90 mt-2 sm:mt-3 leading-normal transition-colors duration-300">
                        {st.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* ── Center Scroll Down Indicator (Small, thin, transparent) ── */}
            <ScrollDownIndicator />

          </motion.div>
        </section>
      )}

      {/* ── 2. OUR STORY SECTION (Warm Cream Background) ─────────────────── */}
      <section className="py-24 px-6 md:px-12 border-b border-ink-border bg-bg">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column — Sticky Showcase Card */}
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-xl border border-ink-border group">
              <img
                src={getOptimizedImageUrl(aboutData.storyImage, 800, 75)}
                alt="ESPACIO Studio Craft"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {aboutData.milestoneVisible !== false && (
                <div className="absolute bottom-5 left-5 right-5 p-4 sm:p-5 rounded-[16px] bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl">
                  <span className="font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#9E7B3B] block">
                    {aboutData.milestoneLabel}
                  </span>
                  <p className="font-display text-base sm:text-lg font-bold text-[#101014] mt-1 leading-snug">
                    {aboutData.milestoneText}
                  </p>
                </div>
              )}
            </div>
          </Reveal>

          {/* Right Column — Narrative Story */}
          <Reveal delay={0.15} className="lg:col-span-7 space-y-6 pt-2">
            <h2 className="text-gold leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px,5.5vw,64px)', fontWeight: 'normal', letterSpacing: '0.02em' }}>
              {aboutData.storyBadge}
            </h2>
            <p className="text-ink leading-relaxed" style={{ fontFamily: "'Canela', 'Cormorant Garamond', 'Cinzel', serif", fontSize: 'clamp(18px,2.5vw,28px)', fontWeight: 700 }}>
              {aboutData.storyMain}
            </p>
            <p className="text-gold" style={{ fontFamily: "'Manrope', sans-serif", fontSize: '20px', fontWeight: 700, lineHeight: 1.9, letterSpacing: '-0.01em' }}>
              {aboutData.storyHighlight}
            </p>
            <p className="text-ink-soft" style={{ fontFamily: "'Manrope', sans-serif", fontSize: '17px', fontWeight: 400, lineHeight: 1.9, letterSpacing: '-0.01em' }}>
              {aboutData.storyP1}
            </p>
            <p className="text-ink-soft" style={{ fontFamily: "'Manrope', sans-serif", fontSize: '17px', fontWeight: 400, lineHeight: 1.9, letterSpacing: '-0.01em' }}>
              {aboutData.storyP2}
            </p>
            <p className="text-ink-soft" style={{ fontFamily: "'Manrope', sans-serif", fontSize: '17px', fontWeight: 400, lineHeight: 1.9, letterSpacing: '-0.01em' }}>
              {aboutData.storyP3}
            </p>
          </Reveal>

        </div>
      </section>

      {/* ── 3. INTERACTIVE 4-GENERATION EXPANDABLE ACCORDION (Soft Card Background) ──── */}
      <section className="py-24 px-6 md:px-12 border-b border-ink-border bg-bg-card">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-ink-border/60 pb-6">
            <div>
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-gold">{aboutData.genBadge}</span>
              <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-bold text-ink mt-1">{aboutData.genTitle}</h2>
            </div>
            <span className="font-sans text-xs text-ink-muted tracking-widest uppercase font-semibold">{aboutData.genSubtitle}</span>
          </Reveal>

          {/* Expandable Accordion Container */}
          <div 
            className="flex flex-col lg:flex-row gap-5 min-h-[460px] items-stretch"
            onMouseLeave={() => setActiveTimeline(null)}
          >
            {(aboutData.generations || defaultGenerations).map((item, idx) => {
              const isActive = activeTimeline === idx;
              const isHoveringAny = activeTimeline !== null;
              const isDimmed = isHoveringAny && !isActive;

              return (
                <motion.div
                  key={idx}
                  layout
                  onMouseEnter={() => setActiveTimeline(idx)}
                  onClick={() => setActiveTimeline(idx)}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  className={`relative rounded-[24px] overflow-hidden transition-all duration-500 cursor-pointer flex flex-col justify-between border ${
                    isActive
                      ? 'lg:flex-[3.2] bg-bg text-ink border-gold shadow-2xl z-20 ring-1 ring-gold/40 p-8 md:p-10 scale-[1.01]'
                      : isDimmed
                      ? 'lg:flex-1 bg-bg/40 text-ink-soft border-ink-border/70 z-10 p-6 md:p-8 opacity-75'
                      : 'lg:flex-1 bg-bg/80 text-ink border-ink-border hover:border-gold/50 z-10 p-6 md:p-8 opacity-100'
                  }`}
                >
                  {/* Subtle Image Backdrop for Expanded Card */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.06 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 pointer-events-none"
                    >
                      <img
                        src={getOptimizedImageUrl(item.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=60&fm=webp', 600, 60)}
                        alt="Background Texture"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-gold">
                        {item.gen}
                      </span>
                    </div>

                    <h3 className={`font-display font-bold text-ink transition-all ${
                      isActive ? 'text-2xl md:text-3xl mb-2' : 'text-xl md:text-2xl mb-1'
                    }`}>
                      {item.title}
                    </h3>

                    <p className="font-sans text-xs font-semibold text-gold uppercase tracking-wider mb-4">
                      {item.company}
                    </p>

                    <motion.p
                      layout
                      className={`font-sans text-sm text-ink-soft leading-relaxed transition-all ${
                        isActive ? 'opacity-100 max-w-[620px]' : 'opacity-80 line-clamp-3 lg:line-clamp-4'
                      }`}
                    >
                      {item.desc}
                    </motion.p>
                  </div>

                  <div className="relative z-10 pt-6 mt-6 border-t border-ink-border/40 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <span className={isActive ? 'text-gold' : 'text-ink-muted'}>
                      {isActive ? 'Active Era Details' : 'Hover to Expand'}
                    </span>
                    <span className={`w-2 h-2 rounded-full transition-all ${
                      isActive ? 'bg-gold scale-125 shadow-[0_0_10px_rgba(201,169,110,0.8)]' : 'bg-ink-line'
                    }`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. CORE PRINCIPLES GRID (🔒 LOCKED SECTION) ─────────────────── */}
      <section className="py-24 px-6 md:px-12 border-b border-ink-border bg-bg">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <Reveal className="text-center max-w-[700px] mx-auto">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-gold">Our Philosophy</span>
            <h2 className="font-display text-[clamp(28px,3.8vw,52px)] font-bold text-ink mt-1">
              Uncompromising Design Principles
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.num} delay={i * 0.1}>
                  <div className="p-8 md:p-10 rounded-[20px] bg-bg-card border border-ink-border shadow-sm hover:border-gold/50 hover:shadow-md transition-all duration-300 relative group overflow-hidden h-full flex flex-col justify-between">
                    <div className="absolute top-4 right-6 font-display text-5xl font-bold text-ink-border/40 group-hover:text-gold/20 transition-colors">
                      {v.num}
                    </div>

                    <div>
                      <div className="w-12 h-12 rounded-[14px] bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 group-hover:scale-105 transition-transform">
                        <Icon size={24} />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-ink mb-3">
                        {v.title}
                      </h3>
                      <p className="font-sans text-sm text-ink-soft leading-relaxed">
                        {v.desc}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-ink-border/40 flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-wider">
                      <CheckCircle2 size={14} />
                      <span>ESPACIO Guarantee</span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. MISSION & VISION (Dual Cards) ─────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 border-b border-ink-border bg-bg-card">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reveal delay={0}>
            <div className="p-8 md:p-12 rounded-[20px] bg-bg border border-ink-border shadow-sm relative overflow-hidden group hover:border-gold/40 transition-all">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gold" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-gold">Our Mission</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-ink leading-snug mt-4">
                {aboutData.missionQuote}
              </h3>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="p-8 md:p-12 rounded-[20px] bg-bg border border-ink-border shadow-sm relative overflow-hidden group hover:border-gold/40 transition-all">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gold" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-gold">Our Vision</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-ink leading-snug mt-4">
                {aboutData.visionQuote}
              </h3>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 6. CRAFTSMANSHIP GALLERY GRID ─────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 border-b border-ink-border bg-bg">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <Reveal className="text-center max-w-[650px] mx-auto">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-gold">{aboutData.galleryBadge}</span>
            <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-bold text-ink mt-1">
              {aboutData.galleryTitle}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(aboutData.galleryImages || defaultGalleryImages).map((img, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group relative aspect-[3/4] rounded-[20px] overflow-hidden border border-ink-border shadow-sm bg-bg-card cursor-pointer">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Color-Corrected High-Contrast Glass Card */}
                  <div 
                    className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl border border-black/5 rounded-[16px] p-4 sm:p-5 shadow-2xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 pointer-events-none overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#B89047]" />
                    <p className="font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#9E7B3B] pl-2">
                      {img.subtitle}
                    </p>
                    <h3 className="font-display text-sm sm:text-[15px] font-bold text-[#101014] leading-snug mt-1 pl-2">
                      {img.title}
                    </h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
