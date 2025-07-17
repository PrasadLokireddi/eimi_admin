
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
  Plus, Edit, Trash2, Search, Box, Users, Calendar, 
  Star, TrendingUp, Eye, Copy, Settings, Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PackageManagement = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Mock data
  const packages = [
    {
      id: '1',
      name: 'Premium Listing',
      type: 'vendor',
      price: 2999,
      duration: 30,
      status: 'active',
      features: [
        'Featured placement in search',
        'Priority customer support',
        'Advanced analytics',
        'Up to 10 product listings',
        'Social media promotion'
      ],
      subscribers: 45,
      revenue: 134955,
      description: 'Get maximum visibility for your products with premium features'
    },
    {
      id: '2',
      name: 'Basic Vendor Plan',
      type: 'vendor',
      price: 999,
      duration: 30,
      status: 'active',
      features: [
        'Up to 5 product listings',
        'Basic analytics',
        'Email support',
        'Standard search placement'
      ],
      subscribers: 128,
      revenue: 127872,
      description: 'Perfect for new vendors starting their business'
    },
    {
      id: '3',
      name: 'Enterprise Solution',
      type: 'vendor',
      price: 9999,
      duration: 30,
      status: 'active',
      features: [
        'Unlimited product listings',
        'Dedicated account manager',
        'Custom branding options',
        'API access',
        'White-label solution',
        'Priority placement'
      ],
      subscribers: 12,
      revenue: 119988,
      description: 'Complete solution for large businesses and enterprises'
    },
    {
      id: '4',
      name: 'VIP User Membership',
      type: 'user',
      price: 499,
      duration: 30,
      status: 'active',
      features: [
        'Early access to new listings',
        'Exclusive discounts',
        'Priority booking slots',
        'Personal shopping assistant',
        'Free consultation calls'
      ],
      subscribers: 234,
      revenue: 116766,
      description: 'Premium experience for serious buyers'
    },
    {
      id: '5',
      name: 'Student Package',
      type: 'user',
      price: 199,
      duration: 30,
      status: 'active',
      features: [
        'Student discount on all products',
        'Educational resources',
        'Career guidance',
        'Networking opportunities'
      ],
      subscribers: 67,
      revenue: 13333,
      description: 'Special package for students and young professionals'
    }
  ];

  const stats = {
    totalPackages: 8,
    activePackages: 5,
    totalSubscribers: 486,
    monthlyRevenue: '₹5,12,914',
    mostPopular: 'Basic Vendor Plan',
    averageSubscription: 30
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vendor': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreatePackage = () => {
    toast({
      title: "Package Created",
      description: "New package has been created successfully."
    });
    setIsCreateOpen(false);
  };

  const handleDuplicate = (packageId: string) => {
    toast({
      title: "Package Duplicated",
      description: "A copy of the package has been created."
    });
  };

  const filteredPackages = packages.filter(pkg => {
    const statusMatch = filterStatus === 'all' || pkg.status === filterStatus;
    const typeMatch = filterType === 'all' || pkg.type === filterType;
    return statusMatch && typeMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Package Management</h2>
          <p className="text-muted-foreground">Create and manage subscription packages</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Package</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Package Name</Label>
                  <Input id="name" placeholder="Premium Listing" />
                </div>
                <div>
                  <Label htmlFor="type">Package Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendor">Vendor Package</SelectItem>
                      <SelectItem value="user">User Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input id="price" type="number" placeholder="2999" />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (Days)</Label>
                  <Input id="duration" type="number" placeholder="30" />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Package description..."
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label>Features</Label>
                <div className="space-y-2 mt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Input 
                      key={i}
                      placeholder={`Feature ${i}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="active" />
                <Label htmlFor="active">Activate immediately</Label>
              </div>

              <Button onClick={handleCreatePackage} className="w-full">
                Create Package
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Box className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{stats.totalPackages}</p>
              <p className="text-xs text-muted-foreground">Total Packages</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{stats.totalSubscribers}</p>
              <p className="text-xs text-muted-foreground">Subscribers</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-lg font-bold">{stats.monthlyRevenue}</p>
              <p className="text-xs text-muted-foreground">Monthly Revenue</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Star className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm font-bold">{stats.mostPopular}</p>
              <p className="text-xs text-muted-foreground">Most Popular</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search packages..." className="pl-10" />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Packages Grid */}
      <div className="grid gap-6">
        {filteredPackages.map((pkg) => (
          <Card key={pkg.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Package Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{pkg.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getTypeColor(pkg.type)}>
                          {pkg.type}
                        </Badge>
                        <Badge className={getStatusColor(pkg.status)}>
                          {pkg.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">₹{pkg.price}</p>
                      <p className="text-sm text-muted-foreground">per {pkg.duration} days</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{pkg.description}</p>
                  
                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Subscribers</p>
                      <p className="text-lg font-semibold">{pkg.subscribers}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-lg font-semibold">₹{pkg.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col gap-2 lg:w-32">
                  <Button size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleDuplicate(pkg.id)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button size="sm" variant="outline" className="w-full text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
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

export default PackageManagement;
