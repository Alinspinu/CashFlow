import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { SuplierPage } from 'src/app/office/CRUD/suplier/suplier.page';
import { Suplier } from 'src/app/models/suplier.model';

@Component({
  selector: 'app-select-data',
  templateUrl: './select-data.page.html',
  styleUrls: ['./select-data.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SelectDataPage implements OnInit {

  title: string = '';
  searchPlaceholder: string = 'Caută'
  choise: string[] = []
  mode!: string;
  showAdd: boolean = false

  selectedValue!: string

  data: string[] = []
  users: any[] = []
  dataa: string[] = []
  userss: any[] = []


  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    @Inject(ActionSheetService) private actionSht: ActionSheetService
  ) { }

  ngOnInit() {
    this.getData()
  }


   async addSuplier(){
    const suplier = await this.actionSht.openModal(SuplierPage, true, false) as Suplier
   if(suplier){
    this.modalCtrl.dismiss(suplier.name)
   }
  }

  getData(){
   this.mode = this.navParams.get('mode')
   console.log(this.mode)
   if(this.mode === 'bonus'){
   const names = this.navParams.get('options')
    names.forEach((name: any) => {
      const user = {
        name: name,
        checked: false
      }
      this.users.push(user)
    })
    this.userss = this.users
    this.title = 'Utilizatori'
   } else {
    this.dataa = this.navParams.get('options')
    this.data = this.dataa
   }
   if(this.mode === 'supliers'){
      this.showAdd = true
      this.title = 'Furnizori'
   }

  }

  searchData(ev: any){
    const input = ev.detail.value
    if(this.mode === 'bonus'){
      this.users = this.userss.filter(user => user.name.toLowerCase().includes(input.toLowerCase()))
    } else {
      this.data = this.dataa.filter(name => name.toLowerCase().includes(input.toLowerCase()))
    }
  }

  onChange(ev: any, user: any){
    if(ev.detail.checked){
      user.checked = true
      const index = this.userss.findIndex(usr => usr.name === user.name)
      this.userss[index].checked = true
      this.choise.push(user.name)
    } else {
      const index = this.choise.findIndex(str => str = user.name)
      this.choise.splice(index, 1)
    }
  }

  onSubmit(){
    if(this.mode === 'bonus'){
      this.modalCtrl.dismiss(this.choise)
    } else{
      this.modalCtrl.dismiss(this.selectedValue)
    }
  }

  close(){
    this.modalCtrl.dismiss(null)
  }
}
