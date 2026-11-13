import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { DisbursedPettyCashService } from 'src/app/services/Disbursements/disbursed-petty-cash.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';

@Component({
  selector: 'app-liquidate-ui',
  templateUrl: './liquidate-ui.component.html',
  styleUrls: ['./liquidate-ui.component.css']
})
export class LiquidateUIComponent implements OnInit {
  btnText   : string = "Save";
  pettyCash   : any=[];
  receipts : any=[];
  action   : any;
  loading                   : boolean = false;
  liquidateForm  = new FormGroup({
      DisburseNo           : new FormControl(),
      AmountReleased             : new FormControl(),
      AmountUsed           : new FormControl(),
      AmountLeft              : new FormControl(),
      AmountCount           : new FormControl(),
      AmountVariance           : new FormControl(),
  });
  constructor(
    private dialogRef              : MatDialogRef<LiquidateUIComponent>,
    private disbursedPettyCashService : DisbursedPettyCashService,
    private numbersService    : NumbersService,
    private notif : NotificationService,
      @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    this.pettyCash = this.data[0];
    this.action = this.data[1];
    this.getliquidateFormData1();
  }

  async getReceipts(){
    this.receipts = await firstValueFrom(this.disbursedPettyCashService.loadUnliquidatedWithBalance());
    this.receipts.forEach(x => {
      if(x.ReceivedBy.toLowerCase() != 'na')
        x.ReceiptLabel = x.DisburseNo+' | '+ x.ReceivedBy;
      else
        x.ReceiptLabel = x.DisburseNo;
    });
  }

  getliquidateFormData1(){
    this.liquidateForm.controls['DisburseNo'].setValue(this.pettyCash.DisburseNo);
    this.liquidateForm.controls['AmountReleased'].setValue(this.numbersService.Convert2Decimal(this.pettyCash.AmountReleased) );
    this.liquidateForm.controls['AmountUsed'].setValue(this.numbersService.Convert2Decimal(this.pettyCash.AmountUsed) );
    this.liquidateForm.controls['AmountLeft'].setValue(this.numbersService.Convert2Decimal(this.pettyCash.AmountLeft) );
    this.liquidateForm.controls['AmountCount'].setValue(this.numbersService.Convert2Decimal(this.pettyCash.AmountCount) );
    this.onChangeAmountCount();
  }

  onChangeAmountCount()
  {
    var amountLeft = this.liquidateForm.controls['AmountLeft'].value;
    var amountCount = this.liquidateForm.controls['AmountCount'].value ?? 0;
    var variance = amountCount - amountLeft;
    this.liquidateForm.controls['AmountVariance'].setValue(this.numbersService.Convert2Decimal(variance) );

  }

  onSubmit(){
    this.loading = true;
    this.disbursedPettyCashService.liquidatePettyCash(this.pettyCash.DisburseNo, this.liquidateForm.controls['AmountCount'].value).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(true);
        this.loading = false;
      },
      error:(err)=>{
        this.notif.toastrError(err.error);
        this.loading = false;
      },
    })
  }

  onClose(){
    this.dialogRef.close(false);
  }

}
