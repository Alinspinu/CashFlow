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
        m.data_creare = `${year}-${month}-${day}-${hour}:${minute}`
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
    message.mesaje = msg
    return message
}


export function mergeProducts(invoice: EFactura, ings: InvIngredient[]){
    let products: EProduct[] = []
    for(let product of invoice.products){
        const existingProduct = products.find((p) => p.name === product.name)
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
                p.ingDep = ing.dep
                p.ingGestiune = ing.gestiune
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
                logId: ''
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
