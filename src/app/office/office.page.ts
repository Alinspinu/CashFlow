import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, inject, OnInit, OnDestroy, Inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ProductsService } from './products/products.service';
import { IngredientService } from './ingredient/ingredient.service';
import { AuthService } from '../auth/auth.service';
import User from '../auth/user.model';
import { UsersService } from './users/users.service';
import { NirsService } from './nirs/nirs.service';
import { MenuController } from '@ionic/angular';
import { CashRegisterPage } from './cash-register/cash-register.page';
import { EFacturaPage } from './e-factura/e-factura.page';
import { ImpPage } from './imp/imp.page';
import { IngredientPage } from './ingredient/ingredient.page';
import { NirsPage } from './nirs/nirs.page';
import { ProductsPage } from './products/products.page';
import { UsersPage } from './users/users.page';
import { SuplierService } from '../../../../../timeout/src/app/office/CRUD/suplier/suplier.service';



@Component({
  selector: 'app-tab2',
  templateUrl: 'office.page.html',
  styleUrls: ['office.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, CashRegisterPage, EFacturaPage, ImpPage, IngredientPage, NirsPage, ProductsPage, UsersPage]
})
export class OfficePage implements OnInit, OnDestroy {
  public environmentInjector = inject(EnvironmentInjector);

  private productSub!: Subscription;
  private ingSub!: Subscription;
   user!: User
  private userSub!: Subscription
  screenWidth!: number
  menuOpen: boolean = false
  isDarkMode: boolean = false


  public appPages = [
    {name: 'Produse', icon: '../../assets/icon/fast-food-outline.svg', show: false},
    {name: 'Materii Prime', icon: '../../assets/icon/plant.svg', show: false},
    {name: 'Deprecieri', icon: '../../assets/icon/tools.svg', show: false},
    {name: 'Nir', icon: '../../assets/icon/document.svg', show: true},
    {name: 'E-Factura', icon: '../../assets/icon/cloud-outline.svg', show: false},
    {name: 'Registru de Casă', icon: '../../assets/icon/business.svg', show: false},
    {name: 'Utilizatori', icon: '../../assets/icon/man.svg', show: false},
  ];

  constructor(
    private productsSrv: ProductsService,
    private nirsSrv: NirsService,
    private ingSrv: IngredientService,
    private authSrv: AuthService,
    private userSrv: UsersService,
    @Inject(MenuController) private menuCtrl: MenuController
  ) {
    this.screenWidth = window.innerWidth
  }

  ngOnInit(): void {
    this.getThemeStatus()
    this.menuChange()
    this.getUser()
    this.productsSrv.getProducts().subscribe()
    this.nirsSrv.getNirs().subscribe()
    this.ingSub = this.ingSrv.getAllIngredients().subscribe()
    this.userSrv.getUsers().subscribe()

  }


  selectPage(page: string){
    const index = this.appPages.findIndex((p:any) => p.name == page)
    this.appPages = this.appPages.map((p:any) => ({...p, show: false}))
    this.appPages[index].show = true
}

  getUser(){
    this.userSub = this.authSrv.user$.subscribe(response => {
      if(response){
        this.user = response
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

  private async menuChange(){
    const menu = await this.menuCtrl.get('start');
    if (menu) {
      menu.addEventListener('ionDidClose', () => {
        this.menuOpen = false
      });
      menu.addEventListener('ionDidOpen', () => {
           this.menuOpen = true
      });
    }
  }

  getThemeStatus(){
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = prefersDark.matches
    prefersDark.addListener((mediaQuery) => this.toggleTheme(mediaQuery.matches))
  }
  toggleTheme(isDarkMode: boolean) {
      this.isDarkMode = isDarkMode
  }

}
