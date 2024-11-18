import { messageEFactura } from "src/app/models/nir.model";
import { Suplier } from "src/app/models/suplier.model";



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