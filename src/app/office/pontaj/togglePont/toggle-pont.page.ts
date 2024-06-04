import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Pontaj } from '../../../models/shedule.model';
import { PontajService } from '../pontaj.service';

@Component({
  selector: 'app-toggle-pont',
  templateUrl: './toggle-pont.page.html',
  styleUrls: ['./toggle-pont.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TogglePontPage implements OnInit {

  pontaj: Pontaj[] = []
  isLoading: boolean = false

  constructor(
    private modalCtrl: ModalController,
    private pontSrv: PontajService,
  ) { }

  ngOnInit() {
    this.getPont()
  }

  choisePont(shedule: Pontaj){
    this.modalCtrl.dismiss(shedule)
  }

  getPont(){
    this.pontSrv.getAllPont().subscribe(response => {
      this.pontaj = response
      console.log(response)
    })
  }

  addPontaj(){
    this.isLoading = true
    this.pontSrv.addPont(5, 2024).subscribe(response => {
      if(response){
        this.pontaj.push(response)
        this.isLoading = false
      }
    })
  }

}
