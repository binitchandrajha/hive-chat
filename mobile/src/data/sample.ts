import type { Person } from '../types/person';

/** Sample people from the design file — used by the gallery and screens until the API is wired. */
export const people = {
  aarav: { id: 'aarav', name: 'Aarav Sharma', initials: 'AS', color: 0, online: true, about: 'Building things that buzz 🐝', phone: '+977 981-234-5678' },
  priya: { id: 'priya', name: 'Priya Thapa', initials: 'PT', color: 7, online: true, about: 'Coffee first ☕' },
  mom: { id: 'mom', name: 'Mom ❤️', initials: 'M', color: 2 },
  rohan: { id: 'rohan', name: 'Rohan K.', initials: 'RK', color: 3 },
  sita: { id: 'sita', name: 'Sita Gurung', initials: 'SG', color: 1, online: true },
  kiran: { id: 'kiran', name: 'Kiran Adhikari', initials: 'KA', color: 4 },
  anjali: { id: 'anjali', name: 'Anjali Rai', initials: 'AR', color: 6 },
  nabin: { id: 'nabin', name: 'Nabin Shrestha', initials: 'NS', color: 5 },
  design: { id: 'design', name: 'Design Squad', initials: 'DS', color: 4, group: true },
  devhive: { id: 'devhive', name: 'Dev Hive 🐝', initials: 'DH', color: 0, group: true },
  family: { id: 'family', name: 'Family', initials: 'F', color: 1, group: true },
  me: { id: 'me', name: 'Binit Jha', initials: 'BJ', color: 0, about: 'Building Hive 🐝' },
} as const satisfies Record<string, Person>;
