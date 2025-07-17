
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageData {
  id: string;
  name: string;
  url: string;
  size: string;
  category: string;
  uploadDate: string;
  uploadedBy: string;
  downloads: number;
  type: string;
}

interface ImageListViewProps {
  images: ImageData[];
  selectedImages: string[];
  setSelectedImages: (images: string[]) => void;
}

const ImageListView = ({ images, selectedImages, setSelectedImages }: ImageListViewProps) => {
  const { toast } = useToast();

  const handleDelete = (imageId: string) => {
    toast({
      title: "Image deleted",
      description: "Image has been removed from storage"
    });
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {images.map((image) => (
            <div key={image.id} className="flex items-center gap-4 p-4 hover:bg-muted/50">
              <input
                type="checkbox"
                className="rounded"
                checked={selectedImages.includes(image.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedImages([...selectedImages, image.id]);
                  } else {
                    setSelectedImages(selectedImages.filter(id => id !== image.id));
                  }
                }}
              />
              <img 
                src={image.url} 
                alt={image.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{image.name}</p>
                <p className="text-sm text-muted-foreground">
                  {image.uploadedBy} • {image.uploadDate} • {image.size}
                </p>
              </div>
              <Badge variant="secondary">{image.category}</Badge>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-destructive"
                  onClick={() => handleDelete(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageListView;
