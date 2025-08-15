import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '@/services/axiosClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, Clock, MapPin, User, Search, Filter, Eye, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

/* -------------------------------------------------------- */
/* simple skeleton element (utility, uses Tailwind animate) */
const Skeleton = ({ className = '' }) => (
  <div className={`bg-muted rounded animate-pulse ${className}`} />
);

/* one skeleton row that mimics a booking item --------------- */
const BookingRowSkeleton = () => (
  <div className="flex items-start gap-4 p-4 border rounded-lg">
    <Skeleton className="h-6 w-6" />
    <div className="flex-1 space-y-2">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-14" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
      </div>
      <Skeleton className="h-4 w-1/3" />
    </div>
  </div>
);

const BookingManagement = () => {
  const { toast } = useToast();

  /* ---------- get current month start and end dates ---------- */
  const getCurrentMonthRange = (): DateRange => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: startOfMonth, to: endOfMonth };
  };

  /* ---------- state ---------- */
  const [bookings, setBookings] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'all'|'pending'|'confirmed'|'completed'|'cancelled'>('all');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getCurrentMonthRange());
  const [isLoading, setIsLoading] = useState(false);
  const firstRun = useRef(true);

  /* ---------- helpers ---------- */
  const lower = (s?: string) => (typeof s === 'string' ? s.toLowerCase() : '');

  const color = (s?: string) => {
    switch (lower(s)) {
      case 'confirmed': return 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800';
      case 'pending':   return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800';
      default:          return 'bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800';
    }
  };

  const icon = (s?: string) => {
    switch (lower(s)) {
      case 'confirmed': return '✓';
      case 'pending':   return '⏳';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default:          return '•';
    }
  };

  /* ---------- format date to DD-MM-YYYY ---------- */
  const formatDateForAPI = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  /* ---------- single debounced effect ---------- */
  useEffect(() => {
    /* call immediately only the very first time */
    if (firstRun.current) {
      firstRun.current = false;
      fetchBookings(search, status, dateRange);
      return;
    }

    /* debounce every change after that */
    const id = setTimeout(() => fetchBookings(search, status, dateRange), 500);
    return () => clearTimeout(id);
  }, [search, status, dateRange]);

  /* ---------- fetch function ---------- */
  async function fetchBookings(text: string, stat: string, range: DateRange | undefined) {
    setIsLoading(true);
    try {
      const body: any = { page: 1, size: 10000, searchText: text };
      
      if (stat !== 'all') body.status = stat.toUpperCase(); // ← UPPERCASE
      
      // Add date range parameters
      if (range?.from) {
        body.startDate = formatDateForAPI(range.from);
      }
      if (range?.to) {
        body.endDate = formatDateForAPI(range.to);
      }
      
      const res = await axiosClient.put('booking/all', body);
      const list = Array.isArray(res.data?.data?.data) ? res.data.data.data : [];
      setBookings(list);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Failed to load bookings',
        description: 'An error occurred while fetching booking data.',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  /* -------------------------------------------------------- */
  return (
    <div className="p-2 md:p-4 lg:p-4 space-y-6">
      {/* header ------------------------------------------------ */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Booking Management</h2>

        <div className="flex gap-4 items-center">
          {/* search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings…"
              className="pl-10 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* date range picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd MMM, yyyy")} -{" "}
                      {format(dateRange.to, "dd MMM, yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd MMM, yyyy")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* status filter */}
          <Select value={status} onValueChange={v => setStatus(v as any)}>
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

      {/* statistics ------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {['pending','confirmed','completed','cancelled'].map(s => (
          <Card key={s}>
            <CardContent className="p-4">
              {isLoading ? (
                <Skeleton className="h-7 w-10 mb-1" />
              ) : (
                <div className={`text-2xl font-bold ${
                  s==='pending'  ? 'text-yellow-600':
                  s==='confirmed'? 'text-green-600':
                  s==='completed'? 'text-blue-600' :
                                   'text-red-600'
                }`}>
                  {bookings.filter(b => lower(b.status) === s).length}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {s.charAt(0).toUpperCase()+s.slice(1)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* booking timeline ------------------------------------- */}
      <Card className="max-h-[calc(100vh-210px)] flex flex-col">
        <CardHeader>
          <CardTitle>
            Booking Timeline {!isLoading && `(${bookings.length} total)`}
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-y-auto flex-1 space-y-4">
          {isLoading ? (
            /* 5 shimmer rows */
            Array.from({ length: 5 }).map((_, i) => <BookingRowSkeleton key={i} />)
          ) : bookings.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No bookings found</p>
          ) : (
            bookings.map(b => (
              <div key={b.id} className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50">
                <div className="text-2xl">{icon(b.status)}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{b.product?.name ?? '—'}</h4>
                    <Badge className={`${color(b.status)} pointer-events-none`}>
                      {(b.status || '').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3"/>
                      {b.userContactDetails?.name ?? '—'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3"/>
                      {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString(): '—'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3"/>
                      {b.timeSlot?.startTime ? new Date(b.timeSlot.startTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',hour12:true}): '—'}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3"/>
                      {b.location?.name ?? '—'}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Vendor: {b.vendorContactDetails?.name ?? '—'}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => { setSelected(b); setIsOpen(true); }}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* details dialog --------------------------------------- */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Booking Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-6">
              {/* user + vendor */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">User Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selected.userContactDetails?.name ?? '—'}</div>
                    <div><span className="font-medium">Email:</span> {selected.userContactDetails?.email ?? '—'}</div>
                    <div><span className="font-medium">Phone:</span> 
                      {selected.userContactDetails?.countryCode && selected.userContactDetails?.mobile 
                        ? `+${selected.userContactDetails.countryCode}-${selected.userContactDetails.mobile}`
                        : '—'
                      }
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Vendor Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selected.vendorContactDetails?.name ?? '—'}</div>
                    <div><span className="font-medium">Email:</span> {selected.vendorContactDetails?.email ?? '—'}</div>
                    <div><span className="font-medium">Phone:</span> 
                      {selected.vendorContactDetails?.countryCode && selected.vendorContactDetails?.mobile 
                        ? `+${selected.vendorContactDetails.countryCode}-${selected.vendorContactDetails.mobile}`
                        : '—'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* booking specifics */}
              <div>
                <h4 className="font-medium mb-3">Booking Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Product:</span> {selected.product?.name ?? '—'}</div>
                  <div><span className="font-medium">Location:</span> {selected.location?.name ?? '—'}</div>
                  <div><span className="font-medium">Date:</span> 
                    {selected.bookingDate ? new Date(selected.bookingDate).toLocaleDateString() : '—'}
                  </div>
                  <div><span className="font-medium">Time:</span> 
                    {selected.timeSlot?.startTime 
                      ? new Date(selected.timeSlot.startTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',hour12:true})
                      : selected.bookingDate 
                        ? new Date(selected.bookingDate).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',hour12:true})
                        : '—'
                    }
                  </div>
                  <div><span className="font-medium">Day:</span> {selected.bookingDay ?? '—'}</div>
                  <div><span className="font-medium">Status:</span> 
                    <Badge className={`ml-2 ${color(selected.status)} pointer-events-none`}>
                      {(selected.status || 'UNKNOWN').toUpperCase()}
                    </Badge>
                  </div>
                  <div><span className="font-medium">Created:</span> 
                    {selected.createdTimeStamp ? new Date(selected.createdTimeStamp).toLocaleDateString() : '—'}
                  </div>
                  {selected.rescheduleTime && (
                    <div><span className="font-medium">Rescheduled:</span> 
                      {new Date(selected.rescheduleTime).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* comments */}
              <div className="space-y-4">
                <h4 className="font-medium">Comments & Notes</h4>
                {!selected.userComment && !selected.vendorComment && !selected.adminComment && (
                  <p className="text-sm bg-muted p-3 rounded text-muted-foreground">No comments available</p>
                )}
                {selected.userComment && (
                  <div>
                    <h5 className="text-sm font-medium text-blue-600">User Comment:</h5>
                    <p className="text-sm bg-blue-50 p-3 rounded">{selected.userComment}</p>
                  </div>
                )}
                {selected.vendorComment && (
                  <div>
                    <h5 className="text-sm font-medium text-green-600">Vendor Comment:</h5>
                    <p className="text-sm bg-green-50 p-3 rounded">{selected.vendorComment}</p>
                  </div>
                )}
                {selected.adminComment && (
                  <div>
                    <h5 className="text-sm font-medium text-purple-600">Admin Comment:</h5>
                    <p className="text-sm bg-purple-50 p-3 rounded">{selected.adminComment}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setIsOpen(false)} className="flex-1">
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
