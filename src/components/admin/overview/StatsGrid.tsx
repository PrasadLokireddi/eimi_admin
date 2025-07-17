
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalVendors}</p>
            <p className="text-xs text-muted-foreground">Vendors</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Package className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
            <p className="text-xs text-muted-foreground">Products</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Calendar className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalBookings}</p>
            <p className="text-xs text-muted-foreground">Bookings</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Image className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalImages}</p>
            <p className="text-xs text-muted-foreground">Images</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsGrid;
