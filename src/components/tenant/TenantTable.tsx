import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tenant } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TenantTableProps {
  tenants: Tenant[];
  onEdit?: (tenant: Tenant) => void;
  onDelete?: (tenant: Tenant) => void;
}

export function TenantTable({ tenants, onEdit, onDelete }: TenantTableProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Lease End</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow 
              key={tenant.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/tenants/${tenant.id}`)}
            >
              <TableCell className="font-medium">{tenant.name}</TableCell>
              <TableCell>{tenant.roomNumber || "Not assigned"}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{tenant.email}</div>
                  <div className="text-gray-500">{tenant.phone}</div>
                </div>
              </TableCell>
              <TableCell>{tenant.joinDate}</TableCell>
              <TableCell>{tenant.leaseEnd}</TableCell>
              <TableCell>
                <Badge 
                  variant={tenant.leaseEnd ? "default" : "secondary"}
                >
                  {tenant.leaseEnd ? "Active" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit?.(tenant)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete?.(tenant)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}