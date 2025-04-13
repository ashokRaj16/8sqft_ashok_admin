import useColorStore from "@/Store/colorStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsInstagram, BsWhatsapp, BsYoutube } from "react-icons/bs";
import {
  FaFacebook,
  FaFacebookF,
  FaInstagramSquare,
  FaLinkedin,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
interface FooterSectionProps {
  title: string;
  links: { label: string; href: string }[];
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, links }) => (
  <div className="flex-1">
    <h3 className="mb-4 lg:text-lg font-semibold">{title}</h3>
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <Link href={link.href} className="hover:underline text-sm lg:text-base">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const FooterComponent = () => {
    const pathname = usePathname();
 const isBuilderPropertyShowcase = pathname.startsWith('/BuilderPropertyShowcase');
   const themeColor = useColorStore((state) => state.color)
 const primaryColor=isBuilderPropertyShowcase?themeColor:'#222222';
  const quickLinks = [
    { label: "About Us", href: "/About-Us" },
    { label: "Terms & Conditions", href: "/TermsandCondition" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "Privacy Policy", href: "/PrivacyPolicy" },
  ];

  const discoverLinks = [
    { label: "Pune", href: "https://www.google.com/maps/place/Pune" },
    { label: "Nashik", href: "https://www.google.com/maps/place/Nashik" },
    { label: "Mumbai", href: "https://www.google.com/maps/place/Mumbai" },
    { label: "Bangalore", href: "https://www.google.com/maps/place/Bangalore" },
    { label: "Ahmedabad", href: "https://www.google.com/maps/place/Ahmedabad" },
  ];
  function openWhatsapp() {
    const phoneNumber = "917219009062"; // Ensure this is in international format without '+' or spaces
    const message = "Hi, I want to post my project/property";
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  }
  return (
    <div className="text-white px-5 lg:py-10 py-4 flex flex-col items-center lg:space-y-8 " style={{backgroundColor:primaryColor?primaryColor:'#222222'}}>
      {/* Main Content */}
      <div className="grid lg:grid-cols-3 grid-cols-2 justify-center w-full lg:gap-12 gap-4 py-5">
        <FooterSection title="Quick Links" links={quickLinks} />
        <FooterSection title="Discover" links={discoverLinks} />
        <div className="flex-1 col-span-3 lg:col-span-1">
          <h3 className="mb-4 text-lg font-semibold hidden lg:block">Subscription</h3>
          <p className="mb-3 text-sm">
            Get the latest information about properties from 8sqft
          </p>
          <div className="flex flex-row gap-3 p-2 border text-sm lg:text-base border-white/80 rounded-lg">
            <input
              type="email"
              placeholder="Enter your email here"
              className="w-full p-1 text-white/80 bg-transparent rounded-md outline-none focus:ring-0"
            />
            <button className="lg:w-1/4 bg-transparent btn-shine border border-white/80 text-white/70 px-2 rounded-sm hover:text-white transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="w-full border-t"></div>

      {/* Bottom Section */}
      <div className="flex flex-wrap justify-center lg:justify-between items-center w-full max-w-6xl gap-4 py-2">
        <div className="text-sm">
          <Link href="/PrivacyPolicy" className="hover:underline">
            Privacy Policy
          </Link>
          {" | "}
          <Link href="/TermsandCondition" className="hover:underline">
            Terms & Conditions
          </Link>
          {" | "}
          <a href="#" className="hover:underline">
            Cookie Policy
          </a>
        </div>
        <div className="text-sm">
          <a href="#" className="hover:underline">
            &copy; 2024-2025, Eight Sqft Real Tech
          </a>
        </div>
     
        <div className="flex gap-2 px-2"> 
                    <Link href={'https://www.instagram.com/8_sqft/'} className="p-1 rounded-full hover:bg-primary text-white" target="_blank"><BsInstagram size={17} /></Link>
                    <Link href={'https://www.facebook.com/people/8-sqft/61571128571431/'} className="p-1 rounded-full hover:bg-primary text-white" target="_blank"><FaFacebookF size={17} /></Link>
                    <Link href={'#'} className="p-1 rounded-full hover:bg-primary text-white"  onClick={openWhatsapp}><BsWhatsapp size={17} /></Link>
                    <Link href={'https://www.youtube.com/channel/UCyldPEQF0AIX1AzvAmBcnbg'} className="p-1 rounded-full hover:bg-primary text-white" target="_blank"><BsYoutube size={17} /></Link>
                    <Link href={'https://www.linkedin.com/company/8sqft'} className="p-1 rounded-full hover:bg-primary text-white" target="_blank"><FaLinkedinIn size={17} /></Link>
                    </div>

      </div>
    </div>
  );
};

export default FooterComponent;
