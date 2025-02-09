import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-escolher-areas-conhecimento',
  templateUrl: './escolher-areas-conhecimento.component.html',
  styleUrls: ['./escolher-areas-conhecimento.component.scss']
})
export class EscolherAreasConhecimentoComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  selecionarArea(area: number): void {
    this.router.navigate(['/desafio-diario'], {
      queryParams: { area: area }
    });
  }  
}
