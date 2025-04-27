
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductList from "@/components/products/ProductList";
import ProductImportDialog from "@/components/products/ProductImportDialog";
import NewProductDialog from "@/components/products/NewProductDialog";
import { Download, Plus, Search } from "lucide-react";

const Products = () => {
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="pl-8 w-full md:w-[200px] h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
            onClick={() => setIsImportOpen(true)}
          >
            <Download className="h-4 w-4 mr-1" />
            Exportar
          </Button>

          <Button size="sm" className="h-9" onClick={() => setIsNewProductOpen(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <TabsContent value="all" className="m-0">
        <ProductList filter="all" searchQuery={searchQuery} />
      </TabsContent>

      <TabsContent value="products" className="m-0">
        <ProductList filter="product" searchQuery={searchQuery} />
      </TabsContent>

      <TabsContent value="services" className="m-0">
        <ProductList filter="service" searchQuery={searchQuery} />
      </TabsContent>

      <NewProductDialog 
        open={isNewProductOpen} 
        onOpenChange={setIsNewProductOpen} 
      />

      <ProductImportDialog 
        open={isImportOpen} 
        onOpenChange={setIsImportOpen} 
      />
    </div>
  );
};

export default Products;
