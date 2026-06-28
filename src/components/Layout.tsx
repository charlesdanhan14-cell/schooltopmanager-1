import { ReactNode, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  BookOpen, 
  GraduationCap, 
  CreditCard, 
  ClipboardCheck, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  Stethoscope,
  Library,
  Bell
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

interface SidebarItem {
  title: string;
  icon: any;
  path: string;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  { title: 'Tableau de bord', icon: LayoutDashboard, path: '/', roles: ['SUPER_ADMIN', 'DIRECTOR', 'TEACHER', 'PARENT', 'STUDENT', 'ACCOUNTANT', 'SUPERVISOR', 'SECRETARY'] },
  { title: 'Établissements', icon: School, path: '/schools', roles: ['SUPER_ADMIN'] },
  { title: 'Pédagogie', icon: GraduationCap, path: '/pedagogy', roles: ['DIRECTOR', 'SECRETARY'] },
  { title: 'Élèves', icon: Users, path: '/students', roles: ['DIRECTOR', 'SECRETARY', 'SUPERVISOR'] },
  { title: 'Personnel', icon: ShieldCheck, path: '/staff', roles: ['DIRECTOR'] },
  { title: 'Notes & Bulletins', icon: BookOpen, path: '/grades', roles: ['DIRECTOR', 'TEACHER', 'MAIN_TEACHER', 'PARENT', 'STUDENT'] },
  { title: 'Finances', icon: CreditCard, path: '/finance', roles: ['DIRECTOR', 'ACCOUNTANT'] },
  { title: 'Discipline', icon: ClipboardCheck, path: '/discipline', roles: ['DIRECTOR', 'SUPERVISOR'] },
  { title: 'Infirmerie', icon: Stethoscope, path: '/infirmary', roles: ['DIRECTOR', 'SUPERVISOR'] },
  { title: 'Bibliothèque', icon: Library, path: '/library', roles: ['DIRECTOR', 'SECRETARY'] },
  { title: 'Paramètres', icon: Settings, path: '/settings', roles: ['DIRECTOR'] },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { currentUser, logout, activeSchool } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!currentUser) return <>{children}</>;

  const filteredItems = sidebarItems.filter(item => 
    item.roles.includes(currentUser.role)
  );

  const NavContent = () => (
    <div className="flex flex-col h-full bg-[#003366] text-white">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-xl">
          S
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">SchoolTop</h1>
          <p className="text-xs text-orange-400">Manager ERP</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              location.pathname === item.path 
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" 
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-colors",
              location.pathname === item.path ? "text-white" : "text-slate-400 group-hover:text-white"
            )} />
            <span className="font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-10 w-10 border-2 border-orange-500">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback className="bg-orange-100 text-orange-700 font-bold uppercase">
                {currentUser.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-400 truncate capitalize">{currentUser.role.replace('_', ' ').toLowerCase()}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10 h-9 px-2"
            onClick={logout}
          >
            <LogOut size={16} className="mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 shadow-2xl z-50">
        <NavContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b sticky top-0 z-40 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-slate-600">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <NavContent />
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-2">
              <School size={20} className="text-orange-600" />
              <span className="font-semibold text-slate-800 hidden sm:inline-block">
                {activeSchool?.name || 'SchoolTopManager'}
              </span>
              {activeSchool && (
                <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {activeSchool.activeYear}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="relative text-slate-500">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
            </Button>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-900">{currentUser.name}</p>
              <p className="text-[11px] font-bold text-orange-600 tracking-tighter uppercase">{currentUser.role}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}