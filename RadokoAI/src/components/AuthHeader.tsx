import { Menu, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,

  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import tobib from "../assets/images/tobib.png";
import {ToggleDarkMode} from "./ToggleDarkMode";
import {Link} from "react-router-dom";
import {CoolMode} from "@/components/ui/cool-mode";
import {useState} from "react";


// @ts-ignore
const NavLink = ({ to, children, icon: Icon }) => (
  <Link
    to={to}
    className="text-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2"
  >
    {Icon && <Icon className="h-full w-10" />}
    {children}
  </Link>
);

export default function AuthHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  }
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <nav className="flex-1 grid gap-2 text-lg font-medium">
        <CoolMode>
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <img alt="Logo" src={tobib} className="h-6 w-6" />
          <span>TobIb</span>
        </Link>
        </CoolMode>
      </nav>


      <nav className="hidden md:flex flex-row gap-6 text-lg">
        <CoolMode>
        <Link
            to={"/"}
            className="text-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
          >Acceuil
          </Link></CoolMode>

        <CoolMode>
        <Button  variant="outline">
          <NavLink to="/login" icon={LogIn}>S'authentifier</NavLink>
        </Button></CoolMode>


          <CoolMode>
        <Button >
          <NavLink to="/register" icon={UserPlus}>S'inscrire</NavLink>
        </Button></CoolMode>
      </nav>


      <ToggleDarkMode />


      <div className="md:hidden">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Menu className="h-5 w-5"/>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="animate-slide-down ">
            <DropdownMenuItem className="ml-2" asChild onClick={closeDropdown}>
             <Link
                to={"/"}
                className=" block text-foreground hover:text-primary transition-colors duration-200  items-center gap-2"
              >Acceuil
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator/>

            <DropdownMenuItem asChild >
              <Button variant="outline" className="w-full mt-2 p-3" onClick={closeDropdown}>
                <NavLink  to="/login" icon={LogIn}>S'authentifier</NavLink>
              </Button>
            </DropdownMenuItem>

            <DropdownMenuItem asChild >
              <Button className="w-full mt-2 p-3" onClick={closeDropdown}>
                <NavLink to="/register" icon={UserPlus}>S'inscrire</NavLink>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>


    </header>
  );
}
