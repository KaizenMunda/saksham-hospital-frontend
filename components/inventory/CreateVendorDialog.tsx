'use client'

import { useState, useEffect, useReducer } from 'react'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Trash, PlusCircle, MinusCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { MOCK_ITEMS } from "@/app/dashboard/inventory/types"
import { type InvoiceFormData, type InvoiceItem } from "@/app/dashboard/billing/types"

// Mock patients data
const MOCK_PATIENTS = [
  { id: 'P001', name: 'John Doe' },
  { id: 'P002', name: 'Jane Smith' },
  { id: 'P003', name: 'Robert Johnson' },
];

// Action types for our reducer
type InvoiceAction = 
  | { type: 'RESET_FORM' }
  | { type: 'SET_PATIENT'; patientId: string; patientName: string }
  | { type: 'SET_DUE_DATE'; dueDate: Date }
  | { type: 'ADD_ITEM'; item: Omit<InvoiceItem, 'id' | 'invoiceId'> }
  | { type: 'REMOVE_ITEM'; index: number }
  | { type: 'UPDATE_ITEM_QUANTITY'; index: number; quantity: number }
  | { type: 'SET_TAX_RATE'; rate: number }
  | { type: 'SET_DISCOUNT_TYPE'; discountType: 'none' | 'percentage' | 'fixed' }
  | { type: 'SET_DISCOUNT_VALUE'; value: number }
  | { type: 'SET_AMOUNT_PAID'; amount: number }
  | { type: 'SET_NOTES'; notes: string };

// Helper function to calculate invoice totals
function calculateTotals(items: InvoiceFormData['items'], taxRate: number, discountType: string, discountValue: number, amountPaid: number) {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  
  let discountAmount = 0;
  if (discountType === 'percentage') {
    discountAmount = subtotal * (discountValue / 100);
  } else if (discountType === 'fixed') {
    discountAmount = discountValue;
  }
  
  const total = subtotal + taxAmount - discountAmount;
  const balance = total - amountPaid;
  
  return { subtotal, taxAmount, discountAmount, total, balance };
}

// Initial state for our invoice form
function getInitialState(): InvoiceFormData {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);
  
  return {
    patientId: '',
    patientName: '',
    dueDate,
    status: 'pending',
    items: [],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discountType: 'none',
    discountValue: 0,
    discountAmount: 0,
    total: 0,
    amountPaid: 0,
    balance: 0,
    notes: ''
  };
}

