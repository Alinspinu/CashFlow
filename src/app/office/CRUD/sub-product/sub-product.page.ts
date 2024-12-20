import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams} from '@ionic/angular';
import { RecipeMakerPage } from '../recipe-maker/recipe-maker.page';

@Component({
  selector: 'app-sub-product',
  templateUrl: './sub-product.page.html',
  styleUrls: ['./sub-product.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RecipeMakerPage]
})
export class SubProductPage implements OnInit {


  form!: FormGroup;
  editMode: boolean = false;
  sub: any = {
    name: "",
    price: 0,
    qty: "",
    description: '',
    order: 0,
    tva:""
  }

  toppings: any = [];
  productIngredientss: any = [];
  ingredientsToSend: any = []

  isTva: boolean = true;

  constructor(
    private modalCtrl: ModalController,
    private navParmas: NavParams
  ) { }

  ngOnInit() {
    this.getSubToEdit()
    this.setupForm()
    this.setTvaValidators()
  }

  setTvaValidators(){
    const tvaControl = this.form.get('tva')
    this.isTva ? tvaControl?.setValidators([Validators.required]) : tvaControl?.clearValidators()
  }

  getSubToEdit(){
   this.sub =  this.navParmas.get('options')
   if(this.sub.name){
     if(this.sub.name.length){
      this.editMode = true
     }
   }
   this.toppings = this.sub.toppings
   this.productIngredientss = this.sub.ings;
   console.log(this.productIngredientss)
  }

  onClose(){
    this.modalCtrl.dismiss(null)
  }

  addToProduct(){
    if(this.form.valid){
      const subProduct = {
        name: this.form.value.name,
        price: this.form.value.price,
        qty: this.form.value.qty,
        order: this.form.value.order,
        tva: this.form.value.tva,
        printOut: this.form.value.printOut,
        description: this.form.value.description,
        ings: this.ingredientsToSend,
        toppings: this.toppings,
        recipe: this.form.value.recipe,
        product: '',
        _id: '',
      }
      if(this.editMode){
       subProduct.product = this.sub.product
       subProduct._id = this.sub._id
      }
      this.modalCtrl.dismiss(subProduct)
    }
  }


  setupForm() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      price: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      qty: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      order: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      tva: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      printOut: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      recipe: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
  })
  this.form.get('name')?.setValue(this.sub.name)
  this.form.get('price')?.setValue(this.sub.price)
  this.form.get('qty')?.setValue(this.sub.qty)
  this.form.get('order')?.setValue(this.sub.order)
  this.form.get('tva')?.setValue(this.sub.tva)
  this.form.get('description')?.setValue(this.sub.description)
  this.form.get('printOut')?.setValue(this.sub.printOut)
  this.form.get('recipe')?.setValue(this.sub.recipe ? this.sub.recipe : '-')
  }



  onTopRecive(ev: any){
    this.toppings = ev
  }

  onIngRecive(ev: any){
    this.ingredientsToSend = ev;
  }

}
