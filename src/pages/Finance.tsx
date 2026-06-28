import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
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
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  TrendingUp,
  Receipt,
  Download,
  Smartphone,
  CheckCircle2,
  History,
  DollarSign
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';

export function FinancePage() {
  const { activeSchool } = useApp();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeSchool?.id) return;

    const fetchPayments = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('payments')
          .select('*, invoices(students(first_name, last_name))')
          .order('payment_date', { ascending: false })
          .limit(10);
        
        if (data) setRecentPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [activeSchool?.id]);

  const stats = [
    { label: 'Recettes Totales', value: '12 450 000 FCFA', icon: ArrowUpRight, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Dépenses', value: '3 200 000 FCFA', icon: ArrowDownLeft, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'En attente', value: '4 150 000 FCFA', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Trésorerie', value: '9 250 000 FCFA', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const paymentMethods = [
    { id: 'OM', name: 'Orange Money', color: 'bg-[#FF6600]' },
    { id: 'MTN', name: 'MTN Money', color: 'bg-[#FFCC00] text-black' },
    { id: 'MOOV', name: 'Moov Money', color: 'bg-[#004C99]' },
    { id: 'CASH', name: 'Espèces', color: 'bg-green-600' },
  ];

  const handlePayment = () => {
    toast.success("Paiement enregistré avec succès !", {
      description: "Le reçu PDF a été généré et envoyé au parent.",
      icon: <CheckCircle2 className="text-green-600" />,
    });
    setShowPaymentModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion Financière</h2>
          <p className="text-slate-500">Suivi des paiements, recettes et dépenses de l'établissement.</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#003366] hover:bg-[#002244]" onClick={() => setShowPaymentModal(true)}>
            <DollarSign size={18} className="mr-2" />
            Nouveau Paiement
          </Button>
          <Button variant="outline">
            <Download size={18} className="mr-2" />
            Rapport Mensuel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
               <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-xl font-black text-slate-900">{stat.value}</p>
                  </div>
                  <div className={cn("p-3 rounded-2xl", stat.bg)}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
               </div>
               <div className="h-1 bg-slate-100">
                  <div className={cn("h-full", stat.color.replace('text-', 'bg-'))} style={{ width: '65%' }}></div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Paiements Récents</CardTitle>
                <CardDescription>Les 10 dernières transactions enregistrées.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 font-bold">Voir tout</Button>
            </div>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Élève</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPayments.map((p) => (
                <TableRow key={p.id} className="group h-14">
                  <TableCell className="font-bold text-slate-900">
                    {(p.invoices?.students as any)?.last_name} {(p.invoices?.students as any)?.first_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] font-bold">
                      PAIEMENT
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-bold text-green-700">{p.amount?.toLocaleString()} F</TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        <Smartphone size={14} className="text-slate-400" />
                        <span className="text-xs font-medium">{p.payment_method}</span>
                     </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Receipt size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {recentPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-400">Aucun paiement récent.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <div className="space-y-6">
          <Card className="border-none bg-orange-600 text-white shadow-lg shadow-orange-600/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Résumé Scolarité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex justify-between items-end">
                  <span className="text-orange-100 text-sm">Collecté</span>
                  <span className="text-2xl font-black">72%</span>
               </div>
               <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[72%]"></div>
               </div>
               <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/10 p-2 rounded-lg">
                     <p className="text-orange-100">Payé</p>
                     <p className="font-bold">8.2M FCFA</p>
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg">
                     <p className="text-orange-100">Restant</p>
                     <p className="font-bold">4.2M FCFA</p>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base font-bold">Liens Rapides</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
               {[
                 { label: 'Journal Caisse', icon: History },
                 { label: 'Impayés', icon: TrendingUp },
                 { label: 'Bourse', icon: DollarSign },
                 { label: 'Configuration', icon: Receipt },
               ].map((item, i) => (
                 <Button key={i} variant="outline" className="h-auto py-4 flex-col gap-2 border-slate-100 hover:border-orange-200 hover:bg-orange-50/50">
                    <item.icon size={20} className="text-slate-400" />
                    <span className="text-[10px] font-bold uppercase">{item.label}</span>
                 </Button>
               ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal Simulation */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="bg-[#003366] p-6 text-white flex justify-between items-center">
                <h3 className="text-xl font-bold">Nouveau Règlement</h3>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setShowPaymentModal(false)}>
                  <History size={20} />
                </Button>
             </div>
             <div className="p-6 space-y-4">
                <div className="space-y-2">
                   <Label>Rechercher Élève</Label>
                   <Input placeholder="Nom ou matricule..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label>Type de Frais</Label>
                     <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm">
                        <option>Scolarité</option>
                        <option>Inscription</option>
                        <option>Cantine</option>
                        <option>Transport</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <Label>Montant (FCFA)</Label>
                     <Input type="number" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                   <Label>Mode de Paiement</Label>
                   <div className="grid grid-cols-2 gap-2">
                      {paymentMethods.map(m => (
                        <button key={m.id} className={cn("p-3 rounded-xl border flex flex-col items-center gap-1 transition-all", m.color)}>
                           <Smartphone size={18} />
                           <span className="text-[10px] font-bold">{m.name}</span>
                        </button>
                      ))}
                   </div>
                </div>
                <div className="pt-4 flex gap-2">
                   <Button variant="outline" className="flex-1" onClick={() => setShowPaymentModal(false)}>Annuler</Button>
                   <Button className="flex-1 bg-orange-600 hover:bg-orange-700" onClick={handlePayment}>Valider le Paiement</Button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
