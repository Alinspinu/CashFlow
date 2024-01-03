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

  isTva: boolean = true

  constructor(
    @Inject(ContentService) private contentSrv: ContentService,
    @Inject(ActionSheetService) private actSheet: ActionSheetService,
    @Inject(ProductService) private prodSrv: ProductService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getProductToEdit()
    this.setupForm()
    this.getCategories()
    this.setTvaValidators()
  }

  getProductToEdit(){
    this.route.paramMap.subscribe(params => {
      const id = params.get('id')
      if(id && id !== '1'){
        this.prodSrv.getProduct(id).subscribe(response => {
          if(response){
            response.subProducts.length ? this.hideIng = true : this.hideIng = false
            this.product = response;
            console.log(response)
            this.editMode = true
            this.topToEdit = this.product.toppings;
            this.ingsToEdit = this.product.ings;
            this.subProducts = this.product.subProducts;
            this.toppings = this.product.toppings;
            this.form.get('name')?.setValue(this.product.name)
            this.form.get('price')?.setValue(this.product.price)
            this.form.get('cat')?.setValue(this.product.category._id)
            this.form.get('mainCat')?.setValue(this.product.mainCat)
            this.form.get('description')?.setValue(this.product.description)
            this.form.get('qty')?.setValue(this.product.qty)
            this.form.get('order')?.setValue(this.product.order)
            this.form.get('dep')?.setValue(this.product.dep)
            this.form.get('tva')?.setValue(this.product.tva ? this.product.tva.toString() : '')
            this.form.get('printer')?.setValue(this.product.printer)
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
    const response = await this.actSheet.openModal(CategoryPage, null, false)
    if(response){
      this.prodSrv.saveCategory(response).subscribe(response => {
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
      this.prodSrv.saveSubProduct(subProduct).subscribe(response => {
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
      const toppings = JSON.stringify(this.toppings);
      const ings = JSON.stringify(this.productIngredients);
      const sub = JSON.stringify(this.subProducts);
      const tempSubs = JSON.stringify(this.tempSubArray);
      productData.append('name', this.form.value.name);
      productData.append('price', this.form.value.price);
      productData.append('category', this.form.value.cat);
      productData.append('mainCat', this.form.value.mainCat);
      productData.append('description', this.form.value.description);
      productData.append('qty', this.form.value.qty);
      productData.append('order', this.form.value.order);
      productData.append('dep', this.form.value.dep);
      productData.append('tva', this.form.value.tva);
      productData.append('image', this.form.value.image);
      productData.append('printer', this.form.value.printer);
      productData.append('toppings', toppings);
      productData.append('ings', ings);
      productData.append('sub', sub);
      console.log(ings)
      if(this.editMode){
        this.prodSrv.editProduct(productData, this.product._id).subscribe(response => {
          showToast(this.toastCtrl, response.message, 3000);
          this.router.navigateByUrl('/tabs/office/products')
        })
      } else {
        this.prodSrv.saveProduct(productData).subscribe(response => {
          const product = response.product
          if(product){
            this.tempSubArray.map((obj:any) => {
              obj.product = product._id;
              return obj;
            })
            for(let sub of this.tempSubArray){
               this.prodSrv.saveSubProduct(sub).subscribe()
            }
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
}
