
import { Card } from '@/components/ui/card';
import { Users, Package, Calendar, Image } from 'lucide-react';

interface StatsGridProps {
  stats: {
    totalVendors: number;
    totalProducts: number;
    totalBookings: number;
    totalImages: number;
  };
}

const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg shrink-0">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-lg sm:text-2xl font-bold">{stats.totalVendors}</p>
            <p className="text-xs text-muted-foreground">Vendors</p>
          </div>
        </div>
      </Card>

      <Card className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg shrink-0">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          </div>
          <div className="min-w-0">
            <p className="text-lg sm:text-2xl font-bold">{stats.totalProducts}</p>
            <p className="text-xs text-muted-foreground">Products</p>
          </div>
        </div>
      </Card>

      <Card className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg shrink-0">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
          </div>
          <div className="min-w-0">
            <p className="text-lg sm:text-2xl font-bold">{stats.totalBookings}</p>
            <p className="text-xs text-muted-foreground">Bookings</p>
          </div>
        </div>
      </Card>

      <Card className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg shrink-0">
            <Image className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          </div>
          <div className="min-w-0">
            <p className="text-lg sm:text-2xl font-bold">{stats.totalImages}</p>
            <p className="text-xs text-muted-foreground">Images</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsGrid;
