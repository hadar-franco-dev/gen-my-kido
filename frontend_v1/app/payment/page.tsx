"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Book, ArrowRight, Tablet, FileText, Check, X, LockIcon } from "lucide-react"
import Link from "next/link"

// Book type options
const bookTypes = [
  { id: "illustrations", label: "ספר איורים", available: true },
  { id: "animations", label: "ספר עם סרטוני אנימציה (בקרוב)", available: false },
  { id: "coloring", label: "ספר עם דפי צביעה (בקרוב)", available: false },
]

// Export format options
const exportOptions = [
  {
    id: "ipad",
    title: "ספר לאייפד",
    description: "גרסה דיגיטלית אינטראקטיבית לשימוש באייפד",
    icon: <Tablet className="w-10 h-10 mb-4 text-primary" />,
    price: "₪49.90",
  },
  {
    id: "pdf",
    title: "פורמט להדפסה (PDF)",
    description: "קובץ PDF באיכות גבוהה להדפסה ביתית או בבית דפוס",
    icon: <FileText className="w-10 h-10 mb-4 text-primary" />,
    price: "₪69.90",
  },
]

// Sample cover options (these would normally come from the previous page)
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

// Book options with prices
const bookOptions = {
  illustrated: { name: "ספר מאוייר", price: 40 },
  coloring: { name: "ספר עם דפי צביעה", price: 20 },
  animated: { name: "ספר עם סרטוני אנימציה", price: 40 },
  bundle: { name: "חבילה מיוחדת (כל הספרים)", price: 50 },
}

