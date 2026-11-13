import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock-adjustment-ledger',
  templateUrl: './stock-adjustment-ledger.component.html',
  styleUrls: ['./stock-adjustment-ledger.component.css']
})
export class StockAdjustmentLedgerComponent implements OnInit {

  indexTables : any;

  constructor() { }

  ngOnInit(): void {
    this.indexTables = {
      'AccountTitleTable' : 'stockadjustmentaccounttitles',
      'TransactionTable' : 'stockadjustmentheaders',
      'TransName' : 'StockAdjustment',
      'Source' : 'Transaction'
    };
  }

}
