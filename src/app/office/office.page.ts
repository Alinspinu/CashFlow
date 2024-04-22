import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, inject, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ProductsPage } from './products/products.page';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { ProductsService } from './products/products.service';
import { IngredientService } from './ingredient/ingredient.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'office.page.html',
  styleUrls: ['office.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ProductsPage]
})
export class OfficePage implements OnDestroy {
  public environmentInjector = inject(EnvironmentInjector);

  private productSub!: Subscription;
  private ingSub!: Subscription;

  constructor(
    private productsSrv: ProductsService,
    private ingSrv: IngredientService,
  ) {
      this.productSub =  this.productsSrv.getProducts(environment.LOC).subscribe()
      this.ingSub = this.ingSrv.getIngredients(environment.LOC).subscribe()
  }

  ngOnDestroy(): void {
    if(this.productSub){
      this.productSub.unsubscribe()
    }
    if(this.ingSub){
      this.ingSub.unsubscribe()
    }
  }

}
