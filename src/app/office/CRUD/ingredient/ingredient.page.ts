import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.page.html',
  styleUrls: ['./ingredient.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class IngredientPage implements OnInit {

  ingredientForm!: FormGroup

  constructor(
    private modalCtr: ModalController
  ) { }

  ngOnInit() {
    this.setupIngForm()
  }

  setupIngForm() {
    this.ingredientForm = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      um: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      tva: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      gestiune: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
    });
}

saveIng(){
  if(this.ingredientForm.valid){
    const ingTosave = {
      name: this.ingredientForm.value.name,
      um: this.ingredientForm.value.um,
      tva: +this.ingredientForm.value.tva,
      gestiune: this.ingredientForm.value.gestiune
    }
    this.modalCtr.dismiss(ingTosave)
  }
}

cancel(){
  this.modalCtr.dismiss(null)
}
}
