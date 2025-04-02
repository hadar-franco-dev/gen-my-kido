"use client"

import { createContext, useState, useContext, useEffect, type ReactNode } from "react"

type Language = "he" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionaries
const translations = {
  he: {
    // Header
    "back.home": "חזרה לדף הבית",

    // Hero
    "hero.title": "MyKidStory.ai",
    "hero.subtitle": "הכינו את ילדיכם לחוויות הראשונות בחיים!",
    "hero.description": "באמצעות סיפרונים המשלבים מידע, תמונות, סרטונים, דפי צביעה ועוד",
    "hero.cta": "התחילו כאן",

    // WearYourStory
    "story.title": "בואו ליצור את הסיפור שלכם",
    "story.description1": "אצלנו ב- MyKidStory.ai ילדיכם הם גיבורי הספר!",
    "story.description2":
      "כל ספר הוא מרחב לדמיון של ילדכם ומכיל מידע טקסטואלי, ויזואלי וחינוכי, שיכין את ילדיכם להתמודד עם חוויות חדשות בחייהם 🌈",
    "story.description3":
      "העיצובים שלנו משלבים אסתטיקה מינימליסטית עם אלמנטים יצירתיים, המאפשרים לילדים להזדהות עם הסיפור וללמוד מגוון נושאים חדשים בדרך מהנה וחדשנית ✨",
    "story.cta": "גלו את האוסף שלנו",

    // Timeline
    "timeline.title": "יוצרים את הספר החדש ב-3 צעדים פשוטים",
    "timeline.step1.title": "יוצרים את גיבור הסיפור - הילד/ה שלכם!",
    "timeline.step1.description": "ממלאים שם, גיל ומעלים תמונה שלו/ה",
    "timeline.step2.title": "בוחרים את עלילת הסיפור",
    "timeline.step2.description": "מתוך מגוון קטגוריות של ידע כללי ושל חוויות ראשונות בחיים",
    "timeline.step3.title": "מקבלים את הסיפור שלכם",
    "timeline.step3.description":
      "צופים בטכנולוגיה שלנו בפעולה ✨ המייצרת לכם סיפור המשלב בתוכו טקסט חינוכי לצד איורים, דפי צביעה וסרטונים. משלמים ובוחרים פורמט הורדה מתוך מגוון אפשרויות",

    // PortfolioGrid
    "portfolio.title": "המוצרים שלנו",
    "portfolio.description":
      "סיפורים מותאמים אישית לילדים במיגוון נושאים המשלבים טקסט חינוכי לצד איורים, סרטונים ודפי צביעה",
    "portfolio.category1": "חוויות ראשונות",
    "portfolio.category2": "ידע כללי",
    "portfolio.viewStory": "צפו בסיפור",

    // FeatureCarousel
    "features.title": "למה לבחור בנו",
    "features.feature1.title": "תוכן חינוכי מוקפד",
    "features.feature1.description":
      "השקעה מעמיקה בטקסטים ובמסרים החינוכיים, תוך מעורבות של אנשי מקצוע מתחום החינוך להבטחת איכות גבוהה",
    "features.feature2.title": "חוויה אינטראקטיבית ומעשירה לילדים",
    "features.feature2.description":
      "שילוב אלמנטים יצירתיים של איורים, סרטונים ודפי צביעה להעצמת החיבור של הילד לסיפור",
    "features.feature3.title": "תמיכה במיגוון פורמטים",
    "features.feature3.description":
      "אפשרות להורדה וצפייה בספר הדיגיטלי במכשירים שונים, לצד אפשרות הורדה והדפסה כעותק פיזי עבור הילד",

    // Contact Form
    "contact.title": "צרו קשר",
    "contact.description": "נשמח לשמוע מכם. מלאו את הטופס למטה ואנו נחזור אליכם בהקדם האפשרי.",
    "contact.name": "שם",
    "contact.email": "אימייל",
    "contact.phone": "מספר טלפון",
    "contact.message": "הודעה",
    "contact.required": "שדות חובה",
    "contact.send": "שלח הודעה",
    "contact.sending": "שולח...",

    // Newsletter
    "newsletter.title": "הישארו מעודכנים",
    "newsletter.description": "הירשמו לניוזלטר שלנו לקבלת עדכונים על המוצרים והקסמים החדשים שלנו",
    "newsletter.placeholder": "הזינו את האימייל שלכם",
    "newsletter.subscribe": "הרשמה",
    "newsletter.subscribing": "נרשם...",

    // Upload Page
    "upload.title": "ספרו לנו על הילד/ה שלכם",
    "upload.childName": "שם הילד/ה",
    "upload.childAge": "גיל",
    "upload.ageRange": "(0-14)",
    "upload.gender": "מין",
    "upload.boy": "בן",
    "upload.girl": "בת",
    "upload.photoTitle": "העלאת תמונת הגיבור/ה שלכם",
    "upload.faceCovered": "פנים מכוסות",
    "upload.headTilted": "ראש מוטה מעלה",
    "upload.multipleFigures": "מספר דמויות",
    "upload.clearPhoto": "צילום ישר וברור",
    "upload.dragDrop": "גרור ושחרר תמונות כאן",
    "upload.orClick": "או לחץ לבחירת קבצים",
    "upload.choosePhotos": "בחר תמונות",
    "upload.continue": "המשיכו כאן",
    "upload.uploadedPhotos": "תמונות שהועלו",
    "upload.createStory": "צור סיפור",
    "upload.clearAll": "נקה הכל",

    // Language Switcher
    language: "שפה",
    "language.en": "English",
    "language.he": "עברית",
  },
  en: {
    // Header
    "back.home": "Back to Home",

    // Hero
    "hero.title": "MyKidStory.ai",
    "hero.subtitle": "Prepare your children for their first experiences in life!",
    "hero.description": "Through stories that combine information, images, videos, coloring pages and more",
    "hero.cta": "Start Here",

    // WearYourStory
    "story.title": "Create Your Story",
    "story.description1": "At MyKidStory.ai, your children are the heroes of the book!",
    "story.description2":
      "Each book is a space for your child's imagination and contains textual, visual, and educational information that will prepare your children to deal with new experiences in their lives 🌈",
    "story.description3":
      "Our designs combine minimalist aesthetics with creative elements, allowing children to identify with the story and learn a variety of new topics in a fun and innovative way ✨",
    "story.cta": "Discover Our Collection",

    // Timeline
    "timeline.title": "Create a New Book in 3 Simple Steps",
    "timeline.step1.title": "Create the story hero - your child!",
    "timeline.step1.description": "Fill in name, age and upload their photo",
    "timeline.step2.title": "Choose the story plot",
    "timeline.step2.description": "From a variety of categories of general knowledge and first life experiences",
    "timeline.step3.title": "Receive your story",
    "timeline.step3.description":
      "Watch our technology in action ✨ creating a story that combines educational text alongside illustrations, coloring pages and videos. Pay and choose a download format from a variety of options",

    // PortfolioGrid
    "portfolio.title": "Our Products",
    "portfolio.description":
      "Personalized stories for children on a variety of topics combining educational text alongside illustrations, videos and coloring pages",
    "portfolio.category1": "First Experiences",
    "portfolio.category2": "General Knowledge",
    "portfolio.viewStory": "View Story",

    // FeatureCarousel
    "features.title": "Why Choose Us",
    "features.feature1.title": "Carefully Crafted Educational Content",
    "features.feature1.description":
      "Deep investment in texts and educational messages, with the involvement of education professionals to ensure high quality",
    "features.feature2.title": "Interactive and Enriching Experience for Children",
    "features.feature2.description":
      "Combining creative elements of illustrations, videos and coloring pages to enhance the child's connection to the story",
    "features.feature3.title": "Support for Multiple Formats",
    "features.feature3.description":
      "Option to download and view the digital book on various devices, alongside the option to download and print as a physical copy for the child",

    // Contact Form
    "contact.title": "Contact Us",
    "contact.description":
      "We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.phone": "Phone Number",
    "contact.message": "Message",
    "contact.required": "Required fields",
    "contact.send": "Send Message",
    "contact.sending": "Sending...",

    // Newsletter
    "newsletter.title": "Stay Updated",
    "newsletter.description": "Subscribe to our newsletter to receive updates about our new products and magic",
    "newsletter.placeholder": "Enter your email",
    "newsletter.subscribe": "Subscribe",
    "newsletter.subscribing": "Subscribing...",

    // Upload Page
    "upload.title": "Tell us about your child",
    "upload.childName": "Child's Name",
    "upload.childAge": "Age",
    "upload.ageRange": "(0-14)",
    "upload.gender": "Gender",
    "upload.boy": "Boy",
    "upload.girl": "Girl",
    "upload.photoTitle": "Upload your hero's photo",
    "upload.faceCovered": "Face Covered",
    "upload.headTilted": "Head Tilted Up",
    "upload.multipleFigures": "Multiple Figures",
    "upload.clearPhoto": "Clear Straight Photo",
    "upload.dragDrop": "Drag and drop images here",
    "upload.orClick": "or click to select files",
    "upload.choosePhotos": "Choose Photos",
    "upload.continue": "Continue",
    "upload.uploadedPhotos": "Uploaded Photos",
    "upload.createStory": "Create Story",
    "upload.clearAll": "Clear All",

    // Language Switcher
    language: "Language",
    "language.en": "English",
    "language.he": "עברית",
  },
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>("he")

  // Load language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "he" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // Update document direction and language attributes when language changes
  useEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.setAttribute("lang", language)
    htmlElement.setAttribute("dir", language === "he" ? "rtl" : "ltr")
    localStorage.setItem("language", language)
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

