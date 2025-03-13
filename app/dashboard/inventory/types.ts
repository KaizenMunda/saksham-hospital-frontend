export interface ItemCategory {
  id: string;
  name: string;
  description: string;
  type: 'service' | 'product';
  isActive: boolean;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  type: 'service' | 'product';
  purchaseRate: number;
  sellingPrice: number;
  vendor: string;
  unit: string;
  minimumStock?: number; // Only for products
  availableStock: number; // Only for products
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockEntry {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  purchaseRate: number;
  totalAmount: number;
  vendor: string;
  invoiceNumber: string;
  invoiceImage?: string; // URL or base64 string of the invoice image
  entryDate: Date;
  expiryDate?: Date;
  notes: string;
}

// Original vendor interface
export interface LegacyVendor {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  gstNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ItemFormData = Omit<Item, 'id' | 'categoryName' | 'createdAt' | 'updatedAt' | 'availableStock'>;
export type CategoryFormData = Omit<ItemCategory, 'id'>;
export type StockEntryFormData = Omit<StockEntry, 'id' | 'itemName'>;
export type VendorFormData = Omit<LegacyVendor, 'id' | 'createdAt' | 'updatedAt'>;

// Mock data for categories
export const MOCK_CATEGORIES: ItemCategory[] = [
  {
    id: '1',
    name: 'Medications',
    description: 'All types of medications',
    type: 'product',
    isActive: true
  },
  {
    id: '2',
    name: 'Consultations',
    description: 'Doctor consultation services',
    type: 'service',
    isActive: true
  },
  {
    id: '3',
    name: 'Laboratory Tests',
    description: 'Various laboratory tests',
    type: 'service',
    isActive: true
  },
  {
    id: '4',
    name: 'Medical Supplies',
    description: 'Consumable medical supplies',
    type: 'product',
    isActive: true
  }
];

// Mock data for items (legacy format)
export const MOCK_LEGACY_ITEMS: Item[] = [
  {
    id: 'PRD001',
    name: 'Paracetamol',
    description: '500mg tablets',
    categoryId: '1',
    categoryName: 'Medications',
    type: 'product',
    purchaseRate: 30,
    sellingPrice: 50,
    vendor: 'Pharma Distributors',
    unit: 'strip',
    minimumStock: 20,
    availableStock: 45,
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-08-20')
  },
  {
    id: 'PRD002',
    name: 'Surgical Gloves',
    description: 'Disposable surgical gloves',
    categoryId: '4',
    categoryName: 'Medical Supplies',
    type: 'product',
    purchaseRate: 200,
    sellingPrice: 300,
    vendor: 'Medical Supplies Co.',
    unit: 'box',
    minimumStock: 5,
    availableStock: 8,
    isActive: true,
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-07-15')
  },
  {
    id: 'SRV001',
    name: 'General Consultation',
    description: 'Initial consultation with doctor',
    categoryId: '2',
    categoryName: 'Consultations',
    type: 'service',
    purchaseRate: 0,
    sellingPrice: 1500,
    vendor: 'Internal',
    unit: 'session',
    isActive: true,
    availableStock: 0, // Not applicable for services
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: 'SRV002',
    name: 'Blood Test',
    description: 'Complete blood count',
    categoryId: '3',
    categoryName: 'Laboratory Tests',
    type: 'service',
    purchaseRate: 350,
    sellingPrice: 800,
    vendor: 'Internal',
    unit: 'test',
    isActive: true,
    availableStock: 0, // Not applicable for services
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }
];

// Mock data for stock entries
export const MOCK_STOCK_ENTRIES: StockEntry[] = [
  {
    id: '1',
    itemId: 'PRD001',
    itemName: 'Paracetamol',
    quantity: 10,
    purchaseRate: 30,
    totalAmount: 300,
    vendor: 'Pharma Distributors',
    invoiceNumber: 'PO-2023-001',
    entryDate: new Date('2023-08-01'),
    expiryDate: new Date('2024-08-01'),
    notes: 'Regular monthly supply'
  },
  {
    id: '2',
    itemId: 'PRD002',
    itemName: 'Surgical Gloves',
    quantity: 3,
    purchaseRate: 200,
    totalAmount: 600,
    vendor: 'Medical Supplies Co.',
    invoiceNumber: 'PO-2023-002',
    entryDate: new Date('2023-07-15'),
    notes: 'Emergency order'
  }
];

// Legacy vendors (kept for backwards compatibility)
export const MOCK_LEGACY_VENDORS: LegacyVendor[] = [
  {
    id: 'V001',
    name: 'Pharma Distributors',
    contactPerson: 'John Smith',
    phone: '+91 9876543210',
    email: 'john@pharmadist.com',
    address: '123 Medical Lane, Mumbai, India',
    gstNumber: 'GST12345678',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: 'V002',
    name: 'Medical Supplies Co.',
    contactPerson: 'Mary Johnson',
    phone: '+91 8765432109',
    email: 'mary@medsupplies.com',
    address: '456 Health Street, Delhi, India',
    gstNumber: 'GST87654321',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  }
];

// New inventory item interface with more specific fields
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'Medication' | 'Supply' | 'Equipment';
  quantity: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  supplier?: string;
  location?: string;
  expiryDate?: Date;
  batchNumber?: string;
  dateAdded: Date;
  lastUpdated: Date;
}

// New vendor interface with additional fields
export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  accountNumber?: string;
  notes?: string;
  active: boolean;
  dateAdded: Date;
}

