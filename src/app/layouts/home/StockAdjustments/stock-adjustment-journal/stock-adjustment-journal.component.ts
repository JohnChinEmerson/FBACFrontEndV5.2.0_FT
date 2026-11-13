import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock-adjustment-journal',
  templateUrl: './stock-adjustment-journal.component.html',
  styleUrls: ['./stock-adjustment-journal.component.css']
})
export class StockAdjustmentJournalComponent implements OnInit {

  indexTables : any;
  constructor() { }

  ngOnInit(): void {
      this.indexTables = {
        'AccountTitleTable' : 'stockadjustmentaccounttitles',
        'TransactionTable' : 'stockadjustmentheaders',
        'TransName' : 'StockAdjustment',
      };

  }
}
