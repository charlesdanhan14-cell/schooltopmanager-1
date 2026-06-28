import { Establishment, User, Class, Subject, Student } from "../types";

export const initialEstablishments: Establishment[] = [
  {
    id: "1",
    name: "Lycée International Excellence",
    sigle: "LIE",
    slogan: "L'excellence par le travail",
    code: "LIE-2024",
    authNumber: "N° 00234/MENA/CAB",
    ministry: "Ministère de l'Éducation Nationale",
    inspection: "DRENA Abidjan 1",
    activeYear: "2024-2025",
    address: {
      street: "Boulevard des Martyrs",
      city: "Abidjan",
      commune: "Cocody",
      country: "Côte d'Ivoire",
      phone: "+225 07070707",
      email: "contact@lie-edu.ci",
    },
    logos: {
      primary: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/fd8cbcf0-3df7-4d61-8f27-0922cbd0495f/logo-placeholder-c8eb4acf-1780355359249.webp",
      secondary: "",
      stamp: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/fd8cbcf0-3df7-4d61-8f27-0922cbd0495f/official-stamp-signature-0c529411-1780355360255.webp",
      directorSignature: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/fd8cbcf0-3df7-4d61-8f27-0922cbd0495f/official-stamp-signature-0c529411-1780355360255.webp",
    },
    headerConfig: {
      republic: "République de Côte d'Ivoire",
      motto: "Union - Discipline - Travail",
      alignment: "center",
      logoPosition: "left",
      infoPosition: "right",
    },
    gradingSystem: "trimestriel",
  }
];

export const initialUsers: User[] = [
  { id: "u1", name: "Admin Super", email: "admin@schooltop.com", role: "SUPER_ADMIN" },
  { id: "u2", name: "M. Kouadio", email: "director@schooltop.com", role: "DIRECTOR", establishmentId: "1" },
  { id: "u3", name: "Mme. Traore", email: "teacher@schooltop.com", role: "TEACHER", establishmentId: "1" },
  { id: "u4", name: "M. Koffi", email: "parent@schooltop.com", role: "PARENT", establishmentId: "1" },
];

export const initialClasses: Class[] = [
  { id: "c1", name: "6ème A", level: "6ème", establishmentId: "1" },
  { id: "c2", name: "3ème B", level: "3ème", establishmentId: "1" },
  { id: "c3", name: "Terminale C", level: "Terminale", series: "C", establishmentId: "1" },
];

export const initialSubjects: Subject[] = [
  { id: "s1", name: "Français", coefficient: 4, category: "LITTERAIRE", establishmentId: "1" },
  { id: "s2", name: "Mathématiques", coefficient: 5, category: "SCIENTIFIQUE", establishmentId: "1" },
  { id: "s3", name: "Anglais", coefficient: 3, category: "LITTERAIRE", establishmentId: "1" },
  { id: "s4", name: "Physique-Chimie", coefficient: 4, category: "SCIENTIFIQUE", establishmentId: "1" },
  { id: "s5", name: "EPS", coefficient: 2, category: "AUTRES", establishmentId: "1" },
];

export const initialStudents: Student[] = [
  {
    id: "st1",
    matricule: "20240001",
    name: "KOUAME",
    firstName: "Jean-Luc",
    birthDate: "2010-05-15",
    birthPlace: "Abidjan",
    gender: "M",
    nationality: "Ivoirienne",
    classId: "c1",
    establishmentId: "1",
    status: "AFFECTED",
    repeating: false,
    photo: "https://images.unsplash.com/photo-1594167154631-a30de01bc745?q=80&w=250&h=250&auto=format&fit=crop"
  },
  {
    id: "st2",
    matricule: "20240002",
    name: "DIALLO",
    firstName: "Fatoumata",
    birthDate: "2011-02-20",
    birthPlace: "Bouaké",
    gender: "F",
    nationality: "Guinéenne",
    classId: "c1",
    establishmentId: "1",
    status: "AFFECTED",
    repeating: false,
    photo: "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?q=80&w=250&h=250&auto=format&fit=crop"
  }
];