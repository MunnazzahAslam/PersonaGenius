"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "../../global/mode-toggle";

const Navigation = () => {
  return (
    <div className="py-6 px-10 flex items-center justify-between sticky top-0 z-50 bg-transparent backdrop-blur-3xl overflow-x-hidden">
      <aside className="flex items-center gap-2 max-sm:mx-auto">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <Image
              src={"/assets/logo-3.png"}
              width={40}
              height={40}
              alt="PersonaGenius logo"
            />
            <span className="text-xl font-extrabold">PersonaGenius</span>
          </div>
        </Link>
      </aside>

      <aside className="flex gap-2 items-center">
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
