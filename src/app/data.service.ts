import { Injectable, inject } from '@angular/core';
import { Coffee } from './logic/Coffee';
import { PlaceLocation } from './logic/PlaceLocation';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);

  getList(callback: Function) {
    this.http
      .get('http://localhost:3000/coffees')
      .subscribe((list) => callback(list));
  }

  save(coffee: any, callback: Function) {
    if (coffee._id) {
      this.http
        .put(`http://localhost:300/coffees/${coffee._id}`, coffee)
        .subscribe({
          next: (res) => callback(true),
          error: (err) => callback(false),
        });
    } else {
      this.http.post(`http://localhost:3000/coffees`, coffee).subscribe({
        next: (res) => callback(true),
        error: (err) => callback(false),
      });
    }
  }
}
