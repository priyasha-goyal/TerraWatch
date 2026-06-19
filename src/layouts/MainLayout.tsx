import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF8] text-[#1F2937]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};
