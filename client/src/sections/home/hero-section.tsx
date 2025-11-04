import Container from "@/components/container";
import { Parag } from "@/components/text";
import { Button } from "@/components/ui/button";
import { Star, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import heroImage from "@public/images/hero.png";
import { Routes, SectionsLinks } from "@/lib/constants";

const HeroSection = () => {
  const usersImages = [
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    "https://randomuser.me/api/portraits/men/75.jpg",
  ];
  return (
    <section className="relative" id={SectionsLinks.HOME}>
      <div className="absolute top-28 xl:top-10 -z-10 left-1/4 size-72 sm:size-96 xl:size-120 2xl:size-132 bg-green-300 blur-[100px] opacity-30"></div>

      <Container className="flex flex-col items-center justify-center text-black">
        {/* Avatars + Stars */}
        <div className="flex items-center mt-24">
          <div className="flex -space-x-3 pr-3">
            {usersImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`user-image-${index}`}
                width={200}
                height={200}
                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-1"
              />
            ))}
          </div>

          <div>
            <div className="flex ">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 text-transparent fill-green-600"
                  />
                ))}
            </div>
            <p className="text-sm text-gray-700">Used by 10,000+ users</p>
          </div>
        </div>

        {/* Headline + CTA */}
        <h1 className="text-5xl md:text-6xl font-semibold max-w-5xl text-center mt-4 md:leading-[70px]">
          Land your dream job with{" "}
          <span className=" bg-linear-to-r from-green-700 to-green-600 bg-clip-text text-transparent text-nowrap">
            AI-powered{" "}
          </span>{" "}
          resumes.
        </h1>

        <Parag className="max-w-md text-center my-7">
          Create, edit and download professional resumes with AI-powered
          assistance.
        </Parag>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 ">
          <Button
            variant={"primary"}
            className={
              "text-white rounded-full px-9 ring-offset-2 ring-1 ring-green-600"
            }
            size={"lg"}
            asChild
          >
            <Link href={`/${Routes.DASHBOARD}`}>Get started</Link>
          </Button>
          <Button
            variant={"secondary"}
            className={
              "border-0 ring-offset-2 ring-1 ring-slate-400 hover:bg-green-50 rounded-full px-9 h-10 text-slate-700"
            }
            size={"lg"}
            asChild
          >
            <Link href={"/"}>
              <Video /> Try demo
            </Link>
          </Button>
        </div>

        <Image
          src={heroImage}
          className="w-full rounded-[15px] max-w-4xl mt-16 border border-gray-200 shadow-lg"
          alt="hero section showcase"
          priority={true}
        />
      </Container>
    </section>
  );
};

export default HeroSection;
