import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modulo/login/login.component';
import { CadastroComponent } from './modulo/cadastro/cadastro.component';
import { HomeComponent } from './modulo/home/home.component';
import { DesafioDiarioComponent } from './modulo/desafio-diario/desafio-diario.component';
import { SobreComponent } from './modulo/sobre/sobre.component';
import { EstatisticasDiariaComponent } from './modulo/estatisticas-diaria/estatisticas-diaria.component';
import { PaginaUsuarioComponent } from './modulo/pagina-usuario/pagina-usuario.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'desafio-diario', component: DesafioDiarioComponent },
  { path: 'sobre', component: SobreComponent },
  { path: 'estatisticas-diaria', component: EstatisticasDiariaComponent },
  { path: 'perfil', component: PaginaUsuarioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
