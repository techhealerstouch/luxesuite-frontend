"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Globe, Eye, Edit, Trash2, RefreshCw } from "lucide-react"; 

const dummyProducts = [
  { model: "M-001", serial: "SN-12345", name: "Product A", price: "$200", status: "Active" },
  { model: "M-002", serial: "SN-67890", name: "Product B", price: "$150", status: "Inactive" },
  { model: "M-003", serial: "SN-54321", name: "Product C", price: "$500", status: "Active" },
];

export function UserProductsCard() {
  const [search, setSearch] = useState("");

  const filteredProducts = dummyProducts.filter(
    (p) =>
      p.model.toLowerCase().includes(search.toLowerCase()) ||
      p.serial.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="shadow-lg rounded-2xl border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Products</CardTitle>
        <CardDescription>List of products created by this user.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model #</TableHead>
                <TableHead>Serial #</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product, idx) => (
                <TableRow key={idx}>
                  <TableCell>{product.model}</TableCell>
                  <TableCell>{product.serial}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.status}</TableCell>
                 <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Eye />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 />
                      </Button>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Dummy pagination */}
        <div className="flex justify-end mt-4 space-x-2">
          <Button size="sm" variant="outline">Previous</Button>
          <Button size="sm" variant="outline">Next</Button>
        </div>
      </CardContent>
    </Card>
  );
}
