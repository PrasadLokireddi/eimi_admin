
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
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();

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

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <AdminHeader 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Sidebar */}
      <AdminSidebar 
        navItems={navItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Fixed Header for Desktop */}
        <div className="hidden lg:block sticky top-0 z-40 bg-background border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 lg:p-6 gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold capitalize truncate">{activeTab}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage your {activeTab} efficiently
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 shrink-0"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 lg:p-6 pt-16 sm:pt-20 lg:pt-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
