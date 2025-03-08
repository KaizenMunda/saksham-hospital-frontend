'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash, UserCog } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { type StaffMember, STAFF_ROLES, DEPARTMENTS } from "@/app/dashboard/staff/types"
import { useRouter } from "next/navigation"
import { useRole } from "@/contexts/role-context"

interface StaffTableProps {
  staff: StaffMember[]
  onEdit: (staff: StaffMember) => void
  onDelete: (staff: StaffMember) => void
  onNewStaff: () => void
  isLoading: boolean
}

export function StaffTable({
  staff,
  onEdit,
  onDelete,
  onNewStaff,
  isLoading
}: StaffTableProps) {
  const router = useRouter()
  const { hasPermission } = useRole()
  const canManageUsers = hasPermission('manage_users')

  const getRoleLabel = (roleValue: string) => {
    return STAFF_ROLES.find(role => role.value === roleValue)?.label || roleValue
  }
  
  const getDepartmentLabel = (deptValue: string) => {
    return DEPARTMENTS.find(dept => dept.value === deptValue)?.label || deptValue
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                Loading staff data...
              </TableCell>
            </TableRow>
          ) : staff.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-muted-foreground">No staff members found</p>
                  {canManageUsers && (
                    <Button onClick={onNewStaff} size="sm">
                      Add New Staff
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            staff.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{getRoleLabel(member.role)}</TableCell>
                <TableCell>{getDepartmentLabel(member.department)}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{member.email}</span>
                    <span className="text-xs text-muted-foreground">{member.phone}</span>
                  </div>
                </TableCell>
                <TableCell>{format(member.joinDate, 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                    {member.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {canManageUsers && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/staff/${member.id}`)}>
                          <UserCog className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(member)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(member)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
} 