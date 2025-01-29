import { Preferences } from "@capacitor/preferences";
import User from "src/app/auth/user.model";
import { Product } from "src/app/models/category.model";


export function round(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
export function round4(num: number): number {
  return Math.round((num + Number.EPSILON) * 10000) / 10000;
}
export function roundOne(num: number): number {
  return Math.round((num + Number.EPSILON) * 1) / 1;
}


export function getObjectKeys(obj: any): string[] {
  return Object.keys(obj);
}

export function modifyImageURL(url: string): string {
  const parts = url.split('/v1');
  const baseURL = parts[0];
  const cropParameters = '/w_555,h_555,c_fill';
  const cropUrl = baseURL + cropParameters + '/v1' + parts[1];
  return cropUrl;
}

export function formatedDateToShow(date: any){
  if(date){
    const inputDate = new Date(date);
    const hours = inputDate.getHours().toLocaleString();
    const minutes = inputDate.getMinutes().toLocaleString();
    const hour = hours.padStart(2, "0") + ":" + minutes.padStart(2, "0");
    const monthNames = [
      "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
      "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
    ];
    return `${inputDate.getDate().toString().padStart(2, '0')}-${monthNames[inputDate.getMonth()]}-${inputDate.getFullYear()} ora ${hour} `
  } else {
    return 'xx'
  }
  }

  export function formatOrderDate(date: any) {
    const inputDate = new Date(date);
    const months = [
      "Ian", "Feb", "Mar", "Aprl", "Mai", "Iun",
      "Iul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    // Extract parts of the date
    const day = inputDate.getDate(); // Day of the month
    const month = months[inputDate.getMonth()]; // Month name in Romanian
    const year = inputDate.getFullYear(); // Full year
    const hours = inputDate.getHours(); // Hours
    const minutes = inputDate.getMinutes().toString().padStart(2, '0'); // Minutes with leading zero if needed

    // Format the date as "Sept 23, 2025, 12:43"
    return `${month} ${day}, ${year}, ${hours}:${minutes}`;
  }

  export function formatTitleDate(date: any) {
    const inputDate = new Date(date);
    const months = [
      "Ian", "Feb", "Mar", "Aprl", "Mai", "Iun",
      "Iul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    // Extract parts of the date
    const day = inputDate.getDate(); // Day of the month
    const month = months[inputDate.getMonth()]; // Month name in Romanian
    const year = inputDate.getFullYear(); // Full year

    // Format the date as "Sept 23, 2025, 12:43"
    return `${month} ${day} - ${year}`;
  }


  export function formatDayDate(date: any) {
    const inputDate = new Date(date);

    const days = [
      "Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"
    ];
    const months = [
      "Ian", "Feb", "Mar", "Aprl", "Mai", "Iun",
      "Iul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    const day = inputDate.getDate(); // Day of the month
    const zi = days[inputDate.getDay()];
    const month = months[inputDate.getMonth()];


    return ` ${month} ${day} ${zi} `;
  }

  export function formatOrderDateOne(date: any) {
    const inputDate = new Date(date);
    const months = [
     "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
      "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
    ];

    // Extract parts of the date
    const day = inputDate.getDate(); // Day of the month
    const month = months[inputDate.getMonth()]; // Month name in Romanian
    const year = inputDate.getFullYear(); // Full year

    // Format the date as "Sept 23, 2025, 12:43"
    return `${day} ${month}, ${year}`;
  }


  export function getPaymentMethod(paymentObject: any){
      let paymentMethod: {method: string, value: number}[] = []
      Object.keys(paymentObject).forEach(key => {
        if(paymentObject[key] && paymentObject[key] > 0){
          let data = {
            method: key,
            value: paymentObject[key]
          }
          paymentMethod.push(data)
        }
      });
      return paymentMethod

  }

 export function getUserFromLocalStorage(){
   return Preferences.get({key: 'authData'}).then(data  => {
      let user: User
      if(data.value) {
       user = JSON.parse(data.value)
      return user
      } else{
       return null
      }
    })
  }

  export function getDaysInMonth(date: string): number {
    const newDate = new Date(date)
    const year = newDate.getFullYear()
    const month = newDate.getMonth()
    return new Date(year, month -1, 0).getDate();
  }


  export function getSection(product: Product){
    let section = ''
    if(product.mainCat === 'food'){
        if(product.category._id === "64be6a3e3ef7bd6552c84608" || product.category._id === "64be690d3ef7bd6552c84602") {
          section = 'vitrina'
        } else {
          section = 'buc'
        }
    }
    if(product.mainCat === 'bar'){
      section = 'bar'
    }
    if(product.mainCat === "shop"){
      section = 'shop'
    }
    if(product.mainCat === 'coffee'){
        if(product.category._id === "64c8e6c548b61f91a0d45e66" || product.category._id === "64c8e69548b61f91a0d45e64"){
          section = "tea"
        } else {
          section ='coffee'
        }
    }
    return section
  }


export function formatPeriod(start: number, end: number){
  const startDate = new Date(start);
  const endDate = new Date(end);

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Bucharest" // Set the time zone to match the Romanian locale
  };

  const startt = startDate.toLocaleString("ro-RO", options);
  const endd = endDate.toLocaleString("ro-RO", options);
  return `${startt} -- ${endd}`
}


export function  convertToDateISOString(dateString: string | undefined) {
  // Define month mappings
  const monthMap: any = {
    'Ianuarie': '01',
    'Februarie': '02',
    'Martie': '03',
    'Aprilie': '04',
    'Mai': '05',
    'Iunie': '06',
    'Iulie': '07',
    'August': '08',
    'Septembrie': '09',
    'Octombrie': '10',
    'Noiembrie': '11',
    'Decembrie': '12'
  };

  // Split the date string and remove any leading or trailing whitespace
  if(dateString){
    const trimmedDateString = dateString.trim();
    const parts = trimmedDateString.split('-');

    // Extract day, month, and year
    const day = parts[0].padStart(2, '0');
    const month = monthMap[parts[1]];
    const year = parts[2];
    // Return the date string in ISO 8601 format
    return `${year}-${month}-${day}T00:00:00.000Z`;
  } else {
    return ''
  }
}


export function findCommonNumber(arr: number[]): number | null {
  // Check if the array is empty
  if (arr.length === 0) return null;

  // Calculate the sum of the array elements
  const sum = arr.reduce((acc, num) => acc + num, 0);

  // Calculate the mean by dividing the sum by the number of elements
  const mean = sum / arr.length;

  return round(mean);
}


export function sortByDate(arr: any[], ascending: boolean = true): any[] {
  return arr.sort((a, b) => {
    let dateA = new Date(a.date).getTime();
    let dateB = new Date(b.date).getTime();
    if(a.day){
       dateA = new Date(a.day).getTime();
       dateB = new Date(b.day).getTime();
    }
    if(a.date){
      dateA = new Date(a.date).getTime();
      dateB = new Date(b.date).getTime();
    }
    console.log(dateA)
      // Compare dates
      if (ascending) {
          return dateA - dateB; // Ascending order
      } else {
          return dateB - dateB; // Descending order
      }
  });
}


