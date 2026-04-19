import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Briefcase, Code, Award, MapPin, Mail, Phone, Globe, Loader2, TrendingUp, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function AboutMe() {
  const [profile, setProfile] = React.useState<any>(null);
  const [experiences, setExperiences] = React.useState<any[]>([]);
  const [education, setEducation] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const defaultProfile = {
    name: "YATENDRA JHA",
    title: "Product Leader | Fintech & AI Specialist",
    bio: "Product leader with 14+ years building API-first, multi-tenant platforms across B2B and B2C lending. Drove ₹40,000+ Cr disbursement across 30+ institutions and improved conversion, TAT, and unit economics. Known for turning complex regulatory/risk constraints into simple, scalable product decisions. Strengths in platform design, partner ecosystems, and enterprise AI (RAG, RBAC, explainability).",
    address: "Mumbai, India",
    email: "hi@yatendrajha.in",
    phone: "+91-9967958271",
    profileImage: "https://lh3.googleusercontent.com/a/ACg8ocI3YaEqxRZPzDALt4dPvJWtfuF5JMN5sZ8PnfPNNeDUW0Yq_y3T=s96-c",
    linkedin: "linkedin.com/in/yatendra1990",
    skills: [
      "Product Strategy & Road mapping",
      "Platform & API-First Architecture",
      "Multi-Partner & Ecosystem Platforms",
      "Stakeholder Leadership & Execution",
      "Product",
      "CX Optimization",
      "Automation & Decisioning Systems",
      "Risk & Compliance",
      "Metrics, Experimentation & Funnel Optimization"
    ]
  };

  const defaultExperiences = [
    {
      id: '1',
      role: 'Chief Manager – Transformation (Product-Aligned)',
      company: 'Avanse Financial Services',
      period: '2024 – Present',
      description: [
        'End to End owner for transformation of a multi‑partner co‑lending platform, enabling seamless onboarding, automated credit policies, and orchestrated disbursements using API‑first, modular architecture',
        'Redesigned critical customer and partner journeys across risk, operations, and engineering, balancing regulatory compliance with speed and UX',
        'Balanced regulatory compliance + business scalability'
      ],
      impact: ['T+15 to T+1 TAT for payouts', '+18–22% Loan conversion', '+60% Ops efficiency', 'Process Automation', 'Faster Approvals', 'Improved CX', 'Scalable ops', '+40% lending capacity', '+50% faster partner onboarding for Co-lending DA, CLM and CLA']
    },
    {
      id: '2',
      role: 'Business Consultant (Product)',
      company: 'Dvara Solutions',
      period: '2020 - 2024',
      description: [
        'Partnered with 30+ Banks & NBFCs for large-scale product services from Partner customer journey, Origination, Loan Management and Co-lending solutions',
        'Owned product strategy for customizable loan origination and management platforms, enabling multiple lenders to operate on a single scalable system',
        'Designed workflows for underwriting, partner settlement, compliance, and customer servicing across personal, MSME, vehicle, gold, and microfinance products',
        'Acted as primary product interface between clients, engineering, risk, and data teams'
      ],
      impact: ['₹40,000+ Cr AUM Managed in system', '1,00,000+ End customer', 'Standardized partner integrations and reduced delivery friction across institutions']
    },
    {
      id: '3',
      role: 'Associate Vice President – Technology',
      company: 'Mangal Credit & Fincorp',
      period: '2020 - 2020',
      description: [
        'Led digitization of a traditionally manual gold‑loan lifecycle, introducing standardized, system‑driven workflows',
        'Built digital onboarding, valuation capture, and pledge workflows replacing spreadsheet‑driven processes',
        'Introduced centralized validations, auditability, and operational controls across branches'
      ],
      impact: ['40% Faster approvals', '30% Reduction due to manual errors', '40% Improved branch productivity']
    },
    {
      id: '4',
      role: 'Sr. IT Manager - Product & Digital Transformation',
      company: 'Western India Transport Finance',
      period: '2018 - 2020',
      description: [
        'Owned digital transformation of commercial vehicle loan lifecycle, scaling branch‑led sales through centralized platforms',
        'Built digital workflows from lead generation through sanction and disbursement',
        'Implemented automated credit decisioning and centralized document management compliant with RBI regulations'
      ],
      impact: ['Reduced turnaround time', 'Enabled AUM growth from ₹60 Cr to ₹120 Cr', 'Improved scalability and compliance through centralized systems']
    },
    {
      id: '5',
      role: 'IT Analyst - Escalation Management',
      company: 'NCR Corporation',
      period: 'Earlier career',
      description: [
        'Supported large‑scale payment and fintech systems',
        'Led incident management, root cause analysis, and reliability improvements'
      ],
      impact: ['Improved SLA adherence', 'Reduced critical production incidents']
    }
  ];

  React.useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, 'profile', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    };

    const qExp = query(collection(db, 'experience'), orderBy('order', 'asc'));
    const unsubExp = onSnapshot(qExp, (snap) => {
      setExperiences(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qEdu = query(collection(db, 'education'), orderBy('order', 'asc'));
    const unsubEdu = onSnapshot(qEdu, (snap) => {
      setEducation(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    fetchProfile().finally(() => setLoading(false));

    return () => {
      unsubExp();
      unsubEdu();
    };
  }, []);

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const displayProfile = profile || defaultProfile;
  const displayExperiences = experiences.length > 0 ? experiences : defaultExperiences;
  const skills = displayProfile.skills || defaultProfile.skills;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden flex flex-col md:flex-row items-center gap-8 bg-card backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-2xl border border-white/5">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 w-full">
          <div className="relative">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl bg-slate-900/50">
              <img 
                src={displayProfile.profileImage || defaultProfile.profileImage} 
                alt={displayProfile.name} 
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase drop-shadow-sm">
                {displayProfile.name}
              </h1>
              <p className="text-xl text-primary font-bold tracking-wide italic">{displayProfile.title}</p>
            </div>
            <p className="text-white/70 max-w-2xl leading-relaxed text-lg font-medium">
              {displayProfile.bio}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold uppercase tracking-widest text-primary/80">
              <span className="flex items-center gap-1.5"><MapPin size={14} /> {displayProfile.address}</span>
              <span className="flex items-center gap-1.5"><Mail size={14} /> {displayProfile.email}</span>
              <span className="flex items-center gap-1.5"><Phone size={14} /> {displayProfile.phone}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Skills & Education */}
        <div className="md:col-span-1 space-y-8">
          <Card className="rounded-[2rem] border-white/5 shadow-2xl bg-card backdrop-blur-2xl overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <Code size={20} />
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white">Core Expertise</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {skills.map((skill: string, index: number) => (
                  <motion.div 
                    key={skill}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(14,165,233,0.5)] group-hover:scale-125 transition-transform" />
                    <span className="text-sm font-bold text-white/90">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/5 shadow-2xl bg-card backdrop-blur-2xl overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <GraduationCap size={20} />
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white">Education</h3>
              </div>
              <div className="space-y-6">
                {(education.length > 0 ? education : [
                    { degree: 'PGDM', school: 'L.N. Welingkar Institute of Management', period: '2016 – 2018' },
                    { degree: 'Bachelor of Management Studies', school: 'Lala Lajpat Rai College', period: '2011 - 2013' },
                    { degree: 'Generative AI Foundations Certificate', school: 'Upgrad & Microsoft', period: '2025' }
                ]).map((edu, idx) => (
                  <div key={idx} className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full before:shadow-[0_0_8px_rgba(14,165,233,0.8)]">
                    <h4 className="font-black text-white text-sm uppercase tracking-wide">{edu.degree}</h4>
                    <p className="text-xs text-white/60 font-semibold mt-1">{edu.school}</p>
                    <p className="text-[10px] font-black text-primary mt-2 uppercase tracking-tighter bg-primary/10 inline-block px-2 py-0.5 rounded-md">{edu.period}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Experience */}
        <div className="md:col-span-2">
          <Card className="rounded-[2.5rem] border-white/5 shadow-2xl bg-card backdrop-blur-3xl h-full">
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-3 text-primary">
                <Briefcase size={24} />
                <h3 className="font-black text-xs uppercase tracking-[0.3em] text-white">Professional Experience</h3>
              </div>
              <div className="space-y-16 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                {displayExperiences.map((exp, i) => (
                  <motion.div 
                    key={exp.id || i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative pl-12"
                  >
                    <div className="absolute left-1.5 top-1.5 w-5 h-5 rounded-full bg-[#000c19] border-2 border-primary z-10 shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <h4 className="text-xl font-black text-white tracking-tight uppercase">{exp.role}</h4>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="font-black text-primary italic text-sm tracking-wide">{exp.company}</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center text-[10px] font-black text-white/40 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest self-start">
                          {exp.period}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        {Array.isArray(exp.description) ? (
                          <ul className="space-y-3">
                            {exp.description.map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-4 text-white/70 text-sm md:text-base leading-relaxed font-medium">
                                <ChevronRight size={16} className="text-primary mt-1 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-white/70 leading-relaxed text-sm md:text-base font-medium">
                            {exp.description}
                          </p>
                        )}
                      </div>
                      
                      {exp.impact && exp.impact.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-white/5">
                          <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-px bg-primary/50" />
                            <h5 className="font-black text-[10px] text-white uppercase tracking-[0.4em]">Strategy & Impact</h5>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {exp.impact.map((imp: string, idx: number) => (
                              <motion.div
                                key={idx}
                                whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                className="group relative bg-[#001b3d]/40 rounded-2xl p-4 border border-white/5 transition-all duration-300 overflow-hidden"
                              >
                                <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <Zap size={12} className="text-primary" />
                                </div>
                                <span className="text-sm font-bold text-white/80 group-hover:text-white leading-tight">
                                  {imp}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
