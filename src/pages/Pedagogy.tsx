import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  ShieldCheck
} from "lucide-react";
import { toast } from 'sonner';
import { cn } from '../lib/utils';

export function PedagogyPage() {
  const { classes, subjects, activeSchool } = useApp();
  const [activeTab, setActiveTab] = useState('structure');

  const handleValidate = () => {
    toast.success("Notes validées avec succès !", {
      description: "Les bulletins sont maintenant disponibles pour les parents.",
    });
  };

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-2xl font-bold text-slate-900">Organisation Pédagogique</h2>
          <p className="text-slate-500">Configurez les niveaux, classes, matières et validez les résultats.</p>
       </div>

       <Tabs defaultValue="structure" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100 p-1 rounded-2xl mb-8">
             <TabsTrigger value="structure" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Structure Académique</TabsTrigger>
             <TabsTrigger value="validation" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Validation des Notes</TabsTrigger>
             <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Paramètres Avancés</TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
                   <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle className="text-lg font-bold">Classes ({classes.length})</CardTitle>
                        <CardDescription>Liste des classes par niveau.</CardDescription>
                      </div>
                      <Button size="sm" className="bg-orange-600"><Layers size={16} className="mr-2" /> Ajouter</Button>
                   </CardHeader>
                   <CardContent>
                      <div className="space-y-2">
                         {classes.map(c => (
                           <div key={c.id} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center group">
                              <div>
                                 <p className="font-bold text-slate-900">{c.name}</p>
                                 <p className="text-xs text-slate-500">{c.level}</p>
                              </div>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">Gérer</Button>
                           </div>
                         ))}
                      </div>
                   </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
                   <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle className="text-lg font-bold">Matières ({subjects.length})</CardTitle>
                        <CardDescription>Matières et coefficients.</CardDescription>
                      </div>
                      <Button size="sm" className="bg-[#003366]"><BookOpen size={16} className="mr-2" /> Configurer</Button>
                   </CardHeader>
                   <CardContent>
                      <div className="space-y-2">
                         {subjects.map(s => (
                           <div key={s.id} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                 <div className={cn(
                                   "w-2 h-2 rounded-full",
                                   s.category === 'SCIENTIFIQUE' ? "bg-blue-500" : s.category === 'LITTERAIRE' ? "bg-orange-500" : "bg-green-500"
                                 )}></div>
                                 <p className="font-bold text-slate-900">{s.name}</p>
                              </div>
                              <Badge className="bg-white text-slate-700 border-slate-200 font-bold">Coef: {s.coefficient}</Badge>
                           </div>
                         ))}
                      </div>
                   </CardContent>
                </Card>
             </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-6">
             <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
                <CardHeader>
                   <CardTitle>Commission de Délibération</CardTitle>
                   <CardDescription>Validez les notes saisies par les enseignants pour générer les bulletins officiels.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                         <thead className="bg-slate-50 text-slate-500 font-bold">
                            <tr>
                               <th className="p-4 text-left">Classe</th>
                               <th className="p-4 text-left">Matière</th>
                               <th className="p-4 text-left">Enseignant</th>
                               <th className="p-4 text-center">Status</th>
                               <th className="p-4 text-center">Notes Saisies</th>
                               <th className="p-4 text-right">Action</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y">
                            <tr className="hover:bg-slate-50/50">
                               <td className="p-4 font-bold">6ème A</td>
                               <td className="p-4">Mathématiques</td>
                               <td className="p-4">M. Kouassi</td>
                               <td className="p-4 text-center">
                                  <Badge className="bg-orange-100 text-orange-700 border-none">À Valider</Badge>
                               </td>
                               <td className="p-4 text-center">25 / 25</td>
                               <td className="p-4 text-right">
                                  <Button size="sm" onClick={handleValidate} className="bg-green-600 hover:bg-green-700">Valider</Button>
                               </td>
                            </tr>
                            <tr className="hover:bg-slate-50/50">
                               <td className="p-4 font-bold">3ème B</td>
                               <td className="p-4">Français</td>
                               <td className="p-4">Mme. Traoré</td>
                               <td className="p-4 text-center">
                                  <Badge className="bg-green-100 text-green-700 border-none">Validé</Badge>
                               </td>
                               <td className="p-4 text-center">32 / 32</td>
                               <td className="p-4 text-right">
                                  <Button size="sm" variant="outline" disabled><CheckCircle2 size={16} /></Button>
                               </td>
                            </tr>
                         </tbody>
                      </table>
                   </div>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                   <CardHeader>
                      <CardTitle>Paramètres de l'Établissement</CardTitle>
                      <CardDescription>Modifiez les informations officielles et l'en-tête.</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label>Nom de l'établissement</Label>
                            <Input defaultValue={activeSchool?.name} />
                         </div>
                         <div className="space-y-2">
                            <Label>Année Scolaire Active</Label>
                            <Input defaultValue={activeSchool?.activeYear} />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label>Système de Notation</Label>
                            <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm">
                               <option>Trimestriel</option>
                               <option>Semestriel</option>
                            </select>
                         </div>
                         <div className="space-y-2">
                            <Label>Ministère de Tutelle</Label>
                            <Input defaultValue={activeSchool?.ministry} />
                         </div>
                      </div>
                      <div className="pt-4">
                        <Button className="bg-orange-600">Enregistrer les modifications</Button>
                      </div>
                   </CardContent>
                </Card>

                <div className="space-y-6">
                   <Card className="bg-[#003366] text-white">
                      <CardHeader>
                         <CardTitle className="text-base flex items-center gap-2">
                            <ShieldCheck size={18} className="text-orange-400" />
                            Audit Log
                         </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                         <div className="text-xs space-y-2">
                            <div className="flex justify-between">
                               <span className="text-blue-200">Dernière sauvegarde</span>
                               <span className="font-mono">Il y a 2h</span>
                            </div>
                            <div className="flex justify-between">
                               <span className="text-blue-200">Modif. Notes</span>
                               <span className="font-mono text-orange-400">12 requêtes</span>
                            </div>
                         </div>
                         <Button variant="ghost" className="w-full text-white hover:bg-white/10 text-xs font-bold">VOIR TOUT LE JOURNAL</Button>
                      </CardContent>
                   </Card>
                </div>
             </div>
          </TabsContent>
       </Tabs>
    </div>
  );
}