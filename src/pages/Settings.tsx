import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Settings as SettingsIcon, 
  Save, 
  CheckCircle2, 
  History,
  ShieldCheck,
  LayoutTemplate,
  Loader2
} from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import * as Sonner from 'sonner';

export function SettingsPage() {
  const { activeSchool, refreshData } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: activeSchool?.name || '',
    sigle: activeSchool?.sigle || '',
    slogan: activeSchool?.slogan || '',
    email: activeSchool?.address.email || '',
    phone: activeSchool?.address.phone || '',
    address: activeSchool?.address.street || '',
    city: activeSchool?.address.city || '',
    commune: activeSchool?.address.commune || '',
    country: activeSchool?.address.country || "Côte d'Ivoire",
    activeYear: activeSchool?.activeYear || '2023-2024',
    gradingSystem: activeSchool?.gradingSystem || 'trimestriel',
  });

  const handleSaveIdentity = async () => {
    if (!activeSchool?.id) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('establishments')
        .update({
          name: formData.name,
          sigle: formData.sigle,
          slogan: formData.slogan,
          email: formData.email,
          phone_primary: formData.phone,
          address: formData.address,
          city: formData.city,
          commune: formData.commune,
          country: formData.country,
          settings: { ...((activeSchool as any).settings || {}), activeYear: formData.activeYear },
          pedagogy_system: formData.gradingSystem,
        })
        .eq('id', activeSchool.id);

      if (error) throw error;
      await refreshData();
      Sonner.toast.success('Paramètres enregistrés avec succès');
    } catch (error: any) {
      Sonner.toast.error("Erreur lors de l'enregistrement : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#003366] tracking-tight flex items-center gap-3">
            <SettingsIcon className="text-orange-600" size={32} />
            Paramètres de l'Établissement
          </h1>
          <p className="text-slate-500 font-medium mt-1">Gérez l'identité et les configurations académiques de votre école</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="h-8 px-4 text-xs font-bold border-orange-200 text-orange-700 bg-orange-50">
            Version 2.0.4 Premium
          </Badge>
          <Badge variant="outline" className="h-8 px-4 text-xs font-bold border-blue-200 text-blue-700 bg-blue-50">
            ID: {activeSchool?.code}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-2xl h-14 mb-8">
          <TabsTrigger value="identity" className="rounded-xl px-8 font-bold data-[state=active]:bg-white data-[state=active]:text-[#003366] data-[state=active]:shadow-sm">
            <Building2 className="mr-2 h-4 w-4" />
            Identité
          </TabsTrigger>
          <TabsTrigger value="academic" className="rounded-xl px-8 font-bold data-[state=active]:bg-white data-[state=active]:text-[#003366] data-[state=active]:shadow-sm">
            <History className="mr-2 h-4 w-4" />
            Académique
          </TabsTrigger>
          <TabsTrigger value="design" className="rounded-xl px-8 font-bold data-[state=active]:bg-white data-[state=active]:text-[#003366] data-[state=active]:shadow-sm">
            <LayoutTemplate className="mr-2 h-4 w-4" />
            Bulletins
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-8 font-bold data-[state=active]:bg-white data-[state=active]:text-[#003366] data-[state=active]:shadow-sm">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="space-y-6 mt-0">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-xl font-black text-[#003366]">Informations Générales</CardTitle>
                <CardDescription>Configurez les détails officiels de votre établissement</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-bold">Nom de l'Établissement</Label>
                    <Input 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="h-12 rounded-xl bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-bold">Sigle (Abréviation)</Label>
                    <Input 
                      value={formData.sigle} 
                      onChange={e => setFormData({...formData, sigle: e.target.value})}
                      placeholder="ex: GS-LMC"
                      className="h-12 rounded-xl bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-600 font-bold">Slogan de l'École</Label>
                  <Input 
                    value={formData.slogan} 
                    onChange={e => setFormData({...formData, slogan: e.target.value})}
                    placeholder="Vers l'Excellence et au-delà"
                    className="h-12 rounded-xl bg-slate-50/50"
                  />
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-bold">Email de Contact</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <Input 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="h-12 pl-10 rounded-xl bg-slate-50/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-bold">Téléphone Principal</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <Input 
                        value={formData.phone} 
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="h-12 pl-10 rounded-xl bg-slate-50/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-600 font-bold">Adresse Géographique</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <Input 
                        value={formData.address} 
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="h-12 pl-10 rounded-xl bg-slate-50/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-bold">Ville / Commune</Label>
                    <Input 
                      value={formData.city} 
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className="h-12 rounded-xl bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleSaveIdentity} 
                    disabled={loading}
                    className="h-14 px-8 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl shadow-lg shadow-orange-600/20"
                  >
                    {loading ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" size={20} />}
                    Enregistrer les Modifications
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-[#003366] text-white">
                  <CardTitle className="text-lg font-bold">Logo de l'Établissement</CardTitle>
                </CardHeader>
                <CardContent className="p-8 text-center">
                  <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl mx-auto flex items-center justify-center mb-4 overflow-hidden">
                    {activeSchool?.logos.primary ? (
                      <img src={activeSchool.logos.primary} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <Building2 size={48} className="text-slate-300" />
                    )}
                  </div>
                  <Button variant="outline" className="w-full border-slate-200 text-slate-600 font-bold rounded-xl h-12">
                    Changer le Logo
                  </Button>
                  <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
                    PNG ou JPG (max 2MB)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-orange-50 border-b border-orange-100">
                  <CardTitle className="text-lg font-bold text-orange-900 flex items-center gap-2">
                    <CheckCircle2 className="text-orange-600" size={20} />
                    Status Officiel
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">Agrément National</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Validé</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">Abonnement</span>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none font-black italic">PRO ELITE</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100">
                    <span className="text-slate-500 font-medium text-xs">Dernière Mise à Jour</span>
                    <span className="text-slate-700 font-bold text-xs">{new Date().toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6 mt-0">
          <Card className="border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-xl font-black text-[#003366]">Configuration Académique</CardTitle>
              <CardDescription>Définissez l'année scolaire et le système de notation</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[#003366] text-lg font-black tracking-tight">Année Scolaire Active</Label>
                    <p className="text-sm text-slate-500 font-medium mb-4">Toutes les données (notes, absences) seront liées à cette période</p>
                    <div className="grid grid-cols-2 gap-3">
                      {['2022-2023', '2023-2024', '2024-2025'].map(year => (
                        <Button 
                          key={year}
                          variant={formData.activeYear === year ? 'default' : 'outline'}
                          onClick={() => setFormData({...formData, activeYear: year})}
                          className={`h-14 rounded-2xl font-black transition-all ${
                            formData.activeYear === year 
                              ? 'bg-[#003366] text-white shadow-lg shadow-blue-900/20' 
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {year}
                        </Button>
                      ))}
                      <Button variant="outline" className="h-14 rounded-2xl border-dashed border-slate-300 text-slate-400 font-bold hover:bg-slate-50">
                        + Nouvelle Année
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[#003366] text-lg font-black tracking-tight">Système de Périodicité</Label>
                    <p className="text-sm text-slate-500 font-medium mb-4">Déterminez comment l'année est divisée pour les rapports</p>
                    <div className="space-y-3">
                      <div 
                        onClick={() => setFormData({...formData, gradingSystem: 'trimestriel'})}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                          formData.gradingSystem === 'trimestriel'
                            ? 'border-orange-600 bg-orange-50/50 ring-4 ring-orange-600/5'
                            : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-black ${formData.gradingSystem === 'trimestriel' ? 'text-orange-900' : 'text-slate-700'}`}>Trimestriel (Classique)</h4>
                          {formData.gradingSystem === 'trimestriel' && <CheckCircle2 className="text-orange-600" size={20} />}
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Divisé en 3 périodes (Trimestre 1, 2, 3). Recommandé pour l'enseignement primaire et secondaire en Côte d'Ivoire.</p>
                      </div>

                      <div 
                        onClick={() => setFormData({...formData, gradingSystem: 'semestriel'})}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                          formData.gradingSystem === 'semestriel'
                            ? 'border-orange-600 bg-orange-50/50 ring-4 ring-orange-600/5'
                            : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-black ${formData.gradingSystem === 'semestriel' ? 'text-orange-900' : 'text-slate-700'}`}>Semestriel (LMD)</h4>
                          {formData.gradingSystem === 'semestriel' && <CheckCircle2 className="text-orange-600" size={20} />}
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Divisé en 2 périodes (Semestre 1, 2). Idéal pour l'enseignement supérieur ou technique.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveIdentity}
                  disabled={loading}
                  className="h-14 px-8 bg-[#003366] hover:bg-[#002244] text-white font-black rounded-2xl shadow-lg shadow-blue-900/20"
                >
                  {loading ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" size={20} />}
                  Enregistrer la Configuration Académique
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
