import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestUserService } from 'src/app/services/restUser/rest-user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  token: any;
  user: any;

  constructor(private route: Router, private restUser: RestUserService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem("token")! || null;
    this.user = JSON.parse(localStorage.getItem("user")!) || null;
  }

  ngDoCheck(){
    this.token = this.restUser.getToken();
    this.user = JSON.parse(localStorage.getItem("user")!) || null;
  }

  logOut(){
    localStorage.clear();
    this.route.navigateByUrl("home");
  }

}
