import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface EyeToggleProps {
  onToggle?: (isVisible: boolean) => void;
  defaultVisible?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
}

const EyeToggle = ({
  onToggle,
  defaultVisible = false,
  size = "md",
  variant = "ghost",
}: EyeToggleProps) => {
  const [isVisible, setIsVisible] = useState(defaultVisible);

  const handleToggle = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    onToggle?.(newState);
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <Button
      type="button"
      variant={variant}
      size="icon"
      onClick={handleToggle}
      className={`${sizeClasses[size]} group relative hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 rounded-lg`}
    >
      <div className="relative">
        {isVisible ? (
          <Eye
            className={`${iconSizes[size]} text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300`}
          />
        ) : (
          <EyeOff
            className={`${iconSizes[size]} text-muted-foreground group-hover: text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300`}
          />
        )}
      </div>
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-muted-foreground whitespace-nowrap pointer-events-none">
        {isVisible ? "Ocultar" : "Mostrar"}
      </span>
    </Button>
  );
};

export default EyeToggle;
