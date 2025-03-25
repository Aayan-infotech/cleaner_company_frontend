import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GpsService {

  constructor() { }
  private isLoaded = false;

  loadApi(key: string): Promise<void> {
    if (this.isLoaded) {
      console.log('Google Maps API already loaded');
      return Promise.resolve();
    }
  
    return new Promise((resolve, reject) => {
      console.log('Loading Google Maps API...');
  
      if (document.querySelector(`script[src*="maps.googleapis.com"]`)) {
        console.log('Google Maps script already present in DOM.');
        this.isLoaded = true;
        resolve();
        return;
      }
  
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=geometry,marker,places`;
      script.async = true;
      script.defer = true;
  
      script.onload = () => {
        console.log('Google Maps API loaded successfully');
        this.isLoaded = true;
        resolve();
      };
  
      script.onerror = (error) => {
        console.error('Error loading Google Maps API:', error);
        reject(error);
      };
  
      document.head.appendChild(script);
    });
  }
  

  
  
  
}