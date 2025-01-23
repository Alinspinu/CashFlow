import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { base64toBlob } from 'src/app/shared/utils/base64toBlob';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { RecipeMakerPage } from '../recipe-maker/recipe-maker.page';
import { SubProductPage } from '../sub-product/sub-product.page';
import {  Router } from '@angular/router';
import { Product } from 'src/app/models/category.model';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { ProductsService } from '../../products/products.service';
import { mainCat } from '../../products/products.engine';
import { CategoriesPage } from '../../products/categories/categories.page';
import { CloudinaryPickerPage } from 'src/app/shared/cloudinary-picker/cloudinary-picker.page';


@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CloudinaryPickerPage, ReactiveFormsModule, CapitalizePipe, RecipeMakerPage, CategoriesPage]
})
export class ProductPage implements OnInit {

  form!: FormGroup;
  searchCategoryInput: string = '';
  toppings: any = [];
  mainCats: mainCat[] = [];

  subProducts: any = [];
  editMode: boolean = false;


  progress: number = 0.3
  productMainCat!: string
  productCategory!: string | undefined

  tempSubArray: any = [];

  categories: any = [];
  product!: Product;
  productIngredients: any = [];
  topToEdit!: any;
  ingsToEdit!: any;
  hideIng: boolean = false
  isTva: boolean = true


  general: boolean = true
  recipe: boolean = false
  sub: boolean = false
  segment: string = 'general'

  kill: boolean | undefined = false 

  constructor(
    @Inject(ActionSheetService) private actSheet: ActionSheetService,
    @Inject(ProductsService) private prodsSrv: ProductsService,
    private navParam: NavParams,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private router: Router,
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
        }
        if(this.segment === 'recipe'){
          this.general = false;
          this.recipe = true;
          this.sub = false;
        }
        if(this.segment === 'sub'){
          this.general = false;
          this.recipe = false;
          this.sub = true;
        }
    }

    getProductImages(images: any){

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
      // longDescription: new FormControl(null, {
      //   updateOn: 'change',
      //   validators: [Validators.required]
      // }),
        qty: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
        sgrTax: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
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
      printOut: new FormControl(null, {
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
    this.kill = data.mainCats.find(c => c.name === 'Toate')?.active
    this.mainCats = data.mainCats.filter(m => m.name !== 'Toate')
    console.log(this.mainCats)
    if(data.product){
      this.product = data.product
      this.productCategory = this.product.category._id
      this.productMainCat = this.product.mainCat
      this.selectProductCats(this.product)
      this.product.subProducts.length ? this.hideIng = true : this.hideIng = false
      this.editMode = true
      this.topToEdit = this.product.toppings;
      this.ingsToEdit = this.product.ings;
      this.subProducts = this.product.subProducts;
      this.toppings = this.product.toppings;
      this.form.get('name')?.setValue(this.product.name)
      this.form.get('price')?.setValue(this.product.price)
      this.form.get('mainCat')?.setValue(this.product.mainCat)
      this.form.get('description')?.setValue(this.product.description)
      // this.form.get('longDescription')?.setValue(this.product.longDescription)
      this.form.get('qty')?.setValue(this.product.qty)
      this.form.get('sgrTax')?.setValue(this.product.sgrTax)
      this.form.get('order')?.setValue(this.product.order)
      this.form.get('dep')?.setValue(this.product.dep)
      this.form.get('tva')?.setValue(this.product.tva ? this.product.tva.toString() : '')
      this.form.get('printer')?.setValue(this.product.printer)
      this.form.get('printOut')?.setValue(this.product.printOut)
      this.form.get('recipe')?.setValue(this.product.recipe ? this.product.recipe : '-' )
      this.form.get('cat')?.setValue(this.product.category._id)
    }
  }

  setTvaValidators(){
    const tvaControl = this.form.get('tva')
    this.isTva ? tvaControl?.setValidators([Validators.required]) : tvaControl?.clearValidators()
  }



  onTopRecive(ev: any){
    this.toppings = ev
  }

  onIngRecive(ev: any){
    this.productIngredients = ev
  }

  deleteSub(index: number, id: string){
    if(id){
      this.prodsSrv.deleteSubProduct(id).subscribe()
    }
    this.subProducts.splice(index, 1)
  }

 async addSubProduct(){
    const subProduct = await this.actSheet.openModal(SubProductPage,[],false)
    if(subProduct && this.editMode){
      subProduct.product = this.product._id
      this.prodsSrv.saveSubProduct(subProduct).subscribe(response => {
        this.subProducts.push(response.subProduct)
      })
    } else if(subProduct && !this.editMode){
      this.tempSubArray.push(subProduct)
    }
  }


  async onSubEdit(index: number){
    const subToEdit = this.subProducts[index]
    const editedSub = await this.actSheet.openModal(SubProductPage, subToEdit, false)
    if(editedSub){
      this.subProducts[index] = editedSub
    }
  }





 async saveProduct(){
    if(this.form.valid && this.productCategory && this.productMainCat){
      const productData = new FormData()
      const toppings = this.toppings.length ? JSON.stringify(this.toppings): 'skip';
      const ings = this.productIngredients.length ? JSON.stringify(this.productIngredients) : 'skip';
      const sub = JSON.stringify(this.subProducts);
      productData.append('name', this.form.value.name);
      productData.append('price', this.form.value.price);
      productData.append('category', this.productCategory);
      productData.append('mainCat', this.productMainCat);
      productData.append('description', this.form.value.description);
      productData.append('longDescription', this.form.value.longDescription);
      productData.append('qty', this.form.value.qty);
      productData.append('order', this.form.value.order);
      productData.append('sgrTax', this.form.value.sgrTax);
      productData.append('dep', this.form.value.dep);
      productData.append('tva', this.form.value.tva);
      productData.append('image', this.form.value.image);
      productData.append('printer', this.form.value.printer);
      productData.append('printOut', this.form.value.printOut)
      productData.append('recipe', this.form.value.recipe)
      if(toppings !== 'skip'){
        productData.append('toppings', toppings);
      }
      if(ings !== 'skip'){
        productData.append('ings', ings);
      }
      productData.append('sub', sub);
      if(this.editMode){
        this.prodsSrv.editProduct(productData, this.product._id).subscribe(response => {
          showToast(this.toastCtrl, response.message, 3000);
          this.router.navigateByUrl('/office/products')
        })
      } else {
        this.prodsSrv.saveProduct(productData).subscribe(response => {
          const product = response.product
          if(product){
            this.tempSubArray.map((obj:any) => {
              obj.product = product._id;
              return obj;
            })
            for(let sub of this.tempSubArray){
               this.prodsSrv.saveSubProduct(sub).subscribe()
            }
            this.router.navigateByUrl('/office/products')
            this.form.reset()
            this.toppings = []
            this.productIngredients = []
            this.subProducts = []
          }
        })
      }
    }
  }



  onImagePicked(imageData: string | File){
    let imageFile;
    if(typeof imageData === 'string'){
      try{
        imageFile = base64toBlob(
          imageData.replace(/^data:image\/(png|jpe?g|gif|webp);base64,/, ''),
          'image/jpeg'
          );
      } catch (error) {
        console.log(error);
      };
    } else {
      imageFile = imageData;
    };
    this.form.patchValue({image: imageFile});
  }


  reciveMainCat(maincat: mainCat){
    this.productMainCat = maincat.name
    const cat = maincat.cat.find(c => c.active === true)
     if(cat){
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
    this.modalCtrl.dismiss(null)
  }


}
