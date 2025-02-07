import React from "react";

export default function PrivacyService() {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Header Section */}
      <header className="bg-gray-900 text-white py-6">
        <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
          <h1 className="text-xl font-bold">8sqft</h1>
          <nav className="hidden md:flex gap-6">
            <a href="/" className="hover:text-primary transition">Home</a>
            <a href="#services" className="hover:text-primary transition">Services</a>
            <a href="#about" className="hover:text-primary transition">About</a>
            <a href="#contact" className="hover:text-primary transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* About Us Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-center text-4xl font-bold text-gray-800 mb-12">About Us</h2>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* Text Content */}
            <div className="md:w-2/3">
              <h3 className="text-3xl font-bold text-gray-700 mb-4">Find Your Perfect Space</h3>
              <p className="text-lg leading-relaxed text-gray-600 mb-6">
                Welcome to 8sqft.com, your one-stop destination for buying, selling, renting and listing properties. Whether you&apos;re looking for your dream home, a great investment opportunity, or a place to rent, we make the process simple and stress-free.
              </p>
              <p className="text-lg leading-relaxed text-gray-600 mb-6">
                Our user-friendly website lets you easily browse listings, find the perfect property, and connect with trusted professionals. At 8sqft.com, we are committed to offering transparent, reliable, and personalized real estate services that meet your needs.
              </p>
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Our Vision</h4>
              <p className="text-lg text-gray-600 mb-4">
                To make buying, selling, and renting properties easy and affordable, with zero brokerage, by providing a clear and trustworthy platform for everyone.
              </p>
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h4>
              <p className="text-lg text-gray-600">
                To offer a simple and smooth experience for people looking to buy, sell, or rent properties. We aim to cut out middlemen, lower costs, and provide accurate listings, helping our users find the perfect property with simplicity.
              </p>
            </div>

            {/* Images */}
            <div className="flex flex-col gap-6 md:w-1/3">
              <img
                src="/assets/Privacy-Policyassets/annie-spratt-sggw4-qDD54-unsplash.jpg"
                alt="Happy Family"
                className="w-full rounded-lg shadow-md"
              />
              <img
                src="/assets/Privacy-Policyassets/mimi-thian-vdXMSiX-n6M-unsplash.jpg"
                alt="Family with Dog"
                className="w-full rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <p>&copy; 2024 Our Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
