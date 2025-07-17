
import { useState } from 'react';
import { 
  Users, Package, Calendar, MapPin, Grid3X3, BarChart3, 
  Image, Percent, Box
} from 'lucide-react';
import CategoryManagement from '@/components/admin/CategoryManagement';
import VendorManagement from '@/components/admin/VendorManagement';
import ProductManagement from '@/components/admin/ProductManagement';
import BookingManagement from '@/components/admin/BookingManagement';
import UserManagement from '@/components/admin/UserManagement';
import LocationManagement from '@/components/admin/LocationManagement';
import ImageManagement from '@/components/admin/ImageManagement';
import DiscountManagement from '@/components/admin/DiscountManagement';
import PackageManagement from '@/components/admin/PackageManagement';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminOverview from '@/components/admin/overview/AdminOverview';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = {
    totalVendors: 142,
    pendingVendors: 8,
    totalProducts: 1247,
    pendingProducts: 23,
    totalBookings: 89,
    todayBookings: 12,
    totalUsers: 3421,
    activeUsers: 2840,
    totalLocations: 45,
    categories: 12,
    totalImages: 2341,
    storageUsed: '2.4GB',
    activeDiscounts: 15,
    totalPackages: 8
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'categories', label: 'Categories', icon: Grid3X3 },
    { id: 'vendors', label: 'Vendors', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'discounts', label: 'Discounts', icon: Percent },
    { id: 'packages', label: 'Packages', icon: Box }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview stats={stats} />;
      case 'categories':
        return <CategoryManagement />;
      case 'vendors':
        return <VendorManagement />;
      case 'products':
        return <ProductManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'users':
        return <UserManagement />;
      case 'locations':
        return <LocationManagement />;
      case 'images':
        return <ImageManagement />;
      case 'discounts':
        return <DiscountManagement />;
      case 'packages':
        return <PackageManagement />;
      default:
        return <AdminOverview stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex">
        <AdminSidebar 
          navItems={navItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 lg:ml-0">
          <div className="p-4 lg:p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