// Payment methods
const paymentMethods = [
  {
    id: "credit-card",
    name: "תשלום מאובטח באשראי",
    description: "שלמו בצורה מאובטחת בכרטיס אשראי",
    logo: null,
  },
  {
    id: "google-pay",
    name: "Google Pay",
    description: "Pay with Google Pay via PayPlus",
    logo: "/placeholder.svg?height=40&width=80&text=Google Pay",
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    description: "Pay with Apple Pay via PayPlus",
    logo: "/placeholder.svg?height=40&width=80&text=Apple Pay",
  },
  {
    id: "multipass",
    name: "MULTIPASS",
    description: "Pay With MULTIPASS via PayPlus",
    logo: "/placeholder.svg?height=40&width=80&text=MP",
  },
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

export default function PaymentPage() {
  const [selectedBookType, setSelectedBookType] = useState("illustrations")
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const [childName, setChildName] = useState("דניאל")
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const flipbookRef = useRef<HTMLDivElement>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit-card")

  // Assume the selected cover is the first one for this example
  // In a real app, this would come from the previous page's state
  const [selectedCover, setSelectedCover] = useState(coverOptions[0])

  // Replace the single selection state with multiple selections
  const [selectedBookOptions, setSelectedBookOptions] = useState<string[]>(["illustrated"])
  const [isBundle, setIsBundle] = useState<boolean>(false)
  const [totalPrice, setTotalPrice] = useState<number>(40)

  // Order items for the order details section
  const [orderItems, setOrderItems] = useState<Array<{ name: string; price: number; quantity: number }>>([
    { name: bookOptions.illustrated.name, price: bookOptions.illustrated.price, quantity: 1 },
  ])

  // Update order items when selections change
  useEffect(() => {
    if (isBundle) {
      setOrderItems([{ name: bookOptions.bundle.name, price: bookOptions.bundle.price, quantity: 1 }])
    } else {
      const items = []
      if (selectedBookOptions.includes("illustrated")) {
        items.push({ name: bookOptions.illustrated.name, price: bookOptions.illustrated.price, quantity: 1 })
      }
      if (selectedBookOptions.includes("coloring")) {
        items.push({ name: bookOptions.coloring.name, price: bookOptions.coloring.price, quantity: 1 })
      }
      if (selectedBookOptions.includes("animated")) {
        items.push({ name: bookOptions.animated.name, price: bookOptions.animated.price, quantity: 1 })
      }
      setOrderItems(items)
    }
  }, [
    selectedBookOptions,
    isBundle,
    bookOptions.animated.name,
    bookOptions.coloring.name,
    bookOptions.illustrated.name,
    bookOptions.bundle.name,
  ])

  // Handle book type selection
  const handleBookTypeSelect = (bookType: string) => {
    let newOptions: string[]

    // If bundle is selected, deselect it when individual options are chosen
    if (isBundle) {
      setIsBundle(false)
      newOptions = [bookType]
      setSelectedBookOptions(newOptions)
    } else {
      // Toggle selection
      if (selectedBookOptions.includes(bookType)) {
        // Don't allow deselecting if it's the only option selected
        if (selectedBookOptions.length > 1) {
          newOptions = selectedBookOptions.filter((option) => option !== bookType)
          setSelectedBookOptions(newOptions)
        } else {
          // If it's the only option, don't change anything
          newOptions = [...selectedBookOptions]
        }
      } else {
        // Add the new option
        newOptions = [...selectedBookOptions, bookType]
        setSelectedBookOptions(newOptions)
      }
    }

    // Update price with the new options array
    updateTotalPrice(newOptions, false)
  }

  // Add a handler for the bundle selection
  const handleBundleSelect = () => {
    setIsBundle(true)
    setSelectedBookOptions([]) // Empty array instead of individual options
    setTotalPrice(50) // Bundle price
  }

  // Function to calculate total price based on selections
  const updateTotalPrice = (options: string[], bundle: boolean) => {
    if (bundle) {
      setTotalPrice(50)
      return
    }

    let price = 0
    if (options.includes("illustrated")) price += 40
    if (options.includes("coloring")) price += 20
    if (options.includes("animated")) price += 40

    setTotalPrice(price)
  }

  // Handle payment method selection
  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId)
  }

  // Handle payment submission
  const handlePaymentSubmit = () => {
    // In a real app, this would process the payment
    alert(`תשלום מאובטח בסך ₪${totalPrice} באמצעות ${selectedPaymentMethod} יתבצע כעת`)
  }

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
        <h1 className="text-3xl font-bold mb-4">תשלום מאובטח</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">בחרו את סוג הספר המועדף עליכם והמשיכו לתשלום</p>
      </motion.div>

      {/* Book type selection boxes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-4xl mx-auto mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Illustrated Book Option */}
          <div
            className={`border rounded-xl p-6 text-center cursor-pointer transition-all ${
              selectedBookOptions.includes("illustrated")
                ? "border-primary bg-primary/5 shadow-md"
                : "border-gray-200 hover:border-primary/50 hover:shadow-sm"
            }`}
            onClick={() => handleBookTypeSelect("illustrated")}
          >
            <div className="flex justify-center mb-4">
              <Book className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">ספר מאוייר</h3>
            <p className="text-xl font-bold text-primary">₪40</p>
            {selectedBookOptions.includes("illustrated") && !isBundle && (
              <div className="mt-2">
                <Check className="w-5 h-5 mx-auto text-primary" />
              </div>
            )}
          </div>

          {/* Coloring Book Option */}
          <div
            className={`border rounded-xl p-6 text-center cursor-pointer transition-all ${
              selectedBookOptions.includes("coloring")
                ? "border-primary bg-primary/5 shadow-md"
                : "border-gray-200 hover:border-primary/50 hover:shadow-sm"
            }`}
            onClick={() => handleBookTypeSelect("coloring")}
          >
            <div className="flex justify-center mb-4">
              <FileText className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">ספר עם דפי צביעה</h3>
            <p className="text-xl font-bold text-primary">₪20</p>
            {selectedBookOptions.includes("coloring") && !isBundle && (
              <div className="mt-2">
                <Check className="w-5 h-5 mx-auto text-primary" />
              </div>
            )}
          </div>

          {/* Animated Book Option */}
          <div
            className={`border rounded-xl p-6 text-center cursor-pointer transition-all ${
              selectedBookOptions.includes("animated")
                ? "border-primary bg-primary/5 shadow-md"
                : "border-gray-200 hover:border-primary/50 hover:shadow-sm"
            }`}
            onClick={() => handleBookTypeSelect("animated")}
          >
            <div className="flex justify-center mb-4">
              <Tablet className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">ספר עם סרטוני אנימציה</h3>
            <p className="text-xl font-bold text-primary">₪40</p>
            {selectedBookOptions.includes("animated") && !isBundle && (
              <div className="mt-2">
                <Check className="w-5 h-5 mx-auto text-primary" />
              </div>
            )}
          </div>
        </div>

        {/* Bundle Option */}
        <div
          className={`border-2 rounded-xl p-6 text-center cursor-pointer transition-all max-w-2xl mx-auto ${
            isBundle ? "border-primary shadow-lg" : "border-yellow-400 hover:shadow-md"
          }`}
          onClick={handleBundleSelect}
          style={{
            background: "linear-gradient(135deg, #fff9c4 0%, #fffde7 100%)",
            boxShadow: isBundle ? "0 0 15px rgba(59, 130, 246, 0.3)" : "0 0 15px rgba(255, 193, 7, 0.3)",
          }}
        >
          <div className="flex justify-center items-center mb-4">
            <span className="text-yellow-500 text-2xl mr-2">★</span>
            <h3 className="text-xl font-bold">חבילה מיוחדת</h3>
            <span className="text-yellow-500 text-2xl ml-2">★</span>
          </div>
          <p className="mb-3">ספר מאוייר + ספר עם דפי צביעה + ספר עם סרטוני אנימציה</p>
          <div className="flex justify-center items-center">
            <p className="text-lg line-through text-gray-400 mr-2">₪100</p>
            <p className="text-2xl font-bold text-primary">₪50</p>
          </div>
          {isBundle && (
            <div className="mt-2">
              <Check className="w-5 h-5 mx-auto text-primary" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Main content area with order details and cover image */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
        {/* Order details section (replacing billing details) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-xl font-bold mb-6 text-right">פרטי ההזמנה</h2>

          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between text-sm font-medium text-gray-500 mb-3">
              <div>סכום ביניים</div>
              <div>מוצר</div>
            </div>

            {/* Order items */}
            {orderItems.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div className="text-left">₪{item.price}</div>
                  <div className="text-right flex items-start">
                    <X className="w-4 h-4 text-red-500 ml-2 mt-1 flex-shrink-0" />
                    <div>
                      <div>
                        {item.quantity} × {item.name}
                      </div>
                      {index === 0 && (
                        <>
                          <div className="text-sm text-gray-600">שלום כיתה א׳ של {childName}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between py-4 font-bold text-lg border-b mb-6">
            <div>₪{totalPrice}</div>
            <div>סה"כ</div>
          </div>

          {/* Coupon section */}
          <div className="mb-6">
            <p className="text-sm text-right mb-2">יש לך קוד קופון? זה המקום להכניס אותו:</p>
            <div className="flex gap-2">
              <button className="bg-amber-400 hover:bg-amber-500 text-white py-2 px-4 rounded-full flex-1 transition-colors">
                הפעלת קופון
              </button>
              <input
                type="text"
                placeholder="קוד קופון"
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 bg-gray-50 text-right"
              />
            </div>
          </div>

          {/* Payment methods section */}
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="payplus"
                name="payment-method"
                className="ml-2"
                checked={selectedPaymentMethod === "credit-card"}
                onChange={() => handlePaymentMethodSelect("credit-card")}
              />
              <label htmlFor="payplus" className="flex items-center cursor-pointer">
                <span className="font-bold ml-2">PayPlus</span>
                <span className="text-gray-500 text-sm">(לא סולקים דיירקט עמכם הסליחה)</span>
              </label>
            </div>

            <p className="text-right mb-4 text-sm">שלמו בצורה מאובטחת בכרטיס אשראי</p>

            {/* Google Pay */}
            <div className="flex items-center justify-between border-t pt-3 pb-3">
              <input
                type="radio"
                id="google-pay"
                name="payment-method"
                checked={selectedPaymentMethod === "google-pay"}
                onChange={() => handlePaymentMethodSelect("google-pay")}
              />
              <label htmlFor="google-pay" className="flex items-center justify-between w-full cursor-pointer">
                <div className="w-24 h-8 bg-gray-100 rounded flex items-center justify-center ml-4">
                  <span className="text-sm font-medium">Google Pay</span>
                </div>
                <span className="text-sm text-gray-600">Pay with Google Pay via PayPlus</span>
              </label>
            </div>

            {/* Apple Pay */}
            <div className="flex items-center justify-between border-t pt-3 pb-3">
              <input
                type="radio"
                id="apple-pay"
                name="payment-method"
                checked={selectedPaymentMethod === "apple-pay"}
                onChange={() => handlePaymentMethodSelect("apple-pay")}
              />
              <label htmlFor="apple-pay" className="flex items-center justify-between w-full cursor-pointer">
                <div className="w-24 h-8 bg-gray-100 rounded flex items-center justify-center ml-4">
                  <span className="text-sm font-medium">Apple Pay</span>
                </div>
                <span className="text-sm text-gray-600">Pay with Apple Pay via PayPlus</span>
              </label>
            </div>

            {/* MULTIPASS */}
            <div className="flex items-center justify-between border-t pt-3 pb-3">
              <input
                type="radio"
                id="multipass"
                name="payment-method"
                checked={selectedPaymentMethod === "multipass"}
                onChange={() => handlePaymentMethodSelect("multipass")}
              />
              <label htmlFor="multipass" className="flex items-center justify-between w-full cursor-pointer">
                <div className="w-24 h-8 bg-gray-100 rounded flex items-center justify-center ml-4">
                  <span className="text-sm font-medium">MP</span>
                </div>
                <span className="text-sm text-gray-600">Pay With MULTIPASS via PayPlus</span>
              </label>
            </div>
          </div>

          {/* Payment button */}
          <button
            onClick={handlePaymentSubmit}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <LockIcon className="w-5 h-5 ml-2" />
            <span>לתשלום מאובטח והמשך עריכה</span>
          </button>
        </motion.div>

        {/* Cover image section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-xl font-bold mb-4">הספר שלי</h2>
          <div className={`relative rounded-xl overflow-hidden shadow-lg w-[250px] ${selectedCover.color}`}>
            <div className="aspect-[3/4] relative">
              <img
                src={selectedCover.imageUrl || "/placeholder.svg"}
                alt={selectedCover.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 text-center bg-white">{/* Cover name removed */}</div>
          </div>

          {/* Information message about post-payment options */}
          <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              לאחר התשלום תנותבו לדף בו תוכלו לצפות ולערוך את ספריכם, ולבחור את פורמט השליחה הרצוי מבין אפשרויות מגוונות
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

