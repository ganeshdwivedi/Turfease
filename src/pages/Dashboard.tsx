import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// --- Reusable SVG Icon Components ---
const MenuIcon = () => (
  <svg
    className="w-6 h-6 text-brand-green"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16m-7 6h7"
    ></path>
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-brand-green mr-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    ></path>
  </svg>
);

const FeatureIconMobile = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    ></path>
  </svg>
);

const FeatureIconAdmin = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    ></path>
  </svg>
);

const FeatureIconCommunity = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    ></path>
  </svg>
);

// --- Section Component with Animation ---
const AnimatedSection = ({ children, id, className = "" }: any) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`section-fade-in ${className}`}
    >
      {children}
    </section>
  );
};

// --- Header Component ---
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="#" className="text-3xl font-bold text-brand-green">
          Courtify
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="#about"
            className="text-gray-600 hover:text-brand-green transition duration-300"
          >
            About Us
          </Link>
          <Link
            to="#testimonials"
            className="text-gray-600 hover:text-brand-green transition duration-300"
          >
            Testimonials
          </Link>
          <Link
            to="#help"
            className="text-gray-600 hover:text-brand-green transition duration-300"
          >
            Help
          </Link>
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/club/signin"
            className="text-brand-green border border-brand-green rounded-full px-6 py-2 text-sm font-semibold hover:bg-brand-green hover:text-white transition duration-300"
          >
            Register Your Court
          </Link>
          <Link
            to="/customer/signin"
            className="bg-brand-green text-white rounded-full px-6 py-2 text-sm font-semibold hover:opacity-90 transition duration-300 shadow-lg"
          >
            Book a Slot
          </Link>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden"
        >
          <MenuIcon />
        </button>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-6 pt-2 pb-4 space-y-2">
          <Link
            to="#about"
            className="block text-gray-600 hover:text-brand-green transition duration-300"
          >
            About Us
          </Link>
          <Link
            to="#testimonials"
            className="block text-gray-600 hover:text-brand-green transition duration-300"
          >
            Testimonials
          </Link>
          <Link
            to="#help"
            className="block text-gray-600 hover:text-brand-green transition duration-300"
          >
            Help
          </Link>
          <div className="border-t border-gray-200 my-4"></div>
          <Link
            to="/club/signin"
            className="block w-full text-center text-brand-green border border-brand-green rounded-full px-6 py-2 text-sm font-semibold hover:bg-brand-green hover:text-white transition duration-300"
          >
            Register Your Court
          </Link>
          <Link
            to="/customer/signin"
            className="block w-full text-center mt-2 bg-brand-green text-white rounded-full px-6 py-2 text-sm font-semibold hover:opacity-90 transition duration-300"
          >
            Book a Slot
          </Link>
        </div>
      )}
    </header>
  );
};

// --- Hero Section Component ---
const HeroSection = () => (
  <section className="py-20 md:py-32">
    <div className="container mx-auto px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-bold leading-tight">
        Your Court, Your Game.
        <span className="text-brand-green"> Booked in Seconds.</span>
      </h1>
      <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
        The ultimate platform connecting court owners with passionate players.
        Whether you're looking to list your facility or find the perfect court,
        we've got you covered.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <Link
          to="/club/signin"
          className="w-full sm:w-auto text-brand-green border-2 border-brand-green rounded-full px-8 py-3 font-semibold hover:bg-brand-green hover:text-white transition duration-300 transform hover:scale-105"
        >
          I'm a Court Owner
        </Link>
        <Link
          to="/customer/signin"
          className="w-full sm:w-auto bg-brand-green text-white rounded-full px-8 py-3 font-semibold hover:opacity-90 transition duration-300 shadow-lg transform hover:scale-105"
        >
          I'm a Player
        </Link>
      </div>
    </div>
  </section>
);

