"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import clsx from "clsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import Link from "next/link";
import { icons } from "@/lib/constants";
import { usePathname } from "next/navigation";
type Props = {
  defaultOpen?: boolean;
  sidebarOpt: SidebarOption[];
};

const SidebarMenuOptions = ({
  sidebarOpt,
}: {
  sidebarOpt: SidebarOption[];
}) => {
  const pathname = usePathname();
  return (
    <Command className="mt-20 rounded-lg overflow-visible bg-transparent">
      <CommandInput placeholder="Search..." />
      <CommandList className="py-4 overflow-visible">
        <CommandEmpty>No Results Found</CommandEmpty>
        {sidebarOpt.map((sidebarOption, index) => (
          <React.Fragment key={`${sidebarOption.heading}_${index}`}>
            <div className="py-2">
              <h3 className="text-sm text-primary font-medium">
                {sidebarOption.heading}
              </h3>
              <CommandGroup className="overflow-visible">
                {sidebarOption.items.map((option) => {
                  let val;
                  const result = icons.find(
                    (icon) => icon.value === option.icon
                  );
                  if (result) {
                    val = <result.path className="w-5 h-5" />;
                  }
                  return (
                    <CommandItem key={`${option.name}_${index}`}>
                      <Link
                        href={option.link}
                        className={clsx(
                          "flex items-center gap-4 rounded-md transition-all md:w-[250px] w-full p-3",
                          {
                            "bg-primary text-white": pathname === option.link
                          }
                        )}
                      >
                        {val}
                        <span className="font-medium">{option.name}</span>
                      </Link>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          </React.Fragment>
        ))}

      </CommandList>
    </Command>
  );
};


const MenuOptions = ({ sidebarOpt, defaultOpen }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Sheet modal={false} {...openState}>
      <SheetTrigger
        asChild
        className="absolute left-4 top-6 z-[100] md:!hidden flex"
      >
        <Button variant="outline" size={"icon"}>
          <Menu />
        </Button>
      </SheetTrigger>


      <SheetContent
        showX={!defaultOpen}
        side={"left"}
        className={clsx(
          "backdrop-blur-xl fixed top-0 p-6 bg-sidebar shadow-none",
          {
            "hidden md:inline-block z-0 w-[300px]": defaultOpen,
            "inline-block md:hidden z-[100] w-full": !defaultOpen,
          }
        )}
      >
        <div className="flex flex-col h-full">
          <nav className="flex flex-col justify-between h-full">
            <SidebarMenuOptions sidebarOpt={sidebarOpt} />
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
