import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Data, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
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

  private readonly routeData = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((): Data => {
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) route = route.firstChild;
        return route.data;
      }),
    ),
    { initialValue: {} as Data },
  );

  readonly isLight = computed(() => this.routeData()['theme'] === 'light');
  readonly showHeader = computed(() => this.routeData()['header'] !== false);
  readonly showImprintLink = computed(() => this.routeData()['imprintLink'] !== false);
}
