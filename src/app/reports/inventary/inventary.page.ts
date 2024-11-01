import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { CompareInv, ing, Inventary } from '../../models/inventary.model';
import { InventaryService } from './inventary.service';
import { formatedDateToShow, round } from '../../shared/utils/functions';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { SelectInvPage } from './select-inv/select-inv.page';
import { SpinnerPage } from '../../modals/spinner/spinner.page';
import { CapitalizePipe } from '../../shared/utils/capitalize.pipe';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { UploadLogPage } from './upload-log/upload-log.page';

@Component({
  selector: 'app-inventary',
  templateUrl: './inventary.page.html',
  styleUrls: ['./inventary.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SpinnerPage, CapitalizePipe]
})
export class InventaryPage implements OnInit {

  inventary!: Inventary;
  ingredientSearch!: string;

  ingredients!: ing[]
  screenWidth!: number

  compareTable!: CompareInv

  diferenceTotal: number = 0

  isLoading: boolean = false
  allIngs!: ing[]
  
  ingsComp: any[] = []
  allIngsComp: any[] = []

  mode: string = 'inventary'

  gestiuni: string[] = ["bar", "bucatarie", "magazie"]
  ingDep: string[] = ["materie", "marfa"]

  filter: {gestiune: string, dep: string} = {gestiune: '', dep: ''}

  constructor(
    private invService: InventaryService,
    @Inject(ActionSheetService) private actService: ActionSheetService,
    private toastCtrl: ToastController
  ) {
    this.screenWidth = window.innerWidth
  }

  ngOnInit() {
    this.getLastInventary()
  }

  getLastInventary(){
    this.isLoading = true
    this.invService.getInventary('last').subscribe(inv => {
        if(inv){
          console.log(inv)
          this.editInventary(inv)
        }
    })
  }




  exportInv(){
    this.invService.exportInv(this.inventary._id).subscribe(response => {
      if(response){
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Inventar ${this.inventary.date}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    })
  }


  async updateIngsQty(){
    const response = await this.actService.deleteAlert(`Ești sigur că vrei să actualizezi stocul? Cantitățile for fi modificate după inventarul din ${this.inventary.date}.`, 'ACTUALIZARE STOC DUPĂ INVENTAR')
    if(response){
      this.isLoading = true
       this.invService.updateIngQty(this.inventary._id).subscribe(response => {
        if(response){
          this.inventary = response.inv
          this.isLoading = false
          showToast(this.toastCtrl, response.message, 2000)
        }
       })
    }

  }

  async selectInventary(){
    if(this.screenWidth > 500){
      const inventary = await this.actService.openPayment(SelectInvPage, '')
      if(inventary){
        this.editInventary(inventary)
      }
    } else{
      const inventary = await this.actService.openMobileModal(SelectInvPage, '', false)
      if(inventary){
        this.editInventary(inventary)
      }
    }
  }

  async selectInventaries(){
    let start
    let end 
    const startInventary = await this.actService.openPayment(SelectInvPage, '')
    if(startInventary){
      start = startInventary.date
      const secondInventary = await this.actService.openPayment(SelectInvPage, '')
      if(secondInventary){
        end = secondInventary.date
      }
    }
    if(start && end){
      this.isLoading = true
      this.invService.compareInventary(start, end).subscribe(response => {
        this.mode = 'compare'
        this.compareTable = response.compareInv
        this.ingsComp = this.compareTable.ingredients
        this.allIngsComp = this.ingsComp
        this.ingsComp.sort((a, b) => {
          const valueA = a.saleUnload - (a.first+a.upload.value - a.second)
          const valueB = b.saleUnload - (b.first+b.upload.value - b.second)
          return valueA - valueB
        })
        // this.ingsComp.sort((a, b) => a.name.localeCompare(b.name));
        this.isLoading = false
        console.log(response)
      })
    }
  }

  async showlog(logs: any[], ingName: string, ingUm: string){
    await this.actService.openPayment(UploadLogPage, {logs, ingName, ingUm} )

  }

  editInventary(inv: Inventary){
    this.inventary = inv
    this.ingredients = this.inventary.ingredients
    this.allIngs = this.ingredients
    this.ingredients.sort((a, b) => a.name.localeCompare(b.name));
    this.inventary.date = formatedDateToShow(inv.date).split('ora')[0]
    this.isLoading = false
    this.diferenceTotal = 0
    this.ingredients.forEach(ing => {
      this.diferenceTotal += round((ing.scriptic - ing.faptic) * ing.ing.price)
    })
  }

  searchIngredient(ev: any, comp: boolean){
    if(comp){
      const searchQuery = ev.detail.value.toLowerCase()
      this.ingsComp = this.allIngsComp.filter((obj: ing) => obj.name.toLowerCase().includes(searchQuery))
    } else {
      const searchQuery = ev.detail.value.toLowerCase()
      this.ingredients = this.allIngs.filter((obj: ing) => obj.name.toLowerCase().includes(searchQuery))
    }
  }



  onSelectGestiune(event: any, comp: boolean){
    if(comp){
      this.filter.gestiune = event.detail.value
      this.ingsComp = [...this.allIngsComp]
      this.filterIngredients(true)

    } else {
      this.filter.gestiune = event.detail.value
      this.ingredients = [...this.allIngs]
      this.filterIngredients(false)
    }
  }

  onSelectDep(event: any, comp: boolean){
    if(comp){
      this.filter.dep = event.detail.value
      this.ingsComp = [...this.allIngsComp]
      this.filterIngredients(true)

    } else{
      this.filter.dep = event.detail.value
      this.ingredients = [...this.allIngs]
      this.filterIngredients(false)
    }
  }



  filterIngredients(comp: boolean){
    if(comp) {
      if(this.filter.dep !== ''){
        const ings = this.ingsComp.filter((ing: any) => ing.dep === this.filter.dep)
        this.ingsComp = [...ings]
      }
      if(this.filter.gestiune !== ''){
        const ings = this.ingsComp.filter((ing: any) => ing.gestiune === this.filter.gestiune)
        this.ingsComp = [...ings]
      }
    } else {
      if(this.filter.dep !== ''){
        const ings = this.ingredients.filter((ing: any) => ing.dep === this.filter.dep)
        this.ingredients = [...ings]
      }
      if(this.filter.gestiune !== ''){
        const ings = this.ingredients.filter((ing: any) => ing.gestiune === this.filter.gestiune)
        this.ingredients = [...ings]
      }
    }
  }

//   sort(value: string){
//     const ings = this.ingsComp.sort((a, b) => {
//       const valueA = a.saleUnload - (a.first+a.upload.value - a.second)
//       const valueB = b.saleUnload - (b.first+b.upload.value - b.second)
//       return valueA - valueB
//     })
//     this.ingsComp = [...ings]
// }




  roundInHtml(num: number){
    return round(num)
  }

  formatDate(date: string){
   return formatedDateToShow(date).split('ora')[0]
  }




}
