import React from "react";

const Book = () => {
  const court = {
    id: 2,
    name: "City Hoops Arena",
    location: "Brooklyn, NY",
    sport: "Basketball",
    image:
      "https://images.unsplash.com/photo-1574629810360-14b9d3c03c2a?q=80&w=1974&auto=format&fit=crop",
    price: 50,
    bookedSlots: {
      "2025-10-01": ["11:00 AM", "03:00 PM"],
      "2025-10-03": ["10:00 AM", "01:00 PM", "05:00 PM"],
    },
  };
  return (
    <div>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-shadow hover:shadow-xl">
        {/* <img
          src={court.image}
          alt={court.name}
          className="w-full h-48 object-cover"
        /> */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800">{court.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {court.location} • {court.sport}
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-600 mb-3">
              Available Slots for 22/290:
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
