// Kayal Breeze — shared content used across pages.

export const contact = {
  phone: '+91 98473 12283',
  phoneHref: 'tel:+919847312283',
  whatsapp: '+91 98473 92283',
  whatsappTel: 'tel:+919847392283',
  email: 'kayalbreeze2026@gmail.com',
  addressLines: ['SK Homes, near Varapuzha Post Office', 'Varapuzha P.O., Kochi', 'Kerala 683517'],
  lat: 10.0712776,
  lng: 76.2713165,
};

// Enquiries are emailed here through formsubmit.co.
export const enquiryEmail = 'kayalbreeze2026@gmail.com';

export const waBase = 'https://wa.me/919847392283';

export const wa = (text = "Hello Kayal Breeze, I'd like to enquire about a room.") =>
  `${waBase}?text=${encodeURIComponent(text)}`;

export const nav = [
  { href: '/about.html', label: 'About' },
  { href: '/rooms.html', label: 'Rooms' },
  { href: '/gallery.html', label: 'Gallery' },
  { href: '/location.html', label: 'Location' },
];

export const rooms = [
  {
    id: 'suite',
    name: 'Suite room',
    tags: 'AC · daily or monthly',
    short: 'A bedroom with its own sitting room.',
    text: 'A bedroom and its own sitting room, under a slatted teak ceiling framed in cove light.',
    images: [
      { src: '/img/suite-bedroom.jpg', w: 1500, h: 1000, alt: 'Suite bedroom with a white bed, teak headboard, cove-lit ceiling and a lit dressing mirror' },
      { src: '/img/thumb/suite-sitting-room.jpg', w: 900, h: 1350, alt: 'Suite sitting room with a leather window seat and teak coffee table' },
    ],
    cover: { src: '/img/suite-bedroom-evening.jpg', w: 1000, h: 1500, alt: 'Suite bedroom in the evening under a slatted teak ceiling framed in cove light' },
    features: ['Double bed, white linen and comforter', 'Separate sitting room with a leather window seat', 'Split air-conditioner and ceiling fan', 'Wall-mounted TV', 'Wardrobe with a lit dressing mirror', 'Teak desk and chair'],
    enquire: '/contact.html?room=ac&stay=Suite%20room',
    cta: 'Enquire about the suite',
  },
  {
    id: 'deluxe',
    name: 'Deluxe room',
    tags: 'AC or non-AC · daily or monthly',
    short: 'Double bed and a lit dressing desk.',
    text: 'A bright double room with a dressing desk, chosen with or without air-conditioning.',
    images: [
      { src: '/img/deluxe-room-panelled.jpg', w: 1600, h: 900, alt: 'Deluxe room with a walnut bed, zebra blinds, panelled wall and white flowers on the bedside tables' },
      { src: '/img/thumb/deluxe-room-leaf.jpg', w: 900, h: 506, alt: 'Deluxe room with a leaf-print bedspread, a lit dressing unit and a teak door' },
    ],
    cover: { src: '/img/deluxe-room-panelled.jpg', w: 1600, h: 900, alt: 'Deluxe room with a walnut bed and zebra blinds' },
    features: ['Double bed, white linen and comforter', 'Air-conditioner (AC rooms) and ceiling fan', 'Wardrobe and dressing desk with LED mirror light', 'Desk chair', 'Zebra blinds on every window'],
    enquire: '/contact.html?room=any&stay=Deluxe%20room',
    cta: 'Enquire about a deluxe room',
  },
  {
    id: '2bhk',
    name: '2BHK flat',
    tags: 'AC and non-AC · daily or monthly',
    short: 'Two bedrooms, dining and a kitchen.',
    text: 'Two bedrooms, a hall with dining, and a kitchen of your own, for families and longer stays.',
    images: [
      { src: '/img/flat-kitchen-dining.jpg', w: 1600, h: 901, alt: 'Flat with a kitchen counter in black granite, a teak door and a dining table with four chairs' },
      { src: '/img/thumb/flat-dining.jpg', w: 900, h: 1600, alt: 'Dining area with a teak table, four chairs and a leather bench under a slatted wood ceiling' },
    ],
    cover: { src: '/img/flat-kitchen-dining.jpg', w: 1600, h: 901, alt: 'Flat kitchen counter and dining table' },
    features: ['Two bedrooms', 'Dining table and leather bench seating', 'Kitchen with granite counter and steel sink', 'Two-burner gas stove and refrigerator', 'Plates and dish rack'],
    enquire: '/contact.html?room=any&stay=2BHK%20flat',
    cta: 'Enquire about the 2BHK',
  },
  {
    id: '3bhk',
    name: '3BHK flat',
    tags: 'AC and non-AC · daily or monthly',
    short: 'Three bedrooms for families and groups.',
    text: 'Three bedrooms with the same kitchen and dining, for larger families and groups.',
    images: [
      { src: '/img/room-striped-linen.jpg', w: 1600, h: 900, alt: 'Bedroom with striped blue and cream linen, a walnut headboard and a teak chair by the window' },
      { src: '/img/thumb/flat-kitchen.jpg', w: 900, h: 507, alt: 'Flat kitchen with a refrigerator, gas stove and sink under two windows' },
    ],
    cover: { src: '/img/room-striped-linen.jpg', w: 1600, h: 900, alt: 'Bedroom with striped linen and a walnut headboard' },
    features: ['Three bedrooms', 'Dining area and seating', 'Kitchen with gas stove, sink and refrigerator', 'Wardrobes and desks in the bedrooms'],
    enquire: '/contact.html?room=any&stay=3BHK%20flat',
    cta: 'Enquire about the 3BHK',
  },
];

