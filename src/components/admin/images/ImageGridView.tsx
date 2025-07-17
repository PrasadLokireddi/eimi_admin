
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

interface ImageGridViewProps {
  images: ImageData[];
  selectedImages: string[];
  setSelectedImages: (images: string[]) => void;
}

const ImageGridView = ({ images, selectedImages, setSelectedImages }: ImageGridViewProps) => {
  const { toast } = useToast();

  const handleDelete = (imageId: string) => {
    toast({
      title: "Image deleted",
      description: "Image has been removed from storage"
    });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden">
          <div className="aspect-square relative">
            <img 
              src={image.url} 
              alt={image.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
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
            </div>
          </div>
          <CardContent className="p-3">
            <p className="text-xs font-medium truncate">{image.name}</p>
            <p className="text-xs text-muted-foreground">{image.size}</p>
            <div className="flex justify-between items-center mt-2">
              <Badge variant="secondary" className="text-xs">
                {image.category}
              </Badge>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Download className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0 text-destructive"
                  onClick={() => handleDelete(image.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ImageGridView;
