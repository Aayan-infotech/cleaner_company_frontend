import { Component, inject } from '@angular/core';
import { Database, objectVal, ref, listVal } from '@angular/fire/database';
import { VanService } from '../../services/van.service';
import { Loader } from '@googlemaps/js-api-loader';
import { GpsService } from '../../services/gps.service';

@Component({
  selector: 'app-vehicle-gps-track',
  standalone: false,
  templateUrl: './vehicle-gps-track.component.html',
  styleUrl: './vehicle-gps-track.component.scss'
})
export class VehicleGpsTrackComponent {
  currentDate!: string;
  currentDay!: string;
  currentTime!: string;
  selectedDate: Date = new Date();
  isAll: boolean = false;
  vanService = inject(VanService);
  gpsService = inject(GpsService);
  private map: any;
  private markers: any[] = [];

  private vehicles = [
    { lat: 40.7128, lng: -74.0060, type: 'van', vehicleName: 'Van-101', assignedTechnician: 'John Doe' }, // New York
    { lat: 34.0522, lng: -118.2437, type: 'van', vehicleName: 'Van-102', assignedTechnician: 'Alice Smith' }, // Los Angeles
    { lat: 41.8781, lng: -87.6298, type: 'van', vehicleName: 'Van-103', assignedTechnician: 'Mike Brown' }, // Chicago
    { lat: 29.7604, lng: -95.3698, type: 'van', vehicleName: 'Van-104', assignedTechnician: 'Emma Wilson' }, // Houston
    { lat: 33.7490, lng: -84.3880, type: 'van', vehicleName: 'Van-105', assignedTechnician: 'Olivia Johnson' }, // Atlanta
  ];


  private jobs = [
    { lat: 37.7749, lng: -122.4194, clientName: 'Jain Singh' }, // San Francisco
    { lat: 39.7392, lng: -104.9903, clientName: 'Rishabh Kumar' }, // Denver
    { lat: 47.6062, lng: -122.3321, clientName: 'Utkarsh Gupta' }, // Seattle
    { lat: 32.7157, lng: -117.1611, clientName: 'Rana Chaudhary' }, // San Diego
    { lat: 36.1627, lng: -86.7816, clientName: 'Ujala Rajput' }, // Nashville
  ];

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

    setInterval(() => {
      this.updateCurrentTime();
    }, 1000);

    this.gpsService
      .loadApi(this.apiKey)
      .then(() => {
        this.initializeMap();
        this.toggleAll();
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
    this.markers.forEach((marker) => marker.map = null);
    this.markers = [];
  }
  private initializeMap(): void {
    if (!window['google'] || !google.maps) {
      console.error('Google Maps API is not loaded.');
      return;
    }

    console.log('Google Maps object:', google.maps);

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: 37.0902, lng: -95.7129 },
      zoom: 5,
      mapId: '3bb539d168c8b698', // Use your valid Map ID or omit this if unnecessary
    });
  }

  toggleAll(): void {
    this.isAll = true;
    this.showingVehicles = false; // Indicates mixed view
    this.clearMarkers();

    // Add vehicle markers
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
      infoElement.style.color = '#000';
      infoElement.style.padding = '4px';
      infoElement.style.backgroundColor = '#fff';
      infoElement.style.border = '1px solid #ccc';
      infoElement.style.borderRadius = '4px';

      // Combine icon and info
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
          </div>
        `,
      });

      // Add click listener to show the InfoWindow
      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });

      this.markers.push(marker);
    });

    // Add job markers
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
                </div>
              `,
            });
      
            // Add click listener to show the InfoWindow
            marker.addListener('click', () => {
              infoWindow.open(this.map, marker);
            });

      this.markers.push(marker);
    });

    // Draw routes between vehicles and jobs
    this.drawRoutes();
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

      const path = [
        { lat: vehicle.lat, lng: vehicle.lng },
        { lat: job.lat, lng: job.lng },
      ];

      const polyline = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: this.map,
      });

      this.polylines.push(polyline);
    });
  }

}
