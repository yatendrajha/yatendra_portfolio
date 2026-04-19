import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Layers, Zap, Shield, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function Products() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const defaultProducts = [
    {
      title: "Co-Lending Platform Transformation",
      description: "Converted a single-lender system into an API-first, multi-partner ecosystem to optimize cost of funds and access.",
      problem: "Single-lender system limited capital efficiency, pricing, and scale.",
      bet: "Convert to API-first, multi-partner platform to optimize cost of funds and access.",
      decisions: "Standardized partner onboarding, credit policies, and disbursement orchestration.",
      impact: ["+40% capacity", "-30% TAT", "T+15 → T+1 payouts", "Higher retention"],
      icon: Zap,
      color: "from-orange-500/20 to-orange-600/10",
      image: "https://picsum.photos/seed/colending/800/600"
    },
    {
      title: "Unified Lending & Underwriting",
      description: "Single onboarding + configurable rules engine for consistent decisioning across multiple products.",
      problem: "Fragmented journeys across products caused drop-offs and slow decisions.",
      bet: "Single onboarding + configurable rules engine for consistent decisioning.",
      decisions: "Policy-driven underwriting, third-party integrations (bureau/AA), UX simplification.",
      impact: ["+20% conversion", "-45% approval time", "-25% drop-offs", "100K+ users"],
      icon: Shield,
      color: "from-blue-500/20 to-blue-600/10",
      image: "https://picsum.photos/seed/underwriting/800/600"
    },
    {
      title: "Enterprise AI Knowledge Assistant",
      description: "RAG-based, RBAC-controlled assistant with citations and walled-garden data for secure decisioning.",
      problem: "Low trust in AI due to hallucination & data leakage risks.",
      bet: "RAG-based, RBAC-controlled assistant with citations and walled-garden data.",
      decisions: "Role-based access, explainable outputs, EDW integration for natural-language analytics.",
      impact: ["Faster decisions", "Reduced SME dependency", "Zero data leakage", "Org-wide adoption"],
      icon: Layers,
      color: "from-purple-500/20 to-purple-600/10",
      image: "https://picsum.photos/seed/ai-assistant/800/600"
    }
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  return (
    <div className="space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase italic">Product Case Studies</h2>
        <p className="text-white/60 max-w-2xl mx-auto text-lg font-medium">
          Strategic transformations and platform innovations in Fintech and AI.
        </p>
      </div>

      <div className="space-y-32">
        {displayProducts.map((product, i) => {
          const Icon = product.icon || Zap;
          return (
            <motion.div
              key={product.id || product.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={cn(
                "flex flex-col gap-16 items-center",
                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              )}
            >
              {/* Image Side */}
              <div className="w-full lg:w-1/2">
                <div className={cn(
                  "relative rounded-[3.5rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl group",
                )}>
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000c19] via-transparent to-transparent opacity-60" />
                  <div className="absolute top-8 left-8">
                    <div className="p-4 bg-primary rounded-2xl shadow-[0_0_20px_rgba(14,165,233,0.4)]">
                      <Icon size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 space-y-10">
                <div className="space-y-4">
                  <Badge variant="outline" className="rounded-full bg-primary/20 text-primary border-primary/30 px-4 py-1.5 font-black text-[10px] uppercase tracking-widest">Case Study</Badge>
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase leading-none">{product.title}</h3>
                  <p className="text-lg text-white/70 leading-relaxed font-medium">{product.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">The Problem</h4>
                    <p className="text-sm text-white/80 leading-relaxed font-bold">{product.problem}</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">The Bet</h4>
                    <p className="text-sm text-white/80 leading-relaxed font-bold">{product.bet}</p>
                  </div>
                </div>

                <div className="p-8 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl space-y-4 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Key Strategic Decisions</h4>
                  <p className="text-sm text-white/90 leading-relaxed font-medium">{product.decisions}</p>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Measurable Impact</h4>
                  <div className="flex flex-wrap gap-3">
                    {product.impact?.map((item: string) => (
                      <div key={item} className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-5 py-2.5 rounded-full text-xs font-black border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

