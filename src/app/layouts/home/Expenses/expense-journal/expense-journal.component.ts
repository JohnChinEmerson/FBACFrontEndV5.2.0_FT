import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expense-journal',
  templateUrl: './expense-journal.component.html',
  styleUrls: ['./expense-journal.component.css']
})
export class ExpenseJournalComponent implements OnInit {

  indexTables : any;
  constructor() { }

  ngOnInit(): void {
      this.indexTables = {
        'AccountTitleTable' : 'expenseaccounttitles',
        'TransactionTable' : 'expenseheaders',
        'TransName' : 'Expenses',
      };

  }

}
