import { useEffect, useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, MapPin, AlertTriangle, Search, Building2, ChevronDown, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/services/axiosClient';


// Skeleton Components
const SkeletonCard = () => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-64 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-16 h-5 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="flex gap-2">
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center p-3 bg-muted/50 rounded">
            <div className="w-12 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="flex gap-4 py-2 border-b">
          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex-1"></div>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 py-2">
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex-1"></div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);


const LocationManagement = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCityObj, setSelectedCityObj] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);


  // Search and filter state
  const [searchText, setSearchText] = useState('');
  const [filterState, setFilterState] = useState<any>(null);
  const [showFilterStateDropdown, setShowFilterStateDropdown] = useState(false);
  const [allStates, setAllStates] = useState<any[]>([]);


  // Loading states - CHANGED: Initialize isLoadingCities as true
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isLoadingStates, setIsLoadingStates] = useState(false);


  // Edit city state
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [cityBeingEdited, setCityBeingEdited] = useState<any>(null);


  // Add/Edit Area dialog state
  const [isAddAreaDialogOpen, setIsAddAreaDialogOpen] = useState(false);
  const [newArea, setNewArea] = useState({ name: '', latitude: '', longitude: '' });
  const [activeCityForArea, setActiveCityForArea] = useState<any>(null);


  // Edit area state
  const [isEditingArea, setIsEditingArea] = useState(false);
  const [editingAreaIndex, setEditingAreaIndex] = useState<number | null>(null);


  // Area Delete Warning Dialog state
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<{
    city: any,
    area: any,
    areaIndex: number
  } | null>(null);


  // City Delete Warning Dialog state
  const [cityWarningDialogOpen, setCityWarningDialogOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<any | null>(null);


  // Initial data fetch
  useEffect(() => {
    const init = async () => {
      setIsLoadingCities(true); // Ensure loading state is set
      await Promise.all([
        fetchCountries(),
        fetchAllStates(),
        fetchCities() // This will set isLoadingCities to false when done
      ]);
    };
    init();
  }, []);


  // MODIFIED: Effect for search and filter - skip initial render
  useEffect(() => {
    // Skip the initial render when both are empty/null
    if (searchText === '' && filterState === null) {
      return;
    }
    
    const delayDebounceFn = setTimeout(() => {
      fetchCities();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText, filterState]);


  const fetchCountries = async () => {
    try {
      const requestBody = { searchText: '', page: 0, size: 1000, };
      const response = await axiosClient.put('location/country', requestBody);
      const data = response.data?.data || {};
      setCountries(data.data || []);
    } catch (error) {
      toast({
        title: 'Failed to fetch countries',
        description: 'Please try again later.',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };


  const fetchAllStates = async () => {
    setIsLoadingStates(true);
    try {
      const requestBody = {
        countryIds: [], // Empty to get all states
        searchText: '', 
        page: 1, 
        size: 1000,
      };
      const response = await axiosClient.put('location/state', requestBody);
      const data = response.data?.data || {};
      setAllStates(data.data || []);
    } catch (error) {
      toast({
        title: 'Failed to fetch states',
        description: 'Please try again later.',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsLoadingStates(false);
    }
  };


  const fetchStates = async (countryId: string) => {
    try {
      const requestBody = {
        countryIds: [countryId], 
        searchText: '', 
        page: 1, 
        size: 1000,
      };
      const response = await axiosClient.put('location/state', requestBody);
      const data = response.data?.data || {};
      setStates(data.data || []);
    } catch (error) {
      toast({
        title: 'Failed to fetch states',
        description: 'Please try again later.',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };


  const fetchCities = async () => {
    setIsLoadingCities(true);
    try {
      const requestBody = { 
        searchText: searchText, 
        page: 1, 
        size: 10000,
        ...(filterState ? { stateIds: [filterState.id] } : {})
      };
      const response = await axiosClient.put('location/district', requestBody);
      const data = response.data?.data || {};
      setCities(
        (data.data || []).map((city) => ({
          ...city,
          areaList: city.areaList || [],
        }))
      );
    } catch (error) {
      toast({
        title: 'Failed to fetch cities',
        description: 'Please try again later.',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsLoadingCities(false);
    }
  };


  // Add/Edit City handler
  const handleCreateOrUpdateCity = async () => {
    if (!selectedCountry || !selectedState || !selectedCityObj?.name) {
      toast({
        title: 'Missing Details',
        description: 'Please select country, state and enter city name.',
        variant: 'destructive',
      });
      return;
    }
    
    const requestBody = {
      ...(
        isEditingCity && cityBeingEdited
          ? { id: cityBeingEdited.id } // pass id for update
          : {}
      ),
      name: selectedCityObj.name,
      state: { id: selectedState.id, name: selectedState.name },
      country: { id: selectedCountry.id, name: selectedCountry.name },
      areaList: isEditingCity && cityBeingEdited ? cityBeingEdited.areaList : [],
      createdBy: null,
      active: true
    };
    
    try {
      await axiosClient.post('location/district', requestBody);
      toast({
        title: isEditingCity ? 'City Updated' : 'City Added',
        description: isEditingCity 
          ? 'City has been updated successfully.' 
          : 'New city has been successfully added to the platform.',
        duration: 3000,
      });
      
      await fetchCities();
      
      // Reset form
      setIsDialogOpen(false);
      setSelectedCityObj(null);
      setIsEditingCity(false);
      setCityBeingEdited(null);
      setSelectedCountry(null);
      setSelectedState(null);
      setStates([]);
    } catch (error) {
      toast({
        title: isEditingCity ? 'Failed to update city' : 'Failed to add city',
        description: 'Please try again later.',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };


  // Open City Warning Dialog
  const handleOpenCityWarningDialog = (city: any) => {
    setCityToDelete(city);
    setCityWarningDialogOpen(true);
  };


  // Confirm City Delete
  const handleConfirmDeleteCity = () => {
    if (!cityToDelete) return;
    toast({
      title: 'City Removed',
      description: 'City and all its areas have been removed from the platform.',
      variant: 'destructive',
      duration: 3000,
    });
    setCityWarningDialogOpen(false);
    setCityToDelete(null);
  };


  const handleEditCityButton = async (city: any) => {
    setIsEditingCity(true);
    setCityBeingEdited(city);

    setSelectedCountry(city.country || null);
    if (city.country?.id) {
      await fetchStates(city.country.id);
    }
    setSelectedState(city.state || null);
    setSelectedCityObj({ name: city.name });
    setIsDialogOpen(true);
  };


  // Add Area
  const handleAddArea = (city: any) => {
    setActiveCityForArea(city);
    setIsEditingArea(false);
    setEditingAreaIndex(null);
    setNewArea({ name: '', latitude: '', longitude: '' });
    setIsAddAreaDialogOpen(true);
  };


  // Edit Area
  const handleEditArea = (city: any, area: any, areaIndex: number) => {
    setActiveCityForArea(city);
    setIsEditingArea(true);
    setEditingAreaIndex(areaIndex);
    setNewArea({
      name: area.name || '',
      latitude: area.latitude?.toString() || '',
      longitude: area.longitude?.toString() || ''
    });
    setIsAddAreaDialogOpen(true);
  };


  // Add or Update Area in City
  const handleAddOrUpdateAreaToCity = async () => {
    if (!newArea.name || !newArea.latitude || !newArea.longitude) {
      toast({ title: 'All fields are required', variant: 'destructive' });
      return;
    }
    
    const areaObject = {
      ...activeCityForArea.areaList?.[editingAreaIndex ?? -1],
      name: newArea.name,
      latitude: parseFloat(newArea.latitude as any),
      longitude: parseFloat(newArea.longitude as any)
    };
    
    let updatedAreas;
    if (isEditingArea && editingAreaIndex !== null && editingAreaIndex >= 0) {
      updatedAreas = [...activeCityForArea.areaList];
      updatedAreas[editingAreaIndex] = areaObject;
    } else {
      updatedAreas = [
        ...(activeCityForArea.areaList || []),
        areaObject
      ];
    }
    
    const updatedCity = { ...activeCityForArea, areaList: updatedAreas };
    
    try {
      await axiosClient.post('location/district', updatedCity);
      toast({
        title: isEditingArea ? 'Area Updated' : 'Area Added',
        description: isEditingArea
          ? 'Area updated successfully.'
          : 'Area added successfully.'
      });
      
      setIsAddAreaDialogOpen(false);
      setActiveCityForArea(null);
      setIsEditingArea(false);
      setEditingAreaIndex(null);
      
      await fetchCities();
    } catch (err) {
      toast({
        title: isEditingArea ? 'Failed to update area' : 'Failed to add area',
        variant: 'destructive'
      });
    }
  };


  // Open Warning Dialog for Area Delete
  const handleOpenWarningDialog = (city: any, area: any, areaIndex: number) => {
    setAreaToDelete({ city, area, areaIndex });
    setWarningDialogOpen(true);
  };


  // Confirm Area Delete
  const handleConfirmDeleteArea = async () => {
    if (!areaToDelete) return;
    
    const { city, areaIndex } = areaToDelete;
    const updatedAreas = [...(city.areaList || [])];
    updatedAreas.splice(areaIndex, 1);
    const updatedCity = { ...city, areaList: updatedAreas };
    
    try {
      await axiosClient.post('location/district', updatedCity);
      toast({
        title: 'Area Deleted',
        description: 'Area removed successfully from the city.'
      });
      
      setWarningDialogOpen(false);
      setAreaToDelete(null);
      
      await fetchCities();
    } catch (err) {
      toast({
        title: 'Failed to delete area',
        description: 'Please try again later.',
        variant: 'destructive'
      });
      setWarningDialogOpen(false);
      setAreaToDelete(null);
    }
  };


  const handleFilterStateSelect = (state: any) => {
    setIsLoadingCities(true);
    setFilterState(state);
    setShowFilterStateDropdown(false);
  };


  const handleClearFilterState = () => {
    setFilterState(null);
  };


  // DUMMY locations for summary cards
  const locations = [
    {
      id: 1, city: 'New York', state: 'NY', country: 'USA',
      areas: [
        { id: 101, name: 'Manhattan', activeListings: 45 },
        { id: 102, name: 'Brooklyn', activeListings: 32 },
        { id: 103, name: 'Queens', activeListings: 28 },
        { id: 104, name: 'Bronx', activeListings: 15 }
      ],
      totalListings: 120, activeVendors: 25
    },
    {
      id: 2, city: 'Los Angeles', state: 'CA', country: 'USA',
      areas: [
        { id: 201, name: 'Downtown', activeListings: 38 },
        { id: 202, name: 'Hollywood', activeListings: 42 },
        { id: 203, name: 'Beverly Hills', activeListings: 24 },
        { id: 204, name: 'Santa Monica', activeListings: 31 }
      ],
      totalListings: 135, activeVendors: 28
    },
    {
      id: 3, city: 'Chicago', state: 'IL', country: 'USA',
      areas: [
        { id: 301, name: 'Loop', activeListings: 22 },
        { id: 302, name: 'Lincoln Park', activeListings: 18 },
        { id: 303, name: 'Wicker Park', activeListings: 14 }
      ],
      totalListings: 54, activeVendors: 12
    }
  ];


  return (
    <div className="h-screen overflow-hidden">
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center py-4 px-2 md:px-4">
          <h2 className="text-2xl font-bold">Location Management</h2>
          
          {/* Search Bar, State Filter and Add Button Container */}
          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cities..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* State Filter Dropdown */}
            <div className="relative w-full md:w-48">
              <button
                type="button"
                onClick={() => setShowFilterStateDropdown(!showFilterStateDropdown)}
                className="w-full p-2 border rounded flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-sm"
                disabled={isLoadingStates}
              >
                <span className="flex items-center gap-2 truncate">
                  {filterState ? (
                    <>
                      {filterState.name}
                    </>
                  ) : (
                    'All States'
                  )}
                </span>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </button>
              {showFilterStateDropdown && (
                <ul className="absolute z-20 w-full bg-white border mt-1 rounded shadow-lg max-h-60 overflow-y-auto">
                  <li
                    onClick={() => handleFilterStateSelect('')}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b"
                  >
                    All States
                  </li>
                  {allStates.map((state: any) => (
                    <li
                      key={state.id}
                      onClick={() => handleFilterStateSelect(state)}
                      className="px-4 py-2 hover:bg-gray-100 flex justify-between cursor-pointer text-sm"
                    >
                      <span className="truncate">{state.name}</span>
                      {filterState?.id === state.id && (
                        <svg className="h-4 w-4 text-primary flex-shrink-0" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Add City Button */}
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (open) {
                  if (!isEditingCity) {
                    setSelectedCountry(null);
                    setSelectedState(null);
                    setSelectedCityObj(null);
                    setStates([]);
                  }
                } else {
                  setIsEditingCity(false);
                  setCityBeingEdited(null);
                  setSelectedCountry(null);
                  setSelectedState(null);
                  setSelectedCityObj(null);
                  setStates([]);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white text-primary border-primary hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
                  onClick={() => {
                    setIsEditingCity(false);
                    setCityBeingEdited(null);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add City
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isEditingCity ? 'Edit City' : 'Add New City'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-5">
                  {/* Country Dropdown */}
                  <div className="relative">
                    <Label className="mb-1 block">Country</Label>
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="w-full p-2 border rounded flex items-center justify-between mt-2"
                    >
                      <span className="flex items-center gap-2">
                        {selectedCountry?.name || 'Select Country'}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {showCountryDropdown && (
                      <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow-md max-h-60 overflow-y-auto">
                        {countries.map((country: any) => (
                          <li
                            key={country.id}
                            onClick={async () => {
                              setSelectedCountry(country);
                              setSelectedState(null);
                              setSelectedCityObj(null);
                              await fetchStates(country.id);
                              setShowCountryDropdown(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 flex justify-between cursor-pointer"
                          >
                            <span>{country.name}</span>
                            {selectedCountry?.id === country.id && (
                              <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  {/* State Dropdown */}
                  <div className="relative">
                    <Label className="mb-1 block">State</Label>
                    <button
                      type="button"
                      onClick={() => setShowStateDropdown(!showStateDropdown)}
                      className="w-full p-2 border rounded flex items-center justify-between mt-2"
                      disabled={!selectedCountry}
                    >
                      <span className="flex items-center gap-2">
                        {selectedState?.name || 'Select State'}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {showStateDropdown && (
                      <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow-md max-h-60 overflow-y-auto">
                        {states.map((state: any) => (
                          <li
                            key={state.id}
                            onClick={() => {
                              setSelectedState(state);
                              setSelectedCityObj(null);
                              setShowStateDropdown(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 flex justify-between cursor-pointer"
                          >
                            <span>{state.name}</span>
                            {selectedState?.id === state.id && (
                              <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  {/* City Input Field */}
                  <div>
                    <Label className="mb-1 block">City</Label>
                    <Input
                      type="text"
                      placeholder="Enter City Name"
                      value={selectedCityObj?.name || ''}
                      onChange={(e) => {
                        const name = e.target.value;
                        setSelectedCityObj(name ? { name } : null);
                      }}
                      className="mt-2"
                      disabled={!selectedState}
                    />
                  </div>
                  
                  <Button
                    onClick={handleCreateOrUpdateCity}
                    className="w-full mt-4"
                    disabled={!selectedCityObj}
                  >
                    {isEditingCity ? 'Update City' : 'Add City'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-2 md:px-4 pb-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{locations.length}</div>
              <p className="text-sm text-muted-foreground">Active Cities</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {locations.reduce((t, c) => t + c.areas.length, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Areas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {locations.reduce((t, c) => t + c.totalListings, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {locations.reduce((t, c) => t + c.activeVendors, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Active Vendors</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Location Cards or Empty State or Loading */}
      <div className="overflow-y-auto h-[calc(100vh-170px)] px-2 md:px-4 pt-4 pb-10">
        {isLoadingCities ? (
          // Loading Skeleton
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : cities.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              {searchText || filterState ? 'No cities found' : 'No cities available'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchText || filterState
                ? `No cities match your current filters. Try adjusting your search terms or filters.`
                : 'Get started by adding your first city to the platform.'
              }
            </p>
            {!searchText && !filterState && (
              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (open) {
                    setSelectedCountry(null);
                    setSelectedState(null);
                    setSelectedCityObj(null);
                    setStates([]);
                  } else {
                    setIsEditingCity(false);
                    setCityBeingEdited(null);
                    setSelectedCountry(null);
                    setSelectedState(null);
                    setSelectedCityObj(null);
                    setStates([]);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => {
                      setIsEditingCity(false);
                      setCityBeingEdited(null);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Your First City
                  </Button>
                </DialogTrigger>
              </Dialog>
            )}
          </div>
        ) : (
          // Cities List
          <div className="grid gap-6">
            {cities.map((location) => (
              <Card key={location.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" /> {location.name}, {location.state.name}, {location.country.name}
                      <Badge variant="secondary">{location.areaList?.length || 0} areas</Badge>
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white text-primary border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleAddArea(location)}
                      >
                        Add Area
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCityButton(location)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenCityWarningDialog(location)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <div className="text-2xl font-bold text-blue-600">{location.totalListings || 0}</div>
                      <div className="text-sm text-muted-foreground">Total Listings</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <div className="text-2xl font-bold text-green-600">{location.activeVendors || 0}</div>
                      <div className="text-sm text-muted-foreground">Active Vendors</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <div className="text-2xl font-bold text-purple-600">
                        {location.areaList?.reduce((t, a) => t + (a.activeListings || 0), 0) || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Listings</div>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Area Name</TableHead>
                        <TableHead>Active Listings</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {location.areaList.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8">
                            <p>No areas found for this city.</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        location.areaList.map((area, idx) => (
                          <TableRow key={area.id || idx}>
                            <TableCell className="font-medium">{area.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{area.activeListings || 0} listings</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditArea(location, area, idx)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenWarningDialog(location, area, idx)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Area Dialog */}
      <Dialog open={isAddAreaDialogOpen} onOpenChange={setIsAddAreaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditingArea
                ? `Edit Area in ${activeCityForArea?.name}`
                : `Add Area to ${activeCityForArea?.name}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Area Name"
              value={newArea.name}
              onChange={e => setNewArea({ ...newArea, name: e.target.value })}
            />
            <Input
              placeholder="Latitude"
              type="number"
              value={newArea.latitude}
              onChange={e => setNewArea({ ...newArea, latitude: e.target.value })}
            />
            <Input
              placeholder="Longitude"
              type="number"
              value={newArea.longitude}
              onChange={e => setNewArea({ ...newArea, longitude: e.target.value })}
            />
            <Button onClick={handleAddOrUpdateAreaToCity}>
              {isEditingArea ? 'Update Area' : 'Add Area'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* WARNING DIALOG for Area Delete */}
      <Dialog open={warningDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setWarningDialogOpen(false);
          setAreaToDelete(null);
        }
      }}>
        <DialogContent>
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <div>
              <DialogTitle>Delete Area?</DialogTitle>
              <div className="mt-2 text-sm text-muted-foreground">
                Are you sure you want to delete
                <b> {areaToDelete?.area?.name} </b>
                from city
                <b> {areaToDelete?.city?.name} </b>?
                <br />
                This action cannot be undone.
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setWarningDialogOpen(false);
                  setAreaToDelete(null);
                }}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDeleteArea}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* WARNING DIALOG for City Delete */}
      <Dialog open={cityWarningDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setCityWarningDialogOpen(false);
          setCityToDelete(null);
        }
      }}>
        <DialogContent>
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <div>
              <DialogTitle>Delete City?</DialogTitle>
              <div className="mt-2 text-sm text-muted-foreground">
                Are you sure you want to delete
                <b> {cityToDelete?.name} </b>?
                <br />
                This action cannot be undone.
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCityWarningDialogOpen(false);
                  setCityToDelete(null);
                }}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDeleteCity}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationManagement;
