import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { SheduleService } from '../shedule.service';
import { Shedule } from '../../../models/shedule.model';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.page.html',
  styleUrls: ['./toggle.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TogglePage implements OnInit {

  shedules: Shedule[] = []
  isLoading: boolean = false

  constructor(
    private modalCtrl: ModalController,
    private shedSrv: SheduleService,
  ) { }

  ngOnInit() {
    this.getShedules()
  }

  choiseShedule(shedule: Shedule){
    this.modalCtrl.dismiss(shedule)
  }

  getShedules(){
    this.shedSrv.getAllShedules().subscribe(response => {
      this.shedules = response
    })
  }

  addShedule(){
    this.isLoading = true
    this.shedSrv.addShedule().subscribe(response => {
      if(response){
        this.shedules.push(response)
        this.isLoading = false
      }
    })
  }

}
