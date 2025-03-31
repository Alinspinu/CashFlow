import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { InvIngredient } from 'src/app/models/nir.model';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { PickQtyPage } from 'src/app/modals/pick-qty/pick-qty.page';
import { IonSearchbar } from '@ionic/angular/standalone';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { IngredientService } from '../../ingredient/ingredient.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-sheet-modal',
  templateUrl: './new-sheet-modal.page.html',
  styleUrls: ['./new-sheet-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class NewSheetModalPage implements OnInit {

    @ViewChild('searchbar') searchbar!: IonSearchbar;

    form!: FormGroup
    ingredients: any[]  = [];
    ingredientSearch!:any ;
    dbIngs!: any
    isLoading: boolean = true
    date!: string

    ingredientsToShow: any[] = []
    ingredientsToSend: any[] = []



  constructor(
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private ingSrv: IngredientService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.getIngredients()
    this.openDateModal()
  }

 async openDateModal(){
  let title = '- DATĂ FIȘĂ - ';
    const date = await this.actionSrv.openPayment(DatePickerPage, title)
    if(date){
       this.date = date
    }
  }


  getIngredients(){
    this.ingSrv.ingredientsSend$.subscribe(response => {
      if(response){
        this.dbIngs = response
        this.isLoading = false
      }
    })
  }



    searchIngredient(ev: any){
      const searchQuery = ev.detail.value.toLowerCase()
      this.ingredients = this.dbIngs.filter((obj: InvIngredient) => obj.name.toLowerCase().includes(searchQuery))
      if(searchQuery === ''){
        this.ingredients = []
      }
    }


      async selectIngredient(ing: any){
        console.log(ing)
        const data = await this.actionSrv.numberAlert('Cantitate', `Alege cantitatea pe care vrei să o scazi pentru ingredientul ${ing.name}!`, 'val', 'Cantitate')
        if(data){
          this.searchbar.setFocus()
            const ingToShow = {
              name: ing.name,
              gestiune: ing.gestiune,
              qty: +data,
              um: ing.um
            }
            const ingToSend = {
              qty: +data,
              ing: ing._id
            }
            this.ingredientsToShow.push(ingToShow)
            this.ingredientsToSend.push(ingToSend)
            this.ingredients = [];
            this.ingredientSearch = '';
        }
      }


      setIng(){
        this.selectIngredient(this.ingredients[0])
      }


      saveSheet(){
        const sheet = {
          date: this.date,
          ings: this.ingredientsToSend,
          locatie: environment.LOC
        }
        this.modalCtrl.dismiss(sheet)
      }

      close(){
        this.modalCtrl.dismiss(null)
      }

      formatDate(date: any){
        return formatedDateToShow(date).split('ora')[0]
      }


}
