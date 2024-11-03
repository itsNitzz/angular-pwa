import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Coffee } from '../logic/Coffee';
import { DataService } from '../data.service';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { UiService } from '../ui.service';

@Component({
  selector: 'pwa-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  list: Coffee[] = [];

  coffeeData = inject(DataService);
  private router = inject(Router);
  private uiService = inject(UiService);

  ngOnInit() {
    this.uiService.setTheme('#12fe94');
    this.uiService.setTitle('coffees');
    this.coffeeData.getList((coffeeList: Coffee[]) => {
      this.list = coffeeList;
    });
  }

  onCoffeeDetailsHandler(item: Coffee) {
    this.router.navigate(['/coffee', item._id]);
  }

  onShare(coffee: Coffee) {
    navigator.share({
      title: coffee.name,
      text: `I had this coffee at place ${coffee.place} and for me it's ${coffee.rating}`,
      url: window.location.href,
    });
  }
}
