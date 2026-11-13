import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cash-transfer-journal',
  templateUrl: './cash-transfer-journal.component.html',
  styleUrls: ['./cash-transfer-journal.component.css']
})
export class CashTransferJournalComponent implements OnInit {

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
