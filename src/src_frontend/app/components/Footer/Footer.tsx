import Link from "next/link";
import {
  FaFacebook,
  FaInstagramSquare,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
interface FooterSectionProps {
  title: string;
  links: { label: string; href: string }[];
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, links }) => (
  <div className="flex-1 min-w-[250px]">
    <h3 className="mb-4 text-lg font-semibold">{title}</h3>
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <Link href={link.href} className="hover:underline">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const FooterComponent = () => {
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

  return (
    <div className="bg-[#101010] text-white px-5 py-10 flex flex-col items-center space-y-8 ">
      {/* Main Content */}
      <div className="flex flex-wrap justify-center w-full gap-12 py-5">
        <FooterSection title="Quick Links" links={quickLinks} />
        <FooterSection title="Discover" links={discoverLinks} />
        <div className="flex-1 min-w-[250px]">
          <h3 className="mb-4 text-lg font-semibold">Search</h3>
          <p className="mb-3 text-sm">
            Get the latest information about properties from 8sqft
          </p>
          <div className="flex flex-col lg:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email here"
              className="w-full p-2 text-[#222222] rounded-md outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="lg:w-1/4 bg-[#FC6600] text-white p-2 rounded-md hover:bg-orange-600 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="w-full border-t border-gray-700"></div>

      {/* Bottom Section */}
      <div className="flex flex-wrap justify-between items-center w-full max-w-6xl gap-4 py-2">
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
        <div className="flex gap-4">
          <Link href="https://www.instagram.com/8sqftrealtech/">
            <FaInstagramSquare className="w-7 h-7" />
          </Link>
          <Link href="https://www.facebook.com/profile.php?id=61571128571431">
            <FaFacebook className="w-7 h-7" />
          </Link>
          <Link href="https://www.youtube.com/channel/UCyldPEQF0AIX1AzvAmBcnbg">
            <FaYoutube className="w-7 h-7" />
          </Link>
          <Link href="https://www.linkedin.com/search/results/all/?fetchDeterministicClustersOnly=true&heroEntityKey=urn%3Ali%3Aorganization%3A105332630&keywords=8sqft&origin=RICH_QUERY_SUGGESTION&position=0&searchId=7dc9bdcc-d5ba-4696-8a81-6ceacf94eb76&sid=UF9&spellCorrectionEnabled=false">
            <FaLinkedin className="w-7 h-7" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FooterComponent;
