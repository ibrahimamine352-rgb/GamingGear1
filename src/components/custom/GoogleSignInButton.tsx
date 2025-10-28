"use client";

import { FC, ReactNode, useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

interface GoogleSignInButtonProps {
  children: ReactNode;
  callbackUrl?: string; // optional: where to go after successful sign-in
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({
  children,
  callbackUrl = "/",
}) => {
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await signIn("google", { callbackUrl });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={loginWithGoogle}
      disabled={loading}
      className="
        w-full 
        bg-[#00C2FF] hover:bg-[#00C2FF]/90
        text-white
        border border-[#00C2FF]/40
        focus-visible:ring-2 focus-visible:ring-[#00C2FF] focus-visible:ring-offset-2
      "
    >
      {children}
    </Button>
  );
};

export default GoogleSignInButton;
