import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DisbursedPettyCashService } from '../../../../services/Disbursements/disbursed-petty-cash.service';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';

@Component({
  selector: 'app-offset-from-petty-cash-ui',
  templateUrl: './offset-from-petty-cash-ui.component.html',
  styleUrls: ['./offset-from-petty-cash-ui.component.css']
})
export class OffsetFromPettyCashUIComponent implements OnInit {
  btnText   : string = "Update";
  voucher   : any=[];
  receipts : any=[];
  action   : any;
  loading                   : boolean = false;
  offsetFromPettyCashForm  = new FormGroup({
      TransName           : new FormControl('Petty Cash'),
      PayToId             : new FormControl('CASH'),
      PayToName           : new FormControl('CASH'),
      Amount              : new FormControl('0'),
      DisburseNo           : new FormControl(''),
  });
  constructor(
    private dialogRef              : MatDialogRef<OffsetFromPettyCashUIComponent>,
    private disbursedPettyCashService : DisbursedPettyCashService,
    private numbersService : NumbersService,
    private notif : NotificationService,
      @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    this.voucher = this.data[0];
    this.action = this.data[1];
    if(this.action == 'offsetfrompettycashdisbursement'){
      this.getoffsetFromPettyCashFormData1();
    }
    this.getReceipts();
  }

  async getReceipts(){
    this.receipts = await firstValueFrom(this.disbursedPettyCashService.loadUnliquidatedWithBalance());
    this.receipts.forEach(x => {
      if(x.ReceivedBy.toLowerCase() != 'na')
        x.ReceiptLabel = x.DisburseNo+' | '+ x.ReceivedBy+' - '+x.AmountLeft;
      else
        x.ReceiptLabel = x.DisburseNo+' - '+this.numbersService.Convert2Decimal(x.AmountLeft) ;
    });
  }

  getoffsetFromPettyCashFormData1(){
    this.offsetFromPettyCashForm.controls['TransName'].setValue(this.voucher.TransName);
    this.offsetFromPettyCashForm.controls['PayToId'].setValue(this.voucher.PayToId);
    this.offsetFromPettyCashForm.controls['PayToName'].setValue(this.voucher.PayToName);
    this.offsetFromPettyCashForm.controls['Amount'].setValue(this.voucher.Amount);

    if(this.voucher.TransName.toLowerCase() == 'purchasing'){
      this.offsetFromPettyCashForm.controls['Amount'].enable();
    }else{
      this.offsetFromPettyCashForm.controls['Amount'].disable();
    }

  }

  onSubmit(){
    var receipt = this.receipts.find(x => x.DisburseNo.toLowerCase() == this.offsetFromPettyCashForm.controls['DisburseNo'].value.toLowerCase());
    if (+this.offsetFromPettyCashForm.controls['Amount'].value > +receipt.AmountLeft)
    {
      return this.notif.toastrWarning("Disbursed Petty Cash Amount Left is " + receipt.AmountLeft)
    }
      
    this.loading = true;

    var data:any = {
      'voucher' : this.voucher,
      'receipt' : receipt,
      'request' : this.offsetFromPettyCashForm.getRawValue(),
    }

    this.disbursedPettyCashService.saveOffsetFromPettyCash(data, this.btnText).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.disbursementHeader);
        this.loading = false;
      },
      error:(err)=>{
        this.notif.toastrError(err.error);
        this.loading = false;
      },
    })
  }

  onClose(){
    this.dialogRef.close();
  }
}
