export class User {
    constructor(
        public _id: string,
        public name: string,
        public username: string,
        public password: string,
        public email: string,
        public phone: Number,
        public role: string,
        public direccionSucursal: string,
        public employees: [],
        public products: [],
        public select: boolean
    ){}
}