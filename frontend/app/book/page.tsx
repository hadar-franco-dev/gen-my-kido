"use client"

import { Book, ArrowRight } from "lucide-react"
import Link from "next/link"
import FlipBook from "../components/FlipBook"
import { motion } from "framer-motion"
import Image from "next/image"

export default function BookPage() {
  // Transform the pages to match the Page interface
  const bookPages = [
    // Pages 1-2: Cover and introduction
    {
      content: (
        <div className="text-right p-6">
          <h2 className="text-2xl font-bold mb-4">שלום כיתה א׳</h2>
          <div className="whitespace-pre-wrap">סיפור מיוחד עבור דניאל</div>
        </div>
      ),
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      title: "שלום כיתה א׳",
      text: "סיפור מיוחד עבור דניאל"
    },
    {
      content: (
        <div className="text-right p-6">
          <h2 className="text-2xl font-bold mb-4">היום הראשון בבית הספר</h2>
          <div className="whitespace-pre-wrap">דניאל התעורר בבוקר מתרגש מאוד. היום הוא היום הראשון שלו בכיתה א׳!\n\nאמא עזרה לו להתלבש בבגדים החדשים שקנו במיוחד ליום הזה. הוא לבש חולצה כחולה יפה ומכנסיים נוחים.</div>
        </div>
      ),
      title: "היום הראשון בבית הספר",
      text: "דניאל התעורר בבוקר מתרגש מאוד. היום הוא היום הראשון שלו בכיתה א׳!\n\nאמא עזרה לו להתלבש בבגדים החדשים שקנו במיוחד ליום הזה. הוא לבש חולצה כחולה יפה ומכנסיים נוחים."
    },

    // Page 3: Text only
    {
      type: "text",
      title: "בדרך לבית הספר",
      content:
        'אבא של דניאל הכין לו כריך טעים וארז אותו בקופסת האוכל החדשה שלו.\n\n"אתה מוכן?" שאל אבא בחיוך.\n\n"כן!" ענה דניאל בהתרגשות, "אני כבר רוצה להכיר חברים חדשים!"',
    },

    // Page 4: Illustration only
    {
      content: (
        <div className="relative w-full h-full">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ezgif-frame-004-EE2TF6alJB15qTCyoP4zBWQFMa844A.png"
            alt="Story illustration"
            fill
            className="object-contain"
          />
        </div>
      ),
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      isImage: true
    },

    // Page 5: Text only
    {
      type: "text",
      title: "פגישה עם המורה",
      content:
        'כשהגיעו לבית הספר, המורה רותי קיבלה את פניהם בחיוך גדול.\n\n"שלום דניאל! ברוך הבא לכיתה א׳!" אמרה המורה רותי.\n\nדניאל הרגיש קצת ביישן, אבל החיוך של המורה גרם לו להרגיש יותר טוב.',
    },

    // Page 6: Illustration only
    {
      content: (
        <div className="relative w-full h-full">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ezgif-frame-004-EE2TF6alJB15qTCyoP4zBWQFMa844A.png"
            alt="Story illustration"
            fill
            className="object-contain"
          />
        </div>
      ),
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      isImage: true
    },

    // Page 7: Text only
    {
      type: "text",
      title: "חברים חדשים",
      content:
        'בכיתה, דניאל פגש ילדים חדשים. הוא התיישב ליד ילד בשם יובל.\n\n"גם אני קצת מתרגש," לחש יובל, "אבל אמא שלי אמרה שנהנה מאוד בכיתה א׳."\n\nדניאל חייך. הוא כבר הרגיש שהוא ויובל יהיו חברים טובים.',
    },

    // Page 8: Illustration only
    {
      content: (
        <div className="relative w-full h-full">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ezgif-frame-004-EE2TF6alJB15qTCyoP4zBWQFMa844A.png"
            alt="Story illustration"
            fill
            className="object-contain"
          />
        </div>
      ),
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      isImage: true
    },

    // NEW PAGES - Adding 4 more pages (9-12)
    // Page 9: Text only
    {
      type: "text",
      title: "שיעור ראשון",
      content:
        'המורה רותי התחילה את השיעור הראשון. היא לימדה את הילדים על האותיות.\n\n"היום נלמד על האות א׳," אמרה המורה רותי בקול נעים.\n\nדניאל הקשיב בריכוז. הוא אהב לצייר את האותיות במחברת החדשה שלו.',
    },

    // Page 10: Illustration only
    {
      content: (
        <div className="relative w-full h-full">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ezgif-frame-004-EE2TF6alJB15qTCyoP4zBWQFMa844A.png"
            alt="Story illustration"
            fill
            className="object-contain"
          />
        </div>
      ),
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      isImage: true
    },

    // Page 11: Text only
    {
      type: "text",
      title: "זמן ההפסקה",
      content:
        'כשהגיע זמן ההפסקה, כל הילדים יצאו לחצר. דניאל ויובל שיחקו יחד בכדור.\n\n"אתה טוב מאוד בכדורגל!" אמר יובל לדניאל.\n\nדניאל חייך. "גם אתה! אולי נשחק יחד גם מחר?"',
    },

    // Page 12: Illustration only
    {
      content: (
        <div className="relative w-full h-full">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ezgif-frame-004-EE2TF6alJB15qTCyoP4zBWQFMa844A.png"
            alt="Story illustration"
            fill
            className="object-contain"
          />
        </div>
      ),
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      isImage: true
    },

    // Pages 13-14: Conclusion
    {
      type: "text",
      title: "סוף היום",
      content:
        'בסוף היום, אמא באה לאסוף את דניאל. הוא רץ אליה בהתרגשות.\n\n"איך היה היום הראשון?" שאלה אמא.\n\nדניאל חייך חיוך גדול ואמר: "היה נהדר! למדנו דברים חדשים והכרתי חברים!"',
    },
    {
      type: "end",
      title: "יום מוצלח!",
      content: 'בסוף היום, דניאל חזר הביתה עם חיוך גדול.\n\n"היה נהדר! אני כבר מחכה למחר!"',
      background: "linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)",
    },
  ]

  return (
    <div className="container mx-auto py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8 border-b pb-4"
      >
        <div className="flex items-center">
          <Book className="w-8 h-8 text-primary ml-2" />
          <h2 className="text-2xl font-bold">MyKidStory.ai</h2>
        </div>
        <Link href="/cover" className="flex items-center text-primary hover:text-primary/80 transition-colors">
          <ArrowRight className="w-5 h-5 ml-1 rotate-180" />
          <span>חזרה לבחירת כריכה</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold mb-4">הסיפור שלך</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          דפדפו בין דפי הספר באמצעות החיצים או מקשי החיצים במקלדת. לחצו על כפתור העריכה (סמל העיפרון) כדי לערוך את הטקסט
          בכל עמוד.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto mb-16">
        <FlipBook pages={bookPages} width={900} height={500} editable={true} />
      </div>

      <div className="text-center mt-10">
        <Link href="/categories">
          <button className="apple-button inline-flex items-center">חזרה לקטגוריות</button>
        </Link>
      </div>
    </div>
  )
}

