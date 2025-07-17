
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RecentActivity = () => {
  const activities = [
    { type: 'vendor', message: 'New vendor registration: TechHub Solutions', time: '2 min ago', color: 'green' },
    { type: 'product', message: 'Product approved: Commercial Plot in Downtown', time: '5 min ago', color: 'blue' },
    { type: 'booking', message: 'New booking: Office Space viewing', time: '10 min ago', color: 'orange' },
    { type: 'discount', message: 'Discount created: Summer Sale 20%', time: '15 min ago', color: 'purple' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className={`w-2 h-2 rounded-full bg-${activity.color}-500 mt-2`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
