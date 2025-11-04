"use client";

import React from "react";
import Container from "@/components/container";
import HeaderSection from "@/components/header-section";
import { Bot, Download, Palette, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SectionsLinks } from "@/lib/constants";

const FeaturesSection = () => {
  const [isHover, setIsHover] = React.useState(false);

  const features = [
    {
      icon: Bot,
      className:
        "group-hover:bg-violet-100 group-hover:border-violet-300 [&_svg]:stroke-violet-600",
      title: "AI-Powered Writing Assistant",
      description:
        "Let AI refine your words, highlight your strengths, and make every sentence shine.",
    },
    {
      icon: Palette,
      className:
        "group-hover:bg-green-100 group-hover:border-green-300 [&_svg]:stroke-green-600",
      title: "Beautiful, Custom Templates",
      description:
        "Pick from sleek, modern designs that fit your style and make a lasting impression.",
    },
    {
      icon: Download,
      className:
        "group-hover:bg-orange-100 group-hover:border-orange-300 [&_svg]:stroke-orange-600",
      title: "Instant Download & Sharing",
      description:
        "Export your polished resume in seconds and share it anywhere with one click.",
    },
  ];

  return (
    <section id={SectionsLinks.FEATURES}>
      <Container>
        <HeaderSection
          icon={Zap}
          subtitle="Simple Process"
          title="Build your resume"
          description="Our streamlined process helps you create a professional resume in minutes with intelligent AI-powered tools and features."
        />

        <div className="flex flex-col lg:flex-row items-center justify-center">
          <Image
            className="max-w-2xl w-full xl:-ml-32"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png"
            alt="feature image"
            width={600}
            height={600}
          />
          <div
            className="px-4 lg:px-0"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className={
                  "flex items-center justify-center gap-6 max-w-md group cursor-pointer"
                }
              >
                <div
                  className={cn(
                    "p-6 border border-transparent [&_svg]:size-6  flex gap-4 rounded-xl transition-colors",
                    feature.className,
                    index === 0 && !isHover && "border-violet-300 bg-violet-100"
                  )}
                >
                  <feature.icon />
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-slate-700">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 max-w-xs">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeaturesSection;
