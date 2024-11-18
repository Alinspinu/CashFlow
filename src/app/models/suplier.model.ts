export class Suplier{
  constructor(
    public _id: string,
    public bussinessName: string,
    public name: string,
    public vatNumber: string,
    public register: string,
    public account: string,
    public bank: string,
    public VAT: boolean,
    public address: string,
    public sold: number,
    public records: Record[]
  ){}
}

export class Record{
  constructor(
    public typeOf: string,
    public document: {
      typeOf: string,
      docId: string,
      amount: number,
      asociat: boolean,
      docRecords: {docNumber: string, docTotal: number}[]
    },
    public descriptipn: string,
    public nir: string[],
    public date: string,

  ){}
}
