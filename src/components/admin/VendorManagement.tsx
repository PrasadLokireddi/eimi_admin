
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar } from '@/components/ui/avatar';
import { Check, X, Eye, UserCheck, UserX, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VendorManagement = () => {
  const { toast } = useToast();
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const vendors = [
    {
      id: 1,
      name: 'TechHub Solutions',
      email: 'contact@techhub.com',
      phone: '+1234567890',
      status: 'pending',
      joinDate: '2024-01-15',
      totalProducts: 12,
      approvedProducts: 8,
      location: 'New York',
      businessType: 'Electronics'
    },
    {
      id: 2,
      name: 'Property Masters',
      email: 'info@propmasters.com',
      phone: '+1234567891',
      status: 'approved',
      joinDate: '2023-12-10',
      totalProducts: 45,
      approvedProducts: 42,
      location: 'California',
      businessType: 'Real Estate'
    },
    {
      id: 3,
      name: 'Furniture Plus',
      email: 'hello@furnitureplus.com',
      phone: '+1234567892',
      status: 'rejected',
      joinDate: '2024-01-20',
      totalProducts: 5,
      approvedProducts: 0,
      location: 'Texas',
      businessType: 'Furniture'
    },
    {
      id: 4,
      name: 'Home Decor Studio',
      email: 'studio@homedecor.com',
      phone: '+1234567893',
      status: 'disabled',
      joinDate: '2023-11-05',
      totalProducts: 28,
      approvedProducts: 25,
      location: 'Florida',
      businessType: 'Furniture'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'disabled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (vendorId: number) => {
    toast({
      title: "Vendor Approved",
      description: "Vendor has been successfully approved and can now list products.",
    });
  };

  const handleReject = (vendorId: number) => {
    toast({
      title: "Vendor Rejected",
      description: "Vendor application has been rejected.",
    });
  };

  const handleViewDetails = (vendor: any) => {
    setSelectedVendor(vendor);
    setIsDetailsOpen(true);
  };

  const filteredVendors = filterStatus === 'all' 
    ? vendors 
    : vendors.filter(vendor => vendor.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vendor Management</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search vendors..." className="pl-10 w-64" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {vendors.filter(v => v.status === 'approved').length}
            </div>
            <p className="text-sm text-muted-foreground">Approved Vendors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {vendors.filter(v => v.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {vendors.filter(v => v.status === 'rejected').length}
            </div>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {vendors.filter(v => v.status === 'disabled').length}
            </div>
            <p className="text-sm text-muted-foreground">Disabled</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <div className="bg-primary/10 w-full h-full flex items-center justify-center text-primary font-medium">
                          {vendor.name.charAt(0)}
                        </div>
                      </Avatar>
                      <div>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-sm text-muted-foreground">{vendor.location}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{vendor.email}</div>
                      <div className="text-muted-foreground">{vendor.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{vendor.businessType}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{vendor.totalProducts} total</div>
                      <div className="text-muted-foreground">{vendor.approvedProducts} approved</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(vendor.status)}>
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{vendor.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(vendor)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {vendor.status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleApprove(vendor.id)}>
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleReject(vendor.id)}>
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                      {vendor.status === 'approved' && (
                        <Button variant="outline" size="sm">
                          <UserX className="h-4 w-4" />
                        </Button>
                      )}
                      {vendor.status === 'disabled' && (
                        <Button variant="outline" size="sm">
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedVendor.name}</div>
                    <div><span className="font-medium">Email:</span> {selectedVendor.email}</div>
                    <div><span className="font-medium">Phone:</span> {selectedVendor.phone}</div>
                    <div><span className="font-medium">Location:</span> {selectedVendor.location}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Business Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Type:</span> {selectedVendor.businessType}</div>
                    <div><span className="font-medium">Join Date:</span> {selectedVendor.joinDate}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${getStatusColor(selectedVendor.status)}`}>
                        {selectedVendor.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Product Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xl font-bold">{selectedVendor.totalProducts}</div>
                      <div className="text-sm text-muted-foreground">Total Products</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xl font-bold text-green-600">{selectedVendor.approvedProducts}</div>
                      <div className="text-sm text-muted-foreground">Approved</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xl font-bold text-yellow-600">
                        {selectedVendor.totalProducts - selectedVendor.approvedProducts}
                      </div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleApprove(selectedVendor.id)} className="flex-1">
                  Approve Vendor
                </Button>
                <Button variant="outline" onClick={() => handleReject(selectedVendor.id)} className="flex-1">
                  Reject Vendor
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorManagement;
