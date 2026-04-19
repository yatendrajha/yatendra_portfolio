/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Layout from '@/components/Layout';
import AboutMe from '@/components/sections/AboutMe';
import Products from '@/components/sections/Products';
import Blog from '@/components/sections/Blog';
import Contact from '@/components/sections/Contact';
import AdminPortal from '@/components/sections/AdminPortal';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';

export default function App() {
  const [activeSection, setActiveSection] = React.useState('about');

  // Track daily visitors
  React.useEffect(() => {
    const trackVisitor = async () => {
      const today = new Date().toISOString().split('T')[0];
      const visitorRef = doc(db, 'analytics/visitors/daily', today);
      try {
        // Use setDoc with merge: true and increment to avoid needing read permission
        await setDoc(visitorRef, { 
          count: increment(1),
          date: today 
        }, { merge: true });
      } catch (err) {
        // Silent fail for visitors
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
      case 'blog':
        return <Blog />;
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


