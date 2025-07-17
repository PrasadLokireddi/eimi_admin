
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, MapPin, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LocationManagement = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  // Mock data
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
    },
    {
      id: 4,
      city: 'Miami',
      state: 'FL',
      country: 'USA',
      areas: [
        { id: 401, name: 'South Beach', activeListings: 29 },
        { id: 402, name: 'Downtown Miami', activeListings: 26 },
        { id: 403, name: 'Coral Gables', activeListings: 19 }
      ],
      totalListings: 74,
      activeVendors: 16
    }
  ];

  const handleCreateCity = () => {
    toast({
      title: "City Added",
      description: "New city has been successfully added to the platform.",
    });
    setIsDialogOpen(false);
  };

  const handleManageAreas = (city: any) => {
    setSelectedCity(city);
    setIsAreaDialogOpen(true);
  };

  const handleDeleteCity = (cityId: number) => {
    toast({
      title: "City Removed",
      description: "City and all its areas have been removed from the platform.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Location Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add City
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New City</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cityName">City Name</Label>
                <Input id="cityName" placeholder="Enter city name" />
              </div>
              <div>
                <Label htmlFor="stateName">State/Province</Label>
                <Input id="stateName" placeholder="Enter state or province" />
              </div>
              <div>
                <Label htmlFor="countryName">Country</Label>
                <Input id="countryName" placeholder="Enter country" />
              </div>
              <Button onClick={handleCreateCity} className="w-full">
                Add City
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {locations.length}
            </div>
            <p className="text-sm text-muted-foreground">Active Cities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {locations.reduce((total, city) => total + city.areas.length, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Areas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {locations.reduce((total, city) => total + city.totalListings, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {locations.reduce((total, city) => total + city.activeVendors, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Active Vendors</p>
          </CardContent>
        </Card>
      </div>

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
                  <Button variant="outline" size="sm" onClick={() => handleManageAreas(location)}>
                    <Building className="h-4 w-4 mr-2" />
                    Manage Areas
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteCity(location.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/50 rounded">
                  <div className="text-2xl font-bold text-blue-600">{location.totalListings}</div>
                  <div className="text-sm text-muted-foreground">Total Listings</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded">
                  <div className="text-2xl font-bold text-green-600">{location.activeVendors}</div>
                  <div className="text-sm text-muted-foreground">Active Vendors</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded">
                  <div className="text-2xl font-bold text-purple-600">
                    {location.areas.reduce((total, area) => total + area.activeListings, 0)}
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
                  {location.areas.map((area) => (
                    <TableRow key={area.id}>
                      <TableCell className="font-medium">{area.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{area.activeListings} listings</Badge>
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
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAreaDialogOpen} onOpenChange={setIsAreaDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Manage Areas for {selectedCity?.city}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex gap-4">
              <Input placeholder="New area name" className="flex-1" />
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Area
              </Button>
            </div>
            
            <div className="space-y-2">
              {selectedCity?.areas.map((area: any) => (
                <div key={area.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <span className="font-medium">{area.name}</span>
                    <Badge variant="outline" className="ml-2">
                      {area.activeListings} listings
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button onClick={() => setIsAreaDialogOpen(false)} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationManagement;
