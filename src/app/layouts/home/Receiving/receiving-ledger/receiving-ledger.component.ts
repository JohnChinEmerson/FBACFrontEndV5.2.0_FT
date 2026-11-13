import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-receiving-ledger',
  templateUrl: './receiving-ledger.component.html',
  styleUrls: ['./receiving-ledger.component.css']
})
export class ReceivingLedgerComponent implements OnInit {

  indexTables : any;

  constructor() { }

  ngOnInit(): void {
    this.indexTables = {
      'AccountTitleTable' : 'receivingaccounttitles',
      'TransactionTable' : 'receivingheaders',
      'TransName' : 'Receiving',
      'Source' : 'Transaction'
    };
  }

}
