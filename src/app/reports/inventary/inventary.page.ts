import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ing, Inventary } from '../../models/inventary.model';
import { InventaryService } from './inventary.service';
import { formatedDateToShow, round } from '../../shared/utils/functions';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { SelectInvPage } from './select-inv/select-inv.page';
import { SpinnerPage } from '../../modals/spinner/spinner.page';

@Component({
  selector: 'app-inventary',
  templateUrl: './inventary.page.html',
  styleUrls: ['./inventary.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SpinnerPage]
})
export class InventaryPage implements OnInit {

  inventary!: Inventary;
  ingredientSearch!: string;

  ingredients!: ing[]
  screenWidth!: number

  diferenceTotal: number = 0

  isLoading: boolean = false

  constructor(
    private invService: InventaryService,
    @Inject(ActionSheetService) private actService: ActionSheetService,

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

  async selectInventary(){
    if(this.screenWidth > 500){
      const inventary = await this.actService.openPayment(SelectInvPage, '')
      this.editInventary(inventary)
    } else{
      const inventary = await this.actService.openMobileModal(SelectInvPage, '', false)
      this.editInventary(inventary)
    }

  }

  editInventary(inv: Inventary){
    this.inventary = inv
    this.ingredients = this.inventary.ingredients
    this.ingredients.sort((a, b) => a.name.localeCompare(b.name));
    this.inventary.date = formatedDateToShow(inv.date).split('ora')[0]
    this.isLoading = false
    inv.ingredients.forEach(ing => {
      this.diferenceTotal += round((ing.scriptic - ing.faptic) * ing.ing.price)
    })
  }

  searchIngredient(ev: any){
      const searchQuery = ev.detail.value.toLowerCase()
      this.ingredients = this.inventary.ingredients.filter((obj: ing) => obj.name.toLowerCase().includes(searchQuery))
  }

  roundInHtml(num: number){
    return round(num)
  }

}
