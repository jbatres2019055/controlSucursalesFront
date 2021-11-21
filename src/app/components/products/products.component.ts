import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
//import { ChartOptions, ChartType } from 'chart.js';
import { Product } from 'src/app/models/product';
import { RestUserService } from 'src/app/services/restUser/rest-user.service';
import { RestProductService } from 'src/app/services/restProduct/rest-product.service';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user';
//import { Label } from 'ng2-charts';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  @ViewChild('closebutton',{static:false}) closebutton:any;

  product: Product;
  products: Array<Product> = [];
  search = undefined;
  type = "Ascendente";
  stock = 0;
  users: Array<User> = [];
  office: any = {};

  constructor(private restProduct: RestProductService, private restUser: RestUserService) { 
    this.product = new Product("","",0,0,"", false);
  }

  ngOnInit(): void {
    this.getCompanies();
    this.getProducts('Ascendente');
  }

  getProducts(value:any) {
    this.restProduct.getProducts(value).subscribe((resp:any)=>{
      if(resp.products){
        this.products = resp.products;
        localStorage.setItem("products",JSON.stringify(resp.products));
      }else{
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: resp.message
        })
      }
    },
    (error)=>{
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: error.error.message
      })
    })
  }

  onSubmit(employeeForm: NgForm){
    let user: any = this.product;
    this.restProduct.addProduct(user).subscribe((resp:any)=>{
      if(resp.productSaved){
        employeeForm.reset();
        this.products.push(resp.productSaved);
        localStorage.setItem("products",JSON.stringify(this.products));
        Swal.fire({
          icon: 'success',
          title: 'Producto agregado exitosamente'
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: resp.message
        })
      }
    },
    (error)=>{
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: error.error.message
      })
    })
  }

  updateProduct(saveCompany: NgForm) {
    let user: any = this.product;
    this.restProduct.updateProduct(user).subscribe((resp:any)=>{
      if(resp.productUpdated){
        saveCompany.reset();
        this.getProducts('Ascendente');
        Swal.fire({
          icon: 'success',
          title: 'Producto actualizado exitosamente'
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: resp.message
        })
      }
    },
    (error)=>{
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: error.error.message
      })
    })
  }

  deleteProduct(item: any) {
    this.restProduct.removeProduct(item).subscribe((resp:any)=>{
      if(resp.message){
        this.getProducts('Ascendente');
        Swal.fire({
          icon: 'success',
          title: 'Producto eliminado exitosamente'
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: resp.message
        })
      }
    },
    (error)=>{
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: error.error.message
      })
    })
  }

  buyProduct(a: NgForm){
    let user: any = this.product;
    this.restProduct.buyProduct(this.stock,user._id).subscribe((resp:any)=>{
      console.log(resp);
      if(resp.productUpdated){
        a.reset();
        Swal.fire({
          icon: 'success',
          title: 'Producto adquirido exitosamente'
        })
        this.ngOnInit();
      }else{
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: resp.message
        })
      }
    },
    (error)=>{
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: error.error.message
      })
    })
  }

  deleteCompanyInfo(){
    this.product = new Product("","",0,0,"", false);
  }

  setCompanyInfo(item: any){
    this.product = item;
  }

  ngDoCheck(){
    this.products = JSON.parse(localStorage.getItem("products")!);
  }

  sendToOffice(id: any) {
    this.product = id;
  }

  send(item: NgForm) {
    let params = {
      product : this.product,
      stock : this.stock,
      office : this.office
    };

    this.restProduct.sendOffice(params).subscribe((resp:any)=>{
      if(resp.success){
        item.reset();
        this.getProducts('Ascendente');
        this.getCompanies();
        this.office = {};
        this.closebutton.nativeElement.click();
        //localStorage.setItem("products",JSON.stringify(this.products));
        Swal.fire({
          icon: 'success',
          title: 'Producto agregado exitosamente'
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: resp.message
        })
      }
    },
    (error)=>{
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: error.error.message
      })
    })
  }

  select(item: any) {
    item['select'] == true ? item['select'] = false : item['select'] = true;
    if (item['select']) this.office = item;
    else this.office = {};
  }

  getCompanies() {
    this.restUser.getCompanys().subscribe((resp:any)=>{
      if(resp.users){
        console.log(resp.users)
        this.users = resp.users;
        localStorage.setItem("companys",JSON.stringify(resp.users));
      }else{
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: resp.message
        })
      }
    },
    (error)=>{
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: error.error.message
      })
    })
  }

  onChange(value: any) {
    this.getProducts(value.target.value);
  }

  /* public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value:any, ctx:any) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  }; */
  /* public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors: any[] = [
    {
      backgroundColor : []
    },
  ];

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public getRandomColor(): any {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  } */

}
