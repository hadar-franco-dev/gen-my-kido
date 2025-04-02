"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useLanguage } from "../contexts/language-context"

// Updated schema to remove budget and make fields required
const formSchema = z.object({
  name: z.string().min(2, { message: "השם חייב להיות לפחות 2 תווים." }),
  email: z.string().email({ message: "אנא הזן כתובת אימייל תקינה." }),
  phoneNumber: z.string().optional(),
  message: z.string().min(10, { message: "ההודעה חייבת להיות לפחות 10 תווים." }),
})

export default function ContactForm() {
  const { t, language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      console.log(values)
      setIsSubmitting(false)
      form.reset()
      alert("תודה על פנייתך. נחזור אליך בהקדם!")
    }, 2000)
  }

  // Custom label style to ensure labels stay black regardless of validation state
  const labelStyle = {
    color: "black",
    fontWeight: 500,
  }

  return (
    <section className="bg-background py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">{t("contact.title")}</h2>
          <p className="text-lg text-muted-foreground">{t("contact.description")}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={labelStyle}>{t("contact.name")} *</FormLabel>
                    <FormControl>
                      <Input {...field} className={language === "he" ? "text-right" : "text-left"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={labelStyle}>{t("contact.email")} *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className={language === "he" ? "text-right" : "text-left"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={labelStyle}>{t("contact.phone")}</FormLabel>
                    <FormControl>
                      <Input {...field} className={language === "he" ? "text-right" : "text-left"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={labelStyle}>{t("contact.message")} *</FormLabel>
                    <FormControl>
                      <Textarea
                        className={`min-h-[120px] ${language === "he" ? "text-right" : "text-left"}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-sm text-muted-foreground mb-4">* {t("contact.required")}</div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("contact.sending") : t("contact.send")}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  )
}

