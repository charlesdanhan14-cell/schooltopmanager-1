import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Establishment, Student, Grade, Subject, Class, Payment, Attendance, DisciplineRecord, Role } from '../types';
import { supabase } from '../integrations/supabase/client';
import * as Sonner from 'sonner';
import { Session } from '@supabase/supabase-js';

interface AppState {
  users: User[];
  establishments: Establishment[];
  classes: Class[];
  subjects: Subject[];
  students: Student[];
  grades: Grade[];
  payments: Payment[];
  attendances: Attendance[];
  discipline: DisciplineRecord[];
  currentUser: User | null;
  activeSchool: Establishment | null;
  isLoading: boolean;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setActiveSchool: (school: Establishment | null) => void;
  refreshData: () => Promise<void>;
  addGrade: (grade: Grade) => void;
  updateGrade: (grade: Grade) => void;
  validateGrades: (classId: string, subjectId: string, term: string) => void;
  addPayment: (payment: Payment) => void;
  addAttendance: (record: Attendance) => void;
  updateSchool: (school: Establishment) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    users: [],
    establishments: [],
    classes: [],
    subjects: [],
    students: [],
    grades: [],
    payments: [],
    attendances: [],
    discipline: [],
    currentUser: null,
    activeSchool: null,
    isLoading: true,
  });

  const [session, setSession] = useState<Session | null>(null);

  const refreshData = useCallback(async () => {
    // Only fetch if we have a session
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (!currentSession?.user) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .single();

      if (profileError) throw profileError;

      const user: User = {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        role: profile.role as Role,
        establishmentId: profile.establishment_id || undefined,
        avatar: profile.avatar_url || undefined,
      };

      // Fetch establishment if available
      let activeSchool: Establishment | null = null;
      if (profile.establishment_id) {
        const { data: est, error: estError } = await supabase
          .from('establishments')
          .select('*')
          .eq('id', profile.establishment_id)
          .single();
        
        if (!estError && est) {
          activeSchool = {
            id: est.id,
            name: est.name,
            sigle: est.sigle || '',
            slogan: est.slogan || '',
            code: est.code,
            authNumber: est.authorization_number || '',
            ministry: est.ministry || '',
            inspection: est.inspection || '',
            activeYear: (est.settings as any)?.activeYear || "2023-2024",
            address: {
              street: est.address || '',
              city: est.city || '',
              commune: est.commune || '',
              country: est.country,
              phone: est.phone_primary || '',
              email: est.email || '',
            },
            logos: {
              primary: est.logo_url || '',
              secondary: est.secondary_logo_url || '',
              stamp: est.stamp_url || '',
              directorSignature: est.director_signature_url || '',
            },
            headerConfig: (est.header_config as any) || {
              republic: est.republic_name || "RÉPUBLIQUE DE CÔTE D'IVOIRE",
              motto: est.republic_motto || "Union - Discipline - Travail",
              alignment: 'center',
              logoPosition: 'left',
              infoPosition: 'right',
            },
            gradingSystem: (est.pedagogy_system as any) || 'trimestriel',
          };
        }
      }

      setState(prev => ({
        ...prev,
        currentUser: user,
        activeSchool,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error fetching app data:', error);
      Sonner.toast.error("Erreur lors du chargement des données: " + error.message);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) refreshData();
      else setState(prev => ({ ...prev, isLoading: false }));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setState(prev => ({ ...prev, currentUser: null, activeSchool: null, isLoading: false }));
      } else {
        refreshData();
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshData]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Sonner.toast.error("Échec de la connexion : " + error.message);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const setActiveSchool = (school: Establishment | null) => 
    setState(prev => ({ ...prev, activeSchool: school }));

  const addGrade = (grade: Grade) => 
    setState(prev => ({ ...prev, grades: [...prev.grades, { ...grade, id: Math.random().toString() }] }));

  const updateGrade = (updatedGrade: Grade) =>
    setState(prev => ({ ...prev, grades: prev.grades.map(g => g.id === updatedGrade.id ? updatedGrade : g) }));

  const validateGrades = (classId: string, subjectId: string, term: string) => {
    setState(prev => ({
      ...prev,
      grades: prev.grades.map(g => {
        const student = prev.students.find(s => s.id === g.studentId);
        if (student?.classId === classId && g.subjectId === subjectId && g.term === term) {
          return { ...g, isValidated: true };
        }
        return g;
      })
    }));
  };

  const addPayment = (payment: Payment) =>
    setState(prev => ({ ...prev, payments: [...prev.payments, { ...payment, id: Math.random().toString(), date: new Date().toISOString() }] }));

  const addAttendance = (record: Attendance) =>
    setState(prev => ({ ...prev, attendances: [...prev.attendances, { ...record, id: Math.random().toString(), date: new Date().toISOString() }] }));

  const updateSchool = (school: Establishment) =>
    setState(prev => ({
      ...prev,
      establishments: prev.establishments.map(e => e.id === school.id ? school : e),
      activeSchool: prev.activeSchool?.id === school.id ? school : prev.activeSchool
    }));

  return (
    <AppContext.Provider value={{ 
      ...state, 
      login, 
      logout, 
      refreshData,
      setActiveSchool, 
      addGrade, 
      updateGrade, 
      validateGrades, 
      addPayment, 
      addAttendance,
      updateSchool
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
