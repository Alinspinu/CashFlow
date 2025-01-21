



export function darkIcons() {
  const icons: icons = {
    food: 'assets/icon/food-w.svg',
    coffee: 'assets/icon/coffee-w.svg',
    shop: 'assets/icon/shop-w.svg',
    bar: 'assets/icon/bar-w.svg'
  }
  return icons
}

export function lightIcons() {
  const icons: icons = {
    food: 'assets/icon/food.svg',
    coffee: 'assets/icon/coffee.svg',
    shop: 'assets/icon/shop.svg',
    bar: 'assets/icon/bar.svg'
  }
  return icons
}


export interface icons{
  food: string,
  coffee: string,
  shop: string,
  bar: string
}
