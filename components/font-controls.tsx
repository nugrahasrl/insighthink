import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MinusCircle, PlusCircle } from "lucide-react";

const fontStyles = ["serif", "sans-serif", "monospace", "cursive", "fantasy"];

export const FontControls = ({
  fontSize,
  fontStyle,
  onFontSizeChange,
  onFontStyleChange,
}: {
  fontSize: number;
  fontStyle: string;
  onFontSizeChange: (delta: number) => void;
  onFontStyleChange: (style: string) => void;
}) => (
  <div className="flex items-center gap-4 px-4 pb-4 my-2">
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => onFontSizeChange(-1)}>
        <MinusCircle className="h-4 w-4" />
      </Button>
      <span className="w-12 text-center">{fontSize}px</span>
      <Button variant="outline" size="icon" onClick={() => onFontSizeChange(1)}>
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
    <Select value={fontStyle} onValueChange={onFontStyleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select font style" />
      </SelectTrigger>
      <SelectContent>
        {fontStyles.map((style) => (
          <SelectItem key={style} value={style}>
            {style.charAt(0).toUpperCase() + style.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);