import React, {useEffect, useRef, useState} from "react";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {CircleUser, Megaphone, Menu, MessageCircle, UtensilsCrossed,Dumbbell} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import tobib from "../assets/images/tobib.png";
import {ToggleDarkMode} from "./ToggleDarkMode";

import HeaderNavItem from "./header/HeaderNavItem.tsx";
import {Link} from "react-router-dom";
import Logout from "@/components/Logout.tsx";

import userStore from "@/stores/userStore.ts";


export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const logoutButtonRef = useRef(null);
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const {user} = userStore();


  useEffect(() => {
      if (user?.profile_picture) {
      setUserProfilePicture(user.profile_picture);
      }
  }, [user]);





  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };



  return (
    <header className=" flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden" onClick={() => setIsSheetOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>

        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link to={"/advices"} className="flex items-center gap-2 text-lg font-semibold">
              <img alt={""} src={tobib} className="h-full w-10" />
              <span>TobIb</span>
            </Link>



            <HeaderNavItem to="/advices" icon={UtensilsCrossed} label="Repas" onClick={closeSheet} />
            <HeaderNavItem to="/symptoms" icon={Megaphone} label="Symptômes" onClick={closeSheet} />
            <HeaderNavItem to="/chats" icon={MessageCircle} label="Messages" onClick={closeSheet} />
            <HeaderNavItem to="/exercices" icon={Dumbbell} label="Exercices" onClick={closeSheet} />


          </nav>
        </SheetContent>
      </Sheet>
      <Link to={"/dashboard"} className=" items-center gap-2 md:hidden">
        <img alt={""} src={tobib} className="h-full w-10" />

      </Link>

      <div className="w-full flex-1">
        <form>
          <div className="relative">
            {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> */}
            {/* <Input type="search" placeholder="Search..." className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3" /> */}
          </div>
        </form>
      </div>



      <ToggleDarkMode />

      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">

            {userProfilePicture ? (
                <img
                    src={userProfilePicture instanceof File ? URL.createObjectURL(userProfilePicture) : userProfilePicture}
                    alt="you"
                    className="w-9 h-auto border rounded-full object-cover cursor-pointer"
                />
            ) : <CircleUser className="h-5 w-5"/>}

            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className={"cursor-pointer"} onClick={closeDropdown}>
            <Link to={"/profile"} >Profil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={closeDropdown}>Paramètres</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
                <Logout ref={logoutButtonRef}/>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
