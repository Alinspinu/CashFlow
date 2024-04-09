
import { Component,  Inject,  OnInit } from '@angular/core';
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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']

})
export class AppComponent implements OnInit {

  user!: User

  constructor(
    private contService: ContentService,
    private tablesService: TablesService,
    private productsSrv: ProductsService,
    private ingSrv: IngredientService,
    private router: Router,
    private nirService: NirService,
    @Inject(ActionSheetService) private actSrv: ActionSheetService,
    private webRTC: WebRTCService
    ) {}


    getUser(){
      Preferences.get({key: 'authData'}).then(data  => {
        if(data.value) {
        this.user = JSON.parse(data.value)
         this.contService.getData(this.user.locatie).subscribe()
         this.tablesService.getTables(this.user.locatie, this.user._id)
         this.productsSrv.getProducts(this.user.locatie).subscribe()
        //  console.log('hit')
         this.ingSrv.getIngredients(this.user.locatie).subscribe()
         this.getIncommingOrders()
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
          console.log(parsedOrder)
        }
      })
    }


  ngOnInit(): void {
   this.getUser()

  }



}
