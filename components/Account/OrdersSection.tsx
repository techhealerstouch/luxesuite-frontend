"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { apiService } from "@/lib/api-service";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/types/api/order";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderDetails } from "@/components/orders/order-details";
import { ShipmentInformation } from "@/components/orders/shipment-information";
export default function OrdersSection() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // ✅ Fetch orders from API
  async function fetchOrders(page: number, search: string = "") {
    setIsLoading(true);
    try {
      const response = await apiService.getOrders(page, search);
      const pagination = response.data;
      const orderList = pagination.data || [];

      setOrders(orderList);
      setFilteredOrders(orderList);
      setLastPage(pagination.last_page);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // 🔄 Refetch when search changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setCurrentPage(1); // reset to first page
      fetchOrders(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // 🔄 Refetch when page changes
  useEffect(() => {
    fetchOrders(currentPage, searchTerm);
  }, [currentPage]);

  return (
    <div className="space-y-4">
      {/* ✅ Search Input */}
      <Input
        placeholder="Search orders..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />

      {/* ✅ Orders Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                   <TableCell>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      {order.invoice_number}
                    </button>
                  </TableCell>
                    <TableCell>{order.credit_name}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
{/* Dialog for order details */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl w-full h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="flex flex-col gap-4 h-full">
              <OrderDetails order={selectedOrder} />
              <ShipmentInformation order={selectedOrder} />
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* ✅ Pagination Controls */}
      <div className="flex justify-center gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <span className="px-2 py-1 text-sm text-muted-foreground">
          Page {currentPage} of {lastPage}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === lastPage}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>

    
  );
}
