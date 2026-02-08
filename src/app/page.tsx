import Hero from "@/components/Hero";
import Repertoire from "@/components/Repertoire";
import Premiere from "@/components/Premiere";
import TicketsBlock from "@/components/TicketsBlock";
import About from "@/components/About";
import Troupe from "@/components/Troupe";
import News from "@/components/News";
import Contacts from "@/components/Contacts";
import Subscribe from "@/components/Subscribe";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Repertoire />
      <Premiere />
      <TicketsBlock />
      <About />
      <Troupe />
      <News />
      <Contacts />
      <Subscribe />
    </>
  );
}
