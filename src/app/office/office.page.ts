import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ProductsPage } from './products/products.page';


@Component({
  selector: 'app-tab2',
  templateUrl: 'office.page.html',
  styleUrls: ['office.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ProductsPage]
})
export class OfficePage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {}

}
