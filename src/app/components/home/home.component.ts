import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user = JSON.parse(localStorage.getItem("user")!) || null;

  constructor() { 
    this.user = JSON.parse(localStorage.getItem("user")!) || null;
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user")!) || null;
  }

}
