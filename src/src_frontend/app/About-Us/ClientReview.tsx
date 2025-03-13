import { Card, CardContent } from "@/ui/card";
import Image from "next/image";
import BoyImg from "@/public/assets/AboutUs/3dboy.svg";
import Ellipse1 from "@/public/assets/AboutUs/Ellipse1.svg";
import Ellipse2 from "@/public/assets/AboutUs/Ellipse2.svg";
import Rectangle1 from "@/public/assets/AboutUs/Rectangle1.svg";
import Rectangle2 from "@/public/assets/AboutUs/Rectangle2.svg";
import { IoStar, IoStarHalf } from "react-icons/io5";
const testimonials = [
  {
    name: "Divya Jadhav",
    image: Rectangle1,
    text: "8sqft attention to detail and commitment to excellence is unparalleled. Their team is professional, courteous, and always willing to go the extra mile.",
  },
  {
    name: "Vivaan Kulkarni",
    image: Rectangle2,
    text: "I was blown away by the quality of work and the level of service provided by 8sqft. They truly understand the importance of delivering exceptional results.",
  },
  {
    name: "Aarush Kamble",
    image: Rectangle1,
    text: "I was thoroughly impressed by the outstanding quality and exceptional service provided by 8sqft. Their commitment to excellence is truly unmatched!",
  },
  {
    name: "Aditi Sharma",
    image: Rectangle2,
    text: "8sqft ability to balance budget, schedule, and quality is impressive. They're a true partner in the construction process.",
  },
];

const ClientReview = () => {
  return (
    <section className="px-4 lg:px-16 lg:pb-11 bg-[#222222] text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <Image
            className="w-28 lg:w-[200px]"
            src={BoyImg}
            alt="boy img"
            width={180}
            height={180}
          />
          <div>
            <h2 className="lg:text-5xl text-2xl text-center lg:text-start font-bold mb-4 capitalize lg:uppercase">
              What Our Clients Say
            </h2>

            <p className="text-[#C0C0BF] text-center text-sm max-w-xl mx-auto">
              At 8Sqft, we&apos;re not just building structures - we&apos;re building relationships.Here&apos;s what some of our satisfied clients have to say about their experience with us.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
          <div className="flex -space-x-1 p-2 overflow-hidden">
            <Image
              className="inline-block size-10 rounded-full ring-1 ring-white"
              src={Ellipse1}
              width={40}
              height={40}
              alt="img"
            />
            <Image
              className="inline-block size-10 rounded-full ring-1 ring-white"
              src={Ellipse2}
              alt="img"
              width={40}
              height={40}
            />
            <Image
              className="inline-block size-10 rounded-full ring-1 ring-white"
              src={Ellipse1}
              alt="img"
              width={40}
              height={40}
            />
            <Image
              className="inline-block size-10 rounded-full ring-1 ring-white"
              src={Ellipse2}
              alt="img"
              width={40}
              height={40}
            />
          </div>
          <div className="flex flex-col gap-2 text-yellow-400 text-xl">
            <div className="flex justify-center lg:justify-start gap-1">
              <IoStar className="text-[#FABB42]" />{" "}
              <IoStar className="text-[#FABB42]" />{" "}
              <IoStar className="text-[#FABB42]" />{" "}
              <IoStar className="text-[#FABB42]" />{" "}
              <IoStarHalf className="text-[#FABB42]" />
            </div>
            <p className="text-xs text-[#8D8D8C]">
              {" "}
              4.3/5 Rated by 300+ Professionals
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-transparent text-white border-0 lg:p-6 flex items-start space-x-4"
            >
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={100}
                height={100}
                className="rounded-lg"
              />
              <CardContent className="text-left p-0">
                <p className="text-[#F0F0F0] text-base font-medium">
                  {testimonial.text}
                </p>
                <p className="text-[#F0F0F0] text-xs mt-2">
                  - {testimonial.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientReview;
