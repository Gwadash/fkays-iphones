import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "./ProductCard";
import { brandNewProducts, preOwnedProducts } from "@/data/products";
import { Badge } from "@/components/ui/badge";

const ProductSection = () => {
  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
            Our <span className="text-brand-orange">iPhone</span> Collection
          </h2>
          <p className="text-xl text-brand-gray max-w-2xl mx-auto">
            Choose from our carefully selected range of brand-new and pre-owned iPhones, 
            all tested for quality and backed by our guarantee.
          </p>
        </div>

        <Tabs defaultValue="brand-new" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-12 max-w-md mx-auto">
            <TabsTrigger 
              value="brand-new" 
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
            >
              <Badge className="mr-2 bg-green-500">NEW</Badge>
              Brand New
            </TabsTrigger>
            <TabsTrigger 
              value="pre-owned"
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
            >
              <Badge className="mr-2 bg-blue-500">USED</Badge>
              Pre-owned
            </TabsTrigger>
          </TabsList>

           <TabsContent value="brand-new">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
               {brandNewProducts.map((product) => (
                 <ProductCard
                   key={product.id}
                   model={product.model}
                   storage={product.storage}
                   price={product.price}
                   condition={product.condition}
                   image={product.image}
                   discount={product.discount}
                 />
               ))}
             </div>
           </TabsContent>

           <TabsContent value="pre-owned">
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
               {preOwnedProducts.map((product) => (
                 <ProductCard
                   key={product.id}
                   model={product.model}
                   storage={product.storage}
                   price={product.price}
                   condition={product.condition}
                   image={product.image}
                   discount={product.discount}
                 />
               ))}
             </div>
           </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ProductSection;