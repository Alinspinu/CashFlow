import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController, NavParams } from '@ionic/angular';
import { ContentService } from 'src/app/content/content.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { CloudinaryPickerPage } from 'src/app/shared/cloudinary-picker/cloudinary-picker.page';
import { Category } from 'src/app/models/category.model';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { emptyCategory } from 'src/app/models/empty-models';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, CloudinaryPickerPage, CapitalizePipe]
})
export class CategoryPage implements OnInit {

  cat: Category = emptyCategory()

  mainCat: any

  image: {path: string, filename: string} = {path: '', filename: ''}

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
  
    this.getCategories()
  }


  getCategories(){
    this.categories = this.contentSrv.categoriesNameId$
    this.setMainCats(this.categories)
    this.getCategory()
    }


    getImage(ev: any){
      this.image = ev[1]
    }

  getCategory(){
    const data = this.navParams.get('options')
    if(data){
      if(data.cat) {
        const cat = data.cat
        this.editMde = true
        this.cat = cat
        this.image = cat.image
        this.catForm.get('name')?.setValue(cat.name)
        this.catForm.get('mainCat')?.setValue(cat.mainCat)
        this.catForm.get('order')?.setValue(cat.order)
      }
      if(data.mainCat){
        this.mainCat = data.mainCat
        const newCat = this.mainCats.find((c:any) => c.name === this.mainCat.name)
        if(!newCat){
          this.mainCats.push({name: this.mainCat.name})
        }
        this.catForm.get('mainCat')?.setValue(this.mainCat.name)
      }
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
      mainCat: new FormControl(null, {
        updateOn: 'change',

      }),
    });
  }



  saveCategory(){
    if(this.catForm.valid){
      this.cat.name = this.catForm.value.name
      this.cat.order = this.catForm.value.order
      this.cat.mainCat = this.catForm.value.mainCat
      this.cat.image = this.image
      this.modalCtrl.dismiss(this.cat)
    }
  }

  close(){
    this.modalCtrl.dismiss(null)
  }



    setMainCats(cats: any[]){
     const uniqueKeys = [...new Set(cats.map(obj => obj.mainCat))];
     this.mainCats = uniqueKeys.map(name => ({ name }));
     console.log(this.mainCats)
    }



}


