import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, User, Search, Filter, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BookingManagement = () => {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const bookings = [
    {
      id: 1,
      user: 'John Smith',
      userEmail: 'john@example.com',
      userPhone: '+1234567890',
      vendor: 'Property Masters',
      vendorEmail: 'info@propmasters.com',
      product: 'Downtown Commercial Plot',
      date: '2024-01-25',
      time: '2:00 PM',
      status: 'confirmed',
      location: 'New York Downtown',
      createdAt: '2024-01-20',
      notes: 'Interested in purchasing for office expansion'
    },
    {
      id: 2,
      user: 'Sarah Johnson',
      userEmail: 'sarah@example.com',
      userPhone: '+1234567891',
      vendor: 'TechHub Solutions',
      vendorEmail: 'contact@techhub.com',
      product: 'iPhone 15 Pro Max',
      date: '2024-01-24',
      time: '11:00 AM',
      status: 'pending',
      location: 'California Store',
      createdAt: '2024-01-22',
      notes: 'Want to check condition before buying'
    },
    {
      id: 3,
      user: 'Mike Wilson',
      userEmail: 'mike@example.com',
      userPhone: '+1234567892',
      vendor: 'Property Masters',
      vendorEmail: 'info@propmasters.com',
      product: 'Luxury Apartment Rental',
      date: '2024-01-23',
      time: '4:00 PM',
      status: 'completed',
      location: 'California',
      createdAt: '2024-01-18',
      notes: 'Looking for immediate move-in'
    },
    {
      id: 4,
      user: 'Emma Davis',
      userEmail: 'emma@example.com',
      userPhone: '+1234567893',
      vendor: 'Furniture Plus',
      vendorEmail: 'hello@furnitureplus.com',
      product: 'Modern Office Desk',
      date: '2024-01-26',
      time: '10:00 AM',
      status: 'cancelled',
      location: 'Texas Showroom',
      createdAt: '2024-01-21',
      notes: 'Changed mind about purchase'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(booking => booking.status === filterStatus);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return '✓';
      case 'pending': return '⏳';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '•';
    }
  };

  return (
     <div className="p-2 md:p-4 lg:p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Booking Management</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search bookings..." className="pl-10 w-64" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">Pending Bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <p className="text-sm text-muted-foreground">Confirmed Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {bookings.filter(b => b.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {bookings.filter(b => b.status === 'cancelled').length}
            </div>
            <p className="text-sm text-muted-foreground">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      {/* Booking Timeline (scrollable) */}
      <Card className="max-h-[calc(100vh-210px)] flex flex-col">
        <CardHeader>
          <CardTitle>Booking Timeline</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto flex-1 space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50">
              <div className="text-2xl">{getStatusIcon(booking.status)}</div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{booking.product}</h4>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {booking.user}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {booking.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {booking.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {booking.location}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Vendor: {booking.vendor}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">User Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedBooking.user}</div>
                    <div><span className="font-medium">Email:</span> {selectedBooking.userEmail}</div>
                    <div><span className="font-medium">Phone:</span> {selectedBooking.userPhone}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Vendor Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedBooking.vendor}</div>
                    <div><span className="font-medium">Email:</span> {selectedBooking.vendorEmail}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Booking Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Product:</span> {selectedBooking.product}</div>
                  <div><span className="font-medium">Location:</span> {selectedBooking.location}</div>
                  <div><span className="font-medium">Date:</span> {selectedBooking.date}</div>
                  <div><span className="font-medium">Time:</span> {selectedBooking.time}</div>
                  <div><span className="font-medium">Status:</span> 
                    <Badge className={`ml-2 ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </Badge>
                  </div>
                  <div><span className="font-medium">Created:</span> {selectedBooking.createdAt}</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Notes</h4>
                <p className="text-sm bg-muted p-3 rounded">
                  {selectedBooking.notes}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setIsDetailsOpen(false)} className="flex-1">
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

export default BookingManagement;
