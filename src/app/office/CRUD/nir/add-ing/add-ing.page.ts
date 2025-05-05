import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController, ModalController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IngredientService } from '../../../ingredient/ingredient.service';
import { Dep, Gestiune, NirIngredient } from '../../../../models/nir.model';
import { round } from '../../../../shared/utils/functions';
import { IonInput } from '@ionic/angular/standalone';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { NirService } from '../nir.service';
import { RandomService } from 'src/app/shared/random.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { AddIngredientPage } from '../../add-ingredient/add-ingredient.page';
import { RecipeMakerPage } from '../../recipe-maker/recipe-maker.page';
import { emptyDep, emptyGest } from 'src/app/models/empty-models';
import { SalePointService } from 'src/app/office/sale-point/sale-point.service';
import { SalePoint } from 'src/app/models/sale-point';

@Component({
  selector: 'app-add-ing',
  templateUrl: './add-ing.page.html',
  styleUrls: ['./add-ing.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RecipeMakerPage]
})
export class AddIngPage implements OnInit, OnDestroy {


  @ViewChild('qtyInput', { static: false }) qtyInput!: IonInput;


  ingredientForm!: FormGroup

  ingredient!: any

  showAdd: boolean = false


  ingSub!: Subscription
  ingId: string = ''

  deps: Dep[] = []
  gest: Gestiune[] = []
  salePoints: SalePoint[] = []

  loop: boolean = false

  qtyCalcColor!: string
  valCalcColor!: string
  totalCalcColor!: string
  qtyInputType: string = 'number'
  valInputType: string = 'number'
  inputType: string = 'number'
  totalInputType: string = 'number'

  pointsSub!: Subscription

  constructor(
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private ingSrv: IngredientService,
    private toastCtrl: ToastController,
    private nirSrv: NirService,
    private randomSrv: RandomService,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private salePointService: SalePointService,
  ) { }


  ngOnDestroy(): void {
      if(this.ingSub){
        this.ingSub.unsubscribe()
      }
      if(this.pointsSub) this.pointsSub.unsubscribe()
  }




  ngOnInit() {
    this.getDeps()
    this.getGest()
    this.getSalePoints()
    this.setupIngForm()
    this.getMode()
  }


  close(){
    this.modalCtrl.dismiss(null)
  }


  async addIng(){
    this.showAdd = false
    const ing = await this.actionSrv.openAdd(AddIngredientPage, [], 'add-modal')
    if(ing){
      this.ingSrv.addIngredinet(ing).subscribe({
        next: (response) => {
          this.selectIngredient(response.ing)
          showToast(this.toastCtrl, response.message, 4000)
        }, error: (error) => {
          console.log(error)
        }
      })
    }
   }


   getMode(){
    this.loop = this.navParams.get('options')
    this.ingredientForm.get('loop')?.setValue(this.loop)
   }

   onIngRecive(ev: any){
    this.selectIngredient(ev)
   }

   loopChange(ev: any){
     this.loop = ev.detail.checked;
   }


  addToNir(){
    const ingredient: NirIngredient = {
      name: this.ingredientForm.value.name,
      price: this.ingredientForm.value.price,
      um: this.ingredientForm.value.um,
      qty: +this.ingredientForm.value.qty,
      value: round(+this.ingredientForm.value.value),
      tva: +this.ingredientForm.value.tva,
      tvaValue: this.ingredientForm.value.tvaValue,
      total: round(this.ingredientForm.value.total),
      dep: this.ingredientForm.value.dept,
      gestiune: this.ingredientForm.value.gest,
      sellPrice: this.ingredientForm.value.sellPrice ? this.ingredientForm.value.sellPrice : 0,
      logId: this.randomSrv.generateRandomHexString(9),
      ing: this.ingId
    }
    if(this.ingredientForm.valid && this.ingId.length > 6){
      this.nirSrv.addNirIngs(ingredient)
      this.ingredientForm.reset()
      this.modalCtrl.dismiss(this.loop)
    } else {
      this.showAdd = true
      showToast(this.toastCtrl, 'Trebuie să salvezi ingredientul în baza de date înainte de a-l adăuga în nir!', 3000)
    }
  }







  selectIngredient(ingredient: any){
    this.ingredient = ingredient;
    if(this.ingredient){
      this.ingredientForm.get('name')?.setValue(this.ingredient.name)
      this.ingredientForm.get('um')?.setValue(this.ingredient.um)
      this.ingredientForm.get('dept')?.setValue(this.ingredient.dept.name)
      this.ingredientForm.get('gest')?.setValue(this.ingredient.gest.name)
      this.ingredientForm.get('price')?.setValue(this.ingredient.price)
      this.ingredientForm.get('tva')?.setValue(this.ingredient.tva.toString())
      this.ingredientForm.get('sellPrice')?.setValue(this.ingredient.sellPrice)
      this.ingId = ingredient._id
      setTimeout(() => {
        this.qtyInput.setFocus()
      }, 300)
    }
  }

  getSalePoints(){
   this.pointsSub = this.salePointService.pointsSend$.subscribe({
      next: (points) => {
        this.salePoints = points
        this.setupIngForm()
      },
      error: (error) => {
        console.log(error)
      }
    })
  }


  getDeps(){
    this.ingSrv.getDep().subscribe({
      next: (response) => {
        this.deps = response
      },
      error: (error) => {
        console.log(error)
      }
    })

  }


  getGest(){
    this.ingSrv.getGestiune().subscribe({
      next: (response) => {
        this.gest = response
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  async addGestiune(){
    let newGest: Gestiune = emptyGest ()
    const gestName = await this.actionSrv.textAlert('Nume', 'Alege un nume pentru gestiune','nr','Nume')
    if(gestName) {
      newGest.name = gestName
      if(this.salePoints.length > 1){
        const salePoints = this.salePoints.map(s => s.name)
        const salePoint = await this.actionSrv.entryAlert(salePoints, 'radio', 'Punct de lucru', 'Alege un punct de lucru', '', '')
        if(salePoint){
          const saleP = this.salePoints.find(s => s.name === salePoint)
          newGest.salePoint = saleP?._id
          }
      } else {
        newGest.salePoint = this.salePoints[0]._id
      }
      this.ingSrv.addGestiune(newGest).subscribe({
        next: (response) => {
          this.gest.push(response.gest)
          showToast(this.toastCtrl, response.message, 3000)
        }
      })
    }
  }



  async addDep(){
    let newDep: Dep = emptyDep ()
    const name = await this.actionSrv.textAlert('Nume', 'Alege un nume pentru gestiune','nr','Nume')
    if(name) {
      newDep.name = name
      if(this.salePoints.length > 1){
        const salePoints = this.salePoints.map(s => s.name)
        const salePoint = await this.actionSrv.entryAlert(salePoints, 'radio', 'Punct de lucru', 'Alege un punct de lucru', '', '')
        if(salePoint){
          const saleP = this.salePoints.find(s => s.name === salePoint)
          newDep.salePoint = saleP?._id
          }
      } else {
        newDep.salePoint = this.salePoints[0]._id
      }
      this.ingSrv.addDep(newDep).subscribe({
        next: (response) => {
          this.deps.push(newDep)
          showToast(this.toastCtrl, response.message, 3000)
        }
      })
    }
  }





  setupIngForm() {
    this.ingredientForm = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      price: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      um: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
        qty: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      value: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      tva: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      tvaValue: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      total: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      dept: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      gest: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      sellPrice: new FormControl(null, {
        updateOn: 'change',
      }),
      loop: new FormControl(null, {
        updateOn: 'change',
      }),


    });
  };


  switchCalcMode(id: string){
    if(id === 'value'){
      if(this.valCalcColor === 'primary'){
        this.evalValue()
      } else {
        this.valCalcColor = 'primary';
        this.valInputType = 'text'
      }
    }
    if(id === 'qty'){
      if(this.qtyCalcColor === 'primary'){
        this.evalQty()
      } else {
        this.qtyCalcColor = 'primary';
        this.qtyInputType = 'text'
      }
    }
    if(id === 'total'){
      if(this.totalCalcColor === 'primary'){
        this.evalTotal()
      } else {
        this.totalCalcColor = 'primary';
        this.totalInputType = 'text'
      }
    }

  }
  evalValue(){
    let input = this.ingredientForm.get('value')
    if(input){
      this.evalExpresssion(input)
      this.valCalcColor = ''
      this.valInputType = 'number'
    }
  }

  evalQty(){
    let input = this.ingredientForm.get('qty')
    if(input){
      this.evalExpresssion(input)
      this.qtyCalcColor = ''
      this.qtyInputType = 'number'
    }
  }
  evalTotal(){
    let input = this.ingredientForm.get('total')
    if(input){
      this.evalExpresssion(input)
      this.totalCalcColor = ''
      this.totalInputType = 'number'
    }
  }


  evalExpresssion(input: AbstractControl){
      const inputValue = input.value
      try{
        const result = eval(inputValue)
        input.setValue(round(+result))
      } catch(err){
        console.log(err)
        showToast(this.toastCtrl, 'Eroare la calcul', 2000)
      }
  }


  onValTab(ev: KeyboardEvent){
    if (ev.key === 'Tab') {
      const qtyControl = this.ingredientForm.get('qty');
      const priceControl = this.ingredientForm.get('price')
      const valueControl = this.ingredientForm.get('value');
      const tvaControl = this.ingredientForm.get('tva');
      const tvaValueControl = this.ingredientForm.get('tvaValue');
      const totalControl = this.ingredientForm.get('total');
      if(qtyControl && priceControl && valueControl && tvaControl){
          const qty = +qtyControl.value
          const value = +valueControl.value
          const tva = +tvaControl.value
          priceControl.setValue(round(value/qty))
          tvaValueControl?.setValue(round(value * tva / 100))
          totalControl?.setValue(round(value + (value * tva / 100)))
      }
    }
    if( ev.key === 'c'){
      this.switchCalcMode('value')
    }
  }

  onQtyTab(ev: KeyboardEvent){
    if (ev.key === 'Tab') {
      const qtyControl = this.ingredientForm.get('qty');
      const priceControl = this.ingredientForm.get('price')
      const valueControl = this.ingredientForm.get('value');
      if(qtyControl && priceControl && valueControl){
          const qty = +qtyControl.value
          const price = priceControl.value
          valueControl.setValue(round(qty*price))
      }
    }
    if( ev.key === 'c'){
      this.switchCalcMode('qty')
    }
  }



  calc(ev: KeyboardEvent){
    if( ev.key === 'c'){
      this.switchCalcMode('total')
    }
  }

}
