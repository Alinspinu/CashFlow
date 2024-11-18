import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EService } from './e-factura.service';
import { Suplier } from 'src/app/models/suplier.model';
import { EFactura, messageEFactura } from 'src/app/models/nir.model';
import { SupliersService } from '../supliers/supliers.service';
import { editMessage } from './e-factura.engine';
import { round } from 'src/app/shared/utils/functions';

@Component({
  selector: 'app-e-factura',
  templateUrl: './e-factura.page.html',
  styleUrls: ['./e-factura.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EFacturaPage implements OnInit {

  supliers: Suplier[] = []
  message!: messageEFactura
  eFactura!: EFactura

  constructor(
    private eService: EService,
    private suplService: SupliersService,
  ) { }

  ngOnInit() {
    this.getMessage()
  }



  getMessage(){
    this.eService.getMessages(4).subscribe({
      next: (response) => {
        this.message = response
        this.getSupliers()
      },
      error: (error)=> {
        console.log(error)
      }
    })
  }

  getSupliers(){
    this.suplService.getSupliers().subscribe({
      next: (response) => {
        this.supliers = response
        this.message = editMessage(this.message, this.supliers)
 
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  showInvoice(id: string){
    this.eService.getInvoice(id).subscribe({
      next: (response) => {
       this.eFactura = response
       console.log(response)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  roundInHtml(num: number){
    return round(num)
  }
}
