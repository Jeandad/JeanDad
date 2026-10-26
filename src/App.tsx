import React, { useState, useEffect } from 'react';
import { 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ShieldCheck, 
  Crosshair, 
  TrendingUp, 
  Brain, 
  FileText, 
  ExternalLink, 
  GraduationCap, 
  ShieldAlert, 
  Send, 
  Menu, 
  X, 
  PlusCircle, 
  Sparkles, 
  Lock, 
  Award, 
  BarChart3, 
  MessageCircle, 
  Mail, 
  Zap,
  ChevronLeft,
  ChevronRight,
  Star,
  HelpCircle,
  Download,
  AlertTriangle,
  Users,
  Check,
  FileSpreadsheet,
  FileCode2,
  BookOpen,
  Share2,
  Sun,
  Moon,
  Crown,
  Phone,
  UserCheck,
  LogOut,
  Eye,
  EyeOff,
  KeyRound,
  Unlock
} from 'lucide-react';

const LOGO_SRC = "/assets/aistudio/file_00000000c5d481f49e43268fba3d6316_ad0842a5.png";
const WELTRADE_AFFILIATE_URL = "https://track.gowt.me/visit/?bta=37235&brand=weltrade";
const MAKETOU_VIP_URL = "https://jeandadstore.mymaketou.shop/fr/products/gof-trade-academy-programme-vip/checkout";
const ADMIN_DEFAULT_PASSWORD = "GofAdmin2026!";

interface Lesson {
  id: number;
  title: string;
  level: string;
  videoUrl: string;
  description: string;
  duration?: string;
}

interface WeltradeRequest {
  id: number;
  date: string;
  fullname: string;
  email: string;
  weltradeId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'info' | 'error';
}

interface Testimonial {
  id: number;
  name: string;
  city: string;
  country: string;
  role: string;
  result: string;
  badge: string;
  stars: number;
  quote: string;
}