// Reducer function to handle all state updates
function invoiceReducer(state: InvoiceFormData, action: InvoiceAction): InvoiceFormData {
  switch (action.type) {
    case 'RESET_FORM':
      return getInitialState();
      
    case 'SET_PATIENT':
      return {
        ...state,
        patientId: action.patientId,
        patientName: action.patientName
      };
      
    case 'SET_DUE_DATE':
      return {
        ...state,
        dueDate: action.dueDate
      };
      
    case 'ADD_ITEM': {
      const newItems = [...state.items, action.item];
      const { subtotal, taxAmount, discountAmount, total, balance } = calculateTotals(
        newItems, state.taxRate, state.discountType, state.discountValue, state.amountPaid
      );
      
      return {
        ...state,
        items: newItems,
        subtotal,
        taxAmount,
        discountAmount,
        total,
        balance
      };
    }
      
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((_, index) => index !== action.index);
      const { subtotal, taxAmount, discountAmount, total, balance } = calculateTotals(
        newItems, state.taxRate, state.discountType, state.discountValue, state.amountPaid
      );
      
      return {
        ...state,
        items: newItems,
        subtotal,
        taxAmount,
        discountAmount,
        total,
        balance
      };
    }
      
    case 'UPDATE_ITEM_QUANTITY': {
      if (action.quantity <= 0) return state;
      
      const newItems = [...state.items];
      const item = newItems[action.index];
      
      if (!item) return state;
      
      const newQuantity = action.quantity;
      const newAmount = newQuantity * item.unitPrice;
      
      newItems[action.index] = {
        ...item,
        quantity: newQuantity,
        amount: newAmount
      };
      
      const { subtotal, taxAmount, discountAmount, total, balance } = calculateTotals(
        newItems, state.taxRate, state.discountType, state.discountValue, state.amountPaid
      );
      
      return {
        ...state,
        items: newItems,
        subtotal,
        taxAmount,
        discountAmount,
        total,
        balance
      };
    }
      
    case 'SET_TAX_RATE': {
      const { subtotal, taxAmount, discountAmount, total, balance } = calculateTotals(
        state.items, action.rate, state.discountType, state.discountValue, state.amountPaid
      );
      
      return {
        ...state,
        taxRate: action.rate,
        taxAmount,
        total,
        balance
      };
    }
      
    case 'SET_DISCOUNT_TYPE': {
      const newDiscountValue = action.discountType === 'none' ? 0 : state.discountValue;
      
      const { subtotal, taxAmount, discountAmount, total, balance } = calculateTotals(
        state.items, state.taxRate, action.discountType, newDiscountValue, state.amountPaid
      );
      
      return {
        ...state,
        discountType: action.discountType,
        discountValue: newDiscountValue,
        discountAmount,
        total,
        balance
      };
    }
      
    case 'SET_DISCOUNT_VALUE': {
      const { subtotal, taxAmount, discountAmount, total, balance } = calculateTotals(
        state.items, state.taxRate, state.discountType, action.value, state.amountPaid
      );
      
      return {
        ...state,
        discountValue: action.value,
        discountAmount,
        total,
        balance
      };
    }
      
    case 'SET_AMOUNT_PAID': {
      const { subtotal, taxAmount, discountAmount, total, balance } = calculateTotals(
        state.items, state.taxRate, state.discountType, state.discountValue, action.amount
      );
      
      return {
        ...state,
        amountPaid: action.amount,
        balance
      };
    }
      
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.notes
      };
      
    default:
      return state;
  }
}

interface CreateVendorDialogProps {
  onSubmit: (data: any) => Promise<void>;
}