// --- About Us Section Component ---
const AboutUsSection = () => (
  <AnimatedSection id="about" className="py-24 bg-gray-50">
    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        <img
          src="https://images.unsplash.com/photo-1560089000-7433a4ebbd64?q=80&w=2070&auto=format&fit=crop"
          alt="Tennis court"
          className="rounded-lg shadow-md w-full h-full object-cover aspect-square"
        />
        <img
          src="https://www.tennessean.com/gcdn/presto/2021/11/18/PNAS/ae09d424-1cd0-4a85-b4fb-58efb48f69a6-Vandy-VCU-MBB-111721-AAN-007.jpg"
          alt="Basketball action"
          className="rounded-lg shadow-md w-full h-full object-cover aspect-square"
        />
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/008/013/570/small/professional-badminton-player-use-racquet-hit-shuttle-cock-or-shuttlecock-on-court-during-warm-up-play-before-tournament-competition-in-single-man-type-in-indoor-court-photo.jpg"
          alt="Badminton shuttlecock"
          className="rounded-lg shadow-md w-full h-full object-cover aspect-square"
        />
        <img
          src="https://img.freepik.com/premium-photo/outdoor-pickleball-player-action_394312-4054.jpg?w=1060"
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
  </AnimatedSection>
);

// --- Why Choose Us Section ---
const WhyChooseUsSection = () => (
  <AnimatedSection className="py-24">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-sm font-bold uppercase text-brand-green tracking-widest">
        Why Choose Us
      </h2>
      <h3 className="text-3xl md:text-4xl font-bold mt-2">
        Everything You Need, All in One Place
      </h3>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-green/10 text-brand-green">
              <FeatureIconMobile />
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-bold leading-6">For Players</h4>
            <p className="mt-2 text-base text-gray-600">
              An intuitive, mobile-first design makes it effortless to find,
              compare, and book courts from anywhere. See real-time availability
              and secure your spot in seconds.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-green/10 text-brand-green">
              <FeatureIconAdmin />
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-bold leading-6">For Court Owners</h4>
            <p className="mt-2 text-base text-gray-600">
              A powerful admin panel to manage bookings, set custom pricing,
              handle memberships, and gain insights with detailed analytics.
              Maximize your court utilization and revenue.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-green/10 text-brand-green">
              <FeatureIconCommunity />
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-bold leading-6">Community Focused</h4>
            <p className="mt-2 text-base text-gray-600">
              We're more than a booking platform. We're a community of sports
              lovers. Join events, find partners, and share your passion for the
              game.
            </p>
          </div>
        </div>
      </div>
    </div>
  </AnimatedSection>
);

// --- Plans Section ---
const PlansSection = () => (
  <AnimatedSection id="plans" className="py-24 bg-gray-50">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-sm font-bold uppercase text-brand-green tracking-widest">
        For Court Owners
      </h2>
      <h3 className="text-3xl md:text-4xl font-bold mt-2">
        Choose Your Path to Success
      </h3>
      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
        Subscribe to a plan that fits your needs and start managing your courts
        like a pro.
      </p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Plan Cards */}
        <PlanCard
          title="Starter"
          price="49"
          features={[
            "Up to 5 Courts",
            "Basic Booking Management",
            "Standard Reporting",
          ]}
        />
        <PlanCard
          title="Pro"
          price="99"
          features={[
            "Up to 20 Courts",
            "Advanced Management",
            "Customer Memberships",
            "Priority Support",
          ]}
          popular={true}
        />
        <PlanCard
          title="Enterprise"
          price="Contact Us"
          features={[
            "Unlimited Courts",
            "Custom Integrations",
            "Dedicated Account Manager",
          ]}
          isEnterprise={true}
        />
      </div>
    </div>
  </AnimatedSection>
);

