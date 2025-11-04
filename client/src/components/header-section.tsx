import { LucideIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Parag, Title } from "./text";

interface HeaderSectionProps {
    icon: LucideIcon;
    subtitle: string;
    title: string;
    description: string;
}

const HeaderSection = ({icon: Icon ,subtitle, title, description}: HeaderSectionProps) => {
  return (
    <div className={"flex flex-col gap-2 items-center max-w-2xl mx-auto"}>
      <Badge variant={"primary"} className={"py-1.5 px-6 text-sm capitalize"}>
        <Icon /> {subtitle}
      </Badge>
      <Title>{title}</Title>
      <Parag className={'text-center text-slate-500'}>
        {description}
      </Parag>
    </div>
  );
};

export default HeaderSection;
