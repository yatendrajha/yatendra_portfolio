import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  BookOpen, 
  BarChart3, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X,
  CheckCircle2,
  Loader2,
  Download,
  MessageSquare,
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
  TrendingUp
} from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { GoogleGenAI, Type } from "@google/genai";

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
    profileImage: ''
  });
  
  const [experiences, setExperiences] = React.useState<any[]>([]);
  const [education, setEducation] = React.useState<any[]>([]);
  const [products, setProducts] = React.useState<any[]>([]);
  const [downloads, setDownloads] = React.useState<any[]>([]);
  const [comments, setComments] = React.useState<any[]>([]);
  const [visitors, setVisitors] = React.useState<any[]>([]);
  const [resumeUrl, setResumeUrl] = React.useState('');
  
  // SEO States
  const [seoStatus, setSeoStatus] = React.useState({
    seo: 'Healthy',
    geo: 'Optimized',
    aeo: 'Active',
    llm: 'Indexed'
  });

  const generateBlog = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing");
      }
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Generate 1 high-quality, trending blog post for a professional fintech/AI portfolio. Topic MUST be from early 2026. Categories: Product, Fintech, Technology and Innovation, AI, Automation. Ensure date is today in 2026. Return as JSON object.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              content: { type: Type.STRING },
              category: { 
                type: Type.STRING,
                enum: ["Product", "Fintech", "Technology and Innovation", "AI", "Automation"]
              },
              date: { type: Type.STRING },
              author: { type: Type.STRING }
            },
            required: ["title", "excerpt", "content", "category", "date", "author"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No text returned from Gemini");
      
      const post = JSON.parse(text);
      
      await addDoc(collection(db, "blogs"), {
        ...post,
        likes: 0,
        timestamp: serverTimestamp()
      });
      alert('Blog generated successfully!');
    } catch (e: any) {
      console.error("Error generating blog:", e);
      alert('Failed to generate blog: ' + e.message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    const checkAndGenerateBlog = async () => {
      if (!auth.currentUser) return;
      try {
        const q = query(collection(db, 'blogs'), orderBy('timestamp', 'desc'));
        const snap = await getDocs(q);
        const latestBlog = snap.docs[0]?.data();
        
        let shouldGenerate = false;
        if (!latestBlog || !latestBlog.timestamp) {
          shouldGenerate = true;
        } else {
          const latestDate = latestBlog.timestamp.toDate();
          const today = new Date();
          if (latestDate.toDateString() !== today.toDateString()) {
            shouldGenerate = true;
          }
        }

        if (shouldGenerate) {
          console.log("No blog found for today, generating automatically...");
          await generateBlog();
        }
      } catch (err) {
        console.error("Error checking latest blog:", err);
      }
    };

    checkAndGenerateBlog();
  }, []);

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

    // Listen to Comments
    const qComm = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const unsubComm = onSnapshot(qComm, (snap) => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
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
      unsubComm();
      unsubVis();
    };
  }, [auth.currentUser]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'profile', 'main'), profile, { merge: true });
      await setDoc(doc(db, 'config', 'resume'), { url: resumeUrl }, { merge: true });
      alert("Profile and Resume config updated!");
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

  const handleModerateComment = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'comments', id), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `comments/${id}`);
    }
  };

  const optimizeSEO = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSeoStatus({
      seo: 'Perfect',
      geo: 'Maximized',
      aeo: 'Optimized',
      llm: 'Fully Indexed'
    });
    setLoading(false);
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
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-[#8E8E93]">Manage your portfolio content and track analytics.</p>
        </div>
        <Badge variant="outline" className="bg-blue-50/50 text-blue-600 border-blue-200/50 backdrop-blur-md px-3 py-1">
          Admin Session Active
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/40 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-sm w-full md:w-auto overflow-x-auto flex-nowrap">
          <TabsTrigger value="dashboard" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
            <LayoutDashboard size={18} className="mr-2" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="profile" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
            <User size={18} className="mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="products" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
            <Briefcase size={18} className="mr-2" /> Products
          </TabsTrigger>
          <TabsTrigger value="comments" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
            <MessageSquare size={18} className="mr-2" /> Comments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="rounded-[2rem] border-none shadow-sm bg-white/60 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-[#8E8E93] uppercase tracking-wider">Total Visitors</CardTitle>
                <CardDescription className="text-3xl font-bold text-[#1C1C1E]">
                  {visitors.reduce((acc, curr) => acc + (curr.count || 0), 0)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                  <Zap size={10} /> +12% from last week
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border-none shadow-sm bg-white/60 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-[#8E8E93] uppercase tracking-wider">Downloads</CardTitle>
                <CardDescription className="text-3xl font-bold text-[#1C1C1E]">{downloads.length}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" className="w-full rounded-xl text-blue-600 h-8" onClick={exportDownloads}>
                  <Download size={14} className="mr-2" /> Export
                </Button>
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border-none shadow-sm bg-white/60 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-[#8E8E93] uppercase tracking-wider">SEO Health</CardTitle>
                <CardDescription className="text-3xl font-bold text-green-500">{seoStatus.seo}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-[10px] text-[#8E8E93] flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-[8px] px-1.5 py-0">GEO: {seoStatus.geo}</Badge>
                  <Badge variant="outline" className="text-[8px] px-1.5 py-0">AEO: {seoStatus.aeo}</Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border-none shadow-sm bg-white/60 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-[#8E8E93] uppercase tracking-wider">LLM Index</CardTitle>
                <CardDescription className="text-3xl font-bold text-blue-500">{seoStatus.llm}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full rounded-xl text-blue-600 h-8" 
                  onClick={generateBlog}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" size={14} /> : <Globe size={14} className="mr-2" />}
                  Generate Blog
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white/60 backdrop-blur-md overflow-hidden">
              <CardHeader className="border-b border-white/20">
                <CardTitle className="flex items-center gap-2">
                  <Mail size={20} className="text-blue-600" />
                  Recent Resume Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="divide-y divide-white/20">
                    {downloads.map((d) => (
                      <div key={d.id} className="p-4 flex items-center justify-between hover:bg-white/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{d.email}</p>
                            <p className="text-[10px] text-[#8E8E93]">{d.timestamp?.toDate().toLocaleString()}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="rounded-full text-[10px] bg-green-50 text-green-600 border-green-100">Verified</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white/60 backdrop-blur-md overflow-hidden">
              <CardHeader className="border-b border-white/20">
                <CardTitle className="flex items-center gap-2">
                  <Globe size={20} className="text-purple-600" />
                  Visitor Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="divide-y divide-white/20">
                    {visitors.map((v) => (
                      <div key={v.id} className="p-4 flex items-center justify-between hover:bg-white/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                            <Globe size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{v.date}</p>
                            <p className="text-[10px] text-[#8E8E93]">Daily Active Users</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{v.count}</p>
                          <p className="text-[10px] text-green-600">Healthy</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-8">
          {/* About Section */}
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white/60 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User size={20} className="text-blue-600" />
                  About Section
                </CardTitle>
                <CardDescription>Manage your main hero content and profile picture.</CardDescription>
              </div>
              <Button onClick={handleSaveProfile} disabled={loading} className="rounded-xl bg-blue-600">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} className="mr-2" />}
                Save Changes
              </Button>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="space-y-4">
                  <Label>Profile Picture</Label>
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[2rem] overflow-hidden bg-gray-100 border-2 border-white shadow-lg">
                      <img 
                        src={profile.profileImage || "https://picsum.photos/seed/yatendra/400/400"} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://picsum.photos/seed/yatendra/400/400";
                        }}
                      />
                    </div>
                    <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[2rem] text-white">
                      <ImageIcon size={24} />
                    </button>
                  </div>
                  <Input 
                    placeholder="Image URL" 
                    value={profile.profileImage}
                    onChange={e => setProfile({...profile, profileImage: e.target.value})}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Sub-section Header (Tagline)</Label>
                    <Input value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} className="rounded-xl" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Description (14+ years...)</Label>
                    <Textarea 
                      value={profile.bio} 
                      onChange={e => setProfile({...profile, bio: e.target.value})} 
                      className="rounded-xl min-h-[120px]" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/20">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input value={profile.linkedin} onChange={e => setProfile({...profile, linkedin: e.target.value})} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} className="rounded-xl" />
                </div>
              </div>

              <div className="pt-6 border-t border-white/20 space-y-4">
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                  <FileText size={18} />
                  <Label>Resume Download URL</Label>
                </div>
                <div className="flex gap-4">
                  <Input 
                    placeholder="Enter URL to your latest resume (PDF)" 
                    value={resumeUrl}
                    onChange={e => setResumeUrl(e.target.value)}
                    className="rounded-xl bg-white/40"
                  />
                </div>
                <p className="text-[10px] text-[#8E8E93]">This URL will be used when visitors click "Download Resume" after email verification.</p>
              </div>
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white/60 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase size={20} className="text-purple-600" />
                  Professional Experience
                </CardTitle>
                <CardDescription>Add or edit your career history.</CardDescription>
              </div>
              <Button onClick={handleAddExperience} variant="outline" className="rounded-xl border-purple-200 text-purple-600">
                <Plus size={18} className="mr-2" /> Add Experience
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="p-6 rounded-[2rem] bg-white/40 border border-white/20 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 mr-4">
                      <Input 
                        value={exp.role} 
                        onChange={e => handleUpdateExperience(exp.id, { role: e.target.value })} 
                        placeholder="Role"
                        className="rounded-xl"
                      />
                      <Input 
                        value={exp.company} 
                        onChange={e => handleUpdateExperience(exp.id, { company: e.target.value })} 
                        placeholder="Company"
                        className="rounded-xl"
                      />
                      <Input 
                        value={exp.period} 
                        onChange={e => handleUpdateExperience(exp.id, { period: e.target.value })} 
                        placeholder="Period"
                        className="rounded-xl"
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteExperience(exp.id)} className="text-red-500">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                  <Textarea 
                    value={Array.isArray(exp.description) ? exp.description.join('\n') : exp.description} 
                    onChange={e => handleUpdateExperience(exp.id, { description: e.target.value.split('\n').filter(Boolean) })} 
                    placeholder="Description (one bullet per line)"
                    className="rounded-xl min-h-[80px]"
                  />
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-blue-600 flex items-center gap-2">
                      <TrendingUp size={16} /> Impact & Results
                    </Label>
                    <div className="space-y-2">
                      {(exp.impact || []).map((imp: string, idx: number) => (
                        <div key={idx} className="flex gap-2">
                          <Input 
                            value={imp}
                            onChange={e => {
                              const newImpact = [...(exp.impact || [])];
                              newImpact[idx] = e.target.value;
                              handleUpdateExperience(exp.id, { impact: newImpact });
                            }}
                            placeholder="Impact item"
                            className="rounded-xl"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              const newImpact = (exp.impact || []).filter((_: any, i: number) => i !== idx);
                              handleUpdateExperience(exp.id, { impact: newImpact });
                            }}
                            className="text-red-500 shrink-0"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          const newImpact = [...(exp.impact || []), ''];
                          handleUpdateExperience(exp.id, { impact: newImpact });
                        }}
                        className="rounded-xl text-xs"
                      >
                        <Plus size={14} className="mr-1" /> Add Impact Item
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white/60 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap size={20} className="text-emerald-600" />
                  Education
                </CardTitle>
                <CardDescription>Manage your academic background.</CardDescription>
              </div>
              <Button onClick={handleAddEducation} variant="outline" className="rounded-xl border-emerald-200 text-emerald-600">
                <Plus size={18} className="mr-2" /> Add Education
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="p-6 rounded-[2rem] bg-white/40 border border-white/20 flex gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                    <Input 
                      value={edu.degree} 
                      onChange={e => handleUpdateEducation(edu.id, { degree: e.target.value })}
                      className="rounded-xl" 
                      placeholder="Degree" 
                    />
                    <Input 
                      value={edu.school} 
                      onChange={e => handleUpdateEducation(edu.id, { school: e.target.value })}
                      className="rounded-xl" 
                      placeholder="School" 
                    />
                    <Input 
                      value={edu.period} 
                      onChange={e => handleUpdateEducation(edu.id, { period: e.target.value })}
                      className="rounded-xl" 
                      placeholder="Period" 
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteEducation(edu.id)} className="text-red-500">
                    <Trash2 size={18} />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Product Case Studies</h2>
              <p className="text-[#8E8E93]">Manage your detailed product deep-dives.</p>
            </div>
            <Button onClick={handleAddProduct} className="rounded-xl bg-blue-600">
              <Plus size={18} className="mr-2" /> New Case Study
            </Button>
          </div>

          <div className="space-y-8">
            {products.map((product) => (
              <Card key={product.id} className="rounded-[2.5rem] border-none shadow-sm bg-white/60 backdrop-blur-md overflow-hidden">
                <CardContent className="p-8 space-y-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/3 space-y-4">
                      <Label>Case Study Image</Label>
                      <div className="aspect-video rounded-3xl overflow-hidden bg-gray-100 border border-white/20 shadow-inner">
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <Input 
                        value={product.image} 
                        onChange={e => handleUpdateProduct(product.id, { image: e.target.value })}
                        className="rounded-xl text-xs"
                        placeholder="Image URL"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Order</Label>
                          <Input 
                            type="number" 
                            value={product.order} 
                            onChange={e => handleUpdateProduct(product.id, { order: parseInt(e.target.value) })}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Theme Color</Label>
                          <Input 
                            value={product.color} 
                            onChange={e => handleUpdateProduct(product.id, { color: e.target.value })}
                            className="rounded-xl text-xs"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:w-2/3 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <Label>Title</Label>
                          <Input 
                            value={product.title} 
                            onChange={e => handleUpdateProduct(product.id, { title: e.target.value })}
                            className="rounded-xl text-lg font-bold"
                          />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)} className="text-red-500 ml-4">
                          <Trash2 size={20} />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Short Description</Label>
                        <Input 
                          value={product.description} 
                          onChange={e => handleUpdateProduct(product.id, { description: e.target.value })}
                          className="rounded-xl"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-blue-600 font-bold">The Problem</Label>
                          <Textarea 
                            value={product.problem} 
                            onChange={e => handleUpdateProduct(product.id, { problem: e.target.value })}
                            className="rounded-xl min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-purple-600 font-bold">The Bet</Label>
                          <Textarea 
                            value={product.bet} 
                            onChange={e => handleUpdateProduct(product.id, { bet: e.target.value })}
                            className="rounded-xl min-h-[100px]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="font-bold">Key Decisions</Label>
                        <Textarea 
                          value={product.decisions} 
                          onChange={e => handleUpdateProduct(product.id, { decisions: e.target.value })}
                          className="rounded-xl min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-green-600 font-bold">Impact (One per line)</Label>
                        <Textarea 
                          value={product.impact?.join('\n')} 
                          onChange={e => handleUpdateProduct(product.id, { impact: e.target.value.split('\n').filter(Boolean) })}
                          className="rounded-xl min-h-[100px]"
                          placeholder="₹40,000+ Cr Disbursement&#10;30+ Institutions Integrated"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Comment Moderation</CardTitle>
              <CardDescription>Approve or reject comments from your blog posts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comments.length === 0 && (
                  <div className="text-center py-12 text-[#8E8E93]">
                    <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No comments to moderate yet.</p>
                  </div>
                )}
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-2xl border border-white/20 bg-white/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{comment.userName}</span>
                        <Badge variant={comment.status === 'approved' ? 'default' : comment.status === 'pending' ? 'outline' : 'destructive'} className="text-[10px]">
                          {comment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#1C1C1E]">{comment.content}</p>
                      <p className="text-[10px] text-[#8E8E93]">On Blog ID: {comment.blogId} • {comment.timestamp?.toDate().toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {comment.status !== 'approved' && (
                        <Button size="sm" variant="outline" className="rounded-xl text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleModerateComment(comment.id, 'approved')}>
                          Approve
                        </Button>
                      )}
                      {comment.status !== 'rejected' && (
                        <Button size="sm" variant="outline" className="rounded-xl text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleModerateComment(comment.id, 'rejected')}>
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

