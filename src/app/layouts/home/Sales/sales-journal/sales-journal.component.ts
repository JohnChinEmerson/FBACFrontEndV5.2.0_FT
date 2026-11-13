import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-journal',
  templateUrl: './sales-journal.component.html',
  styleUrls: ['./sales-journal.component.css']
})
export class SalesJournalComponent implements OnInit {
  indexTables : any;
  constructor() { }

  ngOnInit(): void {
    this.indexTables = {
      'AccountTitleTable' : 'saleaccounttitles',
      'TransactionTable' : 'saleheaders',
      'TransName' : 'Sales',
      'Source' : 'Transaction'
    };
  }

}
