"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Book, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import FlipBook from "../components/FlipBook"

// Sample cover options
const coverOptions = [
  {
    id: 1,
    name: "כריכה כחולה",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ezgif-frame-004-EE2TF6alJB15qTCyoP4zBWQFMa844A.png",
    color: "bg-blue-100",
  },
  {
    id: 2,
    name: "כריכה ירוקה",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ezgif-frame-004-EE2TF6alJB15qTCyoP4zBWQFMa844A.png",
    color: "bg-green-100",
  },
  {
    id: 3,
    name: "כריכה צהובה",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ezgif-frame-004-EE2TF6alJB15qTCyoP4zBWQFMa844A.png",
    color: "bg-yellow-100",
  },
  {
    id: 4,
    name: "כריכה סגולה",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ezgif-frame-004-EE2TF6alJB15qTCyoP4zBWQFMa844A.png",
    color: "bg-purple-100",
  },
]

// Book type options
const bookTypes = [
  { id: "illustrations", label: "ספר איורים", available: true },
  { id: "animations", label: "ספר עם סרטוני אנימציה (בקרוב)", available: false },
  { id: "coloring", label: "ספר עם דפי צביעה (בקרוב)", available: false },
]

// Sample preview pages with alternating text and illustrations - expanded to 14 pages
const previewPages = [
  // Pages 1-2: Cover and introduction
  {
    content: (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">שלום כיתה א׳</h1>
        <p className="text-xl">סיפור מיוחד עבור</p>
        <p className="text-2xl font-bold mt-2 mb-6">דניאל</p>
        <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-500">תמונת הילד</span>
        </div>
      </div>
    ),
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  },
  {
    content: (
      <div className="text-right p-4">
        <h2 className="text-xl font-bold mb-4">היום הראשון בבית הספר</h2>
        <p className="mb-4 text-sm">דניאל התעורר בבוקר מתרגש מאוד. היום הוא היום הראשון שלו בכיתה א׳!</p>
        <p className="text-sm">
          אמא עזרה לו להתלבש בבגדים החדשים שקנו במיוחד ליום הזה. הוא לבש חולצה כחולה יפה ומכנסיים נוחים.
        </p>
      </div>
    ),
    text: "דניאל התעורר בבוקר מתרגש מאוד. היום הוא היום הראשון שלו בכיתה א׳!\n\nאמא עזרה לו להתלבש בבגדים החדשים שקנו במיוחד ליום הזה. הוא לבש חולצה כחולה יפה ומכנסיים נוחים.",
    title: "היום הראשון בבית הספר",
  },

  // Page 3: Text only
  {
    content: (
      <div className="text-right p-4">
        <h2 className="text-xl font-bold mb-4">בדרך לבית הספר</h2>
        <p className="mb-4 text-sm">אבא של דניאל הכין לו כריך טעים וארז אותו בקופסת האוכל החדשה שלו.</p>
        <p className="mb-4 text-sm">"אתה מוכן?" שאל אבא בחיוך.</p>
        <p className="text-sm">"כן!" ענה דניאל בהתרגשות, "אני כבר רוצה להכיר חברים חדשים!"</p>
      </div>
    ),
    text: 'אבא של דניאל הכין לו כריך טעים וארז אותו בקופסת האוכל החדשה שלו.\n\n"אתה מוכן?" שאל אבא בחיוך.\n\n"כן!" ענה דניאל בהתרגשות, "אני כבר רוצה להכיר חברים חדשים!"',
    title: "בדרך לבית הספר",
  },

  // Page 4: Illustration only
  {
    content: (
      <div className="flex items-center justify-center h-full">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ezgif-frame-004-EE2TF6alJB15qTCyoP4zBWQFMa844A.png"
          alt="ילדה במטבח"
          className="w-4/5 h-4/5 object-cover rounded-lg"
        />
      </div>
    ),
    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    isImage: true,
  },

  // Page 5: Text only
  {
    content: (
      <div className="text-right p-4">
        <h2 className="text-xl font-bold mb-4">פגישה עם המורה</h2>
        <p className="mb-4 text-sm">כשהגיעו לבית הספר, המורה רותי קיבלה את פניהם בחיוך גדול.</p>
        <p className="mb-4 text-sm">"שלום דניאל! ברוך הבא לכיתה א׳!" אמרה המורה רותי.</p>
        <p className="text-sm">דניאל הרגיש קצת ביישן, אבל החיוך של המורה גרם לו להרגיש יותר טוב.</p>
      </div>
    ),
    text: 'כשהגיעו לבית הספר, המורה רותי קיבלה את פניהם בחיוך גדול.\n\n"שלום דניאל! ברוך הבא לכיתה א׳!" אמרה המורה רותי.\n\nדניאל הרגיש קצת ביישן, אבל החיוך של המורה גרם לו להרגיש יותר טוב.',
    title: "פגישה עם המורה",
  },

  // Page 6: Illustration only
  {
    content: (
      <div className="flex items-center justify-center h-full">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ezgif-frame-004-EE2TF6alJB15qTCyoP4zBWQFMa844A.png"
          alt="ילדה במטבח"
          className="w-4/5 h-4/5 object-cover rounded-lg"
        />
      </div>
    ),
    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    isImage: true,
  },

  // Page 7: Text only
  {
    content: (
      <div className="text-right p-4">
        <h2 className="text-xl font-bold mb-4">חברים חדשים</h2>
        <p className="mb-4 text-sm">בכיתה, דניאל פגש ילדים חדשים. הוא התיישב ליד ילד בשם יובל.</p>
        <p className="mb-4 text-sm">"גם אני קצת מתרגש," לחש יובל, "אבל אמא שלי אמרה שנהנה מאוד בכיתה א׳."</p>
        <p className="text-sm">דניאל חייך. הוא כבר הרגיש שהוא ויובל יהיו חברים טובים.</p>
      </div>
    ),
    text: 'בכיתה, דניאל פגש ילדים חדשים. הוא התיישב ליד ילד בשם יובל.\n\n"גם אני קצת מתרגש," לחש יובל, "אבל אמא שלי אמרה שנהנה מאוד בכיתה א׳."\n\nדניאל חייך. הוא כבר הרגיש שהוא ויובל יהיו חברים טובים.',
    title: "חברים חדשים",
  },

  // Page 8: Illustration only
  {
    content: (
      <div className="flex items-center justify-center h-full">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ezgif-frame-004-EE2TF6alJB15qTCyoP4zBWQFMa844A.png"
          alt="ילדה במטבח"
          className="w-4/5 h-4/5 object-cover rounded-lg"
        />
      </div>
    ),
    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    isImage: true,
  },

  // NEW PAGES - Adding 4 more pages (9-12)
  // Page 9: Text only
  {
    content: (
      <div className="text-right p-4">
        <h2 className="text-xl font-bold mb-4">שיעור ראשון</h2>
        <p className="mb-4 text-sm">המורה רותי התחילה את השיעור הראשון. היא לימדה את הילדים על האותיות.</p>
        <p className="mb-4 text-sm">"היום נלמד על האות א׳," אמרה המורה רותי בקול נעים.</p>
        <p className="text-sm">דניאל הקשיב בריכוז. הוא אהב לצייר את האותיות במחברת החדשה שלו.</p>
      </div>
    ),
    text: 'המורה רותי התחילה את השיעור הראשון. היא לימדה את הילדים על האותיות.\n\n"היום נלמד על האות א׳," אמרה המורה רותי בקול נעים.\n\nדניאל הקשיב בריכוז. הוא אהב לצייר את האותיות במחברת החדשה שלו.',
    title: "שיעור ראשון",
  },

  // Page 10: Illustration only
  {
    content: (
      <div className="flex items-center justify-center h-full">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ezgif-frame-004-EE2TF6alJB15qTCyoP4zBWQFMa844A.png"
          alt="ילדה במטבח"
          className="w-4/5 h-4/5 object-cover rounded-lg"
        />
      </div>
    ),
    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    isImage: true,
  },

  // Page 11: Text only
  {
    content: (
      <div className="text-right p-4">
        <h2 className="text-xl font-bold mb-4">זמן ההפסקה</h2>
        <p className="mb-4 text-sm">כשהגיע זמן ההפסקה, כל הילדים יצאו לחצר. דניאל ויובל שיחקו יחד בכדור.</p>
        <p className="mb-4 text-sm">"אתה טוב מאוד בכדורגל!" אמר יובל לדניאל.</p>
        <p className="text-sm">דניאל חייך. "גם אתה! אולי נשחק יחד גם מחר?"</p>
      </div>
    ),
    text: 'כשהגיע זמן ההפסקה, כל הילדים יצאו לחצר. דניאל ויובל שיחקו יחד בכדור.\n\n"אתה טוב מאוד בכדורגל!" אמר יובל לדניאל.\n\nדניאל חייך. "גם אתה! אולי נשחק יחד גם מחר?"',
    title: "זמן ההפסקה",
  },

  // Page 12: Illustration only
  {
    content: (
      <div className="flex items-center justify-center h-full">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ezgif-frame-004-EE2TF6alJB15qTCyoP4zBWQFMa844A.png"
          alt="ילדה במטבח"
          className="w-4/5 h-4/5 object-cover rounded-lg"
        />
      </div>
    ),
    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    isImage: true,
  },

  // Pages 13-14: Conclusion
  {
    content: (
      <div className="text-right p-4">
        <h2 className="text-xl font-bold mb-4">סוף היום</h2>
        <p className="mb-4 text-sm">בסוף היום, אמא באה לאסוף את דניאל. הוא רץ אליה בהתרגשות.</p>
        <p className="text-sm">"איך היה היום הראשון?" שאלה אמא. דניאל חייך חיוך גדול.</p>
      </div>
    ),
    text: 'בסוף היום, אמא באה לאסוף את דניאל. הוא רץ אליה בהתרגשות.\n\n"איך היה היום הראשון?" שאלה אמא. דניאל חייך חיוך גדול.',
    title: "סוף היום",
  },
  {
    content: (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">יום מוצלח!</h2>
        <p className="mb-6">"היה נהדר! אני כבר מחכה למחר!"</p>
        <div className="mt-4 w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-500">תמונת הילד</span>
        </div>
      </div>
    ),
    background: "linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)",
  },
]

