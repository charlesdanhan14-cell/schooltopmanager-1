export type Role = 
  | 'SUPER_ADMIN' 
  | 'DIRECTOR' 
  | 'SUPERVISOR' 
  | 'ACCOUNTANT' 
  | 'SECRETARY' 
  | 'TEACHER' 
  | 'MAIN_TEACHER' 
  | 'PARENT' 
  | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  establishmentId?: string;
  avatar?: string;
}

export interface Establishment {
  id: string;
  name: string;
  sigle: string;
  slogan: string;
  code: string;
  authNumber: string;
  ministry: string;
  inspection: string;
  activeYear: string;
  address: {
    street: string;
    city: string;
    commune: string;
    country: string;
    phone: string;
    email: string;
    gps?: string;
  };
  logos: {
    primary: string;
    secondary: string;
    stamp: string;
    directorSignature: string;
  };
  headerConfig: {
    republic: string;
    motto: string;
    alignment: 'left' | 'center' | 'right';
    logoPosition: 'left' | 'center' | 'right';
    infoPosition: 'left' | 'center' | 'right';
  };
  gradingSystem: 'trimestriel' | 'semestriel';
}

export interface Class {
  id: string;
  name: string;
  level: string;
  series?: string;
  mainTeacherId?: string;
  establishmentId: string;
}

export interface Subject {
  id: string;
  name: string;
  coefficient: number;
  category: 'LITTERAIRE' | 'SCIENTIFIQUE' | 'AUTRES';
  establishmentId: string;
}

export interface Student {
  id: string;
  matricule: string;
  name: string;
  firstName: string;
  birthDate: string;
  birthPlace: string;
  gender: 'M' | 'F';
  nationality: string;
  classId: string;
  establishmentId: string;
  photo?: string;
  parentId?: string;
  status: 'AFFECTED' | 'NON_AFFECTED';
  repeating: boolean;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  value: number;
  type: 'DEVOIR' | 'INTERRO' | 'EXAMEN';
  term: string; // T1, T2, T3 or S1, S2
  isValidated: boolean;
  teacherId: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  type: 'SCOLARITE' | 'INSCRIPTION' | 'CANTINE' | 'TRANSPORT';
  method: 'ESPECES' | 'ORANGE_MONEY' | 'MTN_MONEY' | 'MOOV_MONEY' | 'VIREMENT';
  date: string;
  establishmentId: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'PRESENT' | 'RETARD' | 'ABSENT_JUSTIFIED' | 'ABSENT_UNJUSTIFIED';
  hours: number;
}

export interface DisciplineRecord {
  id: string;
  studentId: string;
  type: 'AVERTISSEMENT' | 'BLAME' | 'CONVOCATION' | 'SANCTION';
  reason: string;
  date: string;
  pointsDeducted: number;
}