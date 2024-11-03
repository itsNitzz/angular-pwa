import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SwPush, SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'coffeelog';
  snackBar = inject(MatSnackBar);
  private swUpdate = inject(SwUpdate);
  private swPush = inject(SwPush);

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate();
      this.swUpdate.versionUpdates.subscribe({
        next: (update) => {
          if (update.type === 'VERSION_READY') {
            const sb = this.snackBar.open(
              'A new version is available',
              'Install Now',
              { duration: 3000 }
            );
            sb.onAction().subscribe(() => {
              location.reload();
            });
          }
        },
      });
    }

    this.updateUIBasedOnNetworkStatus();
    window.addEventListener('online', this.updateUIBasedOnNetworkStatus);
    window.addEventListener('offline', this.updateUIBasedOnNetworkStatus);
    if (window.matchMedia('(display-mode:browser)').matches) {
      if ('standalone' in navigator) {
        this.snackBar.open(
          'you can install this use share >  Add to Home Screen',
          '',
          {
            duration: 3000,
          }
        );
      } else {
        window.addEventListener('beforeinstallprompt', (e) => {
          e.preventDefault();
          const sb = this.snackBar.open('You can install app', 'Install', {
            duration: 5000,
          });

          sb.onAction().subscribe(() => {
            (e as any).prompt();
          });
        });
      }
    }
  }

  updateUIBasedOnNetworkStatus() {
    if (navigator.onLine) {
      (document.querySelector('body') as any).style = '';
    } else {
      (document.querySelector('body') as any).style = 'filter: grayscale(1)';
    }
  }

  onPush() {
    Notification.requestPermission((permission) => {
      if (permission === 'granted') {
        this.swPush
          .requestSubscription({
            serverPublicKey:
              'BHU2VuwYlFyuj-flmRFhxHcUF4PTWrhqDU4cWq6D7NOkk6FIU5EGzpZgB_I2A3KmWN-CoKm1LMQK89DkAFSGSws',
          })
          .then((registration) => {
            console.log(registration);
          });
      }
    });
  }
}
