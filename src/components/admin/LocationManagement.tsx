// CREATED BY PRASAD 2025

import { useEffect, useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import {
  Plus, Edit, Trash2, MapPin, Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/services/axiosClient';

const LocationManagement = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false);
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

  const locations = [
    {
      id: 1,
      city: 'New York',
      state: 'NY',
      country: 'USA',
      areas: [
        { id: 101, name: 'Manhattan', activeListings: 45 },
        { id: 102, name: 'Brooklyn', activeListings: 32 },
        { id: 103, name: 'Queens', activeListings: 28 },
        { id: 104, name: 'Bronx', activeListings: 15 }
      ],
      totalListings: 120,
      activeVendors: 25
    },
    {
      id: 2,
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      areas: [
        { id: 201, name: 'Downtown', activeListings: 38 },
        { id: 202, name: 'Hollywood', activeListings: 42 },
        { id: 203, name: 'Beverly Hills', activeListings: 24 },
        { id: 204, name: 'Santa Monica', activeListings: 31 }
      ],
      totalListings: 135,
      activeVendors: 28
    },
    {
      id: 3,
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      areas: [
        { id: 301, name: 'Loop', activeListings: 22 },
        { id: 302, name: 'Lincoln Park', activeListings: 18 },
        { id: 303, name: 'Wicker Park', activeListings: 14 }
      ],
      totalListings: 54,
      activeVendors: 12
    }
  ];

  useEffect(() => {
  const fetchCountries = async () => {
    try {
      const requestBody = {
        searchText: '',
        page: 0,
        size: 1000,
      };

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

  fetchCountries();
}, [toast]);




  const fetchStates = async (countryId: string) => {
  try {
    const requestBody = {
      countryIds: [countryId], // wrap in array
      searchText: '',
      page: 1,
      size: 1000
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


  const fetchCities = async (countryId: string, stateId: string) => {
  try {
    const requestBody = {
      countryIds: [countryId],
      stateIds: [stateId],
      searchText: '',
      page: 1,
      size: 1000
    };

    const response = await axiosClient.put('location/district', requestBody);
    const data = response.data?.data || {};

    setCities(data.data || []);
  } catch (error) {
    toast({
      title: 'Failed to fetch cities',
      description: 'Please try again later.',
      variant: 'destructive',
      duration: 3000,
    });
  }
};


  const handleCreateCity = () => {
    toast({
      title: 'City Added',
      description: 'New city has been successfully added to the platform.'
    });
    setIsDialogOpen(false);
  };

  const handleManageAreas = (city: any) => {
    setSelectedCity(city);
    setIsAreaDialogOpen(true);
  };

  const handleDeleteCity = (cityId: number) => {
    toast({
      title: 'City Removed',
      description: 'City and all its areas have been removed from the platform.',
      variant: 'destructive'
    });
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="flex justify-between items-center py-4 px-2 md:px-4">
          <h2 className="text-2xl font-bold">Location Management</h2>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (open) {
                // fetchCountries();
                setSelectedCountry(null);
                setSelectedState(null);
                setSelectedCityObj(null);
                setStates([]);
                setCities([]);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Add City</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New City</DialogTitle>
              </DialogHeader>
              <div className="space-y-5">
                {/* Country Dropdown */}
                <div className="relative">
                  <Label className="mb-1 block">Country</Label>
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="w-full p-2 border rounded flex items-center justify-between mt-2 "
                  >
                    <span className="flex items-center gap-2"> {selectedCountry?.name || 'Select Country'}</span>
                    <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showCountryDropdown && (
                    <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow-md max-h-60 overflow-y-auto">
                      {countries.map((country: any) => (
                        <li
                          key={country.id}
                          onClick={() => {
                            setSelectedCountry(country);
                            setSelectedState(null);
                            setSelectedCityObj(null);
                            fetchStates(country.id);
                            setShowCountryDropdown(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 flex justify-between cursor-pointer"
                        >
                          <span>{country.name}</span>
                          {selectedCountry?.id === country.id && (
                            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
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
                    <span className="flex items-center gap-2"> {selectedState?.name || 'Select State'}</span>
                    <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showStateDropdown && (
                    <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow-md max-h-60 overflow-y-auto">
                      {states.map((state: any) => (
                        <li
                          key={state.id}
                          onClick={() => {
                            setSelectedState(state);
                            setSelectedCityObj(null);
                            fetchCities(selectedCountry.id, state.id);
                            setShowStateDropdown(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 flex justify-between cursor-pointer"
                        >
                          <span>{state.name}</span>
                          {selectedState?.id === state.id && (
                            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* City Dropdown */}
                <div className="relative">
                  <Label className="mb-1 block">City</Label>
                  <button
                    type="button"
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="w-full p-2 border rounded flex items-center justify-between mt-2"
                    disabled={!selectedState}
                  >
                    <span className="flex items-center gap-2"> {selectedCityObj?.name || 'Select City'}</span>
                    <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showCityDropdown && (
                    <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow-md max-h-60 overflow-y-auto">
                      {cities.map((city: any) => (
                        <li
                          key={city.id}
                          onClick={() => {
                            setSelectedCityObj(city);
                            setShowCityDropdown(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 flex justify-between cursor-pointer"
                        >
                          <span>{city.name}</span>
                          {selectedCityObj?.id === city.id && (
                            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <Button
                  onClick={handleCreateCity}
                  className="w-full mt-4"
                  disabled={!selectedCityObj}
                >
                  Add City
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-2 md:px-4 pb-4">
          <Card><CardContent className="p-4"><div className="text-2xl font-bold text-blue-600">{locations.length}</div><p className="text-sm text-muted-foreground">Active Cities</p></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-2xl font-bold text-green-600">{locations.reduce((t, c) => t + c.areas.length, 0)}</div><p className="text-sm text-muted-foreground">Total Areas</p></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-2xl font-bold text-purple-600">{locations.reduce((t, c) => t + c.totalListings, 0)}</div><p className="text-sm text-muted-foreground">Total Listings</p></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-2xl font-bold text-orange-600">{locations.reduce((t, c) => t + c.activeVendors, 0)}</div><p className="text-sm text-muted-foreground">Active Vendors</p></CardContent></Card>
        </div>
      </div>

      {/* Location Cards */}
      <div className="overflow-y-auto h-[calc(100vh-170px)] px-2 md:px-4 pt-4 pb-10">
        <div className="grid gap-6">
          {locations.map((location) => (
            <Card key={location.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {location.city}, {location.state}, {location.country}
                    <Badge variant="secondary">{location.areas.length} areas</Badge>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleManageAreas(location)}><Building className="h-4 w-4 mr-2" />Manage Areas</Button>
                    <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteCity(location.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/50 rounded"><div className="text-2xl font-bold text-blue-600">{location.totalListings}</div><div className="text-sm text-muted-foreground">Total Listings</div></div>
                  <div className="text-center p-3 bg-muted/50 rounded"><div className="text-2xl font-bold text-green-600">{location.activeVendors}</div><div className="text-sm text-muted-foreground">Active Vendors</div></div>
                  <div className="text-center p-3 bg-muted/50 rounded"><div className="text-2xl font-bold text-purple-600">{location.areas.reduce((t, a) => t + a.activeListings, 0)}</div><div className="text-sm text-muted-foreground">Active Listings</div></div>
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
                    {location.areas.map((area) => (
                      <TableRow key={area.id}>
                        <TableCell className="font-medium">{area.name}</TableCell>
                        <TableCell><Badge variant="outline">{area.activeListings} listings</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                            <Button variant="outline" size="sm"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Area Dialog */}
      <Dialog open={isAreaDialogOpen} onOpenChange={setIsAreaDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Areas for {selectedCity?.city}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex gap-4">
              <Input placeholder="New area name" className="flex-1" />
              <Button><Plus className="h-4 w-4 mr-2" />Add Area</Button>
            </div>
            <div className="space-y-2">
              {selectedCity?.areas.map((area: any) => (
                <div key={area.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <span className="font-medium">{area.name}</span>
                    <Badge variant="outline" className="ml-2">{area.activeListings} listings</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => setIsAreaDialogOpen(false)} className="w-full">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationManagement;
