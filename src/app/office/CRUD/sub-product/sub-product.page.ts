import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActionSheetController, IonicModule, ModalController, NavParams} from '@ionic/angular';
import { RecipeMakerPage } from '../recipe-maker/recipe-maker.page';
import { SubProduct } from 'src/app/models/category.model';
import { emptySubProduct } from 'src/app/models/empty-models';
import { ProductsService } from '../../products/products.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';

@Component({
  selector: 'app-sub-product',
  templateUrl: './sub-product.page.html',
  styleUrls: ['./sub-product.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RecipeMakerPage]
})
export class SubProductPage implements OnInit {

  general: boolean = true
  recipe: boolean = false
  segment: string = 'general'


  form!: FormGroup;
  editMode: boolean = false;
  sub: SubProduct = emptySubProduct()

  toppings: any = [];
  ingredients: any = [];

  isTva: boolean = true;

  constructor(
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private modalCtrl: ModalController,
    private navParmas: NavParams,
    private prodsSrv: ProductsService,
  ) { }

  ngOnInit() {
    this.setupForm()
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
      recipe: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      printOut: new FormControl(null, {
        updateOn: 'change',
      })
  })
  this.getSubToEdit()
  }



  selectSegment(event: any){
    if(this.segment === 'general'){
      this.general = true;
      this.recipe = false;

    }
    if(this.segment === 'recipe'){
      this.general = false;
      this.recipe = true;
    }
}

  getSubToEdit(){
   const data =  this.navParmas.get('options')
   if(data){
    this.sub = data     
    console.log(this.sub)
    this.editMode = true
    this.toppings = this.sub.toppings
    this.ingredients = this.sub.ings;
    this.form.get('name')?.setValue(this.sub.name)
    this.form.get('price')?.setValue(this.sub.price)
    this.form.get('qty')?.setValue(this.sub.qty)
    this.form.get('printOut')?.setValue(this.sub.printOut)
    this.form.get('order')?.setValue(this.sub.order)
    this.form.get('tva')?.setValue(this.sub.tva.toString())
    this.form.get('description')?.setValue(this.sub.description)
    this.form.get('recipe')?.setValue(this.sub.recipe ? this.sub.recipe : '-')
   }
  }


  close(){
    this.modalCtrl.dismiss(null)
  }

  addToProduct(){
    if(this.form.valid){
      this.sub.name = this.form.value.name
      this.sub.price = this.form.value.price
      this.sub.qty = this.form.value.qty
      this.sub.order = this.form.value.order
      this.sub.tva = +this.form.value.tva
      this.sub.printOut = this.form.value.printOut
      this.sub.description = this.form.value.description
      this.sub.ings =  this.ingredients
      this.sub.toppings = this.toppings
      this.sub.recipe = this.form.value.recipe
      this.modalCtrl.dismiss({sub: this.sub})
    }
  }

  async deleteSub(){
    const response = await this.actionSheet.deleteAlert(`Ești sigur că vrei să ștergi sub produsul ${this.sub.name}?`, 'Șterge Sub Produsul')
    if(response) {
      if(this.sub._id){
        this.prodsSrv.deleteSubProduct(this.sub._id).subscribe({
          next: (response) => {
            this.modalCtrl.dismiss({delete: true})
          }
        })
      }
    } 
  }






  onTopRecive(ev: any){
    this.toppings = ev
  }

  onIngRecive(ev: any){
    this.ingredients = ev
  }

}
