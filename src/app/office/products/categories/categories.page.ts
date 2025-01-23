import { Component, EventEmitter, Inject, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { cat, mainCat } from '../products.engine';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { ContentService } from 'src/app/content/content.service';
import { CategoryPage } from '../../CRUD/category/category.page';



@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CategoriesPage implements OnInit, OnDestroy {

  @Input() mainCats: mainCat[] = []
  @Input() addPage: boolean = false
  @Input() kill: boolean | undefined = false

  @Output() mainCat = new EventEmitter();

  constructor(
    @Inject(ActionSheetService) private actSheet: ActionSheetService,
    private contentSrv: ContentService
  ) { }

  ngOnInit() {
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

addMainCat(){

}

async addCat(){
  const response = await this.actSheet.openPayment(CategoryPage, null)
  if(response){
    this.contentSrv.saveCategory(response).subscribe(response => {

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
