import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier-payment-journal',
  templateUrl: './supplier-payment-journal.component.html',
  styleUrls: ['./supplier-payment-journal.component.css']
})
export class SupplierPaymentJournalComponent implements OnInit {
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
