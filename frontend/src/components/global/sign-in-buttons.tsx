import LinkedInIcon from "@/components/icons/linkedin-icon";
import GoogleIcon from "@/components/icons/google-icon";
import GithubIcon from "@/components/icons/github-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  className?: string;
}

const socialLinksConfig = [
    {
      href: "https://www.linkedin.com/in/munnazzahaslam/",
      icon: LinkedInIcon,
      label: "LinkedIn",
    },
    {
      href: "mailto:aslammunnazzah@gmail.com",
      icon: GoogleIcon,
      label: "Google",
    },
    {
      href: "https://github.com/MunnazzahAslam/PersonaGenius",
      icon: GithubIcon,
      label: "GitHub",
    },
  ];

const SocialSignInButtons = ({ className }: Props) => {
  return (
    <div className={cn("flex justify-center items-center pb-4 gap-6", className)}>
      {socialLinksConfig.map(({ href, icon: Icon, label }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer">
          <Button variant={"outline"} size={"icon"} className="dark:bg-secondary hover:bg-secondary/50">
            <Icon className="w-5 h-5" />
          </Button>
        </a>
      ))}
    </div>
  );
};

export default SocialSignInButtons;
