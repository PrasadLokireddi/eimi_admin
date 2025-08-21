import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import axiosClient from '@/services/axiosClient';

interface Notification {
  id: string;
  targetId: string;
  targetType: string;
  title: string;
  description: string;
  imageUrl: string | null;
  type: string;
  metadata: any;
  createdTimeStamp: string;
  updatedTimeStamp: string;
  read: boolean;
}

interface NotificationResponse {
  data: {
    total: number;
    data: Notification[];
  };
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const requestBody = {
        page: 0,
        size: 10
      };
      
      const response = await axiosClient.put('notification/all', requestBody);
      const responseData: NotificationResponse = response.data;
      
      setActivities(responseData.data.data || []);
      setTotal(responseData.data.total || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast({
        title: 'Failed to fetch notifications',
        description: 'Please try again later.',
        variant: 'destructive',
        duration: 3000,
      });
      
      setActivities([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Helper function to determine activity color based on type
  const getActivityColor = (type: string): string => {
    switch (type.toUpperCase()) {
      case 'BOOKING':
        return 'blue';
      case 'VENDOR':
        return 'green';
      case 'PRODUCT':
        return 'purple';
      case 'DISCOUNT':
        return 'orange';
      case 'PAYMENT':
        return 'yellow';
      case 'SYSTEM':
        return 'gray';
      default:
        return 'slate';
    }
  };

  // Helper function to get icon based on notification type
  const getActivityIcon = (type: string): string => {
    switch (type.toUpperCase()) {
      case 'BOOKING':
        return '📅';
      case 'VENDOR':
        return '🏢';
      case 'PRODUCT':
        return '📦';
      case 'DISCOUNT':
        return '🏷️';
      case 'PAYMENT':
        return '💳';
      case 'SYSTEM':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  // Helper function to format time
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    const diffInDays = Math.floor(diffInMinutes / 1440);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card className="w-full max-w-full">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <CardTitle className="text-base sm:text-lg font-semibold">Recent Activity</CardTitle>
          {total > 0 && (
            <span className="text-xs sm:text-sm text-muted-foreground">
              {activities.length} of {total} notifications
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {loading ? (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50 animate-pulse">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="h-3 sm:h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                  <div className="h-2 sm:h-3 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-2 sm:space-y-4">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors ${
                  activity.read 
                    ? 'bg-muted/30 hover:bg-muted/40' 
                    : 'bg-muted/50 border-l-2 border-blue-500 hover:bg-muted/60'
                } cursor-pointer active:scale-[0.98] transition-transform`}
              >
                {/* Activity Icon */}
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-${getActivityColor(activity.type)}-100 flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xs sm:text-sm">{getActivityIcon(activity.type)}</span>
                </div>
                
                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1 sm:gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs sm:text-sm font-medium leading-tight ${
                        !activity.read ? 'font-semibold' : ''
                      }`}>
                        <span className="line-clamp-2">{activity.title}</span>
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-3 leading-tight">
                        {activity.description}
                      </p>
                    </div>
                    
                    {/* Unread indicator */}
                    {!activity.read && (
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1 sm:mt-2"></div>
                    )}
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs rounded-full bg-${getActivityColor(activity.type)}-100 text-${getActivityColor(activity.type)}-700 font-medium`}>
                        {activity.type}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(activity.createdTimeStamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8 px-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xl sm:text-2xl">🔔</span>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-2">No recent activity found</p>
            <button 
              onClick={fetchNotifications}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
            >
              Refresh to check again
            </button>
          </div>
        )}
        
        {/* Load more button if there are more notifications */}
        {activities.length > 0 && activities.length < total && (
          <div className="mt-3 sm:mt-4 text-center">
            <button 
              onClick={() => {
                // You can implement pagination here
                console.log('Load more notifications');
              }}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-md hover:bg-blue-50 transition-colors w-full sm:w-auto"
            >
              Load more ({total - activities.length} remaining)
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
