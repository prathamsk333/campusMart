import Header from "../components/Header";
import CTA from "../components/CTA.tsx";
import Features from "../components/Features.tsx";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Testimonials from "@/components/Testimonials.js";

const  Main=()=>{
   return (
       <div className="min-h-screen flex flex-col bg-white">
         <Header />
         <main className="flex-grow">
           <Hero />
           <Features />
           <Testimonials />
           <CTA />
         </main>
         <Footer />
       </div>
     );
}
export default Main;