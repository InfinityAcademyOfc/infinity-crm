
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProductCRUD } from "@/components/products/ProductCRUD";

const ProductsServices = () => {
  const { user, companyProfile } = useAuth();
  const companyId = companyProfile?.company_id || user?.id || "";

  return <ProductCRUD companyId={companyId} />;
};

export default ProductsServices;
