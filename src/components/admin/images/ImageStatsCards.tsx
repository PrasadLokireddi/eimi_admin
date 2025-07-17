
import { Card } from '@/components/ui/card';
import { ImageIcon, HardDrive, FolderOpen, Eye } from 'lucide-react';

interface ImageStatsCardsProps {
  stats: {
    totalImages: number;
    storageUsed: string;
    storageLimit: string;
    categoryCount: number;
    pendingReview: number;
  };
}

const ImageStatsCards = ({ stats }: ImageStatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <ImageIcon className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-2xl font-bold">{stats.totalImages}</p>
            <p className="text-xs text-muted-foreground">Total Images</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <HardDrive className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-lg font-bold">{stats.storageUsed}</p>
            <p className="text-xs text-muted-foreground">of {stats.storageLimit}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <FolderOpen className="h-8 w-8 text-orange-600" />
          <div>
            <p className="text-2xl font-bold">{stats.categoryCount}</p>
            <p className="text-xs text-muted-foreground">Categories</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Eye className="h-8 w-8 text-purple-600" />
          <div>
            <p className="text-2xl font-bold">{stats.pendingReview}</p>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ImageStatsCards;
