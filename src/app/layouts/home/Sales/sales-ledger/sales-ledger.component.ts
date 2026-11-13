import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-ledger',
  templateUrl: './sales-ledger.component.html',
  styleUrls: ['./sales-ledger.component.css']
})
export class SalesLedgerComponent implements OnInit {
  indexTables : any;

  constructor() { }

  ngOnInit(): void {
    this.indexTables = {
      'AccountTitleTable' : 'saleaccounttitles',
      'TransactionTable' : 'saleHeaders',
      'TransName' : 'Sales',
      'Source' : 'Transaction'
    };
  }

}