export default function CoverPage() {
  const [selectedCover, setSelectedCover] = useState<number | null>(null)
  const [selectedBookType, setSelectedBookType] = useState("illustrations")

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
        <Link href="/categories" className="flex items-center text-primary hover:text-primary/80 transition-colors">
          <ArrowRight className="w-5 h-5 ml-1 rotate-180" />
          <span>חזרה לקטגוריות</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold mb-4">הספר שלך עוד רגע מוכן!</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">בחרו כריכה לספר האישי שלכם</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto mb-12"
      >
        {coverOptions.map((cover) => (
          <div
            key={cover.id}
            onClick={() => setSelectedCover(cover.id)}
            className={`relative rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 w-[150px]
      ${selectedCover === cover.id ? "ring-4 ring-primary scale-105" : "hover:scale-105"}`}
          >
            <div className={`aspect-[3/4] ${cover.color} relative`}>
              <img src={cover.imageUrl || "/placeholder.svg"} alt={cover.name} className="w-full h-full object-cover" />
              {selectedCover === cover.id && (
                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                  <Check className="w-5 h-5" />
                </div>
              )}
            </div>
            <div className="p-3 text-center bg-white">
              <h3 className="font-medium">{cover.name}</h3>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-5xl mx-auto mb-8 mt-16"
      >
        <h2 className="text-2xl font-bold text-center mb-6">תצוגה מקדימה של הספר</h2>

        {/* Book type toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-background rounded-full p-1 border border-input inline-flex">
            {bookTypes.map((type) => (
              <button
                key={type.id}
                className={`px-4 py-2 rounded-full transition-colors text-sm ${
                  selectedBookType === type.id && type.available
                    ? "bg-primary text-primary-foreground"
                    : type.available
                      ? "text-foreground hover:bg-secondary/50"
                      : "text-muted-foreground cursor-not-allowed"
                }`}
                onClick={() => type.available && setSelectedBookType(type.id)}
                disabled={!type.available}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <FlipBook pages={previewPages} width={800} height={450} editable={false} />
      </motion.div>

      <div className="text-center mt-8">
        <Link href="/payment">
          <button className="apple-button inline-flex items-center">לתשלום ובחירת פורמט</button>
        </Link>
      </div>
    </div>
  )
}

