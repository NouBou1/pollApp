import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { ButtonPrimary } from './shared/components/button-primary/button-primary';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ButtonPrimary],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: { '[class.app--light]': 'isLight()' },
})
export class App {
  private readonly router = inject(Router);

  // Routes opt into the light page design via `data: { theme: 'light' }`.
  readonly isLight = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) route = route.firstChild;
        return route.data['theme'] === 'light';
      }),
    ),
    { initialValue: false },
  );
}
