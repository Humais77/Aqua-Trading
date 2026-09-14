import CTA from "../components/CTA";
import CtaBanner from "../components/CtaBanner";
import FAQ from "../components/FAQ";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Plans from "../components/Plans";
import QuickFeatures from "../components/QuickFeatures";
import RewardsPreview from "../components/RewardsPreview";
import Stats from "../components/Stats";
import Testimonials from "../components/Testimonials";
import WhyAqua from "../components/WhyAqua";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Plans />
      <QuickFeatures />
      <HowItWorks />
      <CtaBanner/>
     
    </>
  );
}