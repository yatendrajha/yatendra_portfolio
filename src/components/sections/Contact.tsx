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
        <h2 className="text-4xl font-extrabold tracking-tight text-[#1C1C1E]">Get in Touch</h2>
        <p className="text-[#8E8E93] max-w-md mx-auto">
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
              <Card className="rounded-3xl border-none shadow-sm hover:shadow-md transition-all bg-white/60 backdrop-blur-md overflow-hidden group">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${info.color} transition-transform group-hover:scale-110`}>
                    <info.icon size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#8E8E93] uppercase tracking-wider">{info.label}</p>
                    <p className="text-sm font-bold text-[#1C1C1E]">{info.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </div>

        <div className="lg:col-span-2">
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white/60 backdrop-blur-md overflow-hidden">
            <CardContent className="p-8 md:p-10">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                >
                  <div className="p-4 bg-green-100 text-green-600 rounded-full">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1C1C1E]">Message Sent!</h3>
                  <p className="text-[#8E8E93]">
                    Thank you for reaching out. I'll get back to you as soon as possible.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSuccess(false)}
                    className="rounded-full px-8"
                  >
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-[#1C1C1E] ml-1">Name</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" size={18} />
                        <Input 
                          id="name"
                          {...register("name")}
                          placeholder="John Doe" 
                          className={cn(
                            "pl-12 py-6 rounded-2xl border-white/20 bg-white/40 focus:bg-white transition-all",
                            errors.name && "border-red-500 focus:ring-red-500/20"
                          )}
                        />
                      </div>
                      {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-[#1C1C1E] ml-1">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" size={18} />
                        <Input 
                          id="email"
                          {...register("email")}
                          placeholder="john@example.com" 
                          className={cn(
                            "pl-12 py-6 rounded-2xl border-white/20 bg-white/40 focus:bg-white transition-all",
                            errors.email && "border-red-500 focus:ring-red-500/20"
                          )}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-semibold text-[#1C1C1E] ml-1">Subject</Label>
                    <Input 
                      id="subject"
                      {...register("subject")}
                      placeholder="Project Inquiry" 
                      className={cn(
                        "py-6 rounded-2xl border-white/20 bg-white/40 focus:bg-white transition-all",
                        errors.subject && "border-red-500 focus:ring-red-500/20"
                      )}
                    />
                    {errors.subject && <p className="text-xs text-red-500 ml-1">{errors.subject.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold text-[#1C1C1E] ml-1">Message</Label>
                    <Textarea 
                      id="message"
                      {...register("message")}
                      placeholder="Tell me about your project..." 
                      className={cn(
                        "min-h-[150px] rounded-[2rem] border-white/20 bg-white/40 focus:bg-white transition-all p-6",
                        errors.message && "border-red-500 focus:ring-red-500/20"
                      )}
                    />
                    {errors.message && <p className="text-xs text-red-500 ml-1">{errors.message.message}</p>}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-7 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
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

