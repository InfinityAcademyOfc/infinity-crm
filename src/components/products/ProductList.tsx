
import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface ProductListProps {
  filter: "all" | "product" | "service";
  searchQuery: string;
}

const ProductList = ({ filter, searchQuery }: ProductListProps) => {
  const [products] = useState(mockProducts);
  
  // Filter products based on filter type and search query
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filter by type
      if (filter !== "all") {
        const isProduct = product.category === "Produto" || product.category === "Software";
        if (filter === "product" && !isProduct) return false;
        if (filter === "service" && isProduct) return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [products, filter, searchQuery]);

  // Format currency
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <p>Nenhum produto encontrado.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead>Recorrência</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead className="w-[150px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{product.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    {product.recurrence === "monthly" ? "Mensal" :
                     product.recurrence === "yearly" ? "Anual" : "Único"}
                  </TableCell>
                  <TableCell>
                    {product.stock !== null ? product.stock : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
