// src/Info.js
import React from 'react';
import { AlertTriangle, Brain, Sprout } from 'lucide-react';

const Info = () => {
  return (
    <div className="py-24 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-50/50 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative">
        {/* First Block: Fungal Diseases */}
        <div className="mb-24 flex flex-col md:flex-row items-center gap-12 relative">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-red-100/30 rounded-full blur-3xl"></div>
          
          <div className="w-full md:w-1/2 relative">
            <div className="relative group">
              <img 
                src="./alert.webp" 
                alt="Fungal Diseases" 
                className="w-full rounded-3xl shadow-2xl transition duration-500 group-hover:translate-x-2 group-hover:translate-y-2 group-hover:shadow-emerald-200" 
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>

          <div className="w-full md:w-1/2 md:pl-12">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-red-500" size={28} />
              <h2 className="text-4xl font-bold text-gray-800">Fungal Diseases in Plants</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Fungal diseases pose a significant threat to plant health, potentially reducing crop yields and quality. Early detection and proper treatment are crucial for maintaining healthy crops and ensuring optimal agricultural output.
            </p>
          </div>
        </div>

        {/* Second Block: AI Solution */}
        <div className="mb-24 flex flex-col md:flex-row-reverse items-center gap-12 relative">
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl"></div>
          
          <div className="w-full md:w-1/2 relative">
            <div className="relative group">
              <img 
                src="./solution.webp" 
                alt="AI Solution" 
                className="w-full rounded-3xl shadow-2xl transition duration-500 group-hover:-translate-x-2 group-hover:translate-y-2 group-hover:shadow-emerald-200" 
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-l from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>

          <div className="w-full md:w-1/2 md:pr-12">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="text-emerald-600" size={28} />
              <h2 className="text-4xl font-bold text-gray-800">AI-Powered Detection</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our advanced AI model analyzes plant images to accurately detect diseases. Using deep learning technology, it provides instant diagnosis and treatment recommendations, helping farmers take timely action to protect their crops.
            </p>
          </div>
        </div>

        {/* Third Block: Integration */}
        <div className="flex flex-col md:flex-row items-center gap-12 relative">
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl"></div>
          
          <div className="w-full md:w-1/2 relative">
            <div className="relative group">
              <img 
                src="./aiagro.webp" 
                alt="AI Integration" 
                className="w-full rounded-3xl shadow-2xl transition duration-500 group-hover:translate-x-2 group-hover:translate-y-2 group-hover:shadow-emerald-200" 
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>

          <div className="w-full md:w-1/2 md:pl-12">
            <div className="flex items-center gap-3 mb-6">
              <Sprout className="text-teal-600" size={28} />
              <h2 className="text-4xl font-bold text-gray-800">Smart Agriculture</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Integrate AI into your farming practices for improved productivity and sustainability. Our system helps optimize resource usage, reduce costs, and make data-driven decisions for better agricultural outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;