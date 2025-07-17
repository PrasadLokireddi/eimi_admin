
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Eye, Search, Filter, MapPin, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProductManagement = () => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock data
  const products = [
    {
      id: 1,
      title: 'Downtown Commercial Plot',
      vendor: 'Property Masters',
      category: 'Real Estate',
      subcategory: 'Commercial Plots',
      price: '$150,000',
      location: 'New York Downtown',
      status: 'pending',
      uploadDate: '2024-01-20',
      views: 45,
      likes: 12,
      images: 3,
      sold: false
    },
    {
      id: 2,
      title: 'iPhone 15 Pro Max',
      vendor: 'TechHub Solutions',
      category: 'Electronics',
      subcategory: 'Smartphones',
      price: '$1,200',
      location: 'California',
      status: 'approved',
      uploadDate: '2024-01-18',
      views: 128,
      likes: 34,
      images: 5,
      sold: false
    },
    {
      id: 3,
      title: 'Modern Office Desk',
      vendor: 'Furniture Plus',
      category: 'Furniture',
      subcategory: 'Office Furniture',
      price: '$450',
      location: 'Texas',
      status: 'rejected',
      uploadDate: '2024-01-22',
      views: 23,
      likes: 5,
      images: 2,
      sold: false
    },
    {
      id: 4,
      title: 'Luxury Apartment Rental',
      vendor: 'Property Masters',
      category: 'Real Estate',
      subcategory: 'Rentals',
      price: '$2,500/month',
      location: 'California',
      status: 'approved',
      uploadDate: '2024-01-15',
      views: 89,
      likes: 23,
      images: 8,
      sold: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (productId: number) => {
    toast({
      title: "Product Approved",
      description: "Product has been approved and is now visible to users.",
    });
  };

  const handleReject = (productId: number) => {
    toast({
      title: "Product Rejected",
      description: "Product has been rejected and vendor has been notified.",
    });
  };

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const filteredProducts = products.filter(product => {
    const statusMatch = filterStatus === 'all' || product.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || product.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-10 w-64" />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Real Estate">Real Estate</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Furniture">Furniture</SelectItem>
            </SelectContent>
          </Select>
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
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.status === 'approved').length}
            </div>
            <p className="text-sm text-muted-foreground">Approved Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {products.filter(p => p.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {products.filter(p => p.status === 'rejected').length}
            </div>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {products.filter(p => p.sold).length}
            </div>
            <p className="text-sm text-muted-foreground">Sold Products</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {product.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.vendor}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.category}</div>
                      <div className="text-sm text-muted-foreground">{product.subcategory}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {product.price}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge className={getStatusColor(product.status)}>
                        {product.status}
                      </Badge>
                      {product.sold && (
                        <Badge variant="secondary" className="text-xs">
                          Sold
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{product.views} views</div>
                      <div className="text-muted-foreground">{product.likes} likes</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(product)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {product.status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleApprove(product.id)}>
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleReject(product.id)}>
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Product Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Title:</span> {selectedProduct.title}</div>
                    <div><span className="font-medium">Category:</span> {selectedProduct.category}</div>
                    <div><span className="font-medium">Subcategory:</span> {selectedProduct.subcategory}</div>
                    <div><span className="font-medium">Price:</span> {selectedProduct.price}</div>
                    <div><span className="font-medium">Location:</span> {selectedProduct.location}</div>
                    <div><span className="font-medium">Upload Date:</span> {selectedProduct.uploadDate}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Vendor & Status</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Vendor:</span> {selectedProduct.vendor}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${getStatusColor(selectedProduct.status)}`}>
                        {selectedProduct.status}
                      </Badge>
                    </div>
                    <div><span className="font-medium">Images:</span> {selectedProduct.images} uploaded</div>
                    <div><span className="font-medium">Views:</span> {selectedProduct.views}</div>
                    <div><span className="font-medium">Likes:</span> {selectedProduct.likes}</div>
                    <div><span className="font-medium">Sold:</span> {selectedProduct.sold ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>

              {selectedProduct.status === 'pending' && (
                <div>
                  <h4 className="font-medium mb-3">Review Comments</h4>
                  <Textarea 
                    placeholder="Add comments for vendor (optional)..."
                    className="min-h-[100px]"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedProduct.status === 'pending' ? (
                  <>
                    <Button onClick={() => handleApprove(selectedProduct.id)} className="flex-1">
                      Approve Product
                    </Button>
                    <Button variant="outline" onClick={() => handleReject(selectedProduct.id)} className="flex-1">
                      Reject Product
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="flex-1">
                    Close
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
