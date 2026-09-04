import { Hero } from "@/components/home/Hero";
import { ProofStrip } from "@/components/home/ProofStrip";
import { SelectedWork } from "@/components/home/SelectedWork";
import { AlsoBuilt } from "@/components/home/AlsoBuilt";
import { HowIWork } from "@/components/home/HowIWork";
import { Capabilities } from "@/components/home/Capabilities";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <SelectedWork />
      <AlsoBuilt />
      <HowIWork />
      <Capabilities />
      <About />
      <Contact />
    </>
  );
}
