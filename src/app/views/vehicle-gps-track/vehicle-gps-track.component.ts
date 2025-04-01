import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Database, objectVal, ref, listVal } from '@angular/fire/database';
import { VanService } from '../../services/van.service';
import { Loader } from '@googlemaps/js-api-loader';
import { GpsService } from '../../services/gps.service';
import { CalendarEventService } from '../../services/calendar-event.service';

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
  selectedDate: Date = new Date();
  isAll: boolean = false;
  vanService = inject(VanService);
  gpsService = inject(GpsService);
  private map: any;
  private markers: any[] = [];
  private searchBox!: google.maps.places.SearchBox;
  EventsService = inject(CalendarEventService);

  private vehicles = [
    { lat: 40.7178, lng: -74.0400, type: 'van', vehicleName: 'Van-101', assignedTechnician: 'John Doe' }, // New York
    { lat: 34.0736, lng: -118.4009, type: 'van', vehicleName: 'Van-102', assignedTechnician: 'Alice Smith' }, // Los Angeles
    { lat: 42.0451, lng: -87.6880, type: 'van', vehicleName: 'Van-103', assignedTechnician: 'Mike Brown' }, // Chicago
    { lat: 29.6911, lng: -95.2099, type: 'van', vehicleName: 'Van-104', assignedTechnician: 'Emma Wilson' }, // Houston
    { lat: 37.9050, lng: -122.2799, type: 'van', vehicleName: 'Van-105', assignedTechnician: 'Olivia Johnson' }, // Atlanta
  ];


  private jobs: any[] = [];

  private vehicleJobMapping = [
    { vehicleIndex: 0, jobIndex: 0 }, // Vehicle 1 -> Job 1
    { vehicleIndex: 1, jobIndex: 1 }, // Vehicle 2 -> Job 2
    { vehicleIndex: 2, jobIndex: 2 }, // Vehicle 3 -> Job 3
    { vehicleIndex: 3, jobIndex: 3 }, // Vehicle 4 -> Job 4
    { vehicleIndex: 4, jobIndex: 4 }, // Vehicle 5 -> Job 5
  ];

  private polylines: any[] = []; // Store polylines to manage clearing

  showingVehicles = true;
  apiKey = 'AIzaSyCVQ5c2gXZPufIBicJqN7WMq5YFjG-VlTY';

  constructor(private db: Database) { }
  ngOnInit(): void {
    this.updateDateTime();
    this.getAllCalendar();
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
    if (typeof google === 'undefined') {
      console.error('Google Maps API not loaded yet.');
      return;
    }

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

    if (!this.map) {
      console.error('Map initialization failed.');
      return;
    }

    // Ensure jobs are loaded before toggling all
    setTimeout(() => {
      if (this.jobs.length === 0) {
        console.warn('Jobs list is empty, waiting for data.');
        return;
      }
      this.toggleAll();
    }, 1000); // Delay execution to allow data loading
  }



  toggleAll(): void {
    if (!this.map) {
      console.error('Map is not initialized yet.');
      return;
    }

    this.isAll = true;
    this.showingVehicles = false;
    this.clearMarkers();

    // Ensure jobs exist before rendering
    if (this.jobs.length === 0) {
      console.warn('No jobs available, skipping job markers.');
    }

    this.vehicles.forEach((vehicle, index) => {
      if (!vehicle || typeof vehicle.lat !== 'number' || typeof vehicle.lng !== 'number') {
        console.warn(`Skipping vehicle ${index} due to invalid location data.`);
        return;
      }

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: vehicle.lat, lng: vehicle.lng },
        map: this.map,
      });

      this.markers.push(marker);
    });

    this.jobs.forEach((job, index) => {
      if (!job || typeof job.lat !== 'number' || typeof job.lng !== 'number') {
        console.warn(`Skipping job ${index} due to invalid location data.`);
        return;
      }

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: job.lat, lng: job.lng },
        map: this.map,
      });

      this.markers.push(marker);
    });

    // Draw routes only if jobs are available
    if (this.jobs.length > 0) {
      this.drawRoutes();
    }
  }



  toggleVehicles(): void {
    this.showingVehicles = true;
    this.isAll = false;
    this.clearMarkers();
    this.clearPolylines(); // Ensure polylines are cleared

    this.vehicles.forEach((vehicle, index) => {
      const contentElement = document.createElement('div');
      contentElement.style.display = 'flex';
      contentElement.style.alignItems = 'center';

      // Add vehicle icon
      const iconElement = document.createElement('img');
      iconElement.src = 'https://img.icons8.com/?size=80&id=N2EsIjOuzPRj&format=png'; // Replace with your preferred van icon URL
      iconElement.alt = 'Van Icon';
      iconElement.style.width = '20px';
      iconElement.style.height = '20px';
      iconElement.style.marginRight = '8px';

      // Add vehicle info
      const infoElement = document.createElement('div');
      infoElement.innerHTML = `<strong>Vehicle No.:</strong> V${index + 1}`;
      infoElement.style.fontSize = '12px';
      infoElement.style.color = '#000'; // Text color for visibility
      infoElement.style.padding = '4px';
      infoElement.style.backgroundColor = '#fff'; // White background for better contrast
      infoElement.style.border = '1px solid #ccc'; // Optional border
      infoElement.style.borderRadius = '4px'; // Rounded corners

      // Combine icon and info
      contentElement.appendChild(iconElement);
      contentElement.appendChild(infoElement);

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: vehicle.lat, lng: vehicle.lng },
        map: this.map,
        content: contentElement,
      });

      // Add an InfoWindow for displaying vehicle details
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div>
            <p><strong>Vehicle Name:</strong> ${vehicle.vehicleName}</p>
            <p><strong>Assigned Technician:</strong> ${vehicle.assignedTechnician}</p>
          </div>
        `,
      });

      // Add click listener to show the InfoWindow
      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });

      this.markers.push(marker);
    });
  }


  toggleJobs(): void {
    this.showingVehicles = false;
    this.isAll = false;
    this.clearMarkers();
    this.clearPolylines(); // Ensure polylines are cleared

    this.jobs.forEach((job, index) => {
      const contentElement = document.createElement('div');
      contentElement.innerHTML = `<strong>Job ID:</strong> ${index + 1}`;
      contentElement.style.padding = '5px';
      contentElement.style.backgroundColor = '#ffb879';
      contentElement.style.border = '1px solid #ccc';
      contentElement.style.borderRadius = '4px';

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: job.lat, lng: job.lng },
        map: this.map,
        content: contentElement,
      });

      // Add an InfoWindow for displaying Job details
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
    });
  }

  ngAfterViewInit(): void {
    this.gpsService
      .loadApi(this.apiKey)
      .then(() => {
        if (typeof google !== 'undefined') {
          this.initializeMap();
          this.initializeSearchBox();
        } else {
          console.error('Google Maps API failed to load.');
        }
      })
      .catch((error) => {
        console.error('Failed to load Google Maps API:', error);
      });
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

      // Check if vehicle and job exist and have valid coordinates
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
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
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

  getAllCalendar() {
    this.EventsService.getAllEventsService().subscribe((res: any) => {
      if (res && res.status === 200 && res.data) { // Ensure res is an object
        this.jobs = res.data.map((event: any) => ({
          lat: event.lat,
          lng: event.lng,
          clientName: event.clientName,
          address: event.address
        }));
        console.log("Updated jobs", this.jobs);
      }
    });
  }

}
