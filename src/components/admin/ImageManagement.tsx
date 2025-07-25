
import { useState } from 'react';
import ImageUploadDialog from './images/ImageUploadDialog';
import ImageStatsCards from './images/ImageStatsCards';
import ImageControls from './images/ImageControls';
import ImageBulkActions from './images/ImageBulkActions';
import ImageGridView from './images/ImageGridView';
import ImageListView from './images/ImageListView';

const ImageManagement = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Mock data
  const images = [
    {
      id: '1',
      name: 'commercial-plot-1.jpg',
      url: '/api/placeholder/300/200',
      size: '2.4 MB',
      category: 'Real Estate',
      uploadDate: '2024-01-20',
      uploadedBy: 'Property Masters',
      downloads: 45,
      type: 'product'
    },
    {
      id: '2',
      name: 'iphone-15-pro.jpg',
      url: '/api/placeholder/300/200',
      size: '1.8 MB',
      category: 'Electronics',
      uploadDate: '2024-01-18',
      uploadedBy: 'TechHub Solutions',
      downloads: 128,
      type: 'product'
    },
    {
      id: '3',
      name: 'office-desk-modern.jpg',
      url: '/api/placeholder/300/200',
      size: '3.2 MB',
      category: 'Furniture',
      uploadDate: '2024-01-22',
      uploadedBy: 'Furniture Plus',
      downloads: 23,
      type: 'product'
    },
    {
      id: '4',
      name: 'brand-logo.png',
      url: '/api/placeholder/300/200',
      size: '512 KB',
      category: 'Branding',
      uploadDate: '2024-01-15',
      uploadedBy: 'Admin',
      downloads: 89,
      type: 'system'
    }
  ];

  const stats = {
    totalImages: 2341,
    storageUsed: '2.4 GB',
    storageLimit: '10 GB',
    categoryCount: 8,
    pendingReview: 12
  };

  const filteredImages = images.filter(image => {
    const matchesCategory = filterCategory === 'all' || image.category === filterCategory;
    const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
     <div className="p-2 md:p-4 lg:p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Image Management</h2>
          <p className="text-muted-foreground">Manage uploaded images and media files</p>
        </div>
        
        <ImageUploadDialog 
          isOpen={isUploadOpen}
          onOpenChange={setIsUploadOpen}
        />
      </div>

      {/* Stats Cards */}
      <ImageStatsCards stats={stats} />

      {/* Controls */}
      <ImageControls 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Bulk Actions */}
      <ImageBulkActions selectedImages={selectedImages} />

      {/* Images Grid/List */}
      {viewMode === 'grid' ? (
        <ImageGridView 
          images={filteredImages}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
        />
      ) : (
        <ImageListView 
          images={filteredImages}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
        />
      )}
    </div>
  );
};

export default ImageManagement;
