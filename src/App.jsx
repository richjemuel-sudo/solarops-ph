import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhySolar from "./components/WhySolar";
import HowItWorks from "./components/HowItWorks";
import Calculator from "./components/Calculator";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <a
        href="#calculator"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-navy-deep focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to calculator
      </a>

      <Navbar />

      <main>
        <Hero />
        <WhySolar />
        <HowItWorks />
        <Calculator />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
