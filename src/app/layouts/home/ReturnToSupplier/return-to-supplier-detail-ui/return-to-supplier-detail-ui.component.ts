import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { ReturnToSupplierDetailsService } from 'src/app/services/ReturnToSupplier/return-to-supplier-details.service';

@Component({
  selector: 'app-return-to-supplier-detail-ui',
  templateUrl: './return-to-supplier-detail-ui.component.html',
  styleUrls: ['./return-to-supplier-detail-ui.component.css']
})
export class ReturnToSupplierDetailUIComponent implements OnInit {
  @ViewChild('qtyInput') qtyInput!: ElementRef;
 btnText               : string = "Save";
  loading               : boolean = false;
  returnToSupplierDetail: any=[];
  receivingDetail:any=[];
  action:string;
  returnToSupplierDetailForm = new FormGroup({
              id            : new FormControl(''),
              TransNo       : new FormControl(''),
              TransCode     : new FormControl(''),
              ReceivingDetailId: new FormControl(''),
              ItemId        : new FormControl(''),
              ItemName      : new FormControl(''),
              UM            : new FormControl(''),
              Cost         : new FormControl(''),
              Qty           : new FormControl(''),
              Discount      : new FormControl(''),
              DiscountValue : new FormControl(''),
              DiscountType  : new FormControl(''),
              Amount        : new FormControl(''),
              ExpiryDate    : new FormControl(''),
              ExpiryDate2   : new FormControl(''),
              BatchLotNo    : new FormControl(''),
              Reason    : new FormControl(''),
              SupplierId    : new FormControl(''),
  });

