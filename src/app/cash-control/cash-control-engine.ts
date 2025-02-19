import { Category } from "../models/category.model"
import { Bill, BillProduct } from "../models/table.model"
import { round } from "../shared/utils/functions"


export function getSection(product: BillProduct){
  let section = ''
  if(product.mainCat === 'food'){
      if(product.category === "64be6a3e3ef7bd6552c84608" || product.category=== "64be690d3ef7bd6552c84602") {
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
      if(product.category === "64c8e6c548b61f91a0d45e66" || product.category === "64c8e69548b61f91a0d45e64"){
        section = "tea"
      } else {
        section ='coffee'
      }
  }
  if(product.mainCat === ''){
    section = 'shop'
  }
  return section
}


export function getProducts(orders: Bill[]){
  let products: BillProduct[] = []
  let section: section[] = []
  let openProducts: BillProduct[] = []
  let openSection: section = {name: 'Deschise', productsCount: 0, total: 0, class: 'sand'}
  for( let order of orders) {
    if(order.status === 'done'){
      for( let product of order.products){
        const clonedProduct = JSON.parse(JSON.stringify(product))  as BillProduct
        const existingProduct = products.find(p => p.name === clonedProduct.name)
        if(existingProduct){
          existingProduct.quantity += clonedProduct.quantity
          existingProduct.total = round(existingProduct.total + (clonedProduct.quantity * +clonedProduct.price))
          existingProduct.discount = round(existingProduct.discount+ clonedProduct.discount)
          if(clonedProduct.toppings.length){
            for(let topping of clonedProduct.toppings){
              const existingTopping = existingProduct.toppings.find(t => t.name === topping.name)
              if(existingTopping){
                existingTopping.qty = round(existingTopping.qty + topping.qty)
              } else {
                existingProduct.toppings.push(topping)
              }
            }
          }
        } else {
          clonedProduct.total = round(clonedProduct.quantity * +clonedProduct.price)
          products.push(clonedProduct)
        }
      }
    } else {
      for( let product of order.products){
        const clonedProduct = JSON.parse(JSON.stringify(product)) as BillProduct
        const existingProduct = openProducts.find(p => p.name === clonedProduct.name)
        if(existingProduct){
          existingProduct.quantity += clonedProduct.quantity
          existingProduct.total = round(existingProduct.total + (clonedProduct.quantity * +clonedProduct.price))
          existingProduct.discount = round(existingProduct.discount+ clonedProduct.discount)
          if(clonedProduct.toppings.length){
            for(let topping of clonedProduct.toppings){
              const existingTopping = existingProduct.toppings.find(t => t.name === topping.name)
              if(existingTopping){
                existingTopping.qty = round(existingTopping.qty + topping.qty)
              } else {
                existingProduct.toppings.push(topping)
              }
            }
          }
          openSection.productsCount += clonedProduct.quantity
          openSection.total = round(openSection.total + (+clonedProduct.price * clonedProduct.quantity))
        } else {
          clonedProduct.total = round(clonedProduct.quantity * +clonedProduct.price)
          openProducts.push(clonedProduct)
          openSection.productsCount += clonedProduct.quantity
          openSection.total = round(openSection.total + +clonedProduct.total)
        }
      }
    }
  }





  for(let product of products){
    if(!product.section){
      product.section = getSection(product)
    }
    if(!product.section){
    }

    const clonedProduct = JSON.parse(JSON.stringify(product)) as BillProduct;
    const existingSection = section.find(s => s.name === clonedProduct.section)
    if(existingSection){
      existingSection.productsCount = round(existingSection.productsCount + clonedProduct.quantity)
      existingSection.total = round(existingSection.total + +clonedProduct.total)
    } else {
      const newSection = {
        name:  clonedProduct.section,
        total: +clonedProduct.total,
        productsCount: clonedProduct.quantity,
        class: clonedProduct.section === 'buc' ? 'green' :
        clonedProduct.section === 'tea' ? 'red' :
        clonedProduct.section === 'coffee' ? 'orange' :
        clonedProduct.section === 'shop' ? 'sand' :
        clonedProduct.section === 'bar' ? 'blue' : 'turq'
      }
      section.push(newSection)
    }
  }
  section.push(openSection)
  section.sort((a,b) => b.total - a.total)
  products.sort((a,b) => b.quantity - a.quantity )
  return {products: products, sections: section, openProducts: openProducts}
}


  export function calcCashIn(orders: Bill[]){
    let userCash = 0
    let userCard = 0
    let userViva = 0
    let userVoucher = 0
    let userOnline = 0
    let userTips = 0;
    let discount = 0
    let userTotal = 0;
    orders.forEach((order: Bill) => {
          if(order.payment.cash > 0) userCash = round(userCash + order.payment.cash)
          if(order.payment.card > 0) userCard = round(userCard + order.payment.card)
          if(order.payment.viva > 0) userViva = round(userViva + order.payment.viva)
          if(order.payment.voucher > 0) userVoucher = round(userVoucher + order.payment.voucher)
          if(order.payment.online > 0) userOnline = round( userOnline + order.payment.online)
          if(order.tips) userTips = round(userTips + order.tips)
          if(order.discount) discount = round(discount + order.discount)
      })
      userTotal = round(userCash + userCard +userOnline + userViva + userVoucher + userTips)
      return {
        cash: userCash,
        online: userOnline,
        card: userCard,
        voucher: userVoucher,
        discount: discount,
        viva: userViva,
        tips: userTips,
        total: userTotal,
      }
  }



  export function showPayment(payment: any, colors: any, orders: Bill[]){
    let method = []
      if(payment.cash && payment.cash > 0){
        method.push({
          label: 'Numerar',
          value: payment.cash,
          css: 'bullet cash-color',
          color: colors.green,
          contrast: colors.greenContrast,
          orders: orders.reduce((acc, item) => {
            if (item.payment.cash > 0) {
              acc++;
            }
            return acc;
          }, 0)

        })
      }
      if(payment.card && payment.card > 0){
        method.push({
          label: 'Card',
          value: payment.card,
          css: 'bullet card-color',
          color: colors.blue,
          contrast: colors.turqoiseContrast,
          orders: orders.reduce((acc, item) => {
            if (item.payment.card > 0) {
              acc++;
            }
            return acc;
          }, 0)
        })
      }
      if(payment.voucher && payment.voucher > 0){
        method.push({
          label: 'Voucher',
          value: payment.voucher,
          css: 'bullet voucher-color',
          color: colors.red,
          contrast: colors.redContrast,
          orders: orders.reduce((acc, item) => {
            if (item.payment.voucher > 0) {
              acc++;
            }
            return acc;
          }, 0)
        })
      }
      if(payment.viva && payment.viva > 0){
        method.push({
          label: 'Viva',
          value: payment.viva,
          css: 'bullet viva-color',
          color: colors.turqoise,
          contrast: colors.turqoiseContrast,
          orders: orders.reduce((acc, item) => {
            if (item.payment.viva > 0) {
              acc++;
            }
            return acc;
          }, 0)
        })
      }
      if(payment.online && payment.online > 0){
        method.push({
          label: 'Online',
          value: payment.online,
          css: 'bullet online-color',
          color: colors.turqoise,
          contrast: colors.turqoiseContrast,
          orders: orders.reduce((acc, item) => {
            if (item.payment.online > 0) {
              acc++;
            }
            return acc;
          }, 0)
        })
      }
      if(payment.tips && payment.tips > 0){
        method.push({
          label: 'Tips',
          value: payment.tips,
          css: 'bullet tips-color',
          color: colors.orange,
          contrast: colors.orangeContrast,
          orders: orders.reduce((acc, item) => {
            if (item.tips > 0) {
              acc++;
            }
            return acc;
          }, 0)
        })
      }
      // if(payment.discount && payment.discount > 0){
      //   method.push({
      //     label: 'Discount',
      //     value: -payment.discount,
      //     css: 'bullet discount-color',
      //     color: colors.red,
      //     contrast: colors.redContrast,
      //     orders: orders.reduce((acc, item) => {
      //       if (item.discount > 0) {
      //         acc++;
      //       }
      //       return acc;
      //     }, 0)
      //   })
      // }
      return method.sort((a,b) => b.value-a.value)
   }


  export function setZeroDiscount(cats: Category[]){
    let dataToSend: any = []
    cats.forEach(cat => {
      cat.product.forEach(product => {
        if(product.discount > 0){
          const data = {
            precent: 0,
            productId: product._id,
            name: product.name
          }
            dataToSend.push(data)
        }
      })
    })
    return dataToSend
  }




   export function calcHours(bills: Bill[], total: number){
    let hours: hour[] = []
    bills.forEach(bill => {
      if(bill.production && bill.status === 'done') {
        const h = new Date(bill.updatedAt).getHours()
        const exsitingHour = hours.find(p => (p.hour === h))
        if(exsitingHour){
          exsitingHour.total = round(exsitingHour.total + bill.total)
          exsitingHour.procent = round(exsitingHour.total * 100 / total)
        } else {
          const hour: hour = {
            hour: h,
            stHour: `${h}:01 - ${h +1}:00`,
            procent: round(bill.total * 100 / total),
            total: bill.total
          }
          hours.push(hour)
        }
      }
    })
    hours.sort((a,b) => (a.hour - b.hour))
    return hours
  }





  export interface Method{
    label: string,
    value: number
  }

export interface section{
    name: string,
    productsCount: number,
    total: number,
    class: string
}


  export interface PaymentDetail {
    cash: number,
    online: number,
    card: number,
    voucher: number,
    discount: number,
    viva: number,
    tips: number,
    total: number,
  }

  export interface hour {
    hour: number,
    stHour: string,
    procent: number,
    total: number
  }




  export function emptyToatals(){
    const totals: PaymentDetail = {
      cash: 0,
      online: 0,
      card: 0,
      voucher: 0,
      discount: 0,
      viva: 0,
      tips: 0,
      total: 0,
    }
    return totals
  }


  function arraysAreEqual(arr1: any, arr2: any) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    for (let i = 0; i < sortedArr1.length; i++) {
        const obj1 = sortedArr1[i];
        const obj2 = sortedArr2[i];

        if (!objectsAreEqual(obj1, obj2)) {
            return false;
        }
    }
    return true;
  }

  function objectsAreEqual(obj1: any, obj2: any) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
