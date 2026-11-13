import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateTimesService } from 'src/app/services/date-times.service';
import { ExpiryDatesService } from 'src/app/services/Inventory/expiry-dates.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';

@Component({
  selector: 'app-item-expiry-date-ui',
  templateUrl: './item-expiry-date-ui.component.html',
  styleUrls: ['./item-expiry-date-ui.component.css']
})
export class ItemExpiryDateUIComponent implements OnInit {

  btnText               : string = "Save";
  loading               : boolean = false;
  expiryDate: any=[];
  stock:any=[];
  action:string;
  chkExpiry:boolean = false;
  expiryDateForm = new FormGroup({
              id            : new FormControl(''),
              ItemId        : new FormControl(''),
              ItemName      : new FormControl(''),
              UM            : new FormControl(''),
              Qty            : new FormControl(''),
              Category            : new FormControl(''),
              Cost            : new FormControl(''),
              Price            : new FormControl(''),
              ExpiryDate2    : new FormControl(''),
              ExpiryDate    : new FormControl(''),
              BatchLotNo    : new FormControl(''),
  });

  constructor(
    private dialogRef         : MatDialogRef<ItemExpiryDateUIComponent>,
    private dialog            : MatDialog,
    private expiryDatesService: ExpiryDatesService,
    private dateTimesService: DateTimesService,
    private notif             : NotificationService,
    private numbersService    : NumbersService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.expiryDate = this.data[0];
      this.stock = this.data[1];

      this.getDefaultForm();

      if (!this.expiryDate) {
        this.btnText = "Save";
      }
      else{
        this.btnText = "Update";
        this.getExpiryDateForm();
      }
    }
  }

  getDefaultForm(){
    this.expiryDateForm.controls['ItemId'].setValue(this.stock.ItemId);
    this.expiryDateForm.controls['ItemName'].setValue(this.stock.ItemName);
    this.expiryDateForm.controls['UM'].setValue(this.stock.UM);
    this.expiryDateForm.controls['Category'].setValue(this.stock.Category);
    this.expiryDateForm.controls['Price'].setValue( this.numbersService.Convert2Decimal(this.stock.Price) );
    this.expiryDateForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));
    this.expiryDateForm.controls['Cost'].setValue(this.numbersService.Convert2Decimal(this.stock.Cost) );
    this.expiryDateForm.controls['ExpiryDate2'].setValue(this.dateTimesService.ConvertToDateFormat(new Date()));
    this.expiryDateForm.controls['BatchLotNo'].setValue('');
  }
  
  getExpiryDateForm(){
    this.expiryDateForm.controls['id'].setValue(this.expiryDate.id);
    this.expiryDateForm.controls['ExpiryDate2'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.expiryDate.ExpiryDate2)));
    this.expiryDateForm.controls['BatchLotNo'].setValue(this.expiryDate.BatchLotNo);
    this.expiryDateForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(this.expiryDate.Qty));

  }

  onSubmit(){
      this.expiryDateForm.controls['ExpiryDate2'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.expiryDateForm.controls['ExpiryDate2'].value)));
      this.expiryDateForm.controls['ExpiryDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.expiryDateForm.controls['ExpiryDate2'].value)));
    this.loading = true;
    this.expiryDatesService.saveExpiry2(this.expiryDateForm.getRawValue(), this.btnText).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.expiryDate);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

}
