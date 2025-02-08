// src/Home.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Info from './info';
import { Leaf, ArrowRight, Globe } from 'lucide-react';

// Add translations
const translations = {
  en: {
    home: 'Home',
    chat: 'Chat',
    title: 'Smart Farming Solutions with AI',
    subtitle: 'Empowering farmers with advanced AI technology to detect and prevent plant diseases. Get instant analysis and expert recommendations for your crops.',
    startButton: 'Start Analysis',
    footer: 'All Rights Reserved.'
  },
  fr: {
    home: 'Accueil',
    chat: 'Discussion',
    title: 'Solutions Agricoles Intelligentes avec l\'IA',
    subtitle: 'Accompagner les agriculteurs avec une technologie IA avancée pour détecter et prévenir les maladies des plantes. Obtenez une analyse instantanée et des recommandations d\'experts pour vos cultures.',
    startButton: 'Commencer l\'Analyse',
    footer: 'Tous Droits Réservés.'
  },
  ar: {
    home: 'الرئيسية',
    chat: 'محادثة',
    title: 'حلول زراعية ذكية مع الذكاء الاصطناعي',
    subtitle: 'تمكين المزارعين بتقنية الذكاء الاصطناعي المتقدمة للكشف عن أمراض النباتات والوقاية منها. احصل على تحليل فوري وتوصيات الخبراء لمحاصيلك.',
    startButton: 'بدء التحليل',
    footer: 'جميع الحقوق محفوظة.'
  }
};

const Home = () => {
  const [language, setLanguage] = useState('en');
  
  // Translation helper
  const t = (key) => translations[language][key];

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="text-emerald-600" size={28} />
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
              FarmInsights
            </span>
          </div>
          <nav className="flex items-center gap-8">
            <ul className="flex space-x-8 text-lg font-medium">
              <li>
                <a href="#home" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  {t('home')}
                </a>
              </li>
              <li>
                <Link to="/chat" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  {t('chat')}
                </Link>
              </li>
            </ul>

            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <Globe size={24} />
                <span className="uppercase">{language}</span>
              </button>
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {Object.keys(translations).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`block w-full px-4 py-2 text-left hover:bg-emerald-50 transition-colors
                      ${language === lang ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600'}`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col justify-center items-center text-center py-32 px-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" 
             style={{
               backgroundImage: `radial-gradient(#22c55e 0.5px, transparent 0.5px), radial-gradient(#22c55e 0.5px, transparent 0.5px)`,
               backgroundSize: '20px 20px',
               backgroundPosition: '0 0, 10px 10px',
               opacity: 0.2
             }}>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-emerald-700 via-green-600 to-teal-600 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
          <Link to="/chat">
            <button className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-emerald-700 hover:to-green-600 transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30">
              {t('startButton')}
              <ArrowRight className={`group-hover:translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} size={20} />
            </button>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-green-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-gradient-to-br from-teal-200/30 to-emerald-200/30 rounded-full blur-3xl"></div>
      </div>
    
      {/* Info Section */}
      <Info language={language} />
    
      {/* Footer */}
      <footer className="bg-white border-t border-emerald-100">
        <div className="container mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="text-emerald-600" size={20} />
            <span className="font-semibold text-emerald-800">FarmInsights</span>
          </div>
          <p className="text-gray-500">&copy; 2025 Farm Insights. {t('footer')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
