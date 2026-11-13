import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateTimesService } from 'src/app/services/date-times.service';
import { ExpenseDetailsService } from 'src/app/services/Expenses/expense-details.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';

@Component({
  selector: 'app-expense-detail-ui',
  templateUrl: './expense-detail-ui.component.html',
  styleUrls: ['./expense-detail-ui.component.css']
})
export class ExpenseDetailUIComponent implements OnInit {
  @ViewChild('amountInput') amountInput!: ElementRef;
  btnText               : string = "Save";
  loading               : boolean = false;
  expenseDetail: any=[];
  discountPersons: any=[];
  expiryDates: any=[];
  particular:any=[];
  action:string;
  chkExpiry:boolean = false;
  expenseDetailForm = new FormGroup({
              id            : new FormControl(''),
              TransNo       : new FormControl(''),
              TransCode     : new FormControl(''),
              PayeeId        : new FormControl(''),
              ParticularId        : new FormControl(''),
              ParticularName      : new FormControl(''),
              Discount      : new FormControl(''),
              DiscountValue : new FormControl(''),
              DiscountType  : new FormControl(''),
              Amount        : new FormControl(''),
              AmountDue        : new FormControl(''),
  });

  constructor(
    private dialogRef             : MatDialogRef<ExpenseDetailUIComponent>,
    private dialog                : MatDialog,
    private expenseDetailsService : ExpenseDetailsService,
    private dateTimesService  : DateTimesService,
    private notif             : NotificationService,
    private numbersService    : NumbersService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.expenseDetail = this.data[0];
      this.particular = this.data[1];
      this.action = this.data[2];
      if (!this.expenseDetail && (this.action.toLowerCase() == 'additemexpensetransaction' )) {
        this.btnText = "Save";
        this.getExpenseDetailForm1();
      }

      if (this.expenseDetail && (this.action.toLowerCase() == 'updateexpensetransaction' || this.action.toLowerCase() == 'editexpenserecord')) {
        this.btnText = "Update";
        this.getExpenseDetailForm2();
      }
      
      if (!this.expenseDetail && (this.action.toLowerCase() == 'additemexpensereceipts' )) {
        this.btnText = "Add";
        this.getExpenseDetailForm3();
      }
    }
  }
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.amountInput.nativeElement.focus();  
      this.amountInput.nativeElement.select(); 
    }, 500);
  }

  getExpenseDetailForm1(){
    this.expenseDetailForm.controls['TransCode'].setValue(this.particular.TransCode);
    this.expenseDetailForm.controls['PayeeId'].setValue(this.particular.PayeeId);
    this.expenseDetailForm.controls['ParticularId'].setValue(this.particular.ParticularId);
    this.expenseDetailForm.controls['ParticularName'].setValue(this.particular.ParticularName);
    this.expenseDetailForm.controls['DiscountType'].setValue('percent');
    this.expenseDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(0));
    this.expenseDetailForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(this.particular.Amount) );
    if(this.particular.Amount > 0){
      this.expenseDetailForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(this.particular.Amount));
    }
    this.computeExpenseDetailAmount();
  }
  
  getExpenseDetailForm2(){
    this.expenseDetailForm.controls['id'].setValue(this.expenseDetail.id);
    this.expenseDetailForm.controls['TransNo'].setValue(this.expenseDetail.TransNo);
    this.expenseDetailForm.controls['TransCode'].setValue(this.expenseDetail.TransCode);
    this.expenseDetailForm.controls['ParticularId'].setValue(this.expenseDetail.ParticularId);
    this.expenseDetailForm.controls['ParticularName'].setValue(this.expenseDetail.ParticularName);
    this.expenseDetailForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(this.expenseDetail.Amount));
    this.expenseDetailForm.controls['Discount'].setValue(this.numbersService.Convert2Decimal(this.expenseDetail.Discount));
    this.expenseDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.expenseDetail.DiscountValue));
    this.expenseDetailForm.controls['DiscountType'].setValue(this.expenseDetail.DiscountType);
    this.computeExpenseDetailAmount();
  }

  getExpenseDetailForm3(){
    this.expenseDetailForm.controls['TransCode'].setValue(this.particular.TransCode);
    this.expenseDetailForm.controls['TransNo'].setValue(this.particular.TransNo);
    this.expenseDetailForm.controls['PayeeId'].setValue(this.particular.PayeeId);
    this.expenseDetailForm.controls['ParticularId'].setValue(this.particular.ParticularId);
    this.expenseDetailForm.controls['ParticularName'].setValue(this.particular.ParticularName);
    this.expenseDetailForm.controls['Amount'].setValue(this.particular.Amount);
    this.expenseDetailForm.controls['DiscountType'].setValue('percent');
    this.expenseDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(0));
    this.computeExpenseDetailAmount();
  }


  computeExpenseDetailAmount(){
    var amount = +this.expenseDetailForm.controls['Amount'].value;
    var discountValue = +this.expenseDetailForm.controls['DiscountValue'].value;
    var discountType = this.expenseDetailForm.controls['DiscountType'].value;

    this.expenseDetailsService.computeExpenseDetailAmount(amount, discountValue,discountType, this.expenseDetail?.VATType ?? 'vat included')
    .subscribe((amounts: any) => {
      this.expenseDetailForm.controls['Discount'].setValue(this.numbersService.Convert2Decimal(amounts.Discount));
      this.expenseDetailForm.controls['AmountDue'].setValue(this.numbersService.Convert2Decimal(amounts.AmountDue));
    });
  }


  onSubmit(){
    this.loading = true;
    this.expenseDetailsService.updateExpenseDetail(this.expenseDetailForm.getRawValue(), this.action).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.expenseDetail);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  onEnterQty() {
    this.computeExpenseDetailAmount();
    this.onSubmit();  
  }
}
