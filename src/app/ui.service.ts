import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  constructor() {}

  setTitle(title: string) {
    document.title = title;
  }

  setTheme(themeColor: string) {
    (document.querySelector("meta[name='theme-color']") as any).content =
      themeColor;
  }
}
