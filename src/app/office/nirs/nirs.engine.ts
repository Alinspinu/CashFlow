import { emptyNir } from "src/app/models/empty-models";
import { Nir, NirIngredient } from "src/app/models/nir.model";
import { round } from "src/app/shared/utils/functions";

export function mergeNirs(nirs: Nir[]){
  let newNir: Nir = emptyNir()
  newNir.suplier = nirs[0].suplier
  newNir.document = 'factura'
  newNir._id = 'merged'
  delete newNir.index
  for(let nir of nirs){
    for(let ing of nir.ingredients){
      const existingIng: NirIngredient | undefined = newNir.ingredients.find(i => i.name === ing.name && i.price === ing.price)
      if(existingIng){
        existingIng.qty += ing.qty
        existingIng.value = round(existingIng.value + ing.value)
        existingIng.tvaValue = round(existingIng.tvaValue + ing.tvaValue)
        existingIng.total = round(existingIng.total + ing.total)
        newNir.totalDoc += ing.total
        newNir.val += ing.value
        newNir.valTva += ing.tvaValue
        newNir.valVanzare += ing.sellPrice * ing.qty
      } else {
        newNir.ingredients.push(ing)
        newNir.totalDoc += ing.total
        newNir.val += ing.value
        newNir.valTva += ing.tvaValue
        newNir.valVanzare += ing.sellPrice *ing.qty
      }
    }
  }
  newNir.totalDoc = round(newNir.totalDoc)
  newNir.val = round(newNir.val)
  newNir.valTva = round(newNir.valTva)
  newNir.valVanzare = round(newNir.valVanzare)
  return newNir
}
