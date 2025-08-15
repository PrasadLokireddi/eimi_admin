import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Avatar } from '@/components/ui/avatar';
import { ArrowLeft, ArrowRight, FolderX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/services/axiosClient';
import { Check, X, Eye, UserCheck, UserX, Search, Filter } from 'lucide-react';

const VendorManagement = () => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalVendors, setTotalVendors] = useState<number>(0);

  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      try {
        const requestBody = {
          searchText,
          status: filterStatus === 'all' ? null : filterStatus,
          page: pageNo,
          size: pageSize,
        };

        const response = await axiosClient.put('vendor/all', requestBody);
        const data = response.data?.data || {};
        setVendors(data.data || []);
        setTotalVendors(data.total || 0);
      } catch (error) {
        toast({
          title: 'Failed to fetch vendors',
          description: 'Please try again later.',
          variant: 'destructive',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, [toast, pageNo, pageSize, filterStatus, searchText]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800';
      case 'DISABLED': return 'bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800';
    }
  };

  const handleViewDetails = (vendor: any) => {
    setSelectedVendor(vendor);
    setIsDetailsOpen(true);
  };

  const statusCounts = vendors.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalPages = Math.max(1, Math.ceil(totalVendors / pageSize));

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

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 3;
    let start = Math.max(1, pageNo - 1);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    pages.push(
      <button key="prev" onClick={() => setPageNo(pageNo - 1)} disabled={pageNo === 1}
        className={`text-muted-foreground flex items-center gap-1 ${pageNo === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <ArrowLeft className="inline" /> Previous
      </button>
    );

    if (start > 1) {
      pages.push(<span key="start">1</span>);
      if (start > 2) pages.push(<span key="dots1">...</span>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button key={i} onClick={() => setPageNo(i)}
          className={`px-3 py-1 rounded ${i === pageNo ? 'bg-gray-200 font-semibold' : 'text-muted-foreground'}`}>
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="dots2">...</span>);
      pages.push(<span key="end">{totalPages}</span>);
    }

    pages.push(
      <button key="next" onClick={() => setPageNo(pageNo + 1)} disabled={pageNo === totalPages}
        className={`text-muted-foreground flex items-center gap-1 ${pageNo === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>
        Next <ArrowRight className="inline" />
      </button>
    );

    return (
      <div className="flex justify-between items-center px-4 pt-6 pb-6">
        <div className="flex gap-2 items-center text-sm">{pages}</div>
        <div className="text-sm text-muted-foreground">
          Showing {(pageNo - 1) * pageSize + 1} - {Math.min(pageNo * pageSize, totalVendors)} of {totalVendors}
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 md:p-4 lg:p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seller Management</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Sellers..."
              className="pl-10 w-64"
              value={searchText}
              onChange={e => {
                setSearchText(e.target.value);
                setPageNo(1);
              }}
            />
          </div>
          <Select value={filterStatus} onValueChange={val => { setFilterStatus(val); setPageNo(1); }}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              {/* <SelectItem value="DISABLED">Disabled</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-green-600">{statusCounts['approved'] || 0}</div><p className="text-sm text-muted-foreground">Approved Sellers</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-yellow-600">{statusCounts['pending'] || 0}</div><p className="text-sm text-muted-foreground">Pending Approval</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-red-600">{statusCounts['rejected'] || 0}</div><p className="text-sm text-muted-foreground">Rejected</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-gray-600">{statusCounts['disabled'] || 0}</div><p className="text-sm text-muted-foreground">Disabled</p></CardContent></Card>
      </div>

      {/* Table or Empty */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-y-auto h-[calc(100vh-310px)]">
            {isLoading ? (
              <Table>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}><div className="h-4 bg-muted rounded w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : vendors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
                <FolderX className="h-16 w-16 mb-4 text-gray-400" />
                <p className="text-lg font-medium">No vendors found</p>
                <p className="text-sm">Try changing filters or search keywords</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map(vendor => (
                    <TableRow key={vendor.id}>
                      <TableCell>{vendor.contactDetails?.name || 'N/A'}</TableCell>
                      <TableCell>{vendor.contactDetails?.email || 'N/A'}</TableCell>
                      <TableCell>{vendor.businessName || 'N/A'}</TableCell>
                      <TableCell>{vendor.totalProducts || 0}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(vendor.status)} pointer-events-none`}>
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{vendor.createdTimeStamp?.split('T')[0]}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(vendor)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {vendor.status === 'PENDING' && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleApprove(vendor.id)}>
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleReject(vendor.id)}>
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                          {vendor.status === 'APPROVED' && (
                            <Button variant="outline" size="sm">
                              <UserX className="h-4 w-4" />
                            </Button>
                          )}
                          {vendor.status === 'DISABLED' && (
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
            )}
          </div>
          {renderPagination()}
        </CardContent>
      </Card>

      {/* Details Dialog */}
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
                    <div><span className="font-medium">Name:</span> {selectedVendor.contactDetails?.name || 'N/A'}</div>
                    <div><span className="font-medium">Email:</span> {selectedVendor.contactDetails?.email || 'N/A'}</div>
                    <div><span className="font-medium">Phone:</span> {selectedVendor.contactDetails?.mobile || 'N/A'}</div>
                    <div><span className="font-medium">Location:</span> {selectedVendor.contactDetails?.location || 'N/A'}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Business Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Type:</span> {selectedVendor.businessName || 'N/A'}</div>
                    <div><span className="font-medium">Join Date:</span> {selectedVendor.createdTimeStamp?.split('T')[0] || 'N/A'}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${getStatusColor(selectedVendor.status)} pointer-events-none`}>
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
                        {selectedVendor.rejectedProducts}
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
