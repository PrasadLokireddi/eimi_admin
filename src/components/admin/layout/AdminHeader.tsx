
import { Button } from '@/components/ui/button';
import { Menu, Bell, Search } from 'lucide-react';

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminHeader = ({ sidebarOpen, setSidebarOpen }: AdminHeaderProps) => {
  return (
    <div className="sticky top-0 z-50 bg-background border-b lg:hidden">
      <div className="flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Admin Panel</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
