import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-payment-ledger',
  templateUrl: './customer-payment-ledger.component.html',
  styleUrls: ['./customer-payment-ledger.component.css']
})
export class CustomerPaymentLedgerComponent implements OnInit {

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
