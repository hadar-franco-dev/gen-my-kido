import Hero from "./components/Hero"
import WearYourStory from "./components/WearYourStory"
import PortfolioGrid from "./components/PortfolioGrid"
import FeatureCarousel from "./components/FeatureCarousel"
import Timeline from "./components/Timeline"
import Marquee from "./components/Marquee"
import ContactForm from "./components/ContactForm"
import NewsletterSubscribe from "./components/NewsletterSubscribe"

export default function Home() {
  return (
    <>
      <Hero />
      <WearYourStory />
      <Timeline />
      <PortfolioGrid />
      <FeatureCarousel />
      <Marquee />
      <ContactForm />
      <NewsletterSubscribe />
    </>
  )
}

