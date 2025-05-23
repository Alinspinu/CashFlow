import { emptyNir, emptySuplier } from "src/app/models/empty-models";
import { EFactura, EProduct, InvIngredient, messageEFactura, Nir, NirIngredient } from "src/app/models/nir.model";
import { Suplier } from "src/app/models/suplier.model";
import { round } from "src/app/shared/utils/functions";



export function editMessage(message: messageEFactura, supliers: Suplier[]){
   const msg = message.mesaje.map(m => {
        const year = m.data_creare.substring(0, 4);
        const month = m.data_creare.substring(4, 6);
        const day = m.data_creare.substring(6, 8);
        const hour = m.data_creare.substring(8, 10);
        const minute = m.data_creare.substring(10, 12);
        const date = new Date(m.data_creare)
        if (isNaN(date.getTime())) {
          m.data_creare = new Date(+year, +month-1, +day, +hour, +minute).toISOString()
        }
        const match = m.detalii.match(/cif_emitent=(\d+)/)
        if(match){
            const suplier = supliers.find(s => s.vatNumber.replace(/\D/g, '') === match[1])
            if(suplier){
                m.detalii = suplier.name
                return m
            } else{
                m.detalii = `Furnizor neînregistrat CIF ${match[1]}`
                return m
            }
        } else{
            return m
        }

    })
    const sortedMessage = msg.sort((a: any,b: any) => {
      const aDate = new Date(a.data_creare).getTime()
      const bDate = new Date(b.data_creare).getTime()
      return bDate - aDate
    })
    message.mesaje = sortedMessage
    return message
}


export function mergeProducts(invoice: EFactura, ings: InvIngredient[]){
    let products: EProduct[] = []
    for(let product of invoice.products){
        const existingProduct = products.find((p) => p.name === product.name && p.price === product.price)
        if(existingProduct){
            existingProduct.quantity = round(existingProduct.quantity + product.quantity)
            existingProduct.totalNoVat = round(existingProduct.totalNoVat + product.totalNoVat)
        } else {
            products.push(product)
        }
    }
    products.sort((a: any, b: any) => a.name.localeCompare(b.name));

    const updatedProducts = products.map(p => {
        let foundMatch = false;
        const normalizedPName = p.name.trim().toLowerCase();

        for(let ing of ings){
            const eI = ing.eFactura.find(i => {
                const normalizedEIName = i.name.trim().toLowerCase();
                return normalizedPName === normalizedEIName;
            })
            if(eI){
              p.ingName = ing.name
              p.ingUm = ing.um
              p.ingQty = round(p.quantity * eI.qtyCorector)
              p.ingDep = ing.dept.name
              p.ingGestiune = ing.gest.name
              p.ingID = ing._id
              p.ingSellPrice = ing.sellPrice
              foundMatch = true;
          }
          if(!foundMatch) {
              p.ingName = 'Neidentificat'
              p.ingUm = '-'
              p.ingQty = 0
          }


        }
        return p
    })

    invoice.products = updatedProducts
    return invoice
}


export function createNir(eFactura: EFactura, supliers: Suplier[]){
    let newNir: Nir = emptyNir()
    const eVat = eFactura.supplier.vatNumber.replace(/\D/g, '')
    const suplier = supliers.find(s => s.vatNumber.replace(/\D/g, '') === eVat)
    console.log(suplier)
    if(suplier){
        let sellPrice = 0
        const nirProducts = eFactura.products.map(eP => {
            let product: NirIngredient = {
                dep: eP.ingDep,
                gestiune: eP.ingGestiune,
                ing: eP.ingID,
                name: eP.ingName,
                price: round((eP.price * eP.quantity) / eP.ingQty),
                um: eP.ingUm,
                qty: eP.ingQty,
                value: eP.totalNoVat,
                tva: eP.vatPrecent,
                tvaValue: round((eP.totalNoVat *(1+ (eP.vatPrecent/100))) - eP.totalNoVat),
                total: round(eP.totalNoVat *(1+ (eP.vatPrecent/100))),
                sellPrice: eP.ingSellPrice,
                logId: generateRandomHexString(9)
            }
            sellPrice = round(sellPrice + product.sellPrice)
            return product
        })
        delete newNir.index
        newNir.suplier = suplier
        newNir.document = 'factura'
        newNir._id = 'eFactura'
        newNir.ingredients = nirProducts
        newNir.totalDoc = eFactura.taxInclusiveAmount
        newNir.val = eFactura.taxExclusiveAmount
        newNir.valTva = eFactura.vatAmount
        newNir.valVanzare = sellPrice
        newNir.documentDate = eFactura.issueDate
        newNir.receptionDate = eFactura.dueDate
        newNir.eFacturaId = eFactura.id
        newNir.nrDoc = eFactura.invoiceNumber
        return {nir: newNir}
    }
    return {add: 'add'}
  }


  export function getBillIds(message: messageEFactura){
    const ids = message.mesaje.map(m => m.id)
    return ids
  }

  export function ckeckMessageStatus(message: messageEFactura, nirsIds: string[]){
   const msg = message.mesaje.map(m => {
      for(let id of nirsIds) {
        if(m.id === id){
          m.done = true
        }
      }
      return m
    })
    message.mesaje = msg
    return message
  }



  function generateRandomBytes(length: number): Uint8Array {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array); // Fill array with random values
    return array;
  }

  // Optional: Convert to hex string if needed
  function generateRandomHexString(length: number): string {
    const bytes = generateRandomBytes(length);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }
