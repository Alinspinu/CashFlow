import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, inject, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ProductsPage } from './products/products.page';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { ProductsService } from './products/products.service';
import { IngredientService } from './ingredient/ingredient.service';
import { AuthService } from '../auth/auth.service';
import User from '../auth/user.model';



@Component({
  selector: 'app-tab2',
  templateUrl: 'office.page.html',
  styleUrls: ['office.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ProductsPage]
})
export class OfficePage implements OnInit, OnDestroy {
  public environmentInjector = inject(EnvironmentInjector);

  private productSub!: Subscription;
  private ingSub!: Subscription;
   user!: User
  private userSub!: Subscription

  constructor(
    private productsSrv: ProductsService,
    private ingSrv: IngredientService,
    private authSrv: AuthService
  ) {
  }

  ngOnInit(): void {
    this.getUser()
    this.productSub =  this.productsSrv.getProducts(environment.LOC).subscribe()
    this.ingSub = this.ingSrv.getIngredients(environment.LOC).subscribe()
  }


  getUser(){
    this.userSub = this.authSrv.user$.subscribe(response => {
      if(response){
        this.userSub = response.subscribe(user => {
          if(user){
            this.user = user;
          }
        })
      }
    })
    }

  ngOnDestroy(): void {
    if(this.productSub){
      this.productSub.unsubscribe()
    }
    if(this.ingSub){
      this.ingSub.unsubscribe()
    }

    if(this.userSub){
      this.userSub.unsubscribe()
    }
  }

}
