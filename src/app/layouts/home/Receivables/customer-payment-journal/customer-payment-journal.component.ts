import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-payment-journal',
  templateUrl: './customer-payment-journal.component.html',
  styleUrls: ['./customer-payment-journal.component.css']
})
export class CustomerPaymentJournalComponent implements OnInit {

  indexTables : any;
  constructor() { }

  ngOnInit(): void {
    this.indexTables = {
      'AccountTitleTable' : 'paymentaccounttitles',
      'TransactionTable' : 'paymentheaders',
      'TransName' : 'Customer Payment',
      'Source' : 'Transaction'
    };
  }

}
