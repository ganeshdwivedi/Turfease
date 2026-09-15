import React, { useState } from "react";
import PlansCard from "../components/dashboard/PlansCard";
import PlanCard2 from "../components/dashboard/PlansCard2";
import CreatePlanForm from "../components/dashboard/CreatePlan";
import { Button, Skeleton } from "antd";
import { useQuery } from "@tanstack/react-query";
import { apiCaller } from "../api/ApiCaller";


const Plans = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isLoading } = useQuery({
    queryKey: ["GetAllPlans"],
    queryFn: async () => {
      const response = await apiCaller.get(`/plans`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
  });

  console.log(data, "data");

  return (
    <div className="min-h-screen text-gray-800 !w-full">
      <main className="p-6 md:p-8">
        {/* Display Section */}
        <div className="flex items-center justify-between !w-full !mb-5">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Existing Plans
          </h2>
          <Button onClick={() => setIsOpen(true)} type="primary">
            Create Plan
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <Skeleton active />
          ) : (
            data?.map((plan: any, index: number) => (
              <PlanCard2 key={index} plan={plan} />
            ))
          )}
        </div>
      </main>
      <CreatePlanForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default Plans;
