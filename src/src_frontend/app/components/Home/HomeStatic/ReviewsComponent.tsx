import Image from "next/image";
import { useRef } from "react";
import "./scroll.css";
export default function ReviewsComponent() {
  const reviews = [
    {
      name: "Rohan Kamble",
      location: "Hinjewadi, Pune",
      review:
        "I rented out my 1BHK flat quickly through 8sqft.com, and the best part was that there was no brokerage involved. The process was smooth, and the platform is very user-friendly. Highly recommend their services!",
      imgSrc: "/assets/Post_Property_latest/Image1.png",
    },
    {
      name: "Suraj Kamble",
      location: "Pune",
      review:
        "My 2BHK flat was rented out without brokerage with the help of 8sqft.com. I had a smooth experience with their platform. The team is professional, and the process is simple. Highly recommended for buying, selling, or renting properties hassle-free!",
      imgSrc: "/assets/Post_Property_latest/Image.png",
    },
    {
      name: "Akshay Patel",
      location: "Wakad, Pune",
      review:
        "Thanks to 8sqft.com, I rented out my 3BHK flat without any hassle. Their team was professional and supportive throughout. A great platform for anyone looking for a brokerage-free experience!",
      imgSrc: "/assets/Post_Property_latest/Image 2.png",
    },
    {
      name: "Raj Kale",
      location: "Hinjewadi, Pune",
      review:
        "I rented out my 3BHK flat quickly through 8sqft.com, and the best part was that there was no brokerage involved. The process was smooth, and the platform is very user-friendly. Highly recommend their services!",
      imgSrc: "data:image/jpeg;base64,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",
    },
    // Add more reviews as needed
  ];

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scroll = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: "prev" | "next") => {
    const container = scrollContainerRef.current;

    // Ensure the container exists before attempting to scroll
    if (container) {
      const scrollAmount = 300; // Adjust scroll amount as needed
      container.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const scrollReviews = (direction: string) => {
    if (scroll.current) {
      const scrollAmount = 180; // Adjust as needed for the scroll distance
      const currentScroll = scroll.current.scrollLeft;

      if (direction === "prev") {
        scroll.current.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: "smooth",
        });
      } else if (direction === "next") {
        scroll.current.scrollTo({
          left: currentScroll + scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <>
      <section className=" ml-6 bg-gray-50">
        <div className="container lg:flex flex-row mx-auto px-10 justify-center align-middle space-x-6">
          {/* Section Title and Navigation Buttons */}
          <div className="flex flex-col items-center  justify-between ">
            <div>
              <h2 className="text-2xl font-sans font-bold text-black text-center md:text-left">
                How we work
              </h2>
            </div>

            <section className="py-12 ml-4 bg-gray-50">
              {/* <div className="container lg:flex flex-row mx-auto px-10 justify-center align-middle space-x-6  "> */}
              {/* FOR SCROLL FUNCTIONALITY */}
              {/* <div className="flex flex-col justify-between">
                                   
                                    <div className="flex space-x-2 mt-4 md:mt-0">
                                        <button
                                            className="w-8 h-8 flex items-center justify-center rounded-full border border-primary text-primary hover:bg-orange-100"
                                            onClick={() => handleScroll("prev")}
                                        >
                                            &#8592;
                                        </button>
                                        <button
                                            className="w-8 h-8 flex items-center justify-center rounded-full border border-primary text-primary hover:bg-orange-100"
                                            onClick={() => handleScroll("next")}
                                        >
                                            &#8594;
                                        </button>
                                    </div>
                                </div> */}

              <div
                ref={scrollContainerRef}
                className="lg:flex justify-center overflow-x-auto gap-6 scrollbar-hide w-[88%]"
              >
                <div className="w-full lg:w-[560px] aspect-video">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/aqey3PIDnpo?si=XqRcUJwk1sSL5ZYL"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              {/* </div> */}
            </section>

            <div className="container flex flex-row justify-center items-center gap-2 w-full  ">
            
              <button
                className=" lg:w-8 h-8 flex items-center justify-center rounded-full border border-primary text-primary hover:bg-orange-100"
                onClick={() => scrollReviews("prev")}
              >
                &#8592;
              </button>

              <div
                ref={scroll}
                className="flex flex-row overflow-x-auto gap-6 scrollbar-hide  "
              >
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-60 bg-white shadow-lg rounded-lg overflow-hidden border"
                  >
                    <div className="relative flex flex-row p-4 gap-2">
                      <Image
                        src={review.imgSrc}
                        alt="profile"
                        width={100}
                        height={100}
                        className="h-[70px] w-[80px] object-cover rounded-full"
                      />
                      <div className="flex flex-col justify-end">
                        <h3 className="font-semibold">{review.name}</h3>
                        <p>{review.location}</p>
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-[#636363]">{review.review}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="w-8 h-8 flex items-center justify-center rounded-full border border-primary text-primary hover:bg-orange-100"
                onClick={() => scrollReviews("next")}
              >
                &#8594;
              </button>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
}
