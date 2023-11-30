import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";
import { BehaviorSubject, from, map, Observable, take, tap } from "rxjs";
import {Category, Product} from "./category.model"


@Injectable({providedIn: 'root'})



export class ContentService{

  baseUrl: string = 'http://localhost:8080/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/';

  public emptyCategory: Category = {_id: '', mainCat: '', name: '', product: [], image: {path: '', filename:''}, order: 0}
  public emptyProduct: Product = {
    _id: '',
    name: '',
    qty: '',
    price: 0,
    tva: '',
    dep: '',
    order: 0,
    description: '',
    quantity: 0,
    image: {path: '', filename: ''},
    subProducts: [],
    category: this.emptyCategory,
    available: false,
    total: 0,
    longDescription: '',
    ingredients: [],
    mainCat: '',
    nutrition: {
      energy:{kJ: 0, kcal: 0},
      fat: {all: 0, satAcids: 0},
      carbs: {all: 0, sugar: 0},
      salts: 0,
      protein: 0,
    },
    additives: [],
    allergens: [],
    paring: [],
    toppings: [],
  }
  private categoryState!: BehaviorSubject<Category[]>;
  public categorySend$!: Observable<Category[]>;
  category: Category[] = [this.emptyCategory];


  constructor(private http: HttpClient){
    this.categoryState = new BehaviorSubject<Category[]>([this.emptyCategory]);
    this.categorySend$ =  this.categoryState.asObservable();
  }


    getData(){
      Preferences.get({key: 'categories'}).then(data => {
        if(data.value){
          const cats = JSON.parse(data.value)
          this.category = cats
          this.categoryState.next([...this.category])
        }
      })
      return this.http.get<Category[]>(`${this.baseUrl}api-true/get-cats`).pipe(take(1), tap(res => {
        this.category = this.sortData(res)
        this.categoryState.next([...this.category]);
        Preferences.set({key: 'categories', value: JSON.stringify(this.category)})
      }));
    }

    get categoriesNameId$(){
      return  this.category.map(({_id, name, mainCat}) => ({_id, name, mainCat}))
      }




    private sortData(data: Category[]){
      let sortedCategories: Category[] = [];
      data.sort((a, b) => a.order - b.order);
      for(let category of data){
          category.product.sort((a,b)=> a.order - b.order);
          for(let product of category.product){
            product.subProducts.sort((a,b) => a.order - b.order);
          }
          sortedCategories.push(category);
      }
      return sortedCategories;
    }

}
