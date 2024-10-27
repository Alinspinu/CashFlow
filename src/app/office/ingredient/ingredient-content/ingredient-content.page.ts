import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { formatedDateToShow, sortByDate } from 'src/app/shared/utils/functions';
import { InvIngredient } from 'src/app/models/nir.model';

@Component({
  selector: 'app-ingredient-content',
  templateUrl: './ingredient-content.page.html',
  styleUrls: ['./ingredient-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class IngredientContentPage implements OnInit {
 ing!: InvIngredient

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.ing = this.navParams.get('options')
    this.ing.uploadLog.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime(); 
});
  } 

  close(){
    this.modalCtrl.dismiss(null)
  }



  editDate(date: string){
    return formatedDateToShow(date).split('ora')[0]
  }

}