const PlanCard = ({
  title,
  price,
  features,
  popular = false,
  isEnterprise = false,
}: any) => (
  <div
    className={`border rounded-2xl p-8 text-left flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-2xl ${
      popular
        ? "relative border-2 border-brand-green shadow-2xl scale-105"
        : "border-gray-200"
    }`}
  >
    {popular && (
      <span className="absolute top-0 right-8 -translate-y-1/2 bg-brand-green text-white px-4 py-1 text-sm font-bold rounded-full">
        MOST POPULAR
      </span>
    )}
    <h4 className="text-xl font-bold">{title}</h4>
    <p className="text-gray-500 mt-1">
      {isEnterprise
        ? "For large-scale operations"
        : `For ${
            title === "Starter" ? "new facilities" : "growing businesses"
          }`}
    </p>
    <p className="mt-6 text-4xl font-bold">
      {isEnterprise ? price : `$${price}`}
      {!isEnterprise && (
        <span className="text-lg font-normal text-gray-500">/mo</span>
      )}
    </p>
    <ul className="mt-8 space-y-4 text-gray-600 flex-grow">
      {features.map((feature: any) => (
        <li key={feature} className="flex items-center">
          <CheckIcon />
          {feature}
        </li>
      ))}
    </ul>
    <Link
      to="#"
      className={`w-full mt-8 text-center rounded-full px-6 py-3 font-semibold transition duration-300 ${
        popular
          ? "bg-brand-green text-white hover:opacity-90"
          : "text-brand-green border border-brand-green hover:bg-brand-green hover:text-white"
      }`}
    >
      {isEnterprise ? "Contact Sales" : "Get Started"}
    </Link>
  </div>
);

// --- Testimonials Section ---
const TestimonialsSection = () => (
  <AnimatedSection id="testimonials" className="py-24">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-sm font-bold uppercase text-brand-green tracking-widest">
        Testimonials
      </h2>
      <h3 className="text-3xl md:text-4xl font-bold mt-2">
        Hear From Our Community
      </h3>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        <TestimonialCard
          quote="Courtify has transformed our booking process. What used to be a manual headache is now a fully automated, revenue-generating machine. Our court utilization is up 40%!"
          name="Sarah K."
          role="Court Owner"
          avatar="https://i.pravatar.cc/50?u=a"
        />
        <TestimonialCard
          quote="As a player, finding and booking a tennis court has never been easier. The interface is clean, fast, and I can book a slot on my lunch break in under a minute."
          name="Mike R."
          role="Player"
          avatar="https://i.pravatar.cc/50?u=b"
        />
        <TestimonialCard
          quote="The admin dashboard is incredibly intuitive. Setting up our courts, pricing, and available times was a breeze. Highly recommended for any facility manager."
          name="John D."
          role="Facility Manager"
          avatar="https://i.pravatar.cc/50?u=c"
        />
      </div>
    </div>
  </AnimatedSection>
);

const TestimonialCard = ({ quote, name, role, avatar }: any) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-50">
    <p className="text-gray-600">"{quote}"</p>
    <div className="mt-6 flex items-center">
      <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
      <div className="ml-4">
        <p className="font-bold">{name}</p>
        <p className="text-sm text-brand-green">{role}</p>
      </div>
    </div>
  </div>
);

// --- Book a Court Section ---
const BookCourtSection = () => (
  <AnimatedSection id="book-court" className="py-24 bg-gray-50">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-sm font-bold uppercase text-brand-green tracking-widest">
          For Players
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold mt-2">
          Find & Book Your Perfect Court
        </h3>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              placeholder="e.g., New York, NY"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green"
            />
          </div>
          <div>
            <label
              htmlFor="sport"
              className="block text-sm font-medium text-gray-700"
            >
              Sport
            </label>
            <select
              id="sport"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green"
            >
              <option>Tennis</option>
              <option>Basketball</option>
              <option>Badminton</option>
              <option>Pickleball</option>
            </select>
          </div>
          <div>
            <button className="w-full bg-brand-green text-white rounded-md py-3 font-semibold hover:opacity-90 transition duration-300 shadow-lg">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-4xl mx-auto">
        <h4 className="font-bold text-xl mb-4">Courts near you</h4>
        <div className="space-y-4">
          <CourtListing
            name="Central Park Tennis"
            location="Manhattan, NY"
            price="25"
            image="https://images.unsplash.com/photo-1543497425-accbf5289b6b?q=80&w=1975&auto=format&fit=crop"
          />
          <CourtListing
            name="Brooklyn Hoops"
            location="Brooklyn, NY"
            price="20"
            image="https://images.unsplash.com/photo-1521413813134-ce549c3132e7?q=80&w=2070&auto=format&fit=crop"
          />
        </div>
      </div>
    </div>
  </AnimatedSection>
);

