'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash, Package, AlertTriangle } from "lucide-react"
import { type Item } from "@/app/dashboard/inventory/types"

interface ItemsTableProps {
  items: Item[];
  onAddStock?: (item: Item) => void;
}

export function ItemsTable({ items, onAddStock }: ItemsTableProps) {
  // Helper function to get item type badge
  const getItemTypeBadge = (type: Item['type']) => {
    switch (type) {
      case 'product':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Product</Badge>
      case 'service':
        return <Badge variant="outline" className="text-purple-500 border-purple-500">Service</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }
  
  // Helper function to get stock status
  const getStockStatus = (item: Item) => {
    if (item.type !== 'product') return null
    
    if (item.minimumStock !== undefined && item.availableStock <= item.minimumStock) {
      return (
        <div className="flex items-center text-red-500">
          <AlertTriangle className="h-4 w-4 mr-1" />
          <span>Low Stock</span>
        </div>
      )
    }
    
    if (item.availableStock === 0) {
      return <span className="text-red-500">Out of Stock</span>
    }
    
    return <span className="text-green-500">In Stock</span>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Purchase Rate</TableHead>
            <TableHead className="text-right">Selling Price</TableHead>
            <TableHead>Stock Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No items found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.categoryName}</TableCell>
                <TableCell>{getItemTypeBadge(item.type)}</TableCell>
                <TableCell className="text-right">₹{item.purchaseRate.toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{item.sellingPrice.toLocaleString()}</TableCell>
                <TableCell>
                  {item.type === 'product' ? (
                    <div className="flex flex-col">
                      <span>{item.availableStock} {item.unit}{item.availableStock !== 1 ? 's' : ''}</span>
                      {getStockStatus(item)}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Item
                      </DropdownMenuItem>
                      {item.type === 'product' && (
                        <DropdownMenuItem onClick={() => onAddStock?.(item)}>
                          <Package className="mr-2 h-4 w-4" />
                          Add Stock
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Item
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
} 