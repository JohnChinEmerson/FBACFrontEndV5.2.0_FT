import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-receiving-journal',
  templateUrl: './receiving-journal.component.html',
  styleUrls: ['./receiving-journal.component.css']
})
export class ReceivingJournalComponent implements OnInit {

  indexTables : any;
  constructor() { }

  ngOnInit(): void {
      this.indexTables = {
        'AccountTitleTable' : 'receivingaccounttitles',
        'TransactionTable' : 'receivingheaders',
        'TransName' : 'Receiving',
      };

  }
}
