import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { formatedDateToShow, round } from 'src/app/shared/utils/functions';
import { IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-to-inventary',
  templateUrl: './add-to-inventary.page.html',
  styleUrls: ['./add-to-inventary.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddToInventaryPage implements OnInit {

  @ViewChild('qtyInput',{ static: false }) qtyInput!: IonInput

  ingredientInvForm!: FormGroup
  ing!: any
  date!: string
  invDayIndex!: number
  dateQty!: number

  qty!: Number

  constructor(
    private navParams: NavParams,
    private modalCtr: ModalController,
  ) { }

  ngOnInit() {
    this.getIngToedit()
    setTimeout(()=>{
      if(this.qtyInput){
        this.qtyInput.setFocus()
      }
    }, 300)
  }



getIngToedit(){
  const ing = this.navParams.get('options')
    this.ing = ing.ing
    this.date =  formatedDateToShow(ing.date)
    const invDay = this.ing.inventary.find((inv:any) => {
      return this.setDateToZero(inv.day) === this.setDateToZero(ing.date)
    })
    if(invDay){
      this.invDayIndex = invDay.index
      this.dateQty = invDay.qty ? invDay.qty : this.ing.qty
      this.qty = invDay.faptic

    }

}


saveInvIng(){
    const ingTosave = {
      qtyInv: this.qty,
      invIndex: this.invDayIndex,
      ingId: this.ing._id,
      scriptic: this.dateQty
    }
    this.modalCtr.dismiss(ingTosave)
}

cancel(){
  this.modalCtr.dismiss(null)
}


setDateToZero(date: string){
 return new Date(date).setUTCHours(0,0,0,0)
}

roundInhtml(num: number){
    return round(num)
}


}