// Mock inventory items for the inventory module (new format)
export const MOCK_ITEMS: InventoryItem[] = [
  {
    id: 'ITEM001',
    name: 'Paracetamol 500mg',
    description: 'Paracetamol 500mg tablets',
    type: 'Medication',
    quantity: 1000,
    unit: 'tablets',
    costPrice: 0.5,
    sellingPrice: 2.0,
    supplier: 'MedSupply Ltd',
    location: 'Pharmacy Cabinet A1',
    expiryDate: new Date('2024-12-31'),
    batchNumber: 'PCM5001',
    dateAdded: new Date('2023-01-15'),
    lastUpdated: new Date('2023-01-15')
  },
  {
    id: 'ITEM002',
    name: 'Ibuprofen 400mg',
    description: 'Ibuprofen 400mg tablets',
    type: 'Medication',
    quantity: 500,
    unit: 'tablets',
    costPrice: 0.8,
    sellingPrice: 3.0,
    supplier: 'MedSupply Ltd',
    location: 'Pharmacy Cabinet A2',
    expiryDate: new Date('2024-10-15'),
    batchNumber: 'IBP4001',
    dateAdded: new Date('2023-01-20'),
    lastUpdated: new Date('2023-01-20')
  },
  {
    id: 'ITEM003',
    name: 'Surgical Gloves (Medium)',
    description: 'Disposable latex-free surgical gloves, medium size',
    type: 'Supply',
    quantity: 200,
    unit: 'pairs',
    costPrice: 0.3,
    sellingPrice: 1.0,
    supplier: 'MedEquip Inc',
    location: 'Supply Room B3',
    batchNumber: 'SGL2023M',
    dateAdded: new Date('2023-02-05'),
    lastUpdated: new Date('2023-02-05')
  },
  {
    id: 'ITEM004',
    name: 'Digital Thermometer',
    description: 'Digital thermometer for body temperature measurement',
    type: 'Equipment',
    quantity: 50,
    unit: 'units',
    costPrice: 10.0,
    sellingPrice: 25.0,
    supplier: 'MedEquip Inc',
    location: 'Equipment Room C1',
    dateAdded: new Date('2023-02-10'),
    lastUpdated: new Date('2023-02-10')
  },
  {
    id: 'ITEM005',
    name: 'Glucose Test Strips',
    description: 'Glucose test strips for blood sugar testing',
    type: 'Supply',
    quantity: 1000,
    unit: 'strips',
    costPrice: 0.2,
    sellingPrice: 0.8,
    supplier: 'DiagnosticSupplies Ltd',
    location: 'Supply Room B1',
    expiryDate: new Date('2024-08-20'),
    batchNumber: 'GTS2023A',
    dateAdded: new Date('2023-03-01'),
    lastUpdated: new Date('2023-03-01')
  }
];

// Mock vendors for the inventory module (new format)
export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'VEN001',
    name: 'MedSupply Ltd',
    contactPerson: 'John Miller',
    email: 'john.miller@medsupply.com',
    phone: '9876543210',
    address: '123 Supplier St, Vendor City',
    taxId: 'TAX123456',
    accountNumber: 'ACC123456',
    notes: 'Primary supplier for medications',
    active: true,
    dateAdded: new Date('2022-12-01')
  },
  {
    id: 'VEN002',
    name: 'MedEquip Inc',
    contactPerson: 'Sarah Johnson',
    email: 'sarah.j@medequip.com',
    phone: '8765432109',
    address: '456 Equipment Rd, Supplier Town',
    taxId: 'TAX789012',
    accountNumber: 'ACC789012',
    notes: 'Supplier for medical equipment and supplies',
    active: true,
    dateAdded: new Date('2022-12-15')
  },
  {
    id: 'VEN003',
    name: 'DiagnosticSupplies Ltd',
    contactPerson: 'Robert Chen',
    email: 'robert.c@diagsupplies.com',
    phone: '7654321098',
    address: '789 Diagnostic Ave, Supply City',
    taxId: 'TAX345678',
    accountNumber: 'ACC345678',
    notes: 'Supplier for laboratory and diagnostic supplies',
    active: true,
    dateAdded: new Date('2023-01-10')
  }
]; 