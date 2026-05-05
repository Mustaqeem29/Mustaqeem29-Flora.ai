import { useState, useCallback, useEffect, ChangeEvent, DragEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Search, Leaf, AlertCircle, Loader2, Download, Plus, Info, 
  ShieldCheck, Zap, Trash2, Calendar, Activity, Sun, Droplet, MessageSquare, 
  Heart, CheckCircle2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

// --- Types ---

interface Recommendation {
  name: string;
  reason: string;
}

interface Review {
  name: string;
  experience: string;
  useCase: string;
}

interface PlantResult {
  name: string;
  scientificName: string;
  urduName: string;
  description: string;
  benefits: string[];
  risks: string[];
  uses: string[];
  localInfo: string[];
  care: string[];
  healthStatus: 'Healthy' | 'Issue Detected' | 'Critical';
  healthIssues: string[];
  suggestions: string[];
  isEdible: string;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  confidenceReason: string;
  similarPlants: Recommendation[];
  communityReviews: Review[];
}

interface GardenPlant extends PlantResult {
  id: string;
  image: string;
  date: string;
  notes: string;
}

// AI Functionality Disabled for Cloud Run Deployment
// --- Components ---

function Navbar({ darkMode, setDarkMode, isMenuOpen, setIsMenuOpen, reset }: any) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex justify-between items-center px-6 md:px-12 py-6 relative z-50">
      <Link to="/" className="flex items-center gap-2 cursor-pointer group" onClick={reset}>
        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-cyan-500 transition-colors duration-300">
          <Leaf className="h-5 w-5 text-white" />
        </div>
        <span className="font-mono font-black text-xl tracking-tighter uppercase dark:text-white group-hover:glitch-text" data-text="Flora.ai">Flora.ai</span>
      </Link>
      
      <div className="flex gap-4 md:gap-8 items-center">
        <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest text-emerald-900/40 dark:text-emerald-100/40">
          <Link to="/" className={`${isActive('/') ? 'opacity-100 text-emerald-600 dark:text-emerald-400 font-black underline underline-offset-8 decoration-2' : 'hover:opacity-100 hover:text-emerald-600 dark:hover:text-emerald-400'} transition-all duration-300`}>Home</Link>
          <Link to="/gallery" className={`${isActive('/gallery') ? 'opacity-100 text-emerald-600 dark:text-emerald-400 font-black underline underline-offset-8 decoration-2' : 'hover:opacity-100 hover:text-emerald-600 dark:hover:text-emerald-400'} transition-all duration-300`}>Gallery</Link>
          <Link to="/community" className={`${isActive('/community') ? 'opacity-100 text-emerald-600 dark:text-emerald-400 font-black underline underline-offset-8 decoration-2' : 'hover:opacity-100 hover:text-emerald-600 dark:hover:text-emerald-400'} transition-all duration-300`}>Community</Link>
          <Link to="/guide" className={`${isActive('/guide') ? 'opacity-100 text-emerald-600 dark:text-emerald-400 font-black underline underline-offset-8 decoration-2' : 'hover:opacity-100 hover:text-emerald-600 dark:hover:text-emerald-400'} transition-all duration-300`}>Guide</Link>
        </div>

        <button 
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <motion.span 
            animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 7 : 0 }}
            className="w-6 h-0.5 bg-emerald-900 dark:bg-emerald-100 rounded-full"
          />
          <motion.span 
            animate={{ opacity: isMenuOpen ? 0 : 1 }}
            className="w-6 h-0.5 bg-emerald-900 dark:bg-emerald-100 rounded-full"
          />
          <motion.span 
            animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -7 : 0 }}
            className="w-6 h-0.5 bg-emerald-900 dark:bg-emerald-100 rounded-full"
          />
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#F8FAF9] dark:bg-[#0F1A14] z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase text-emerald-600 dark:text-emerald-400">Home</Link>
            <Link to="/gallery" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase text-emerald-900/40 dark:text-emerald-100/40">Gallery</Link>
            <Link to="/community" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase text-emerald-900/40 dark:text-emerald-100/40">Community</Link>
            <Link to="/guide" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black uppercase text-emerald-900/40 dark:text-emerald-100/40">Guide</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Gallery() {
  const [search, setSearch] = useState("");
  const plants = [
    { name: "Rose", scientific: "Rosa (Gulab)", urdu: "Gulab", desc: "The universal symbol of love. Widely grown in Pakistan for its beauty and used to make rose water.", image: "/regenerated_image_1777709860999.png", tag: "Fragrant" },
    { name: "Sunflower", scientific: "Helianthus (Surajmukhi)", urdu: "Surajmukhi", desc: "Radiant yellow flowers that follow the sun. Essential for honey production and oil extraction.", image: "/regenerated_image_1777709856527.png", tag: "Sun-Seeker" },
    { name: "Neem", scientific: "Azadirachta indica", urdu: "Neem", desc: "The 'Village Pharmacy'. Famous for cooling properties, skin health, and natural pest control.", image: "/regenerated_image_1777709865758.png", tag: "Guardian" },
    { name: "Jasmine", scientific: "Jasminum (Chambeli)", urdu: "Chambeli", desc: "The national flower of Pakistan. Known for its heavenly scent that fills the night air.", image: "/regenerated_image_1777709871471.png", tag: "National Emblem" },
    { name: "Money Plant", scientific: "Epipremnum aureum", urdu: "Money Plant", desc: "Believed to bring good luck and remarkably easy to propagate in water.", image: "/regenerated_image_1777709876332.png", tag: "Prosperity" },
    { name: "Aloe Vera", scientific: "Aloe barbadensis (Gawar Patha)", urdu: "Gawar Patha", desc: "The cooling healer. Used extensively for skin care, digestion, and as a durable outdoor plant.", image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=1200&auto=format&fit=crop", tag: "Medicinal" }
  ];

  const filtered = plants.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.scientific.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="px-6 md:px-12 pb-24">
      <header className="pt-8 pb-12">
        <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase mb-6 dark:text-white">
          Botanical<br/><span className="text-emerald-600 dark:text-emerald-400">Gallery</span>
        </h1>
        <div className="max-w-2xl mt-8 relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search size={20} className="text-emerald-600 opacity-40 group-focus-within:opacity-100 transition-opacity" />
          </div>
          <input 
            type="text" 
            placeholder="Search botanical archive..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-[28px] py-5 pl-16 pr-8 text-sm font-bold uppercase tracking-widest outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:shadow-2xl focus:shadow-emerald-900/10 transition-all dark:text-white"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((plant, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-xl shadow-emerald-900/5 group border border-emerald-50 dark:border-slate-800 transition-all duration-300"
          >
            <div className="h-64 p-3 bg-emerald-50/30 dark:bg-emerald-900/10 overflow-hidden relative">
              <img src={plant.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl" alt={plant.name} />
              <div className="absolute top-6 right-6 bg-white/95 dark:bg-slate-800/95 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 shadow-sm">{plant.tag}</div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-black uppercase mb-1 dark:text-white">{plant.name}</h3>
              <p className="text-emerald-600 dark:text-emerald-400 italic font-serif text-lg mb-4">{plant.scientific}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{plant.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Community() {
  const [posts, setPosts] = useState([
    { id: 1, user: "John Doe", role: "Botanist", time: "2 hours ago", content: "Just used Flora.ai to identify a rare mushroom in my backyard. The neural link is incredibly accurate!", initials: "JD", color: "bg-emerald-600", likes: 128 },
    { id: 2, user: "Sarah Adams", role: "Plant Lover", time: "5 hours ago", content: "Looking for advice on my Monstera. The leaves are turning a bit yellow at the edges. Any tips?", initials: "SA", color: "bg-slate-800", likes: 42 }
  ]);
  const [newPost, setNewPost] = useState("");

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      user: "Botanical Explorer",
      role: "Community Member",
      time: "Just now",
      content: newPost,
      initials: "BE",
      color: "bg-indigo-600",
      likes: 0
    };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  return (
    <div className="px-6 md:px-12 pb-24">
      <header className="pt-8 pb-12">
        <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase mb-4 dark:text-white">
          Flora<br/><span className="text-emerald-600 dark:text-emerald-400">Connect</span>
        </h1>
        <p className="max-w-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          Join the global network of botanical enthusiasts. Share your specimens, ask for advice, and contribute to the hive mind.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-xl shadow-emerald-900/5 border border-emerald-50 dark:border-slate-800 sticky top-12">
            <h3 className="text-xl font-black uppercase mb-6 tracking-tight dark:text-white">Share a Specimen</h3>
            <textarea 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full h-40 p-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-[24px] focus:border-emerald-600 outline-none transition-colors text-sm font-medium resize-none dark:text-white" 
              placeholder="Identify something today? Share your thoughts..."
            ></textarea>
            <div className="mt-6 flex gap-4">
              <button 
                onClick={handlePost}
                className="flex-1 py-4 bg-[#1A2E22] dark:bg-emerald-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-950 dark:hover:bg-emerald-500 transition-all font-mono"
              >
                Post Update
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-xl shadow-emerald-900/5 border border-emerald-50 dark:border-slate-800"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 ${post.color} rounded-full border-4 border-white/10 flex items-center justify-center text-white font-bold`}>{post.initials}</div>
                  <div>
                    <h4 className="font-bold text-sm uppercase dark:text-white">{post.user}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{post.role} • {post.time}</p>
                  </div>
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-bold italic font-serif mb-6">"{post.content}"</p>
                <div className="flex gap-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                  <button className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <Heart size={16} /> {post.likes}
                  </button>
                  <button className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <MessageSquare size={16} /> 0
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function Guide() {
  return (
    <div className="px-6 md:px-12 pb-24">
      <header className="pt-8 pb-12">
        <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase mb-4 dark:text-white">
          User<br/><span className="text-emerald-600 dark:text-emerald-400">Protocol</span>
        </h1>
        <p className="max-w-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          Master the art of biological identification. Follow these steps to ensure 99.9% accuracy in your botanical scrying.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-16">
          {[
            { num: "01", title: "Acquire Specimen", desc: "Take a clear, high-resolution photo of the plant. Ensure leaves or flowers are in sharp focus." },
            { num: "02", title: "Upload Data", desc: "Drag your image onto the interface or use manual select to interface with our neural net." },
            { num: "03", title: "Scry Results", desc: "Wait for AI to sequence the data. Review the taxonomic record and care instructions provided." }
          ].map((step, i) => (
            <div key={i} className="flex gap-8">
              <div className="flex-shrink-0 w-16 h-16 bg-[#1A2E22] dark:bg-emerald-600 text-white flex items-center justify-center rounded-[24px] text-3xl font-black uppercase italic shadow-lg">{step.num}</div>
              <div>
                <h3 className="text-2xl font-black uppercase mb-3 dark:text-white">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-emerald-600 rounded-[48px] p-12 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-emerald-900/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <h3 className="text-3xl md:text-5xl font-black uppercase leading-none mb-8 relative z-10 italic">Pro Tips<br/><span className="text-emerald-200">for Experts</span></h3>
          <ul className="space-y-6 relative z-10">
            {["Avoid blurry or dark images for optimal processing.", "Focus on unique characteristics like vein patterns.", "Check 'Risks' section before handling unknown fauna."].map((tip, i) => (
              <li key={i} className="flex items-start gap-4">
                <CheckCircle2 size={24} className="text-emerald-200 shrink-0" />
                <p className="font-bold tracking-tight">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

function HomePage({ 
  preview, isScanning, result, userNotes, setUserNotes, error, isDragging,
  handleFileChange, onDragOver, onDragLeave, onDrop, identifyPlant, reset, reportRef,
  downloadPDF, addToGarden, garden, removeFromGarden, setSelectedGardenPlant
}: any) {
  return (
    <>
      <header className="px-6 md:px-12 pt-4 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-5xl font-black leading-[1.0] tracking-tighter uppercase mb-4 dark:text-white">
            Identify<br/><span className="text-emerald-600 dark:text-emerald-400">Nature</span> Instantly
          </h1>
          <p className="text-base md:text-lg font-serif italic text-emerald-800/80 dark:text-emerald-100/70">
            Professional-grade biological scrying decoded in real-time.
          </p>
        </motion.div>
      </header>

      <main className="flex-1 px-6 md:px-12 pb-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        <section className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <div 
            onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            className={`flex-1 bg-white dark:bg-slate-900/50 border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden transition-all duration-300 ${
              isDragging ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 scale-[1.02]' : 'border-emerald-200 dark:border-slate-800'
            }`}
          >
            {!preview ? (
              <>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${isDragging ? 'bg-emerald-600 text-white' : 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'}`}>
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-base font-bold mb-1 dark:text-white">Drag & Drop Specimen</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-4 font-medium uppercase tracking-widest">PNG, JPG up to 10MB</p>
                <label className="px-6 py-2.5 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-700 dark:hover:bg-emerald-400 transition-all cursor-pointer shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/40">
                  Select File
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </>
            ) : (
              <div className="w-full h-full relative group flex items-center justify-center">
                <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain rounded-2xl shadow-inner bg-slate-50 dark:bg-slate-800" referrerPolicy="no-referrer" />
                {!isScanning && (
                  <button onClick={reset} className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 p-3 rounded-full text-red-500 hover:bg-white dark:hover:bg-slate-700 hover:scale-110 transition-all shadow-lg z-10">
                    <AlertCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          <button 
            onClick={identifyPlant} disabled={!preview || isScanning}
            className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all ${
              !preview || isScanning ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed' : 'bg-[#1A2E22] dark:bg-emerald-600 text-white hover:bg-emerald-950 dark:hover:bg-emerald-500 active:scale-[0.98] shadow-xl shadow-emerald-900/10'
            }`}
          >
            <span>Identify Plant</span>
            {isScanning && <Loader2 className="h-5 w-5 animate-spin opacity-60" />}
          </button>
          {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
        </section>

        <section ref={reportRef} className="col-span-1 md:col-span-8 bg-white dark:bg-slate-900 rounded-[40px] shadow-xl shadow-emerald-900/5 p-6 md:p-8 flex flex-col overflow-hidden border border-emerald-50 dark:border-slate-800 min-h-[400px]">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                  <div className="relative">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-[0.2em] rounded-full">Phase 1: Verification</span>
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[8px] font-black uppercase tracking-widest ${result.confidenceLevel === 'High' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                        Confidence: {result.confidenceLevel}
                      </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-sans font-black uppercase leading-none tracking-tight mb-2 dark:text-white">{result.name}</h2>
                    <div className="flex flex-wrap items-center gap-x-3 mb-4">
                      <p className="text-emerald-600 dark:text-emerald-400 font-serif italic text-xl">{result.scientificName}</p>
                      <span className="text-slate-300">/</span>
                      <p className="text-lg font-mono font-bold bg-[#1A2E22] text-white px-3 py-0.5 rounded-lg border-2 border-cyan-400/50">{result.urduName}</p>
                    </div>
                    <div className="max-w-2xl relative mb-8">
                      <div className="absolute -left-6 top-1 bottom-1 w-1.5 bg-emerald-500 rounded-full dark:opacity-50" />
                      <p className="text-2xl md:text-3xl text-emerald-950 dark:text-emerald-50 leading-tight font-serif italic tracking-tight pl-4">
                        {result.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 min-w-[200px]">
                    <div className={`p-5 rounded-[32px] border-2 transition-all duration-500 shadow-xl ${result.healthStatus === 'Healthy' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-100' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-800 dark:text-red-100'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${result.healthStatus === 'Healthy' ? 'bg-emerald-500' : 'bg-red-500'} text-white shadow-lg`}><Activity size={20} /></div>
                        <div>
                          <h4 className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Status</h4>
                          <p className="text-xl font-black uppercase tracking-tight leading-none">{result.healthStatus}</p>
                        </div>
                      </div>
                      {result.healthIssues?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-red-200/30 dark:border-red-800/30">
                          <p className="text-[8px] font-black uppercase tracking-widest text-red-500 mb-1">Detected Issues</p>
                          <ul className="space-y-1">
                            {result.healthIssues.map((issue, idx) => (
                              <li key={idx} className="text-[10px] font-bold">• {issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="p-5 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg"><Heart size={20} /></div>
                        <div>
                          <h4 className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Edibility</h4>
                          <p className="text-xs font-bold leading-tight dark:text-white">{result.isEdible}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  <div className="space-y-8">
                    <div className="bg-slate-50/80 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2"><Zap size={14} className="text-amber-500" /> Protocol</h4>
                      <div className="space-y-3">
                        {result.suggestions?.map((sug: string, i: number) => (
                          <div key={i} className="flex items-start gap-3 group">
                            <span className="w-5 h-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400 dark:text-slate-500 group-hover:border-amber-400 group-hover:text-amber-600 transition-colors shrink-0">0{i+1}</span>
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-snug">{sug}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="bg-emerald-50/30 dark:bg-emerald-900/10 p-6 rounded-[32px] border border-emerald-100/50 dark:border-emerald-800/50">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /> Bio-Active</h4>
                      <div className="space-y-4">
                        {result.benefits?.map((b: string, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-6 bg-emerald-400 rounded-full shrink-0" />
                            <p className="text-xs font-bold text-emerald-900 dark:text-emerald-100 leading-tight">{b}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-[32px] border border-red-100 dark:border-red-900/30">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400 mb-3 flex items-center gap-2"><AlertCircle size={14} /> Risks</h4>
                      <div className="space-y-2">
                        {result.risks?.map((r: string, i: number) => (
                          <p key={i} className="text-[10px] font-black text-red-800 dark:text-red-200 leading-tight uppercase tracking-tight">⚠️ {r}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-6">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2"><Plus size={12}/> Personal Observations</h4>
                    <textarea 
                      value={userNotes} onChange={(e) => setUserNotes(e.target.value)}
                      placeholder="Add your own notes, location info, or care reminders here..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 text-sm font-medium focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all min-h-[120px] dark:text-white"
                    />
                  </div>
                  <div className="flex gap-3 print:hidden">
                    <button onClick={downloadPDF} className="flex-1 py-4 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 dark:text-emerald-400"><Download size={14} /> Download PDF</button>
                    <button onClick={addToGarden} className="flex-1 py-4 bg-[#1A2E22] dark:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 group shadow-xl"><Plus size={14} /> Archive</button>
                  </div>
                </div>
              </motion.div>
            ) : isScanning ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-xl font-black uppercase dark:text-white">Sequencing Biological Data</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-10 grayscale">
                <Leaf size={64} className="text-emerald-900" />
                <p className="text-sm font-bold uppercase tracking-[0.2em]">Waiting for specimen</p>
              </div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <section className="px-6 md:px-12 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1A2E22] dark:bg-emerald-600 text-white rounded-xl flex items-center justify-center"><ShieldCheck size={20} /></div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Personal Garden</h3>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Biological Archive</p>
            </div>
          </div>
        </div>
        {garden.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/50 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[40px] p-20 flex flex-col items-center justify-center text-center opacity-40">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Archive is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence initial={false}>
              {garden.map((plant: any) => (
                <motion.div key={plant.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={() => setSelectedGardenPlant(plant)} className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group hover:shadow-xl transition-all duration-500 cursor-pointer relative">
                  <div className="h-48 relative overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <img src={plant.image} alt={plant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <button onClick={(e) => { e.stopPropagation(); removeFromGarden(plant.id); }} className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-slate-800/90 rounded-full flex items-center justify-center text-red-500 shadow-lg translate-y-[-20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all z-10"><Trash2 size={16} /></button>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-mono font-black uppercase mb-0.5 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors dark:text-white">{plant.name}</h4>
                    <p className="text-xs font-serif italic text-emerald-600 dark:text-emerald-400 mb-2">{plant.scientificName}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-4 line-clamp-2">{plant.description}</p>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 group-hover:border-emerald-200 dark:group-hover:border-emerald-900 transition-colors relative overflow-hidden">
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-bold italic line-clamp-3">"{plant.notes}"</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </>
  );
}

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<PlantResult | null>(null);
  const [userNotes, setUserNotes] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flora_dark_mode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const reportRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [garden, setGarden] = useState<GardenPlant[]>(() => {
    const saved = localStorage.getItem('flora_personal_garden');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedGardenPlant, setSelectedGardenPlant] = useState<GardenPlant | null>(null);

  useEffect(() => { localStorage.setItem('flora_personal_garden', JSON.stringify(garden)); }, [garden]);
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
      localStorage.setItem('flora_dark_mode', JSON.stringify(darkMode));
    } catch (e) {
      console.error("Neural link state sync failed:", e);
    }
  }, [darkMode]);

  const addToGarden = async () => {
    if (!result || !file) return;
    
    try {
      const reader = new FileReader();
      const base64String = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const newEntry: GardenPlant = {
        ...result, id: crypto.randomUUID(), image: base64String, date: new Date().toLocaleDateString(),
        notes: userNotes || `Identified with ${result.confidenceLevel} confidence.`
      };
      setGarden(prev => [newEntry, ...prev]);
      setUserNotes("");
    } catch (err) {
      console.error("Failed to archive specimen:", err);
      setError("Failed to archive specimen. Image might be too large.");
    }
  };

  const removeFromGarden = (id: string) => setGarden(prev => prev.filter(p => p.id !== id));
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => processFile(e.target.files?.[0]);
  const onDragOver = (e: DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: DragEvent) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files?.[0]); };

  const processFile = (selectedFile: File | undefined) => {
    if (selectedFile?.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    } else if (selectedFile) {
      setError("Invalid specimen type. Please upload an image.");
    }
  };

  const identifyPlant = useCallback(async () => {
    if (!file) return setError("Please select an image specimen first.");
    setIsScanning(true); setResult(null); setError(null);
    try {
      // AI analysis is disabled in this version.
      // Returning a placeholder result to maintain UI structure.
      const mockResult: PlantResult = {
        name: "Feature Disabled",
        scientificName: "Deployment v1.0 (No-AI)",
        urduName: "سسٹم آف",
        description: "AI plant identification has been deactivated for this specific deployment.",
        benefits: ["Safe Deployment", "Lower Resource Usage", "Privacy Focused"],
        risks: ["No real-time data"],
        uses: ["Gallery View", "Community Chat", "Manual Garden Management"],
        localInfo: ["Local database only"],
        care: ["N/A"],
        healthStatus: "Healthy",
        healthIssues: [],
        suggestions: ["Manual entry enabled"],
        isEdible: "Identification Offline",
        confidenceLevel: "High",
        confidenceReason: "System default response.",
        similarPlants: [],
        communityReviews: []
      };
      
      setResult(mockResult);
    } catch (err: any) { 
      console.error("Analysis Error:", err);
      setError("Identification service is currently offline."); 
    }
    finally { setIsScanning(false); }
  }, [file]);

  const reset = () => { setFile(null); setPreview(null); setResult(null); setUserNotes(""); setError(null); };

  const downloadPDF = async () => {
    if (!reportRef.current || !result) return;
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: darkMode ? '#0F1A14' : '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Flora_Report_${result.name}.pdf`);
    } catch (err) { setError("PDF export failed."); }
  };

  return (
    <BrowserRouter>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-[#F8FAF9] dark:bg-[#0F1A14] text-[#1A2E22] dark:text-emerald-50 flex flex-col font-sans relative overflow-x-hidden transition-colors duration-500`}>
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[1000] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        {darkMode && <div className="scanline" />}
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} reset={reset} />
        <Routes>
          <Route path="/" element={<HomePage preview={preview} isScanning={isScanning} result={result} userNotes={userNotes} setUserNotes={setUserNotes} error={error} isDragging={isDragging} handleFileChange={handleFileChange} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} identifyPlant={identifyPlant} reset={reset} reportRef={reportRef} downloadPDF={downloadPDF} addToGarden={addToGarden} garden={garden} removeFromGarden={removeFromGarden} setSelectedGardenPlant={setSelectedGardenPlant} />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/community" element={<Community />} />
          <Route path="/guide" element={<Guide />} />
        </Routes>

        <AnimatePresence>
          {selectedGardenPlant && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-emerald-950/90 backdrop-blur-xl"
              onClick={() => setSelectedGardenPlant(null)}
            >
              <div id="root:nth-of-type(1) > div:nth-of-type(1) > section:nth-of-type(1) > div:nth-of-type(2)" />
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[48px] overflow-hidden shadow-2xl flex flex-col md:flex-row relative border-4 border-emerald-500/20"
              >
                <div className="md:w-1/2 h-64 md:h-auto relative">
                  <img src={selectedGardenPlant.image} className="w-full h-full object-cover" alt={selectedGardenPlant.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
                  <div className="absolute bottom-8 left-8">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2 glitch-text" data-text={selectedGardenPlant.name}>{selectedGardenPlant.name}</h2>
                    <p className="text-emerald-300 font-serif italic text-xl">{selectedGardenPlant.scientificName}</p>
                  </div>
                </div>
                <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
                  <button onClick={() => setSelectedGardenPlant(null)} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors">
                    <AlertCircle className="rotate-45" />
                  </button>
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4 flex items-center gap-2"><Info size={14} /> Specimen Protocol</h4>
                      <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic border-l-4 border-emerald-500 pl-4">{selectedGardenPlant.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800">
                        <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600 mb-1">Date Acquired</p>
                        <p className="text-sm font-mono font-bold dark:text-white">{selectedGardenPlant.date}</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                        <p className="text-sm font-black uppercase dark:text-white">{selectedGardenPlant.healthStatus}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-3xl border border-amber-100 dark:border-amber-800">
                        <p className="text-[8px] font-black uppercase tracking-widest text-amber-600 mb-1">Edibility Status</p>
                        <p className="text-[10px] font-bold dark:text-white leading-tight">{selectedGardenPlant.isEdible}</p>
                      </div>
                      {selectedGardenPlant.healthIssues?.length > 0 && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-100 dark:border-red-800">
                          <p className="text-[8px] font-black uppercase tracking-widest text-red-500 mb-1">Health Issues Detected</p>
                          <ul className="text-[10px] font-bold dark:text-white list-disc pl-3">
                            {selectedGardenPlant.healthIssues.map((issue, idx) => <li key={idx}>{issue}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">Neural Impressions</h4>
                      <div className="p-6 bg-slate-900 text-cyan-400 rounded-3xl font-mono text-xs border border-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                        <span className="opacity-50 inline-block mb-2">ARCHIVE_LOG_#{selectedGardenPlant.id.slice(0,8)}</span><br/>
                        "{selectedGardenPlant.notes}"
                      </div>
                    </div>
                    <div className="pt-4">
                      <button onClick={() => { downloadPDF(); setSelectedGardenPlant(null); }} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20">
                        <Download size={16} /> Export Tactical Data
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <footer className="px-6 md:px-12 py-6 border-t border-emerald-100 dark:border-slate-800 flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-900/40 dark:text-emerald-100/30 mt-auto">
          <span>AI Engine v2.4 (Core ML)</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}
