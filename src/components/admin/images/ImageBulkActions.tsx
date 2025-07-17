
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageBulkActionsProps {
  selectedImages: string[];
}

const ImageBulkActions = ({ selectedImages }: ImageBulkActionsProps) => {
  const { toast } = useToast();

  const handleBulkDownload = () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select images to download"
      });
      return;
    }
    
    toast({
      title: "Download started",
      description: `Downloading ${selectedImages.length} images...`
    });
  };

  if (selectedImages.length === 0) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {selectedImages.length} images selected
        </span>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleBulkDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button size="sm" variant="outline">
            <Share className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button size="sm" variant="destructive">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ImageBulkActions;
