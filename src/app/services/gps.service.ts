import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GpsService {

  constructor() { }
  private isLoaded = false;

  loadApi(key: string): Promise<void> {
    if (this.isLoaded) {
      return Promise.resolve();
    }
  
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,marker&loading=async`;
      script.async = true;
      script.defer = true;
  
      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };
  
      script.onerror = (error) => {
        reject(error);
      };
  
      document.head.appendChild(script);
    });
  }
  
  
}
