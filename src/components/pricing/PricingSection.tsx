
import React, { useEffect, useState } from 'react';
import PlanCard from './PlanCard';
import { planService } from '@/services/api/planService';
import { PlanWithFeatures } from '@/types/plan';

interface PricingSectionProps {
  onSelectPlan?: (planId: string) => void;
  selectedPlanId?: string;
  showButtons?: boolean;
}

const PricingSection: React.FC<PricingSectionProps> = ({ 
  onSelectPlan = () => {}, 
  selectedPlanId,
  showButtons = true 
}) => {
  const [plans, setPlans] = useState<PlanWithFeatures[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true);
      try {
        const data = await planService.getPlansWithFeatures();
        setPlans(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl h-[450px]"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isPopular={plan.code === 'pro'}
            onSelectPlan={onSelectPlan}
            isSelected={selectedPlanId === plan.id}
            showButton={showButtons}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingSection;
