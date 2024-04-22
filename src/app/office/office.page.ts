import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, inject, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ProductsPage } from './products/products.page';
import { IngredientService } from './ingredient/ingredient.service';
import { ProductsService } from './products/products.service';
import { environment } from '../../environments/environment.prod';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-tab2',
  templateUrl: 'office.page.html',
  styleUrls: ['office.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ProductsPage]
})
export class OfficePage implements OnDestroy {
  public environmentInjector = inject(EnvironmentInjector);

  private ingSub!: Subscription
  private productSub!: Subscription

  constructor(
    private ingsSrv: IngredientService,
    private productServ: ProductsService,
  ) {
   this.ingSub = this.ingsSrv.getIngredients({}, environment.LOC).subscribe()
    this.productSub = this.productServ.getProducts(environment.LOC).subscribe()
  }

  ngOnDestroy(): void {
      if(this.ingSub){
        this.ingSub.unsubscribe()
      }
      if(this.productSub){
        this.productSub.unsubscribe()
      }
  }

}
