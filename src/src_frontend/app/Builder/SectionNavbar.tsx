"use client";
import { ChevronLeft, ChevronLeftIcon, ChevronRight, ChevronRightIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface SectionNavbarProps {
  sections: string[];
}

const SectionNavbar = ({ sections }: SectionNavbarProps) => {
    const [activeSection, setActiveSection] = useState("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = "";
      sections.forEach((section) => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section;
          }
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  useEffect(() => {
    const checkScroll = () => {
      if (menuRef.current) {
        setCanScrollLeft(menuRef.current.scrollLeft > 0);
        setCanScrollRight(menuRef.current.scrollLeft < menuRef.current.scrollWidth - menuRef.current.clientWidth);
      }
    };
    checkScroll();
    menuRef.current?.addEventListener("scroll", checkScroll);
    return () => menuRef.current?.removeEventListener("scroll", checkScroll);
  }, []);

  console.log(canScrollRight,canScrollLeft,'canScrollLeft')

  const scrollMenu = (direction: number) => {
    if (menuRef.current) {
      menuRef.current.scrollBy({ left: direction * 150, behavior: "smooth" });
    }
  };

  
    return (
        <nav className="sticky border-b border-gray py-1 top-14 lg:top-[90px] bg-white shadow-custom my-2 z-20 w-full ">
             <div className="relative flex items-center">
  
  {canScrollLeft && (
    <button onClick={() => scrollMenu(-1)}  className="p-2 z-30 bg-white" >
         <ChevronLeft className="h-4 w-4 text-gray-600" />
    </button>
  )}
<div ref={menuRef} className="flex space-x-6 overflow-x-auto scrollbar-hide px-4">
      {sections.map((section) => (
        <a
          key={section}
          href={`#${section}`}
          className={`px-2 py-1 lg:text-sm text-xs font-medium transition-all duration-100 ${
            activeSection === section ? "text-primary border-b-2 border-primary" : "text-black/50"
          }`}
        >
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </a>
      ))}
    </div>
  
  {canScrollRight && (
    <button onClick={() => scrollMenu(1)} className="p-2 z-30 bg-white">
  <ChevronRight className="h-4 w-4 text-gray-600" />
    </button>
  )}
     </div>
  </nav>
  );
};

export default SectionNavbar;
