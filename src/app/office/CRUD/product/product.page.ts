import { Component, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { RecipeMakerPage } from '../recipe-maker/recipe-maker.page';
import { SubProductPage } from '../sub-product/sub-product.page';
import { Product } from 'src/app/models/category.model';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { ProductsService } from '../../products/products.service';
import { mainCat } from '../../products/products.engine';
import { CategoriesPage } from '../../products/categories/categories.page';
import { CloudinaryPickerPage } from 'src/app/shared/cloudinary-picker/cloudinary-picker.page';
import { environment } from 'src/environments/environment';
import { emptyProduct } from 'src/app/models/empty-models';
import { ReportPage } from './report/report.page';


@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CloudinaryPickerPage, ReactiveFormsModule, ReportPage, RecipeMakerPage, CategoriesPage]
})
export class ProductPage implements OnInit {

  form!: FormGroup;
  searchCategoryInput: string = '';


  tempSubArray: any = [];
  ingredientsToSend: any = []
  toppingsToSend: any[] = []

  editMode: boolean = false;

  productMainCat!: string
  productCategory!: string | undefined

  product: Product = emptyProduct()
  categories: any = [];
  mainCats: mainCat[] = [];
  privateCats: mainCat[] = []


  hideIng: boolean = false
  isTva: boolean = true


  general: boolean = true
  recipe: boolean = false
  sub: boolean = false
  image: boolean = false
  report: boolean = false
  segment: string = 'general'

  kill: boolean = true



  constructor(
    @Inject(ActionSheetService) private actSheet: ActionSheetService,
    @Inject(ProductsService) private prodsSrv: ProductsService,
    private navParam: NavParams,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.setupForm()
    this.setTvaValidators()
  }





