import {Link} from "react-router-dom";
import {Megaphone, MessageCircle, UtensilsCrossed, Dumbbell} from "lucide-react";
import tobib from "../assets/images/tobib.png";
import SidebarNavItem from "./sidebar/SidebarNavItem";

export default function Sidebar() {
  return (
    <div className=" hidden border-r w-64 bg-muted/40 md:block ">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 mb-8">
          <Link to={"/advices"} className="flex items-center gap-2 font-semibold scale-125">
            <img alt={""} src={tobib } className="w-10 h-full" />
            <span className="">TobIb</span>
          </Link>

        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">



            <SidebarNavItem to="/advices" icon={UtensilsCrossed} label="Repas" />
            <SidebarNavItem to="/symptoms" icon={Megaphone} label="Analyse" />
            <SidebarNavItem to="/chats" icon={MessageCircle} label="Messages" />
            <SidebarNavItem to="/exercices" icon={Dumbbell} label="Exercices" />

          </nav>
        </div>
      </div>
    </div>
  );
}
