import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { base64toBlob } from 'src/app/shared/utils/base64toBlob';
import { ImagePickerComponent } from 'src/app/shared/image-picker/image-picker.component';
import { ProductService } from './product.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { ContentService } from 'src/app/content/content.service';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { RecipeMakerPage } from '../recipe-maker/recipe-maker.page';
import { SubProductPage } from '../sub-product/sub-product.page';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/category.model';
import { CategoryPage } from '../category/category.page';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { getUserFromLocalStorage } from 'src/app/shared/utils/functions';
import User from 'src/app/auth/user.model';
import { ProductsService } from '../../products/products.service';
import { SubProduct } from '../../../models/category.model';
import { ing } from '../../../../../../../CashFlowFresh/CashFlow/src/app/models/inventary.model';


@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ImagePickerComponent, ReactiveFormsModule, CapitalizePipe, RecipeMakerPage]
})
export class ProductPage implements OnInit {

  form!: FormGroup;
  searchCategoryInput: string = '';
  toppings: any = [];
  mainCats: any = [];
  categoriesToshow: any = [];
  subProducts: any = [];
  editMode: boolean = false;

  tempSubArray: any = [];

  categories: any = [];
  product!: Product;

  productIngredients: any = [];

  topToEdit!: any;
  ingsToEdit!: any;

  hideIng: boolean = false
  user!: User
  isTva: boolean = true

  constructor(
    @Inject(ContentService) private contentSrv: ContentService,
    @Inject(ActionSheetService) private actSheet: ActionSheetService,
    @Inject(ProductService) private prodSrv: ProductService,
    @Inject(ProductsService) private prodsSrv: ProductsService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private router: Router,
  ) { }

  ngOnInit() {
    // setTimeout(() => {
      this.getUser()
      this.getProductToEdit()
      this.setupForm()
      this.getCategories()
      this.setTvaValidators()
    // }, 300)
  }

  getUser(){
    getUserFromLocalStorage().then(user => {
      if(user){
        this.user = user
      }
    })
  }

  getProductToEdit(){
    this.route.paramMap.subscribe(params => {
      const id = params.get('id')
      if(id && id !== '1'){
        this.prodSrv.getProduct(id).subscribe(response => {
          if(response){
            response.subProducts.length ? this.hideIng = true : this.hideIng = false
            let tva: any = response.tva
            tva = tva || tva === 0 ? tva.toString() : ''
            this.product = response;
            this.editMode = true
            this.topToEdit = this.product.toppings;
            this.ingsToEdit = this.product.ings;
            this.subProducts = this.product.subProducts;
            this.toppings = this.product.toppings;
            this.form.get('tva')?.setValue(tva)
            this.form.get('name')?.setValue(this.product.name)
            this.form.get('price')?.setValue(this.product.price)
            this.form.get('cat')?.setValue(this.product.category._id)
            this.form.get('mainCat')?.setValue(this.product.mainCat)
            this.form.get('description')?.setValue(this.product.description)
            this.form.get('qty')?.setValue(this.product.qty)
            this.form.get('sgrTax')?.setValue(this.product.sgrTax)
            this.form.get('order')?.setValue(this.product.order)
            this.form.get('dep')?.setValue(this.product.dep)
          }
        })
       }
    })
  }

  setTvaValidators(){
    const tvaControl = this.form.get('tva')
    this.isTva ? tvaControl?.setValidators([Validators.required]) : tvaControl?.clearValidators()
  }

  async addCat(){
    const response = await this.actSheet.openPayment(CategoryPage, null)
    if(response){
      this.prodSrv.saveCategory(response, this.user.locatie).subscribe(response => {
        console.log(response)
      })
    }
   }


  getCategories(){
  const mainCatInput = this.form.get('mainCats')
  this.categories = this.contentSrv.categoriesNameId$
  this.setMainCats(this.categories)
  }

