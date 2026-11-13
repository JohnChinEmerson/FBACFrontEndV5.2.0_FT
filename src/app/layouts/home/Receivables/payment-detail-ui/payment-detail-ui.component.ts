import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PaymentDetailsService } from 'src/app/services/Receivables/payment-details.service';

@Component({
  selector: 'app-payment-detail-ui',
  templateUrl: './payment-detail-ui.component.html',
  styleUrls: ['./payment-detail-ui.component.css']
})
export class PaymentDetailUIComponent implements OnInit {
  @ViewChild('amountInput') amountInput!: ElementRef;
  btnText               : string = "Save";
  loading               : boolean = false;
  paymentDetail   : any=[];
  action          :string;
  paymentDetailForm = new FormGroup({
              id            : new FormControl(''),
              TransNo       : new FormControl(''),
              TransCode     : new FormControl(''),
              SourceTransNo     : new FormControl(''),
              Amount     : new FormControl(''),
              
  });

  constructor(
    private dialogRef         : MatDialogRef<PaymentDetailUIComponent>,
    private dialog            : MatDialog,
    private paymentDetailsService: PaymentDetailsService,
    private dateTimesService: DateTimesService,
    private notif             : NotificationService,
    private numbersService    : NumbersService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.paymentDetail = this.data[0];
      this.action = this.data[1];
      if (!this.paymentDetail && (this.action.toLowerCase() == 'additempaymenttransaction' )) {
        this.btnText = "Save";
        this.getPaymentDetailForm1();
      }

      if (this.paymentDetail && (this.action.toLowerCase() == 'updatepaymenttransaction' || this.action.toLowerCase() == 'editpaymentrecord')) {
        this.btnText = "Update";
        this.getPaymentDetailForm2();
      }
      
      if (!this.paymentDetail && (this.action.toLowerCase() == 'additempaymentreceipts' )) {
        this.btnText = "Add";
        this.getPaymentDetailForm3();
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.amountInput.nativeElement.focus();  
      this.amountInput.nativeElement.select(); 
    }, 500);
  }


  getPaymentDetailForm1(){
   
  }
  
  getPaymentDetailForm2(){
    this.paymentDetailForm.controls['id'].setValue(this.paymentDetail.id);
    this.paymentDetailForm.controls['TransNo'].setValue(this.paymentDetail.TransNo);
    this.paymentDetailForm.controls['TransCode'].setValue(this.paymentDetail.TransCode);
    this.paymentDetailForm.controls['SourceTransNo'].setValue(this.paymentDetail.SourceTransNo);
    this.paymentDetailForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(this.paymentDetail.Amount));
  }

  getPaymentDetailForm3(){
    
  }

  validateForm(){
    return this.onSubmit();
  }
  onSubmit(){
   
    this.loading = true;
    this.paymentDetailsService.updatePaymentDetail(this.paymentDetailForm.getRawValue(), this.action).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.paymentDetail);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

}
