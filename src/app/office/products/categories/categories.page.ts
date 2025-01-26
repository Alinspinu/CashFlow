import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy,  Output,  SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { cat, mainCat } from '../products.engine';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { ContentService } from 'src/app/content/content.service';
import { CategoryPage } from '../../CRUD/category/category.page';
import { Category } from 'src/app/models/category.model';



@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CategoriesPage implements OnChanges, OnDestroy {

  mainCatt!: mainCat

  @Input() mainCats: mainCat[] = []
  @Input() addPage: boolean = true
  @Input() kill: boolean  = true
  @Output() mainCat = new EventEmitter();

  constructor(
    @Inject(ActionSheetService) private actSheet: ActionSheetService,
    private contentSrv: ContentService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mainCats']) this.mainCats = changes['mainCats'].currentValue
  }



  ngOnDestroy(): void {
   if(this.kill){
     this.restetCats()
   }
  }

  selectCat(cat: cat, mainCat: mainCat){
    this.restetCats()
    cat.active = true
    mainCat.active = true
    this.mainCat.emit(mainCat)
  }

  selectMain(cat: mainCat ){
    this.restetCats()
    this.mainCat.emit(cat)
    this.mainCatt = cat
    cat.active = true
  }


restetCats(){
  for(let main of this.mainCats){
    main.active = false
    for(let cat of main.cat){
      cat.active = false
    }
  }
}

async addMainCat(){
  const response = await this.actSheet.addMainCat()
  if(response){
    this.restetCats()
    const index = this.mainCats.findIndex((obj:any) => obj.name === response[0])
    if(index === -1){
      const newMainCat: mainCat = {
        name: response[0],
        products: 0,
        active: true,
        cat: [],
        icon: 'assets/icon/plant.svg'
      }
      this.mainCats.push(newMainCat)
    } else {
     
    }
  }
  }

async addCat(){
  const response: Category = await this.actSheet.openPayment(CategoryPage, {mainCat: this.mainCats.find(c => c.active)}) 
  if(response){
   console.log(response)
    this.contentSrv.saveCategory(response).subscribe({
      next: (response) => {
        console.log(response)
        const activeMainCat = this.mainCats.find(c => c.active)
        if(activeMainCat){
          activeMainCat.cat.push({name: response.cat.name, active: true, _id: response.cat._id})
        }
      }
    })
  }
 }



    //  async editCat(){
    //    const sortedCategories = this.categories.sort((a,b) => a.name.localeCompare(b.name))
    //    const categoryId = await this.actSheet.chooseCategory(sortedCategories)
    //    if(categoryId) {
    //      const response = await this.actSheet.openPayment(CategoryPage, categoryId)
    //      if(response){
    //        this.contentSrv.editCategory(response).subscribe(response => {
    //          if(response){
    //           // showToast(this.toastCtrl, response.message, 2000)
    //          }
    //        })
    //      }
    //    }
    //  }

}
