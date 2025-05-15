
import React from 'react';
import { Check } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlanWithFeatures } from "@/types/plan";

interface PlanCardProps {
  plan: PlanWithFeatures;
  isPopular?: boolean;
  onSelectPlan: (planId: string) => void;
  isSelected?: boolean;
  showButton?: boolean;
}

const formatFeatureValue = (value: string) => {
  if (value === 'unlimited' || value === 'true') {
    return 'Ilimitado';
  }
  return value;
};

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isPopular = false,
  onSelectPlan,
  isSelected = false,
  showButton = true
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: plan.currency || 'BRL'
    }).format(value);
  };

  const getBorderClass = () => {
    if (isSelected) return "border-primary border-2";
    if (isPopular) return "border-primary/60";
    return "border-gray-200 dark:border-gray-700";
  };

  return (
    <Card className={`relative flex flex-col p-6 ${getBorderClass()} transition-all hover:shadow-md`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
          Mais popular
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.description}</p>
      </div>

      <div className="text-center mb-6">
        <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
        <span className="text-gray-500 dark:text-gray-400 ml-1">/mês</span>
      </div>

      <ul className="space-y-3 mb-6 flex-1">
        {plan.features.map((feature) => (
          <li key={feature.id} className="flex items-start">
            <Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
            <span className="text-sm">
              <strong>{formatFeatureValue(feature.feature_value)}</strong> {feature.description}
            </span>
          </li>
        ))}
      </ul>

      {showButton && (
        <Button 
          onClick={() => onSelectPlan(plan.id)} 
          className="w-full" 
          variant={isPopular ? "default" : "outline"}
        >
          {plan.price > 0 ? "Escolher plano" : "Começar grátis"}
        </Button>
      )}
    </Card>
  );
};

export default PlanCard;
