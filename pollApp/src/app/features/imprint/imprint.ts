import { Component } from '@angular/core';

const IMPRINT = {
  name: 'Noureddin Boussaada',
  street: 'Ordensstr. 19',
  city: '50129 Bergheim',
  email: 'n.boussaada92@gmail.com',
};

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.html',
  styleUrl: './imprint.scss',
})
export class Imprint {
  readonly imprint = IMPRINT;
}
