import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RestUserService } from './services/restUser/rest-user.service';
import { CompanyComponent } from './components/company/company.component';
import { SearchPipe } from './pipes/search.pipe';
import { ProductsComponent } from './components/products/products.component';
import { OfficesComponent } from './components/offices/offices.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    CompanyComponent,
    SearchPipe,
    ProductsComponent,
    OfficesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [
    RestUserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
