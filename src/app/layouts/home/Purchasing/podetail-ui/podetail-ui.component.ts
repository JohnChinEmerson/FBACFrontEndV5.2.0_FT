import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MultipleUMsService } from 'src/app/services/Files/multiple-ums.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PODetailsService } from 'src/app/services/Purchasing/podetails.service';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';

@Component({
  selector: 'app-podetail-ui',
  templateUrl: './podetail-ui.component.html',
  styleUrls: ['./podetail-ui.component.css']
})
export class PODetailUIComponent implements OnInit {
  @ViewChild('qtyInput') qtyInput!: ElementRef;
  btnText               : string = "Save";
  loading               : boolean = false;
  poDetail: any=[];
  stock:any=[];
  action:string;
  unitMeasures                   : any=[];
  UM : string;
  poDetailForm = new FormGroup({
      id            : new FormControl(''),
      TransNo       : new FormControl(''),
      TransCode     : new FormControl(''),
      ItemId        : new FormControl(''),
      ItemName      : new FormControl(''),
      UM            : new FormControl(''),
      Price         : new FormControl(''),
      Cost          : new FormControl(''),
      Qty           : new FormControl(''),
      Discount      : new FormControl(''),
      DiscountValue : new FormControl(''),
      DiscountType  : new FormControl(''),
      Amount        : new FormControl(''),
      SupplierId    : new FormControl(''),
      QtySold    : new FormControl(''),
      SoldType    : new FormControl('sold weekly'),
  });

  constructor(
    private dialogRef         : MatDialogRef<PODetailUIComponent>,
    private dialog            : MatDialog,
    private poDetailsService  : PODetailsService,
    private saleDetailsService  : SaleDetailsService,
    private dateTimesService  : DateTimesService,
    private notif             : NotificationService,
    private numbersService    : NumbersService,
    private multipleUMsService    : MultipleUMsService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  async ngOnInit(): Promise<void> {
    if (this.data) {
      this.poDetail = this.data[0];
      this.stock = this.data[1];
      this.action = this.data[2];

        this.UM = this.stock.UM;
      await this.getMultipleUMs();

      if (!this.poDetail && (this.action.toLowerCase() == 'additempotransaction' )) {
        this.btnText = "Save";
        this.getPODetailForm1();
      }

      if (this.poDetail && (this.action.toLowerCase() == 'updatepotransaction' ||this.action.toLowerCase() == 'editporecord' )) {
        this.btnText = "Update";
        this.getPODetailForm2();
      }
      
      if (!this.poDetail && (this.action.toLowerCase() == 'additemporeceipts' )) {
        this.btnText = "Add";
        this.getPODetailForm3();
      }

      this.onChangeQtySold('sold weekly')
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.qtyInput.nativeElement.focus();  
      this.qtyInput.nativeElement.select(); 
    }, 500);
  }


  async getMultipleUMs(){
    this.unitMeasures = await firstValueFrom(this.multipleUMsService.loadMultipleUMsByItemId(this.stock.ItemId));
  }
  onChangeUM(data){
    this.poDetailForm.controls['Price'].setValue( this.numbersService.Convert2Decimal(data.Price) );
    this.poDetailForm.controls['Cost'].setValue( this.numbersService.Convert4Decimal(data.Cost) );
    this.UM = data.UM;
    this.computePODetailAmount();
  }


