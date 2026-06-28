import { useState } from 'react';
import { useApp } from './context/AppContext';
import { AppProvider } from './context/AppContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { SchoolsPage } from './pages/Schools';
import { PedagogyPage } from './pages/Pedagogy';
import { StudentManagement } from './pages/Students';
import { GradesPage } from './pages/Grades';
import { FinancePage } from './pages/Finance';
import { SettingsPage } from './pages/Settings';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Toaster } from 'sonner';
import { LogIn, GraduationCap, Loader2 } from 'lucide-react';

function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-orange-600/5 overflow-hidden border border-slate-100">
          <div className="bg-[#003366] p-10 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
               <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                 <GraduationCap size={40} className="text-white" />
               </div>
               <h1 className="text-2xl font-black tracking-tight">SchoolTopManager</h1>
               <p className="text-blue-200 text-sm font-medium mt-1">Plateforme ERP Scolaire Elite</p>
            </div>
            <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-600 font-bold">Identifiant / Email</Label>
              <Input 
                type="email" 
                placeholder="nom@ecole.ci" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-orange-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-600 font-bold">Mot de passe</Label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-orange-500"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-orange-600/20 transition-all hover:-translate-y-0.5"
            >
              {loading ? <Loader2 className="mr-2 animate-spin" /> : <LogIn size={20} className="mr-2" />}
              {loading ? 'Connexion...' : 'Se Connecter'}
            </Button>
            
            <div className="pt-4 text-center">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Version 2.0.4 Premium</p>
            </div>
          </form>
        </div>
        
        <div className="mt-8 text-center text-slate-400 text-xs font-medium">
          © 2024 SchoolTopManager. Conçu pour l'Excellence Africaine.
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { currentUser, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 size={48} className="text-orange-600 animate-spin mb-4" />
        <p className="text-slate-600 font-bold">Chargement de SchoolTopManager...</p>
      </div>
    );
  }

  if (!currentUser) return <LoginPage />;

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/schools" element={<SchoolsPage />} />
        <Route path="/pedagogy" element={<PedagogyPage />} />
        <Route path="/students" element={<StudentManagement />} />
        <Route path="/grades" element={<GradesPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;