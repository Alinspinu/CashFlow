export class Suplier{
  constructor(
    public bussinessName: string,
    public name: string,
    public vatNumber: string,
    public register: string,
    public account: string,
    public bank: string,
    public VAT: boolean,
    public address: string,
    public sold: number,
    public locatie: string,
    public records: Record[],
    public _id: string,
  ){}
}

export class Record{
  constructor(
    public typeOf: string,
    public document: {
      typeOf: string,
      docId: string,
      amount: number
    },
    public descriptipn: string,
    public nir: string,
    public date: string,

  ){}
}
