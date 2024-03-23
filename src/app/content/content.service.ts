import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";
import { BehaviorSubject, from, map, Observable, take, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import User from "../auth/user.model";
import {Category, Product} from "../models/category.model"


@Injectable({providedIn: 'root'})



export class ContentService{

  user!: User

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
    ings: [],
    printer: 'main',
    showSub: false,
    discount: 0,
    sgrTax: false,
  }
  private categoryState!: BehaviorSubject<Category[]>;
  public categorySend$!: Observable<Category[]>;
  category: Category[] = [this.emptyCategory];


  constructor(private http: HttpClient, private authSrv: AuthService){
    this.categoryState = new BehaviorSubject<Category[]>([this.emptyCategory]);
    this.categorySend$ =  this.categoryState.asObservable();
  }



    getData(locatie: string){
      Preferences.get({key: 'categories'}).then(data => {
        if(data.value){
          const cats = JSON.parse(data.value)
          this.category = cats
          this.categoryState.next([...this.category])
        }
      })
      const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
      return this.http.get<Category[]>(`${environment.BASE_URL}cat/get-cats?loc=${locatie}`, {headers}).pipe(take(1), tap(res => {
        this.category = this.sortData(res)
        this.categoryState.next([...this.category]);
        Preferences.set({key: 'categories', value: JSON.stringify(this.category)})
      }));
    }

    editCategoryProductsDiscount(category: {cat: string, precent: number}[]){
      category.forEach( cat => {
        const category = this.category.find(el => el._id === cat.cat)
        if(category){
          category.product.forEach(el => el.discount = cat.precent)
        }
      })
      this.categoryState.next([...this.category])
    }

    editProductDiscount(products: {productId: string, precent: number}[]){
      products.forEach(product => {
        this.category.forEach( cat => {
          let prod = cat.product.find(el => el._id === product.productId)
          if(prod)
            prod.discount = product.precent
        })
      })
      this.categoryState.next([...this.category])
    }

    get categoriesNameId$(){
      return  this.category.map(({_id, name, mainCat}) => ({_id, name, mainCat}))
      }

      setDiscount(data: any[]){
        return this.http.post<{message: string}>(`${environment.BASE_URL}product/discount`, {data: data})
      }

      setProdDisc(data: any[]){
        return this.http.post<{message: string}>(`${environment.BASE_URL}product/disc-prod`, {data: data})
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

    editProductQuantity(id: string, qty: number, prodName: string){
      const catIndex = this.category.findIndex(cat => cat.name === "PATISERIE")
      const productIndex = this.category[catIndex].product.findIndex(prod => prod._id === id)
      if(productIndex !== -1){
        const prod = this.category[catIndex].product[productIndex]
        if(prod.subProducts.length){
          const subIndex = prod.subProducts.findIndex(sub => prodName.includes(sub.name))
          console.log(subIndex, prod)
          const sub = prod.subProducts[subIndex]
          sub.ings[0].ing.qty -= qty
          this.categoryState.next([...this.category])
        } else {
          prod.ings[0].ing.qty -= qty
          this.categoryState.next([...this.category])
        }
      }
    }



}
