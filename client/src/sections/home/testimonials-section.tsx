import Container from "@/components/container";
import HeaderSection from "@/components/header-section";
import { SectionsLinks } from "@/lib/constants";
import { BadgeCheck, BookUser } from "lucide-react";

const TestiomonialsSection = () => {
  const cardsData = [
    {
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "Briar Martin",
      handle: "@neilstellar",
      comment:
        "Creating my resume was so easy! AI made it look professional in minutes.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Avery Johnson",
      handle: "@averywrites",
      comment:
        "AI highlighted my skills perfectly. Recruiters noticed immediately!",
    },
    {
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
      name: "Jordan Lee",
      handle: "@jordantalks",
      comment: "Stand-out resumes made simple. This AI tool is a game-changer!",
    },
    {
      image:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
      name: "Sam Taylor",
      handle: "@samtaylor",
      comment: "AI helped me craft a resume that truly reflects me!",
    },
  ];

  return (
    <section id={SectionsLinks.TESTIMONIALS}>
      <Container>
        <HeaderSection
          icon={BookUser}
          subtitle="Testimonials"
          title="Don't just take our word for it"
          description="See how our AI Resume Builder has helped users land their dream jobs. Share your experience and help us keep improving!"
        />
        <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-r from-white to-transparent"></div>
          <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
            {[...cardsData, ...cardsData].map((card, index) => (
              <TestimonialCard key={index} card={card} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-l from-white to-transparent"></div>
        </div>

        <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-r from-white to-transparent"></div>
          <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-10 pb-5">
            {[...cardsData, ...cardsData].map((card, index) => (
              <TestimonialCard key={index} card={card} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-l from-white to-transparent"></div>
        </div>
      </Container>
    </section>
  );
};

const TestimonialCard = ({
  card,
}: {
  card: { image: string; name: string; handle: string; comment: string };
}) => (
  <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0">
    <div className="flex gap-2">
      <img className="size-11 rounded-full" src={card.image} alt="User Image" />
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <p>{card.name}</p>
          <BadgeCheck className={"mt-0.5 size-4 text-white fill-green-500"} />
        </div>
        <span className="text-xs text-slate-500">{card.handle}</span>
      </div>
    </div>
    <p className="text-sm py-4 text-gray-800">{card.comment}</p>
  </div>
);

export default TestiomonialsSection;
