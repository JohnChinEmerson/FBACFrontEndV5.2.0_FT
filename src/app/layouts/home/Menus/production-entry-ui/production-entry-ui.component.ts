import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';

// Production Transaction popups of the Desktop:
//  - 'qty'     : QuantityUI("StockIn") - qty of the item to produce (add / Edit)
//  - 'header'  : ProductionHeaderUI    - AdjustmentType StockIn, Reason "From Production", TransDate, ReportAs
//                (data[1] = existing header -> Update, from Production Receipts)
//  - 'additem' : AddItemToReceiptUI    - production item + qty added to an existing production
// data = [mode, { ItemName, UM, Qty }] | [mode, header?] | [mode, items]
@Component({
  selector: 'app-production-entry-ui',
  templateUrl: './production-entry-ui.component.html',
})
export class ProductionEntryUIComponent implements OnInit {
  mode          : string = 'qty';
  item          : any = {};
  qty           : any = 1;
  transDate     : any = new Date();
  reportAs      : string = 'Adjustment';
  reportAsList  = ['Adjustment'];   // Desktop ProductionHeaderUI.cboReportAs
  isUpdate      : boolean = false;
  items         : any[] = [];
  itemId        : string = null;

  constructor(
    private notificationService : NotificationService,
    private dialogRef           : MatDialogRef<ProductionEntryUIComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) { }

  ngOnInit(): void {
    this.mode = this.data[0];
    if (this.mode == 'qty') {
      this.item = this.data[1] || {};
      this.qty = +(this.item.Qty || 1);
    }
    if (this.mode == 'header' && this.data[1]) {
      this.isUpdate = true;
      this.transDate = new Date(this.data[1].TransDate);
      this.reportAs = this.data[1].ReportAs || 'Adjustment';
      if (!this.reportAsList.includes(this.reportAs)) this.reportAsList = [...this.reportAsList, this.reportAs];
    }
    if (this.mode == 'additem') {
      this.items = this.data[1] || [];
      this.qty = 1;
    }
  }

  get selectedItem(){
    return this.items.find(x => x.ItemId == this.itemId);
  }

  onSubmit(){
    if (this.mode == 'qty' || this.mode == 'additem') {
      if (this.mode == 'additem' && !this.itemId) return this.notificationService.toastrWarning('Select the item.');
      var qty = parseFloat(String(this.qty).replace(/,/g, ''));
      if (isNaN(qty) || qty <= 0) return this.notificationService.toastrWarning('Invalid Quantity.');
      return this.dialogRef.close({ 'Qty': qty, 'ItemId': this.itemId });
    }
    if (!this.transDate) return this.notificationService.toastrWarning('Input TransDate.');
    this.dialogRef.close({ 'TransDate': this.transDate, 'ReportAs': this.reportAs });
  }

  onClose(){
    this.dialogRef.close();
  }
}
