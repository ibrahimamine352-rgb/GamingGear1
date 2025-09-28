import React, { MouseEventHandler, cloneElement } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  icon: React.ReactElement;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, icon, className }) => {
  // Force the SVG to use your promo color, without changing the button styles
  const coloredIcon = cloneElement(icon, {
    className: cn(icon.props.className, "text-[hsl(var(--accent))/0.08]"),
  });

  return (
    <button
      onClick={onClick}
      className={cn(
        "grid place-items-center h-10 w-10 rounded-full border transition",
        "bg-transparent text-[hsl(var(--accent))] border-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))/0.09]",
        className
      )}
    >
      {coloredIcon}
    </button>
  );
};

export default IconButton;
