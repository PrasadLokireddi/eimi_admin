
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
      <div className="flex items-center justify-between p-3 sm:p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <h1 className="text-base sm:text-lg font-semibold truncate">Admin Panel</h1>
        <div className="flex items-center gap-1 sm:gap-2">
          {user && (
            <div className="hidden xs:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="truncate max-w-20">{user.name}</span>
            </div>
          )}
          {onLogout && (
            <Button variant="ghost" size="sm" onClick={onLogout} className="p-2">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign Out</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
