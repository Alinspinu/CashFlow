import { Preferences } from "@capacitor/preferences";
import User from "src/app/auth/user.model";
import { Product } from "src/app/models/category.model";


export function round(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}


export function getObjectKeys(obj: any): string[] {
  return Object.keys(obj);
}

export function modifyImageURL(url: string): string {
  const parts = url.split('/v1');
  const baseURL = parts[0];
  const cropParameters = '/w_555,h_555,c_fill';
  const cropUrl = baseURL + cropParameters + '/v1' + parts[1];
  return cropUrl;
}

export function formatedDateToShow(date: any){
  if(date){
    const inputDate = new Date(date);
    const hours = inputDate.getHours().toLocaleString();
    const minutes = inputDate.getMinutes().toLocaleString();
    const hour = hours.padStart(2, "0") + ":" + minutes.padStart(2, "0");
    const monthNames = [
      "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
      "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
    ];
    return `${inputDate.getDate().toString().padStart(2, '0')}-${monthNames[inputDate.getMonth()]}-${inputDate.getFullYear()} ora ${hour} `
  } else {
    return 'xx'
  }
  }


  export function getPaymentMethod(paymentObject: any){
      let paymentMethod: {method: string, value: number}[] = []
      Object.keys(paymentObject).forEach(key => {
        if(paymentObject[key] && paymentObject[key] > 0){
          let data = {
            method: key,
            value: paymentObject[key]
          }
          paymentMethod.push(data)
        }
      });
      return paymentMethod

  }

 export function getUserFromLocalStorage(){
   return Preferences.get({key: 'authData'}).then(data  => {
      let user: User
      if(data.value) {
       user = JSON.parse(data.value)
      return user
      } else{
       return null
      }
    })
  }


  export function getSection(product: Product){
    let section = ''
    if(product.mainCat === 'food'){
        if(product.category._id === "64be6a3e3ef7bd6552c84608" || product.category._id === "64be690d3ef7bd6552c84602") {
          section = 'vitrina'
        } else {
          section = 'buc'
        }
    }
    if(product.mainCat === 'bar'){
      section = 'bar'
    }
    if(product.mainCat === "shop"){
      section = 'shop'
    }
    if(product.mainCat === 'coffee'){
        if(product.category._id === "64c8e6c548b61f91a0d45e66" || product.category._id === "64c8e69548b61f91a0d45e64"){
          section = "tea"
        } else {
          section ='coffee'
        }
    }
    return section
  }







