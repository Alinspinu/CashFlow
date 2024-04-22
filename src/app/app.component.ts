
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import User from './auth/user.model';
import { ContentService } from './content/content.service';
import { CashRegisterService } from './office/cash-register/cash-register.service';
import { IngredientService } from './office/ingredient/ingredient.service';
import { ProductsService } from './office/products/products.service';
import { TablesService } from './tables/tables.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']

})
export class AppComponent implements OnInit, OnDestroy {

  user!: User

  private contSub!: Subscription

  constructor(
    private contService: ContentService,
    private tablesService: TablesService,
    private cashReg: CashRegisterService,
    private router: Router,
    ) {}


    getUser(){
      Preferences.get({key: 'authData'}).then(data  => {
        if(data.value) {
         this.user = JSON.parse(data.value)
         this.contSub = this.contService.getData(this.user.locatie).subscribe()
         this.tablesService.getTables(this.user.locatie, this.user._id)
         this.cashReg.getDocuments(1, this.user.locatie).subscribe()

        //  this.tablesService.getOrderMessage(this.user.locatie, this.user._id)
        } else{
          this.router.navigateByUrl('/auth')
        }
      })
    }

  ngOnInit(): void {
   this.getUser()

  }

  ngOnDestroy(): void {
      if(this.contSub){
        this.contSub.unsubscribe()
      }
  }



}
