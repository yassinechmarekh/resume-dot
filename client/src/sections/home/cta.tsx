import Container from "@/components/container";
import { Parag } from "@/components/text";
import { Button } from "@/components/ui/button";
import { Routes, SectionsLinks } from "@/lib/constants";
import { Rocket } from "lucide-react";
import Link from "next/link";

const CTA = () => {
  return (
    <section id={SectionsLinks.CONTACT}>
      <Container>
        <div className="max-w-5xl mx-2 md:mx-auto p-px rounded-lg bg-linear-to-r from-green-600/20 to-blue-500/30">
          <div className="flex flex-col items-center justify-center text-center py-12 md:py-16 rounded-lg bg-linear-to-r from-green-50 via-green-100/60 to-green-100">
            <div className="flex items-center justify-center bg-white px-3 py-1.5 shadow gap-1 rounded-full text-xs">
              <Rocket className={"size-3.5 text-green-700"} />
              <span className="bg-linear-to-r from-green-700 to-green-500 bg-clip-text text-transparent font-medium">
                Trusted by Experts
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-medium mt-2">
              Unlock Your Potential with <br />
              <span className="bg-linear-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                AI-Powered Resume Guidance{" "}
              </span>
              & Proven Results!
            </h2>
            <Parag className="text-slate-500 mt-2 max-w-lg">
              Land interviews faster with smart AI suggestions, personalized
              resume tips, and a professional resume that truly stands out.
            </Parag>
            <Button
              variant={"primary"}
              size={"lg"}
              className="bg-linear-to-r from-green-500 to-green-700 text-white px-5 py-2.5 rounded-full font-medium mt-4 hover:scale-105 active:scale-95 transition-all duration-200"
              asChild
            >
              <Link href={`/${Routes.DASHBOARD}`}>Get Started Now</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTA;
