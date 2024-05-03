import { Component, OnInit, QueryList, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { ContentService } from '../../content.service';
import { take, tap } from 'rxjs';
import { BillPage } from '../bill/bill.page';
import { WebRTCService } from '../../webRTC.service';
import { Bill } from 'src/app/models/table.model';


@Component({
  selector: 'app-meniu',
  templateUrl: './meniu.page.html',
  styleUrls: ['./meniu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe, BillPage]
})
export class MeniuPage implements OnInit {


  @ViewChildren('myCard') myCards!: QueryList<any>;
  @ViewChildren('categoryChip') myCats!: QueryList<any>;
  @ViewChild('scrollableElement') container!: ElementRef

  mainCategoryToShowName!: string;
  categoryToShowId!: string;

  productsToShow: any [] = []

  enableScrollChange: boolean = true

  sideColSize: number = 1
  menuColSize: number = 10

  fullScreenUrl: string = 'assets/icon/arrows.svg'

  categories!: any[];
  mainCats!: any
  selectedMainCat!: any
  products!: any
  sortMain: string[] = ['food', 'coffee', 'bar', 'shop']

  bill!: Bill

  cats:any = [
    {
      name: 'food',
      url: 'assets/icon/food.svg',
      urlW: 'assets/icon/food-w.svg',
    },
    {
      name: 'coffee',
      url: 'assets/icon/coffee.svg',
      urlW: 'assets/icon/coffee-w.svg',
    },
    {
      name: 'bar',
      url: 'assets/icon/bar.svg',
      urlW: 'assets/icon/bar-w.svg',
    },
    {
      name: 'shop',
      url: 'assets/icon/shop.svg',
      urlW: 'assets/icon/shop-w.svg',
    },

  ]


  constructor(
    private contentService: ContentService,
    private webRTC: WebRTCService,
  ) { }

  ngOnInit() {
    this.getCategories()
    this.selectMainCat('food', 0)
    this.getBill()
  }


  catScroll(catId: string){
    this.myCats.forEach(cat => {
      const cardEl: HTMLElement = cat.nativeElement
      if(catId === cardEl.id){
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }

    })

  }


  getBill(){
    this.webRTC.getProductAddedObservable().subscribe(response => {
      if(response){
        this.bill = JSON.parse(response)
        if(this.bill.products.length){
          this.bill.products.reverse()
          this.sideColSize = 0.7
          this.menuColSize = 8
        } else {
          this.sideColSize = 1
          this.menuColSize = 10
        }
      } else {
        this.sideColSize = 1
        this.menuColSize = 10
        const foodIndex = this.cats.findIndex((cat: any) => cat.name = 'food')
        this.selectMainCat('food', foodIndex)
        this.selectCategory('64be665dd6abf741cec1b9b0')
      }
      })
  }

  toggleFullscreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
      this.fullScreenUrl = 'assets/icon/fullscreen.svg'
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.fullScreenUrl = 'assets/icon/arrows.svg'
      }
    }
  }

  onScroll(event: CustomEvent) {
    if(this.enableScrollChange){
      this.myCards.forEach(card => {
        const cardElement: HTMLElement = card.nativeElement;
        const catId = cardElement.dataset['cat']
          const isInViewPort = this.isInViewport(cardElement, this.container.nativeElement)
          let viewPortId: any = []
          if(isInViewPort && catId){
            viewPortId.push(catId)
          }
          const catIdToShow = this.findStringWithMostDuplicates(viewPortId)
          if(catIdToShow.length)
          this.categoryToShowId = catIdToShow
      })
      this.catScroll(this.categoryToShowId)
    }
  }

  scrollToCard(cardId: string) {
    const cardElement = this.myCards.find(card => card.nativeElement.id === cardId);
    if (cardElement) {
      cardElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      setTimeout(()=> {
        this.enableScrollChange = true
      }, 1000)
    }
  }


  selectCategory(cat: string){
    console.log(cat)
    this.enableScrollChange = false
    const catIndex = this.categories.findIndex(category => category._id === cat)
    const cardId = this.categories[catIndex].product[0]._id
    this.scrollToCard(cardId)
    this.categoryToShowId = cat
  }

  selectMainCat(name: string, index: number){
    this.selectedMainCat = this.mainCats[name]
    this.productsToShow = []
    this.selectedMainCat.show = true
    this.mainCategoryToShowName = name
    this.selectedMainCat.forEach((cat:any) => {
      cat.product.forEach((prod: any) => {
        this.productsToShow.push(prod)
      })
    })
    this.categoryToShowId = this.selectedMainCat[0]._id
    if(index !== 0){
      let url = ''
      const clickedCategory = this.cats[index];
      url = clickedCategory.url
      clickedCategory.url = clickedCategory.urlW
      setTimeout(() => {
        this.cats.splice(index, 1)
        this.cats.unshift(clickedCategory);
        clickedCategory.url = url
      }, 100)
    }
  }


  getCategories(){
    this.contentService.categorySend$
    .pipe(
      take(1),
      tap(response => {
        if(response.length > 1){
          this.categories = [...response]
          let tempMainCats: any = []
          for (const document of this.categories) {
            const category = document.mainCat;
            if (!tempMainCats[category]) {
              tempMainCats[category] = [];
              tempMainCats[category].push(document);
            } else{
              tempMainCats[category].push(document);
            }
          }
          let sortedData: {[category: string]: any[]} = {};
          ['food', 'coffee', 'bar', 'shop'].forEach(key => {
            if (tempMainCats.hasOwnProperty(key)) {
              sortedData[key] = tempMainCats[key];
            }
          });
          this.mainCats = sortedData
        }
      })
    ).subscribe()
  }


  findStringWithMostDuplicates(arr: any[]) {
    const counts: any = {};
    arr.forEach(str => {
        counts[str] = (counts[str] || 0) + 1;
    });
    let maxCount = 0;
    let stringWithMostDuplicates = '';
    for (const str in counts) {
        if (counts.hasOwnProperty(str) && counts[str] >= maxCount) {
            maxCount = counts[str];
            stringWithMostDuplicates = str;
        }
    }
    return stringWithMostDuplicates;
}


isInViewport(card: HTMLElement, container: HTMLElement): boolean {
  const containerRect = container.getBoundingClientRect();
  const containerTop = containerRect.top;
  const containerBottom = containerTop + containerRect.height;

  const cardRect = card.getBoundingClientRect();
  const cardTop = cardRect.top;
  const cardBottom = cardTop + cardRect.height;

  return cardBottom >= containerTop && cardTop <= containerBottom;
}


  modifyImageURL(url: string): string {
    const parts = url.split('/v1');
    const baseURL = parts[0];
    const cropParameters = '/w_555,h_555,c_fill';
    const cropUrl = baseURL + cropParameters + '/v1' + parts[1];
    return cropUrl;
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }


uppercaseAllLetters(inputString: string): string {
  return inputString.replace(/[a-zăâîțș]/gi, (letter) => letter.toUpperCase());
}

capitalizeWords(inputString: string): string {
  return inputString
      .split(/\s+/) // Split the string into words
      .map(word => {
          // Capitalize the first letter and convert the rest to lowercase
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' '); // Join the words back into a single string
}


}
