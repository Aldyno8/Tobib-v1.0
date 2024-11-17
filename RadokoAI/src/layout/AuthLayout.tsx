import { Outlet } from "react-router-dom";

import AuthHeader from "@/components/AuthHeader";
import { Button } from "@/components/ui/button";
import { ArrowUpFromDot } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function AuthLayout() {
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

  <div className="h-[100vh] flex flex-1 flex-col">
       <AuthHeader />
      <main ref={mainRef} className="flex-1 h-full flex pt-2 justify-center items-center overflow-x-auto overflow-y-auto">
        <Outlet />
      </main>
      {showButton && (
        <Button
          className="fixed bottom-4 right-4 z-50 rounded-full p-3 text-white"
          onClick={handleClick}
        >
          <ArrowUpFromDot />
        </Button>
      )}
    </div>
  );
}
