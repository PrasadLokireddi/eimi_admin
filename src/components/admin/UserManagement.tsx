
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar } from '@/components/ui/avatar';
import { UserCheck, UserX, Eye, Search, Filter, Calendar, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserManagement = () => {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1234567890',
      status: 'active',
      joinDate: '2023-12-15',
      lastActive: '2024-01-22',
      totalBookings: 5,
      completedBookings: 3,
      wishlistItems: 12,
      reviewsGiven: 8,
      location: 'New York'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1234567891',
      status: 'active',
      joinDate: '2024-01-05',
      lastActive: '2024-01-23',
      totalBookings: 2,
      completedBookings: 1,
      wishlistItems: 8,
      reviewsGiven: 3,
      location: 'California'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike@example.com',
      phone: '+1234567892',
      status: 'suspended',
      joinDate: '2023-11-20',
      lastActive: '2024-01-15',
      totalBookings: 15,
      completedBookings: 12,
      wishlistItems: 25,
      reviewsGiven: 18,
      location: 'Texas'
    },
    {
      id: 4,
      name: 'Emma Davis',
      email: 'emma@example.com',
      phone: '+1234567893',
      status: 'inactive',
      joinDate: '2023-10-10',
      lastActive: '2023-12-05',
      totalBookings: 1,
      completedBookings: 0,
      wishlistItems: 3,
      reviewsGiven: 0,
      location: 'Florida'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleActivate = (userId: number) => {
    toast({
      title: "User Activated",
      description: "User account has been activated successfully.",
    });
  };

  const handleSuspend = (userId: number) => {
    toast({
      title: "User Suspended",
      description: "User account has been suspended.",
    });
  };

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const filteredUsers = filterStatus === 'all' 
    ? users 
    : users.filter(user => user.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-10 w-64" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {users.filter(u => u.status === 'inactive').length}
            </div>
            <p className="text-sm text-muted-foreground">Inactive Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.status === 'suspended').length}
            </div>
            <p className="text-sm text-muted-foreground">Suspended</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {users.reduce((total, user) => total + user.totalBookings, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Bookings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <div className="bg-primary/10 w-full h-full flex items-center justify-center text-primary font-medium">
                          {user.name.charAt(0)}
                        </div>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.location}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{user.email}</div>
                      <div className="text-muted-foreground">{user.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Last: {user.lastActive}</div>
                      <div className="text-muted-foreground">
                        {user.totalBookings} bookings
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {user.wishlistItems}
                      </div>
                      <div className="text-muted-foreground">
                        {user.reviewsGiven} reviews
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(user)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {user.status === 'active' ? (
                        <Button variant="outline" size="sm" onClick={() => handleSuspend(user.id)}>
                          <UserX className="h-4 w-4 text-red-600" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleActivate(user.id)}>
                          <UserCheck className="h-4 w-4 text-green-600" />
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
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedUser.name}</div>
                    <div><span className="font-medium">Email:</span> {selectedUser.email}</div>
                    <div><span className="font-medium">Phone:</span> {selectedUser.phone}</div>
                    <div><span className="font-medium">Location:</span> {selectedUser.location}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Account Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Join Date:</span> {selectedUser.joinDate}</div>
                    <div><span className="font-medium">Last Active:</span> {selectedUser.lastActive}</div>
                    <div><span className="font-medium">Total Bookings:</span> {selectedUser.totalBookings}</div>
                    <div><span className="font-medium">Completed:</span> {selectedUser.completedBookings}</div>
                    <div><span className="font-medium">Reviews Given:</span> {selectedUser.reviewsGiven}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Engagement Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xl font-bold">{selectedUser.totalBookings}</div>
                      <div className="text-sm text-muted-foreground">Total Bookings</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xl font-bold text-red-600">{selectedUser.wishlistItems}</div>
                      <div className="text-sm text-muted-foreground">Wishlist Items</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xl font-bold text-blue-600">{selectedUser.reviewsGiven}</div>
                      <div className="text-sm text-muted-foreground">Reviews Given</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {selectedUser.status === 'active' ? (
                  <Button variant="outline" onClick={() => handleSuspend(selectedUser.id)} className="flex-1">
                    Suspend User
                  </Button>
                ) : (
                  <Button onClick={() => handleActivate(selectedUser.id)} className="flex-1">
                    Activate User
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
