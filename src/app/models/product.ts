export class Product {
    constructor(
        public _id: string,
        public name: string,
        public stock: Number,
        public sales: Number,
        public supplier: string,
        public select: boolean
    ){}
}