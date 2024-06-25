import React from "react";
import SocialSignInButtons from "@/components/global/sign-in-buttons";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="w-full bg-sidebar max-sm:mt-80 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 place-items-center p-6 md:p-10 xl:px-32 xl:pt-32">
        <div className="flex items-center md:items-start gap-4">
          <div className="w-10 h-10 relative">
            <Link href={"/"}>
              <Image
                src={"/assets/logo-3.png"}
                alt="PersonaGenius Logo"
                fill
                className="rounded-md object-contain"
              />
            </Link>
          </div>
          <h1 className="text-2xl font-bold">PersonaGenius</h1>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Contact Us</h1>
          <div className="text-muted-foreground">
            <SocialSignInButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
