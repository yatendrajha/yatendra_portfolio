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
      <section className="relative overflow-hidden flex flex-col md:flex-row items-center gap-8 bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white/20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              rotate: [0, -90, 0],
              opacity: [0.03, 0.08, 0.03]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-48 -left-48 w-[30rem] h-[30rem] bg-purple-400 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 w-full">
          <div className="relative">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-gray-100">
              <img 
                src={displayProfile.profileImage || defaultProfile.profileImage} 
                alt={displayProfile.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultProfile.profileImage;
                }}
              />
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-full border-4 border-white text-white shadow-lg"
            >
              <Award size={16} />
            </motion.div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1C1C1E]">
                {displayProfile.name}
              </h1>
              <p className="text-xl text-blue-600 font-medium">{displayProfile.title}</p>
            </div>
            <p className="text-[#8E8E93] max-w-2xl leading-relaxed">
              {displayProfile.bio}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-[#8E8E93]">
              <span className="flex items-center gap-1"><MapPin size={14} /> {displayProfile.address}</span>
              <span className="flex items-center gap-1"><Mail size={14} /> {displayProfile.email}</span>
              <span className="flex items-center gap-1"><Phone size={14} /> {displayProfile.phone}</span>
              {displayProfile.linkedin && (
                <a href={`https://${displayProfile.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <Globe size={14} /> {displayProfile.linkedin}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Skills & Education */}
        <div className="md:col-span-1 space-y-8">
          <Card className="rounded-[2rem] border-none shadow-sm bg-white/60 backdrop-blur-md overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 text-blue-600">
                <Code size={20} />
                <h3 className="font-bold text-lg">Core Expertise</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {skills.map((skill: string, index: number) => (
                  <motion.div 
                    key={skill}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-xl bg-white/40 border border-white/20 group hover:bg-blue-50/50 transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:scale-150 transition-transform" />
                    <span className="text-sm font-medium text-[#1C1C1E]">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-sm bg-white/60 backdrop-blur-md overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 text-blue-600">
                <GraduationCap size={20} />
                <h3 className="font-bold text-lg">Education</h3>
              </div>
              <div className="space-y-5">
                {education.length > 0 ? education.map((edu) => (
                  <div key={edu.id} className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-blue-400 before:rounded-full">
                    <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                    <p className="text-sm text-gray-600 mt-0.5">{edu.school}</p>
                    <p className="text-xs font-medium text-blue-600 mt-1">{edu.period}</p>
                  </div>
                )) : (
                  <>
                    <div className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-blue-400 before:rounded-full">
                      <h4 className="font-bold text-gray-900">PGDM</h4>
                      <p className="text-sm text-gray-600 mt-0.5">L.N. Welingkar Institute of Management</p>
                      <p className="text-xs font-medium text-blue-600 mt-1">2016 – 2018</p>
                    </div>
                    <div className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-blue-400 before:rounded-full">
                      <h4 className="font-bold text-gray-900">Bachelor of Management Studies</h4>
                      <p className="text-sm text-gray-600 mt-0.5">Lala Lajpat Rai College</p>
                      <p className="text-xs font-medium text-blue-600 mt-1">2011 - 2013</p>
                    </div>
                    <div className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-blue-400 before:rounded-full">
                      <h4 className="font-bold text-gray-900">Generative AI Foundations Certificate Program</h4>
                      <p className="text-sm text-gray-600 mt-0.5">Upgrad & Microsoft</p>
                      <p className="text-xs font-medium text-blue-600 mt-1">2025</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Experience */}
        <div className="md:col-span-2">
          <Card className="rounded-[2rem] border-none shadow-sm bg-white/60 backdrop-blur-md h-full">
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-3 text-blue-600">
                <Briefcase size={24} />
                <h3 className="font-bold text-xl">Professional Experience</h3>
              </div>
              <div className="space-y-12 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/40">
                {displayExperiences.map((exp, i) => (
                  <motion.div 
                    key={exp.id || i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative pl-10"
                  >
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-blue-600 z-10 shadow-sm" />
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 tracking-tight">{exp.role}</h4>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-50 text-blue-600">
                              <Briefcase size={14} />
                            </div>
                            <p className="font-semibold text-blue-600">{exp.company}</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center text-xs font-semibold text-gray-500 bg-gray-100/80 px-3 py-1.5 rounded-full border border-gray-200/50">
                          {exp.period}
                        </span>
                      </div>
                      
                      <div className="pt-2">
                        {Array.isArray(exp.description) ? (
                          <ul className="space-y-3">
                            {exp.description.map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm md:text-base leading-relaxed">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            {exp.description}
                          </p>
                        )}
                      </div>
                      
                      {exp.impact && exp.impact.length > 0 && (
                        <div className="mt-6 pt-5 border-t border-gray-100/60">
                          <div className="flex items-center gap-2 mb-4">
                            <TrendingUp size={16} className="text-blue-600" strokeWidth={2.5} />
                            <h5 className="font-bold text-sm text-gray-900 uppercase tracking-wider">Key Impact</h5>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {exp.impact.map((imp: string, idx: number) => (
                              <motion.div
                                key={idx}
                                whileHover={{ scale: 1.02, y: -2 }}
                                className="group relative overflow-hidden bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-default"
                              >
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5 bg-blue-50 text-blue-600 rounded-full p-1.5 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <Zap size={14} strokeWidth={2.5} />
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300 leading-snug">
                                    {imp}
                                  </span>
                                </div>
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
