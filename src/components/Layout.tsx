import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Briefcase, Mail, BookOpen, Download, Search, Menu, X, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const navItems = [
  { id: 'about', label: 'About', icon: User },
  { id: 'products', label: 'Products', icon: Briefcase },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export default function Layout({ children, activeSection, setActiveSection }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Block copying site-wide
  React.useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };
    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    // Prompt the user to select an account even if they're already signed in
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.code === 'auth/unauthorized-domain') {
        alert(`Authentication failed: The domain "${window.location.hostname}" is not authorized in your Firebase Project configuration. Please add it to the "Authorized Domains" list in the Firebase Console (Authentication > Settings).`);
      } else if (error.code === 'auth/popup-closed-by-user') {
        // This is normal if they close it, but if it closes "automatically", 
        // it might be a cookie/domain issue being misreported.
        console.warn("Popup closed by user or automatically. Check if third-party cookies are blocked.");
      } else {
        alert(`Login failed: ${error.message} (Code: ${error.code})`);
      }
    }
  };

  const handleDownloadResume = async () => {
    try {
      const docRef = doc(db, 'config', 'resume');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().url) {
        window.open(docSnap.data().url, '_blank');
      } else {
        alert('Resume is currently unavailable.');
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      alert('Failed to download resume.');
    }
  };

  const isAdmin = user?.email === 'yatendra.yuva@gmail.com';

  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans selection:bg-primary/30 select-none antialiased">
      {/* iOS Style Status Bar / Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#001b3d]/40 backdrop-blur-2xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold tracking-tight cursor-pointer flex items-center gap-2"
          onClick={() => setActiveSection('about')}
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            Y
          </div>
          <span className="text-white">Yatendra <span className="text-primary font-black">Jha</span></span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 bg-white/5 backdrop-blur-md p-1 rounded-2xl border border-white/10 shadow-inner">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2",
                activeSection === item.id 
                  ? "bg-primary text-white shadow-xl shadow-primary/20" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => setActiveSection('admin')}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2",
                activeSection === 'admin' 
                  ? "bg-primary text-white shadow-xl shadow-primary/20" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Settings size={16} />
              Admin
            </button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white font-semibold"
            onClick={handleDownloadResume}
          >
            <Download size={16} />
            Resume
          </Button>
          
          {user ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-[#8E8E93] hover:text-red-500 hover:bg-white/20"
              onClick={() => signOut(auth)}
              title="Logout"
            >
              <LogOut size={20} />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-[#8E8E93] hover:text-blue-600 hover:bg-white/20"
              onClick={handleLogin}
              title="Admin Login"
            >
              <User size={20} />
            </Button>
          )}

          <button 
            className="md:hidden p-2 text-[#1C1C1E]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/80 backdrop-blur-3xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl text-lg font-semibold transition-colors",
                    activeSection === item.id ? "bg-blue-50/50 text-blue-600" : "text-[#1C1C1E] hover:bg-white/40"
                  )}
                >
                  <item.icon size={24} />
                  {item.label}
                </button>
              ))}
              {isAdmin && (
                <button
                  onClick={() => {
                    setActiveSection('admin');
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl text-lg font-semibold transition-colors",
                    activeSection === 'admin' ? "bg-blue-50/50 text-blue-600" : "text-[#1C1C1E] hover:bg-white/40"
                  )}
                >
                  <Settings size={24} />
                  Admin
                </button>
              )}
              {!user && (
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-4 p-4 rounded-2xl text-lg font-semibold text-[#1C1C1E] hover:bg-white/40"
                >
                  <User size={24} />
                  Admin Login
                </button>
              )}
              <Button 
                className="w-full py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleDownloadResume();
                }}
              >
                <Download size={20} />
                Download Resume
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6 max-w-5xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* iOS Style Tab Bar for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#001b3d]/60 backdrop-blur-2xl border-t border-white/5 px-6 py-3 flex justify-between items-center z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              activeSection === item.id ? "text-primary" : "text-white/40"
            )}
          >
            <item.icon size={22} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
      </div>
    </div>
  );
}
