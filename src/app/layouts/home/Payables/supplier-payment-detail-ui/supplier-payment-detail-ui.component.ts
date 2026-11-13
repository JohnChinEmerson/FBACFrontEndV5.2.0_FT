import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { SupplierPaymentDetailsService } from 'src/app/services/Payables/supplier-payment-details.service';

@Component({
  selector: 'app-supplier-payment-detail-ui',
  templateUrl: './supplier-payment-detail-ui.component.html',
  styleUrls: ['./supplier-payment-detail-ui.component.css']
})
export class SupplierPaymentDetailUIComponent implements OnInit {
  @ViewChild('amountInput') amountInput!: ElementRef;
  btnText               : string = "Save";
  loading               : boolean = false;
  supplierPaymentDetail   : any=[];
  action          :string;
  supplierPaymentDetailForm = new FormGroup({
    id            : new FormControl(''),
    TransNo       : new FormControl(''),
    TransCode     : new FormControl(''),
    SourceTransNo     : new FormControl(''),
    Amount     : new FormControl(''),
  });

  constructor(
    private dialogRef         : MatDialogRef<SupplierPaymentDetailUIComponent>,
    private dialog            : MatDialog,
    private supplierPaymentDetailsService: SupplierPaymentDetailsService,
    private dateTimesService: DateTimesService,
    private notif             : NotificationService,
    private numbersService    : NumbersService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.supplierPaymentDetail = this.data[0];
      this.action = this.data[1];
      if (!this.supplierPaymentDetail && (this.action.toLowerCase() == 'additemsupplierpaymenttransaction' )) {
        this.btnText = "Save";
        this.getPaymentDetailForm1();
      }

      if (this.supplierPaymentDetail && (this.action.toLowerCase() == 'updatesupplierpaymenttransaction' || this.action.toLowerCase() == 'editsupplierpaymentrecord' )) {
        this.btnText = "Update";
        this.getSupplierPaymentDetailForm2();
      }
      
      if (!this.supplierPaymentDetail && (this.action.toLowerCase() == 'additemsupplierpaymentreceipts' )) {
        this.btnText = "Add";
        this.getSupplierPaymentDetailForm3();
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
  
  getSupplierPaymentDetailForm2(){
    this.supplierPaymentDetailForm.controls['id'].setValue(this.supplierPaymentDetail.id);
    this.supplierPaymentDetailForm.controls['TransNo'].setValue(this.supplierPaymentDetail.TransNo);
    this.supplierPaymentDetailForm.controls['TransCode'].setValue(this.supplierPaymentDetail.TransCode);
    this.supplierPaymentDetailForm.controls['SourceTransNo'].setValue(this.supplierPaymentDetail.SourceTransNo);
    this.supplierPaymentDetailForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(this.supplierPaymentDetail.Amount));
  }

  getSupplierPaymentDetailForm3(){
    
  }

  validateForm(){
    return this.onSubmit();
  }
  onSubmit(){
   
    this.loading = true;
    this.supplierPaymentDetailsService.updateSupplierPaymentDetail(this.supplierPaymentDetailForm.getRawValue(), this.action).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.supplierPaymentDetail);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }


}