  setMainCats(cats: any[]){
   const uniqueKeys = [...new Set(cats.map(obj => obj.mainCat))];
   this.mainCats = uniqueKeys.map(name => ({ name }));
  }

  private updateValue = () => {
    if(this.form){
      const mainCatInput = this.form.get('mainCat')
      if(mainCatInput?.value){
       this.categoriesToshow =  this.categories.filter((cat: any) => cat.mainCat === mainCatInput.value)
      }
    }
  }


  onTopRecive(ev: any){
    this.toppings = ev
  }

  onIngRecive(ev: any){
    this.productIngredients = ev
  }

  deleteSub(index: number, id: string){
    if(id){
      this.prodSrv.deleteSubProduct(id).subscribe()
    }
    this.subProducts.splice(index, 1)
  }

 async addSubProduct(){
    const subProduct = await this.actSheet.openModal(SubProductPage,[],false)
    if(subProduct && this.editMode){
      subProduct.product = this.product._id
      this.prodSrv.saveSubProduct(subProduct, this.user.locatie).subscribe(response => {
        this.subProducts.push(response.subProduct)
      })
    } else if(subProduct && !this.editMode){
      this.tempSubArray.push(subProduct)
    }
  }


  async onSubEdit(index: number){
    const subToEdit = this.subProducts[index]
    const editedSub = await this.actSheet.openModal(SubProductPage, subToEdit, false)
    console.log(editedSub)
    if(editedSub){
      this.subProducts[index] = editedSub
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
      cat: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      mainCat: new FormControl(null, {
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
      image: new FormControl(null),
    });
    this.form.get('mainCat')?.valueChanges.subscribe(this.updateValue);
  };


 async saveProduct(){
    if(this.form.valid){
      const productData = new FormData()
      const toppings = this.toppings.length ? JSON.stringify(this.toppings): 'skip';
      const ings = this.productIngredients.length ? JSON.stringify(this.productIngredients) : 'skip';
      const sub = JSON.stringify(this.mapIngs());
      const tempSubs = JSON.stringify(this.tempSubArray);
      productData.append('name', this.form.value.name);
      productData.append('price', this.form.value.price);
      productData.append('category', this.form.value.cat);
      productData.append('mainCat', this.form.value.mainCat);
      productData.append('description', this.form.value.description);
      productData.append('qty', this.form.value.qty);
      productData.append('order', this.form.value.order);
      productData.append('sgrTax', this.form.value.sgrTax);
      productData.append('dep', this.form.value.dep);
      productData.append('tva', this.form.value.tva);
      productData.append('image', this.form.value.image);
      if(toppings !== 'skip'){
        productData.append('toppings', toppings);
      }
      if(ings !== 'skip'){
        productData.append('ings', ings);
      }
      productData.append('sub', sub);
      if(this.editMode){
        this.prodsSrv.editProduct(productData, this.product._id).subscribe(response => {
          showToast(this.toastCtrl, response.message, 3000, '');
          this.router.navigateByUrl('/tabs/office/products')
        })
      } else {
        this.prodsSrv.saveProduct(productData, this.user.locatie).subscribe(response => {
          const product = response.product
          if(product){
            this.tempSubArray.map((obj:any) => {
              obj.product = product._id;
              return obj;
            })
            for(let sub of this.tempSubArray){
               this.prodSrv.saveSubProduct(sub, this.user.locatie).subscribe()
            }
            this.router.navigateByUrl('/tabs/office/products')
            this.form.reset()
            this.toppings = []
            this.productIngredients = []
            this.subProducts = []
          }
        })
      }
    }
  }

  mapIngs(){
    const subs = [ ...this.subProducts]
    const modifySubs = subs.map(sub => {
      const modifyIngs = sub.ings.map((ing: any) => {
        return {qty: ing.qty, ing: ing.ing._id}
      })
      sub.ings = modifyIngs
      return sub
    })
    return modifySubs
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
}
