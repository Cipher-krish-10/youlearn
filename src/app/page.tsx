import { MarketingNav } from "@/features/marketing/components/marketing-nav";
import { Hero } from "@/features/marketing/components/hero";
import { LogoCloud } from "@/features/marketing/components/logo-cloud";
import { Features } from "@/features/marketing/components/features";
import { HowItWorks } from "@/features/marketing/components/how-it-works";
import { Testimonials } from "@/features/marketing/components/testimonials";
import { Pricing } from "@/features/marketing/components/pricing";
import { Faq } from "@/features/marketing/components/faq";
import { Cta } from "@/features/marketing/components/cta";
import { Footer } from "@/features/marketing/components/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <MarketingNav />
      <main id="main-content" className="flex-1">
        <Hero />
        <LogoCloud />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
