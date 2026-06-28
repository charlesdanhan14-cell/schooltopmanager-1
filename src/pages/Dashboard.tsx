import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Clock, 
  ChevronRight,
  School,
  GraduationCap,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { cn } from '../lib/utils';
import { supabase } from '../integrations/supabase/client';

export function Dashboard() {
  const { currentUser, activeSchool } = useApp();
  const [stats, setStats] = useState({
    studentCount: 0,
    averageGrade: '13.42',
    attendanceRate: '94%',
    revenue: '0.0',
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    if (!activeSchool?.id) return;

    const fetchStats = async () => {
      // Student count
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('establishment_id', activeSchool.id);

      // Recent revenue (last 30 days)
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .gte('payment_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      
      const revenueValue = payments?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0;

      setStats(prev => ({
        ...prev,
        studentCount: studentCount || 0,
        revenue: (revenueValue / 1000000).toFixed(1) + 'M',
      }));

      // Recent activities (Audit logs)
      const { data: logs } = await supabase
        .from('audit_logs')
        .select('*, profiles(full_name, avatar_url)')
        .eq('establishment_id', activeSchool.id)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (logs) setRecentActivities(logs);
    };

    fetchStats();
  }, [activeSchool?.id]);

  const WelcomeCard = () => (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#003366] to-[#004C99] text-white p-8 md:p-12 shadow-xl">
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
          Bienvenue, {currentUser?.name} ! 👋
        </h1>
        <p className="text-blue-100 text-lg mb-8 leading-relaxed">
          {currentUser?.role === 'DIRECTOR' 
            ? "Votre établissement affiche une croissance de 12% ce trimestre. 85% des notes ont été validées."
            : currentUser?.role === 'SUPER_ADMIN'
            ? "Vous gérez actuellement 3 établissements. Toutes les licences sont à jour."
            : "Ravi de vous revoir. Voici un aperçu de vos activités pour aujourd'hui."}
        </p>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white border-none rounded-xl h-12 px-8 font-bold text-base shadow-lg shadow-orange-600/30">
            Voir les rapports
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/10 rounded-xl h-12 px-8 font-bold">
            Paramètres
          </Button>
        </div>
      </div>
      
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-2xl"></div>
      <School size={200} className="absolute bottom-[-40px] right-[-20px] text-white/5 -rotate-12 hidden lg:block" />
    </div>
  );

  const StatCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
      {[
        { label: 'Effectif Total', value: stats.studentCount, color: 'text-orange-600', bg: 'bg-orange-50', icon: Users, sub: '+0 nouveaux' },
        { label: 'Moyenne Générale', value: stats.averageGrade, color: 'text-blue-600', bg: 'bg-blue-50', icon: GraduationCap, sub: 'Stable' },
        { label: 'Taux de Présence', value: stats.attendanceRate, color: 'text-green-600', bg: 'bg-green-50', icon: Clock, sub: 'Excellent' },
        { label: 'Recettes (Mois)', value: stats.revenue, color: 'text-purple-600', bg: 'bg-purple-50', icon: TrendingUp, sub: 'Estimé' },
      ].map((stat, i) => (
        <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", stat.bg)}>
                <stat.icon size={22} className={stat.color} />
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{stat.sub}</span>
            </div>
            <p className="text-2xl font-black text-slate-900 mb-1">{stat.value}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <WelcomeCard />
      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar size={22} className="text-orange-600" />
                Dernières Activités
              </h2>
              <Button variant="ghost" className="text-orange-600 font-bold text-sm">Voir tout</Button>
            </div>
            
            <div className="space-y-4">
               {recentActivities.map((act, i) => (
                 <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 group hover:border-orange-200 transition-colors">
                    <Avatar className="h-10 w-10">
                       <AvatarImage src={(act.profiles as any)?.avatar_url} />
                       <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                       <p className="text-sm">
                          <span className="font-bold text-slate-900">{(act.profiles as any)?.full_name || 'Système'}</span>{' '}
                          <span className="text-slate-600">{act.action}</span>
                       </p>
                       <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">{new Date(act.created_at).toLocaleString()}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-orange-600 transition-colors" />
                 </div>
               ))}
               {recentActivities.length === 0 && <p className="text-center text-slate-400 py-8">Aucune activité récente.</p>}
            </div>
          </section>

          <section>
             <h2 className="text-xl font-bold text-slate-900 mb-6">Progression des Validations</h2>
             <Card className="border-none shadow-sm rounded-2xl bg-white p-6">
                <div className="space-y-6">
                   {[
                     { label: 'Trimestre 1', progress: 100, color: 'bg-green-500' },
                     { label: 'Trimestre 2', progress: 85, color: 'bg-orange-500' },
                     { label: 'Trimestre 3', progress: 0, color: 'bg-slate-200' },
                   ].map((t, i) => (
                     <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                           <span className="text-slate-700">{t.label}</span>
                           <span className={cn(t.progress === 100 ? "text-green-600" : "text-orange-600")}>{t.progress}%</span>
                        </div>
                        <Progress value={t.progress} className="h-2" />
                     </div>
                   ))}
                </div>
             </Card>
          </section>
        </div>

        <div className="space-y-8">
           <section>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Accès Rapides</h2>
              <div className="grid grid-cols-2 gap-3">
                 {[
                   { label: 'Bulletins', icon: GraduationCap, bg: 'bg-blue-600' },
                   { label: 'Absences', icon: Clock, bg: 'bg-orange-600' },
                   { label: 'Discipline', icon: AlertCircle, bg: 'bg-red-600' },
                   { label: 'Messages', icon: MessageSquare, bg: 'bg-[#003366]' },
                 ].map((action, i) => (
                   <Button key={i} className={cn("h-auto py-6 flex-col gap-3 rounded-2xl shadow-sm border-none text-white", action.bg)}>
                      <action.icon size={24} />
                      <span className="text-xs font-bold uppercase tracking-wider">{action.label}</span>
                   </Button>
                 ))}
              </div>
           </section>

           <section>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Alertes Système</h2>
              <div className="space-y-3">
                 <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3">
                    <AlertCircle className="text-red-600 shrink-0" size={20} />
                    <div>
                       <p className="text-xs font-bold text-red-900 uppercase mb-1">Stock Faible</p>
                       <p className="text-xs text-red-700 leading-relaxed">Les carnets de correspondance sont presque épuisés (Reste 12).</p>
                    </div>
                 </div>
                 <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3">
                    <Clock className="text-orange-600 shrink-0" size={20} />
                    <div>
                       <p className="text-xs font-bold text-orange-900 uppercase mb-1">Delibération J-3</p>
                       <p className="text-xs text-orange-700 leading-relaxed">Préparez les rapports pour la commission de vendredi.</p>
                    </div>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
