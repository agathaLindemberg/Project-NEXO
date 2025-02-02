import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modulo/login/login.component';
import { CadastroComponent } from './modulo/cadastro/cadastro.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './modulo/home/home.component';
import { DesafioDiarioComponent } from './modulo/desafio-diario/desafio-diario.component';
import { MatIconModule } from '@angular/material/icon';
import { SobreComponent } from './modulo/sobre/sobre.component';
import { EstatisticasDiariaComponent } from './modulo/estatisticas-diaria/estatisticas-diaria.component';
import { ChartModule } from 'primeng/chart';
import { PaginaUsuarioComponent } from './modulo/pagina-usuario/pagina-usuario.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CadastroComponent,
    HomeComponent,
    DesafioDiarioComponent,
    SobreComponent,
    EstatisticasDiariaComponent,
    PaginaUsuarioComponent
  ],
  imports: [
    ChartModule,
    MatIconModule,
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
