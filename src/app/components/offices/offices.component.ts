import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { RestProductService } from 'src/app/services/restProduct/rest-product.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-offices',
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.css']
})
export class OfficesComponent implements OnInit {

  public products: Array<Product> = [];
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [], label: 'Productos más venidos' }
  ];

  constructor(private restProduct: RestProductService) {

  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.restProduct.getProductsMoreSelled('Ascendente').subscribe((resp:any)=>{
      if(resp.data){
        let productsTemp: any = [];
        let dataTemp:any = [];
        this.products = resp.data;
        this.products.forEach((i:any) => productsTemp.push({ name : i.products.name, value: i.products.stockSelled }));
        productsTemp.forEach((i:any) => this.barChartLabels.push(i.name));
        productsTemp.forEach((i:any) => dataTemp.push(i.value) );
        this.barChartData[0].data = dataTemp;
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

}
