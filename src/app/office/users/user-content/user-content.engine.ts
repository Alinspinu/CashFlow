import { Bill } from "src/app/models/table.model";



export function editOrders(orders: Bill[]){
  let total = 0
  let discount = 0
  let cashBack = 0
  for(let order of orders){
    if(order.payment){
      if(order.payment.card) order.paymentMethod = 'Card'
      if(order.payment.cash) order.paymentMethod = 'Cash'
      if(order.payment.online) order.paymentMethod = 'Online'
      if(order.payment.viva) order.paymentMethod = 'Viva'
      if(order.payment.voucher) order.paymentMethod = 'Voucher'
      if(order.total === 0) order.paymentMethod = 'Gratis'
    }
    total += order.total
    discount += order.discount
    cashBack += order.cashBack
  }
  const sortedOrders = orders.sort((a,b) => {
    const aDate = new Date(a.createdAt).getTime()
    const bDate = new Date(b.createdAt).getTime()
    return bDate - aDate
  })
  return {
    total,
    discount,
    cashBack,
    sortedOrders
  }
}
