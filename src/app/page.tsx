import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Brands from "@/components/sections/Brands";
import Products from "@/components/sections/Products";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import DistributionNetwork from "@/components/sections/DistributionNetwork";
import Process from "@/components/sections/Process";
import Stats from "@/components/sections/Stats";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Brands />
      <Products />
      <WhyChooseUs />
      <DistributionNetwork />
      <Process />
      <Stats />
      <Gallery />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}
