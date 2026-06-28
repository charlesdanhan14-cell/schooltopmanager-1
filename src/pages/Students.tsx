import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  QrCode,
  FileText,
  Trash2,
  Edit
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../components/ui/dropdown-menu";
import { cn } from '../lib/utils';
import { supabase } from '../integrations/supabase/client';

export function StudentManagement() {
  const { activeSchool } = useApp();
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeSchool?.id) return;

    const fetchData = async () => {
      setLoading(true);
      const [studentsRes, classesRes] = await Promise.all([
        supabase.from('students').select('*').eq('establishment_id', activeSchool.id),
        supabase.from('classes').select('*').eq('establishment_id', activeSchool.id)
      ]);

      if (studentsRes.data) setStudents(studentsRes.data);
      if (classesRes.data) setClasses(classesRes.data);
      setLoading(false);
    };

    fetchData();
  }, [activeSchool?.id]);
  
  const filteredStudents = students.filter(s => 
    (s.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.matricule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClassName = (id: string) => classes.find(c => c.id === id)?.name || 'N/A';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion des Élèves</h2>
          <p className="text-slate-500">Gérez les inscriptions, dossiers et effectifs.</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-orange-600 hover:bg-orange-700">
            <UserPlus size={18} className="mr-2" />
            Nouvelle Inscription
          </Button>
          <Button variant="outline">
            <Download size={18} className="mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Élèves', value: students.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Garçons', value: students.filter(s => s.gender === 'M').length, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Filles', value: students.filter(s => s.gender === 'F').length, icon: Users, color: 'text-pink-600', bg: 'bg-pink-50' },
          { label: 'Nouveaux', value: '12', icon: UserPlus, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className={cn("p-4 rounded-2xl border flex items-center gap-4 bg-white", stat.bg.replace('bg-', 'border-'))}>
            <div className={cn("p-3 rounded-xl", stat.bg)}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Rechercher par nom, prénom ou matricule..." 
              className="pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Élève</TableHead>
              <TableHead>Matricule</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id} className="group hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={student.photo} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 font-bold uppercase">
                          {student.name[0]}{student.firstName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-slate-900">{student.last_name} {student.first_name}</p>
                        <p className="text-xs text-slate-500">{student.gender === 'M' ? 'Garçon' : 'Fille'} • {student.nationality}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-[10px] bg-slate-100 px-2 py-1 rounded font-mono text-slate-700">
                      {student.matricule}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-semibold text-blue-600 bg-blue-50 border-blue-100">
                      {getClassName(student.class_id)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      student.status === 'AFFECTED' ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-orange-100 text-orange-700 hover:bg-orange-200",
                      "border-none"
                    )}>
                      {student.status === 'AFFECTED' ? 'Affecté' : 'Non-Affecté'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" title="Dossier">
                        <FileText size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600 hover:bg-orange-50" title="QR Card">
                        <QrCode size={16} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-blue-600">
                            <Edit size={14} className="mr-2" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 size={14} className="mr-2" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  Aucun élève trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}