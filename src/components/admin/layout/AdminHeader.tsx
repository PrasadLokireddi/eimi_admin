
import { Button } from '@/components/ui/button';
import { Menu, Bell, Search, LogOut } from 'lucide-react';

interface User {
  email: string;
  name: string;
  role: string;
}

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user?: User | null;
  onLogout?: () => void;
}

const AdminHeader = ({ sidebarOpen, setSidebarOpen, user, onLogout }: AdminHeaderProps) => {
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
          {onLogout && (
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
