import { Product, saleLog, SubProduct } from "src/app/models/category.model"
import { formatDayDate, formatTitleDate, round } from "src/app/shared/utils/functions"



export interface SaleLog{
    name: string,
    date: string,
    qty: number,
    total: number,
    production: number
    discount: number,
    days: day[]
    hours:hour[],
    subLog?: SaleLog[]
}

interface day  {
    date: string,
    day: string,
    qty: number,
    total: number
}
interface hour{
    date: string,
    label: string,
    qty: number
}


export function emptyLog() {
  const log: SaleLog = {
    name: '',
    date: '',
    qty: 0,
    total: 0,
    production: 0,
    discount: 0,
    days: [],
    hours: [],
    subLog:[]
  }
  return log
}




export function updateLog(product: Product | SubProduct, start: string, end: string | undefined){
  let saleLog: SaleLog = emptyLog()
  saleLog.name = product.name
  const startDate = new Date(start)
  startDate.setHours(0,0,0,0)
  if(end){
    const endDate = new Date(end)
    endDate.setHours(0,0,0,0)
    const logs  = product.saleLog.filter((l: any) => {
     const logDate = new Date(l.date).setHours(0,0,0,0)
     return logDate >= startDate.getTime() && logDate <= endDate.getTime()
    })
    if(logs.length){
      saleLog.date = `${formatTitleDate(logs[0].date)} -- ${formatTitleDate(logs[logs.length -1].date)}`
      saleLog.production = calcProductProductions(product, startDate, endDate)
      saleLog.hours = calcHours(logs)
      saleLog.subLog = getSubProducts(product, start, end)
      for(let log of logs){
        saleLog.discount = round(saleLog.discount + log.discount)
        saleLog.total = round(saleLog.total + log.total)
        saleLog.qty = round(saleLog.qty + log.qty)
        const day = {
          date: log.date,
          day: formatDayDate(log.date),
          qty: log.qty,
          total: log.total
        }
        saleLog.days.push(day)
      }
    }
  } else{
    const log  = product.saleLog.find(l => new Date(l.date).setHours(0,0,0,0) === startDate.getTime())
    if(log){
      saleLog.date = formatTitleDate(log.date)
      saleLog.discount = log.discount
      saleLog.qty = log.qty
      saleLog.hours = log.hours
      saleLog.total = log.total
      saleLog.production = calcProductProduction(product, startDate)
      saleLog.subLog = getSubProducts(product, start, undefined)
    }
  }
  if(product.saleLog.length){
    return saleLog
  }
  return
}




function getSubProducts(product: Product | SubProduct, start: string, end: string | undefined){
  if(isProduct(product) && product.subProducts.length){
    let saleLogs: any[] = []
    for(let sub of product.subProducts){
      let saleLog: SaleLog | undefined = emptyLog()
      if(end){
       saleLog = updateLog(sub, start, end)
      } else{
      saleLog = updateLog(sub, start, undefined)
      }
      saleLogs.push(saleLog)
  }
    return saleLogs
  } else {
    return []
  }

}


function calcHours(logs: any){
  let hours: hour[] = []
  for(let log of logs){
    for(let hour of log.hours){
      const existingHour = hours.find(h => h.label === hour.label)
      if(existingHour){
        existingHour.qty += hour.qty
      } else {
        hours.push(hour)
      }
    }
  }
  const sortedHours = hours.sort((a,b) => {
    const aDate = new Date(a.date).getHours()
    const bDate = new Date(b.date).getHours()
    return aDate - bDate
  })
  console.log(sortedHours)
  return sortedHours

}



function  calcProductProductions(product: any, start: Date, end: Date){
  if(product.subProducts && product.subProducts.length){
    let total = 0
    for(let sub of product.subProducts){
      if(sub.saleLog.length){
        total += calcProductProductions(sub, start, end)
      }
    }
    return round(total)
  } else {
    let total = 0
    let qty = 0
    const logs = product.saleLog.filter((l: any) => {
      const logDate = new Date(l.date).setHours(0,0,0,0)
      return logDate >= start.getTime() && logDate <= end.getTime()
    })

    if(product.ings.length){
      product.ings.forEach((el:any) => {
        if(el.ing){
          total = round(total + (el.qty * el.ing.price))
        } else {
          console.log(product)
        }
      }
      )
    }
    for(let log of logs){
      qty += log.qty
    }
    return round(total * qty)
  }
}


function  calcProductProduction(product: any, date: Date){
  if(product.subProducts && product.subProducts.length){
    let total = 0
    for(let sub of product.subProducts){
      if(sub.saleLog.length){
        total += calcProductProduction(sub, date)
      }
    }
    return round(total)
  } else {
    let total = 0
    const log = product.saleLog.find((l: any) => new Date(l.date).setHours(0,0,0,0) === date.getTime())
    if(product.ings.length){
      product.ings.forEach((el:any) => {
        if(el.ing){
          total = round(total + (el.qty * el.ing.price))
        } else {
          console.log(product)
        }
      }
      )
    }
    if(log){
      return round(total * log.qty)
    } else {
      return total
    }
  }
}

function isProduct(product: Product | SubProduct): product is Product {
  return (product as Product).subProducts !== undefined;
}

