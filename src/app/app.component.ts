
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
import { SalePointService } from './office/sale-point/sale-point.service';
import { SalePoint } from './models/sale-point';
import { CashRegisterService } from './office/cash-register/cash-register.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']

})
export class AppComponent implements OnInit, OnDestroy {

  user!: User
  pointName: string = ''


  public firstPages = [
    { title: 'Vanzare', url: '/tables', icon: '../assets/icon/cash-register.svg', show: false },
  ];

  public secondPages = [
    { title: 'Log Out', url: '/auth', icon: '../assets/icon/log-out-outline.svg', show: false  }
  ]

  public cashControlPages = [
    {name: 'Încasări', url: '/sales', icon: '../../assets/icon/cash-register.svg', show: false},
    {name: 'Comenzi', url: '/orders', icon: '../../assets/icon/document.svg', show: false},
    {name: 'Țigări', url: '/cigaretes', icon: '../../assets/icon/smoking.svg', show: false},
  ]

  public reportsPages = [
    {name: 'Inventar', url: '/reports/inventary', icon: '../../assets/icon/cash-register.svg', show: false},
    {name: 'Situație financiară', url: '/reports/finance', icon: '../../assets/icon/document.svg', show: false},
    {name: 'Produse', url: '/reports/products', icon: '../assets/icon/fast-food-outline.svg', show: false},
  ]

  public officePages = [
    {name: 'Produse', url: '/office/products', icon: '../assets/icon/fast-food-outline.svg', show: false},
    {name: 'Materii Prime', url: '/office/ingredient',icon: '../../assets/icon/plant.svg', show: false},
    {name: 'Documente', url: '/office/nirs', icon: '../../assets/icon/document.svg', show: false},
    {name: 'Furnizori', url: '/office/supliers', icon: '../../assets/icon/supliers.svg', show: false},
    {name: 'Registru de Casă', url: '/office/cash-register', icon: '../../assets/icon/business.svg', show: false},
    {name: 'Program', url: '/shedule', icon: '../assets/icon/shedule.svg', show: false  },
    {name: 'Pontaj', url: '/pontaj', icon: '../assets/icon/time.svg', show: false  },
    {name: 'Utilizatori',  url: '/office/users', icon: '../../assets/icon/man.svg', show: false},
  ];


  public configPages = [
    { name: 'Email', url: '/email', icon: '../assets/icon/email.svg', show: false},
    { name: 'Viva', url: '/viva', icon: '../assets/icon/euro.svg', show: false},
    { name: 'Print', url: '/print', icon: '../assets/icon/print-outline.svg', show: false},
    { name: 'Sale Point', url: '/point', icon: '../assets/icon/print-outline.svg', show: false},
  ]

  public subMenuPages = [
    { title: 'Casă', url: '/cash-control', icon: '../assets/icon/home-outline.svg', show: false, pages: this.cashControlPages},
    { title: 'Office', url: '/office', icon: '../assets/icon/office-worker.svg', show: false, pages: this.officePages },
    { title: 'Rapoarte', url: '/reports', icon: '../assets/icon/line.svg', show: false, pages: this.reportsPages },
    { title: 'Setări', url: '/config', icon: '../assets/icon/settings.svg', show: false, pages: this.configPages  },
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
    private productsSrv: ProductsService,
    private nirsSrv: NirsService,
    private ingSrv: IngredientService,
    private cashSrv: CashControlService,
    @Inject(MenuController) private menuCtrl: MenuController,
    private navCtrl: NavController,
    private pointService: SalePointService,
    private cashRegService: CashRegisterService,
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
      this.configPages.forEach(p => p.show = false)
      this.firstPages.forEach(p => p.show = false)
      this.officePages.forEach(p => p.show = false)
    }



    closeMenu(){
      this.menuCtrl.close('start');
    }

    getUser(){
      this.pointService.getUnAuthPoints().subscribe({
        next: (res) => {
          this.getPointFromLocal(res[0])
          this.getPoint()
        }
      })
      Preferences.get({key: 'authData'}).then(data  => {
        if(data.value) {
        this.user = JSON.parse(data.value)
        this.cashSrv.getAllorders(undefined, undefined, undefined).subscribe()
        this.supliersService.getSupliers().subscribe()
        this.tablesService.getTables(this.user.locatie, this.user._id)
        this.userSrv.getUsers().subscribe()
        this.eSerice.getMessages(5).subscribe()
        this.userSrv.getUsers().subscribe()
        this.getUpdatedOrder()
        this.removeLive()
        this.getDelProduct()
     
        }
      })
    } 


    async getPointFromLocal(p: SalePoint){
      const data = await Preferences.get({key: 'point'})
      if(data && data.value){
        const point = JSON.parse(data.value)
          this.pointService.actvatePoint(point)
      } else {
          this.pointService.actvatePoint(p) 
      }
    }

    getPoint(){
      this.pointService.pointSend$.subscribe({
        next: (p) => {
          this.pointName = p.name
          if(p._id){
            this.ingSrv.getAllIngredients(p._id).subscribe()
            this.nirsSrv.getNirs(p._id).subscribe()
            this.contentSub = this.contService.getData(p._id).subscribe()
            this.productsSrv.getProducts(p._id).subscribe()
            this.cashRegService.getDocuments(p._id).subscribe()
          }
        
        }
      })
    }




    getUpdatedOrder(){
      this.webRTC.getUpdatedOrderObservable().subscribe(order => {
        if(order){
          const parsedOrder = JSON.parse(order)
          setTimeout(() => {
            this.tablesService.updateOrder(parsedOrder)
            // this.cashCtrlSrv.addUpdateOrders(parsedOrder)
          }, 800)
        }
      })
    }

    getDelProduct(){
      this.webRTC.getDelProduct().subscribe({
        next: (product) => {
          const parsedProduct = JSON.parse(product)
          this.cashSrv.addDelProduct(parsedProduct)
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



    setSalePoint(){

    }



}
