'use client';

import { useEffect, useRef, useState } from 'react';
import axiosClient from '@/services/axiosClient';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Edit, Trash2, Settings, X, Loader2, CalendarIcon, Search, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

const fieldTypes = ['text', 'number', 'select', 'textarea', 'dropdown', 'checkbox', 'file'];
const defaultFieldObj = {
  label: '',
  type: 'text',
  required: false,
  active: true,
  options: [] as string[],
};

const staticCreatedBy = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: "Admin",
};

// Get default date range: previous month start to current month end
const getDefaultDateRange = (): DateRange => {
  const now = new Date();
  const previousMonth = subMonths(now, 1);
  return {
    from: startOfMonth(previousMonth),
    to: endOfMonth(now),
  };
};

const CategoryManagement = () => {
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
  const [isDeleteSubDialogOpen, setIsDeleteSubDialogOpen] = useState(false);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Search and Date Range states - Initialize with previous month start to current month end
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getDefaultDateRange());

  // Category state
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Subcategory state
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [subCategoryName, setSubCategoryName] = useState('');
  const [subCategoryDesc, setSubCategoryDesc] = useState('');
  const [subCategoryImage, setSubCategoryImage] = useState<File | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<any>(null);
  const [existingSubImageUrl, setExistingSubImageUrl] = useState('');
  const [deletingSubcategoryId, setDeletingSubcategoryId] = useState<string | null>(null);
  const subFileInputRef = useRef<HTMLInputElement | null>(null);

  const [subFields, setSubFields] = useState<typeof defaultFieldObj[]>([]);

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    const UPLOAD_API = 'admin/upload/images';
    const res = await axiosClient.post(UPLOAD_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.data;
  }

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject('Failed to convert file to base64 string');
      };
      reader.onerror = (error) => reject(error);
    });

  const clearImageInput = () => {
    setCategoryImage(null);
    setExistingImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearSubImageInput = () => {
    setSubCategoryImage(null);
    setExistingSubImageUrl('');
    if (subFileInputRef.current) subFileInputRef.current.value = '';
  };

  const resetCategoryForm = () => {
    setCategoryName('');
    setCategoryDesc('');
    clearImageInput();
    setEditingCategory(null);
  };

  const resetSubcategoryForm = () => {
    setSubCategoryName('');
    setSubCategoryDesc('');
    clearSubImageInput();
    setSubFields([]);
    setSelectedCategory(null);
    setEditingSubcategory(null);
  };

  // Category delete handlers
  const openCategoryDeleteDialog = (categoryId: string) => {
    setDeletingCategoryId(categoryId);
    setIsDeleteCategoryDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategoryId) return;
    setIsCreating(true);
    try {
      await axiosClient.delete('category/', { params: { id: deletingCategoryId } });
      toast({
        title: 'Category Deleted',
        description: 'Category deleted successfully.',
        duration: 3000
      });
      setIsDeleteCategoryDialogOpen(false);
      setDeletingCategoryId(null);
      fetchCategories();
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete category.',
        variant: 'destructive',
        duration: 3000
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Subcategory delete handlers
  const openSubcategoryDeleteDialog = (subcategoryId: string) => {
    setDeletingSubcategoryId(subcategoryId);
    setIsDeleteSubDialogOpen(true);
  };

  const handleDeleteSubcategory = async () => {
    if (!deletingSubcategoryId) return;
    setIsCreating(true);
    try {
      await axiosClient.delete('subcategory/', { params: { id: deletingSubcategoryId } });
      toast({
        title: 'Subcategory Deleted',
        description: 'Subcategory deleted successfully.',
        duration: 3000
      });
      setIsDeleteSubDialogOpen(false);
      setDeletingSubcategoryId(null);
      fetchCategories();
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete subcategory.',
        variant: 'destructive',
        duration: 3000
      });
    } finally {
      setIsCreating(false);
    }
  };

  // FIXED: Single useEffect for initial fetch and filtered fetch
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchWithDelay = () => {
      setIsLoading(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fetchCategories();
      }, 300); // 300ms debounce for search/filter changes
    };

    // Initial fetch (no debounce needed)
    if (!searchText && dateRange?.from && dateRange?.to) {
      fetchCategories();
    } else if (searchText || (dateRange?.from !== getDefaultDateRange().from || dateRange?.to !== getDefaultDateRange().to)) {
      // Debounced fetch for search or date range changes
      fetchWithDelay();
    }

    return () => clearTimeout(timeoutId);
  }, [searchText, dateRange]);

  // REMOVED: The separate initial fetch useEffect that was causing double calls

  useEffect(() => {
    if (isSubcategoryDialogOpen && !editingSubcategory) setSubFields([]);
  }, [isSubcategoryDialogOpen, editingSubcategory]);

  async function fetchCategories() {
    setIsLoading(true);
    try {
      const params: any = {};
      
      if (searchText.trim()) {
        params.search = searchText.trim();
      }
      
      if (dateRange?.from) {
        params.startDate = format(dateRange.from, 'dd-MM-yyyy');
      }
      
      if (dateRange?.to) {
        params.endDate = format(dateRange.to, 'dd-MM-yyyy');
      }

      const res = await axiosClient.put('category/list', {}, { params });
      const categoryList = Array.isArray(res.data?.data) ? res.data.data : [];
      setCategories(categoryList);
    } catch {
      toast({
        title: 'Failed to load categories',
        description: 'An error occurred while fetching category data.',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreateCategory = async () => {
    if (!categoryName.trim() || !categoryDesc.trim()) {
      toast({
        title: 'Missing Details',
        description: 'Please enter category name and description.',
        variant: 'destructive',
        duration: 3000
      });
      return;
    }

    setIsCreating(true);
    let imageUrl = existingImageUrl; // Use existing image URL if no new image is uploaded

    if (categoryImage) {
      try {
        imageUrl = await uploadImage(categoryImage);
      } catch {
        toast({
          title: 'Image Upload Error',
          description: 'Failed to upload.',
          variant: 'destructive',
          duration: 3000
        });
        setIsCreating(false);
        return;
      }
    }

    const requestBody = {
      title: categoryName,
      description: categoryDesc,
      image: imageUrl,
      active: true,
      featured: true,
      createdBy: staticCreatedBy,
      ...(editingCategory && { id: editingCategory.id }) // Include ID for updates
    };

    try {
      await axiosClient.post('category/', requestBody);
      toast({
        title: editingCategory ? 'Category Updated' : 'Category Created',
        description: editingCategory
          ? 'Category successfully updated.'
          : 'New category successfully created.',
        duration: 3000
      });
      setIsDialogOpen(false);
      resetCategoryForm();
      fetchCategories();
    } catch {
      toast({
        title: `Failed to ${editingCategory ? 'update' : 'create'} category`,
        description: 'Please try again later.',
        variant: 'destructive',
        duration: 3000
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryName(category.title || category.name || '');
    setCategoryDesc(category.description || '');
    setExistingImageUrl(category.image || '');
    setCategoryImage(null); // Clear any new image selection
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsDialogOpen(true);
  };

  const handleCreateSubcategory = async () => {
    if (!subCategoryName.trim() || !subCategoryDesc.trim()) {
      toast({
        title: 'Missing Details',
        description: 'Please enter subcategory name and description.',
        variant: 'destructive',
        duration: 3000
      });
      return;
    }
    if (!selectedCategory) {
      toast({
        title: 'No Category Selected',
        description: 'Cannot add subcategory without a parent category.',
        variant: 'destructive',
        duration: 3000
      });
      return;
    }
    setIsCreating(true);
    let imageUrl = existingSubImageUrl; // Use existing image URL if no new image is uploaded

    if (subCategoryImage) {
      try {
        imageUrl = await uploadImage(subCategoryImage);
      } catch {
        toast({
          title: 'Image Upload Error',
          description: 'Failed to upload image.',
          variant: 'destructive',
          duration: 3000
        });
        setIsCreating(false);
        return;
      }
    }
    // Clean fields before submit
    const cleanFields = subFields.map((field, idx) => ({
      label: field.label.trim(),
      type: field.type,
      required: field.required,
      active: true,
      options: (['select', 'checkbox', 'dropdown'].includes(field.type))
        ? (field.options?.filter(opt => opt.trim() !== '') || [])
        : [],
      sortOrder: idx + 1,
    }));

    const requestBody = {
      title: subCategoryName,
      image: imageUrl,
      description: subCategoryDesc,
      active: true,
      featured: true,
      createdBy: staticCreatedBy,
      category: {
        id: selectedCategory.id,
        name: selectedCategory.title || selectedCategory.name,
      },
      fieldList: cleanFields,
      ...(editingSubcategory && { id: editingSubcategory.id }) // Include ID for updates
    };

    try {
      await axiosClient.post('subcategory/', requestBody);
      toast({
        title: editingSubcategory ? 'Subcategory Updated' : 'Subcategory Created',
        description: editingSubcategory
          ? 'Subcategory successfully updated.'
          : `New subcategory added to ${selectedCategory.title || selectedCategory.name}.`,
        duration: 3000,
      });
      setIsSubcategoryDialogOpen(false);
      resetSubcategoryForm();
      fetchCategories();
    } catch {
      toast({
        title: `Failed to ${editingSubcategory ? 'update' : 'create'} subcategory`,
        description: 'Please try again later.',
        variant: 'destructive',
        duration: 3000
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddSubcategory = (category: any) => {
    setSelectedCategory(category);
    setEditingSubcategory(null); // Ensure we're in create mode
    setIsSubcategoryDialogOpen(true);
  };

  const handleEditSubcategory = (subcategory: any, parentCategory: any) => {
    setEditingSubcategory(subcategory);
    setSelectedCategory(parentCategory);
    setSubCategoryName(subcategory.title || '');
    setSubCategoryDesc(subcategory.description || '');
    setExistingSubImageUrl(subcategory.image || '');
    setSubFields(subcategory.fieldList || []);
    setSubCategoryImage(null); // Clear any new image selection
    if (subFileInputRef.current) subFileInputRef.current.value = '';
    setIsSubcategoryDialogOpen(true);
  };

  const handleConfigureFields = (category: any) => {
    setSelectedCategory(category);
    setIsFieldDialogOpen(true);
  };

  const handleFieldChange = (index: number, field: typeof defaultFieldObj) => {
    setSubFields(fields => fields.map((f, i) => (i === index ? field : f)));
  };

  const handleAddField = () => setSubFields(fields => [...fields, { ...defaultFieldObj }]);
  const handleDeleteField = (index: number) => setSubFields(fields => fields.filter((_, i) => i !== index));

  const handleAddOption = (fieldIndex: number) => {
    const newFields = [...subFields];
    const options = newFields[fieldIndex].options || [];
    const hasEmptyOption = options.some(opt => opt.trim() === '');
    if (hasEmptyOption) return;
    options.push('');
    newFields[fieldIndex] = { ...newFields[fieldIndex], options };
    setSubFields(newFields);
  };

  const handleOptionChange = (fieldIndex: number, optionIndex: number, value: string) => {
    const newFields = [...subFields];
    if (!newFields[fieldIndex].options) newFields[fieldIndex].options = [];
    newFields[fieldIndex].options[optionIndex] = value;
    setSubFields(newFields);
  };

  const handleDeleteOption = (fieldIndex: number, optionIndex: number) => {
    const newFields = [...subFields];
    newFields[fieldIndex].options = newFields[fieldIndex].options.filter((_, i) => i !== optionIndex);
    setSubFields(newFields);
  };

  const handleResetFilters = () => {
    setSearchText('');
    setDateRange(getDefaultDateRange());
  };

  return (
    <div className="h-screen p-4 overflow-hidden">
      {/* HEADER */}
      <div className="h-[120px] flex flex-col justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Category & Field Management</h2>
          {/* <p className="text-muted-foreground">Manage categories and their custom fields</p> */}
        </div>
        
        {/* Search and Filter Row */}
        <div className="flex items-center gap-4 justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Date Range Picker */}
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd-MM-yyyy")} -{" "}
                          {format(dateRange.to, "dd-MM-yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd-MM-yyyy")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              {/* Reset Filters Button with Reload Icon */}
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="px-3"
                title="Reset filters to default range"
              >
                <RotateCcw className="h-4 w-4" />
              </Button> */}
            </div>
          </div>

          {/* Add Category Button */}
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if (!open) {
              resetCategoryForm();
            }
            setIsDialogOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-white text-primary border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    disabled={isCreating}
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <Label htmlFor="categoryDesc">Description</Label>
                  <Input
                    id="categoryDesc"
                    placeholder="Category description"
                    value={categoryDesc}
                    onChange={(e) => setCategoryDesc(e.target.value)}
                    disabled={isCreating}
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <Label htmlFor="categoryIcon">Category Image</Label>
                  <Input
                    id="categoryIcon"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCategoryImage(file);
                        setExistingImageUrl(''); // Clear existing image URL when new file is selected
                      }
                    }}
                    disabled={isCreating}
                  />
                  {/* Show existing image or new image preview */}
                  {(categoryImage || existingImageUrl) && (
                    <div className="relative inline-block mt-2">
                      <img
                        src={categoryImage ? URL.createObjectURL(categoryImage) : existingImageUrl}
                        alt="Preview"
                        className="h-24 w-24 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={clearImageInput}
                        className="absolute top-0 left-[5rem] -mt-1 -mr-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                        aria-label="Clear image"
                        disabled={isCreating}
                      >
                        <X className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleCreateCategory}
                  className="w-full flex justify-center items-center"
                  disabled={!categoryName.trim() || !categoryDesc.trim() || isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingCategory ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingCategory ? 'Update Category' : 'Create Category'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* CATEGORY LIST */}
      <div className="h-[calc(100vh-170px)] overflow-y-auto pr-2 space-y-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx} className="p-4 space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </Card>
          ))
        ) : categories.length === 0 ? (
          <div className="text-center text-muted-foreground mt-10">
            {searchText ? 'No categories found matching your search.' : 'No categories found for the selected date range.'}
          </div>
        ) : (
          <div className="grid gap-6">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      {category.title || category.name}
                      <Badge variant="secondary">{category.subCategoriesList?.length || 0} subcategories</Badge>
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddSubcategory(category)}
                        className="bg-white text-primary border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />Add Subcategory
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openCategoryDeleteDialog(category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subcategory</TableHead>
                        <TableHead>Custom Fields</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.subCategoriesList?.length ? (
                        category.subCategoriesList.map((sub: any) => (
                          <TableRow key={sub.id}>
                            <TableCell className="font-medium">{sub.title}</TableCell>
                            <TableCell>
                              <div className="flex gap-1 flex-wrap">
                                {sub.fieldList?.map((field: any, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs">{field.label}</Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditSubcategory(sub, category)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openSubcategoryDeleteDialog(sub.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">No subcategories found.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* DELETE CATEGORY CONFIRMATION DIALOG */}
      <Dialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">Are you sure you want to delete this category? This will also delete all associated subcategories. This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteCategoryDialogOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE SUBCATEGORY CONFIRMATION DIALOG */}
      <Dialog open={isDeleteSubDialogOpen} onOpenChange={setIsDeleteSubDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete Subcategory</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">Are you sure you want to delete this subcategory? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteSubDialogOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubcategory}
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* FIELD DIALOG (readonly) */}
      <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure Fields for {selectedCategory?.title || selectedCategory?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid gap-4">
              {selectedCategory?.subcategories?.map((sub: any) => (
                <Card key={sub.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{sub.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sub.fieldList?.map((field: any, index: number) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div className="md:col-span-3">
                          <Input value={field.label} disabled />
                        </div>
                        <div className="md:col-span-3">
                          <Select value={field.type} disabled>
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldTypes.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button onClick={() => setIsFieldDialogOpen(false)} className="w-full">Save Configuration</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* SUBCATEGORY DIALOG with fixed header/footer and scrollable content */}
      <Dialog open={isSubcategoryDialogOpen} onOpenChange={(open) => {
        if (!open) {
          resetSubcategoryForm();
        }
        setIsSubcategoryDialogOpen(open);
      }}>
        <DialogContent
          className="w-full max-w-3xl max-h-[600px] p-0 flex flex-col"
        >
          {/* Fixed header with close button */}
          <div className="flex-shrink-0 border-b px-6 py-4 bg-background sticky top-0 z-10 flex items-center justify-between">
            <DialogTitle>
              {editingSubcategory
                ? `Edit Subcategory - ${editingSubcategory.title}`
                : `Add Subcategory to ${selectedCategory?.title || selectedCategory?.name}`
              }
            </DialogTitle>
            <button
              type="button"
              onClick={() => setIsSubcategoryDialogOpen(false)}
              className="ml-4 rounded-full p-2 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
          </div>
          {/* Scrollable main content */}
          <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6">
            {/* Subcategory Name */}
            <div className="flex flex-col space-y-3">
              <Label htmlFor="subCategoryName">Subcategory Name</Label>
              <Input
                id="subCategoryName"
                placeholder="Enter subcategory name"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                disabled={isCreating}
              />
            </div>
            {/* Subcategory Description */}
            <div className="flex flex-col space-y-3">
              <Label htmlFor="subCategoryDesc">Description</Label>
              <Input
                id="subCategoryDesc"
                placeholder="Subcategory description"
                value={subCategoryDesc}
                onChange={(e) => setSubCategoryDesc(e.target.value)}
                disabled={isCreating}
              />
            </div>
            {/* Subcategory Image */}
            <div className="flex flex-col space-y-3">
              <Label htmlFor="subCategoryImage">Subcategory Image</Label>
              <Input
                id="subCategoryImage"
                type="file"
                accept="image/*"
                ref={subFileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSubCategoryImage(file);
                    setExistingSubImageUrl(''); // Clear existing image URL when new file is selected
                  }
                }}
                disabled={isCreating}
              />
              {/* Show existing image or new image preview */}
              {(subCategoryImage || existingSubImageUrl) && (
                <div className="relative inline-block mt-2">
                  <img
                    src={subCategoryImage ? URL.createObjectURL(subCategoryImage) : existingSubImageUrl}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={clearSubImageInput}
                    className="absolute top-0 left-[5rem] -mt-1 -mr-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    aria-label="Clear image"
                    disabled={isCreating}
                  >
                    <X className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
              )}
            </div>
            {/* Fields editor */}
            <div className="border rounded-lg p-4 bg-muted">
              <h3 className="text-base font-semibold mb-3">Custom Fields</h3>
              <div className="space-y-6">
                {subFields.map((field, idx) => (
                  <div key={idx} className="space-y-2">
                    {/* Field Row */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                      {/* Label */}
                      <div className="md:col-span-4">
                        <Input
                          placeholder="Field label"
                          value={field.label}
                          onChange={(e) => handleFieldChange(idx, { ...field, label: e.target.value })}
                          disabled={isCreating}
                          required
                          autoFocus={idx === subFields.length - 1}
                        />
                      </div>
                      {/* Type */}
                      <div className="md:col-span-3">
                        <Select
                          value={field.type}
                          onValueChange={(v) => {
                            const newField = { ...field, type: v };
                            if (['select', 'checkbox', 'dropdown'].includes(v)) {
                              if (!newField.options || !Array.isArray(newField.options)) newField.options = [''];
                            } else {
                              newField.options = [];
                            }
                            handleFieldChange(idx, newField);
                          }}
                          disabled={isCreating}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Required checkbox */}
                      <div className="md:col-span-2 flex items-center justify-center">
                        <Label className="flex gap-1 items-center cursor-pointer select-none">
                          <Input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => handleFieldChange(idx, { ...field, required: e.target.checked })}
                            disabled={isCreating}
                            className="h-4 w-4"
                          />
                          <span className="text-xs">Required</span>
                        </Label>
                      </div>
                      {/* Delete button */}
                      <div className="md:col-span-2 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => handleDeleteField(idx)}
                          disabled={isCreating}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {/* Options block below, indented */}
                    {(['select', 'checkbox', 'dropdown'].includes(field.type)) && (
                      <div className="pl-4 border-l-4 border-secondary bg-background py-2">
                        <div className="space-y-2">
                          {field.options && field.options.map((option, optionIdx) => (
                            <div key={optionIdx} className="flex gap-2 items-center">
                              <Input
                                placeholder={`Option ${optionIdx + 1}`}
                                value={option}
                                onChange={(e) => handleOptionChange(idx, optionIdx, e.target.value)}
                                disabled={isCreating}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={() => handleDeleteOption(idx, optionIdx)}
                                disabled={isCreating}
                                aria-label="Delete option"
                              >
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => handleAddOption(idx)}
                            disabled={isCreating}
                            className="mt-1"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Option
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={handleAddField}
                className="w-full mt-3"
                disabled={isCreating}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
          </div>

          {/* Fixed Footer with button */}
          <div className="flex-shrink-0 border-t p-4 bg-background bottom-0 z-10">
            <Button
              onClick={handleCreateSubcategory}
              className="w-full flex justify-center items-center"
              disabled={!subCategoryName.trim() || !subCategoryDesc.trim() || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingSubcategory ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingSubcategory ? 'Update Subcategory' : 'Create Subcategory'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
