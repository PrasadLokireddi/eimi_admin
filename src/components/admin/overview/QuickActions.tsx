
import { Button } from '@/components/ui/button';
import { Package, Percent, Image, Box } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Button className="h-16 flex-col gap-2">
        <Package className="h-5 w-5" />
        <span className="text-xs">Add Product</span>
      </Button>
      <Button variant="outline" className="h-16 flex-col gap-2">
        <Percent className="h-5 w-5" />
        <span className="text-xs">New Discount</span>
      </Button>
      <Button variant="outline" className="h-16 flex-col gap-2">
        <Image className="h-5 w-5" />
        <span className="text-xs">Upload Images</span>
      </Button>
      <Button variant="outline" className="h-16 flex-col gap-2">
        <Box className="h-5 w-5" />
        <span className="text-xs">Create Package</span>
      </Button>
    </div>
  );
};

export default QuickActions;
