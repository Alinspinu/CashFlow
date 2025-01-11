import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { SalePoint } from '../../../models/sale-point';
import { SalePointService } from '../../sale-point/sale-point.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { AddPointModalPage } from '../../sale-point/add-point-modal/add-point-modal.page';

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

  salePoints: SalePoint[] = []

  constructor(
    private modalCtr: ModalController,
    private navParams: NavParams,
    private salePointService: SalePointService,
    @Inject(ActionSheetService) private actSheet: ActionSheetService
  ) { }

  ngOnInit() {
    this.salePointService.getPoints().subscribe()
    this.getIngToedit()
    this.setupIngForm()
    this.getSalePoints()
  }


  getSalePoints(){
    this.salePointService.pointsSend$.subscribe({
      next: (points) => {
        this.salePoints = points
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  async addSailPoint(){
      const point = await this.actSheet.openPayment(AddPointModalPage, '')
      console.log(point)
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
      price: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      dep: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      qty: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      invQty: new FormControl(null, {
        updateOn: 'change',
      }),
      salePoint: new FormControl(null, {
        updateOn: 'change',
      }),
    });
    if(this.ing){

      this.ingredientForm.get('name')?.setValue(this.ing.name);
      this.ingredientForm.get('um')?.setValue(this.ing.um);
      this.ingredientForm.get('tva')?.setValue(this.ing.tva.toString());
      this.ingredientForm.get('price')?.setValue(this.ing.price);
      this.ingredientForm.get('qty')?.setValue(this.ing.qty);
      if(this.ing.gestiune){
        this.ingredientForm.get('gestiune')?.setValue(this.ing.gestiune)
      }
      if(this.ing.dep){
        this.ingredientForm.get('dep')?.setValue(this.ing.dep)
      }
      if(this.ing.salePoint){
        this.ingredientForm.get('salePoint')?.setValue(this.ing.salePoint)
      }
      // this.ingredientForm.get('invQty')?.setValue(this.ing.inventary[19].qty - this.ing.qty);
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
      gestiune: this.ingredientForm.value.gestiune ? this.ingredientForm.value.gestiune : this.ing.gestiune,
      dep: this.ingredientForm.value.dep ? this.ingredientForm.value.dep : this.ing.dep,
      qty: this.ingredientForm.value.qty,
      price: this.ingredientForm.value.price,
      tvaPrice: this.ingredientForm.value.price / ((this.ingredientForm.value.tva / 100) +1),
      salePoint: this.ingredientForm.value.SalePoint
    }
    this.modalCtr.dismiss(ingTosave)
  }
}


cancel(){
  this.modalCtr.dismiss(null)
}
}
