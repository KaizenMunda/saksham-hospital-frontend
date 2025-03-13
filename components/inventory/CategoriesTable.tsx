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
import { MoreHorizontal, Edit, Trash } from "lucide-react"
import { type ItemCategory } from "@/app/dashboard/inventory/types"

interface CategoriesTableProps {
  categories: ItemCategory[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  // Helper function to get category type badge
  const getCategoryTypeBadge = (type: ItemCategory['type']) => {
    switch (type) {
      case 'product':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Product</Badge>
      case 'service':
        return <Badge variant="outline" className="text-purple-500 border-purple-500">Service</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{getCategoryTypeBadge(category.type)}</TableCell>
                <TableCell>
                  {category.isActive ? (
                    <Badge variant="outline" className="text-green-500 border-green-500">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-500 border-red-500">Inactive</Badge>
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
                        Edit Category
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Category
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