
import { emptyProductionReport, emptyReportUsers } from "src/app/models/empty-models"
import { Inventary, productionReport } from "src/app/models/inventary.model"
import { Report, reportUser, reportUsers } from "src/app/models/report.model"
import { round } from "src/app/shared/utils/functions"


export function updateReportValues(report: Report, firstInv: Inventary, secondInv: Inventary):productionReport{
    let prodRep: productionReport = emptyProductionReport()
  
    report.departaments.forEach(dep => {
      if(dep.name === 'coffee'){
        dep.dep.forEach(dp => {
          if(dp.name === 'marfa'){
            prodRep.iesiri.bar.marfa += dp.total
          } else {
            prodRep.iesiri.bar.prod += dp.total
          }
        })
      }
      if(dep.name === 'bar'){
        dep.dep.forEach(dp => {
          if(dp.name === 'marfa'){
            prodRep.iesiri.bar.marfa += dp.total
          } else {
            prodRep.iesiri.bar.prod += dp.total
          }
        })
      }
      if(dep.name === 'food'){
        dep.dep.forEach(dp => {
          if(dp.name === 'marfa'){
            prodRep.iesiri.buc.marfa += dp.total
          } else {
            prodRep.iesiri.buc.prod += dp.total
          }
        })
      }
      if(dep.name === 'shop'){
        dep.dep.forEach(dp => {
          if(dp.name === 'marfa'){
            prodRep.iesiri.bar.marfa += dp.total
          } else {
            prodRep.iesiri.bar.prod += dp.total
          }
        })
      }
    })
  
    firstInv.ingredients.forEach(ing => {
      if(ing.gestiune === 'bar'){
        if(ing.dep === 'marfa'){
          if(ing.ing){
            prodRep.intrari.inv.marfaBar += (ing.ing.price * ing.faptic)
          } else {
            console.log(ing)
          }
        } else {
          if(ing.ing){
            prodRep.intrari.inv.prodBar += (ing.ing.price * ing.faptic)
          } else {
            console.log(ing)
          }
        }
      } 
      if(ing.gestiune === 'bucatarie'){
        if(ing.dep === 'marfa'){
          if(ing.ing){
            prodRep.intrari.inv.marfaBuc += (ing.ing.price * ing.faptic)
          } else {
            console.log(ing)
          }
        } else {
          if(ing.ing){
            prodRep.intrari.inv.prodBuc += (ing.ing.price * ing.faptic)
          } else {
            console.log(ing)
          }
        }
      }
    })
  
    secondInv.ingredients.forEach(ing => {
      if(ing.gestiune === 'bar'){
        if(ing.dep === 'marfa'){
          prodRep.iesiri.inv.marfaBar += (ing.ing.price * ing.faptic)
        } else {
          prodRep.iesiri.inv.prodBar += (ing.ing.price * ing.faptic)
        }
      } 
      if(ing.gestiune === 'bucatarie'){
        if(ing.dep === 'marfa'){
          prodRep.iesiri.inv.marfaBuc += (ing.ing.price * ing.faptic)
        } else {
          prodRep.iesiri.inv.prodBuc += (ing.ing.price * ing.faptic)
        }
      }
    })
  
    prodRep.intrari.bar.marfa = report.supliesMfBar
    prodRep.intrari.bar.prod = report.supliesProdBar
    prodRep.intrari.buc.marfa = report.supliesMfBuc
    prodRep.intrari.buc.prod = report.supliesProdBuc
  
    prodRep.dif.marfaBar = round((prodRep.iesiri.inv.marfaBar + prodRep.iesiri.bar.marfa) - (prodRep.intrari.bar.marfa + prodRep.intrari.inv.marfaBar))
    prodRep.dif.prodBar = round((prodRep.iesiri.inv.prodBar + prodRep.iesiri.bar.prod) - (prodRep.intrari.bar.prod + prodRep.intrari.inv.prodBar))
    prodRep.dif.marfaBuc = round((prodRep.iesiri.inv.marfaBuc + prodRep.iesiri.buc.marfa) - (prodRep.intrari.buc.marfa + prodRep.intrari.inv.marfaBuc))
    prodRep.dif.prodBuc = round((prodRep.iesiri.inv.prodBuc + prodRep.iesiri.buc.prod) - (prodRep.intrari.buc.prod + prodRep.intrari.inv.prodBuc))
  
    prodRep.totals.dif = round(prodRep.dif.marfaBar + prodRep.dif.marfaBuc + prodRep.dif.prodBar + prodRep.dif.prodBuc)
    prodRep.totals.iesiri = round(prodRep.iesiri.bar.marfa + prodRep.iesiri.bar.prod +prodRep.iesiri.buc.marfa + prodRep.iesiri.buc.prod)
    prodRep.totals.intrari = round(prodRep.intrari.bar.marfa + prodRep.intrari.bar.prod + prodRep.intrari.buc.marfa + prodRep.intrari.buc.prod)
    prodRep.totals.firstInv = round(prodRep.intrari.inv.marfaBar + prodRep.intrari.inv.marfaBuc + prodRep.intrari.inv.prodBar + prodRep.intrari.inv.prodBuc)
    prodRep.totals.secondInv = round(prodRep.iesiri.inv.marfaBar + prodRep.iesiri.inv.marfaBuc  + prodRep.iesiri.inv.prodBar + prodRep.iesiri.inv.prodBuc)
    prodRep.totals.dif = round(prodRep.dif.marfaBar + prodRep.dif.marfaBuc + prodRep.dif.prodBar + prodRep.dif.prodBuc)
    return prodRep
  }




  export function sortUsers(report: Report){
    const  reportUsers: reportUsers = emptyReportUsers()
    report.workValue.users.forEach((user: reportUser) => {
        reportUsers.totalUsers ++
        const existingSection = reportUsers.section.find(s => s.name === user.position)
        if(existingSection){
                existingSection.totalIncome = round(existingSection.totalIncome + user.totalIncome) 
                existingSection.totalTax = round(existingSection.totalTax + user.taxValue)
                existingSection.totalBonus = round(existingSection.totalBonus + user.bonus)
                reportUsers.totalIncome = round(reportUsers.totalIncome + user.totalIncome)
                reportUsers.totalTax = round(reportUsers.totalTax + user.taxValue)
                reportUsers.totalBonus = round(reportUsers.totalBonus + user.bonus)
                existingSection.users.push(user)
        } else {
            const section = {
                name: user.position,
                totalTax: user.taxValue,
                totalIncome: user.totalIncome,
                totalBonus: user.bonus,
                users: [user]
            }
            reportUsers.totalIncome = round(reportUsers.totalIncome + section.totalIncome)
            reportUsers.totalTax = round(reportUsers.totalTax + section.totalTax)
            reportUsers.totalBonus = round(reportUsers.totalBonus + section.totalBonus)
            reportUsers.section.push(section)
        }
    })

    reportUsers.section.sort((a, b):any => {
        const rolesOrder: any = {
             Bucatar: 1, 
             'Ajutor bucatar': 2, 
             Barista: 3, 
             'Ajutor barman': 4,
             Casier: 5, 
             Ospatar: 6, 
             ospatar: 6, 
             Supervizor: 7, 
             Aprovizionare: 8,
             Designer: 9, 
             'Asistent Manager': 10, 
             Manager: 11,
            };
        return rolesOrder[a.name] - rolesOrder[b.name];
      });
    return reportUsers
  }