    selectSegment(event: any){
        if(this.segment === 'general'){
          this.general = true;
          this.recipe = false;
          this.sub = false;
          this.image = false
          this.report = false
          this.mainCats = JSON.parse(JSON.stringify(this.privateCats))
        }
        if(this.segment === 'report'){
          this.general = false;
          this.recipe = false;
          this.sub = false;
          this.image = false
          this.report = true
        }
        if(this.segment === 'recipe'){
          this.general = false;
          this.recipe = true;
          this.sub = false;
          this.image = false
          this.report = false
        }
        if(this.segment === 'sub'){
          this.general = false;
          this.recipe = false;
          this.sub = true;
          this.image = false
          this.report = false
        }
        if(this.segment === 'image'){
          this.general = false;
          this.recipe = false;
          this.sub = false;
          this.image = true
          this.report = false
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
      printer: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
        qty: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      sgrTax: new FormControl(null, {
        updateOn: 'change',
      }),
      printOut: new FormControl(null, {
        updateOn: 'change',
      }),
      order: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      dep: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      tva: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      recipe: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),

    });
    this.getProductToEdit()
  };



  getProductToEdit(){
    const data = this.navParam.get('options') as {product: Product, mainCats: mainCat[]}
    const mainC = data.mainCats.find(c => c.name === 'Toate')
    if(mainC) this.kill = mainC.active
    this.mainCats = data.mainCats.filter(m => m.name !== 'Toate')
    this.privateCats = JSON.parse(JSON.stringify(this.mainCats))
    if(data.product){
      this.product = data.product
      this.productCategory = this.product.category._id
      this.productMainCat = this.product.mainCat
      this.selectProductCats(this.product)
      this.product.subProducts.length ? this.hideIng = true : this.hideIng = false
      this.editMode = true
      this.form.get('name')?.setValue(this.product.name)
      this.form.get('price')?.setValue(this.product.price)
      this.form.get('mainCat')?.setValue(this.product.mainCat)
      this.form.get('description')?.setValue(this.product.description)
      this.form.get('qty')?.setValue(this.product.qty)
      this.form.get('sgrTax')?.setValue(this.product.sgrTax)
      this.form.get('printOut')?.setValue(this.product.printOut)
      this.form.get('order')?.setValue(this.product.order)
      this.form.get('dep')?.setValue(this.product.dep)
      this.form.get('tva')?.setValue(this.product.tva ? this.product.tva.toString() : '')
      this.form.get('printer')?.setValue(this.product.printer)
      this.form.get('recipe')?.setValue(this.product.recipe ? this.product.recipe : '-' )
      this.form.get('cat')?.setValue(this.product.category._id)
    }
  }

  setTvaValidators(){
    const tvaControl = this.form.get('tva')
    this.isTva ? tvaControl?.setValidators([Validators.required]) : tvaControl?.clearValidators()
  }



  onTopRecive(ev: any){
    this.toppingsToSend = ev
    console.log('products page', ev)
  }

  onIngRecive(ev: any){
    this.product.ings = ev
    this.ingredientsToSend = []
    this.product.ings.forEach((el:any) => {
      const ing = {
        qty: el.qty,
        ing: el.ing._id
      }
      this.ingredientsToSend.push(ing)
    })

  }

  getImages(ev: any){
    this.product.image = ev
  }


 async addSubProduct(){
    const data = await this.actSheet.openAdd(SubProductPage, null , 'add-modal')
    if(data && data.sub && this.editMode){
      const subProduct = data.sub
      subProduct.product = this.product._id
      this.prodsSrv.saveSubProduct(subProduct).subscribe(response => {
        this.product.subProducts.push(response.subProduct)
        showToast(this.toastCtrl, response.message, 3000)
      })
      }
    if(data && data.sub &&  !this.editMode){
      const subProduct = data.sub
      this.tempSubArray.push(subProduct)
    }
  }

  async onTempEdit(index: number){
    const subToEdit = this.tempSubArray[index]
    const data = await this.actSheet.openAdd(SubProductPage, subToEdit, 'add-modal')
    if(data && data.sub) this.tempSubArray[index] = data.sub
    if(data && data.delete) this.tempSubArray.splice(index, 1)
  }

  async onSubEdit(index: number){
    const subToEdit = this.product.subProducts[index]
    const data = await this.actSheet.openAdd(SubProductPage, subToEdit, 'add-modal')
    if(data && data.sub){
      const subProduct = data.sub
        this.prodsSrv.editSubProduct(subProduct).subscribe({
          next: (response) => {
            const index = this.product.subProducts.findIndex((s:any) => {
              if(s._id){
                return s._id === response.subProduct._id
              } else {
                return -1
              }
            })
            if(index !== -1){
              this.product.subProducts[index] = response.subProduct
              showToast(this.toastCtrl, response.message, 3000)
            }
          },
          error: (error) => {
            showToast(this.toastCtrl, error.message, 4000)
          }
        })
    }
    if(data && data.delete) this.product.subProducts.splice(index, 1)
  }

  async deleteProduct(){
    const message = `Ești sigur ca vrei să ștergi produsul ${this.product.name}?`
    const title = 'Șterge produsul'
    const result = await this.actSheet.deleteAlert(message, title)
    if(result){
      this.prodsSrv.deleteProduct(this.product._id).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 3000)
          this.modalCtrl.dismiss(null)
        }
      }, (err) => {
        if(err){
          showToast(this.toastCtrl, err.error.message, 3000)
        }
      })
    }
}




  async saveProduct(){
    if(this.form.valid && this.productCategory && this.productMainCat){
      const newProduct: any = {
        name: this.form.value.name,
        price: +this.form.value.price,
        category: this.productCategory,
        mainCat: this.productMainCat,
        description: this.form.value.description,
        qty: this.form.value.qty,
        order: +this.form.value.order,
        printOut: this.form.value.printOut,
        sgrTax: this.form.value.sgrTax,
        dep: this.form.value.dep,
        printer: this.form.value.printer,
        recipe: this.form.value.recipe,
        locatie: environment.LOC,
        tva: +this.form.value.tva,
        toppings: this.toppingsToSend.length ? this.toppingsToSend : this.product.toppings,
        ings: this.ingredientsToSend.length ? this.ingredientsToSend : this.product.ings.map(i => ({ qty: i.qty, ing: i.ing._id})),
        subProducts: this.tempSubArray,
        image: this.product.image
      }
      if(this.editMode) {
        newProduct._id = this.product._id
        delete newProduct.subProducts
      }
      const product = JSON.stringify(newProduct)
      if(this.editMode){
        this.prodsSrv.editProduct(product).subscribe(response => {
          showToast(this.toastCtrl, response.message, 3000);
          this.modalCtrl.dismiss(null)
        })
      } else {
        this.prodsSrv.saveProduct(product).subscribe(response => {
          this.form.reset()
          this.product = emptyProduct()
          this.modalCtrl.dismiss(null)
          showToast(this.toastCtrl, response.message, 3000);
        })
      }
    }

  }


  subStatus(ev: any, id: string | undefined, index: number){
    let status
    const isCheked = ev.detail.checked
      if(isCheked) {
        status = "activate"
      } else {
        status = "deactivated"
      }
      if(id){
        this.prodsSrv.changeProductStatus(status, id).subscribe(response => {
          if(response) {
            const subProduct = this.product.subProducts[index]
            if(subProduct){
              subProduct.available = response.available
              showToast(this.toastCtrl, `Produsul a fost ${isCheked? 'Activat' : 'Dezactivat'}`, 2000)
            } else {
              showToast(this.toastCtrl, `Produst nu a fost gasit! REFRESH!`,2000)
            }
          }
        })
      }
  }



  reciveMainCat(maincat: mainCat){
    this.productMainCat = maincat.name
    const cat = maincat.cat.find(c => c.active === true)
     if(cat){
      this.privateCats = JSON.parse(JSON.stringify(this.mainCats))
      this.productCategory = cat._id
     } else {
      this.productCategory = undefined
     }
  }

  selectProductCats(product: Product){
    this.restetCats()
    const mainCat = this.mainCats.find(m => m.name === product.mainCat)
    if(mainCat){
      mainCat.active = true
      const cat = mainCat.cat.find(c => c._id === product.category._id)
      if(cat){
        cat.active = true
      }
    }
    this.privateCats = JSON.parse(JSON.stringify(this.mainCats))
  }
  restetCats(){
    for(let main of this.mainCats){
      main.active = false
      for(let cat of main.cat){
        cat.active = false
      }
    }
  }


  close(){
    if(this.kill) this.restetCats()
    this.modalCtrl.dismiss(null)
  }


}

