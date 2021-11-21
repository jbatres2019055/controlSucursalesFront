import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { RestUserService } from 'src/app/services/restUser/rest-user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: User;
  userLogged: any;

  constructor(private restUser: RestUserService, private router: Router) { 
    this.user = new User("", "", "", "", "", 0, "", "", [], [], false);
  }

  ngOnInit(): void {
  }

  onSubmit(userForm: NgForm){
    this.restUser.login(this.user).subscribe((res:any) => {
      if(res.token){

        delete res.user.password;

        this.userLogged = JSON.stringify(res.user);

        localStorage.setItem("token",res.token);
        localStorage.setItem("user", this.userLogged);

        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: "Usuario logeado exitosamente exitosamente"
        })
        this.router.navigateByUrl('home');
      }else{
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: res.message
        })
      }
    },
    (error:any) => 
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: error.error.message
      })
    )
  }

}
