import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import { ArrowUpFromDot } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function MainLayout() {
  const [showButton, setShowButton] = useState(false);
  const mainRef = useRef(null);



  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        const scrollTop = mainRef.current.scrollTop;


        if (scrollTop > 1) {
          setShowButton(true);
        } else {
          setShowButton(false);
        }
      }
    };

    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
    }


    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleClick = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-[100vh]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main ref={mainRef} className="flex-1 overflow-x-scroll overflow-y-scroll  ">
          <Outlet />
        </main>
        {showButton && (
          <Button
            className="fixed bottom-12  z-50 rounded-full p-3  text-white"
            onClick={handleClick}
          >
            <ArrowUpFromDot />
          </Button>
        )}
      </div>
    </div>
  );
}
