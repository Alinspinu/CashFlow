import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductsPage } from './products/products.page';
import { FinancePage } from './finance/finance.page';
import { InventaryPage } from './inventary/inventary.page';
import { MenuController } from '@ionic/angular';



@Component({
  selector: 'app-reports',
  templateUrl: 'reports.page.html',
  styleUrls: ['reports.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    ProductsPage,
    FinancePage,
    InventaryPage
  ],
})




export class ReportsPage implements OnInit {

  menuOpen: boolean = false

  screenWidth!: number




  appPages: any = [
    {name: 'Inventar', icon: '../../assets/icon/cash-register.svg', show: true},
    {name: 'Situație financiară', icon: '../../assets/icon/document.svg', show: false},
    {name: 'Produse', icon: '../../assets/icon/foood.svg', show: false},
  ]

  constructor(
      @Inject(MenuController) private menuCtrl: MenuController
  ) {
    this.screenWidth = window.innerWidth
  }


  ngOnInit(): void {
      this.menuChange()
  }

  selectPage(page: string){
    const index = this.appPages.findIndex((p:any) => p.name == page)
    this.appPages = this.appPages.map((p:any) => ({...p, show: false}))
    this.appPages[index].show = true
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
}