export const nearby = [
  { place: 'Varapuzha Post Office', dist: 'Next door', note: 'The landmark for finding us.' },
  { place: 'Kadamakudy islands', dist: 'About 5 km', note: 'Paddy fields, fishing nets and village roads on the backwater.' },
  { place: 'Lulu Mall, Edappally', dist: 'About 10 km', note: 'Shopping, food and cinema.' },
  { place: 'Marine Drive, Ernakulam', dist: 'About 16 km', note: 'The city waterfront and boat jetties.' },
  { place: 'Ernakulam Junction railway station', dist: 'About 17 km', note: 'Main rail station for Kochi.' },
  { place: 'Cochin International Airport', dist: 'About 25 km', note: 'Via the NH 66 and Aluva.' },
  { place: 'Fort Kochi', dist: 'About 26 km', note: 'The old port town, by road or ferry.' },
];

export const photos = [
  { cat: 'outside', file: 'facade-night.jpg', w: 896, h: 1071, cap: 'Kayal Breeze at night, downlights glowing under every eave' },
  { cat: 'rooms', file: 'suite-bedroom-evening.jpg', w: 900, h: 1350, cap: 'Suite bedroom in the evening under a cove-lit teak ceiling' },
  { cat: 'outside', file: 'garden-path.jpg', w: 900, h: 508, cap: 'Stepping stones across the gravel garden to the water wall' },
  { cat: 'rooms', file: 'suite-bedroom.jpg', w: 900, h: 600, cap: 'Suite bedroom with a lit dressing mirror and teak desk' },
  { cat: 'flats', file: 'flat-dining.jpg', w: 900, h: 1600, cap: 'Flat dining area with a teak table and leather bench' },
  { cat: 'rooms', file: 'deluxe-room-panelled.jpg', w: 900, h: 506, cap: 'Deluxe room with a walnut bed and panelled wall' },
  { cat: 'outside', file: 'buddha-water-wall.jpg', w: 900, h: 506, cap: 'The lit Buddha before the garden water wall' },
  { cat: 'rooms', file: 'suite-sitting-room.jpg', w: 900, h: 1350, cap: 'Suite sitting room with a leather window seat' },
  { cat: 'flats', file: 'flat-kitchen.jpg', w: 900, h: 507, cap: 'Flat kitchen with refrigerator, gas stove and sink' },
  { cat: 'rooms', file: 'deluxe-room-leaf.jpg', w: 900, h: 506, cap: 'Deluxe room with a lit dressing unit' },
  { cat: 'outside', file: 'facade-day.jpg', w: 896, h: 1108, cap: 'Kayal Breeze by day among the coconut palms' },
  { cat: 'rooms', file: 'bed-headboard.jpg', w: 900, h: 506, cap: 'Bed against a walnut headboard with a strip of warm light' },
  { cat: 'flats', file: 'flat-kitchen-dining.jpg', w: 900, h: 507, cap: 'Flat kitchen counter and dining table' },
  { cat: 'rooms', file: 'suite-room-day.jpg', w: 900, h: 1600, cap: 'Suite bedroom by day with a marble-look floor' },
  { cat: 'rooms', file: 'lounge-round-table.jpg', w: 900, h: 678, cap: 'Round teak table with tucked-in stools' },
  { cat: 'flats', file: 'flat-kitchenette.jpg', w: 900, h: 1350, cap: 'Kitchenette under a slatted wood ceiling' },
  { cat: 'rooms', file: 'room-striped-linen.jpg', w: 900, h: 506, cap: 'Bedroom with striped linen and a teak chair' },
];
