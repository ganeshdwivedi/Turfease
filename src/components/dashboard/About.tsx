import React from "react";

const About = () => {
  return (
    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        <img
          src="https://images.unsplash.com/photo-1560089000-7433a4ebbd64?q=80&w=2070&auto=format&fit=crop"
          alt="Tennis court"
          className="rounded-lg shadow-md w-full h-full object-cover aspect-square"
        />
        <img
          src="https://images.unsplash.com/photo-1574629810360-14b9d3c03c2a?q=80&w=1974&auto=format&fit=crop"
          alt="Basketball action"
          className="rounded-lg shadow-md w-full h-full object-cover aspect-square"
        />
        <img
          src="https://images.unsplash.com/photo-1596704017254-978160356233?q=80&w=1935&auto=format&fit=crop"
          alt="Badminton shuttlecock"
          className="rounded-lg shadow-md w-full h-full object-cover aspect-square"
        />
        <img
          src="https://images.unsplash.com/photo-1634591517032-4d5e2d64573b?q=80&w=2071&auto=format&fit=crop"
          alt="Pickleball game"
          className="rounded-lg shadow-md w-full h-full object-cover aspect-square"
        />
      </div>
      <div>
        <h2 className="text-sm font-bold uppercase text-brand-green tracking-widest">
          Our Mission
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold mt-2">
          Connecting Communities Through Sport
        </h3>
        <p className="mt-6 text-gray-600">
          Courtify was born from a simple idea: make sports more accessible. We
          saw an opportunity to bridge the gap between facility owners with
          underutilized courts and players searching for a place to play. Our
          SaaS platform provides a seamless, powerful, and user-friendly
          solution for managing and booking sports facilities.
        </p>
        <p className="mt-4 text-gray-600">
          We empower owners to maximize their revenue and reach by providing
          robust management tools, while giving players the freedom to discover
          and book their favorite sports anytime, anywhere. We believe in the
          power of play to bring people together.
        </p>
      </div>
    </div>
  );
};

export default About;