  getPODetailForm1(){
    this.poDetailForm.controls['TransCode'].setValue(this.stock.TransCode);
    this.poDetailForm.controls['SupplierId'].setValue(this.stock.SupplierId);
    this.poDetailForm.controls['ItemId'].setValue(this.stock.ItemId);
    this.poDetailForm.controls['ItemName'].setValue(this.stock.ItemName);
    this.poDetailForm.controls['UM'].setValue(this.stock.UM);
    this.poDetailForm.controls['Price'].setValue( this.numbersService.Convert2Decimal(this.stock.Price) );
    this.poDetailForm.controls['DiscountType'].setValue('percent');
    this.poDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(0));
    this.poDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));
    this.poDetailForm.controls['Cost'].setValue(this.numbersService.Convert4Decimal(this.stock.Cost) );
     if(this.stock.Qty > 0){
      this.poDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(this.stock.Qty));
    }
    this.computePODetailAmount();
  }
  
  getPODetailForm2(){
    this.poDetailForm.controls['id'].setValue(this.poDetail.id);
    this.poDetailForm.controls['TransNo'].setValue(this.poDetail.TransNo);
    this.poDetailForm.controls['TransCode'].setValue(this.poDetail.TransCode);
    this.poDetailForm.controls['ItemId'].setValue(this.poDetail.ItemId);
    this.poDetailForm.controls['ItemName'].setValue(this.poDetail.ItemName);
    this.poDetailForm.controls['UM'].setValue(this.poDetail.UM);

    this.poDetailForm.controls['Cost'].setValue(this.numbersService.Convert4Decimal(this.poDetail.Cost));
    this.poDetailForm.controls['Price'].setValue(this.numbersService.Convert2Decimal(this.poDetail.Price));
    this.poDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(this.poDetail.Qty));
    this.poDetailForm.controls['Discount'].setValue(this.numbersService.Convert2Decimal(this.poDetail.Discount));
    this.poDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.poDetail.DiscountValue));

    this.poDetailForm.controls['DiscountType'].setValue(this.poDetail.DiscountType);
    this.computePODetailAmount();
  }

  getPODetailForm3(){
    this.poDetailForm.controls['TransCode'].setValue(this.stock.TransCode);
    this.poDetailForm.controls['TransNo'].setValue(this.stock.TransNo);
    this.poDetailForm.controls['SupplierId'].setValue(this.stock.SupplierId);
    this.poDetailForm.controls['ItemId'].setValue(this.stock.ItemId);
    this.poDetailForm.controls['ItemName'].setValue(this.stock.ItemName);
    this.poDetailForm.controls['UM'].setValue(this.stock.UM);
    this.poDetailForm.controls['Price'].setValue( this.numbersService.Convert2Decimal(this.stock.Price) );
    this.poDetailForm.controls['DiscountType'].setValue('percent');
    this.poDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(0));
    this.poDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));
    this.poDetailForm.controls['Cost'].setValue( this.numbersService.Convert4Decimal(this.stock.Cost) );
    this.computePODetailAmount();
  }


  computePODetailAmount(){
    var cost = +this.poDetailForm.controls['Cost'].value;
    var discountValue = +this.poDetailForm.controls['DiscountValue'].value;
    var discountType = this.poDetailForm.controls['DiscountType'].value;
    var qty = +this.poDetailForm.controls['Qty'].value;

    this.poDetailsService.computePODetailAmount(cost, discountValue, qty, discountType)
    .subscribe((amounts: any) => {

    this.poDetailForm.controls['Discount'].setValue(this.numbersService.Convert2Decimal(amounts.Discount));
    this.poDetailForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(amounts.Amount));
    });
  }

 onChangeQtySold(soldType)
  {
      if (soldType.toLowerCase() == "sold weekly")
      {
        this.GetQtySold(7);
      }
      else 
      {
        this.GetQtySold(30);
      }
  }

  async GetQtySold( days)
  {
      var itemId = this.stock.ItemId;
      const dtFrom = new Date();
      dtFrom.setDate(dtFrom.getDate() - days);
      const dtTo = new Date(); // Current date
      var qtySold:number = await firstValueFrom(this.saleDetailsService.getQtySoldbyItemIdByDateFromByDateTo(
        itemId,
        this.dateTimesService.ConvertToDateFormat(new Date(dtFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(dtTo)),
      ))
    this.poDetailForm.controls['QtySold'].setValue(this.numbersService.Convert2Decimal(qtySold));
  }
  
  onSubmit(){
    this.loading = true;
    this.poDetailsService.updatePODetail(this.poDetailForm.getRawValue(), this.action).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.poDetail);
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
    this.computePODetailAmount();
    this.onSubmit();  
  }
}
