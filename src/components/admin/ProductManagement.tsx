'use client';

import { useEffect, useState } from 'react';
import axiosClient from '@/services/axiosClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Check,
  X,
  Eye,
  Search,
  Filter,
  MapPin,
  DollarSign,
  ArrowLeft,
  ArrowRight,
  IndianRupee
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const ProductManagement = () => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // now will store categoryId instead of category name
  const [filterCategory, setFilterCategory] = useState('all');

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  // Search state
  const [searchText, setSearchText] = useState('');

  // Pagination
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  // Reject dialog states
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectProduct, setRejectProduct] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.put('product/all', {
        page: pageNo,
        size: pageSize,
        searchText: searchText.trim() || undefined, // Pass searchText to API
        status: filterStatus !== 'all' ? filterStatus.toUpperCase() : undefined,

        // ✅ changed from passing category name to passing categoryId
        categoryId: filterCategory !== 'all' ? filterCategory : undefined
      });
      const list = res.data?.data?.data || [];
      setProducts(list);
      setTotalProducts(res.data?.data?.total || 0);
    } catch (err) {
      toast({
        title: 'Failed to load products',
        description: 'An error occurred while fetching product data.',
        variant: 'destructive',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function fetchCategories() {
    setIsLoading(true);
    try {
      const res = await axiosClient.put('category/list');
      const categoryList = Array.isArray(res.data?.data) ? res.data.data : [];
      setCategories(categoryList);
    } catch {
      toast({
        title: 'Failed to load categories',
        description: 'An error occurred while fetching category data.',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
      fetchCategories();
    }, 100);

    return () => clearTimeout(delayDebounce);
  }, [pageNo, pageSize, filterStatus, filterCategory, searchText]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800';
    }
  };

  const handleApprove = async (product: any) => {
    try {
      const updatedProduct = { ...product, productStatus: 'APPROVED' };
      await axiosClient.post('product', updatedProduct);
      toast({
        title: 'Product Approved',
        description: 'Product has been approved and is now visible to users.'
      });
      fetchProducts();
      setIsDetailsOpen(false);
    } catch {
      toast({
        title: 'Approval Failed',
        description: 'Could not approve the product. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleOpenRejectDialog = (product: any) => {
    setRejectProduct(product);
    setRejectReason('');
    setIsRejectDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectProduct) return;
    try {
      const updatedProduct = {
        ...rejectProduct,
        productStatus: 'REJECTED',
        rejectionReason: rejectReason || ''
      };
      await axiosClient.post('product', updatedProduct);
      toast({
        title: 'Product Rejected',
        description: 'The product has been rejected and the vendor will be notified.'
      });
      fetchProducts();
    } catch {
      toast({
        title: 'Rejection Failed',
        description: 'Could not reject the product. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsRejectDialogOpen(false);
      setRejectProduct(null);
    }
  };

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  // Handle status filter change - ensure proper case handling
  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
    setPageNo(1); // Reset to first page when filter changes
  };

  const filteredProducts = products; // Filtering now handled in API

  // Pagination rendering
  const totalPages = Math.ceil(totalProducts / pageSize);
  const renderPagination = () => {
    const pages = [];
    const maxVisible = 3;
    let start = Math.max(1, pageNo - 1);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    pages.push(
      <button
        key="prev"
        onClick={() => setPageNo(pageNo - 1)}
        disabled={pageNo === 1}
        className={`text-muted-foreground flex items-center gap-1 ${pageNo === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ArrowLeft className="inline" /> Previous
      </button>
    );

    if (start > 1) {
      pages.push(<span key="start">1</span>);
      if (start > 2) pages.push(<span key="dots1">...</span>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPageNo(i)}
          className={`px-3 py-1 rounded ${i === pageNo ? 'bg-gray-200 font-semibold' : 'text-muted-foreground'}`}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="dots2">...</span>);
      pages.push(<span key="end">{totalPages}</span>);
    }

    pages.push(
      <button
        key="next"
        onClick={() => setPageNo(pageNo + 1)}
        disabled={pageNo === totalPages}
        className={`text-muted-foreground flex items-center gap-1 ${pageNo === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Next <ArrowRight className="inline" />
      </button>
    );

    return (
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex gap-2 items-center text-sm">{pages}</div>
        <div className="text-sm text-muted-foreground">
          Showing {(pageNo - 1) * pageSize + 1} - {Math.min(pageNo * pageSize, totalProducts)} of {totalProducts}
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 md:p-4 space-y-6">
      {/* Filters */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10 w-64"
              value={searchText}
              onChange={(e) => {
                setPageNo(1); // Reset to first page when searching
                setSearchText(e.target.value);
              }}
            />
          </div>

          {/* ✅ Category Filter using API list */}
          <Select value={filterCategory} onValueChange={(value) => {
            setFilterCategory(value);
            setPageNo(1); // Reset to first page when filter changes
          }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* ✅ Updated Status Filter - properly handles uppercase conversion */}
          <Select value={filterStatus} onValueChange={handleStatusChange}>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array(4)
            .fill(0)
            .map((_, idx) => (
              <Card key={idx}>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-12 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))
        ) : (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {products.filter((p) => p.productStatus?.toLowerCase() === 'approved').length}
                </div>
                <p className="text-sm text-muted-foreground">Approved Products</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {products.filter((p) => p.productStatus?.toLowerCase() === 'pending').length}
                </div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">
                  {products.filter((p) => p.productStatus?.toLowerCase() === 'rejected').length}
                </div>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {products.filter((p) => p.sold).length}
                </div>
                <p className="text-sm text-muted-foreground">Sold Products</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card>
        <CardContent className="p-0 flex flex-col h-[calc(100vh-260px)]">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array(5)
                .fill(0)
                .map((_, idx) => (
                  <Skeleton key={idx} className="h-10 w-full" />
                ))}
            </div>
          ) : (
            <>
              {/* This wrapper is what scrolls */}
              <div className="flex-1 overflow-y-auto">
                <table className="border border-gray-200 w-full border-collapse">
                  <thead className="bg-white sticky top-0 z-10">
                    <tr>
                      <TableHead className="px-4 py-2 text-left border-b text-sm">Product</TableHead>
                      <TableHead className="px-4 py-2 text-left border-b text-sm">Vendor</TableHead>
                      <TableHead className="px-4 py-2 text-left border-b text-sm">Category</TableHead>
                      <TableHead className="px-4 py-2 text-left border-b text-sm">Price</TableHead>
                      <TableHead className="px-4 py-2 text-center border-b text-sm">Status</TableHead>
                      <TableHead className="px-4 py-2 text-left border-b text-sm">Engagement</TableHead>
                      <TableHead className="px-4 py-2 text-right border-b text-sm">Actions</TableHead>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b border-gray-200">
                          <td className="px-4 py-2 align-top text-sm">
                            <div>
                              <div className="font-medium">{product.title}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {product.location?.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm">{product.vendorContactDetails?.name}</td>
                          <td className="px-4 py-2 text-sm">
                            <div>
                              <div className="font-medium">{product.category?.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {product.subCategory?.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <div className="flex items-center gap-1">
                              <IndianRupee className="h-3 w-3" /> {product.price}
                            </div>
                          </td>
                          {/* ✅ Updated Status column - centered alignment and no hover effect */}
                          <td className="px-4 py-2 text-center text-sm">
                            <div className="flex flex-col items-center gap-1">
                              <Badge className={`${getStatusColor(product.productStatus)} pointer-events-none`}>
                                {product.productStatus?.toUpperCase()}
                              </Badge>
                              {product.sold && (
                                <Badge variant="secondary" className="text-xs pointer-events-none">
                                  Sold
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <div>{product.views} views</div>
                            <div className="text-muted-foreground">{product.likes} likes</div>
                          </td>
                          <td className="px-4 py-2 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(product)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {product.productStatus?.toLowerCase() === "pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleApprove(product)}
                                  >
                                    <Check className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenRejectDialog(product)}
                                  >
                                    <X className="h-4 w-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-muted-foreground">
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length > 0 && (
                <div className="bg-white border-t border-gray-200 shadow-sm">
                  {renderPagination()}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
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
                    <div><span className="font-medium">Category:</span> {selectedProduct.category?.name}</div>
                    <div><span className="font-medium">Subcategory:</span> {selectedProduct.subCategory?.name}</div>
                    <div><span className="font-medium">Price:</span> ₹{selectedProduct.price}</div>
                    <div><span className="font-medium">Location:</span> {selectedProduct.location?.name}</div>
                    <div><span className="font-medium">Upload Date:</span> {new Date(selectedProduct.createdTimeStamp).toLocaleDateString()}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Vendor & Status</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Vendor:</span> {selectedProduct.vendorContactDetails?.name}</div>
                    <div className="flex items-center">
                      <span className="font-medium">Status:</span>
                      <Badge className={`ml-2 ${getStatusColor(selectedProduct.productStatus)} pointer-events-none`}>
                        {selectedProduct.productStatus?.toUpperCase()}
                      </Badge>
                    </div>
                    <div><span className="font-medium">Images:</span> {selectedProduct.images?.length || 0} uploaded</div>
                    <div><span className="font-medium">Views:</span> {selectedProduct.views}</div>
                    <div><span className="font-medium">Likes:</span> {selectedProduct.likes}</div>
                    <div><span className="font-medium">Sold:</span> {selectedProduct.sold ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {selectedProduct.productStatus?.toLowerCase() === 'pending' ? (
                  <>
                    <Button onClick={() => handleApprove(selectedProduct)} className="flex-1">
                      Approve Product
                    </Button>
                    <Button variant="outline" onClick={() => handleOpenRejectDialog(selectedProduct)} className="flex-1">
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

      {/* Reject Confirmation Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Reject Product</DialogTitle>
          </DialogHeader>
          {rejectProduct && (
            <div className="space-y-4">
              <p>
                Are you sure you want to reject the product{' '}
                <span className="font-semibold">{rejectProduct.title}</span>?
              </p>
              <Textarea
                placeholder="Optional reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                  Close
                </Button>
                <Button variant="destructive" onClick={handleConfirmReject}>
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
