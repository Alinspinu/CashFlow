import { EFactura, messageEFactura } from "src/app/models/nir.model";
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


export function mergeProducts(invoice: EFactura){
    let products: any = [] 
    for(let product of invoice.products){
        const existingProduct = products.find((p: any) => p.name === product.name)
        if(existingProduct){
            existingProduct.quantity = round(existingProduct.quantity + product.quantity)
            existingProduct.totalnoVat = round(existingProduct.totalNoVat + product.totalNoVat)
        } else {
            products.push(product)
        }
    }
    products.sort((a: any, b: any) => a.name.localeCompare(b.name));
    invoice.products = products
    return invoice
}