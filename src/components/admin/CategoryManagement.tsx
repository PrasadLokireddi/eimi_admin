
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CategoryManagement = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  // Mock data
  const categories = [
    {
      id: 1,
      name: 'Real Estate',
      subcategories: [
        { id: 101, name: 'Commercial Plots', fields: ['price', 'area', 'location', 'margin'] },
        { id: 102, name: 'Residential Plots', fields: ['price', 'area', 'location'] },
        { id: 103, name: 'Rentals', fields: ['rent', 'deposit', 'area', 'furnished'] }
      ]
    },
    {
      id: 2,
      name: 'Electronics',
      subcategories: [
        { id: 201, name: 'Smartphones', fields: ['price', 'brand', 'model', 'condition'] },
        { id: 202, name: 'Laptops', fields: ['price', 'brand', 'specifications', 'warranty'] }
      ]
    },
    {
      id: 3,
      name: 'Furniture',
      subcategories: [
        { id: 301, name: 'Living Room', fields: ['price', 'material', 'dimensions', 'condition'] },
        { id: 302, name: 'Bedroom', fields: ['price', 'material', 'size', 'assembly'] }
      ]
    }
  ];

  const fieldTypes = ['text', 'number', 'select', 'textarea', 'checkbox', 'file'];

  const handleCreateCategory = () => {
    toast({
      title: "Category Created",
      description: "New category has been successfully created.",
    });
    setIsDialogOpen(false);
  };

  const handleConfigureFields = (category: any) => {
    setSelectedCategory(category);
    setIsFieldDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold truncate">Category & Field Management</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Manage categories and their custom fields</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Category</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="categoryName">Category Name</Label>
                <Input id="categoryName" placeholder="Enter category name" />
              </div>
              <div>
                <Label htmlFor="categoryDesc">Description</Label>
                <Input id="categoryDesc" placeholder="Category description" />
              </div>
              <Button onClick={handleCreateCategory} className="w-full">
                Create Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-4 sm:gap-6 pr-2">
          {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="truncate">{category.name}</span>
                  <Badge variant="secondary" className="text-xs w-fit">{category.subcategories.length} subcategories</Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleConfigureFields(category)}>
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Configure</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mobile View */}
              <div className="lg:hidden space-y-4">
                {category.subcategories.map((sub) => (
                  <div key={sub.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{sub.name}</h4>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {sub.fields.map((field, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subcategory</TableHead>
                      <TableHead>Custom Fields</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.subcategories.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.name}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {sub.fields.map((field, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      </div>

      <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Configure Fields for {selectedCategory?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6">
            <div className="grid gap-4">
              {selectedCategory?.subcategories.map((sub: any) => (
                <Card key={sub.id}>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">{sub.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sub.fields.map((field: string, index: number) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-center">
                        <Input value={field} placeholder="Field name" className="text-sm" />
                        <Select defaultValue="text">
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldTypes.map((type) => (
                              <SelectItem key={type} value={type} className="text-sm">
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-2 sm:hidden">Remove</span>
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button onClick={() => setIsFieldDialogOpen(false)} className="w-full">
              Save Configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