interface VipWaitlistRequest {
  id: number;
  date: string;
  fullname: string;
  email: string;
  whatsapp: string;
  experience: string;
  message?: string;
  status: 'Pending' | 'Contacted' | 'Enrolled';
}

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'about' | 'courses-catalog' | 'student-portal' | 'admin' | 'contact'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || path.endsWith('/admin') || path === '/admin') {
        return 'admin';
      }
      if (hash === '#vip-access' || hash.includes('vip-access')) {
        return 'student-portal';
      }
    }
    return 'home';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'validations' | 'vip-waitlist' | 'add-course'>('validations');

  // URL Hash & Path Listener for Admin Access (/admin) and VIP Payment Return (#vip-access)
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || path.endsWith('/admin') || path === '/admin') {
        setActivePage('admin');
      } else if (hash === '#vip-access' || hash.includes('vip-access')) {
        localStorage.setItem('gof_is_vip', 'true');
        setIsVipUnlocked(true);
        setShowVipCelebrationModal(true);
        setActivePage('student-portal');
        showToast('🎉 Paiement Maketou validé ! Accès Élève VIP activé.', 'success');
      }
    };

    // Run once on mount in case already loaded on #vip-access
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#vip-access' || hash.includes('vip-access')) {
        localStorage.setItem('gof_is_vip', 'true');
        setIsVipUnlocked(true);
        setShowVipCelebrationModal(true);
      }
    }

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);
  
  // Theme State (Default Dark Mode)
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('gof_theme');
    return saved ? saved === 'dark' : true;
  });

  // Sync Theme to HTML root and LocalStorage
  useEffect(() => {
    localStorage.setItem('gof_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Lessons State
  const defaultLessons: Lesson[] = [
    {
      id: 1,
      title: "1. Introduction au Forex & Comprendre le Marché",
      level: "Débutant",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Dans cette leçon d'introduction, découvrez ce qu'est le marché des devises (Forex), comment fonctionnent les paires et la structure de base des prix.",
      duration: "24 min"
    },
    {
      id: 2,
      title: "2. Les Piliers de la Flash Entry Strategy",
      level: "Débutant",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Apprenez les 3 règles d'or indispensables pour repérer une configuration Flash Entry parfaite sur vos graphiques sans hésitation.",
      duration: "38 min"
    },
    {
      id: 3,
      title: "3. Money Management & Protection du Capital",
      level: "Débutant",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Comment calculer correctement la taille de votre lot et risquer seulement 1% à 2% par position pour garantir une rentabilité long terme.",
      duration: "31 min"
    }
  ];

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('gof_lessons');
    return saved ? JSON.parse(saved) : defaultLessons;
  });

  const [activeLessonId, setActiveLessonId] = useState<number>(() => {
    return lessons[0]?.id || 1;
  });

  // Completed Lessons State
  const [completedLessons, setCompletedLessons] = useState<number[]>(() => {
    const saved = localStorage.getItem('gof_completed_lessons');
    return saved ? JSON.parse(saved) : [1];
  });

  // Weltrade Requests State
  const defaultRequests: WeltradeRequest[] = [
    {
      id: 1,
      date: "23 Oct 2026",
      fullname: "Koffi Mensah",
      email: "koffi.mensah@gmail.com",
      weltradeId: "7821945",
      status: "Pending"
    },
    {
      id: 2,
      date: "22 Oct 2026",
      fullname: "Amina Diallo",
      email: "amina.d@yahoo.fr",
      weltradeId: "9012384",
      status: "Approved"
    }
  ];

  const [weltradeRequests, setWeltradeRequests] = useState<WeltradeRequest[]>(() => {
    const saved = localStorage.getItem('gof_weltrade_requests');
    return saved ? JSON.parse(saved) : defaultRequests;
  });

  // Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Weltrade Form State
  const [weltradeForm, setWeltradeForm] = useState({
    fullname: '',
    email: '',
    weltradeId: ''
  });

  // Modals & VIP Waitlist State
  const [showIdHelpModal, setShowIdHelpModal] = useState(false);
  const [submittedWeltradeData, setSubmittedWeltradeData] = useState<WeltradeRequest | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [legalModal, setLegalModal] = useState<'mentions' | 'privacy' | null>(null);

  // VIP & Weltrade Course Access States
  const [isVipUnlocked, setIsVipUnlocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#vip-access' || hash.includes('vip-access')) {
        localStorage.setItem('gof_is_vip', 'true');
        return true;
      }
      return localStorage.getItem('gof_is_vip') === 'true';
    }
    return false;
  });

  const [isWeltradeUnlocked, setIsWeltradeUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('gof_weltrade_unlocked') === 'true';
  });

  const [showCourseAccessModal, setShowCourseAccessModal] = useState<boolean>(false);
  const [showVipCelebrationModal, setShowVipCelebrationModal] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      return hash === '#vip-access' || hash.includes('vip-access');
    }
    return false;
  });

  const hasCourseAccess = isVipUnlocked || isWeltradeUnlocked;
  const isLessonLocked = (lessonId: number) => !hasCourseAccess && lessonId !== 1;

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('gof_admin_auth') === 'true';
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState<string | null>(null);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const defaultVipWaitlist: VipWaitlistRequest[] = [
    {
      id: 1,
      date: "25 Oct 2026",
      fullname: "Serge Kouassi",
      email: "serge.k@gmail.com",
      whatsapp: "+225 07 48 92 11 34",
      experience: "Intermédiaire (6 mois - 1 an)",
      message: "Je souhaite me préparer pour un challenge Prop Firm de 100k$ et profiter des signaux VIP.",
      status: "Pending"
    },
    {
      id: 2,
      date: "24 Oct 2026",
      fullname: "Yasmine Belkacem",
      email: "yasmine.b@gmail.com",
      whatsapp: "+212 6 61 45 89 20",
      experience: "Débutant avancé",
      message: "Très intéressée par les live streams hebdomadaires et le mentorat individuel.",
      status: "Contacted"
    }
  ];

  const [vipWaitlist, setVipWaitlist] = useState<VipWaitlistRequest[]>(() => {
    const saved = localStorage.getItem('gof_vip_waitlist');
    return saved ? JSON.parse(saved) : defaultVipWaitlist;
  });

  const [vipForm, setVipForm] = useState({
    fullname: '',
    email: '',
    whatsapp: '',
    experience: 'Intermédiaire (Moins d\'un an)',
    message: ''
  });

  // Testimonials Carousel State
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Moussa Traoré",
      city: "Abidjan",
      country: "Côte d'Ivoire",
      role: "Élève Promotion 2026",
      result: "+14.8% en 4 semaines",
      badge: "Compte Réel Rentable",
      stars: 5,
      quote: "J'ai commencé sans aucune notion des marchés. En 3 semaines avec la Flash Entry, j'ai enfin compris où placer mon Stop Loss sans me faire liquider. Mon compte Weltrade est en positif pour le tout premier mois depuis que je trade !"
    },
    {
      id: 2,
      name: "Sarah Benali",
      city: "Casablanca",
      country: "Maroc",
      role: "Trader Indépendante",
      result: "Setup XAU/USD +320 pips",
      badge: "Spécialiste Or",
      stars: 5,
      quote: "La méthode est d'une clarté chirurgicale. Fini les graphiques pollués avec 10 indicateurs contradictoires. Rien que le chapitre sur les empreintes institutionnelles a divisé mes pertes par 4. L'équipe a validé mon ID Weltrade en 30 minutes !"
    },
    {
      id: 3,
      name: "Kouamé Eric",
      city: "Dakar",
      country: "Sénégal",
      role: "Candidat Prop Firm",
      result: "Phase 1 Validée (50k$)",
      badge: "Succès Challenge",
      stars: 5,
      quote: "Avoir accès gratuitement à une formation de ce calibre simplement grâce au compte Weltrade, c'est du jamais vu. La rigueur du money management m'a permis de passer mon tout premier test de financement sans stress."
    },
    {
      id: 4,
      name: "David N'Goran",
      city: "Douala",
      country: "Cameroun",
      role: "Débutant Reconverti",
      result: "Ratio R:R 1:5 régulier",
      badge: "Discipline 100%",
      stars: 5,
      quote: "Avant GOF Trade, j'achetais quand il fallait vendre par peur de rater le train (FOMO). La checklist en 3 critères m'a sauvé. Maintenant j'attends patiemment les déclenchements précis, et mes gains dépassent enfin mes pertes."
    },
    {
      id: 5,
      name: "Aïssatou Diallo",
      city: "Lomé",
      country: "Togo",
      role: "Membre Communauté VIP",
      result: "+24 trades gagnants",
      badge: "Assiduité Exemplaire",
      stars: 5,
      quote: "La leçon 3 sur la protection du capital devrait être obligatoire pour tous les traders en Afrique. Un immense merci aux formateurs de GOF Trade pour leur disponibilité sur WhatsApp et Telegram !"
    }
  ];

  // Add Course Form State
  const [newCourse, setNewCourse] = useState({
    title: '',
    level: 'Débutant',
    videoUrl: '',
    description: ''
  });

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    fullname: '',
    email: '',
    message: ''
  });

  // Filter for requests
  const [requestFilter, setRequestFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('gof_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('gof_weltrade_requests', JSON.stringify(weltradeRequests));
  }, [weltradeRequests]);

  useEffect(() => {
    localStorage.setItem('gof_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('gof_vip_waitlist', JSON.stringify(vipWaitlist));
  }, [vipWaitlist]);

  const handleVipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipForm.fullname || !vipForm.email || !vipForm.whatsapp) return;

    const newVip: VipWaitlistRequest = {
      id: Date.now(),
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      fullname: vipForm.fullname.trim(),
      email: vipForm.email.trim(),
      whatsapp: vipForm.whatsapp.trim(),
      experience: vipForm.experience,
      message: vipForm.message.trim(),
      status: 'Pending'
    };

    setVipWaitlist(prev => [newVip, ...prev]);
    setShowVipModal(false);
    setVipForm({
      fullname: '',
      email: '',
      whatsapp: '',
      experience: 'Intermédiaire (Moins d\'un an)',
      message: ''
    });
    showToast('🎉 Votre candidature pour la Masterclass Flash Entry Pro & Mentorat VIP a été enregistrée avec succès !', 'success');
  };

  const handleVipStatusChange = (id: number, status: 'Pending' | 'Contacted' | 'Enrolled') => {
    setVipWaitlist(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    showToast(`Candidature #${id} mise à jour: ${status}`, 'info');
  };

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleNavigate = (page: typeof activePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page !== 'admin' && typeof window !== 'undefined') {
      if (window.location.hash === '#admin') {
        window.history.replaceState(null, '', window.location.pathname);
      } else if (window.location.pathname.endsWith('/admin')) {
        window.history.replaceState(null, '', '/');
      }
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPasswordInput.trim()) {
      setAdminPasswordError('Veuillez saisir le mot de passe administrateur.');
      return;
    }
    if (adminPasswordInput.trim() === ADMIN_DEFAULT_PASSWORD) {
      sessionStorage.setItem('gof_admin_auth', 'true');
      setIsAdminAuthenticated(true);
      setShowAdminLoginModal(false);
      setAdminPasswordInput('');
      setAdminPasswordError(null);
      setActivePage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Accès Administrateur débloqué avec succès.', 'success');
    } else {
      setAdminPasswordError('Mot de passe administrateur incorrect. Veuillez vérifier la saisie.');
      showToast('Mot de passe administrateur erroné.', 'error');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('gof_admin_auth');
    setIsAdminAuthenticated(false);
    setShowAdminLoginModal(false);
    setAdminPasswordInput('');
    setAdminPasswordError(null);
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#admin') {
        window.history.replaceState(null, '', window.location.pathname);
      } else if (window.location.pathname.endsWith('/admin')) {
        window.history.replaceState(null, '', '/');
      }
    }
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Session administrateur fermée.', 'info');
  };

  const handleExitAdmin = () => {
    setAdminPasswordError(null);
    setAdminPasswordInput('');
    setShowAdminLoginModal(false);
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#admin') {
        window.history.replaceState(null, '', window.location.pathname);
      } else if (window.location.pathname.endsWith('/admin')) {
        window.history.replaceState(null, '', '/');
      }
    }
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToWeltrade = () => {
    if (activePage !== 'home') {
      setActivePage('home');
    }
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById('weltrade-step-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  const handleWeltradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weltradeForm.fullname || !weltradeForm.email || !weltradeForm.weltradeId) return;

    const newReq: WeltradeRequest = {
      id: Date.now(),
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      fullname: weltradeForm.fullname.trim(),
      email: weltradeForm.email.trim(),
      weltradeId: weltradeForm.weltradeId.trim(),
      status: 'Pending'
    };

    setWeltradeRequests(prev => [newReq, ...prev]);
    setSubmittedWeltradeData(newReq);
    setShowSuccessModal(true);
    setWeltradeForm({ fullname: '', email: '', weltradeId: '' });
    showToast('Votre ID Weltrade a été enregistré avec succès !', 'success');
  };

  const handleStatusChange = (id: number, status: 'Approved' | 'Rejected') => {
    setWeltradeRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    showToast(`Demande #${id} mise à jour: ${status === 'Approved' ? 'Validée' : 'Refusée'}`, 'info');
  };

  const toggleLessonCompleted = (lessonId: number) => {
    setCompletedLessons(prev => {
      const exists = prev.includes(lessonId);
      const updated = exists ? prev.filter(id => id !== lessonId) : [...prev, lessonId];
      showToast(exists ? 'Leçon marquée comme non terminée' : '✓ Leçon marquée comme terminée !', exists ? 'info' : 'success');
      return updated;
    });
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.videoUrl) return;

    let processedUrl = newCourse.videoUrl.trim();
    if (processedUrl.includes('youtube.com/watch?v=')) {
      const vid = processedUrl.split('v=')[1]?.split('&')[0];
      processedUrl = `https://www.youtube.com/embed/${vid}`;
    } else if (processedUrl.includes('youtu.be/')) {
      const vid = processedUrl.split('youtu.be/')[1]?.split('?')[0];
      processedUrl = `https://www.youtube.com/embed/${vid}`;
    }

    const created: Lesson = {
      id: Date.now(),
      title: `${lessons.length + 1}. ${newCourse.title.trim()}`,
      level: newCourse.level,
      videoUrl: processedUrl,
      description: newCourse.description.trim() || "Aucune note additionnelle fournie pour ce cours.",
      duration: "30 min"
    };

    setLessons(prev => [...prev, created]);
    setActiveLessonId(created.id);
    setNewCourse({ title: '', level: 'Débutant', videoUrl: '', description: '' });
    showToast('Nouveau cours publié avec succès sur la plateforme !', 'success');
    handleNavigate('student-portal');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Votre message a bien été envoyé. Un administrateur vous répondra très rapidement.', 'success');
    setContactForm({ fullname: '', email: '', message: '' });
  };

  const handleDownloadResource = (resourceName: string) => {
    showToast(`Téléchargement de "${resourceName}" en cours...`, 'info');
    setTimeout(() => {
      showToast(`✓ Fichier "${resourceName}" téléchargé avec succès !`, 'success');
    }, 1200);
  };

  const activeLesson = lessons.find(l => l.id === activeLessonId) || lessons[0];
  const pendingCount = weltradeRequests.filter(r => r.status === 'Pending').length;

  const filteredRequests = weltradeRequests.filter(r => {
    if (requestFilter === 'All') return true;
    return r.status === requestFilter;
  });

  const progressPercent = Math.round((completedLessons.length / (lessons.length || 1)) * 100);

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${isDark ? 'bg-[#07080B] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'} selection:bg-amber-400 selection:text-black`}>
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl transition-all duration-300 text-sm font-semibold ${
              toast.type === 'success'
                ? isDark ? 'bg-[#121008] border-amber-500/50 text-amber-300 shadow-amber-500/10' : 'bg-amber-50 border-amber-400 text-amber-900 shadow-md'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-300'
                : isDark ? 'bg-zinc-900/95 border-amber-500/30 text-amber-200' : 'bg-white border-amber-400 text-amber-900 shadow-md'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />}
            {toast.type === 'info' && <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            <span>{toast.text}</span>
          </div>
        ))}
      </div>

      {/* HEADER / NAVIGATION */}
      <header className="fixed top-0 left-0 w-full z-40 glass-panel-dark border-b border-amber-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Zone */}
            <div 
              onClick={() => handleNavigate('home')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className={`relative p-1 rounded-xl ${isDark ? 'bg-black/60 border-amber-500/30' : 'bg-slate-900 border-amber-400/50'} border shadow-lg group-hover:border-amber-400 transition-all`}>
                <img 
                  src={LOGO_SRC} 
                  alt="GOF Trade Academy Logo" 
                  className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-extrabold text-base tracking-tight gold-gradient-text leading-tight">
                  GOF TRADE
                </span>
                <span className={`text-[10px] tracking-widest uppercase font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  ACADEMY
                </span>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-7 text-sm font-medium">
              <button 
                onClick={() => handleNavigate('home')} 
                className={`transition-colors py-1 cursor-pointer ${activePage === 'home' ? 'gold-gradient-text font-bold' : isDark ? 'text-slate-300 hover:text-amber-300' : 'text-slate-700 hover:text-amber-600'}`}
              >
                Accueil
              </button>
              <button 
                onClick={() => handleNavigate('about')} 
                className={`transition-colors py-1 cursor-pointer ${activePage === 'about' ? 'gold-gradient-text font-bold' : isDark ? 'text-slate-300 hover:text-amber-300' : 'text-slate-700 hover:text-amber-600'}`}
              >
                À Propos
              </button>
              <button 
                onClick={() => handleNavigate('courses-catalog')} 
                className={`transition-colors py-1 cursor-pointer ${activePage === 'courses-catalog' ? 'gold-gradient-text font-bold' : isDark ? 'text-slate-300 hover:text-amber-300' : 'text-slate-700 hover:text-amber-600'}`}
              >
                Formations
              </button>
              <button 
                onClick={() => handleNavigate('student-portal')} 
                className={`transition-colors py-1 flex items-center gap-1.5 cursor-pointer ${activePage === 'student-portal' ? 'gold-gradient-text font-bold' : isDark ? 'text-slate-300 hover:text-amber-300' : 'text-slate-700 hover:text-amber-600'}`}
              >
                <GraduationCap className="w-4 h-4 text-amber-500" />
                <span>Espace Cours</span>
              </button>
              <button 
                onClick={() => handleNavigate('contact')} 
                className={`transition-colors py-1 cursor-pointer ${activePage === 'contact' ? 'gold-gradient-text font-bold' : isDark ? 'text-slate-300 hover:text-amber-300' : 'text-slate-700 hover:text-amber-600'}`}
              >
                Contact
              </button>
            </nav>

            {/* Desktop Action & Theme Switcher Zone */}
            <div className="hidden md:flex items-center space-x-3">
              
              {/* Theme Toggle Button */}
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  isDark 
                    ? 'bg-[#12141C] border-amber-500/30 text-amber-400 hover:border-amber-400 hover:bg-neutral-900 shadow-sm' 
                    : 'bg-white border-amber-500/40 text-slate-800 hover:border-amber-500 hover:bg-amber-50/80 shadow-sm'
                }`}
                title={isDark ? "Activer le Mode Clair" : "Activer le Mode Sombre"}
                aria-label="Basculer le thème"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-90" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
                )}
              </button>

              {/* Main CTA */}
              <button 
                onClick={scrollToWeltrade} 
                className="gold-gradient-btn px-5 py-2.5 rounded-xl font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Rejoindre (Offert)</span>
              </button>
            </div>

            {/* Mobile Controls (Theme Toggle + Hamburger) */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isDark ? 'bg-[#12141C] border-amber-500/30 text-amber-400' : 'bg-white border-amber-400 text-slate-800 shadow-xs'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className={`p-2 focus:outline-none cursor-pointer ${isDark ? 'text-slate-200 hover:text-amber-400' : 'text-slate-800 hover:text-amber-600'}`}
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel-dark border-b border-amber-500/20 px-5 pt-3 pb-6 space-y-3">
            <div className="py-2 flex justify-between items-center border-b border-neutral-800/20 mb-2">
              <div className="flex items-center gap-2.5">
                <img 
                  src={LOGO_SRC} 
                  alt="GOF Trade Academy Logo" 
                  className="h-12 w-auto object-contain"
                />
                <span className="font-extrabold text-xs gold-gradient-text">GOF TRADE ACADEMY</span>
              </div>

              {/* In-drawer theme button */}
              <button
                onClick={() => setIsDark(!isDark)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${
                  isDark ? 'bg-neutral-900 border-amber-500/30 text-amber-300' : 'bg-white border-amber-400 text-slate-800'
                }`}
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
                <span>{isDark ? "Mode Clair" : "Mode Sombre"}</span>
              </button>
            </div>

            <button 
              onClick={() => handleNavigate('home')} 
              className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${activePage === 'home' ? 'bg-amber-500/15 text-amber-500 font-bold' : isDark ? 'text-slate-300 hover:bg-neutral-800' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              Accueil
            </button>
            <button 
              onClick={() => handleNavigate('about')} 
              className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${activePage === 'about' ? 'bg-amber-500/15 text-amber-500 font-bold' : isDark ? 'text-slate-300 hover:bg-neutral-800' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              À Propos
            </button>
            <button 
              onClick={() => handleNavigate('courses-catalog')} 
              className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${activePage === 'courses-catalog' ? 'bg-amber-500/15 text-amber-500 font-bold' : isDark ? 'text-slate-300 hover:bg-neutral-800' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              Formations
            </button>
            <button 
              onClick={() => handleNavigate('student-portal')} 
              className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium flex items-center justify-between ${activePage === 'student-portal' ? 'bg-amber-500/15 text-amber-500 font-bold' : isDark ? 'text-slate-300 hover:bg-neutral-800' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                Espace Cours Élève
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 font-bold">
                {lessons.length} cours
              </span>
            </button>
            <button 
              onClick={() => handleNavigate('contact')} 
              className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${activePage === 'contact' ? 'bg-amber-500/15 text-amber-500 font-bold' : isDark ? 'text-slate-300 hover:bg-neutral-800' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              Contact
            </button>
            <div className="pt-2">
              <button 
                onClick={scrollToWeltrade} 
                className="w-full gold-gradient-btn py-3 rounded-xl flex items-center justify-center gap-2 font-extrabold text-sm shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Rejoindre (Offert)</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow pt-20">

        {/* ================= PAGE: ACCUEIL ================= */}
        {activePage === 'home' && (
          <div className="space-y-0">
            
            {/* HERO SECTION */}
            <div className="relative overflow-hidden pt-12 pb-20 md:py-28">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
              <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-amber-600/8 rounded-full blur-[120px] pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Hero Content */}
                  <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel-dark border border-amber-500/30 text-amber-500 text-xs sm:text-sm font-semibold tracking-wide">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Masterclass Débutants Exclusive 2026</span>
                    </div>

                    <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Dominez le Trading avec la <br className="hidden sm:inline" />
                      <span className="gold-gradient-text">
                        Flash Entry Strategy
                      </span>
                    </h1>

                    <p className={`text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Transformez votre compréhension des marchés financiers. GOF Trade Academy accompagne les débutants de zéro jusqu'à la rentabilité avec des méthodes d'exécution chirurgicales et une discipline d'élite.
                    </p>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                      <button 
                        onClick={scrollToWeltrade} 
                        className="w-full sm:w-auto gold-gradient-btn px-8 py-4 rounded-xl flex items-center justify-center gap-3 cursor-pointer text-base"
                      >
                        <span>Accéder Gratuitement</span>
                        <ArrowRight className="w-5 h-5 text-black" />
                      </button>
                      <button 
                        onClick={() => handleNavigate('about')} 
                        className={`w-full sm:w-auto glass-panel-dark hover:border-amber-400 font-semibold px-8 py-4 rounded-xl border border-amber-500/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                          isDark ? 'text-slate-200 hover:bg-neutral-800/80' : 'text-slate-800 hover:bg-white shadow-xs'
                        }`}
                      >
                        <Play className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>Découvrir l'Académie</span>
                      </button>
                    </div>

                    {/* Verified Metrics */}
                    <div className="pt-8 grid grid-cols-3 gap-6 border-t border-amber-500/15 max-w-lg mx-auto lg:mx-0">
                      <div>
                        <p className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>94%</p>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Précision Signal</p>
                      </div>
                      <div>
                        <p className="text-2xl sm:text-3xl font-extrabold gold-gradient-text">+1 500</p>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Élèves Formés</p>
                      </div>
                      <div>
                        <p className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>0 FCFA</p>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Pour Débutants</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Graphic: GT Official Inspired Live Candlestick & Breakout Graphic */}
                  <div className="lg:col-span-5">
                    <div className="relative glass-panel-card rounded-2xl p-6 border border-amber-500/25 shadow-2xl glow-gold">
                      
                      <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-neutral-800' : 'border-slate-200'}`}>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                          <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                          <span className={`ml-2 font-mono text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            XAU/USD · M5 [Flash Entry]
                          </span>
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          EN DIRECT
                        </span>
                      </div>

                      {/* Candlestick visual console */}
                      <div className="h-64 my-4 relative rounded-xl overflow-hidden bg-[#0A0C11] p-4 flex flex-col justify-between chart-grid border border-neutral-800/80">
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 400 240">
                          <defs>
                            <linearGradient id="goldTrajectory" x1="0%" y1="100%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#78350F" stopOpacity="0.2" />
                              <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#FEF08A" stopOpacity="1" />
                            </linearGradient>
                          </defs>
                          <path 
                            d="M 40 180 Q 140 170 200 130 T 360 40" 
                            fill="none" 
                            stroke="url(#goldTrajectory)" 
                            strokeWidth="3" 
                            strokeDasharray="6 3" 
                          />
                        </svg>

                        <div className="relative z-10 flex items-end justify-between h-full pt-8 px-3 gap-2">
                          <div className="w-3.5 bg-neutral-700/80 h-20 rounded-xs relative">
                            <div className="w-0.5 bg-neutral-600 absolute -top-3 left-1/2 -translate-x-1/2 h-26" />
                          </div>
                          
                          <div className="w-3.5 bg-neutral-600/80 h-28 rounded-xs relative">
                            <div className="w-0.5 bg-neutral-500 absolute -top-2 left-1/2 -translate-x-1/2 h-32" />
                          </div>

                          <div className="w-3.5 bg-neutral-800 h-16 rounded-xs relative">
                            <div className="w-0.5 bg-neutral-700 absolute -top-2 left-1/2 -translate-x-1/2 h-20" />
                          </div>

                          <div className="w-3.5 bg-amber-600/90 h-32 rounded-xs relative">
                            <div className="w-0.5 bg-amber-500 absolute -top-3 left-1/2 -translate-x-1/2 h-38" />
                          </div>

                          <div className="w-4.5 bg-gradient-to-t from-amber-500 via-amber-400 to-yellow-200 h-48 rounded-xs relative border border-white shadow-lg shadow-amber-500/50">
                            <div className="w-0.5 bg-amber-300 absolute -top-5 left-1/2 -translate-x-1/2 h-56" />
                            <div className="absolute -top-10 -left-10 bg-gradient-to-r from-amber-400 to-yellow-300 text-black text-[10px] font-black px-2.5 py-1 rounded shadow-xl border border-white/40 flex items-center gap-1 whitespace-nowrap">
                              <Zap className="w-3 h-3 fill-black" />
                              FLASH ENTRY
                            </div>
                          </div>

                          <div className="w-3.5 bg-amber-400 h-44 rounded-xs relative">
                            <div className="w-0.5 bg-amber-300 absolute -top-2 left-1/2 -translate-x-1/2 h-48" />
                          </div>

                          <div className="w-3.5 bg-gradient-to-t from-amber-400 to-yellow-100 h-52 rounded-xs relative">
                            <div className="w-0.5 bg-amber-200 absolute -top-3 left-1/2 -translate-x-1/2 h-56" />
                          </div>
                        </div>
                      </div>

                      <div className={`flex items-center justify-between text-xs p-3 rounded-xl border border-amber-500/20 ${isDark ? 'bg-[#0B0D13] text-slate-300' : 'bg-slate-50 text-slate-800'}`}>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-amber-500" />
                          <span>Ratio R:R Minimal: <strong className={isDark ? "text-white font-bold" : "text-slate-900 font-bold"}>1:4</strong></span>
                        </div>
                        <span className="text-amber-500 font-extrabold flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          +380 pips
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* SECTION: FLASH ENTRY STRATEGY EXPLANATION */}
            <div className={`py-20 border-y border-amber-500/15 ${isDark ? 'bg-[#0A0C11]' : 'bg-slate-100/70'}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-xs font-black uppercase tracking-widest text-amber-500">
                    Notre Secret de Fabrique
                  </span>
                  <h2 className={`text-3xl sm:text-4xl font-extrabold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Qu'est-ce que la Flash Entry Strategy ?
                  </h2>
                  <p className={`mt-4 text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Une approche chirurgicale développée par les maîtres traders de GOF Trade Academy pour capturer les impulsions institutionnelles dès leur premier souffle.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="glass-panel-card p-8 rounded-2xl border border-amber-500/15 glass-panel-hover">
                    <div className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 border border-amber-500/25">
                      <Crosshair className="w-7 h-7 text-amber-500" />
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Entrée Ultra-Précise</h3>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Réduisez votre Stop Loss à quelques pips seulement en ciblant les empreintes d'accumulation institutionnelle avant le décollage du prix.
                    </p>
                  </div>

                  <div className="glass-panel-card p-8 rounded-2xl border border-amber-500/25 glass-panel-hover glow-gold">
                    <div className="w-14 h-14 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-6 border border-amber-500/35">
                      <TrendingUp className="w-7 h-7 text-amber-500" />
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Ratio Risque/Gains Élevé</h3>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Ne tradez plus pour des miettes. Notre protocole vise un ratio minimum de 1:3 à 1:10 sur chaque setup validé par le filtre institutionnel.
                    </p>
                  </div>

                  <div className="glass-panel-card p-8 rounded-2xl border border-amber-500/15 glass-panel-hover">
                    <div className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 border border-amber-500/25">
                      <Brain className="w-7 h-7 text-amber-500" />
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Sérénité Psychologique</h3>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Éliminez le doute et le FOMO avec une checklist binaire stricte en 3 critères objectifs : si un seul manque, pas de trade.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= SECTION PREUVE SOCIALE ================= */}
            <section className={`py-24 relative overflow-hidden ${isDark ? 'bg-[#07080B]' : 'bg-[#F8FAFC]'}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-xs font-black uppercase tracking-widest text-amber-500 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <Users className="w-3.5 h-3.5" /> Preuve Sociale & Résultats
                  </span>
                  <h2 className={`text-3xl sm:text-4xl font-extrabold mt-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    La Réussite de Nos Élèves en Chiffres
                  </h2>
                  <p className={`mt-3 text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Découvrez l'impact direct de la méthode Flash Entry sur les performances réelles de notre communauté de traders.
                  </p>
                </div>

                {/* 4 Key Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                  
                  <div className="glass-panel-card p-6 rounded-2xl border border-amber-500/20 text-center relative group hover:border-amber-400/50 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
                      <Users className="w-6 h-6" />
                    </div>
                    <p className={`text-3xl sm:text-4xl font-black tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>+250</p>
                    <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mt-1">Membres Actifs</p>
                    <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Élèves formés et accompagnés au quotidien</p>
                  </div>

                  <div className="glass-panel-card p-6 rounded-2xl border border-amber-500/30 text-center relative group hover:border-amber-400/50 transition-all glow-gold">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-3 border border-amber-500/30">
                      <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                    </div>
                    <p className="text-3xl sm:text-4xl font-black gold-gradient-text tabular-nums">98%</p>
                    <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mt-1">Taux de Satisfaction</p>
                    <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Évalué par les participants au programme</p>
                  </div>

                  <div className="glass-panel-card p-6 rounded-2xl border border-amber-500/20 text-center relative group hover:border-amber-400/50 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <p className={`text-3xl sm:text-4xl font-black tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>+18 400</p>
                    <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mt-1">Pips Validés</p>
                    <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Cumulés sur les sessions live et alertes 2026</p>
                  </div>

                  <div className="glass-panel-card p-6 rounded-2xl border border-amber-500/20 text-center relative group hover:border-amber-400/50 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <p className={`text-3xl sm:text-4xl font-black tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>24/7</p>
                    <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mt-1">Support & Communauté</p>
                    <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Échange continu entre membres et coachs</p>
                  </div>

                </div>

                {/* Testimonials Carousel */}
                <div className="max-w-4xl mx-auto">
                  <div className="glass-panel-card rounded-3xl p-8 sm:p-12 border-2 border-amber-500/30 relative shadow-2xl glow-gold">
                    
                    {/* Top Card Info */}
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b ${isDark ? 'border-neutral-800' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl gold-gradient-btn text-black font-black flex items-center justify-center text-lg shadow-lg">
                          {testimonials[testimonialIndex].name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{testimonials[testimonialIndex].name}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Vérifié
                            </span>
                          </div>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {testimonials[testimonialIndex].city}, {testimonials[testimonialIndex].country} · <span className={isDark ? "text-slate-300" : "text-slate-700"}>{testimonials[testimonialIndex].role}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end">
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(testimonials[testimonialIndex].stars)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                          {testimonials[testimonialIndex].result}
                        </span>
                      </div>
                    </div>

                    {/* Testimonial Quote */}
                    <div className="my-8">
                      <p className={`text-base sm:text-lg leading-relaxed italic ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        "{testimonials[testimonialIndex].quote}"
                      </p>
                    </div>

                    {/* Carousel Controls */}
                    <div className={`flex items-center justify-between pt-6 border-t ${isDark ? 'border-neutral-800' : 'border-slate-200'}`}>
                      
                      {/* Dots Navigation */}
                      <div className="flex items-center gap-2">
                        {testimonials.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setTestimonialIndex(idx)}
                            aria-label={`Aller au témoignage ${idx + 1}`}
                            className={`h-2.5 rounded-full transition-all cursor-pointer ${
                              idx === testimonialIndex 
                                ? 'w-8 bg-amber-500' 
                                : isDark ? 'w-2.5 bg-neutral-700 hover:bg-neutral-500' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Prev / Next Buttons */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setTestimonialIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                          className={`w-10 h-10 rounded-xl border border-amber-500/30 hover:border-amber-400 flex items-center justify-center transition-all cursor-pointer ${
                            isDark ? 'bg-[#0E1016] text-amber-300 hover:text-white' : 'bg-slate-100 text-amber-700 hover:text-black'
                          }`}
                          aria-label="Témoignage précédent"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {testimonialIndex + 1} / {testimonials.length}
                        </span>
                        <button
                          onClick={() => setTestimonialIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                          className={`w-10 h-10 rounded-xl border border-amber-500/30 hover:border-amber-400 flex items-center justify-center transition-all cursor-pointer ${
                            isDark ? 'bg-[#0E1016] text-amber-300 hover:text-white' : 'bg-slate-100 text-amber-700 hover:text-black'
                          }`}
                          aria-label="Témoignage suivant"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>

                    </div>

                  </div>
                </div>

              </div>
            </section>

            {/* ================= SECTION: WELTRADE INTEGRATION ================= */}
            <div id="weltrade-step-section" className={`py-24 relative overflow-hidden ${isDark ? 'bg-[#0A0C11]' : 'bg-slate-100/60'}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="glass-panel-card rounded-3xl p-8 sm:p-14 border-2 border-amber-500/30 relative overflow-hidden glow-gold-lg">
                  <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="text-center max-w-3xl mx-auto mb-14">
                    <span className="bg-amber-500/15 text-amber-500 text-xs font-black px-4 py-1.5 rounded-full border border-amber-500/30 uppercase tracking-widest inline-flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      Programme d'Accès Débutants
                    </span>
                    <h2 className={`text-3xl sm:text-4xl font-extrabold mt-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Obtenez la Formation Débutant (OFFERTE)
                    </h2>
                    <p className={`mt-3 text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Nous croyons que l'apprentissage ne doit pas être un obstacle financier. Grâce à notre partenariat officiel avec le courtier international régulé <strong className="text-amber-500 font-bold">Weltrade</strong>, débloquez gratuitement l'intégralité de la formation.
                    </p>
                  </div>

                  {/* 3 Step Cards */}
                  <div className="grid md:grid-cols-3 gap-6 mb-14">
                    
                    {/* Step 1 */}
                    <div className={`p-6 rounded-2xl border border-amber-500/20 relative flex flex-col justify-between ${isDark ? 'bg-[#0B0D13]' : 'bg-slate-50'}`}>
                      <div>
                        <div className="w-9 h-9 rounded-full bg-amber-400 text-black font-black flex items-center justify-center text-sm mb-4 shadow-md">
                          1
                        </div>
                        <h4 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Inscription Weltrade</h4>
                        <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Inscrivez-vous sur Weltrade via notre lien de parrainage officiel ci-dessous pour lier votre compte.
                        </p>
                      </div>
                      <a 
                        href={WELTRADE_AFFILIATE_URL} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center justify-center gap-2 text-xs font-extrabold text-black gold-gradient-btn px-4 py-2.5 rounded-xl transition-all shadow-md hover:scale-[1.02] cursor-pointer"
                      >
                        <span>Ouvrir mon compte Weltrade</span>
                        <ExternalLink className="w-3.5 h-3.5 text-black" />
                      </a>
                    </div>

                    {/* Step 2 */}
                    <div className={`p-6 rounded-2xl border border-amber-500/20 relative flex flex-col justify-between ${isDark ? 'bg-[#0B0D13]' : 'bg-slate-50'}`}>
                      <div>
                        <div className="w-9 h-9 rounded-full bg-amber-400 text-black font-black flex items-center justify-center text-sm mb-4 shadow-md">
                          2
                        </div>
                        <h4 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Dépôt Initial</h4>
                        <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Effectuez votre premier dépôt pour activer votre compte de trading personnel en réel.
                        </p>
                      </div>
                      <span className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        Vos fonds restent à vous à 100%
                      </span>
                    </div>

                    {/* Step 3 */}
                    <div className={`p-6 rounded-2xl border border-amber-500/30 relative flex flex-col justify-between glow-gold ${isDark ? 'bg-[#0B0D13]' : 'bg-slate-50'}`}>
                      <div>
                        <div className="w-9 h-9 rounded-full gold-gradient-btn text-black font-black flex items-center justify-center text-sm mb-4 shadow-md">
                          3
                        </div>
                        <h4 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Validation ID</h4>
                        <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Soumettez votre identifiant Weltrade via le formulaire ci-dessous pour activer votre Espace Cours.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-amber-500 font-medium flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          Activation express sous 24h
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowIdHelpModal(true)}
                          className="text-[11px] text-amber-500 hover:text-amber-600 underline flex items-center gap-1 cursor-pointer font-semibold"
                        >
                          <HelpCircle className="w-3.5 h-3.5" /> Aide ID
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Form Submission */}
                  <div className={`max-w-xl mx-auto p-6 sm:p-8 rounded-2xl border border-amber-500/25 shadow-2xl ${isDark ? 'bg-[#0A0C11]' : 'bg-white'}`}>
                    <h3 className={`text-xl font-bold mb-2 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Formulaire de Demande d'Accès
                    </h3>
                    <p className={`text-xs text-center mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Remplissez vos informations pour que notre équipe vérifie votre compte et valide votre accès.
                    </p>

                    <form onSubmit={handleWeltradeSubmit} className="space-y-4">
                      <div>
                        <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Nom & Prénom *
                        </label>
                        <input 
                          type="text" 
                          required 
                          value={weltradeForm.fullname}
                          onChange={e => setWeltradeForm(prev => ({ ...prev, fullname: e.target.value }))}
                          placeholder="Ex: Jean Dupont" 
                          className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors border ${
                            isDark ? 'bg-[#12141C] border-neutral-700 text-white placeholder-neutral-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Adresse Email *
                        </label>
                        <input 
                          type="email" 
                          required 
                          value={weltradeForm.email}
                          onChange={e => setWeltradeForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Ex: jean.dupont@email.com" 
                          className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors border ${
                            isDark ? 'bg-[#12141C] border-neutral-700 text-white placeholder-neutral-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            ID de Compte Weltrade *
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowIdHelpModal(true)}
                            className="text-[11px] text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1 cursor-pointer font-semibold"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            Où trouver mon ID ?
                          </button>
                        </div>
                        <input 
                          type="text" 
                          required 
                          value={weltradeForm.weltradeId}
                          onChange={e => setWeltradeForm(prev => ({ ...prev, weltradeId: e.target.value }))}
                          placeholder="Ex: 8934521" 
                          className={`w-full rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-amber-400 transition-colors border ${
                            isDark ? 'bg-[#12141C] border-neutral-700 text-white placeholder-neutral-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                        <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Numéro à 7 ou 8 chiffres visible dans votre espace client Weltrade.</p>
                      </div>

                      <button 
                        type="submit" 
                        className="w-full gold-gradient-btn py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                      >
                        <Send className="w-4 h-4 text-black" />
                        <span>Soumettre pour Validation</span>
                      </button>
                    </form>
                  </div>

                </div>

              </div>
            </div>

          </div>
        )}

        {/* ================= PAGE: À PROPOS ================= */}
        {activePage === 'about' && (
          <div className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-black uppercase tracking-widest text-amber-500">
                  Excellence & Discipline
                </span>
                <h1 className={`text-4xl font-extrabold mt-2 mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  À Propos de GOF Trade Academy
                </h1>
                <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Démocratiser l'excellence du trading institutionnel pour les passionnés d'Afrique et du monde entier.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold flex items-center gap-2.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Sparkles className="w-6 h-6 text-amber-500" />
                    Notre Mission
                  </h2>
                  <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    GOF Trade Academy a été fondée sur un constat simple et alarmant : plus de 90% des traders débutants perdent leur capital en raison d'un manque de méthode structurée, de fausses promesses et de formations vendues à des prix prohibitifs.
                  </p>
                  <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Notre vocation absolue est d'éliminer ces barrières financières pour offrir une éducation de rang mondial. Nous mettons l'accent sur la pratique en temps réel et notre stratégie propriétaire éprouvée : la <strong className="text-amber-500">Flash Entry Strategy</strong>.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-5 rounded-2xl glass-panel-card border border-amber-500/20">
                      <h4 className="gold-gradient-text font-black text-2xl">100%</h4>
                      <p className={`text-xs font-semibold mt-1 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Pratique & Live</p>
                      <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Analyse graphique en conditions de marché réelles.</p>
                    </div>
                    <div className="p-5 rounded-2xl glass-panel-card border border-amber-500/20">
                      <h4 className={`font-black text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>24/7</h4>
                      <p className={`text-xs font-semibold mt-1 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Suivi Continu</p>
                      <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Accompagnement rigoureux de la communauté privée.</p>
                    </div>
                  </div>
                </div>

                {/* Official Emblem Card */}
                <div className="glass-panel-card rounded-3xl p-10 border border-amber-500/30 text-center relative overflow-hidden flex flex-col items-center glow-gold">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 relative mb-4 p-2">
                    <img 
                      src={LOGO_SRC} 
                      alt="GOF Trade Academy Official Emblem" 
                      className="w-full h-full object-contain filter drop-shadow-2xl"
                    />
                  </div>
                  
                  <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    GOF Trade Academy
                  </h3>
                  <p className="text-xs gold-gradient-text uppercase tracking-widest font-bold mt-1.5 mb-5">
                    Apprendre • Analyser • Réussir
                  </p>
                  <blockquote className={`text-sm italic max-w-md border-t border-amber-500/20 pt-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    "Le succès en trading n'est jamais le fruit du hasard, mais l'exécution inflexible d'un plan éprouvé, d'une gestion du risque millimétrée et d'un mental inébranlable."
                  </blockquote>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ================= PAGE: CATALOGUE FORMATIONS ================= */}
        {activePage === 'courses-catalog' && (
          <div className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-black uppercase tracking-widest text-amber-500">
                  Parcours Pédagogique
                </span>
                <h1 className={`text-4xl font-extrabold mt-2 mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Nos Programmes de Formation
                </h1>
                <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Choisissez le cursus calibré pour propulser vos performances vers les standards institutionnels.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                
                {/* Programme 1 */}
                <div className="glass-panel-card rounded-3xl p-8 sm:p-10 border-2 border-amber-500/40 relative flex flex-col justify-between glow-gold">
                  <div className="absolute top-6 right-6 bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[11px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    OFFERT VIA WELTRADE
                  </div>

                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl mb-6 border border-amber-500/20">
                      <GraduationCap className="w-7 h-7 text-amber-500" />
                    </div>

                    <h3 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Initiation à la Flash Entry Strategy
                    </h3>
                    <p className={`text-sm mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Formation complète pour débutants axée sur l'Initiation à la Flash Entry Strategy sur le Forex et les Indices Synthétiques Weltrade.
                    </p>

                    <ul className={`space-y-3.5 text-sm mb-8 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                        <span>Les bases du Forex & des Indices Synthétiques Weltrade</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                        <span>Initiation progressive à la Flash Entry Strategy (Principes & Exécution)</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                        <span>Configuration des graphiques & prise en main de la plateforme</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                        <span>Gestion du risque (1% par trade) et contrôle des émotions</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <a 
                      href={WELTRADE_AFFILIATE_URL}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full gold-gradient-btn py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      <span>S'inscrire sur Weltrade (Accès Offert)</span>
                      <ExternalLink className="w-4 h-4 text-black" />
                    </a>
                    <button 
                      onClick={scrollToWeltrade} 
                      className="w-full text-center text-xs text-amber-500 hover:text-amber-600 transition-colors py-1 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Déjà inscrit ? Soumettre mon ID pour validation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Programme 2 */}
                <div className="glass-panel-card rounded-3xl p-8 sm:p-10 border-2 border-amber-500/30 relative flex flex-col justify-between glow-gold">
                  <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-500/25 to-yellow-500/20 text-amber-500 border border-amber-500/40 text-[11px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    REJOINDRE LA LISTE D'ATTENTE VIP
                  </div>

                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center text-xl mb-6 border border-amber-500/30">
                      <Crown className="w-7 h-7 text-amber-500" />
                    </div>

                    <h3 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Masterclass Flash Entry Pro & Mentorat VIP
                    </h3>
                    <p className={`text-sm mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Programme avancé combinant maîtrise approfondie de la stratégie, suivi personnalisé et signaux en direct.
                    </p>

                    <ul className={`space-y-3.5 text-sm mb-8 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                        <span>Perfectionnement avancé de la Flash Entry Strategy (Forex & Synthétiques)</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                        <span>Accompagnement & Mentorat privé personnalisé</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                        <span>Accès au Canal Privé VIP (Signaux & Opportunités de trades en direct)</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                        <span>Live Stream Hebdomadaire (Analyses de marché & Revues de trades)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <a 
                      href={MAKETOU_VIP_URL} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full gold-gradient-btn py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      <Crown className="w-4 h-4 fill-black" />
                      <span>Souscrire au Programme VIP (Maketou)</span>
                      <ExternalLink className="w-4 h-4 text-black" />
                    </a>
                    <button 
                      onClick={() => setShowVipModal(true)} 
                      className="w-full text-center text-xs text-amber-500 hover:text-amber-600 transition-colors py-1 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Liste d'attente & Candidature prioritaire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <p className={`text-center text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Places limitées · Paiement direct sécurisé Maketou
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ================= ESPACE COURS / ELEVE ================= */}
        {activePage === 'student-portal' && (
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Progress Summary Header */}
              <div className="mb-8 glass-panel-card p-6 rounded-2xl border border-amber-500/25 glow-gold card-hover-interactive">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs uppercase tracking-wider font-bold gold-gradient-text">
                        Espace Membre Étudiant
                      </span>
                      {isVipUnlocked ? (
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-black border border-white/40 flex items-center gap-1 shadow-sm uppercase tracking-wider">
                          <Crown className="w-3 h-3 fill-black" />
                          ÉLÈVE VIP
                        </span>
                      ) : isWeltradeUnlocked ? (
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" />
                          WELTRADE VALIDÉ
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-800 text-slate-300 border border-neutral-700 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 text-amber-500" />
                          APERÇU DÉCOUVERTE
                        </span>
                      )}
                    </div>

                    <h1 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Votre Progression Académique
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {!hasCourseAccess && (
                      <button
                        onClick={() => setShowCourseAccessModal(true)}
                        className="gold-gradient-btn px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-black" />
                        <span>Débloquer tous les cours</span>
                      </button>
                    )}

                    <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <strong className="text-amber-500 font-black text-lg">{completedLessons.length}</strong> / {lessons.length} cours terminés
                    </span>
                    <span className="text-sm font-black gold-gradient-btn px-3 py-1 rounded-lg">
                      {progressPercent}%
                    </span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className={`w-full h-3.5 rounded-full overflow-hidden border p-0.5 ${isDark ? 'bg-[#0B0D13] border-neutral-800' : 'bg-slate-200 border-slate-300'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {progressPercent === 100 && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-amber-500 font-semibold bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Félicitations ! Vous avez complété toutes les leçons du programme Débutant Flash Entry.</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Left Sidebar: Lesson Navigation */}
                <div className="lg:w-1/3 glass-panel-card rounded-2xl p-6 border border-amber-500/20 h-fit card-hover-interactive">
                  <div className={`flex items-center justify-between pb-4 border-b mb-4 ${isDark ? 'border-neutral-800' : 'border-slate-200'}`}>
                    <div>
                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Programme Débutant</h3>
                      <p className="text-xs gold-gradient-text font-semibold">GOF Flash Entry Method</p>
                    </div>
                    <span className="bg-amber-500/20 text-amber-500 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                      {lessons.length} Leçons
                    </span>
                  </div>

                  {/* Lesson List with Locked Indicators */}
                  <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                    {lessons.length === 0 ? (
                      <p className="text-xs text-neutral-400 py-4 text-center">Aucune leçon disponible.</p>
                    ) : (
                      lessons.map(lesson => {
                        const isActive = lesson.id === activeLessonId;
                        const isDone = completedLessons.includes(lesson.id);
                        const locked = isLessonLocked(lesson.id);

                        return (
                          <div
                            key={lesson.id}
                            className={`w-full text-left p-3.5 rounded-xl transition-all border flex items-center justify-between gap-2.5 card-hover-interactive ${
                              isActive
                                ? isDark ? 'bg-amber-500/15 border-amber-400/60 text-white font-bold glow-gold' : 'bg-amber-50/80 border-amber-400 text-slate-900 font-bold shadow-xs'
                                : locked
                                ? isDark ? 'bg-[#090A0E] border-neutral-800/80 text-slate-400 hover:border-amber-500/40' : 'bg-slate-100/70 border-slate-200 text-slate-600 hover:border-amber-400'
                                : isDark ? 'bg-[#0B0D13] border-neutral-800 hover:bg-neutral-800/70 text-slate-300' : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-700'
                            }`}
                          >
                            <button
                              onClick={() => {
                                if (locked) {
                                  setShowCourseAccessModal(true);
                                } else {
                                  setActiveLessonId(lesson.id);
                                }
                              }}
                              className="flex items-center gap-2.5 min-w-0 flex-grow text-left cursor-pointer"
                            >
                              {locked ? (
                                <Lock className="w-4 h-4 shrink-0 text-amber-500" />
                              ) : (
                                <Play className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-500 fill-amber-500' : 'text-neutral-400'}`} />
                              )}
                              <span className="text-xs truncate">{lesson.title}</span>
                            </button>

                            <div className="flex items-center gap-2 shrink-0">
                              {locked ? (
                                <span 
                                  onClick={() => setShowCourseAccessModal(true)}
                                  className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30 cursor-pointer flex items-center gap-1"
                                >
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>Réservé</span>
                                </span>
                              ) : (
                                <>
                                  <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
                                    {lesson.level}
                                  </span>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleLessonCompleted(lesson.id);
                                    }}
                                    title={isDone ? "Marquer comme non terminée" : "Marquer comme terminée"}
                                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                                      isDone 
                                        ? 'text-emerald-500 hover:text-emerald-400 bg-emerald-500/20 border border-emerald-500/30' 
                                        : isDark ? 'text-neutral-500 hover:text-amber-400 bg-neutral-900 border border-neutral-800' : 'text-slate-400 hover:text-amber-600 bg-white border-slate-300'
                                    }`}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Main Content: Video Player, Completion Button & Resources */}
                <div className="lg:w-2/3 space-y-6">
                  <div className="glass-panel-card rounded-2xl overflow-hidden border border-amber-500/25 glow-gold card-hover-interactive">
                    
                    {/* Responsive Video Frame with Lock Guard */}
                    <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                      {isLessonLocked(activeLesson?.id) ? (
                        <div className="relative w-full h-full bg-[#080A0F] flex flex-col items-center justify-center p-6 text-center border-b border-amber-500/30 overflow-hidden">
                          <div className="absolute inset-0 bg-radial from-amber-500/15 via-transparent to-transparent pointer-events-none" />
                          
                          <div className="w-16 h-16 rounded-2xl gold-gradient-btn text-black flex items-center justify-center mb-4 shadow-xl animate-pulse-gold relative z-10">
                            <Lock className="w-8 h-8 fill-black" />
                          </div>

                          <span className="text-[11px] font-black uppercase tracking-widest text-amber-500 mb-1 relative z-10">
                            Contenu Protégé
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black text-white mb-2 relative z-10">
                            Cette Leçon est Réservée aux Membres
                          </h3>
                          <p className="text-xs max-w-md text-slate-300 leading-relaxed mb-6 relative z-10">
                            Pour visionner cette formation avancée de la Flash Entry Strategy, activez votre accès offert via Weltrade ou souscrivez au Pass VIP Maketou.
                          </p>
                          
                          <button
                            onClick={() => setShowCourseAccessModal(true)}
                            className="gold-gradient-btn px-7 py-3.5 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer shadow-xl shadow-amber-500/30 relative z-10 transition-transform hover:scale-105"
                          >
                            <Sparkles className="w-4 h-4 fill-black" />
                            <span>Débloquer mes Formations</span>
                            <ArrowRight className="w-4 h-4 text-black" />
                          </button>
                        </div>
                      ) : activeLesson?.videoUrl ? (
                        <iframe 
                          src={activeLesson.videoUrl} 
                          title={activeLesson.title} 
                          className="w-full h-full"
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen 
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-neutral-500 gap-2">
                          <Play className="w-12 h-12 text-neutral-600" />
                          <p className="text-sm">Vidéo en cours de chargement...</p>
                        </div>
                      )}
                    </div>

                    {/* Video Meta Info & Completion CTA */}
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 uppercase">
                            NIVEAU {activeLesson?.level?.toUpperCase() || 'DÉBUTANT'}
                          </span>
                          <span className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            {activeLesson?.duration || 'Durée: ~30 min'}
                          </span>
                        </div>

                        {/* Interactive Toggle for Current Lesson */}
                        <button
                          onClick={() => toggleLessonCompleted(activeLesson.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            completedLessons.includes(activeLesson.id)
                              ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'gold-gradient-btn text-black'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>
                            {completedLessons.includes(activeLesson.id) 
                              ? 'Leçon Terminée ✓' 
                              : 'Marquer comme terminée'}
                          </span>
                        </button>
                      </div>

                      <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {activeLesson?.title || "Sélectionnez une leçon"}
                      </h2>

                      <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {activeLesson?.description || "Aucune description fournie pour ce cours."}
                      </p>

                      {/* Downloadable Resources Section */}
                      <div className={`pt-6 border-t ${isDark ? 'border-neutral-800' : 'border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <Download className="w-4 h-4 text-amber-500" />
                            Ressources téléchargeables (PDF / Fichiers)
                          </h4>
                          <span className="text-[11px] text-amber-500 font-semibold">4 fichiers disponibles</span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3.5">
                          
                          {/* Resource 1 */}
                          <div className={`p-3.5 rounded-xl border border-amber-500/20 flex items-center justify-between gap-3 hover:border-amber-400/40 transition-colors ${isDark ? 'bg-[#0B0D13]' : 'bg-slate-50'}`}>
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>Flash_Entry_Checklist.pdf</p>
                                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>PDF · 2.4 Mo · Règles & Invalidation</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownloadResource('Flash_Entry_Checklist.pdf')}
                              className={`p-2 rounded-lg hover:bg-amber-400 hover:text-black text-amber-500 transition-colors cursor-pointer shrink-0 ${
                                isDark ? 'bg-neutral-800' : 'bg-white border border-slate-200 shadow-xs'
                              }`}
                              title="Télécharger"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Resource 2 */}
                          <div className={`p-3.5 rounded-xl border border-amber-500/20 flex items-center justify-between gap-3 hover:border-amber-400/40 transition-colors ${isDark ? 'bg-[#0B0D13]' : 'bg-slate-50'}`}>
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                <FileSpreadsheet className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>Calculateur_Lot_Risk.xlsx</p>
                                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Excel · 380 Ko · Money Management 1%</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownloadResource('Calculateur_Lot_Risk.xlsx')}
                              className={`p-2 rounded-lg hover:bg-amber-400 hover:text-black text-amber-500 transition-colors cursor-pointer shrink-0 ${
                                isDark ? 'bg-neutral-800' : 'bg-white border border-slate-200 shadow-xs'
                              }`}
                              title="Télécharger"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Resource 3 */}
                          <div className={`p-3.5 rounded-xl border border-amber-500/20 flex items-center justify-between gap-3 hover:border-amber-400/40 transition-colors ${isDark ? 'bg-[#0B0D13]' : 'bg-slate-50'}`}>
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
                                <BarChart3 className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>TradingView_Setup_Guide.pdf</p>
                                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>PDF · 1.6 Mo · Templates graphiques</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownloadResource('TradingView_Setup_Guide.pdf')}
                              className={`p-2 rounded-lg hover:bg-amber-400 hover:text-black text-amber-500 transition-colors cursor-pointer shrink-0 ${
                                isDark ? 'bg-neutral-800' : 'bg-white border border-slate-200 shadow-xs'
                              }`}
                              title="Télécharger"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Resource 4 */}
                          <div className={`p-3.5 rounded-xl border border-amber-500/20 flex items-center justify-between gap-3 hover:border-amber-400/40 transition-colors ${isDark ? 'bg-[#0B0D13]' : 'bg-slate-50'}`}>
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                                <BookOpen className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>Journal_Trading_Audit.pdf</p>
                                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>PDF · 850 Ko · Feuille de suivi hebdomadaire</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownloadResource('Journal_Trading_Audit.pdf')}
                              className={`p-2 rounded-lg hover:bg-amber-400 hover:text-black text-amber-500 transition-colors cursor-pointer shrink-0 ${
                                isDark ? 'bg-neutral-800' : 'bg-white border border-slate-200 shadow-xs'
                              }`}
                              title="Télécharger"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ================= PAGE: ESPACE ADMINISTRATEUR ================= */}
        {activePage === 'admin' && !isAdminAuthenticated && (
          <div className="py-16 md:py-24">
            <div className="max-w-md mx-auto px-4">
              <div className={`p-8 sm:p-10 rounded-3xl border-2 border-amber-500/40 text-center glow-gold-lg shadow-2xl relative ${
                isDark ? 'bg-[#0D0F16]' : 'bg-white'
              }`}>
                <div className="w-16 h-16 rounded-3xl gold-gradient-btn text-black flex items-center justify-center mx-auto mb-5 shadow-xl">
                  <Lock className="w-8 h-8 fill-black" />
                </div>
                
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-500">
                  Zone Protégée
                </span>
                <h2 className={`text-2xl font-black mt-1 mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Connexion Administrateur
                </h2>
                <p className={`text-xs mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Ce tableau de bord est réservé aux dirigeants de GOF Trade Academy. Saisissez votre mot de passe pour continuer.
                </p>

                {adminPasswordError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs text-left flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{adminPasswordError}</span>
                  </div>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      Mot de passe administrateur <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminPassword ? "text" : "password"}
                        required
                        value={adminPasswordInput}
                        onChange={(e) => {
                          setAdminPasswordInput(e.target.value);
                          if (adminPasswordError) setAdminPasswordError(null);
                        }}
                        placeholder="••••••••••••"
                        autoFocus
                        className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm transition-all outline-none ${
                          isDark 
                            ? 'bg-[#151824] border-neutral-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-amber-500 cursor-pointer"
                        aria-label="Afficher/masquer le mot de passe"
                      >
                        {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full gold-gradient-btn py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <KeyRound className="w-4 h-4 text-black" />
                    <span>Déverrouiller le Tableau de Bord</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExitAdmin}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center block ${
                      isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'
                    }`}
                  >
                    ← Retourner à l'accueil
                  </button>
                </form>

              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE: ESPACE ADMINISTRATEUR (AUTHENTIFIÉ) ================= */}
        {activePage === 'admin' && isAdminAuthenticated && (
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-5 border-b ${isDark ? 'border-neutral-800' : 'border-slate-200'}`}>
                <div>
                  <h1 className={`text-3xl font-extrabold flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <ShieldCheck className="w-8 h-8 text-amber-500" />
                    <span>Tableau de Bord Administrateur</span>
                  </h1>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Gérez les validations d'accès Weltrade, la liste VIP et publiez de nouveaux cours pour vos élèves.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono bg-emerald-500/15 text-emerald-400 px-3.5 py-1.5 rounded-lg border border-emerald-500/30 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Session Sécurisée
                  </span>
                  <button
                    onClick={handleAdminLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-500/40 text-rose-400 hover:bg-rose-500/15 hover:border-rose-500 text-xs font-bold transition-all cursor-pointer shadow-sm"
                    title="Se déconnecter de l'espace administrateur"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Déconnexion Admin</span>
                  </button>
                </div>
              </div>

              {/* Admin Tabs */}
              <div className={`flex space-x-4 mb-6 border-b ${isDark ? 'border-neutral-800' : 'border-slate-200'}`}>
                <button 
                  onClick={() => setAdminTab('validations')} 
                  className={`py-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                    adminTab === 'validations' 
                      ? 'border-amber-400 text-amber-500' 
                      : isDark ? 'border-transparent text-slate-400 hover:text-white' : 'border-transparent text-slate-500 hover:text-black'
                  }`}
                >
                  <span>Inscriptions Weltrade ({weltradeRequests.length})</span>
                  {pendingCount > 0 && (
                    <span className="bg-amber-400 text-black text-xs px-2 py-0.5 rounded-full font-black">
                      {pendingCount} en attente
                    </span>
                  )}
                </button>

                <button 
                  onClick={() => setAdminTab('vip-waitlist')} 
                  className={`py-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                    adminTab === 'vip-waitlist' 
                      ? 'border-amber-400 text-amber-500' 
                      : isDark ? 'border-transparent text-slate-400 hover:text-white' : 'border-transparent text-slate-500 hover:text-black'
                  }`}
                >
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>Liste d'Attente VIP ({vipWaitlist.length})</span>
                  {vipWaitlist.filter(v => v.status === 'Pending').length > 0 && (
                    <span className="bg-amber-400 text-black text-xs px-2 py-0.5 rounded-full font-black">
                      {vipWaitlist.filter(v => v.status === 'Pending').length}
                    </span>
                  )}
                </button>

                <button 
                  onClick={() => setAdminTab('add-course')} 
                  className={`py-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                    adminTab === 'add-course' 
                      ? 'border-amber-400 text-amber-500' 
                      : isDark ? 'border-transparent text-slate-400 hover:text-white' : 'border-transparent text-slate-500 hover:text-black'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-amber-500" />
                  <span>Publier un Nouveau Cours</span>
                </button>
              </div>

              {/* TAB 1: VALIDATION DES MEMBRES WELTRADE */}
              {adminTab === 'validations' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2">
                    <span className={`text-xs mr-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Filtrer par :</span>
                    {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(filter => (
                      <button
                        key={filter}
                        onClick={() => setRequestFilter(filter)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          requestFilter === filter
                            ? 'bg-amber-500/20 border-amber-400 text-amber-500 font-bold'
                            : isDark ? 'bg-neutral-900 border-neutral-800 text-slate-400 hover:text-white' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {filter === 'All' ? 'Toutes' : filter === 'Pending' ? 'En attente' : filter === 'Approved' ? 'Validées' : 'Refusées'}
                      </button>
                    ))}
                  </div>

                  <div className="glass-panel-card rounded-2xl p-6 border border-amber-500/20 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className={`text-xs uppercase tracking-wider border-b ${
                        isDark ? 'bg-[#0A0C11] text-slate-400 border-neutral-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        <tr>
                          <th className="p-3.5 rounded-l-lg">Date</th>
                          <th className="p-3.5">Nom & Prénom</th>
                          <th className="p-3.5">Email</th>
                          <th className="p-3.5">ID Weltrade</th>
                          <th className="p-3.5">Statut</th>
                          <th className="p-3.5 rounded-r-lg text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? 'divide-neutral-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                        {filteredRequests.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-neutral-400 text-sm">
                              Aucune demande trouvée pour ce filtre.
                            </td>
                          </tr>
                        ) : (
                          filteredRequests.map(req => (
                            <tr key={req.id} className={isDark ? "hover:bg-neutral-900/50 transition-colors" : "hover:bg-slate-50 transition-colors"}>
                              <td className={`p-3.5 font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{req.date}</td>
                              <td className={`p-3.5 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{req.fullname}</td>
                              <td className={`p-3.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{req.email}</td>
                              <td className="p-3.5 font-mono text-amber-500 font-bold text-xs">{req.weltradeId}</td>
                              <td className="p-3.5">
                                {req.status === 'Approved' && (
                                  <span className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Validé
                                  </span>
                                )}
                                {req.status === 'Rejected' && (
                                  <span className="bg-rose-500/20 text-rose-500 border border-rose-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                                    <XCircle className="w-3 h-3" /> Refusé
                                  </span>
                                )}
                                {req.status === 'Pending' && (
                                  <span className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> En attente
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5 text-right space-x-2">
                                {req.status === 'Pending' ? (
                                  <>
                                    <button 
                                      onClick={() => handleStatusChange(req.id, 'Approved')} 
                                      className="bg-amber-500/20 hover:bg-amber-400 hover:text-black text-amber-500 font-bold px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer border border-amber-500/30"
                                    >
                                      Valider
                                    </button>
                                    <button 
                                      onClick={() => handleStatusChange(req.id, 'Rejected')} 
                                      className="bg-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-400 font-bold px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer border border-rose-500/30"
                                    >
                                      Refuser
                                    </button>
                                  </>
                                ) : (
                                  <button 
                                    onClick={() => handleStatusChange(req.id, req.status === 'Approved' ? 'Rejected' : 'Approved')}
                                    className="text-xs text-neutral-400 hover:text-amber-500 transition-colors underline cursor-pointer"
                                  >
                                    Basculer statut
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: LISTE D'ATTENTE VIP */}
              {adminTab === 'vip-waitlist' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Candidats pré-inscrits pour la <strong>Masterclass Flash Entry Pro & Mentorat VIP</strong>.
                    </p>
                    <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                      Total : {vipWaitlist.length} candidatures ({vipWaitlist.filter(v => v.status === 'Pending').length} en attente)
                    </span>
                  </div>

                  <div className="glass-panel-card rounded-2xl p-6 border border-amber-500/20 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className={`text-xs uppercase tracking-wider border-b ${
                        isDark ? 'bg-[#0A0C11] text-slate-400 border-neutral-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        <tr>
                          <th className="p-3.5 rounded-l-lg">Date</th>
                          <th className="p-3.5">Candidat</th>
                          <th className="p-3.5">WhatsApp / Contact</th>
                          <th className="p-3.5">Niveau & Expérience</th>
                          <th className="p-3.5">Objectif / Message</th>
                          <th className="p-3.5">Statut</th>
                          <th className="p-3.5 rounded-r-lg text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? 'divide-neutral-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                        {vipWaitlist.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-neutral-400 text-sm">
                              Aucune candidature sur la liste d'attente pour le moment.
                            </td>
                          </tr>
                        ) : (
                          vipWaitlist.map(cand => (
                            <tr key={cand.id} className={isDark ? "hover:bg-neutral-900/50 transition-colors" : "hover:bg-slate-50 transition-colors"}>
                              <td className={`p-3.5 font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{cand.date}</td>
                              <td className="p-3.5">
                                <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{cand.fullname}</p>
                                <p className="text-xs text-neutral-400">{cand.email}</p>
                              </td>
                              <td className="p-3.5">
                                <a 
                                  href={`https://wa.me/${cand.whatsapp.replace(/[^0-9]/g, '')}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
                                  title="Contacter sur WhatsApp"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{cand.whatsapp}</span>
                                </a>
                              </td>
                              <td className="p-3.5">
                                <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/25">
                                  {cand.experience}
                                </span>
                              </td>
                              <td className="p-3.5 text-xs max-w-xs truncate" title={cand.message}>
                                {cand.message || <span className="text-neutral-500 italic">Aucun message</span>}
                              </td>
                              <td className="p-3.5">
                                {cand.status === 'Enrolled' && (
                                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Enrôlé VIP
                                  </span>
                                )}
                                {cand.status === 'Contacted' && (
                                  <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                                    <UserCheck className="w-3 h-3" /> Contacté
                                  </span>
                                )}
                                {cand.status === 'Pending' && (
                                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> En attente
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                                <button
                                  onClick={() => handleVipStatusChange(cand.id, cand.status === 'Contacted' ? 'Enrolled' : cand.status === 'Enrolled' ? 'Pending' : 'Contacted')}
                                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-400 hover:text-black text-amber-500 transition-colors border border-amber-500/30 cursor-pointer"
                                >
                                  {cand.status === 'Pending' ? 'Marquer Contacté' : cand.status === 'Contacted' ? 'Enrôler' : 'Réinitialiser'}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: AJOUTER UN NOUVEAU COURS */}
              {adminTab === 'add-course' && (
                <div className="max-w-2xl mx-auto glass-panel-card rounded-2xl p-8 border border-amber-500/25 glow-gold">
                  <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <PlusCircle className="w-5 h-5 text-amber-500" />
                    Ajouter une nouvelle leçon sur la plateforme
                  </h3>

                  <form onSubmit={handleAddCourse} className="space-y-5">
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Titre de la leçon *
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={newCourse.title}
                        onChange={e => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Décodage complet des Bougies d'Impulsion" 
                        className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors border ${
                          isDark ? 'bg-[#12141C] border-neutral-700 text-white placeholder-neutral-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Niveau *
                        </label>
                        <select 
                          value={newCourse.level}
                          onChange={e => setNewCourse(prev => ({ ...prev, level: e.target.value }))}
                          className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors cursor-pointer border ${
                            isDark ? 'bg-[#12141C] border-neutral-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="Débutant">Débutant</option>
                          <option value="Avancé">Avancé</option>
                        </select>
                      </div>

                      <div>
                        <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Format Vidéo *
                        </label>
                        <input 
                          type="text" 
                          disabled 
                          value="YouTube / Google Drive" 
                          className={`w-full rounded-xl px-4 py-3 text-sm cursor-not-allowed border ${
                            isDark ? 'bg-[#0D0F16] border-neutral-800 text-neutral-400' : 'bg-slate-100 border-slate-300 text-slate-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Lien Vidéo (YouTube / Embed) *
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={newCourse.videoUrl}
                        onChange={e => setNewCourse(prev => ({ ...prev, videoUrl: e.target.value }))}
                        placeholder="https://www.youtube.com/watch?v=..." 
                        className={`w-full rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-amber-400 transition-colors text-xs border ${
                          isDark ? 'bg-[#12141C] border-neutral-700 text-white placeholder-neutral-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                      <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Collez l'URL de votre vidéo YouTube ou un lien de partage direct.
                      </p>
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Notes & Description de la leçon
                      </label>
                      <textarea 
                        rows={4} 
                        value={newCourse.description}
                        onChange={e => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Expliquez brièvement les points clés abordés dans cette session..." 
                        className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors border ${
                          isDark ? 'bg-[#12141C] border-neutral-700 text-white placeholder-neutral-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full gold-gradient-btn py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      <PlusCircle className="w-4 h-4 text-black" />
                      <span>Publier la Leçon sur l'Espace Élève</span>
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ================= PAGE: CONTACT ================= */}
        {activePage === 'contact' && (
          <div className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-black uppercase tracking-widest text-amber-500">
                  Assistance Dédiée
                </span>
                <h1 className={`text-4xl font-extrabold mt-2 mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Contactez l'Équipe GOF Trade
                </h1>
                <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Une question sur la formation ou votre validation Weltrade ? Nous sommes à votre écoute.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                
                {/* Form */}
                <div className="glass-panel-card p-8 rounded-2xl border border-amber-500/25 glow-gold">
                  <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Envoyer un message direct</h3>
                  
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Nom Complet
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={contactForm.fullname}
                        onChange={e => setContactForm(prev => ({ ...prev, fullname: e.target.value }))}
                        placeholder="Votre nom" 
                        className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors border ${
                          isDark ? 'bg-[#12141C] border-neutral-700 text-white placeholder-neutral-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Email
                      </label>
                      <input 
                        type="email" 
                        required 
                        value={contactForm.email}
                        onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="votre@email.com" 
                        className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors border ${
                          isDark ? 'bg-[#12141C] border-neutral-700 text-white placeholder-neutral-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Message
                      </label>
                      <textarea 
                        rows={4} 
                        required 
                        value={contactForm.message}
                        onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Comment pouvons-nous vous accompagner ?" 
                        className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors border ${
                          isDark ? 'bg-[#12141C] border-neutral-700 text-white placeholder-neutral-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full gold-gradient-btn py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      <Send className="w-4 h-4 text-black" />
                      <span>Envoyer le Message</span>
                    </button>
                  </form>
                </div>

                {/* Direct Channels */}
                <div className="space-y-6">
                  
                  {/* Telegram */}
                  <div className="glass-panel-card p-6 rounded-2xl border border-amber-500/20 flex items-center gap-5 glass-panel-hover">
                    <div className="w-13 h-13 rounded-2xl bg-[#0088CC]/20 text-[#29B6F6] flex items-center justify-center shrink-0 border border-[#29B6F6]/30">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Canal Telegram Officiel</h4>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Analyses quotidiennes, alertes setups et signaux de trading.</p>
                      <button 
                        onClick={() => showToast('Redirection vers le canal Telegram officiel...', 'info')}
                        className="text-xs gold-gradient-text font-bold mt-2 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Rejoindre la communauté</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                      </button>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="glass-panel-card p-6 rounded-2xl border border-amber-500/20 flex items-center gap-5 glass-panel-hover">
                    <div className="w-13 h-13 rounded-2xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 border border-[#25D366]/30">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Support WhatsApp Admin</h4>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Assistance rapide pour l'approbation de votre compte Weltrade.</p>
                      <button 
                        onClick={() => showToast('Ouverture du support WhatsApp...', 'info')}
                        className="text-xs gold-gradient-text font-bold mt-2 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Discuter sur WhatsApp</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                      </button>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="glass-panel-card p-6 rounded-2xl border border-amber-500/20 flex items-center gap-5 glass-panel-hover">
                    <div className="w-13 h-13 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/30">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Courriel Officiel</h4>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Pour tout partenariat ou question académique.</p>
                      <p className={`text-xs font-mono mt-1 font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>contact@goftradeacademy.com</p>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className={`py-14 mt-20 relative border-t border-amber-500/20 transition-colors ${
        isDark ? 'bg-[#050608]' : 'bg-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Risk Warning Box */}
          <div className={`p-6 sm:p-7 rounded-2xl border-2 relative overflow-hidden glow-gold ${
            isDark ? 'bg-[#0C0E14] border-amber-500/35' : 'bg-white border-amber-500/40 shadow-sm'
          }`}>
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-500 shrink-0 border border-amber-500/30 mt-0.5">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-amber-500 uppercase tracking-wider">
                    AVERTISSEMENT OFFICIEL SUR LES RISQUES DE MARCHÉ & CADRE ÉDUCATIF
                  </h4>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Le trading sur marge des instruments financiers (Forex, CFD, Matières Premières, Cryptomonnaies) présente un caractère hautement spéculatif et expose les investisseurs à un risque élevé de pertes en capital rapides dues à l'effet de levier. Entre <strong>74% et 89% des comptes d'investisseurs particuliers</strong> perdent de l'argent lorsqu'ils négocient des CFD. N'investissez jamais des fonds que vous ne pouvez pas vous permettre de perdre.
                </p>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <strong>GOF Trade Academy</strong> est une plateforme dédiée exclusivement à la formation technique et à la pédagogie financière. Aucune information, signal ou analyse partagée sur ce site ou dans nos canaux de communication ne constitue un conseil en investissement personnalisé au sens des dispositions réglementaires financières (AMF / FSCA / CySEC). Tout utilisateur demeure seul responsable de ses décisions d'investissement et de la gestion de ses fonds chez son courtier partenaire.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2 space-y-4">
              <div 
                onClick={() => handleNavigate('home')} 
                className="flex items-center gap-3 cursor-pointer group w-fit"
              >
                <div className={`relative p-1 rounded-xl border border-amber-500/30 shadow-lg ${isDark ? 'bg-black/70' : 'bg-slate-900'}`}>
                  <img 
                    src={LOGO_SRC} 
                    alt="GOF Trade Academy Logo" 
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <div>
                  <p className="font-extrabold text-base tracking-tight gold-gradient-text leading-tight">
                    GOF TRADE ACADEMY
                  </p>
                  <p className={`text-[10px] tracking-widest uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Apprendre • Analyser • Réussir
                  </p>
                </div>
              </div>

              <p className={`text-xs leading-relaxed max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                L'académie référence pour l'apprentissage du trading institutionnel avec la Flash Entry Strategy. Formations pratiques et accompagnement sur-mesure pour les débutants.
              </p>
            </div>

            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2 ${isDark ? 'text-white border-neutral-800' : 'text-slate-900 border-slate-300'}`}>
                Navigation
              </h4>
              <ul className={`space-y-2.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <li>
                  <button onClick={() => handleNavigate('home')} className="hover:text-amber-500 transition-colors cursor-pointer">
                    Accueil
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('about')} className="hover:text-amber-500 transition-colors cursor-pointer">
                    À Propos de l'Académie
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('courses-catalog')} className="hover:text-amber-500 transition-colors cursor-pointer">
                    Formations Débutant
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('student-portal')} className="hover:text-amber-500 transition-colors cursor-pointer">
                    Espace Cours Élève
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2 ${isDark ? 'text-white border-neutral-800' : 'text-slate-900 border-slate-300'}`}>
                Partenariat Officiel
              </h4>
              <p className={`text-[11px] leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Accès offert grâce à notre courtier partenaire agréé <strong>Weltrade</strong>.
              </p>
              <a
                href={WELTRADE_AFFILIATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors"
              >
                <span>Inscription sécurisée Weltrade</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          <div className={`pt-8 border-t text-center text-xs flex flex-col sm:flex-row justify-between items-center gap-4 ${
            isDark ? 'border-neutral-900 text-slate-400' : 'border-slate-300 text-slate-600'
          }`}>
            <p>&copy; {new Date().getFullYear()} GOF Trade Academy. Tous droits réservés.</p>
            <div className="flex space-x-6 text-xs">
              <button 
                onClick={() => setLegalModal('mentions')} 
                className="hover:text-amber-500 transition-colors cursor-pointer underline"
              >
                Mentions Légales
              </button>
              <button 
                onClick={() => setLegalModal('privacy')} 
                className="hover:text-amber-500 transition-colors cursor-pointer underline"
              >
                Politique de Confidentialité
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* ================= MODALE EXPLICATIVE: "OÙ TROUVER MON ID WELTRADE ?" ================= */}
      {showIdHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className={`border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative glow-gold-lg ${
            isDark ? 'bg-[#0D0F16]' : 'bg-white'
          }`}>
            
            <button
              onClick={() => setShowIdHelpModal(false)}
              className={`absolute top-5 right-5 p-2 rounded-xl border cursor-pointer ${
                isDark ? 'text-neutral-400 hover:text-white bg-neutral-900 border-neutral-800' : 'text-slate-600 hover:text-black bg-slate-100 border-slate-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center border border-amber-500/30">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Où trouver mon ID Weltrade ?
              </h3>
            </div>

            <p className={`text-xs mb-6 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Votre identifiant Weltrade est le numéro de compte de trading à 7 ou 8 chiffres associé à votre profil. Suivez ces 3 étapes simples :
            </p>

            {/* Step-by-step Visual Mockup */}
            <div className="space-y-3.5 mb-6">
              
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                isDark ? 'bg-[#121520] border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="w-6 h-6 rounded-full bg-amber-400 text-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Connectez-vous à votre Espace Client</p>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Rendez-vous sur Weltrade avec vos identifiants.</p>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                isDark ? 'bg-[#121520] border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="w-6 h-6 rounded-full bg-amber-400 text-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Accédez à l'onglet "Mes Comptes"</p>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Dans le menu principal, cliquez sur "Comptes de trading réels".</p>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border border-amber-500/30 flex items-start gap-3 ${
                isDark ? 'bg-[#121520]' : 'bg-amber-50/70'
              }`}>
                <span className="w-6 h-6 rounded-full gold-gradient-btn text-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="text-xs font-bold text-amber-500">Repérez votre numéro de compte Réel</p>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Il s'agit du numéro affiché en tête de votre compte (Exemple : <strong className="font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">8934521</strong>). Copiez-le simplement !
                  </p>
                </div>
              </div>

            </div>

            {/* Illustration Card */}
            <div className="p-4 rounded-xl bg-black border border-amber-500/30 mb-6 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-500 border-b border-neutral-800 pb-2 mb-2 text-[10px]">
                <span>WELTRADE DASHBOARD</span>
                <span className="text-emerald-400">● LIVE CONNECTED</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-400 text-[10px]">Compte Standard MT5</p>
                  <p className="text-white font-bold text-sm">ID: <span className="text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/40">8934521</span></p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">Actif</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={WELTRADE_AFFILIATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-1/2 gold-gradient-btn py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <span>Ouvrir Weltrade</span>
                <ExternalLink className="w-3.5 h-3.5 text-black" />
              </a>

              <button
                type="button"
                onClick={() => setShowIdHelpModal(false)}
                className={`w-full sm:w-1/2 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer ${
                  isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                }`}
              >
                J'ai compris
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODALE SUCCÈS WELTRADE (INVITATION TELEGRAM / WHATSAPP) ================= */}
      {showSuccessModal && submittedWeltradeData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className={`border-2 border-amber-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative glow-gold-lg text-center ${
            isDark ? 'bg-[#0C0E15]' : 'bg-white'
          }`}>
            
            <button
              onClick={() => setShowSuccessModal(false)}
              className={`absolute top-5 right-5 p-2 rounded-xl border cursor-pointer ${
                isDark ? 'text-neutral-400 hover:text-white bg-neutral-900 border-neutral-800' : 'text-slate-600 hover:text-black bg-slate-100 border-slate-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-3xl gold-gradient-btn text-black flex items-center justify-center mx-auto mb-5 shadow-xl">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs font-black uppercase tracking-widest text-amber-500">
              Demande d'Accès Enregistrée
            </span>
            <h3 className={`text-2xl font-black mt-1 mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Félicitations, {submittedWeltradeData.fullname} !
            </h3>
            
            <p className={`text-xs leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Votre identifiant Weltrade <strong className="text-amber-500 font-mono font-bold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">{submittedWeltradeData.weltradeId}</strong> a bien été transmis à nos administrateurs. L'activation de votre Espace Cours est effectuée en moins de 24 heures.
            </p>

            {/* Direct Action Box */}
            <div className={`p-5 rounded-2xl border border-amber-500/30 text-left mb-6 space-y-3 ${
              isDark ? 'bg-[#121522]' : 'bg-amber-50/60'
            }`}>
              <p className={`text-xs font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Sparkles className="w-4 h-4 text-amber-500" />
                Accélérez votre validation & Rejoignez la communauté :
              </p>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Signalez dès maintenant votre inscription sur WhatsApp à notre équipe ou rejoignez le canal Telegram pour recevoir nos analyses de marché quotidiennes gratuites !
              </p>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    showToast('Redirection vers le canal Telegram officiel...', 'info');
                    setShowSuccessModal(false);
                  }}
                  className="py-3 px-4 rounded-xl bg-[#0088CC] hover:bg-[#0077B5] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Canal Telegram</span>
                </button>

                <button
                  onClick={() => {
                    showToast('Ouverture du support WhatsApp pour validation...', 'info');
                    setShowSuccessModal(false);
                  }}
                  className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  <span>WhatsApp Admin</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                handleNavigate('student-portal');
              }}
              className="w-full gold-gradient-btn py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Accéder à l'Espace Cours (Aperçu)</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

          </div>
        </div>
      )}

      {/* ================= MODALE MENTIONS LÉGALES & CONFIDENTIALITÉ ================= */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className={`border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto ${
            isDark ? 'bg-[#0D0F16]' : 'bg-white'
          }`}>
            
            <button
              onClick={() => setLegalModal(null)}
              className={`absolute top-5 right-5 p-2 rounded-xl border cursor-pointer ${
                isDark ? 'text-neutral-400 hover:text-white bg-neutral-900 border-neutral-800' : 'text-slate-600 hover:text-black bg-slate-100 border-slate-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {legalModal === 'mentions' ? (
              <div className={`space-y-4 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  Mentions Légales — GOF Trade Academy
                </h3>
                <p>
                  <strong>Éditeur de la plateforme :</strong> GOF Trade Academy, organisme indépendant d'enseignement technique et de recherche appliquée sur les marchés financiers.
                </p>
                <p>
                  <strong>Propriété intellectuelle :</strong> L'ensemble des modules, vidéos, supports pédagogiques et la dénomination <em>Flash Entry Strategy</em> sont la propriété exclusive de GOF Trade Academy. Toute reproduction, distribution ou commercialisation sans autorisation formelle écrite est strictement prohibée.
                </p>
                <p>
                  <strong>Nature des prestations :</strong> GOF Trade Academy propose exclusivement des formations théoriques et pratiques à caractère pédagogique. La plateforme n'opère aucun service de placement financier, de gestion sous mandat ou de réception-transmission d'ordres pour compte de tiers.
                </p>
                <p>
                  <strong>Courtier Partenaire :</strong> Le courtier Weltrade opère en tant qu'entité financière indépendante régulée selon ses propres agréments de juridiction. GOF Trade Academy ne collecte aucun dépôt d'investissement et n'a jamais accès aux fonds des utilisateurs.
                </p>
              </div>
            ) : (
              <div className={`space-y-4 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Lock className="w-5 h-5 text-amber-500" />
                  Politique de Confidentialité & Protection des Données
                </h3>
                <p>
                  <strong>Collecte des données :</strong> Les seules données collectées sur cette plateforme (Nom, Email, ID Weltrade) sont destinées exclusivement à la vérification de votre compte pour débloquer votre accès à l'Espace Cours.
                </p>
                <p>
                  <strong>Sécurité & Non-cession :</strong> Vos données ne font l'objet d'aucune revente, cession ou utilisation publicitaire extérieure. Elles sont stockées de façon chiffrée et sécurisée.
                </p>
                <p>
                  <strong>Droits d'accès et de rectification :</strong> Vous bénéficiez à tout moment d'un droit de consultation, modification ou suppression définitive de vos informations en contactant notre support à <em>contact@goftradeacademy.com</em>.
                </p>
              </div>
            )}

            <div className={`pt-6 mt-6 border-t flex justify-end ${isDark ? 'border-neutral-800' : 'border-slate-200'}`}>
              <button
                onClick={() => setLegalModal(null)}
                className="gold-gradient-btn px-6 py-2.5 rounded-xl font-bold text-xs cursor-pointer text-black"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODALE LISTE D'ATTENTE VIP (PROGRAMME 2) ================= */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className={`border-2 border-amber-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative glow-gold-lg max-h-[92vh] overflow-y-auto ${
            isDark ? 'bg-[#0D0F16]' : 'bg-white text-slate-900'
          }`}>
            
            <button
              onClick={() => setShowVipModal(false)}
              className={`absolute top-5 right-5 p-2 rounded-xl border cursor-pointer transition-colors ${
                isDark ? 'text-neutral-400 hover:text-white bg-neutral-900 border-neutral-800' : 'text-slate-600 hover:text-black bg-slate-100 border-slate-200'
              }`}
              aria-label="Fermer la modale"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl gold-gradient-btn text-black flex items-center justify-center shrink-0 shadow-md">
                <Crown className="w-6 h-6 fill-black" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-500">
                  Candidature Exclusive
                </span>
                <h3 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Masterclass Flash Entry Pro & Mentorat VIP
                </h3>
              </div>
            </div>

            <p className={`text-xs leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Ce programme d'élite offre un accompagnement sur-mesure, l'accès direct aux signaux du canal privé et des sessions en direct. Remplissez ce formulaire pour être prioritaire lors de l'ouverture de la prochaine cohorte.
            </p>

            {/* Perks reminder banner */}
            <div className={`p-3.5 rounded-xl border border-amber-500/25 mb-6 grid grid-cols-2 gap-2 text-[11px] font-medium ${
              isDark ? 'bg-[#121520] text-amber-300/90' : 'bg-amber-50 text-amber-900'
            }`}>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Mentorat individuel 1-sur-1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Signaux & Setups en direct</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Live Streams hebdomadaires</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Cohorte limitée à 20 places</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleVipSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  Nom complet <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Koffi Mensah"
                  value={vipForm.fullname}
                  onChange={(e) => setVipForm({ ...vipForm, fullname: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none ${
                    isDark 
                      ? 'bg-[#151824] border-neutral-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                  }`}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Adresse Email <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="koffi@exemple.com"
                    value={vipForm.email}
                    onChange={(e) => setVipForm({ ...vipForm, email: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none ${
                      isDark 
                        ? 'bg-[#151824] border-neutral-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Numéro WhatsApp (avec indicatif) <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+225 07 00 00 00"
                    value={vipForm.whatsapp}
                    onChange={(e) => setVipForm({ ...vipForm, whatsapp: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none ${
                      isDark 
                        ? 'bg-[#151824] border-neutral-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  Votre niveau d'expérience actuel <span className="text-amber-500">*</span>
                </label>
                <select
                  value={vipForm.experience}
                  onChange={(e) => setVipForm({ ...vipForm, experience: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none cursor-pointer ${
                    isDark 
                      ? 'bg-[#151824] border-neutral-800 text-white focus:border-amber-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                  }`}
                >
                  <option value="Débutant complet (0 à 3 mois)">Débutant complet (0 à 3 mois)</option>
                  <option value="Intermédiaire (Moins d'un an)">Intermédiaire (Moins d'un an)</option>
                  <option value="Trader expérimenté (1 à 3 ans)">Trader expérimenté (1 à 3 ans)</option>
                  <option value="Candidat Prop Firm / En quête de régularité">Candidat Prop Firm / En quête de régularité</option>
                  <option value="Trader pro cherchant l'optimisation R:R">Trader pro cherchant l'optimisation R:R</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  Vos objectifs ou questions spécifiques (optionnel)
                </label>
                <textarea
                  rows={3}
                  placeholder="Partagez vos ambitions (ex : valider un challenge Prop Firm 100k$, perfectionner le timing d'entrée sur l'or...)"
                  value={vipForm.message}
                  onChange={(e) => setVipForm({ ...vipForm, message: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none resize-none ${
                    isDark 
                      ? 'bg-[#151824] border-neutral-800 text-white focus:border-amber-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                  }`}
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="w-full sm:w-2/3 gold-gradient-btn py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Crown className="w-4 h-4 fill-black" />
                  <span>Valider ma Candidature VIP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowVipModal(false)}
                  className={`w-full sm:w-1/3 py-3.5 rounded-xl font-bold text-xs transition-colors cursor-pointer border ${
                    isDark ? 'bg-neutral-900 border-neutral-800 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Annuler
                </button>
              </div>

              <p className={`text-[10px] text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                🔒 Données strictement confidentielles · Vous serez contacté par message WhatsApp sous 24h.
              </p>
            </form>

          </div>
        </div>
      )}

      {/* ================= MODALE CONNEXION ADMINISTRATEUR ================= */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className={`border-2 border-amber-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative glow-gold-lg ${
            isDark ? 'bg-[#0D0F16]' : 'bg-white text-slate-900'
          }`}>
            
            <button
              onClick={() => {
                setShowAdminLoginModal(false);
                setAdminPasswordError(null);
                setAdminPasswordInput('');
              }}
              className={`absolute top-5 right-5 p-2 rounded-xl border cursor-pointer transition-colors ${
                isDark ? 'text-neutral-400 hover:text-white bg-neutral-900 border-neutral-800' : 'text-slate-600 hover:text-black bg-slate-100 border-slate-200'
              }`}
              aria-label="Fermer la modale"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl gold-gradient-btn text-black flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock className="w-7 h-7 fill-black" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-500">
                Accès Restreint
              </span>
              <h3 className={`text-2xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Connexion Administrateur
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Entrez le mot de passe maître pour déverrouiller le Tableau de Bord (validations Weltrade, liste VIP, gestion des cours).
              </p>
            </div>

            {adminPasswordError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{adminPasswordError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  Mot de passe administrateur <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? "text" : "password"}
                    required
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      if (adminPasswordError) setAdminPasswordError(null);
                    }}
                    placeholder="••••••••••••"
                    autoFocus
                    className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm transition-all outline-none ${
                      isDark 
                        ? 'bg-[#151824] border-neutral-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-amber-500 cursor-pointer"
                    aria-label="Afficher/masquer le mot de passe"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="w-full sm:w-2/3 gold-gradient-btn py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <KeyRound className="w-4 h-4 text-black" />
                  <span>Se connecter</span>
                </button>

                <button
                  type="button"
                  onClick={handleExitAdmin}
                  className={`w-full sm:w-1/3 py-3.5 rounded-xl font-bold text-xs transition-colors cursor-pointer border ${
                    isDark ? 'bg-neutral-900 border-neutral-800 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Annuler
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ================= MODALE RESTRICTION COURS: ACCÈS RÉSERVÉ ================= */}
      {showCourseAccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className={`border-2 border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative glow-gold-lg max-h-[92vh] overflow-y-auto ${
            isDark ? 'bg-[#0D0F16]' : 'bg-white text-slate-900'
          }`}>
            
            <button
              onClick={() => setShowCourseAccessModal(false)}
              className={`absolute top-5 right-5 p-2 rounded-xl border cursor-pointer transition-colors ${
                isDark ? 'text-neutral-400 hover:text-white bg-neutral-900 border-neutral-800' : 'text-slate-600 hover:text-black bg-slate-100 border-slate-200'
              }`}
              aria-label="Fermer la modale"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-3xl gold-gradient-btn text-black flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse-gold">
                <Lock className="w-8 h-8 fill-black" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-500">
                Accès Réservé
              </span>
              <h3 className={`text-2xl sm:text-3xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Débloquez vos formations
              </h3>
              <p className={`text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Ce module et l'ensemble du cursus Flash Entry Strategy sont réservés à nos étudiants. Choisissez votre formule d'accès pour débloquer immédiatement vos cours :
              </p>
            </div>

            {/* 2 Options Cards Grid */}
            <div className="grid md:grid-cols-2 gap-5 mb-6">
              
              {/* Option 1: Weltrade (Gratuit) */}
              <div className={`p-6 rounded-2xl border-2 flex flex-col justify-between transition-all card-hover-interactive ${
                isDark ? 'bg-[#121520] border-amber-500/30' : 'bg-slate-50 border-amber-500/35 shadow-xs'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
                      Option 1 · Gratuit
                    </span>
                    <span className="text-xs font-black text-emerald-400">100% OFFERT</span>
                  </div>
                  <h4 className={`text-lg font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Valider mon ID Weltrade
                  </h4>
                  <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Ouvrez un compte chez notre courtier partenaire officiel Weltrade et soumettez votre ID pour un déblocage gratuit sous 24h.
                  </p>
                  <ul className={`space-y-2 text-[11px] mb-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Aucun frais d'inscription</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Vos fonds de trading vous appartiennent</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Validation par l'équipe administrative</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setShowCourseAccessModal(false);
                    scrollToWeltrade();
                  }}
                  className={`w-full py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                    isDark ? 'bg-neutral-900 hover:bg-neutral-800 text-amber-400 border-amber-500/30 hover:border-amber-400' : 'bg-white hover:bg-slate-100 text-amber-700 border-amber-500/40 shadow-xs'
                  }`}
                >
                  <span>Valider mon ID Weltrade</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Option 2: Maketou VIP (Payant - Accès Immédiat) */}
              <div className={`p-6 rounded-2xl border-2 border-amber-500 relative flex flex-col justify-between glow-gold card-hover-interactive ${
                isDark ? 'bg-gradient-to-b from-[#181B26] to-[#0E1017]' : 'bg-gradient-to-b from-amber-50/90 to-white'
              }`}>
                <div className="absolute -top-3 right-5 bg-gradient-to-r from-amber-400 to-yellow-300 text-black text-[10px] font-black px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-black" />
                  ACCÈS INSTANTANÉ
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-amber-500 text-black">
                      Option 2 · VIP Immédiat
                    </span>
                  </div>
                  <h4 className={`text-lg font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Obtenir le Pass VIP Maketou
                  </h4>
                  <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Débloquez instantanément tous les modules, les signaux en direct, les lives hebdomadaires et le coaching privé.
                  </p>
                  <ul className={`space-y-2 text-[11px] mb-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Déblocage 100% immédiat et automatique</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Accès Canal VIP Signaux & Opportunités</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Paiement sécurisé via Maketou</span>
                    </li>
                  </ul>
                </div>

                <a
                  href={MAKETOU_VIP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full gold-gradient-btn py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/30"
                >
                  <Crown className="w-4 h-4 fill-black" />
                  <span>Obtenir le Pass VIP (Maketou)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-black" />
                </a>
              </div>

            </div>

            <p className={`text-[11px] text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Besoin d'un accompagnement personnalisé ? Contactez directement nos formateurs sur WhatsApp ou Telegram.
            </p>

          </div>
        </div>
      )}

      {/* ================= MODALE CONFIRMATION ACCÈS VIP (RETOUR PAIEMENT MAKETOU) ================= */}
      {showVipCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className={`border-2 border-amber-500/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative glow-gold-lg text-center ${
            isDark ? 'bg-[#0D0F16]' : 'bg-white text-slate-900'
          }`}>
            
            <button
              onClick={() => setShowVipCelebrationModal(false)}
              className={`absolute top-5 right-5 p-2 rounded-xl border cursor-pointer transition-colors ${
                isDark ? 'text-neutral-400 hover:text-white bg-neutral-900 border-neutral-800' : 'text-slate-600 hover:text-black bg-slate-100 border-slate-200'
              }`}
              aria-label="Fermer la modale"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 rounded-3xl gold-gradient-btn text-black flex items-center justify-center mx-auto mb-5 shadow-2xl animate-pulse-gold">
              <Crown className="w-10 h-10 fill-black" />
            </div>

            <span className="text-xs font-black uppercase tracking-widest text-amber-500">
              Paiement Maketou Confirmé
            </span>
            <h3 className={`text-2xl sm:text-3xl font-black mt-1 mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Félicitations & Bienvenue VIP !
            </h3>
            
            <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Votre statut <strong className="text-amber-500 font-bold">Élève VIP GOF Trade Academy</strong> est désormais activé. Toutes les formations, modules exclusifs et ressources téléchargeables sont débloqués.
            </p>

            <div className={`p-4 rounded-2xl border border-amber-500/30 text-left mb-6 space-y-2.5 ${
              isDark ? 'bg-[#121522]' : 'bg-amber-50/70'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
                <Sparkles className="w-4 h-4" />
                <span>Privilèges débloqués sur votre compte :</span>
              </div>
              <ul className={`text-xs space-y-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <li>✓ Accès illimité à l'intégralité des modules vidéo</li>
                <li>✓ Téléchargement des PDF, checklists & modèles de trading</li>
                <li>✓ Accès prioritaire au Canal VIP & lives hebdomadaires</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setShowVipCelebrationModal(false);
                setActivePage('student-portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full gold-gradient-btn py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Accéder à mes formations débloquées</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
