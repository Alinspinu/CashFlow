
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import User from './auth/user.model';
import { ContentService } from './content/content.service';
import { WebRTCService } from './content/webRTC.service';
import { ActionSheetService } from './shared/action-sheet.service';
import { TablesService } from './tables/tables.service';
import { Subscription } from 'rxjs';
import { MenuController } from '@ionic/angular'
import { CashControlService } from './cash-control/cash-control.service';
import { UsersService } from './office/users/users.service';
import { SupliersService } from './office/supliers/supliers.service';
import { EService } from './office/e-factura/e-factura.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']

})
export class AppComponent implements OnInit, OnDestroy {

  user!: User


  public appPages = [
    { title: 'Vanzare', url: '/tables', icon: '../assets/icon/cash-register.svg' },
    { title: 'Casă', url: '/cash-control', icon: '../assets/icon/home-outline.svg' },
    { title: 'Office', url: '/office', icon: '../assets/icon/office-worker.svg' },
    { title: 'Rapoarte', url: '/reports', icon: '../assets/icon/line.svg' },
    { title: 'Program', url: '/shedule', icon: '../assets/icon/shedule.svg' },
    { title: 'Pontaj', url: '/pontaj', icon: '../assets/icon/time.svg' },
    { title: 'Setări', url: '/config', icon: '../assets/icon/settings.svg' },
    { title: 'Log Out', url: '/auth', icon: '../assets/icon/log-out-outline.svg' }
  ];


  private contentSub!: Subscription;


  constructor(
    private contService: ContentService,
    private tablesService: TablesService,
    private eSerice: EService,
    @Inject(ActionSheetService) private actSrv: ActionSheetService,
    private supliersService: SupliersService,
    private webRTC: WebRTCService,
    private userSrv: UsersService,
    private cashCtrlSrv: CashControlService,
    @Inject(MenuController) private menuCtrl: MenuController
    ) {}


    closeMenu(){
      this.menuCtrl.close('start');
    }

    getUser(){
      Preferences.get({key: 'authData'}).then(data  => {
        if(data.value) {
         this.user = JSON.parse(data.value)
         this.supliersService.getSupliers().subscribe()
        this.contentSub = this.contService.getData(this.user.locatie).subscribe()
        this.tablesService.getTables(this.user.locatie, this.user._id)
        this.userSrv.getUsers().subscribe()
        this.eSerice.getMessages(5).subscribe()
         this.getUpdatedOrder()
         this.removeLive()
         this.getDelProduct()
        }
      })
    }




    getUpdatedOrder(){
      this.webRTC.getUpdatedOrderObservable().subscribe(order => {
        if(order){
          const parsedOrder = JSON.parse(order)
          setTimeout(() => {
            this.tablesService.updateOrder(parsedOrder)
            this.cashCtrlSrv.addUpdateOrders(parsedOrder)
          }, 800)
        }
      })
    }

    getDelProduct(){
      this.webRTC.getDelProduct().subscribe({
        next: (product) => {
          const parsedProduct = JSON.parse(product)
          this.cashCtrlSrv.addDelProduct(parsedProduct)
          console.log(parsedProduct)
        },
        error: (error) => {
          console.log(error)
        }
      })
    }


    removeLive(){
      this.webRTC.getTableBillIdObservable().subscribe(response => {
        if(response) {
          const pasedData = JSON.parse(response)
          this.tablesService.removeLive(pasedData.number, pasedData.id)
        }
      })
    }

    getThemeStatus(){
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.toggleTheme(prefersDark.matches);
      prefersDark.addListener((mediaQuery) => this.toggleTheme(mediaQuery.matches));
    }

    toggleTheme(isDarkMode: boolean) {
      document.body.classList.toggle('dark-theme', isDarkMode);
      document.body.classList.toggle('light-theme', !isDarkMode);
    }

    ngOnInit(): void {
      this.getThemeStatus()
      this.getUser()
    }

    ngOnDestroy(): void {
        if(this.contentSub){
          this.contentSub.unsubscribe()
        }
    }



}
