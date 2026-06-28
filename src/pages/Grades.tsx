import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OfficialHeader } from '../components/OfficialHeader';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Student } from '../types';
import { Button } from '../components/ui/button';
import { Printer, Eye, GraduationCap } from 'lucide-react';
import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

interface BulletinProps {
  student: Student;
  term: string;
}

export function BulletinTemplate({ student, term }: BulletinProps) {
  const { activeSchool, subjects, grades, classes } = useApp();
  
  if (!activeSchool) return null;

  const studentGrades = grades.filter(g => g.studentId === student.id && g.term === term);
  const studentClass = classes.find(c => c.id === student.classId);

  // Group grades by subject
  const reportData = subjects.map(subject => {
    const subjectGrades = studentGrades.filter(g => g.subjectId === subject.id);
    const averageValue = subjectGrades.length > 0 
      ? subjectGrades.reduce((acc, curr) => acc + curr.value, 0) / subjectGrades.length 
      : 0;
    const coefficiedValue = averageValue * subject.coefficient;
    
    let appreciation = 'Passable';
    if (averageValue >= 16) appreciation = 'Excellent';
    else if (averageValue >= 14) appreciation = 'Très Bien';
    else if (averageValue >= 12) appreciation = 'Bien';
    else if (averageValue < 10) appreciation = 'Insuffisant';

    return {
      subject,
      average: averageValue.toFixed(2),
      coefficient: subject.coefficient,
      total: coefficiedValue.toFixed(2),
      appreciation,
      teacher: 'M. Kouassi' 
    };
  });

  const totals = reportData.reduce((acc, curr) => ({
    coef: acc.coef + curr.coefficient,
    total: acc.total + parseFloat(curr.total)
  }), { coef: 0, total: 0 });

  const generalAverage = totals.coef > 0 ? (totals.total / totals.coef).toFixed(2) : "0.00";

  const getDistinction = (avg: number) => {
    if (avg >= 16) return "TABLEAU D'HONNEUR + FÉLICITATIONS";
    if (avg >= 14) return "TABLEAU D'HONNEUR + ENCOURAGEMENTS";
    if (avg >= 12) return "TABLEAU D'HONNEUR";
    if (avg < 8) return "AVERTISSEMENT TRAVAIL";
    return "-";
  };

  return (
    <div className="bg-white p-8 max-w-[210mm] mx-auto shadow-2xl border min-h-[297mm] flex flex-col print:shadow-none print:m-0 print:border-none">
      <OfficialHeader establishment={activeSchool} />
      
      <div className="text-center my-6 space-y-1">
        <h2 className="text-xl font-bold border-2 border-black inline-block px-8 py-1 uppercase bg-slate-50">
          BULLETIN DE NOTES - {term.toUpperCase()}
        </h2>
        <p className="text-sm font-semibold italic">Année Scolaire : {activeSchool.activeYear}</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
        <div className="space-y-1">
          <p><span className="font-bold">NOM :</span> {student.name}</p>
          <p><span className="font-bold">PRÉNOMS :</span> {student.firstName}</p>
          <p><span className="font-bold">NÉ(E) LE :</span> {student.birthDate} à {student.birthPlace}</p>
          <p><span className="font-bold">MATRICULE :</span> {student.matricule}</p>
        </div>
        <div className="space-y-1 text-right">
          <p><span className="font-bold">CLASSE :</span> {studentClass?.name || 'N/A'}</p>
          <p><span className="font-bold">STATUT :</span> {student.status === 'AFFECTED' ? 'Affecté' : 'Non Affecté'}</p>
          <p><span className="font-bold">REDOUBLANT :</span> {student.repeating ? 'OUI' : 'NON'}</p>
          <p><span className="font-bold">GENRE :</span> {student.gender}</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <Table className="border-2 border-black">
          <TableHeader className="bg-slate-100">
            <TableRow className="border-b-2 border-black hover:bg-slate-100">
              <TableHead className="text-black font-bold border-r border-black">MATIÈRES</TableHead>
              <TableHead className="text-black font-bold text-center border-r border-black">MOY.</TableHead>
              <TableHead className="text-black font-bold text-center border-r border-black">COEF.</TableHead>
              <TableHead className="text-black font-bold text-center border-r border-black">MOY.xCOEF</TableHead>
              <TableHead className="text-black font-bold border-r border-black">APPRÉCIATION</TableHead>
              <TableHead className="text-black font-bold">PROFESSEUR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.map((row, i) => (
              <TableRow key={i} className="border-b border-slate-300 hover:bg-transparent h-10">
                <TableCell className="font-bold text-xs border-r border-black py-1">{row.subject.name}</TableCell>
                <TableCell className="text-center text-xs border-r border-black py-1">{row.average}</TableCell>
                <TableCell className="text-center text-xs border-r border-black py-1">{row.coefficient}</TableCell>
                <TableCell className="text-center text-xs font-bold border-r border-black py-1">{row.total}</TableCell>
                <TableCell className="text-[10px] border-r border-black py-1">{row.appreciation}</TableCell>
                <TableCell className="text-[10px] italic py-1">{row.teacher}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-slate-200 border-t-2 border-black font-bold">
              <TableCell className="text-right border-r border-black">TOTAL GÉNÉRAL</TableCell>
              <TableCell className="text-center border-r border-black">-</TableCell>
              <TableCell className="text-center border-r border-black">{totals.coef}</TableCell>
              <TableCell className="text-center border-r border-black">{totals.total.toFixed(2)}</TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="border-2 border-black p-4 space-y-2">
          <p className="text-sm font-bold uppercase underline">Résultats du Trimestre</p>
          <div className="grid grid-cols-2 text-sm">
            <p>Moyenne Trimestrielle:</p>
            <p className="font-bold text-lg">{generalAverage} / 20</p>
            <p>Rang:</p>
            <p className="font-bold">1er / {studentGrades.length > 0 ? 25 : 0}</p>
            <p>Conduite:</p>
            <p className="font-bold">18 / 20</p>
          </div>
          <div className="mt-4 p-2 border border-dashed border-black bg-slate-50">
            <p className="text-[10px] font-bold uppercase">Distinction:</p>
            <p className="text-xs font-bold text-orange-600">{getDistinction(parseFloat(generalAverage))}</p>
          </div>
        </div>

        <div className="border-2 border-black p-4 space-y-2">
          <p className="text-sm font-bold uppercase underline">Assiduité & Discipline</p>
          <div className="text-xs space-y-1">
            <p>Heures d'absence: <span className="font-bold">02 h</span></p>
            <p>Justifiées: <span className="font-bold">02 h</span></p>
            <p>Non justifiées: <span className="font-bold">00 h</span></p>
            <p>Retards: <span className="font-bold">01</span></p>
            <p className="mt-4">Sanction: <span className="font-bold">Néant</span></p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-12 grid grid-cols-2 text-center text-sm font-bold pb-8">
        <div className="space-y-12">
          <p>Le Professeur Principal</p>
          <div className="h-20 w-32 mx-auto border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-300 italic">Signature</div>
        </div>
        <div className="space-y-12">
          <p>Le Directeur des Études</p>
          <div className="relative inline-block">
             <img src={activeSchool.logos.stamp} alt="Stamp" className="h-24 w-auto opacity-80" />
             <img src={activeSchool.logos.directorSignature} alt="Signature" className="absolute top-4 left-4 h-16 w-auto mix-blend-multiply" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function GradesPage() {
  const { currentUser, students } = useApp();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [term, setTerm] = useState('T1');

  if (currentUser?.role === 'TEACHER') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Saisie des Notes</h2>
            <p className="text-slate-500">Choisissez une classe et une matière pour saisir les notes.</p>
          </div>
        </div>
        <Card className="p-8 text-center bg-white">
          <div className="max-w-md mx-auto space-y-4">
             <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600">
               <GraduationCap size={32} />
             </div>
             <h3 className="text-lg font-bold">Classes Affectées</h3>
             <p className="text-slate-500 text-sm">Vous êtes affecté aux classes : 6ème A, 3ème B. Sélectionnez une classe pour commencer.</p>
             <div className="flex gap-2 justify-center">
                <Button className="bg-orange-600">6ème A - Mathématiques</Button>
                <Button variant="outline">3ème B - Mathématiques</Button>
             </div>
          </div>
        </Card>
      </div>
    );
  }

  const student = students.find(s => s.id === selectedStudent);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Notes & Bulletins</h2>
            <p className="text-slate-500">Consultez les moyennes et générez les bulletins officiels.</p>
          </div>
          {selectedStudent && (
             <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                  Retour à la liste
                </Button>
                <Button className="bg-orange-600" onClick={() => window.print()}>
                  <Printer size={18} className="mr-2" />
                  Imprimer
                </Button>
             </div>
          )}
       </div>

       {!selectedStudent ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {students.map(s => (
             <Card key={s.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-slate-200 bg-white" onClick={() => setSelectedStudent(s.id)}>
                <div className="p-4 flex items-center gap-4">
                   <Avatar className="h-12 w-12 border-2 border-orange-100">
                      <AvatarImage src={s.photo} />
                      <AvatarFallback>{s.name[0]}</AvatarFallback>
                   </Avatar>
                   <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-slate-900 truncate">{s.name} {s.firstName}</p>
                      <p className="text-xs text-slate-500">{s.matricule} • 6ème A</p>
                   </div>
                   <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">Actif</Badge>
                </div>
                <div className="px-4 pb-4 flex justify-between items-center">
                   <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Moyenne T1</div>
                   <div className="text-lg font-black text-orange-600">14.52</div>
                </div>
                <div className="bg-slate-50 p-3 border-t flex justify-center">
                   <Button variant="ghost" size="sm" className="text-blue-600 font-bold text-xs h-8">
                     <Eye size={14} className="mr-2" /> Voir Bulletin
                   </Button>
                </div>
             </Card>
           ))}
         </div>
       ) : (
         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex justify-center gap-4 no-print">
               {['T1', 'T2', 'T3'].map(t => (
                 <Button 
                   key={t}
                   variant={term === t ? 'default' : 'outline'}
                   className={term === t ? 'bg-[#003366]' : ''}
                   onClick={() => setTerm(t)}
                 >
                   {t === 'T3' ? 'T3 / Annuel' : t}
                 </Button>
               ))}
            </div>
            {student && <BulletinTemplate student={student} term={term} />}
         </div>
       )}
    </div>
  );
}