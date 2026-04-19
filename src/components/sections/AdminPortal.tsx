import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  BarChart3, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X,
  CheckCircle2,
  Loader2,
  Download,
  ShieldAlert,
  Mail,
  Globe,
  Search,
  Zap,
  Shield,
  GraduationCap,
  Image as ImageIcon,
  FileText,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  MapPin,
  Activity,
  Terminal,
  ShieldCheck,
  RefreshCcw,
  Clock,
  LayoutTemplate,
  History,
  AlertCircle,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { db, handleFirestoreError, OperationType, auth } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';

export default function AdminPortal() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState<any>({
    name: 'Yatendra Jha',
    title: 'Product Leader',
    bio: '',
    email: 'hi@yatendrajha.in',
    linkedin: 'https://www.linkedin.com/in/yatendra1990/',
    instagram: 'https://www.instagram.com/yatendra_jha/',
    address: 'Worli, Mumbai',
    profileImage: '',
    maintenanceGroups: []
  });
  
  const [experiences, setExperiences] = React.useState<any[]>([]);
  const [education, setEducation] = React.useState<any[]>([]);
  const [products, setProducts] = React.useState<any[]>([]);
  const [downloads, setDownloads] = React.useState<any[]>([]);
  const [logs, setLogs] = React.useState<any[]>([]);
  const [visitors, setVisitors] = React.useState<any[]>([]);
  const [visitorDetails, setVisitorDetails] = React.useState<any[]>([]);
  const [resumeUrl, setResumeUrl] = React.useState('');
  const [productEdits, setProductEdits] = React.useState<Record<string, any>>({});
  
  // Health States
  const [healthStatus, setHealthStatus] = React.useState({
    sso: { status: 'Healthy', lastCheck: '2 mins ago', icon: ShieldCheck },
    geo: { status: 'Optimized', lastCheck: '1 hour ago', icon: Globe },
    seo: { status: 'Active', lastCheck: '5 mins ago', icon: Search },
    llm: { status: 'Indexed', lastCheck: 'Today', icon: Activity }
  });

  const runHealthCheck = async (key: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setHealthStatus(prev => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], status: 'Perfect', lastCheck: 'Just now' }
    }));
    setLoading(false);
  };

  const optimizeAll = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setHealthStatus({
      sso: { status: 'Perfect', lastCheck: 'Just now', icon: ShieldCheck },
      geo: { status: 'Maximized', lastCheck: 'Just now', icon: Globe },
      seo: { status: 'Optimized', lastCheck: 'Just now', icon: Search },
      llm: { status: 'Fully Indexed', lastCheck: 'Just now', icon: Activity }
    });
    setLoading(false);
  };

  React.useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch Profile
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'profile', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile((prev: any) => ({ ...prev, ...docSnap.data() }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    // Listen to Experiences
    const qExp = query(collection(db, 'experience'), orderBy('order', 'asc'));
    const unsubExp = onSnapshot(qExp, (snap) => {
      setExperiences(snap.docs.map(d => ({ 
        id: d.id, 
        role: '', 
        company: '', 
        period: '', 
        description: '', 
        ...d.data() 
      })));
    });

    // Listen to Education
    const qEdu = query(collection(db, 'education'), orderBy('order', 'asc'));
    const unsubEdu = onSnapshot(qEdu, (snap) => {
      setEducation(snap.docs.map(d => ({ 
        id: d.id, 
        degree: '', 
        school: '', 
        period: '', 
        ...d.data() 
      })));
    });

    // Listen to Products
    const qProd = query(collection(db, 'products'), orderBy('order', 'asc'));
    const unsubProd = onSnapshot(qProd, (snap) => {
      setProducts(snap.docs.map(d => ({ 
        id: d.id, 
        title: '', 
        description: '', 
        problem: '', 
        bet: '', 
        decisions: '', 
        impact: [], 
        image: '', 
        color: '', 
        ...d.data() 
      })));
    });

    // Listen to Downloads
    const qDown = query(collection(db, 'analytics/downloads/logs'), orderBy('timestamp', 'desc'));
    const unsubDown = onSnapshot(qDown, (snap) => {
      setDownloads(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Listen to Visitor Details
    const qVisDet = query(collection(db, 'analytics/visitors/details'), orderBy('timestamp', 'desc'));
    const unsubVisDet = onSnapshot(qVisDet, (snap) => {
      setVisitorDetails(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Listen to Logs
    const qLogs = query(collection(db, 'analytics/system/logs'), orderBy('timestamp', 'desc'));
    const unsubLogs = onSnapshot(qLogs, (snap) => {
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Listen to Visitors
    const qVis = query(collection(db, 'analytics/visitors/daily'), orderBy('date', 'desc'));
    const unsubVis = onSnapshot(qVis, (snap) => {
      setVisitors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Fetch Resume Config
    const fetchResume = async () => {
      try {
        const docRef = doc(db, 'config', 'resume');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setResumeUrl(docSnap.data().url || '');
        }
      } catch (err) {
        console.error("Error fetching resume config:", err);
      }
    };

    fetchProfile();
    fetchResume();
    return () => {
      unsubExp();
      unsubEdu();
      unsubProd();
      unsubDown();
      unsubVis();
      unsubVisDet();
      unsubLogs();
    };
  }, [auth.currentUser]);

  const handleUpdateProductLocal = (id: string, data: any) => {
    setProductEdits(prev => ({
      ...prev,
      [id]: { ...(prev[id] || products.find(p => p.id === id)), ...data }
    }));
  };

  const handleSaveProduct = async (id: string) => {
    const data = productEdits[id];
    if (!data) return;
    try {
      await updateDoc(doc(db, 'products', id), data);
      setProductEdits(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      alert("Case study saved!");
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
  };

  const handleDiscardProduct = (id: string) => {
    setProductEdits(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleAddMaintenanceGroup = () => {
    const newGroup = {
      id: crypto.randomUUID(),
      name: 'New Skill/Group',
      content: 'Details go here...',
      order: (profile.maintenanceGroups || []).length
    };
    setProfile({
      ...profile,
      maintenanceGroups: [...(profile.maintenanceGroups || []), newGroup]
    });
  };

  const handleUpdateMaintenanceGroup = (id: string, data: any) => {
    setProfile({
      ...profile,
      maintenanceGroups: profile.maintenanceGroups.map((g: any) => g.id === id ? { ...g, ...data } : g)
    });
  };

  const handleDeleteMaintenanceGroup = (id: string) => {
    setProfile({
      ...profile,
      maintenanceGroups: profile.maintenanceGroups.filter((g: any) => g.id !== id)
    });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'profile', 'main'), profile, { merge: true });
      await setDoc(doc(db, 'config', 'resume'), { url: resumeUrl }, { merge: true });
      alert("Profile data updated!");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'profile/main');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExperience = async () => {
    try {
      await addDoc(collection(db, 'experience'), {
        role: 'New Role',
        company: 'New Company',
        period: '2024 - Present',
        description: '',
        impact: [],
        order: experiences.length
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'experience');
    }
  };

  const handleUpdateExperience = async (id: string, data: any) => {
    try {
      await updateDoc(doc(db, 'experience', id), data);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `experience/${id}`);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'experience', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `experience/${id}`);
    }
  };

  const handleAddEducation = async () => {
    try {
      await addDoc(collection(db, 'education'), {
        degree: 'New Degree',
        school: 'New School',
        period: '2020 - 2024',
        order: education.length
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'education');
    }
  };

  const handleUpdateEducation = async (id: string, data: any) => {
    try {
      await updateDoc(doc(db, 'education', id), data);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `education/${id}`);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'education', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `education/${id}`);
    }
  };

  const handleAddProduct = async () => {
    try {
      await addDoc(collection(db, 'products'), {
        title: 'New Product',
        description: '',
        problem: '',
        bet: '',
        decisions: '',
        impact: [],
        image: 'https://picsum.photos/seed/new/800/600',
        color: 'from-blue-500/20 to-blue-600/10',
        order: products.length
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'products');
    }
  };

  const handleUpdateProduct = async (id: string, data: any) => {
    try {
      await updateDoc(doc(db, 'products', id), data);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  const exportDownloads = () => {
    const csv = [
      ['Email', 'Timestamp', 'User Agent'],
      ...downloads.map(d => [d.email, d.timestamp?.toDate().toISOString(), d.userAgent])
    ].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'resume_downloads.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-[#000c19] text-white p-4 md:p-12 rounded-[3.5rem] overflow-hidden relative selection:bg-primary/30 antialiased font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-indigo-900/40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -ml-48 -mb-48" />
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-8 h-full">
        {/* Sidebar Panel - Refined Apple/iCloud aesthetic */}
        <div className="lg:w-80 shrink-0 space-y-8">
          <div className="flex flex-col items-center text-center space-y-6 bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
            <div className="relative">
              <div className="w-28 h-28 rounded-[2.5rem] p-1.5 bg-gradient-to-br from-primary to-indigo-400 rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-[0_0_50px_rgba(14,165,233,0.3)]">
                <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-slate-900 border border-white/20">
                  <img 
                    src={profile.profileImage || "https://picsum.photos/seed/yatendra/400/400"} 
                    alt="Avatar" 
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-primary border-4 border-[#000c19] flex items-center justify-center shadow-xl">
                <ShieldCheck size={18} className="text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-white uppercase">{profile.name}</h2>
              <p className="text-primary/70 text-xs font-bold tracking-widest uppercase">{profile.email}</p>
            </div>
            <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">System Cloud Online</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/5 p-3 space-y-2 shadow-xl">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'profile', label: 'Control Center', icon: Settings },
              { id: 'products', label: 'Project Vault', icon: Briefcase },
              { id: 'logs', label: 'Security Logs', icon: Terminal },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-[2rem] transition-all duration-300 font-bold text-sm group",
                  activeTab === item.id 
                    ? "bg-primary text-white shadow-[0_10px_30px_rgba(14,165,233,0.4)] translate-x-1" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon size={20} className={cn(activeTab === item.id ? "text-white" : "text-primary/50 group-hover:text-primary")} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area - Mail/Widget Style */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-8"
              >
                {/* Health Monitoring Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Object.entries(healthStatus).map(([key, info]: [string, any]) => (
                    <div key={key} className="rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 p-6 group hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all duration-500 shadow-inner">
                          <info.icon size={22} />
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); runHealthCheck(key); }}
                          className="text-white/20 hover:text-primary transition-colors"
                        >
                          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                        </button>
                      </div>
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">{key} CORE</p>
                      <h3 className="text-xl font-black text-white mt-1 uppercase tracking-tight">{info.status}</h3>
                      <div className="flex items-center gap-1.5 mt-2 opacity-40">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold uppercase">{info.lastCheck}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Visitor Widget - Mail Style Header */}
                  <div className="lg:col-span-2 rounded-[3.5rem] bg-white/5 backdrop-blur-3xl border border-white/5 overflow-hidden shadow-2xl">
                    <div className="bg-primary/10 px-10 py-8 border-b border-white/5 flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                          <Globe size={24} className="text-primary" />
                          Traffic Analytics
                        </h3>
                        <p className="text-white/40 text-sm font-semibold mt-1 uppercase tracking-widest">Real-time Global Identity Capture</p>
                      </div>
                      <Button onClick={optimizeAll} disabled={loading} className="bg-white text-[#000c19] hover:bg-white/90 rounded-2xl px-8 font-black uppercase tracking-widest text-xs h-12">
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Zap className="mr-2" size={16} />}
                        Optimize
                      </Button>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      {visitorDetails.slice(0, 6).map((visit, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-6 p-5 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-primary/10 hover:border-primary/20 transition-all duration-300 group"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <div className="text-xs font-black uppercase">{visit.location?.substring(0, 2) || '??'}</div>
                          </div>
                          <div className="flex-1">
                            <p className="font-black text-white text-lg tracking-tight">{visit.ip}</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-0.5">{visit.location || 'Locating target...'}</p>
                          </div>
                          <div className="text-right">
                             <div className="text-xs font-black text-primary uppercase">{new Date(visit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                             <div className="text-[10px] text-white/20 font-bold uppercase mt-1">Authorized Node</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="rounded-[3.5rem] bg-gradient-to-br from-primary to-indigo-600 p-10 text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                      <h4 className="text-white/60 uppercase tracking-[0.3em] font-black text-[10px] mb-4">Total Engagement</h4>
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black tracking-tighter italic">{visitors.reduce((acc, curr) => acc + (curr.count || 0), 0)}</span>
                        <TrendingUp size={24} className="text-emerald-400" />
                      </div>
                      <p className="text-white/80 font-bold mt-4 uppercase text-[10px] tracking-widest">Active nodes synchronized</p>
                    </div>

                    <div className="rounded-[3.5rem] bg-white/5 backdrop-blur-3xl border border-white/5 p-8 shadow-2xl">
                      <h4 className="text-white/30 font-black uppercase tracking-widest text-[10px] mb-6">System Terminal</h4>
                      <div className="space-y-3">
                        <button onClick={exportDownloads} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-primary/20 border border-white/5 transition-all text-sm font-bold text-white group">
                          <span className="flex items-center gap-3"><Download size={18} className="text-primary" /> Reports</span>
                          <ChevronRight size={16} className="text-white/20 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-indigo-500/20 border border-white/5 transition-all text-sm font-bold text-white group">
                          <span className="flex items-center gap-3"><History size={18} className="text-indigo-400" /> Snapshot</span>
                          <ChevronRight size={16} className="text-white/20 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tight italic textShadow-sm">Control Center</h2>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-1">Identity & Domain Configuration</p>
                  </div>
                  <Button onClick={handleSaveProfile} disabled={loading} className="rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white h-12 px-8 font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-500/20">
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={16} />}
                    Sync Profile
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 p-10 space-y-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -ml-12 -mt-12" />
                    <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em]">Identity Core</h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Canonical Name</Label>
                        <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="h-14 rounded-2xl border-white/5 bg-white/5 focus:bg-white/10 text-white font-bold px-6" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Domain Title</Label>
                        <Input value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} className="h-14 rounded-2xl border-white/5 bg-white/5 focus:bg-white/10 text-white font-bold px-6" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Encrypted Bio</Label>
                        <Textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="min-h-[140px] rounded-[2rem] border-white/5 bg-white/5 focus:bg-white/10 text-white font-medium p-6 resize-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 p-10 space-y-8 shadow-2xl relative overflow-hidden">
                       <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em]">Communication Nodes</h3>
                       <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Email Node</Label>
                            <Input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="h-14 rounded-2xl border-white/5 bg-white/5 text-white font-bold px-6" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">LinkedIn Auth</Label>
                            <Input value={profile.linkedin} onChange={e => setProfile({...profile, linkedin: e.target.value})} className="h-14 rounded-2xl border-white/5 bg-white/5 text-white font-bold px-6" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Geographic Origin</Label>
                            <Input value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} className="h-14 rounded-2xl border-white/5 bg-white/5 text-white font-bold px-6" />
                          </div>
                       </div>
                    </div>

                    <div className="rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 p-10 shadow-2xl">
                       <div className="flex items-center justify-between mb-8">
                         <h3 className="text-sm font-black text-emerald-400 uppercase tracking-[0.3em]">Maintenance Grids</h3>
                         <Button variant="ghost" size="sm" onClick={handleAddMaintenanceGroup} className="text-primary hover:bg-primary/10 rounded-xl font-black uppercase text-[10px] tracking-widest px-4">
                           <Plus size={14} className="mr-2" /> New Group
                         </Button>
                       </div>
                       
                       <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                         {(profile.maintenanceGroups || []).map((group: any) => (
                           <div key={group.id} className="p-6 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-4 group relative hover:border-primary/20 transition-all">
                             <button onClick={() => handleDeleteMaintenanceGroup(group.id)} className="absolute top-6 right-6 text-red-500/0 group-hover:text-red-500 transition-all">
                               <Trash2 size={16} />
                             </button>
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black italic">{group.name?.[0] || 'G'}</div>
                                <Input value={group.name} onChange={e => handleUpdateMaintenanceGroup(group.id, { name: e.target.value })} className="bg-transparent border-none p-0 focus-visible:ring-0 text-lg font-black uppercase tracking-tight h-10 text-white" />
                             </div>
                             <Textarea value={group.content} onChange={e => handleUpdateMaintenanceGroup(group.id, { content: e.target.value })} className="bg-white/5 border border-white/5 rounded-2xl p-4 text-sm text-white/60 min-h-[80px] font-medium resize-none focus:bg-white/10 transition-all" />
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div 
                key="products"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-4">
                   <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tight italic">Resource Vault</h2>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-1">Product Methodology & Impact Assets</p>
                  </div>
                  <Button onClick={handleAddProduct} className="rounded-2xl bg-primary hover:bg-primary/90 text-white h-12 px-8 font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20">
                    <Plus size={16} className="mr-2" /> Deploy New Asset
                  </Button>
                </div>

                <div className="space-y-8">
                  {products.map((p) => {
                    const isEditing = !!productEdits[p.id];
                    const data = productEdits[p.id] || p;
                    return (
                      <div key={p.id} className="rounded-[3.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 overflow-hidden shadow-2xl relative group hover:border-primary/20 transition-all">
                        <div className="p-10 space-y-10">
                          <div className="flex flex-col xl:flex-row gap-12">
                            <div className="xl:w-80 space-y-6">
                              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/10 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                                <img src={data.image} alt="" className="w-full h-full object-cover opacity-80" />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Identity URL</Label>
                                <Input value={data.image} onChange={e => handleUpdateProductLocal(p.id, { image: e.target.value })} className="h-12 rounded-2xl border-white/5 bg-white/5 text-xs font-mono text-primary/80" />
                              </div>
                            </div>

                            <div className="flex-1 space-y-8">
                              <div className="flex justify-between items-start gap-6 border-b border-white/10 pb-6">
                                <div className="flex-1">
                                  <Label className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] ml-1 mb-2 block">Project Identification</Label>
                                  <Input value={data.title} onChange={e => handleUpdateProductLocal(p.id, { title: e.target.value })} className="bg-transparent border-none p-0 text-3xl font-black uppercase tracking-tight h-auto focus-visible:ring-0 text-white italic" />
                                </div>
                                <div className="flex items-center gap-3">
                                  {isEditing ? (
                                    <>
                                      <Button onClick={() => handleSaveProduct(p.id)} size="sm" className="bg-emerald-500 hover:bg-emerald-400 rounded-2xl px-6 h-10 font-black uppercase text-[10px] tracking-widest">Sync</Button>
                                      <Button onClick={() => handleDiscardProduct(p.id)} size="sm" variant="ghost" className="text-white/40 hover:text-white rounded-2xl h-10 px-4 uppercase font-black text-[10px]">Abandon</Button>
                                    </>
                                  ) : (
                                    <Button onClick={() => handleDeleteProduct(p.id)} variant="ghost" size="icon" className="text-red-500/20 hover:text-red-500 rounded-2xl h-12 w-12 hover:bg-red-500/10 transition-all">
                                      <Trash2 size={20} />
                                    </Button>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Executive Summary</Label>
                                <Textarea value={data.description} onChange={e => handleUpdateProductLocal(p.id, { description: e.target.value })} className="bg-white/5 border-white/5 rounded-[2rem] min-h-[100px] p-6 text-sm font-medium leading-relaxed resize-none focus:bg-white/10 transition-all" />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                  <Label className="text-[10px] font-black text-red-400 uppercase tracking-widest ml-1 italic flex items-center gap-2">
                                     <div className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]" /> 
                                     The Core Tension
                                  </Label>
                                  <Textarea value={data.problem} onChange={e => handleUpdateProductLocal(p.id, { problem: e.target.value })} className="bg-white/5 border-white/5 rounded-[2rem] p-6 min-h-[140px] text-sm font-medium leading-relaxed resize-none focus:bg-white/10 transition-all border-l-4 border-l-red-400/20" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1 italic flex items-center gap-2">
                                     <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(14,165,233,0.5)]" /> 
                                     The Strategic Bet
                                  </Label>
                                  <Textarea value={data.bet} onChange={e => handleUpdateProductLocal(p.id, { bet: e.target.value })} className="bg-white/5 border-white/5 rounded-[2rem] p-6 min-h-[140px] text-sm font-medium leading-relaxed resize-none focus:bg-white/10 transition-all border-l-4 border-l-primary/20" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'logs' && (
              <motion.div 
                key="logs"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-8"
              >
                <div className="rounded-[3.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 p-10 overflow-hidden shadow-2xl relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                  <div className="flex items-center justify-between mb-10 relative">
                    <div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tight italic flex items-center gap-3">
                        <AlertCircle size={24} className="text-red-500" />
                        Infrastructure Incidents
                      </h3>
                      <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-1">Real-time system diagnostics & error capture</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {logs.map((log, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 flex gap-8 group hover:bg-white/10 hover:border-red-500/20 transition-all relative overflow-hidden"
                      >
                        <div className="shrink-0 relative">
                          <div className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner",
                            log.type === 'error' ? "bg-red-500/10 text-red-400 group-hover:bg-red-500 group-hover:text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                          )}>
                            <AlertCircle size={28} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between gap-4">
                            <h4 className="font-black text-white text-lg tracking-tight truncate uppercase italic">{log.message || "System Diagnostic Pulse"}</h4>
                            <span className="text-[10px] text-white/20 font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full whitespace-nowrap">
                               {log.timestamp ? new Date(log.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] text-white/40 uppercase tracking-widest font-black mb-2">
                             <div className="flex items-center gap-1.5"><Terminal size={12} className="text-red-400" /> Trace Node: {i + 1}</div>
                             <div className="flex items-center gap-1.5"><Shield size={12} className="text-primary" /> Severity: {log.type === 'error' ? 'Critical' : 'Nominal'}</div>
                          </div>
                          <p className="text-sm text-white/60 font-medium leading-relaxed bg-black/20 p-4 rounded-xl font-mono border border-white/5 overflow-x-auto whitespace-pre-wrap">
                            {log.stack || "Optimization completed successfully. Peripheral sensors reporting clear signals."}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    {logs.length === 0 && (
                      <div className="text-center py-24 text-white/10">
                        <ShieldCheck size={80} className="mx-auto mb-6 opacity-20" />
                        <p className="text-sm font-black uppercase tracking-[0.4em]">Zero Faults Detected</p>
                        <p className="text-xs font-bold text-white/5 mt-2">Perimeter integrity maintained</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