  constructor(
    private dialogRef         : MatDialogRef<ReturnToSupplierDetailUIComponent>,
    private dialog            : MatDialog,
    private returnToSupplierDetailsService: ReturnToSupplierDetailsService,
    private notif             : NotificationService,
    private numbersService    : NumbersService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.returnToSupplierDetail = this.data[0];
      this.receivingDetail = this.data[1];
      this.action = this.data[2];
      if (!this.returnToSupplierDetail && (this.action.toLowerCase() == 'additemreturntosuppliertransaction' )) {
        this.btnText = "Save";
        this.getReturnToSupplierDetailForm1();
      }

      if (this.returnToSupplierDetail && (this.action.toLowerCase() == 'updatereturntosuppliertransaction' || this.action.toLowerCase() == 'editreturntosupplierrecord' )) {
        this.btnText = "Update";
        this.getReturnToSupplierDetailForm2();
      }
      
      if (!this.returnToSupplierDetail && (this.action.toLowerCase() == 'additemreturntosupplierreceipts' )) {
        this.btnText = "Add";
        this.getReturnToSupplierDetailForm3();
      }
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.qtyInput.nativeElement.focus();  
      this.qtyInput.nativeElement.select(); 
    }, 500);
  }

  getReturnToSupplierDetailForm1(){
    this.returnToSupplierDetailForm.controls['ReceivingDetailId'].setValue(this.receivingDetail.id);
    this.returnToSupplierDetailForm.controls['TransCode'].setValue(this.receivingDetail.TransCode);
    this.returnToSupplierDetailForm.controls['SupplierId'].setValue(this.receivingDetail.SupplierId);
    this.returnToSupplierDetailForm.controls['ItemId'].setValue(this.receivingDetail.ItemId);
    this.returnToSupplierDetailForm.controls['ItemName'].setValue(this.receivingDetail.ItemName);
    this.returnToSupplierDetailForm.controls['UM'].setValue(this.receivingDetail.UM);
    this.returnToSupplierDetailForm.controls['Cost'].setValue( this.numbersService.Convert2Decimal(this.receivingDetail.Cost) );
    this.returnToSupplierDetailForm.controls['DiscountType'].setValue('percent');
    this.returnToSupplierDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(0));
    this.returnToSupplierDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));
    this.returnToSupplierDetailForm.controls['ExpiryDate'].setValue('na');
    this.returnToSupplierDetailForm.controls['ExpiryDate2'].setValue('na');
    this.returnToSupplierDetailForm.controls['BatchLotNo'].setValue('na');
    this.returnToSupplierDetailForm.controls['Reason'].setValue('na');
    this.computeReturnToSupplierDetailAmount();
  }
  
  getReturnToSupplierDetailForm2(){
    this.returnToSupplierDetailForm.controls['id'].setValue(this.returnToSupplierDetail.id);
    this.returnToSupplierDetailForm.controls['ReceivingDetailId'].setValue(this.receivingDetail.id);
    this.returnToSupplierDetailForm.controls['TransNo'].setValue(this.returnToSupplierDetail.TransNo);
    this.returnToSupplierDetailForm.controls['TransCode'].setValue(this.returnToSupplierDetail.TransCode);
    this.returnToSupplierDetailForm.controls['ItemId'].setValue(this.returnToSupplierDetail.ItemId);
    this.returnToSupplierDetailForm.controls['ItemName'].setValue(this.returnToSupplierDetail.ItemName);
    this.returnToSupplierDetailForm.controls['UM'].setValue(this.returnToSupplierDetail.UM);

    this.returnToSupplierDetailForm.controls['Cost'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierDetail.Cost));
    this.returnToSupplierDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierDetail.Qty));
    this.returnToSupplierDetailForm.controls['Discount'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierDetail.Discount));
    this.returnToSupplierDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierDetail.DiscountValue));

    this.returnToSupplierDetailForm.controls['DiscountType'].setValue(this.returnToSupplierDetail.DiscountType);
    this.returnToSupplierDetailForm.controls['ExpiryDate'].setValue(this.returnToSupplierDetail.ExpiryDate);
    this.returnToSupplierDetailForm.controls['ExpiryDate2'].setValue(this.returnToSupplierDetail.ExpiryDate2);
    this.returnToSupplierDetailForm.controls['BatchLotNo'].setValue(this.returnToSupplierDetail.BatchLotNo);
    this.returnToSupplierDetailForm.controls['Reason'].setValue(this.returnToSupplierDetail.Reason);
    this.computeReturnToSupplierDetailAmount();
  }

  getReturnToSupplierDetailForm3(){
    this.returnToSupplierDetailForm.controls['TransCode'].setValue(this.receivingDetail.TransCode);
    this.returnToSupplierDetailForm.controls['TransNo'].setValue(this.receivingDetail.TransNo);
    this.returnToSupplierDetailForm.controls['SupplierId'].setValue(this.receivingDetail.SupplierId);
    this.returnToSupplierDetailForm.controls['ItemId'].setValue(this.receivingDetail.ItemId);
    this.returnToSupplierDetailForm.controls['ReceivingDetailId'].setValue(this.receivingDetail.id);
    this.returnToSupplierDetailForm.controls['ItemName'].setValue(this.receivingDetail.ItemName);
    this.returnToSupplierDetailForm.controls['UM'].setValue(this.receivingDetail.UM);
    this.returnToSupplierDetailForm.controls['Cost'].setValue( this.numbersService.Convert2Decimal(this.receivingDetail.Cost) );
    this.returnToSupplierDetailForm.controls['DiscountType'].setValue('percent');
    this.returnToSupplierDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(0));
    this.returnToSupplierDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));
    this.returnToSupplierDetailForm.controls['ExpiryDate'].setValue('na');
    this.returnToSupplierDetailForm.controls['ExpiryDate2'].setValue('na');
    this.returnToSupplierDetailForm.controls['BatchLotNo'].setValue('na');
    this.returnToSupplierDetailForm.controls['Reason'].setValue('na');
    this.computeReturnToSupplierDetailAmount();
  }


  computeReturnToSupplierDetailAmount(){
    var cost = +this.returnToSupplierDetailForm.controls['Cost'].value;
    var discountValue = +this.returnToSupplierDetailForm.controls['DiscountValue'].value;
    var discountType = this.returnToSupplierDetailForm.controls['DiscountType'].value;
    var qty = +this.returnToSupplierDetailForm.controls['Qty'].value;


    this.returnToSupplierDetailsService.computeReturnToSupplierDetailAmount(cost, discountValue, qty, discountType)
    .subscribe((amounts: any) => {
      this.returnToSupplierDetailForm.controls['Discount'].setValue(this.numbersService.Convert2Decimal(amounts.Discount));
      this.returnToSupplierDetailForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(amounts.Amount));
    });

  }

  onSubmit(){
    this.loading = true;
    this.returnToSupplierDetailsService.updateReturnToSupplierDetail(this.returnToSupplierDetailForm.getRawValue(), this.action).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.returnToSupplierDetail);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }
  
  onClose(){
    this.dialogRef.close();
  }

  onEnterQty() {
    this.computeReturnToSupplierDetailAmount();
    this.onSubmit();  
  }

}
