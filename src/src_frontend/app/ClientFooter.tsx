// components/ClientFooter.tsx
"use client"; // Ensure this is a Client Component
import { usePathname } from "next/navigation";
import FooterComponent from "./components/Footer/Footer";

const ClientFooter = () => {
  const pathname = usePathname(); // Using the correct hook to get the current pathname

  // Check if the current page is 'Post-PropertyformResidential'
  const isPostPropertyFormPage = pathname.includes(
    "Post-PropertyformResidential"
  );
  const isBuilderPostPropertyPage = pathname.includes("BuilderPostProperty");
  // Conditionally render FooterComponent based on the route
  if (isPostPropertyFormPage && isBuilderPostPropertyPage) {
    return null; // Don't render footer on 'Post-PropertyformResidential' page
  }

  return <FooterComponent />; // Render footer on all other pages
};

export default ClientFooter;
