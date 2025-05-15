
import { Filter, Users, DollarSign, ShoppingCart } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { formatCurrency } from "@/lib/formatters";

const StatsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard 
        title="Leads no Funil" 
        value="28"
        icon={<Filter size={24} className="text-crm-blue" />}
        trend={{ value: 12, label: "este mês", positive: true }}
      />
      <StatsCard 
        title="Clientes Ativos" 
        value="162"
        icon={<Users size={24} className="text-crm-purple" />}
        trend={{ value: 8, label: "este mês", positive: true }}
      />
      <StatsCard 
        title="Vendas do Mês" 
        value={formatCurrency(85000)}
        icon={<DollarSign size={24} className="text-green-600" />}
        trend={{ value: 5, label: "vs. mês anterior", positive: true }}
      />
      <StatsCard 
        title="Produtos Vendidos" 
        value="24"
        icon={<ShoppingCart size={24} className="text-orange-500" />}
        trend={{ value: 3, label: "vs. mês anterior", positive: false }}
      />
    </div>
  );
};

export default StatsSection;
