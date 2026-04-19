import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { Send, CheckCircle2, Loader2, Mail, MessageSquare, User, MapPin, Linkedin, Instagram, Phone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [profile, setProfile] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, 'profile', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    };
    fetchProfile();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Form submitted:", data);
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const contactInfo = [
    { 
      icon: Mail, 
      label: 'Email', 
      value: profile?.email || 'hi@yatendrajha.in', 
      href: `mailto:${profile?.email || 'hi@yatendrajha.in'}`,
      color: 'bg-blue-50/50 text-blue-600'
    },
    { 
      icon: Linkedin, 
      label: 'LinkedIn', 
      value: 'yatendra1990', 
      href: profile?.linkedin || 'https://www.linkedin.com/in/yatendra1990/',
      color: 'bg-blue-50/50 text-blue-700'
    },
    { 
      icon: Instagram, 
      label: 'Instagram', 
      value: '@yatendra_jha', 
      href: profile?.instagram || 'https://www.instagram.com/yatendra_jha/',
      color: 'bg-pink-50/50 text-pink-600'
    },
    { 
      icon: MapPin, 
      label: 'Address', 
      value: profile?.address || 'Worli, Mumbai', 
      href: '#',
      color: 'bg-gray-50/50 text-gray-600'
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase italic">Get in Touch</h2>
        <p className="text-white/60 max-w-md mx-auto font-medium">
          Have a project in mind or want to discuss product strategy? I'm always open to new opportunities.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {contactInfo.map((info, index) => (
            <motion.a
              key={info.label}
              href={info.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="block"
            >
              <Card className="rounded-[2rem] border-white/5 shadow-2xl hover:shadow-primary/10 transition-all bg-white/5 backdrop-blur-3xl overflow-hidden group border hover:border-primary/30">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-4 rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-white shadow-inner`}>
                    <info.icon size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{info.label}</p>
                    <p className="text-sm font-black text-white">{info.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </div>

        <div className="lg:col-span-2">
          <Card className="rounded-[3rem] border-white/5 shadow-2xl bg-card backdrop-blur-3xl overflow-hidden border">
            <CardContent className="p-8 md:p-12">
              {isSuccess ? (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="flex flex-col items-center justify-center py-12 text-center space-y-6"
                >
                  <div className="p-6 bg-emerald-500/10 text-emerald-400 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 size={64} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">Transmission Received</h3>
                    <p className="text-white/60 font-medium">
                      Thank you for reaching out. I'll get back to you as soon as possible.
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsSuccess(false)}
                    className="rounded-2xl px-10 h-14 bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary/80 transition-all"
                  >
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Name</Label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
                        <Input 
                          id="name"
                          {...register("name")}
                          placeholder="Your identity" 
                          className={cn(
                            "pl-14 h-14 rounded-2xl border-white/5 bg-white/5 focus:bg-white/10 text-white placeholder:text-white/20 transition-all font-bold",
                            errors.name && "border-red-500/50"
                          )}
                        />
                      </div>
                      {errors.name && <p className="text-[10px] font-black text-red-500 uppercase tracking-tighter ml-1">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
                        <Input 
                          id="email"
                          {...register("email")}
                          placeholder="node@example.com" 
                          className={cn(
                            "pl-14 h-14 rounded-2xl border-white/5 bg-white/5 focus:bg-white/10 text-white placeholder:text-white/20 transition-all font-bold",
                            errors.email && "border-red-500/50"
                          )}
                        />
                      </div>
                      {errors.email && <p className="text-[10px] font-black text-red-500 uppercase tracking-tighter ml-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="subject" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Subject</Label>
                    <Input 
                      id="subject"
                      {...register("subject")}
                      placeholder="Strategy Inquiry" 
                      className={cn(
                        "h-14 rounded-2xl border-white/5 bg-white/5 focus:bg-white/10 text-white placeholder:text-white/20 transition-all font-bold px-6",
                        errors.subject && "border-red-500/50"
                      )}
                    />
                    {errors.subject && <p className="text-[10px] font-black text-red-500 uppercase tracking-tighter ml-1">{errors.subject.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="message" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Message Body</Label>
                    <Textarea 
                      id="message"
                      {...register("message")}
                      placeholder="Transmission details..." 
                      className={cn(
                        "min-h-[180px] rounded-[2.5rem] border-white/5 bg-white/5 focus:bg-white/10 text-white placeholder:text-white/20 transition-all p-8 font-medium leading-relaxed resize-none",
                        errors.message && "border-red-500/50"
                      )}
                    />
                    {errors.message && <p className="text-[10px] font-black text-red-500 uppercase tracking-tighter ml-1">{errors.message.message}</p>}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Transmission
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

