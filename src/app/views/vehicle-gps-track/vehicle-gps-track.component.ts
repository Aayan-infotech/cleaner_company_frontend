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

  vanService = inject(VanService);
  gpsService = inject(GpsService);
  private map: any;
  private markers: any[] = [];

  private vehicles = [
    { lat: 40.7128, lng: -74.0060, type: 'van' }, // New York
    { lat: 34.0522, lng: -118.2437, type: 'van' }, // Los Angeles
    { lat: 41.8781, lng: -87.6298, type: 'van' }, // Chicago
    { lat: 29.7604, lng: -95.3698, type: 'van' }, // Houston
    { lat: 33.7490, lng: -84.3880, type: 'van' }, // Atlanta
  ];
  
  private jobs = [
    { lat: 37.7749, lng: -122.4194 }, // San Francisco
    { lat: 39.7392, lng: -104.9903 }, // Denver
    { lat: 47.6062, lng: -122.3321 }, // Seattle
    { lat: 32.7157, lng: -117.1611 }, // San Diego
    { lat: 36.1627, lng: -86.7816 }, // Nashville
  ];
  
  showingVehicles = true;
  apiKey = 'AIzaSyA7e-ILDWp8LWUnkwyGCw7e0y0oMSXAIHE';

  constructor(private db: Database) { }
  ngOnInit(): void {
    // Reference to the 'vehicles' path in the Realtime Database

    this.updateDateTime();
    setInterval(() => {
      this.updateCurrentTime();
    }, 1000);

    this.gpsService.loadApi(this.apiKey)
      .then(() => {
        setTimeout(() => {
        this.initializeMap();
        this.toggleVehicles();
        this.initAutocomplete();
      },100);
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
  
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: 22.5726, lng: 77.1025 },
      zoom: 5,
      mapId: '6237a1ef84fdf9c2', // Replace with your valid Map ID
    });
  }
  

  toggleVehicles(): void {
    this.showingVehicles = true;
    this.clearMarkers();
  
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
  
      this.markers.push(marker);
    });

  }
  

  toggleJobs(): void {
    this.showingVehicles = false;
    this.clearMarkers();

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

      this.markers.push(marker);
    });
  }

  private initAutocomplete(): void {
    const input = document.getElementById('address-search') as HTMLInputElement;
  
    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['geocode'], // Restrict to geocoding (addresses)
    });
  
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
  
      if (!place.geometry) {
        console.error('Place contains no geometry.');
        return;
      }
  
      // Center the map on the selected place
      this.map.setCenter(place.geometry.location);
      this.map.setZoom(15);
  
      // Clear existing markers
      this.clearMarkers();
  
      // Add a new marker for the selected place
      const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: this.map,
        title: place.formatted_address,
      });
  
      this.markers.push(marker);
    });
  }
}
