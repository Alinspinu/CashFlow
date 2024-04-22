
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import User from './auth/user.model';
import { ContentService } from './content/content.service';
import { WebRTCService } from './content/webRTC.service';
import { OrderAppViewPage } from './modals/order-app-view/order-app-view.page';
import { NirService } from './office/CRUD/nir/nir.service';
import { IngredientService } from './office/ingredient/ingredient.service';
import { ProductsService } from './office/products/products.service';
import { ActionSheetService } from './shared/action-sheet.service';
import { TablesService } from './tables/tables.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']

})
export class AppComponent implements OnInit, OnDestroy {

  user!: User


  private contentSub!: Subscription;


  constructor(
    private contService: ContentService,
    private tablesService: TablesService,

    private router: Router,
    private nirService: NirService,
    @Inject(ActionSheetService) private actSrv: ActionSheetService,
    private webRTC: WebRTCService
    ) {}


    getUser(){
      Preferences.get({key: 'authData'}).then(data  => {
        if(data.value) {
         this.user = JSON.parse(data.value)
        this.contentSub = this.contService.getData(this.user.locatie).subscribe()
        this.tablesService.getTables(this.user.locatie, this.user._id)
        //  this.getIncommingOrders()
        //  this.tablesService.getOrderMessage(this.user.locatie, this.user._id)
        } else{
          this.router.navigateByUrl('/auth')
        }
      })
    }


    getIncommingOrders(){
      this.webRTC.getOdrerIdObservable().subscribe(order => {
        if(order){
          const parsedOrder = JSON.parse(order)
          this.actSrv.openPayment(OrderAppViewPage, parsedOrder)
        }
      })
    }


  ngOnInit(): void {
   this.getUser()

  }

  ngOnDestroy(): void {
      if(this.contentSub){
        this.contentSub.unsubscribe()
      }
  }



}
