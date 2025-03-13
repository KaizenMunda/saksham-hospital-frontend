export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  dateCreated: Date;
  dueDate: Date;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountType: 'none' | 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  total: number;
  amountPaid: number;
  balance: number;
  notes: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  itemId: string;
  name: string;
  description: string;
  type: 'service' | 'product' | 'Medication' | 'Supply' | 'Equipment';
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

export interface PaymentRecord {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  date: Date;
  amount: number;
  method: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque' | 'other';
  reference?: string;
  notes?: string;
}

export type InvoiceFormData = Omit<Invoice, 'id' | 'invoiceNumber' | 'dateCreated' | 'items'> & {
  items: Omit<InvoiceItem, 'id' | 'invoiceId'>[];
};

export type PaymentFormData = Omit<PaymentRecord, 'id' | 'paymentNumber'>;

// Mock data for invoices
export const MOCK_INVOICES: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-0001',
    patientId: 'P001',
    patientName: 'John Doe',
    dateCreated: new Date('2023-08-01'),
    dueDate: new Date('2023-08-31'),
    status: 'paid',
    items: [
      {
        id: '1',
        invoiceId: '1',
        itemId: 'ITEM001',
        name: 'General Consultation',
        description: 'Initial consultation',
        type: 'service',
        quantity: 1,
        unit: 'session',
        unitPrice: 1500,
        amount: 1500
      },
      {
        id: '2',
        invoiceId: '1',
        itemId: 'ITEM002',
        name: 'Blood Test',
        description: 'Complete blood count',
        type: 'service',
        quantity: 1,
        unit: 'test',
        unitPrice: 800,
        amount: 800
      }
    ],
    subtotal: 2300,
    taxRate: 5,
    taxAmount: 115,
    discountType: 'none',
    discountValue: 0,
    discountAmount: 0,
    total: 2415,
    amountPaid: 2415,
    balance: 0,
    notes: ''
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-0002',
    patientId: 'P002',
    patientName: 'Jane Smith',
    dateCreated: new Date('2023-08-05'),
    dueDate: new Date('2023-09-04'),
    status: 'pending',
    items: [
      {
        id: '3',
        invoiceId: '2',
        itemId: 'ITEM001',
        name: 'General Consultation',
        description: 'Initial consultation',
        type: 'service',
        quantity: 1,
        unit: 'session',
        unitPrice: 1500,
        amount: 1500
      },
      {
        id: '4',
        invoiceId: '2',
        itemId: 'ITEM003',
        name: 'X-Ray',
        description: 'Chest X-Ray',
        type: 'service',
        quantity: 1,
        unit: 'procedure',
        unitPrice: 1200,
        amount: 1200
      }
    ],
    subtotal: 2700,
    taxRate: 5,
    taxAmount: 135,
    discountType: 'percentage',
    discountValue: 10,
    discountAmount: 270,
    total: 2565,
    amountPaid: 1000,
    balance: 1565,
    notes: 'Partial payment received'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2023-0003',
    patientId: 'P003',
    patientName: 'Robert Johnson',
    dateCreated: new Date('2023-07-15'),
    dueDate: new Date('2023-08-14'),
    status: 'overdue',
    items: [
      {
        id: '5',
        invoiceId: '3',
        itemId: 'ITEM005',
        name: 'Medication',
        description: 'Prescription medication',
        type: 'product',
        quantity: 2,
        unit: 'pack',
        unitPrice: 500,
        amount: 1000
      }
    ],
    subtotal: 1000,
    taxRate: 5,
    taxAmount: 50,
    discountType: 'none',
    discountValue: 0,
    discountAmount: 0,
    total: 1050,
    amountPaid: 0,
    balance: 1050,
    notes: 'Payment reminder sent'
  }
];

// Mock data for payments
export const MOCK_PAYMENTS: PaymentRecord[] = [
  {
    id: '1',
    paymentNumber: 'PAY-2023-0001',
    invoiceId: '1',
    invoiceNumber: 'INV-2023-0001',
    patientId: 'P001',
    patientName: 'John Doe',
    date: new Date('2023-08-01'),
    amount: 2415,
    method: 'card',
    reference: 'CARD-123456',
    notes: 'Full payment'
  },
  {
    id: '2',
    paymentNumber: 'PAY-2023-0002',
    invoiceId: '2',
    invoiceNumber: 'INV-2023-0002',
    patientId: 'P002',
    patientName: 'Jane Smith',
    date: new Date('2023-08-05'),
    amount: 1000,
    method: 'cash',
    notes: 'Partial payment'
  }
]; 