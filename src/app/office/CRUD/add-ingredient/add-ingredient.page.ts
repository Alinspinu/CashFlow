import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-addingredient',
  templateUrl: './add-ingredient.page.html',
  styleUrls: ['./add-ingredient.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class AddIngredientPage implements OnInit {

  ingredientForm!: FormGroup
    title: string = 'Adaugă Ingredient'
  ing!: any

  constructor(
    private modalCtr: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.getIngToedit()
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
    if(this.ing){
      this.ingredientForm.get('name')?.setValue(this.ing.name);
      this.ingredientForm.get('um')?.setValue(this.ing.um);
      this.ingredientForm.get('tva')?.setValue(this.ing.tva.toString());
      this.ingredientForm.get('gestiune')?.setValidators([])
      this.ingredientForm.get('gestiune')?.updateValueAndValidity()
    }
}

getIngToedit(){
  const ing = this.navParams.get('options')
  if(ing.length !== 0){
    this.title = 'Modifică ingredient'
    this.ing = ing
  }
}

saveIng(){
  if(this.ingredientForm.valid){
    const ingTosave = {
      name: this.ingredientForm.value.name,
      um: this.ingredientForm.value.um,
      tva: +this.ingredientForm.value.tva,
      gestiune: this.ingredientForm.value.gestiune ? this.ingredientForm.value.gestiune : this.ing.gestiune
    }
    this.modalCtr.dismiss(ingTosave)
  }
}


cancel(){
  this.modalCtr.dismiss(null)
}
}
