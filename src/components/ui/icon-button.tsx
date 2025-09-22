import { MouseEventHandler } from "react";

import { cn } from "@/lib/utils";

interface IconButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  icon: React.ReactElement;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  className
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "grid place-items-center h-10 w-10 rounded-full border transition",
        "bg-transparent text-[hsl(var(--accent))] border-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))/0.08]",
        className
      )}
    >
      {icon}
    </button>
   );
}

export default IconButton;
