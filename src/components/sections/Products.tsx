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
        <h2 className="text-4xl font-extrabold tracking-tight text-[#1C1C1E]">Product Case Studies</h2>
        <p className="text-[#8E8E93] max-w-2xl mx-auto text-lg">
          Strategic transformations and platform innovations in Fintech and AI.
        </p>
      </div>

      <div className="space-y-24">
        {displayProducts.map((product, i) => {
          const Icon = product.icon || Zap;
          return (
            <motion.div
              key={product.id || product.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className={cn(
                "flex flex-col gap-12 items-center",
                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              )}
            >
              {/* Image Side */}
              <div className="w-full lg:w-1/2">
                <div className={cn(
                  "relative rounded-[3rem] overflow-hidden bg-gradient-to-br shadow-2xl shadow-blue-100/50 group",
                  product.color || "from-blue-500/20 to-blue-600/10"
                )}>
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  <div className="absolute top-6 left-6">
                    <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg">
                      <Icon size={24} className="text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="space-y-4">
                  <Badge variant="outline" className="rounded-full bg-blue-50/50 text-blue-600 border-blue-100/50 px-4 py-1">Case Study</Badge>
                  <h3 className="text-3xl font-bold text-[#1C1C1E]">{product.title}</h3>
                  <p className="text-lg text-[#8E8E93] leading-relaxed">{product.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-600">The Problem</h4>
                    <p className="text-sm text-[#1C1C1E] leading-relaxed opacity-80">{product.problem}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-purple-600">The Bet</h4>
                    <p className="text-sm text-[#1C1C1E] leading-relaxed opacity-80">{product.bet}</p>
                  </div>
                </div>

                <div className="p-6 bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/20 shadow-sm space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1C1C1E]">Key Decisions</h4>
                  <p className="text-sm text-[#8E8E93] leading-relaxed">{product.decisions}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1C1C1E]">Impact</h4>
                  <div className="flex flex-wrap gap-3">
                    {product.impact?.map((item: string) => (
                      <div key={item} className="flex items-center gap-2 bg-green-50/50 text-green-700 px-4 py-2 rounded-full text-xs font-bold border border-green-100/50">
                        <CheckCircle2 size={14} />
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

