import { NgFor, NgIf } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { DataService } from '../data.service';
import { Coffee } from '../logic/Coffee';
import { GeolocationService } from '../geolocation.service';
import { TastingRating } from '../logic/TastingRating';
import { Router } from '@angular/router';
import { UiService } from '../ui.service';

@Component({
  selector: 'pwa-coffee',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSliderModule,
    MatSlideToggleModule,
    FormsModule,
    NgFor,
    NgIf,
  ],
  templateUrl: './coffee.component.html',
  styleUrl: './coffee.component.scss',
})
export class CoffeeComponent {
  id = input<string>();
  coffee = new Coffee();
  types = ['Expresso', 'Americano', 'Cappucino', 'Frappe', 'Ristretto'];
  tastingEnabled = false;
  formType: 'inserting' | 'updating' = 'inserting';

  locationService = inject(GeolocationService);
  dataService = inject(DataService);
  private router = inject(Router);
  private uiService = inject(UiService);

  ngOnInit() {
    this.uiService.setTheme('brown');
    this.uiService.setTitle('New');
    this.dataService.getList((coffeeItems: Coffee[]) => {
      if (this.id()) {
        this.coffee = coffeeItems.find(
          (item) => item._id === this.id()
        ) as Coffee;
        this.formType = 'updating';
        this.uiService.setTitle(this.coffee.name);

        if (this.coffee.tastingRating) {
          this.tastingEnabled = true;
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }

  save() {
    const resultFunction = (result: boolean) => {
      result && this.router.navigate(['/']);
    };

    if (this.formType === 'inserting') {
      let { _id, ...insertedCoffee } = this.coffee;
      this.dataService.save(insertedCoffee, resultFunction);
    } else {
      this.dataService.save(this.coffee, resultFunction);
    }
  }

  acquireLocation() {
    this.locationService.requestNewLocation(
      (location: GeolocationCoordinates | null) => {
        if (location) {
          this.coffee.location!.latitude = location.latitude;
          this.coffee.location!.longitude = location.longitude;
        }
      }
    );
  }

  tastingRatingChanged(isEnabled: boolean) {
    isEnabled
      ? (this.coffee.tastingRating = new TastingRating())
      : (this.coffee.tastingRating = null);
  }
}
