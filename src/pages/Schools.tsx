import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  MoreVertical, 
  Globe
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../components/ui/dropdown-menu";
import { cn } from '../lib/utils';
import { supabase } from '../integrations/supabase/client';
import { Establishment } from '../types';

export function SchoolsPage() {
  const { setActiveSchool, activeSchool } = useApp();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstablishments = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('establishments').select('*');
      if (data) {
        const mapped: Establishment[] = data.map(est => ({
          id: est.id,
          name: est.name,
          sigle: est.sigle || '',
          slogan: est.slogan || '',
          code: est.code,
          authNumber: est.authorization_number || '',
          ministry: est.ministry || '',
          inspection: est.inspection || '',
          activeYear: (est.settings as any)?.activeYear || '2023-2024',
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
        }));
        setEstablishments(mapped);
      }
      setLoading(false);
    };
    fetchEstablishments();
  }, []);

  const filtered = establishments.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.address.city || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Multi-Établissements</h2>
          <p className="text-slate-500">Supervisez et gérez vos campus depuis un point central.</p>
        </div>
        <Button className="bg-[#003366] hover:bg-[#002244]">
          <Plus size={18} className="mr-2" />
          Ajouter un Établissement
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input 
          placeholder="Rechercher par nom, ville, code..." 
          className="pl-10 bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((school) => (
          <Card key={school.id} className={cn(
            "overflow-hidden border-2 transition-all group",
            activeSchool?.id === school.id ? "border-orange-500 bg-orange-50/10" : "border-slate-100 hover:border-slate-200 bg-white"
          )}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="h-20 w-20 bg-white border p-2 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
                     <img src={school.logos.primary} alt={school.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-slate-900">{school.name}</h3>
                      {activeSchool?.id === school.id && (
                        <Badge className="bg-orange-600 text-white border-none text-[10px] font-bold">ACTIF</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 font-medium italic">{school.slogan}</p>
                    <div className="flex gap-2 mt-2">
                       <code className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600 uppercase tracking-wider">{school.code}</code>
                       <span className="text-[10px] text-slate-400 font-bold uppercase">{school.activeYear}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-slate-400">
                      <MoreVertical size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Modifier Infos</DropdownMenuItem>
                    <DropdownMenuItem>Gérer Licences</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Désactiver</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-slate-600">
                      <MapPin size={16} className="text-orange-500" />
                      <span>{school.address.commune}, {school.address.city}</span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-600">
                      <Phone size={16} className="text-orange-500" />
                      <span>{school.address.phone}</span>
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-slate-600">
                      <Mail size={16} className="text-orange-500" />
                      <span className="truncate">{school.address.email}</span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-600">
                      <Globe size={16} className="text-orange-500" />
                      <span>www.school-portal.ci</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex -space-x-2">
                   {[1,2,3,4].map(i => (
                     <Avatar key={i} className="h-8 w-8 border-2 border-white">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${school.id}${i}`} />
                        <AvatarFallback>U</AvatarFallback>
                     </Avatar>
                   ))}
                   <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 border-2 border-white">+42</div>
                </div>
                <Button 
                  onClick={() => setActiveSchool(school)}
                  className={cn(
                    "rounded-xl font-bold h-10 px-6",
                    activeSchool?.id === school.id 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                      : "bg-[#003366] text-white hover:bg-[#002244]"
                  )}
                  disabled={activeSchool?.id === school.id}
                >
                  {activeSchool?.id === school.id ? 'Établissement Actif' : 'Sélectionner'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}