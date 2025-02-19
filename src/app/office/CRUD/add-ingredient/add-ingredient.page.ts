import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { SalePoint } from '../../../models/sale-point';
import { SalePointService } from '../../sale-point/sale-point.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { AddPointModalPage } from '../../sale-point/add-point-modal/add-point-modal.page';
import { IngredientService } from '../../ingredient/ingredient.service';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { take } from 'rxjs';
import { Dep, Gestiune } from 'src/app/models/nir.model';
import { emptyDep, emptyGest } from 'src/app/models/empty-models';

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

  editMode: boolean = false

  deps: Dep[] = []
  gest: Gestiune[] = []

  salePoints: SalePoint[] = []

  constructor(
    private modalCtr: ModalController,
    private ingredientService: IngredientService,
    private navParams: NavParams,
    private salePointService: SalePointService,
    private toastCtrl: ToastController,
    @Inject(ActionSheetService) private actSheet: ActionSheetService
  ) {}

  ngOnInit() {
    this.salePointService.getPoints().subscribe()
    this.getIngToedit()
    this.getDeps()
    this.getGest()
    this.getSalePoints()
  }


  getSalePoints(){
    this.salePointService.pointsSend$.subscribe({
      next: (points) => {
        this.salePoints = points
        this.setupIngForm()
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  async addSailPoint(){
      const point = await this.actSheet.openPayment(AddPointModalPage, '')
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
      gest: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      price: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      dept: new FormControl(null, {
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
        validators: [Validators.required]
      }),
    });
    if(this.ing){
      this.ingredientForm.get('name')?.setValue(this.ing.name);
      this.ingredientForm.get('um')?.setValue(this.ing.um);
      this.ingredientForm.get('tva')?.setValue(this.ing.tva.toString());
      this.ingredientForm.get('price')?.setValue(this.ing.price);
      this.ingredientForm.get('qty')?.setValue(this.ing.qty);
      if(this.ing.gest){
        this.ingredientForm.get('gest')?.setValue(this.ing.gest._id)
      }
      if(this.ing.dept){
        this.ingredientForm.get('dept')?.setValue(this.ing.dept._id)
      }
      if(this.ing.salePoint){
        this.ingredientForm.get('salePoint')?.setValue(this.ing.salePoint._id)
      }
    }
}

getIngToedit(){
  const ing = this.navParams.get('options')
  if(ing.length !== 0){
    this.ing = ing
    this.title = this.ing.name
    this.editMode = true
  }
}

saveIng(){
  if(this.ingredientForm.valid){
    const ingTosave = {
      name: this.ingredientForm.value.name,
      um: this.ingredientForm.value.um,
      tva: +this.ingredientForm.value.tva,
      gest: this.ingredientForm.value.gest ? this.ingredientForm.value.gest : this.ing.gest._id,
      dept: this.ingredientForm.value.dept ? this.ingredientForm.value.dept : this.ing.dept._id,
      qty: this.ingredientForm.value.qty,
      price: this.ingredientForm.value.price,
      tvaPrice: this.ingredientForm.value.price / ((this.ingredientForm.value.tva / 100) +1),
      salePoint: this.ingredientForm.value.salePoint
    }
    this.modalCtr.dismiss(ingTosave)
  }
}


  async deleteIng(){
    const result = await this.actSheet.deleteAlert(`Ești sigur ca vrei să ștergi ingredinetul ${this.ing.name}! Cand stergi un ingredient il stergi din toate rețetele în care a fost folosit!`, "Sterge")
    if(result){
      this.ingredientService.deleteIngredient(this.ing._id).pipe(take(1)).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 3000)
          this.modalCtr.dismiss(null)
        }
      })
    }
  }



async addGestiune(){
  let newGest: Gestiune = emptyGest ()
  const gestName = await this.actSheet.textAlert('Nume', 'Alege un nume pentru gestiune','nr','Nume')
  if(gestName) {
    newGest.name = gestName
    if(this.salePoints.length > 1){
      const salePoints = this.salePoints.map(s => s.name)
      const salePoint = await this.actSheet.entryAlert(salePoints, 'radio', 'Punct de lucru', 'Alege un punct de lucru', '', '')
      if(salePoint){
        const saleP = this.salePoints.find(s => s.name === salePoint)
        newGest.salePoint = saleP?._id
        }
    } else {
      newGest.salePoint = this.salePoints[0]._id
    }
    this.ingredientService.addGestiune(newGest).subscribe({
      next: (response) => {
        this.gest.push(response.gest)
        showToast(this.toastCtrl, response.message, 3000)
      }
    })
  }
}



async addDep(){
  let newDep: Dep = emptyDep ()
  const name = await this.actSheet.textAlert('Nume', 'Alege un nume pentru gestiune','nr','Nume')
  if(name) {
    newDep.name = name
    if(this.salePoints.length > 1){
      const salePoints = this.salePoints.map(s => s.name)
      const salePoint = await this.actSheet.entryAlert(salePoints, 'radio', 'Punct de lucru', 'Alege un punct de lucru', '', '')
      if(salePoint){
        const saleP = this.salePoints.find(s => s.name === salePoint)
        newDep.salePoint = saleP?._id
        }
    } else {
      newDep.salePoint = this.salePoints[0]._id
    }
    this.ingredientService.addDep(newDep).subscribe({
      next: (response) => {
        this.deps.push(newDep)
        showToast(this.toastCtrl, response.message, 3000)
      }
    })
  }
}

getDeps(){
  this.ingredientService.getDep().subscribe({
    next: (response) => {
      this.deps = response
    },
    error: (error) => {
      console.log(error)
    }
  })

}


getGest(){
  this.ingredientService.getGestiune().subscribe({
    next: (response) => {
      this.gest = response
    },
    error: (error) => {
      console.log(error)
    }
  })
}




close(){
  this.modalCtr.dismiss(null)
}
}
