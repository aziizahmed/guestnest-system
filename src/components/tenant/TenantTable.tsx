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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TenantTableProps {
  tenants: Tenant[];
  onEdit?: (tenant: Tenant) => void;
  onDelete?: (tenant: Tenant) => void;
}

export function TenantTable({ tenants, onEdit, onDelete }: TenantTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const handleDelete = (tenant: Tenant) => {
    onDelete?.(tenant);
    toast({
      title: "Tenant Deleted",
      description: `${tenant.name} has been removed successfully.`,
    });
  };

  const handleEdit = (tenant: Tenant) => {
    navigate(`/tenants/edit/${tenant.id}`);
  };

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
                    onClick={() => handleEdit(tenant)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete {tenant.name}'s
                          tenant record and remove all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(tenant)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}