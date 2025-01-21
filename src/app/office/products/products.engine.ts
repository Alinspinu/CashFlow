import { Product } from "src/app/models/category.model";
import { darkIcons, icons, lightIcons } from "src/app/shared/icons";



export interface mainCat{
  name: string,
  products: number,
  active: boolean,
  icon: string,
  cat: cat[];
}

export interface cat{
  name: string,
  active: boolean
}


export function getMaincat(products: Product[], darkMode: boolean){
  const icons: icons = darkMode ? darkIcons() : lightIcons()
  let mainCats: mainCat[] = []
  let cats: cat[] = []
  for(let product of products) {
    const existingMainCat = mainCats.find(c => c.name === product.mainCat)
    if(existingMainCat){
      existingMainCat.products ++
      const existingCat = existingMainCat.cat.find(c => c.name === product.category.name)
      if(!existingCat){
        existingMainCat.cat.push({name: product.category.name, active: false})
      }
    } else {
      mainCats.push({
        name: product.mainCat,
        products: 1,
        active: false,
        icon: product.mainCat === 'food' ? icons.food : product.mainCat === 'bar' ? icons.bar : product.mainCat === 'coffee' ? icons.coffee : product.mainCat === 'shop' ? icons.shop : 'assets/icon/plant.svg',
        cat: [{name: product.category.name, active: false}]
      })
    }
  }
  const sortedMain = mainCats.sort((a,b) => {
    const order: any = {food: 1, coffee: 2, bar: 3, shop: 4}
    return order[a.name] - order[b.name]
  })
  for(let main of sortedMain){
      cats = [...cats, ...main.cat]
  }
  sortedMain.unshift({
    name: 'Toate',
    products: products.length,
    active: true,
    icon: 'assets/icon/planet-outline.svg',
    cat: cats
  })
  return sortedMain
}
