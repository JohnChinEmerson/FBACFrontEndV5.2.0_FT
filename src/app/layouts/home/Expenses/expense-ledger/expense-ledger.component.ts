import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expense-ledger',
  templateUrl: './expense-ledger.component.html',
  styleUrls: ['./expense-ledger.component.css']
})
export class ExpenseLedgerComponent implements OnInit {

  indexTables : any;

  constructor() { }

  ngOnInit(): void {
    this.indexTables = {
      'AccountTitleTable' : 'expenseaccounttitles',
      'TransactionTable' : 'expenseheaders',
      'TransName' : 'Expense',
      'Source' : 'Transaction'
    };
  }
}
