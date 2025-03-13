'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, Tag, ClipboardList, Search, Download, Filter, Users } from 'lucide-react'
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ItemsTable } from "@/components/inventory/ItemsTable"
import { CategoriesTable } from "@/components/inventory/CategoriesTable"
import { StockEntriesTable } from "@/components/inventory/StockEntriesTable"
import { VendorsTable } from "@/components/inventory/VendorsTable"
import { CreateItemDialog } from "@/components/inventory/CreateItemDialog"
import { CreateCategoryDialog } from "@/components/inventory/CreateCategoryDialog"
import { CreateStockEntryDialog } from "@/components/inventory/CreateStockEntryDialog"
import { CreateVendorDialog } from "@/components/inventory/CreateVendorDialog"
import { MOCK_ITEMS, MOCK_CATEGORIES, MOCK_STOCK_ENTRIES, MOCK_VENDORS } from "./types"
import { Badge } from "@/components/ui/badge"
import { ItemFormData, CategoryFormData, StockEntryFormData, VendorFormData } from "./types"

export default function InventoryPage() {
  const [itemDialogOpen, setItemDialogOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [stockEntryDialogOpen, setStockEntryDialogOpen] = useState(false)
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false)
  const [itemSearchQuery, setItemSearchQuery] = useState('')
  const [categorySearchQuery, setCategorySearchQuery] = useState('')
  const [stockSearchQuery, setStockSearchQuery] = useState('')
  const [vendorSearchQuery, setVendorSearchQuery] = useState('')
  const [items, setItems] = useState(MOCK_ITEMS)
  const [categories, setCategories] = useState(MOCK_CATEGORIES)
  const [stockEntries, setStockEntries] = useState(MOCK_STOCK_ENTRIES)
  const [vendors, setVendors] = useState(MOCK_VENDORS)
  
  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(itemSearchQuery.toLowerCase()) ||
    item.categoryName.toLowerCase().includes(itemSearchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(itemSearchQuery.toLowerCase())
  )
  
  // Filter categories based on search query
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
    category.type.toLowerCase().includes(categorySearchQuery.toLowerCase())
  )
  
  // Filter stock entries based on search query
  const filteredStockEntries = stockEntries.filter(entry =>
    entry.itemName.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
    entry.invoiceNumber.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
    entry.vendor.toLowerCase().includes(stockSearchQuery.toLowerCase())
  )
  
  // Filter vendors based on search query
  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(vendorSearchQuery.toLowerCase()) ||
    vendor.contactPerson.toLowerCase().includes(vendorSearchQuery.toLowerCase()) ||
    vendor.phone.toLowerCase().includes(vendorSearchQuery.toLowerCase()) ||
    vendor.email.toLowerCase().includes(vendorSearchQuery.toLowerCase())
  )
  
  // Calculate statistics
  const totalItems = items.length
  const totalProducts = items.filter(item => item.type === 'product').length
  const totalServices = items.filter(item => item.type === 'service').length
  const lowStockItems = items.filter(item => 
    item.type === 'product' && 
    item.minimumStock !== undefined && 
    item.availableStock <= item.minimumStock
  )
  
  const handleAddItem = (newItem: ItemFormData) => {
    // Get category name from categories array
    const category = categories.find(c => c.id === newItem.categoryId)
    
    setItems(prev => [...prev, {
      ...newItem,
      id: `${newItem.type === 'product' ? 'PRD' : 'SRV'}${(items.length + 1).toString().padStart(3, '0')}`,
      categoryName: category?.name || '',
      availableStock: newItem.type === 'product' ? 0 : 0, // Initialize with zero stock
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    setItemDialogOpen(false)
  }
  
  const handleAddCategory = (newCategory: CategoryFormData) => {
    setCategories(prev => [...prev, {
      ...newCategory,
      id: `${categories.length + 1}`,
    }])
    setCategoryDialogOpen(false)
  }
  
  const handleAddStockEntry = (newStockEntry: StockEntryFormData) => {
    // Get the item from items array
    const item = items.find(i => i.id === newStockEntry.itemId)
    
    const newEntry = {
      ...newStockEntry,
      id: `${stockEntries.length + 1}`,
      itemName: item?.name || '',
      totalAmount: newStockEntry.quantity * newStockEntry.purchaseRate
    }
    
    setStockEntries(prev => [...prev, newEntry])
    
    // Update item's available stock
    setItems(prev => prev.map(item => {
      if (item.id === newStockEntry.itemId) {
        return {
          ...item,
          availableStock: item.availableStock + newStockEntry.quantity,
          updatedAt: new Date()
        }
      }
      return item
    }))
    
    setStockEntryDialogOpen(false)
  }
  
  const handleAddVendor = (newVendor: VendorFormData) => {
    setVendors(prev => [...prev, {
      ...newVendor,
      id: `V${(vendors.length + 1).toString().padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    setVendorDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage items, categories, and stock
          </p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              {totalProducts} products, {totalServices} services
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              {categories.filter(c => c.type === 'product').length} product, {categories.filter(c => c.type === 'service').length} service
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Stock</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockEntries.length}</div>
            <p className="text-xs text-muted-foreground">
              Last entry: {stockEntries.length > 0 ? new Date(stockEntries[stockEntries.length - 1].entryDate).toLocaleDateString() : 'N/A'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Items below minimum stock level
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="items" className="w-full">
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="stock">Stock Management</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>
        
        {/* Items Tab */}
        <TabsContent value="items">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Items</CardTitle>
                <div className="flex gap-2">
                  <div className="relative w-60">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search items..."
                      className="pl-8"
                      value={itemSearchQuery}
                      onChange={(e) => setItemSearchQuery(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setItemSearchQuery('')}>All</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setItemSearchQuery('product')}>Products</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setItemSearchQuery('service')}>Services</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setItemSearchQuery('low stock')}>Low Stock</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button onClick={() => setItemDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Item
                  </Button>
                </div>
              </div>
              <CardDescription>
                Manage items in inventory (products and services)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ItemsTable 
                items={filteredItems} 
                onAddStock={(item) => {
                  if (item.type === 'product') {
                    // Pre-fill stock entry dialog with item details
                    setStockEntryDialogOpen(true)
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Categories</CardTitle>
                <div className="flex gap-2">
                  <div className="relative w-60">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search categories..."
                      className="pl-8"
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setCategorySearchQuery('')}>All</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setCategorySearchQuery('product')}>Product Categories</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setCategorySearchQuery('service')}>Service Categories</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={() => setCategoryDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Category
                  </Button>
                </div>
              </div>
              <CardDescription>
                Manage categories for items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoriesTable categories={filteredCategories} />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Stock Management Tab */}
        <TabsContent value="stock">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Stock Entries</CardTitle>
                <div className="flex gap-2">
                  <div className="relative w-60">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search stock entries..."
                      className="pl-8"
                      value={stockSearchQuery}
                      onChange={(e) => setStockSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button onClick={() => setStockEntryDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Stock
                  </Button>
                </div>
              </div>
              <CardDescription>
                Record and manage stock entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StockEntriesTable stockEntries={filteredStockEntries} />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Vendors Tab */}
        <TabsContent value="vendors">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Vendors</CardTitle>
                <div className="flex gap-2">
                  <div className="relative w-60">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search vendors..."
                      className="pl-8"
                      value={vendorSearchQuery}
                      onChange={(e) => setVendorSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button onClick={() => setVendorDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Vendor
                  </Button>
                </div>
              </div>
              <CardDescription>
                Manage vendors for inventory items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VendorsTable vendors={filteredVendors} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <CreateItemDialog
        open={itemDialogOpen}
        onOpenChange={setItemDialogOpen}
        onSubmit={handleAddItem}
        categories={categories}
      />
      
      <CreateCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onSubmit={handleAddCategory}
      />
      
      <CreateStockEntryDialog
        open={stockEntryDialogOpen}
        onOpenChange={setStockEntryDialogOpen}
        onSubmit={handleAddStockEntry}
        items={items.filter(item => item.type === 'product')}
      />
      
      <CreateVendorDialog
        open={vendorDialogOpen}
        onOpenChange={setVendorDialogOpen}
        onSubmit={handleAddVendor}
      />
    </div>
  )
} 