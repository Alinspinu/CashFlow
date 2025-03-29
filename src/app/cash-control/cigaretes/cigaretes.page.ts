import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { ProductsService } from 'src/app/office/products/products.service';
import { cigarsInv } from 'src/app/models/inventary.model';
import { emptyCigaretsInv } from 'src/app/models/empty-models';
import { CashControlService } from '../cash-control.service';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { Bill } from 'src/app/models/table.model';


@Component({
  selector: 'app-cigaretes',
  templateUrl: './cigaretes.page.html',
  styleUrls: ['./cigaretes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CigaretesPage implements OnInit {

  orders: Bill[] = []

  menuOpen: boolean = false


  sheet: cigarsInv = emptyCigaretsInv()
  lastSheet: cigarsInv = emptyCigaretsInv()
  constructor(
    private menuCtrl: MenuController,
    private productsService: ProductsService,
    private cashService: CashControlService,
    private toastCtrl: ToastController,
    @Inject(ActionSheetService) private actionService: ActionSheetService
  ) { }

  ngOnInit() {
    this.menuChange()
    setTimeout(() => {
      this.getInvs()
    }, 800)
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


  async modifyFound(p: any){
    const value = await  this.actionService.numberAlert('Modifică cantitatea', `Scrie căte pachete de ${p.name} ai găsit!`, 'val', 'Cantitate')
    if(value){
      p.found = +value
    }
  }

  async modifyFinal(p: any){
    let productIn = p.in ? p.in : 0
    const value = await  this.actionService.numberAlert('Modifică cantitatea', `Scrie căte pachete de ${p.name} au rămas in stoc!`, 'val', 'Cantitate')
    if(value){
      p.second = +value
      if(p.second === p.found-p.sale + productIn){
        p.valid = true
      } else {
        p.valid = false
      }
      const index = this.sheet.products.findIndex(p => !p.valid)
      if(index !== -1){
        this.sheet.valid = false
      } else {
        this.sheet.valid = true
      }
    }
  }

  async modifyIn(p: any) {
    const value = await  this.actionService.numberAlert('Adaugă intrări', `Scrie căte pachete de ${p.name} au intrat!`, 'val', 'Cantitate')
    if(value){
      p.in = +value
    }
  }


  getSales(){
      this.cashService.ordersSend$.subscribe({
      next: (ord) => {
       for(let product of this.sheet.products){
          product.sale = 0
       }
        const orders: any = ord.filter(o => {
          const orderDate = new Date(o.updatedAt).getTime()
          const sheetDate = new Date(this.sheet.date).getTime()
          return orderDate > sheetDate
        })
        for(let order of orders){
          for(let product of order.products){
            for(let sheetp of this.sheet.products){
              const smoke = product.ings.find((i: any) => i.ing === sheetp.ing)
              if(smoke){
                sheetp.sale += product.quantity
              }
            }
          }
        }
        for(let p of this.sheet.products){
         if(p.second === p.found-p.sale) p.valid = true
        }
      }
    })
  }

  getProducts(){
   const products = this.productsService.getCigarets()
    for(let product of products){
      for(let sub of product.subProducts){
        const ing = sub.ings[0].ing
        console.log(ing)
        const sheetProduct = this.sheet.products.find(p => p.ing === ing._id);
        if(!sheetProduct){
          const product = {
            name: ing.name,
            first: ing.qty,
            found: ing.qty,
            second: 0,
            sale: 0,
            in: 0,
            valid: false,
            ing: ing._id
          }
          this.sheet.products.push(product)
        }
      }
    }
    // this.sheet.products.sort((a, b) => b.name.localeCompare(a.name))
  }

  saveInv(){
    this.sheet.valid = true
    this.cashService.saveCigInv(this.sheet).subscribe({
      next: (response) => {
        this.sheet = response.second
        this.lastSheet = response.first
        showToast(this.toastCtrl, response.message, 3000)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  getInvs(){

    this.cashService.getLastCigInv().subscribe({
      next: (response) => {
        const last = response.find(s => s.valid)
        const first = response.find(s => !s.valid)
        if(first){
          this.sheet = first
          this.getProducts()
          this.getSales()
        }
        if(last) this.lastSheet = last
      }
    })
  }

  formatDate(date: any) {
    return formatedDateToShow(date)
  }

}
