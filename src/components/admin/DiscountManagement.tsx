
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, Edit, Trash2, Search, Filter, Percent, Calendar, 
  Users, Package, TrendingUp, Eye, Copy, Share
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DiscountManagement = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Mock data
  const discounts = [
    {
      id: '1',
      name: 'Summer Sale 2024',
      code: 'SUMMER20',
      type: 'percentage',
      value: 20,
      status: 'active',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      usageCount: 145,
      usageLimit: 500,
      categories: ['Real Estate', 'Electronics'],
      minAmount: 1000,
      maxDiscount: 5000,
      description: 'Special summer discount for all categories'
    },
    {
      id: '2',
      name: 'New User Welcome',
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      usageCount: 423,
      usageLimit: null,
      categories: ['All'],
      minAmount: 500,
      maxDiscount: 2000,
      description: 'Welcome discount for first-time users'
    },
    {
      id: '3',
      name: 'Flash Sale Weekend',
      code: 'FLASH50',
      type: 'fixed',
      value: 500,
      status: 'scheduled',
      startDate: '2024-02-15',
      endDate: '2024-02-17',
      usageCount: 0,
      usageLimit: 100,
      categories: ['Electronics'],
      minAmount: 2000,
      maxDiscount: null,
      description: 'Weekend flash sale for electronics'
    },
    {
      id: '4',
      name: 'Bulk Purchase',
      code: 'BULK15',
      type: 'percentage',
      value: 15,
      status: 'expired',
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      usageCount: 89,
      usageLimit: 200,
      categories: ['Furniture'],
      minAmount: 5000,
      maxDiscount: 10000,
      description: 'Discount for bulk furniture purchases'
    }
  ];

  const stats = {
    totalDiscounts: 15,
    activeDiscounts: 8,
    scheduledDiscounts: 3,
    expiredDiscounts: 4,
    totalSavings: '₹2,45,680',
    mostUsedCode: 'WELCOME10'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'disabled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateDiscount = () => {
    toast({
      title: "Discount Created",
      description: "New discount code has been created successfully."
    });
    setIsCreateOpen(false);
  };

  const handleToggleStatus = (discountId: string) => {
    toast({
      title: "Status Updated",
      description: "Discount status has been updated."
    });
  };

  const handleDuplicate = (discountId: string) => {
    toast({
      title: "Discount Duplicated",
      description: "A copy of the discount has been created."
    });
  };

  const filteredDiscounts = discounts.filter(discount => {
    const statusMatch = filterStatus === 'all' || discount.status === filterStatus;
    const typeMatch = filterType === 'all' || discount.type === filterType;
    return statusMatch && typeMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Discount Management</h2>
          <p className="text-muted-foreground">Create and manage discount codes</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Discount
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Discount</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Discount Name</Label>
                  <Input id="name" placeholder="Summer Sale 2024" />
                </div>
                <div>
                  <Label htmlFor="code">Discount Code</Label>
                  <Input id="code" placeholder="SUMMER20" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Discount Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value">Discount Value</Label>
                  <Input id="value" type="number" placeholder="20" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minAmount">Minimum Amount</Label>
                  <Input id="minAmount" type="number" placeholder="1000" />
                </div>
                <div>
                  <Label htmlFor="maxDiscount">Maximum Discount</Label>
                  <Input id="maxDiscount" type="number" placeholder="5000" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input id="usageLimit" type="number" placeholder="500" />
                </div>
                <div>
                  <Label htmlFor="categories">Categories</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Discount description..." />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="active" />
                <Label htmlFor="active">Activate immediately</Label>
              </div>

              <Button onClick={handleCreateDiscount} className="w-full">
                Create Discount
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Percent className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{stats.totalDiscounts}</p>
              <p className="text-xs text-muted-foreground">Total Discounts</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{stats.activeDiscounts}</p>
              <p className="text-xs text-muted-foreground">Active Now</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold">{stats.scheduledDiscounts}</p>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-lg font-bold">{stats.totalSavings}</p>
              <p className="text-xs text-muted-foreground">Total Savings</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search discounts..." className="pl-10" />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="percentage">Percentage</SelectItem>
            <SelectItem value="fixed">Fixed Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Discounts List */}
      <div className="grid gap-4">
        {filteredDiscounts.map((discount) => (
          <Card key={discount.id}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{discount.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                          {discount.code}
                        </code>
                        <Badge className={getStatusColor(discount.status)}>
                          {discount.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {discount.description}
                  </p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Value</p>
                      <p className="font-medium">
                        {discount.type === 'percentage' ? `${discount.value}%` : `₹${discount.value}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Usage</p>
                      <p className="font-medium">
                        {discount.usageCount}/{discount.usageLimit || '∞'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valid Until</p>
                      <p className="font-medium">{discount.endDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Min Amount</p>
                      <p className="font-medium">₹{discount.minAmount}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleDuplicate(discount.id)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DiscountManagement;
