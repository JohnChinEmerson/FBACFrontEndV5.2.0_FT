import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cash-transfer-ledger',
  templateUrl: './cash-transfer-ledger.component.html',
  styleUrls: ['./cash-transfer-ledger.component.css']
})
export class CashTransferLedgerComponent implements OnInit {

  indexTables : any;

  constructor() { }

  ngOnInit(): void {
    this.indexTables = {
      'AccountTitleTable' : 'cashtransferaccounttitles',
      'TransactionTable' : 'cashtransfers',
      'TransName' : 'CashTransfer',
      'Source' : 'Transaction'
    };
  }

}
