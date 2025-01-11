import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { formatedDateToShow, round } from 'src/app/shared/utils/functions';


@Component({
  selector: 'app-entry-view',
  templateUrl: './entry-view.page.html',
  styleUrls: ['./entry-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EntryViewPage implements OnInit {
  entries!: any[]
  total: number = 0

ingMode: boolean = false

ingEntries!: any[]

  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController
  ) { }



  ngOnInit() {
  const sub = this.navPar.get('sub')
  const data =  this.navPar.get('options')
  if(sub){
    this.ingMode = true
    this.ingEntries = data.entries
  } else {
    this.entries = data.entries
  }
  this.total = data.total
  }


  close(){
    this.modalCtrl.dismiss()
  }

formateDate(date: string){
  return formatedDateToShow(date).split('ora')[0]
}

roundH(num: number){
  return round(num)
}

}
