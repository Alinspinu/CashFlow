import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ing, Inventary } from '../../models/inventary.model';
import { InventaryService } from './inventary.service';
import { formatedDateToShow, round } from '../../shared/utils/functions';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { SelectInvPage } from './select-inv/select-inv.page';
import { SpinnerPage } from '../../modals/spinner/spinner.page';
import { CapitalizePipe } from '../../shared/utils/capitalize.pipe';
import { showToast } from 'src/app/shared/utils/toast-controller';

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

  diferenceTotal: number = 0

  isLoading: boolean = false
  allIngs!: ing[]

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

  searchIngredient(ev: any){
      const searchQuery = ev.detail.value.toLowerCase()
      this.ingredients = this.allIngs.filter((obj: ing) => obj.name.toLowerCase().includes(searchQuery))
  }


  onSelectGestiune(event: any){
    this.filter.gestiune = event.detail.value
    this.ingredients = [...this.allIngs]
    this.filterIngredients()
  }

  onSelectDep(event: any){
    this.filter.dep = event.detail.value
    this.ingredients = [...this.allIngs]
    this.filterIngredients()
  }



  filterIngredients(){
    if(this.filter.dep !== ''){
      const ings = this.ingredients.filter((ing: any) => ing.dep === this.filter.dep)
      this.ingredients = [...ings]
    }
    if(this.filter.gestiune !== ''){
      const ings = this.ingredients.filter((ing: any) => ing.gestiune === this.filter.gestiune)
      this.ingredients = [...ings]
    }
  }




  roundInHtml(num: number){
    return round(num)
  }




}
