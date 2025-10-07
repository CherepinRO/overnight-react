import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";

export default function Landing() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar onAuthClick={() => setAuthOpen(true)} />
      <Hero onGetStarted={() => setAuthOpen(true)} />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Footer />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
