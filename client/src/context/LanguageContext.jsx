import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    tagline: "Skip the queue, not the care",
    heroSubtitle: "Generate hospital tokens from home, track live queue positions, and arrive right when it's your turn.",
    searchHospitals: "Search Hospitals",
    myToken: "My Token",
    history: "Visit History",
    receptionistDashboard: "Receptionist Portal",
    adminDashboard: "Admin",
    selectHospital: "Select a Hospital",
    selectDepartment: "Select Department",
    generateToken: "Generate Token",
    currentToken: "Current Token",
    peopleAhead: "People Ahead",
    estimatedWait: "Estimated Wait",
    leaveNowAlert: "Leave Now Smart Alert",
    leaveNowMsg: "Your turn is approximately 10-15 minutes away! Time to head to the OPD.",
    callNext: "Call Next Patient",
    markComplete: "Mark Completed",
    markNoShow: "Mark No-Show / Skip",
    addWalkIn: "Add Walk-in Token",
    resetQueue: "Reset Queue",
    liveStatus: "Live Status",
    waiting: "Waiting",
    almostYourTurn: "Almost Your Turn",
    called: "Called",
    inProgress: "In Progress",
    completed: "Completed",
    noShow: "No-Show",
    cancelled: "Cancelled"
  },
  hi: {
    tagline: "लाइन छोड़ें, देखभाल नहीं",
    heroSubtitle: "घर बैठे अस्पताल का टोकन प्राप्त करें, लाइव टोकन ट्रैक करें और अपनी बारी पर ही अस्पताल पहुँचें।",
    searchHospitals: "अस्पताल खोजें",
    myToken: "मेरा टोकन",
    history: "पुराना इतिहास",
    receptionistDashboard: "रिसेप्शनिस्ट पोर्टल",
    adminDashboard: "एडमिन",
    selectHospital: "अस्पताल चुनें",
    selectDepartment: "विभाग चुनें",
    generateToken: "टोकन बनाएं",
    currentToken: "वर्तमान टोकन",
    peopleAhead: "आगे लोग",
    estimatedWait: "अनुमानित समय",
    leaveNowAlert: "घर से निकलने का अलर्ट",
    leaveNowMsg: "आपकी बारी लगभग 10-15 मिनट दूर है! कृपया अस्पताल ओपीडी के लिए निकलें।",
    callNext: "अगले मरीज को बुलाएं",
    markComplete: "पूरा मार्क करें",
    markNoShow: "अनुपस्थित मार्क करें",
    addWalkIn: "वॉक-इन टोकन जोड़ें",
    resetQueue: "कतार रीसेट करें",
    liveStatus: "लाइव स्थिति",
    waiting: "प्रतीक्षा में",
    almostYourTurn: "आपकी बारी आने वाली है",
    called: "बुलाया गया",
    inProgress: "जांच जारी",
    completed: "पूर्ण",
    noShow: "अनुपस्थित",
    cancelled: "रद्द"
  },
  te: {
    tagline: "క్యూ వద్దు, వైద్యమే ముఖ్యం",
    heroSubtitle: "ఇంటి నుంచే హాస్పిటల్ టోకెన్ పొందండి, లైవ్ క్యూ చూడండి మరియు మీ వంతు వచ్చినప్పుడు మాత్రమే బయలుదేరండి.",
    searchHospitals: "హాస్పిటల్స్ శోధించండి",
    myToken: "నా టోకెన్",
    history: "చరిత్ర",
    receptionistDashboard: "రిసెప్షనిస్ట్ పోర్టల్",
    adminDashboard: "అడ్మిన్",
    selectHospital: "హాస్పిటల్ ఎంచుకోండి",
    selectDepartment: "విభాగం ఎంచుకోండి",
    generateToken: "టోకెన్ తీసుకోండి",
    currentToken: "ప్రస్తుత టోకెన్",
    peopleAhead: "ముందు ఉన్నవారు",
    estimatedWait: "అంచనా సమయం",
    leaveNowAlert: "ఇప్పుడు బయలుదేరండి హెచ్చరిక",
    leaveNowMsg: "మీ వంతు రాబోతోంది (సుమారు 10-15 నిమిషాలు)! దయచేసి హాస్పిటల్‌కు బయలుదేరండి.",
    callNext: "తదుపరి రోగిని పిలవండి",
    markComplete: "పూర్తయినట్లు మార్క్ చేయండి",
    markNoShow: "హాజరు కాలేదు",
    addWalkIn: "వాక్-ఇన్ టోకెన్ జతచేయి",
    resetQueue: "క్యూ రీసెట్ చేయండి",
    liveStatus: "లైవ్ స్థితి",
    waiting: "వేచి ఉన్నారు",
    almostYourTurn: "మీ వంతు రాబోతోంది",
    called: "పిలిచారు",
    inProgress: "పరిశీలనలో ఉంది",
    completed: "పూర్తయింది",
    noShow: "రాలేదు",
    cancelled: "రద్దయింది"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('mediq_lang') || 'en');

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('mediq_lang', newLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