export default function CreateInvoicePage({ onSubmit }: CreateVendorDialogProps) {
  const router = useRouter();
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, dispatch] = useReducer(invoiceReducer, getInitialState());
  
  // Get available items from MOCK_ITEMS
  const [availableItems] = useState(MOCK_ITEMS)
  
  // Reset form when page is loaded
  useEffect(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);
  
  // Handle patient selection
  const handlePatientChange = (patientId: string) => {
    const patient = MOCK_PATIENTS.find(p => p.id === patientId);
    dispatch({ 
      type: 'SET_PATIENT', 
      patientId, 
      patientName: patient?.name || '' 
    });
  }
  
  // Handle adding an item to the invoice
  const handleAddItem = (itemId: string) => {
    if (itemId === 'placeholder') return;
    
    const selectedItem = availableItems.find(item => item.id === itemId);
    if (!selectedItem) return;
    
    // Create a new invoice item
    const newItem: Omit<InvoiceItem, 'id' | 'invoiceId'> = {
      itemId: selectedItem.id,
      name: selectedItem.name,
      description: selectedItem.description,
      type: selectedItem.type,
      quantity: 1,
      unit: selectedItem.unit,
      unitPrice: selectedItem.sellingPrice,
      amount: selectedItem.sellingPrice
    };
    
    dispatch({ type: 'ADD_ITEM', item: newItem });
  }
  
  // Handle removing an item from the invoice
  const handleRemoveItem = (index: number) => {
    dispatch({ type: 'REMOVE_ITEM', index });
  }
  
  // Handle changing item quantity
  const handleQuantityChange = (index: number, newQuantity: number) => {
    dispatch({ type: 'UPDATE_ITEM_QUANTITY', index, quantity: newQuantity });
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formState.items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the invoice.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formState.patientId) {
      toast({
        title: "Error",
        description: "Please select a patient.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formState);
      router.push('/billing'); // Navigate back to the billing page
      toast({
        title: "Success",
        description: "Invoice created successfully.",
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="p-6">
      <Button onClick={() => router.push('/billing')} variant="outline">
        Back to Billing
      </Button>
      <h1 className="text-2xl font-bold mt-4">Create New Invoice</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Patient</Label>
            <Select 
              value={formState.patientId} 
              onValueChange={handlePatientChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_PATIENTS.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input 
              id="dueDate" 
              type="date" 
              value={format(formState.dueDate, 'yyyy-MM-dd')}
              onChange={(e) => {
                if (!e.target.value) return;
                dispatch({ 
                  type: 'SET_DUE_DATE',
                  dueDate: new Date(e.target.value)
                });
              }}
              required
            />
          </div>
        </div>
        
        {/* Invoice Items */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Items</Label>
            <Select onValueChange={handleAddItem}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Add item..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="placeholder" value="placeholder" disabled>Select an item to add</SelectItem>
                {availableItems.map(item => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} (₹{item.sellingPrice})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formState.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No items added. Select an item from the dropdown above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    formState.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <Button 
                              type="button"
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => handleQuantityChange(index, item.quantity - 1)}
                            >
                              <MinusCircle className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button 
                              type="button"
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => handleQuantityChange(index, item.quantity + 1)}
                            >
                              <PlusCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">₹{item.unitPrice.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">₹{item.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        {/* Calculations */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Additional notes or payment instructions..."
                value={formState.notes}
                onChange={(e) => dispatch({ type: 'SET_NOTES', notes: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Subtotal:</span>
              <span>₹{formState.subtotal.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-sm">Tax Rate:</span>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formState.taxRate}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      dispatch({ type: 'SET_TAX_RATE', rate: value });
                    } else if (e.target.value === '') {
                      dispatch({ type: 'SET_TAX_RATE', rate: 0 });
                    }
                  }}
                  className="w-16 h-8"
                />
                <span className="text-sm">%</span>
              </div>
              <span>₹{formState.taxAmount.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-sm">Discount:</span>
                <Select
                  value={formState.discountType}
                  onValueChange={(value: 'percentage' | 'fixed' | 'none') => {
                    dispatch({ type: 'SET_DISCOUNT_TYPE', discountType: value });
                  }}
                >
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="none" value="none">None</SelectItem>
                    <SelectItem key="percentage" value="percentage">%</SelectItem>
                    <SelectItem key="fixed" value="fixed">Fixed</SelectItem>
                  </SelectContent>
                </Select>
                
                {formState.discountType !== 'none' && (
                  <Input
                    type="number"
                    min="0"
                    value={formState.discountValue}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        dispatch({ type: 'SET_DISCOUNT_VALUE', value });
                      } else if (e.target.value === '') {
                        dispatch({ type: 'SET_DISCOUNT_VALUE', value: 0 });
                      }
                    }}
                    className="w-20 h-8"
                  />
                )}
              </div>
              <span>₹{formState.discountAmount.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center border-t pt-2 font-medium">
              <span>Total:</span>
              <span>₹{formState.total.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-sm">Amount Paid:</span>
                <Input
                  type="number"
                  min="0"
                  value={formState.amountPaid}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      dispatch({ type: 'SET_AMOUNT_PAID', amount: value });
                    } else if (e.target.value === '') {
                      dispatch({ type: 'SET_AMOUNT_PAID', amount: 0 });
                    }
                  }}
                  className="w-24 h-8"
                />
              </div>
              <span>₹{formState.amountPaid.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center font-medium">
              <span>Balance Due:</span>
              <span>₹{formState.balance.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <Button type="button" variant="outline" onClick={() => router.push('/billing')}>
          Back to Billing
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Invoice'}
        </Button>
      </form>
    </div>
  )
}