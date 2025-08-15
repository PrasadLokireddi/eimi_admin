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
import {
  UserCheck, UserX, Eye, Search, Filter, Heart, ArrowLeft, ArrowRight,
  Inbox
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/services/axiosClient';
import { useAuth } from '@/contexts/AuthContext';

const UserManagement = () => {
  const { toast } = useToast();
  const { token } = useAuth();

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchText, setSearchText] = useState('');

  const [newUsers, setNewUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchText && searchText.length < 3) return;

      setIsLoading(true);
      try {
        const requestBody = {
          searchText: searchText,
          status: filterStatus === 'all' ? null : filterStatus,
          page: pageNo,
          size: pageSize,
        };

        const response = await axiosClient.put(`user/all`, requestBody);
        const data = response.data?.data || {};
        setNewUsers(data.data || []);
        setTotalUsers(data.total || 0);
      } catch (error) {
        toast({
          title: 'Failed to fetch users',
          description: 'Please try again later.',
          variant: 'destructive',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchUsers();
  }, [token, toast, pageNo, pageSize, filterStatus, searchText]);

  const totalPages = Math.ceil(totalUsers / pageSize);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800';
    }
  };

  const handleActivate = (userId: number) => {
    toast({
      title: 'User Activated',
      description: 'User account has been activated successfully.',
      duration: 3000,
    });
  };

  const handleSuspend = (userId: number) => {
    toast({
      title: 'User Suspended',
      description: 'User account has been suspended.',
      duration: 3000,
    });
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
      <div className="flex justify-between items-center px-4 pt-4 pb-6">
        <div className="flex gap-2 items-center text-sm">{pages}</div>
        <div className="text-sm text-muted-foreground">
          Showing {(pageNo - 1) * pageSize + 1} - {Math.min(pageNo * pageSize, totalUsers)} of {totalUsers}
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 md:p-4 lg:p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-10 w-64"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-green-600">2</div><p className="text-sm text-muted-foreground">Active Users</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-gray-600">1</div><p className="text-sm text-muted-foreground">Inactive Users</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-red-600">0</div><p className="text-sm text-muted-foreground">Suspended</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-2xl font-bold text-blue-600">23</div><p className="text-sm text-muted-foreground">Total Bookings</p></CardContent></Card>
      </div>

      {/* Table or Empty Screen */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-y-auto h-[calc(100vh-310px)]">
            {newUsers.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <Inbox className="w-12 h-12 mb-4 text-gray-400" />
                <p className="text-sm font-medium">No results found</p>
                <p className="text-xs mt-1 text-muted-foreground">Try adjusting your filters or search term.</p>
              </div>
            ) : (
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
                                <div className="text-sm text-muted-foreground">Hyderabad</div>
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
                            <Badge className={`${getStatusColor(user.status || 'ACTIVE')} pointer-events-none`}>
                              {user.status || 'ACTIVE'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm"><div>Last: 2024-01-22</div><div className="text-muted-foreground">{user.totalBookings || 0} bookings</div></div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm"><div className="flex items-center gap-1"><Heart className="h-3 w-3" />{user.favoritesCount}</div><div className="text-muted-foreground">{user.reviewsCount || 0} reviews</div></div>
                          </TableCell>
                          <TableCell>{user.createdTimeStamp?.split('T')[0]}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewDetails(user)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            
                              {user.status === 'ACTIVE' ? (
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
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </div>
          {newUsers.length > 0 && renderPagination()}
        </CardContent>
      </Card>

      {/* Dialog */}
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
                      <Badge className={`ml-2 ${getStatusColor(selectedUser.status || 'ACTIVE')} pointer-events-none`}>
                        {selectedUser.status || 'ACTIVE'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Account Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Join Date:</span> {selectedUser.createdTimeStamp?.split('T')[0] || 'N/A'}</div>
                    <div><span className="font-medium">Last Active:</span> 2024-01-22</div>
                    <div><span className="font-medium">Total Bookings:</span> {selectedUser.totalBookings || 0}</div>
                    <div><span className="font-medium">Completed:</span> {selectedUser.completedBookings || 0}</div>
                    <div><span className="font-medium">Reviews Given:</span> {selectedUser.reviewsCount || 0}</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                {selectedUser.status === 'ACTIVE' ? (
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
