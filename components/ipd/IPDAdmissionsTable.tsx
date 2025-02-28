'use client'

import { type IPDAdmission } from "@/app/ipd/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { format, isValid, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BedHistoryDialog } from '@/components/ipd/BedHistoryDialog'
import { AdmissionActions } from '@/components/ipd/AdmissionActions'

interface IPDAdmissionsTableProps {
  admissions: IPDAdmission[]
  isLoading?: boolean
  canEdit?: boolean
  onEdit: (admission: IPDAdmission) => void
  onDischarge: (admission: IPDAdmission) => void
  onShiftBed: (admission: IPDAdmission) => void
  onDelete: (admission: IPDAdmission) => void
  showStatus?: boolean
  showStayDuration?: boolean
}

type SortField = 'ipdNo' | 'patientName' | 'admissionTime' | 'ward' | 'status' | 'doctors'
type SortOrder = 'asc' | 'desc'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Admitted':
      return 'bg-green-500'
    case 'Discharged':
      return 'bg-blue-500'
    case 'Expired':
      return 'bg-red-500'
    case 'LAMA':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-500'
  }
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (!isValid(date)) {
      console.warn('Invalid date:', dateString);
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return 'Invalid date';
  }
};

const formatStayDuration = (admissionTime: string) => {
  try {
    const admissionDate = new Date(admissionTime);
    const now = new Date();
    
    const diffMs = now.getTime() - admissionDate.getTime();
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    } else {
      return `${diffHours}h`;
    }
  } catch (error) {
    console.error('Error calculating stay duration:', error);
    return 'Unknown';
  }
};

export function IPDAdmissionsTable({ 
  admissions, 
  canEdit, 
  onEdit, 
  onDischarge, 
  onShiftBed, 
  onDelete, 
  showStatus = true,
  showStayDuration = false
}: IPDAdmissionsTableProps) {
  const [sortField, setSortField] = useState<SortField>('admissionTime')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [viewingHistory, setViewingHistory] = useState<IPDAdmission | null>(null)
  const [, forceUpdate] = useState({});

  useEffect(() => {
    if (!showStayDuration) return;
    
    const intervalId = setInterval(() => {
      forceUpdate({});
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [showStayDuration]);

  const sortData = (data: IPDAdmission[]) => {
    return [...data].sort((a, b) => {
      switch (sortField) {
        case 'ipdNo':
          return sortOrder === 'asc' 
            ? (a.ipdNo || '').localeCompare(b.ipdNo || '')
            : (b.ipdNo || '').localeCompare(a.ipdNo || '');
        
        case 'patientName':
          return sortOrder === 'asc'
            ? (a.patient?.name || '').localeCompare(b.patient?.name || '')
            : (b.patient?.name || '').localeCompare(a.patient?.name || '');
        
        case 'admissionTime':
          const aTime = new Date(a.admissionTime).getTime();
          const bTime = new Date(b.admissionTime).getTime();
          return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
        
        case 'ward':
          return sortOrder === 'asc'
            ? (a.bed?.ward || '').localeCompare(b.bed?.ward || '')
            : (b.bed?.ward || '').localeCompare(a.bed?.ward || '');
        
        case 'status':
          return sortOrder === 'asc'
            ? (a.status || '').localeCompare(b.status || '')
            : (b.status || '').localeCompare(a.status || '');
        
        case 'doctors':
          const aDoctor = a.doctors?.[0]?.doctor?.name || '';
          const bDoctor = b.doctors?.[0]?.doctor?.name || '';
          return sortOrder === 'asc'
            ? aDoctor.localeCompare(bDoctor)
            : bDoctor.localeCompare(aDoctor);
        
        default:
          return 0;
      }
    });
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead className="px-0">
      <Button
        variant="ghost"
        onClick={() => toggleSort(field)}
        className={cn(
          "h-8 px-2 font-medium hover:bg-transparent",
          "flex items-center gap-2 w-full justify-between",
          "text-left"
        )}
      >
        <span>{children}</span>
        <div className="shrink-0 text-muted-foreground">
          {sortField === field ? (
            sortOrder === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </div>
      </Button>
    </TableHead>
  );

  const sortedAdmissions = sortData(admissions);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="ipdNo">IPD No</SortableHeader>
              <SortableHeader field="patientName">Patient</SortableHeader>
              <TableHead>Contact</TableHead>
              <SortableHeader field="admissionTime">Admission Date</SortableHeader>
              {showStayDuration && <TableHead>Stay Duration</TableHead>}
              <SortableHeader field="ward">Location</SortableHeader>
              <SortableHeader field="doctors">Doctors</SortableHeader>
              <SortableHeader field="panel">Panel</SortableHeader>
              {showStatus && <SortableHeader field="status">Status</SortableHeader>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAdmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showStayDuration ? 9 : 8} className="text-center text-muted-foreground">
                  No admissions found
                </TableCell>
              </TableRow>
            ) : (
              sortedAdmissions.map((admission) => (
                <TableRow key={admission.id}>
                  <TableCell className="font-medium">{admission.ipdNo}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{admission.patient?.name || 'Unknown'}</div>
                    </div>
                  </TableCell>
                  <TableCell>{admission.patient?.contact || 'No contact'}</TableCell>
                  <TableCell>
                    {formatDate(admission.admissionTime)}
                  </TableCell>
                  {showStayDuration && (
                    <TableCell>
                      <div className="font-medium">
                        {formatStayDuration(admission.admissionTime)}
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{admission.bed?.ward || 'Unknown'}</div>
                      <div className="text-sm">
                        Bed {admission.bed?.bedNumber || admission.bed?.bed_number || 'Unknown'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {admission.doctors?.map((d: any) => (
                        <Badge 
                          key={d.id || d.doctor?.id} 
                          variant="secondary"
                        >
                          {d.name || d.doctor?.name || 'Unknown'}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {admission.panel?.name || '-'}
                  </TableCell>
                  {showStatus && (
                    <TableCell>
                      <Badge 
                        variant={
                          admission.status === 'Admitted' ? 'default' :
                          admission.status === 'Discharged' ? 'outline' :
                          admission.status === 'Transferred' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {admission.status}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    {canEdit && (
                      <AdmissionActions 
                        admission={admission}
                        onEdit={onEdit}
                        onDischarge={onDischarge}
                        onShiftBed={onShiftBed}
                        onDelete={onDelete}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BedHistoryDialog
        admission={viewingHistory}
        open={viewingHistory !== null}
        onOpenChange={(open) => !open && setViewingHistory(null)}
      />
    </>
  )
} 