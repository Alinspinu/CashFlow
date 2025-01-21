import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CashControlService } from '../cash-control.service';
import { Bill, BillProduct } from 'src/app/models/table.model';
import { getProducts, section } from '../cash-control-engine';
import { formatOrderDateOne, modifyImageURL } from 'src/app/shared/utils/functions';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProductsPage implements OnInit, OnChanges {

  products: BillProduct[] = []
  allProducts: BillProduct[] = []
  openProducts: BillProduct[] = []
  sections: section[] = []
  productSearch!: string

  headeLabel: string = 'Încasat'


     @Input() data: Bill[] = []
     @Output() date: EventEmitter<string> = new EventEmitter();

  constructor(
    private cashService: CashControlService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private cashSrv: CashControlService,
  ) { }

  ngOnInit() {
    this.getOrders()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      const parsedData = getProducts(this.data)
      this.products = parsedData.products
      this.allProducts = parsedData.products
      this.sections = parsedData.sections
      this.openProducts = parsedData.openProducts
      this.headeLabel = 'Încasat'
    }
  }

  getOrders(){
    this.cashService.ordersSend$.subscribe({
      next: (response) => {
        const parsedData = getProducts(response)
        this.products = parsedData.products
        this.allProducts = parsedData.products
        this.sections = parsedData.sections
        this.openProducts = parsedData.openProducts
        this.headeLabel = 'Încasat'

      }
    })
  }

  searchProduct(ev: any){
    this.productSearch = ev.target.value;
    this.products = this.allProducts.filter(p => p.name.toLowerCase().includes(this.productSearch.toLowerCase()));
  }

  async selectDate(day: boolean){
    if(day) {
      const day = await this.actionSheet.openAuth(DatePickerPage)
      this.cashSrv.getAllorders(day, undefined, undefined).subscribe()
      this.date.emit(`${formatOrderDateOne(day)}`)
    } else {
      const stDate = await this.actionSheet.openPayment(DatePickerPage, 'ALEGE ZIUA DE ÎNCEPUT')
      if(stDate){
        const enDate = await this.actionSheet.openPayment(DatePickerPage, 'ALEGE ZIUA DE SFÂRȘIT')
        this.cashSrv.getAllorders(undefined, stDate, enDate).subscribe()
        this.date.emit(`${formatOrderDateOne(stDate)} - ${formatOrderDateOne(enDate)}`)
      }
    }
  }


  selectProducts(section: string){
    if(section === 'Deschise'){
      this.products = this.openProducts
      this.headeLabel = "Potențial"
    } else {
      this.products = this.allProducts.filter(p => p.section === section)
      this.headeLabel = 'Încasat'

    }
  }


modifyImage(url: string){
  return modifyImageURL(url)
}

}
