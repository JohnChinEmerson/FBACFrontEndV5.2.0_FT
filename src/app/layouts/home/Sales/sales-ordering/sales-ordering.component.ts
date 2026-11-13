import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-ordering',
  templateUrl: './sales-ordering.component.html',
  styleUrls: ['./sales-ordering.component.css']
})
export class SalesOrderingComponent implements OnInit {
  type : any = 'Ordering';

  constructor() { }

  ngOnInit(): void {
  }

}
