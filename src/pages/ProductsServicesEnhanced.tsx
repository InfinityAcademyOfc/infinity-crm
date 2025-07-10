
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProductCRUD } from "@/components/products/ProductCRUD";

const ProductsServicesEnhanced = () => {
  const { user, companyProfile } = useAuth();
  const companyId = companyProfile?.company_id || user?.id || "";

  if (!companyId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando dados da empresa...</p>
        </div>
      </div>
    );
  }

  return <ProductCRUD companyId={companyId} />;
};

export default ProductsServicesEnhanced;
