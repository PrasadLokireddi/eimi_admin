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
import { UserCheck, UserX, Eye, Search, Filter, Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import config from '@/config/environment';

const UserManagement = () => {
  const { toast } = useToast();
  const { token } = useAuth();

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const [newUsers, setNewUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${config.apiUrl}user/all?pageNo=${pageNo - 1}&size=${pageSize}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data?.data || {};
        setNewUsers(data.data || []);
        setTotalUsers(data.total || 0);
      } catch (error) {
        toast({
          title: 'Failed to fetch users',
          description: 'Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token, toast, pageNo, pageSize]);

  const totalPages = Math.ceil(totalUsers / pageSize);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleActivate = (userId: number) => {
    toast({ title: 'User Activated', description: 'User account has been activated successfully.' });
  };

  const handleSuspend = (userId: number) => {
    toast({ title: 'User Suspended', description: 'User account has been suspended.' });
  };

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 3;

    let start = Math.max(1, pageNo - 1);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (pageNo > 1) {
      pages.push(
        <button key="prev" onClick={() => setPageNo(pageNo - 1)} className="text-muted-foreground">
          <ArrowLeft className="inline mr-1" /> Previous
        </button>
      );
    }

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

    if (pageNo < totalPages) {
      pages.push(
        <button key="next" onClick={() => setPageNo(pageNo + 1)} className="text-muted-foreground">
          Next <ArrowRight className="inline ml-1" />
        </button>
      );
    }

    return (
      <div className="flex justify-between items-center px-4 pt-6">
        <div className="flex gap-2 items-center text-sm">{pages}</div>
        <div className="text-sm text-muted-foreground">
          Showing {(pageNo - 1) * pageSize + 1} - {Math.min(pageNo * pageSize, totalUsers)} of {totalUsers}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

            {/* Grid Cards or Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-2">
                <div className="h-6 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {/* {users.filter(u => u.status === 'active').length} */}
                2
              </div>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">
                {/* {users.filter(u => u.status === 'inactive').length} */}
                1
              </div>
              <p className="text-sm text-muted-foreground">Inactive Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {/* {users.filter(u => u.status === 'suspended').length} */}
                0
              </div>
              <p className="text-sm text-muted-foreground">Suspended</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {/* {users.reduce((total, u) => total + u.totalBookings, 0)} */}
                23
              </div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Table */}
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 bg-muted rounded w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                newUsers.map((user: any) => {
                  const contact = user.contactDetails || {};
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <div className="bg-primary/10 w-full h-full flex items-center justify-center text-primary font-medium">
                              {(contact.name || 'U').charAt(0)}
                            </div>
                          </Avatar>
                          <div>
                            <div className="font-medium">{contact.name || 'Unknown'}</div>
                            <div className="text-sm text-muted-foreground">-</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{contact.email || '-'}</div>
                          <div className="text-muted-foreground">{contact.mobile || '-'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status || 'inactive')}>
                          {user.status || 'inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Last: -</div>
                          <div className="text-muted-foreground">- bookings</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" /> 0
                          </div>
                          <div className="text-muted-foreground">0 reviews</div>
                        </div>
                      </TableCell>
                      <TableCell>{user.createdTimeStamp?.split('T')[0]}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleActivate(user.id)}>
                            <UserCheck className="h-4 w-4 text-green-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          {renderPagination()}
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
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
                    <div><span className="font-medium">Name:</span> {selectedUser?.contactDetails?.name || 'N/A'}</div>
                    <div><span className="font-medium">Email:</span> {selectedUser?.contactDetails?.email || 'N/A'}</div>
                    <div><span className="font-medium">Phone:</span> {selectedUser?.contactDetails?.mobile || 'N/A'}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${getStatusColor(selectedUser.status || 'inactive')}`}>
                        {selectedUser.status || 'inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Account Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Join Date:</span> {selectedUser.createdTimeStamp?.split('T')[0] || 'N/A'}</div>
                    <div><span className="font-medium">Last Active:</span> -</div>
                    <div><span className="font-medium">Total Bookings:</span> -</div>
                    <div><span className="font-medium">Completed:</span> -</div>
                    <div><span className="font-medium">Reviews Given:</span> -</div>
                  </div>
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
