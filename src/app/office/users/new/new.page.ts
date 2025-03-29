import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class NewPage implements OnInit {

  form!: FormGroup

  user!: any

  hide: {name: boolean, email: boolean, tel: boolean, disc: boolean} = {name: false, email: false, tel: false, disc: false}

  constructor(
    @Inject(ActionSheetService) private actionSheetService: ActionSheetService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.setForm()
    this.startAddFlow()
  }

async startAddFlow(){
  const name = await this.actionSheetService.textAlert('Nume Client', 'Adaugă numele clientului.', 'nr', 'Nume')
  if(name) {
    this.hide.name = true
    this.form.get('name')?.setValue(name)
   const email = await this.actionSheetService.textAlert('E-mail Client', "Adaugă adresa de e-mail a clientului.", 'nr', 'E-mail')
   if(email) {
    this.form.get('email')?.setValue(email)
    this.hide.email = true
     const tel = await this.actionSheetService.textAlert('Telefonul Client', 'Adaugă numarul de telefon al clientului.', 'nr', 'Telefon')
     if(tel){
      this.form.get('tel')?.setValue(tel)
      this.hide.tel = true
      const disc = await this.actionSheetService.textAlert('Discount', 'Adaugă procentul de discount al clientului', 'nr', 'Discount')
      if(disc){
        this.form.get('disc')?.setValue(disc)
        this.hide.disc = true
        this.user = {
          name: name,
          email: email,
          tel: tel,
          loc: environment.LOC,
          discount: {general: +disc, category: []}
        }
      }
     }
   }
  }
}

  setForm(){
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      tel: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      disc: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),

    });
  }


  cancel(){
    this.modalCtrl.dismiss(null)
  }

  confirm(){
    if(this.user){
      this.modalCtrl.dismiss(this.user)
    }
  }
}
