import { Dispatch, SetStateAction } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Check, Palette } from "lucide-react";
import { ResumeType } from "@/types";

interface ColorPickerProps {
  selectedColor: string;
  setSelectedColor: Dispatch<SetStateAction<string>>;
  setResumeData: Dispatch<SetStateAction<ResumeType>>;
}

const ColorPicker = ({
  selectedColor,
  setSelectedColor,
  setResumeData,
}: ColorPickerProps) => {
  const colors = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Indigo", value: "#6366F1" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Green", value: "#10B981" },
    { name: "Red", value: "#EF4444" },
    { name: "Orange", value: "#F97316" },
    { name: "Teal", value: "#14B8A6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Gray", value: "#6B7280" },
    { name: "Black", value: "#1F2937" },
  ];

  const handleChangeColor = (color: string) => {
    setSelectedColor(color);
    setResumeData((prev) => ({ ...prev, accent_color: color }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"purple"} size="sm">
          <Palette /> Accent
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-full sm:w-64 p-4 rounded-sm flex flex-wrap justify-center items-center sm:grid sm:grid-cols-4 gap-2"
      >
        {colors.map((color, index) => {
          const isSelected = selectedColor === color.value;

          return (
            <div
              key={index}
              className={
                "flex flex-col gap-1 items-center justify-center cursor-pointer"
              }
              onClick={() => handleChangeColor(color.value)}
            >
              <span
                className={
                  "size-12 rounded-full flex items-center justify-center"
                }
                style={{ background: color.value }}
              >
                {isSelected && <Check className={"size-6 text-white"} />}
              </span>
              <p className={"text-[11px] xs:text-xs capitalize"}>
                {color.name}
              </p>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColorPicker;