const CourtListing = ({ name, location, price, image }: any) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-lg transition-shadow">
    <div className="flex items-center gap-4">
      <img
        src={image}
        className="w-24 h-16 rounded-lg object-cover"
        alt={name}
      />
      <div>
        <h5 className="font-bold">{name}</h5>
        <p className="text-sm text-gray-500">{location}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <p className="font-semibold text-brand-green">${price}/hr</p>
      <Link
        to="#"
        className="bg-brand-green text-white rounded-full px-6 py-2 text-sm font-semibold hover:opacity-90 transition duration-300 whitespace-nowrap"
      >
        Book Now
      </Link>
    </div>
  </div>
);

// --- Help/FAQ Section ---
const HelpSection = () => (
  <AnimatedSection id="help" className="py-24">
    <div className="container mx-auto px-6 max-w-4xl">
      <div className="text-center mb-12">
        <h2 className="text-sm font-bold uppercase text-brand-green tracking-widest">
          Help Center
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold mt-2">
          Frequently Asked Questions
        </h3>
      </div>
      <div className="space-y-4">
        <FAQItem
          question="How do I list my court?"
          answer="Simply click on 'Register Your Court', choose a subscription plan, and follow the on-screen instructions to set up your facility profile and add your courts. You can specify details like surface type, amenities, and pricing."
        />
        <FAQItem
          question="What are the fees for booking a court?"
          answer="For players, the price you see is the price you pay. We charge a small service fee to the court owner, which is already included in their subscription plan, ensuring transparent pricing for everyone."
        />
        <FAQItem
          question="Can I cancel a booking?"
          answer="Yes, cancellation policies are set by individual court owners. You can view the cancellation policy for a specific court before you book. Most owners offer a full refund if canceled 24-48 hours in advance."
        />
      </div>
    </div>
  </AnimatedSection>
);

const FAQItem = ({ question, answer }: any) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <h4 className="font-semibold text-lg">{question}</h4>
    <p className="text-gray-600 mt-2">{answer}</p>
  </div>
);

// --- Footer Component ---
const Footer = () => (
  <footer className="bg-gray-800 text-white">
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-xl font-bold text-brand-green">Courtify</h4>
          <p className="text-gray-400 mt-2 text-sm">
            The best way to book sports courts.
          </p>
        </div>
        <div>
          <h5 className="font-semibold tracking-wide">Company</h5>
          <ul className="mt-4 space-y-2 text-gray-400 text-sm">
            <li>
              <Link to="#about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white">
                Careers
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white">
                Press
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold tracking-wide">Resources</h5>
          <ul className="mt-4 space-y-2 text-gray-400 text-sm">
            <li>
              <Link to="#help" className="hover:text-white">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold tracking-wide">Follow Us</h5>
          {/* Social icons here */}
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
        <p>&copy; 2025 Courtify. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);

// --- Main App Component ---
export default function App() {
  return (
    <>
      <div className="bg-white text-gray-800">
        <Header />
        <main>
          <HeroSection />
          <AboutUsSection />
          <WhyChooseUsSection />
          <PlansSection />
          <TestimonialsSection />
          <BookCourtSection />
          <HelpSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
