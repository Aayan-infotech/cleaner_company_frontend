import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Database, objectVal, ref, listVal } from '@angular/fire/database';
import { VanService } from '../../services/van.service';
import { Loader } from '@googlemaps/js-api-loader';
import { GpsService } from '../../services/gps.service';
import { CalendarEventService } from '../../services/calendar-event.service';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore, collection, getDoc, doc } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vehicle-gps-track',
  standalone: false,
  templateUrl: './vehicle-gps-track.component.html',
  styleUrl: './vehicle-gps-track.component.scss'
})
export class VehicleGpsTrackComponent implements OnInit, AfterViewInit {
  currentDate!: string;
  currentDay!: string;
  currentTime!: string;
  jobData!: any;
  currentJobs: any[] = [];

  pastJobData!: any;
  pastCurrentJobs: any[] = [];
  selectedDate: Date = new Date();
  isAll: boolean = false;
  vanService = inject(VanService);
  gpsService = inject(GpsService);
  private map: any;
  private markers: any[] = [];
  private searchBox!: google.maps.places.SearchBox;
  EventsService = inject(CalendarEventService);
  private vehicleJobMapping: any[] = [];

  public vehicles: any[] = [];
  selectedVehicleName: string = 'All';
  public visible = false;
  selectedJob: any = null; 
  public jobs: any[] = [];
  currentFilterStatus: string | null = null;
  pastFilterStatus: string | null = null;
  
  private polylines: any[] = []; // Store polylines to manage clearing

  showingVehicles = false;
  apiKey = 'AIzaSyCVQ5c2gXZPufIBicJqN7WMq5YFjG-VlTY';

  constructor(private db: Database,private firestore: Firestore,private http: HttpClient,) { }
  ngOnInit(): void {
    this.updateDateTime();
    this.getAllCalendar();
    this.getAllCurrentJobs('pending')
    this.getAllPastJobs('pending')
    setInterval(() => {
      this.updateCurrentTime();
    }, 1000);

    this.gpsService
      .loadApi(this.apiKey)
      .then(() => {
        this.initializeMap();  // Ensure map is initialized first
        this.initializeSearchBox(); // Now search box can be initialized safely

      })
      .catch((error) => {
        console.error('Failed to load Google Maps API:', error);
      });
  }


  updateDateTime() {
    this.currentDate = this.formatDate(this.selectedDate);
    this.currentDay = this.formatDay(this.selectedDate);
    this.updateCurrentTime();
  }

  updateCurrentTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }

  changeDate(days: number) {
    this.selectedDate.setDate(this.selectedDate.getDate() + days);
    this.updateDateTime();
    this.filterJobsByDate();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDay(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }


  private clearMarkers(): void {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }


  initializeMap(): void {
    const mapElement = document.getElementById('map') as HTMLElement;
    if (!mapElement) {
      console.error('Map element not found.');
      return;
    }

    this.map = new google.maps.Map(mapElement, {
      center: { lat: 37.0902, lng: -95.7129 },
      zoom: 5,
      mapId: '3bb539d168c8b698',
    });

    if (this.vehicles.length > 0 || this.jobs.length > 0) {
      this.toggleAll();
    }
  }



  toggleAll(): void {
    if (!this.map) {
      console.error('Map is not initialized yet.');
      return;
    }
  
    // Defer state updates to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.isAll = true;
      this.showingVehicles = false;
    }, 0);
  
    this.clearMarkers();
    this.clearPolylines();
  
    // Add markers for vehicles (blue icon)
    const vehicleIcon = {
      url: 'https://img.icons8.com/?size=80&id=N2EsIjOuzPRj&format=png', // Replace with your desired vehicle icon
      scaledSize: new google.maps.Size(30, 30), // Size of the icon
    };
  
    this.vehicles.forEach((vehicle) => {
      if (vehicle.lat && vehicle.lng) {
        const marker = new google.maps.Marker({
          position: { lat: vehicle.lat, lng: vehicle.lng },
          map: this.map,
          title: vehicle.vehicleName,
          icon: vehicleIcon, // Use the vehicle icon
          zIndex: 2,
        });
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <p><strong>Vehicle Name:</strong> ${vehicle.vehicleName}</p>
              <p><strong>Assigned Technician:</strong> ${vehicle.assignedTechnician}</p>
               <p><strong>Technician Status:</strong> ${vehicle.technicianStatus}</p>
            </div>
          `,
        });
    
        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        });
        this.markers.push(marker);
      }
    });
  

  
    this.jobs.forEach((job) => {
      if (job.lat && job.lng) {
        const marker = new google.maps.Marker({
          position: { lat: job.lat, lng: job.lng },
          map: this.map,
          title: job.clientName,
          zIndex: 2,
        });
        const infoWindow = new google.maps.InfoWindow({
          content: `
                  <div>
                    <p><strong>Client Name:</strong> ${job.clientName}</p>
                     <p><strong>Client Address:</strong> ${job.address}</p>
                  </div>
                `,
        });
  
        // Add click listener to show the InfoWindow
        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        });
  
        this.markers.push(marker);
      }
    });
  
    // Draw polylines
    this.drawRoutes();
  }

  
  


  toggleVehicles(): void {
    this.clearMarkers();
    this.clearPolylines();

    // Check if "All" is selected
    if (this.selectedVehicleName === 'All') {
      this.showingVehicles = true;
      this.vehicles.forEach((vehicle, index) => {
        this.addVehicleMarker(vehicle, index);
      });
    } else {
      this.showingVehicles = false;
      const selectedVehicle = this.vehicles.find(vehicle => vehicle.vehicleName === this.selectedVehicleName);
      if (selectedVehicle) {
        this.addVehicleMarker(selectedVehicle, 0);
      }
    }
  }

  addVehicleMarker(vehicle: any, index: number): void {
    this.showingVehicles = true;
    this.isAll = false;
    const contentElement = document.createElement('div');
    contentElement.style.display = 'flex';
    contentElement.style.alignItems = 'center';

    const iconElement = document.createElement('img');
    iconElement.src = 'https://img.icons8.com/?size=80&id=N2EsIjOuzPRj&format=png'; // Replace with your icon URL
    iconElement.alt = 'Van Icon';
    iconElement.style.width = '20px';
    iconElement.style.height = '20px';
    iconElement.style.marginRight = '8px';

    const infoElement = document.createElement('div');
    infoElement.innerHTML = `<strong>Vehicle No.:</strong> V${index + 1}`;
    infoElement.style.fontSize = '12px';
    infoElement.style.color = '#000';
    infoElement.style.padding = '4px';
    infoElement.style.backgroundColor = '#fff';
    infoElement.style.border = '1px solid #ccc';
    infoElement.style.borderRadius = '4px';

    contentElement.appendChild(iconElement);
    contentElement.appendChild(infoElement);

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat: vehicle.lat, lng: vehicle.lng },
      map: this.map,
      content: contentElement,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div>
          <p><strong>Vehicle Name:</strong> ${vehicle.vehicleName}</p>
          <p><strong>Assigned Technician:</strong> ${vehicle.assignedTechnician}</p>
           <p><strong>Technician Status:</strong> ${vehicle.technicianStatus}</p>
        </div>
      `,
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });

    this.markers.push(marker);
  }
  

  toggleJobs(): void {
    if (!this.map) {
      console.error('Map is not initialized yet.');
      return;
    }
  
    this.showingVehicles = false;
    this.isAll = false;
    this.clearMarkers();
    this.clearPolylines(); // Ensure polylines are cleared
  
    console.log('Displaying Jobs:', this.jobs); // Debug log to verify job data
  
    this.jobs.forEach((job, index) => {
      if (job.lat && job.lng) {
        const marker = new google.maps.Marker({
          position: { lat: job.lat, lng: job.lng },
          map: this.map,
          title: `Job ID: ${index + 1}`,
        });
  
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <p><strong>Client Name:</strong> ${job.clientName}</p>
              <p><strong>Client Address:</strong> ${job.address}</p>
            </div>
          `,
        });
  
        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        });
  
        this.markers.push(marker);
      } else {
        console.warn(`Job ${index + 1} is missing lat/lng`, job);
      }
    });
  }
  

  // all vehicle button
  
  toggleAllVehicles(): void {
    if (!this.map) {
      console.error('Map is not initialized yet.');
      return;
    }
  
    // Defer state updates to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.isAll = false;
      this.showingVehicles = true;
    }, 0);
  
    this.clearMarkers();
    this.clearPolylines();
  
    // Add markers for vehicles (blue icon)
    const vehicleIcon = {
      url: 'https://img.icons8.com/?size=80&id=N2EsIjOuzPRj&format=png', // Replace with your desired vehicle icon
      scaledSize: new google.maps.Size(30, 30), // Size of the icon
    };
  
    this.vehicles.forEach((vehicle) => {
      if (vehicle.lat && vehicle.lng) {
        const marker = new google.maps.Marker({
          position: { lat: vehicle.lat, lng: vehicle.lng },
          map: this.map,
          title: vehicle.vehicleName,
          icon: vehicleIcon, // Use the vehicle icon
          zIndex: 2,
        });
  
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <p><strong>Vehicle Name:</strong> ${vehicle.vehicleName}</p>
              <p><strong>Assigned Technician:</strong> ${vehicle.assignedTechnician}</p>
              <p><strong>Technician Status:</strong> ${vehicle.technicianStatus}</p>
            </div>
          `,
        });
  
        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        });
  
        this.markers.push(marker);
      }
    });
  }
  

  ngAfterViewInit(): void {
    if (typeof google !== 'undefined') {
      this.initializeMap();
    } else {
      console.error('Google Maps API failed to load.');
    }
  }


  loadGoogleMapsApi(): void {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
    script.defer = true;
    script.async = true;
    script.onload = () => {
      this.initializeMap();
    };
    script.onerror = () => {
      console.error('Google Maps API failed to load.');
    };
    document.head.appendChild(script);
  }




  // polylines

  private clearPolylines(): void {
    this.polylines.forEach((polyline) => polyline.setMap(null));
    this.polylines = [];
  }
  

  private drawRoutes(): void {
    this.clearPolylines();
  
    this.vehicleJobMapping.forEach((mapping) => {
      const vehicle = this.vehicles[mapping.vehicleIndex];
      const job = this.jobs[mapping.jobIndex];
  
      if (
        !vehicle ||
        typeof vehicle.lat !== 'number' ||
        typeof vehicle.lng !== 'number' ||
        !job ||
        typeof job.lat !== 'number' ||
        typeof job.lng !== 'number'
      ) {
        console.warn(`Skipping route for vehicle ${mapping.vehicleIndex} or job ${mapping.jobIndex} due to missing data.`);
        return;
      }
  
      const path = [
        { lat: vehicle.lat, lng: vehicle.lng },
        { lat: job.lat, lng: job.lng },
      ];
  
      const polyline = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#ff0000", // Red color for the line
        strokeOpacity: 0.7,
        strokeWeight: 3,
      });
  
      polyline.setMap(this.map);
      this.polylines.push(polyline);
    });
  }
  


  private initializeSearchBox(): void {
    if (!this.map) {
        console.error("Map is not initialized.");
        return;
    }

    const input = document.getElementById("search-box") as HTMLInputElement;
    if (!input) {
        console.error("Search box input element not found.");
        return;
    }

    const searchBox = new google.maps.places.SearchBox(input);

    // Remove this line, which adds input inside map controls
    // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();

        if (!places || places.length === 0) {
            console.error("No places found.");
            return;
        }

        // Clear existing markers
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];

        // Get the bounds of the search results
        const bounds = new google.maps.LatLngBounds();

        places.forEach(place => {
            if (!place.geometry || !place.geometry.location) {
                console.warn("Place has no geometry:", place);
                return;
            }

            const marker = new google.maps.Marker({
                map: this.map,
                title: place.name,
                position: place.geometry.location
            });

            this.markers.push(marker);
            bounds.extend(place.geometry.location);
        });

        this.map.fitBounds(bounds);
    });
}


  // all events /Jobs

  async getAllCalendar(): Promise<void> {
    try {
      const response: any = await this.http.get('http://18.209.91.97:5966/api/event/').toPromise();
      if (response.status === 200 && Array.isArray(response.data)) {
        this.jobs = response.data;
        this.filterJobsByDate(); 
        const vehicleJobMapping: any[] = [];
        const vehiclesPromises = response.data.map(async (event: any, index: number) => {
          const employeeId = event.employeeId?._id;
          if (employeeId) {
            const vehicleData = await this.getVehicleLocation(employeeId);
            if (vehicleData) {
              vehicleJobMapping.push({
                vehicleIndex: index, // Index of the vehicle
                jobIndex: index,    // Index of the job
              });
  
              return {
                lat: vehicleData.latitude,
                lng: vehicleData.longitude,
                vehicleName: event.employeeId.employee_vanAssigned?.vanName || 'Unknown',
                assignedTechnician: event.employeeName || 'N/A',
                technicianStatus: event.employeeId.employee_workingStatus || 'N/A',
              };
            }
          }
          return null;
        });
  
        const vehicles = await Promise.all(vehiclesPromises);
        this.vehicles = vehicles.filter((v) => v !== null);
        this.vehicleJobMapping = vehicleJobMapping;
  
        if (this.map) {
          this.toggleAll();
        }
  
        // Automatically draw routes
        this.drawRoutes();
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }
  

  private async getVehicleLocation(employeeId: string): Promise<any | null> {
    try {
      const docRef = doc(this.firestore, 'live_locations', employeeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.warn(`No location data found for employeeId: ${employeeId}`);
      }
    } catch (error) {
      console.error('Error fetching vehicle location:', error);
    }
    return null;
  }

  toggleRoutesVisibility(): void {
    if (this.polylines.length > 0) {
      const isVisible = this.polylines[0].getMap() !== null;
      this.polylines.forEach((polyline) => polyline.setMap(isVisible ? null : this.map));
    }
  }
  
  displayJobsOnMap(filteredJobs: any[]): void {
    this.clearMarkers(); // Clear existing markers
    this.clearPolylines(); // Clear existing polylines
  
    filteredJobs.forEach((job, index) => {
      const contentElement = document.createElement('div');
      contentElement.innerHTML = `<strong>Job ID:</strong> ${index + 1}`;
      contentElement.style.padding = '5px';
      contentElement.style.backgroundColor = '#ffb879';
      contentElement.style.border = '1px solid #ccc';
      contentElement.style.borderRadius = '4px';
  
      const marker = new google.maps.Marker({
        position: { lat: job.lat, lng: job.lng },
        map: this.map,
        title: job.clientName,
      });
  
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div>
            <p><strong>Client Name:</strong> ${job.clientName}</p>
            <p><strong>Client Address:</strong> ${job.address}</p>
          </div>
        `,
      });
  
      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });
  
      this.markers.push(marker);
    });
  }

  filterJobsByDate(): void {
    if (!this.jobs || this.jobs.length === 0) {
      return;
    }
  
    const selectedDateString = this.selectedDate.toISOString().split('T')[0]; // Get selected date in 'yyyy-mm-dd' format
  
    const filteredJobs = this.jobs.filter((job) => {
      const jobDate = new Date(job.date).toISOString().split('T')[0];
      return jobDate === selectedDateString;
    });
  
    this.displayJobsOnMap(filteredJobs);
  }
  
  //current day Job
  getAllCurrentJobs(status?: any): void {
    this.EventsService.getAllCurrentJobs(status).subscribe({
      next: (res) => {
        this.jobData = res;
        this.currentJobs = this.jobData?.data || []; // Safeguard for null/undefined
      },
      error: (err) => {
        if (err.status === 404) {
          console.warn(err.error.message); // API 404 message (e.g., "No current events found")
        }
        this.currentJobs = []; // Fallback to empty array
      },
      complete: () => {
        console.log('Job fetching completed.');
      }
    });
  }
  
  // Update the filter
  applyFilter(status: string | null): void {
    this.currentFilterStatus = status;
    this.getAllCurrentJobs(status);
  }
  // past jobs 

  getAllPastJobs(status?: string): void {
    this.EventsService.getAllPastJobs(status).subscribe({
      next: (res) => {
        this.pastJobData = res;
        this.pastCurrentJobs = this.pastJobData?.data || []; // Safeguard for null/undefined
      },
      error: (err) => {
        if (err.status === 404) {
          console.warn(err.error.message); // API 404 message (e.g., "No current events found")
        }
        this.pastCurrentJobs = []; // Fallback to empty array
      },
      complete: () => {
        console.log('Job fetching completed.');
      },
    });
  }

  applyPastFilter(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.pastFilterStatus = selectElement.value; // Update the filter
    this.getAllPastJobs(this.pastFilterStatus); // Fetch filtered jobs
  }
  


  getStatusClass(status: string): string {
    switch (status) {
      case 'Maintenance':
        return 'status-yellow';
      case 'Offline':
        return 'status-red';
      case 'InService':
        return 'status-green';
      default:
        return 'status-default'; // For unknown statuses
    }
  }


  getStatusLabel(status: string): string {
    switch (status) {
      case 'Offline':
        return 'Inactive';
      case 'InService':
        return 'Active';
      case 'Maintenance':
        return 'Maintenance';
      default:
        return 'Unknown'; // For unknown statuses
    }
  }
  

//modal 

toggleLiveDemo() {
  this.visible = !this.visible;
}

handleLiveDemoChange(event: any) {
  this.visible = event;
}

viewJobDetails(jobId: string) {
  this.EventsService.getEventService(jobId).subscribe(
    (response) => {
      this.selectedJob = response; // Store the job details
      this.toggleLiveDemo(); // Open the modal
    },
    (error) => {
      console.error('Error fetching job details:', error);
    }
  );
}

}
