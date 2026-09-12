import Home from "@/components/sections/Home";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Process from "@/components/sections/Process";
import Stack from "@/components/sections/Stack";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import Testimonials from "@/components/sections/Testimonial";

export default function HomePage() {
  return (
    <>
      <Home />
      <About />
      <Services />
      <Projects />
      <Experience />
      <Process />
      <Stack />
      <Testimonials />
      <Blog />
      <Contact />
    </>
  );
}