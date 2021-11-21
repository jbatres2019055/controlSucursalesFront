import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user';
import { RestProductService } from 'src/app/services/restProduct/rest-product.service';
import { RestUserService } from 'src/app/services/restUser/rest-user.service';
import Swal from 'sweetalert2';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  @ViewChild('closebutton',{static:false}) closebutton:any;
  user: User;
  userLocal: any;
  users: Array<User> = [];
  search =  "";
  userTemp: any = { products : [] };
  productTemp: any = {};
  token: any;
  products: any = [];
  type: any = 'Ascendente';

  constructor(private restUser: RestUserService, private restProduct: RestProductService) { 
    this.user = new User("", "", "", "", "", 0, "", "", [], [], false);
  }

  ngOnInit(): void {
    let tokenTemp = localStorage.getItem("token");
    let userLocalTemp = localStorage.getItem("user");
    this.token = (tokenTemp != null ? tokenTemp : null);
    this.userLocal = JSON.parse(userLocalTemp!) || null;
    if (this.userLocal.role == 'ROLE_ADMIN') {
      this.restUser.getCompanys().subscribe((resp:any)=>{
        if(resp.users){
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
    } else {
      this.getProducts('Ascendente');
    }
  }

  onSubmit(companyForm: NgForm){
    let user: any = this.user;
    this.restUser.createCompany(user).subscribe((resp:any)=>{
      if(resp.userSaved){
        companyForm.reset();
        this.users.push(resp.userSaved);
        localStorage.setItem("companys",JSON.stringify(this.users));
        Swal.fire({
          icon: 'success',
          title: 'Sucursal creada exitosamente'
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

  updateCompany(updateCompanyForm: NgForm){
    let user: any = this.user;
    delete user.password;
    this.restUser.updateCompany(user).subscribe((resp:any)=>{
      if(resp.userUpdated){
        updateCompanyForm.reset();
        this.user = new User("","","","","",0,"","",[],[], false);
        Swal.fire({
          icon: 'success',
          title: 'Sucursal actualizada exitosamente'
        })
        this.ngOnInit();
      }else{
        Swal.fire({
          icon: 'error',
          title: '¡Ups!',
          text: resp.message
        })
      }
    },
    (error)=>{
      Swal.fire({
        icon: 'error',
        title: '¡Ups!',
        text: error.error.message
      })
    })
  }

  deleteCompanyInfo(){
    this.user = new User("","","","","",0,"","",[],[], false);
  }

  setCompanyInfo(user: any){
    this.user = user;
  }

  deleteCompany(book: any){
    this.setCompanyInfo(book);
    let userToDelete:any = this.user;
    Swal.fire({
      title: "¿Eliminar sucursal " + userToDelete.name + " ?" ,
      text: "Esta acción no se puede remover",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    .then(resultado => {
        if (resultado.value) {
          this.restUser.deleteCompany(this.user).subscribe((resp:any)=>{
            if(resp.userRemoved){
              Swal.fire({
                icon: 'success',
                title: 'Sucursal eliminada exitosamente'
              })
              this.ngOnInit();
              this.deleteCompanyInfo();
            }else{
              Swal.fire({
                icon: 'error',
                title: '¡Ups!',
                text: resp.message
              })
            }
          },
           (error:any)=>{
            Swal.fire({
              icon: 'error',
              title: '¡Ups!',
              text: error.error.message
            })
          })
        }else {
          this.deleteCompanyInfo();
        }
    });
  }

  // ngDoCheck(){
  //   this.users = JSON.parse(localStorage.getItem("companys")!);
  // }

  view(item: any) {
    this.restUser.getCompanyById(item._id).subscribe((resp:any)=>{
      if(resp.data){
        this.userTemp = resp.data;
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

  sellProducts(item: any) {
    if (this.userTemp._id == null) this.userTemp = this.userLocal;
    console.log('this.userTemp._id:', this.userTemp._id)
    setTimeout(() => {
      this.restProduct.sellProduct({ data : this.productTemp, idCompany : this.userTemp._id }).subscribe((resp:any)=>{
        if(resp.success){
          this.productTemp = {};
          this.getProducts('Ascendente');
          Swal.fire({
            icon: 'success',
            title: 'Producto vendido correctamente'
          });
          this.closebutton.nativeElement.click();
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
    }, 300)
  }

  getProducts(type:any) {
    this.restProduct.getProductsMoreSelled(type).subscribe((resp:any)=>{
      if(resp.data){
        this.products = resp.data;
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

  onChange(value: any) {
    this.getProducts(value.target.value);
  }

  pdf() {
    var data:any = document.getElementById('container-info');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('Sucursales.pdf'); // Generated PDF
  });
  }

}
