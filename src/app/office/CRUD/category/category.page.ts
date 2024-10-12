import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController, NavParams } from '@ionic/angular';
import { ImagePickerComponent } from 'src/app/shared/image-picker/image-picker.component';
import { base64toBlob } from 'src/app/shared/utils/base64toBlob';
import { ContentService } from 'src/app/content/content.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { showToast } from 'src/app/shared/utils/toast-controller';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, ImagePickerComponent]
})
export class CategoryPage implements OnInit {


  catForm!: FormGroup
  categories: any = []
  mainCats: any = []
  newMainCat: boolean = false
  editMde: boolean = false
  categoryId!: string

  constructor(
    private modalCtrl: ModalController,
    @Inject(ContentService) private contentSrv: ContentService,
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private toastCtrl: ToastController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.setUpForm()
    this.getCategoryId()
    this.getCategories()
  }


  getCategoryId(){
    const cat = this.navParams.get('options')
    if(cat){
      this.categoryId = cat._id
      this.editMde = true
      this.catForm.get('name')?.setValue(cat.name)
      this.catForm.get('mainCat')?.setValue(cat.mainCat)
      this.catForm.get('catId')?.setValue(cat._id)
      this.catForm.get('order')?.setValue(cat.order)
    }
  }

  setUpForm(){
    this.catForm = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      order: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      catId: new FormControl(null, {
        updateOn: 'change',
      }),
      mainCat: new FormControl(null, {
        updateOn: 'change',

      }),
      image: new FormControl(null),
    });
  }



  saveCategory(){
    if(this.catForm.valid){
      const categoryData = new FormData()
      categoryData.append('name', this.catForm.value.name)
      categoryData.append('order', this.catForm.value.order)
      categoryData.append('mainCat', this.catForm.value.mainCat)
      categoryData.append('image', this.catForm.value.image)
      categoryData.append('categoryId', this.catForm.value.catId)
      this.modalCtrl.dismiss(categoryData)
    }
  }

  cancel(){
    this.modalCtrl.dismiss(null)
  }

  getCategories(){
    this.categories = this.contentSrv.categoriesNameId$
    this.setMainCats(this.categories)
    }

    setMainCats(cats: any[]){
     const uniqueKeys = [...new Set(cats.map(obj => obj.mainCat))];
     this.mainCats = uniqueKeys.map(name => ({ name }));
    }

   async addMainCat(){
    const response = await this.actionSrv.addMainCat()
    if(response){
      const index = this.mainCats.findIndex((obj:any) => obj.name === response[0])
      if(index === -1){
        this.mainCats.push({name: response[0]})
        showToast(this.toastCtrl, `Categoria ${response[0]} a fost adăugată`, 4000, '' )
      } else {
        showToast(this.toastCtrl, `Mai avem o categorie părinte cu numele ${response[0]}!`, 4000, '' )
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
          console.log()
      } catch (error) {
        console.log(error);
      };
    } else {
      imageFile = imageData;
    };
    this.catForm.patchValue({image: imageFile});
  }
}


