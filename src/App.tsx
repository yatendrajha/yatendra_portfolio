/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Layout from '@/components/Layout';
import AboutMe from '@/components/sections/AboutMe';
import Products from '@/components/sections/Products';
import Contact from '@/components/sections/Contact';
import AdminPortal from '@/components/sections/AdminPortal';
import { db } from '@/lib/firebase';
import { doc, setDoc, increment, collection, addDoc } from 'firebase/firestore';

export default function App() {
  const [activeSection, setActiveSection] = React.useState('about');

  // Track daily visitors and capture IP/Location detail
  React.useEffect(() => {
    const trackVisitor = async () => {
      const today = new Date().toISOString().split('T')[0];
      const visitorRef = doc(db, 'analytics/visitors/daily', today);
      
      try {
        // 1. Traditional daily counter
        await setDoc(visitorRef, { 
          count: increment(1),
          date: today 
        }, { merge: true });

        // 2. Specialized detail capture via backend API
        const res = await fetch('/api/track', { method: 'POST' });
        const { ip, location, country } = await res.json();

        // 3. Store detail in Firestore
        await addDoc(collection(db, 'analytics/visitors/details'), {
          ip: ip || 'unknown',
          location: location || 'unknown',
          country: country || 'unknown',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          platform: navigator.platform
        });
      } catch (err) {
        console.error("Tracking failed", err);
      }
    };
    trackVisitor();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'about':
        return <AboutMe />;
      case 'products':
        return <Products />;
      case 'contact':
        return <Contact />;
      case 'admin':
        return <AdminPortal />;
      default:
        return <AboutMe />;
    }
  };

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderSection()}
    </Layout>
  );
}


