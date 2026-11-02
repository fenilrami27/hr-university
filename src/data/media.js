// HR University Centralized Media Registry
// Verified free commercial use assets (Unsplash, Pexels, CC0)

export const mediaRegistry = {
  heroReel: [
    {
      id: 'clip-1',
      label: 'Campus',
      title: 'Global High-Tech Campus Atrium & Towers',
      video: '/videos/hero/hero-1.mp4',
      poster: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80',
      duration: 5500, // 5.5s
      credit: { photographer: 'Vasily Kolotusha', source: 'Unsplash' },
    },
    {
      id: 'clip-2',
      label: 'Students',
      title: 'Collaborative Studio Sprints & Peer Hackathons',
      video: '/videos/hero/hero-2.mp4',
      poster: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80',
      duration: 5500,
      credit: { photographer: 'Priscilla Du Preez', source: 'Unsplash' },
    },
    {
      id: 'clip-3',
      label: 'Labs',
      title: '512-H100 Supercomputing & Robotics Bays',
      video: '/videos/hero/hero-3.mp4',
      poster: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1920&q=80',
      duration: 5500,
      credit: { photographer: 'Science in HD', source: 'Unsplash' },
    },
    {
      id: 'clip-4',
      label: 'Sports',
      title: 'Olympic Athletics & Biometrics Stadium',
      video: '/videos/hero/hero-4.mp4',
      poster: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1920&q=80',
      duration: 5500,
      credit: { photographer: 'Braden Collum', source: 'Unsplash' },
    },
  ],
  hero: {
    video: '/videos/hero/hero-1.mp4',
    poster: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80',
  },
  chancellor: {
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    name: 'Dr. Althea Sterling',
    role: 'Chancellor & Fellow',
    alt: 'Portrait of Dr. Althea Sterling, Chancellor of HR University',
  },
  departments: {
    ai: {
      src: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80',
      alt: 'Robotics and Neural Systems Studio',
    },
    cse: {
      src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
      alt: 'High Performance Computing and Server Infrastructure',
    },
    pharmacy: {
      src: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
      alt: 'Pharmaceutical & Paramedical Research Clinical Laboratory',
    },
    paramedical: {
      src: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
      alt: 'Paramedical and Health Sciences Simulation Suite',
    },
    sports: {
      src: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80',
      alt: 'Sports Science biomechanics athletics track complex',
    },
    design: {
      src: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1000&q=80',
      alt: 'Design and Spatial Computing Studio',
    },
    architecture: {
      src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      alt: 'Parametric Architecture and Urban Planning',
    },
    business: {
      src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
      alt: 'Venture Incubation cohort',
    },
    media: {
      src: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80',
      alt: 'Media and Film production soundstage',
    },
    biotech: {
      src: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
      alt: 'Synthetic Biology cleanroom',
    },
  },
  campus: [
    {
      id: 'library',
      title: 'The Turing Infinite Library',
      tag: 'Quiet Research',
      src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
      alt: 'Campus library with multi-tiered reading galleries',
      description: 'Over 250,000 digital volumes, private acoustic pods, and research booths.',
    },
    {
      id: 'supercomputing',
      title: 'Quantum & GPU Supercomputing Bay',
      tag: '512x H100 Nodes',
      src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
      alt: 'Supercomputing server cluster',
      description: 'Direct terminal shell access for training custom LLMs and robotics swarms.',
    },
    {
      id: 'makerspace',
      title: 'Cybernetic Robotics FabLab',
      tag: 'Open 24/7',
      src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
      alt: 'Robotics and drone hardware lab',
      description: 'Laser cutters, SLA 3D printers, PCB pick-and-place, and indoor drone test arena.',
    },
    {
      id: 'biodome',
      title: 'Skyline Aeroponic Bio-Dome',
      tag: 'Zero Carbon',
      src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
      alt: 'Glass rooftop greenhouse with solar tracking',
      description: 'Living research facility engineering sustainable crops and bioreactive filtration.',
    },
    {
      id: 'esports',
      title: 'Apex Kinetic Arena & Esports Hub',
      tag: 'Olympic Spec',
      src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
      alt: 'Athletic complex with digital arenas',
      description: 'Combining cardiovascular endurance telemetry with competitive collegiate tournament stages.',
    },
    {
      id: 'cafeteria',
      title: 'Atrium Commons & Organic Eatery',
      tag: 'Farm to Table',
      src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
      alt: 'Lively contemporary campus cafeteria',
      description: 'Fresh local culinary stations, matcha and nitro brew bars, and project booths.',
    },
  ],
  placements: [
    {
      id: 'placement-1',
      src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      alt: 'Commencement graduation caps celebration',
      caption: 'Commencement & Signing Day',
      credit: { photographer: 'Priscilla Du Preez', source: 'Unsplash' },
    },
    {
      id: 'placement-2',
      src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      alt: 'Engineering fellows in peer recruitment interview session',
      caption: 'Recruitment Hackday',
      credit: { photographer: 'Annie Spratt', source: 'Unsplash' },
    },
    {
      id: 'placement-3',
      src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      alt: 'Technical whiteboard system design interview review',
      caption: 'Portfolio Code Review',
      credit: { photographer: 'Neslihan Gunaydin', source: 'Unsplash' },
    },
    {
      id: 'placement-4',
      src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
      alt: 'Fellowship campus recruitment networking meet',
      caption: 'Industry Partner Exchange',
      credit: { photographer: 'Antenna', source: 'Unsplash' },
    },
  ],
};

export default mediaRegistry;
