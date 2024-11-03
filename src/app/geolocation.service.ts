import { Injectable } from '@angular/core';
import { PlaceLocation } from './logic/PlaceLocation';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  requestNewLocation(setLatLngFn: Function) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatLngFn(position.coords);
      },

      (error) => {
        setLatLngFn(error);
      }
    );
  }

  getMapLink(location: PlaceLocation) {
    let query = '';
    if (location.latitude && location.longitude) {
      query = `${location.latitude},${location.longitude}`;
    } else {
      query = `${location.address}, ${location.city}`;
    }
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      return `https://maps.apple.com/?q=${query}`;
    } else {
      return `https://maps.google.com/?q=${query}`;
    }
  }
}
