import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { WebRTCService } from '../webRTC.service';
import { Bill, BillProduct } from 'src/app/models/table.model';
import { round } from 'src/app/shared/utils/functions';
import {ContentService} from '../content.service';
import { take, tap } from 'rxjs';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { TipsPage } from './tips/tips.page';

@Component({
  selector: 'app-user-display',
  templateUrl: './user-display.page.html',
  styleUrls: ['./user-display.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe, TipsPage]
})
export class UserDisplayPage implements OnInit, AfterViewInit {

  bill!: Bill
  isLoading: boolean = false

  mainCategoryToShowName!: string;
  categoryToShowId!: string;

  productsToShow: any [] = []

  enableScrollChange: boolean = true

  categories!: any[];
  mainCats!: any
  selectedMainCat!: any
  products!: any
  sortMain: string[] = ['food', 'coffee', 'bar', 'shop']


  hideBill: boolean = false

  @ViewChildren('myCard') myCards!: QueryList<any>;
  @ViewChildren('categoryChip') myCats!: QueryList<any>;


  constructor(
    private webRTC: WebRTCService,
    private contentService: ContentService,
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
    this.getBill()
    this.getCategories()
    this.selectMainCat('food')
    this.getInvite()
    // setTimeout(() => {
    // }, 1000 )

  }

  ngAfterViewInit(): void {
       setTimeout(() => {
        //  this.changeIconsColor()
    }, 2000 )

  }



  getBill(){
    this.webRTC.getProductAddedObservable().subscribe(response => {
      if(response){
        this.bill = JSON.parse(response)
      }
      })
  }


  getInvite(){
    console.log('hit the function')
    this.webRTC.getInviteToTip().subscribe(response => {
      console.log(response)
      if(response === 'invite'){
        this.hideBill = true
      } else {
        this.hideBill = false
      }
    })
  }



  reciveTipsValue(ev: any){
    console.log(ev)
    if(ev || ev === 0){
      this.hideBill = false
      this.webRTC.getUserTip(ev)
    }
  }


  catScroll(catId: string){
    this.myCats.forEach(cat => {
      const cardEl: HTMLElement = cat.nativeElement
      if(catId === cardEl.id){
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }

    })

  }
//   @ViewChildren('icon') myIcons!: QueryList<any>;
// changeIconsColor(){
//     this.myIcons.forEach(icon => {
//      if(icon){
//       console.log(icon)
//        const svgElement = icon.el.shadowRoot.querySelector('svg');
//        console.log(svgElement)
//      }
//     })

// }




  onScroll(event: CustomEvent) {
    if(this.enableScrollChange){
      this.myCards.forEach(card => {
        const cardElement: HTMLElement = card.nativeElement;
        setTimeout(() => {
          const catId = cardElement.dataset['cat']
          const isInViewPort = this.isInViewport(cardElement)
          let viewPortId = []
          if(isInViewPort && catId){
            viewPortId.push(catId)
          }
          const catIdToShow = this.findStringWithMostDuplicates(viewPortId)
          if(catIdToShow.length)
          this.categoryToShowId = catIdToShow
        }, 300)
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
    this.enableScrollChange = false
    const catIndex = this.categories.findIndex(category => category._id === cat)
    const cardId = this.categories[catIndex].product[0]._id
    this.scrollToCard(cardId)
    this.categoryToShowId = cat
  }

  selectMainCat(name: string){
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
  }


  getCategories(){
    this.contentService.categorySend$
    .pipe(
      take(1),
      tap(response => {
        if(response.length > 1){
          this.categories = [...response]
          this.isLoading = false
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



  modifyImageURL(url: string): string {
    const parts = url.split('/v1');
    const baseURL = parts[0];
    const cropParameters = '/w_555,h_555,c_fill';
    const cropUrl = baseURL + cropParameters + '/v1' + parts[1];
    return cropUrl;
  }

  calcProductTotal(products: BillProduct[]){
    let total = 0
    products.forEach(el => {
        total += +el.total
    })
    return total
  }

  roundInHtml(num: number){
    return round(num)
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
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


  isInViewport(card: HTMLElement): boolean {
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + window.innerHeight;
    const cardRect = card.getBoundingClientRect();
    const cardTop = cardRect.top + window.scrollY;
    const cardBottom = cardTop + cardRect.height;
    return cardBottom >= viewportTop && cardTop <= viewportBottom;
  }


}
