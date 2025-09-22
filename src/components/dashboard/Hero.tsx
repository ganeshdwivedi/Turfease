import React from "react";

const Hero = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Your Court, Your Game.
          <span className="text-brand-green"> Booked in Seconds.</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
          The ultimate platform connecting court owners with passionate players.
          Whether you're looking to list your facility or find the perfect
          court, we've got you covered.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="#plans"
            className="w-full sm:w-auto text-brand-green border-2 border-brand-green rounded-full px-8 py-3 font-semibold hover:bg-brand-green hover:text-white transition duration-300 transform hover:scale-105"
          >
            I'm a Court Owner
          </a>
          <a
            href="#book-court"
            className="w-full sm:w-auto bg-brand-green text-white rounded-full px-8 py-3 font-semibold hover:opacity-90 transition duration-300 shadow-lg transform hover:scale-105"
          >
            I'm a Player
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
