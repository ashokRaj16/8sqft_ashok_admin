import "./globals.css";
import Navbar from "./components/Navbar/index";
import LocationFetcher from "@/StaticComponent/LocationFetcher";
import ProviderComponent from "./Provider";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import HomeAnimation from "./components/Home/HomeStatic/HomeAnimation";
import HydrateAuth from "./components/Home/HomeStatic/HydrateAuth";
import Script from "next/script";
import dotenv from "dotenv";
import ClientFooter from "./ClientFooter";
dotenv.config();
export const metadata = {
  title: "8SQFT - India's fastest-growing zero-brokerage property platform",
  description:
    "List your property with 8sqft: a hassle-free platform for buying, selling, or renting properties. Affordable listings, zero brokerage, and wide reach. Start today!",
  keywords:
    "zero-brokerage, rental properties, home rentals, office rentals, commercial rentals, real estate, property renting",
  author: "8SQFT",
  ogTitle: "8SQFT - Zero Brokerage Property Platform",
  ogDescription:
    "Find your perfect rental property with 8SQFT. Explore homes, offices, and commercial spaces hassle-free with our zero-brokerage platform.",
  ogImage: "https://www.8sqft.com/og-image.jpg",
  ogUrl: "https://www.8sqft.com",
  twitterTitle: "8SQFT - Zero Brokerage Property Platform",
  twitterDescription:
    "Discover a wide range of rental properties on 8SQFT. Your one-stop solution for home, office, and commercial rentals without brokerage.",
  twitterImage: "https://www.8sqft.com/twitter-image.jpg",
  logo: "/assets/logo/Only-8.svg", // Added logo URL here
  socialLinks: {
    linkedIn:
      "https://www.linkedin.com/search/results/all/?fetchDeterministicClustersOnly=true&heroEntityKey=urn%3Ali%3Aorganization%3A105332630&keywords=8sqft&origin=RICH_QUERY_SUGGESTION&position=0&searchId=7dc9bdcc-d5ba-4696-8a81-6ceacf94eb76&sid=UF9&spellCorrectionEnabled=false",
    instagram: "https://www.instagram.com/8sqftrealtech/",
    facebook: "https://www.facebook.com/profile.php?id=61571128571431",
    youtube: "https://www.youtube.com/channel/UCyldPEQF0AIX1AzvAmBcnbg",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const token:string | null = useAuthStore((state) => state.token);
  // if (token) {
  //   const decodedToken = jwtTokenDecodeAll(token);} else {
  //     console.error("Failed to decode token.");
  //   }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href={metadata.logo} />
      </head>
      <body className="w-screen h-screen overflow-x-hidden ">
        <Suspense fallback={<HomeAnimation />}>
          <HydrateAuth />
          <ProviderComponent>
            <div className="w-full bg-white fixed top-0 z-50 h-[80px]">
              <Navbar />
            </div>
            <Toaster />
            <LocationFetcher />
            {/* Main Content */}
            <main className="w-full mx-auto pt-[80px]">{children}</main>
            {/* Footer */}
            <ClientFooter />
          </ProviderComponent>
        </Suspense>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-${process.env.NEXT_PUBLIC_GOOGLEANALYTICSKEY}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-${process.env.NEXT_PUBLIC_GOOGLEANALYTICSKEY}');
            `,
          }}
        />
      </body>
    </html>
  );
}
