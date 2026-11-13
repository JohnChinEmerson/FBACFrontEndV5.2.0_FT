import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier-payment-ledger',
  templateUrl: './supplier-payment-ledger.component.html',
  styleUrls: ['./supplier-payment-ledger.component.css']
})
export class SupplierPaymentLedgerComponent implements OnInit {

  indexTables : any;

  constructor() { }

  ngOnInit(): void {
    this.indexTables = {
      'AccountTitleTable' : 'supplierpaymentaccounttitles',
      'TransactionTable' : 'supplierpaymentheaders',
      'TransName' : 'Supplier Payment',
      'Source' : 'Transaction'
    };
  }
}
