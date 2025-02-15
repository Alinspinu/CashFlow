
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import User from './auth/user.model';
import { ContentService } from './content/content.service';
import { WebRTCService } from './content/webRTC.service';
import { TablesService } from './tables/tables.service';
import { Subscription } from 'rxjs';
import { MenuController, NavController } from '@ionic/angular'
import { CashControlService } from './cash-control/cash-control.service';
import { UsersService } from './office/users/users.service';
import { SupliersService } from './office/supliers/supliers.service';
import { EService } from './office/e-factura/e-factura.service';
import { ProductsService } from './office/products/products.service';
import { NirsService } from './office/nirs/nirs.service';
import { IngredientService } from './office/ingredient/ingredient.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']

})
export class AppComponent implements OnInit, OnDestroy {

  user!: User


  public firstPages = [
    { title: 'Vanzare', url: '/tables', icon: '../assets/icon/cash-register.svg', show: false },
  ];

  public secondPages = [

    { title: 'Setări', url: '/config', icon: '../assets/icon/settings.svg', show: false  },
    { title: 'Log Out', url: '/auth', icon: '../assets/icon/log-out-outline.svg', show: false  }
  ]

  public cashControlPages = [
    {name: 'Încasări', url: '/sales', icon: '../../assets/icon/cash-register.svg', show: false},
    {name: 'Comenzi', url: '/orders', icon: '../../assets/icon/document.svg', show: false},
    {name: 'Produse', url: '/products', icon: '../../assets/icon/foood.svg', show: false},
  ]

  public reportsPages = [
    {name: 'Inventar', url: '/reports/inventary', icon: '../../assets/icon/cash-register.svg', show: false},
    {name: 'Situație financiară', url: '/reports/finance', icon: '../../assets/icon/document.svg', show: false},
    {name: 'Produse', url: '/reports/products', icon: '../../assets/icon/foood.svg', show: false},
  ]

  public officePages = [
    {name: 'Produse', url: '/office/products', icon: '../../assets/icon/fast-food-outline.svg', show: false},
    {name: 'Materii Prime', url: '/office/ingredient',icon: '../../assets/icon/plant.svg', show: false},
    {name: 'Documente', url: '/office/nirs', icon: '../../assets/icon/document.svg', show: false},
    {name: 'Registru de Casă', url: '/office/cash-register', icon: '../../assets/icon/business.svg', show: false},
    {name: 'Program', url: '/shedule', icon: '../assets/icon/shedule.svg', show: false  },
    {name: 'Pontaj', url: '/pontaj', icon: '../assets/icon/time.svg', show: false  },
    {name: 'Utilizatori',  url: '/office/users', icon: '../../assets/icon/man.svg', show: false},
  ];

  public subMenuPages = [
    { title: 'Casă', url: '/cash-control', icon: '../assets/icon/home-outline.svg', show: false, pages: this.cashControlPages},
    { title: 'Office', url: '/office', icon: '../assets/icon/office-worker.svg', show: false, pages: this.officePages },
    { title: 'Rapoarte', url: '/reports', icon: '../assets/icon/line.svg', show: false, pages: this.reportsPages },
  ]

  private contentSub!: Subscription;
  officeMenu = false;
  reportsMenu = false;


  constructor(
    private contService: ContentService,
    private tablesService: TablesService,
    private eSerice: EService,
    private supliersService: SupliersService,
    private webRTC: WebRTCService,
    private userSrv: UsersService,
    private cashCtrlSrv: CashControlService,
    private productsSrv: ProductsService,
    private nirsSrv: NirsService,
    private ingSrv: IngredientService,
    private cashSrv: CashControlService,
    @Inject(MenuController) private menuCtrl: MenuController,
    private navCtrl: NavController
    ) {}





    toggleSubMenu(p: any) {

      if(p.show){
        p.show = false
      } else {
        this.resteSubPages()
        p.show = true
      }
    }

    selectPage(p: any, main: any = undefined){
      this.resteSubPages()
      if(main) main.show = true
      p.show = true
      this.navCtrl.navigateForward(p.url).then(() => {
        this.menuCtrl.close()
      })
    }

    resteSubPages(){
      this.cashControlPages.forEach(p => p.show = false)
      this.reportsPages.forEach(p => p.show = false)
      this.subMenuPages.forEach(p => p.show = false)
      this.secondPages.forEach(p => p.show = false)
      this.firstPages.forEach(p => p.show = false)
      this.officePages.forEach(p => p.show = false)
    }



    closeMenu(){
      this.menuCtrl.close('start');
    }

    getUser(){
      Preferences.get({key: 'authData'}).then(data  => {
        if(data.value) {
        this.user = JSON.parse(data.value)
        this.cashSrv.getAllorders(undefined, undefined, undefined).subscribe()
        this.supliersService.getSupliers().subscribe()
        this.contentSub = this.contService.getData(this.user.locatie).subscribe()
        this.tablesService.getTables(this.user.locatie, this.user._id)
        this.userSrv.getUsers().subscribe()
        this.eSerice.getMessages(5).subscribe()
        this.productsSrv.getProducts().subscribe()
        this.nirsSrv.getNirs().subscribe()
        this.ingSrv.getAllIngredients().subscribe()
        this.userSrv.getUsers().subscribe()
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
