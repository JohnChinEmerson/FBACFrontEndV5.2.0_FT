import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemPriceCategorysService } from 'src/app/services/Files/item-price-categorys.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { SaleReturnDetailsService } from 'src/app/services/SaleReturn/sale-return-details.service';
import { SaleConfigService } from 'src/app/services/Sales/sale-config.service';

@Component({
  selector: 'app-sale-return-detail-ui',
  templateUrl: './sale-return-detail-ui.component.html',
  styleUrls: ['./sale-return-detail-ui.component.css']
})
export class SaleReturnDetailUIComponent implements OnInit {
  @ViewChild('qtyInput') qtyInput!: ElementRef;
  btnText               : string = "Save";
  loading               : boolean = false;
  saleReturnDetail: any=[];
  saleDetail:any=[];
  action:string;
  saleConfig:any=[];
  saleReturnDetailForm = new FormGroup({
              id            : new FormControl(''),
              TransNo       : new FormControl(''),
              TransCode     : new FormControl(''),
              SaleDetailId: new FormControl(''),
              ItemId        : new FormControl(''),
              ItemName      : new FormControl(''),
              UM            : new FormControl(''),
              Price         : new FormControl(''),
              PriceCategory : new FormControl(''),
              Qty           : new FormControl(''),
              Discount      : new FormControl(''),
              DiscountValue : new FormControl(''),
              DiscountType  : new FormControl(''),
              Amount        : new FormControl(''),
              ExpiryDate    : new FormControl(''),
              ExpiryDate2   : new FormControl(''),
              BatchLotNo    : new FormControl(''),
              Reason    : new FormControl(''),
              CustomerId    : new FormControl(''),
  });

  constructor(
    private dialogRef         : MatDialogRef<SaleReturnDetailUIComponent>,
    private dialog            : MatDialog,
    private saleReturnDetailsService: SaleReturnDetailsService,
    private notif             : NotificationService,
    private itemPriceCategorysService    : ItemPriceCategorysService,
    private saleConfigService : SaleConfigService,
    private numbersService    : NumbersService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.saleReturnDetail = this.data[0];
      this.saleDetail = this.data[1];
      this.action = this.data[2];
      if (!this.saleReturnDetail && (this.action.toLowerCase() == 'additemsalereturntransaction' )) {
        this.btnText = "Save";
        this.getSaleReturnDetailForm1();
      }

      if (this.saleReturnDetail && (this.action.toLowerCase() == 'updatesalereturntransaction' || this.action.toLowerCase() == 'editsalereturnrecord' )) {
        this.btnText = "Update";
        this.getSaleReturnDetailForm2();
      }
      
      if (!this.saleReturnDetail && (this.action.toLowerCase() == 'additemsalereturnreceipts' )) {
        this.btnText = "Add";
        this.getSaleReturnDetailForm3();
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.qtyInput.nativeElement.focus();  
      this.qtyInput.nativeElement.select(); 
    }, 500);
  }

  getSaleReturnDetailForm1(){
    this.saleReturnDetailForm.controls['SaleDetailId'].setValue(this.saleDetail.id);
    this.saleReturnDetailForm.controls['TransCode'].setValue(this.saleDetail.TransCode);
    this.saleReturnDetailForm.controls['CustomerId'].setValue(this.saleDetail.CustomerId);
    this.saleReturnDetailForm.controls['ItemId'].setValue(this.saleDetail.ItemId);
    this.saleReturnDetailForm.controls['ItemName'].setValue(this.saleDetail.ItemName);
    this.saleReturnDetailForm.controls['UM'].setValue(this.saleDetail.UM);
    this.saleReturnDetailForm.controls['Price'].setValue( this.numbersService.Convert2Decimal(this.saleDetail.Price) );
    this.saleReturnDetailForm.controls['DiscountType'].setValue('percent');
    this.saleReturnDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(0));
    this.saleReturnDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));
    this.saleReturnDetailForm.controls['PriceCategory'].setValue(this.saleDetail.PriceCategory);
    this.saleReturnDetailForm.controls['ExpiryDate'].setValue('na');
    this.saleReturnDetailForm.controls['ExpiryDate2'].setValue('na');
    this.saleReturnDetailForm.controls['BatchLotNo'].setValue('na');
    this.saleReturnDetailForm.controls['Reason'].setValue('na');
    this.computeSaleReturnDetailAmount();
  }
  
  getSaleReturnDetailForm2(){
    this.saleReturnDetailForm.controls['id'].setValue(this.saleReturnDetail.id);
    this.saleReturnDetailForm.controls['SaleDetailId'].setValue(this.saleDetail.id);
    this.saleReturnDetailForm.controls['TransNo'].setValue(this.saleReturnDetail.TransNo);
    this.saleReturnDetailForm.controls['TransCode'].setValue(this.saleReturnDetail.TransCode);
    this.saleReturnDetailForm.controls['ItemId'].setValue(this.saleReturnDetail.ItemId);
    this.saleReturnDetailForm.controls['ItemName'].setValue(this.saleReturnDetail.ItemName);
    this.saleReturnDetailForm.controls['UM'].setValue(this.saleReturnDetail.UM);
    this.saleReturnDetailForm.controls['PriceCategory'].setValue(this.saleReturnDetail.PriceCategory);

    this.saleReturnDetailForm.controls['Price'].setValue(this.numbersService.Convert2Decimal(this.saleReturnDetail.Price));
    this.saleReturnDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(this.saleReturnDetail.Qty));
    this.saleReturnDetailForm.controls['Discount'].setValue(this.numbersService.Convert2Decimal(this.saleReturnDetail.Discount));
    this.saleReturnDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.saleReturnDetail.DiscountValue));

    this.saleReturnDetailForm.controls['DiscountType'].setValue(this.saleReturnDetail.DiscountType);
    this.saleReturnDetailForm.controls['ExpiryDate'].setValue(this.saleReturnDetail.ExpiryDate);
    this.saleReturnDetailForm.controls['ExpiryDate2'].setValue(this.saleReturnDetail.ExpiryDate2);
    this.saleReturnDetailForm.controls['BatchLotNo'].setValue(this.saleReturnDetail.BatchLotNo);
    this.saleReturnDetailForm.controls['Reason'].setValue(this.saleReturnDetail.Reason);
    this.computeSaleReturnDetailAmount();
  }

  getSaleReturnDetailForm3(){
    this.saleReturnDetailForm.controls['TransCode'].setValue(this.saleDetail.TransCode);
    this.saleReturnDetailForm.controls['TransNo'].setValue(this.saleDetail.TransNo);
    this.saleReturnDetailForm.controls['CustomerId'].setValue(this.saleDetail.CustomerId);
    this.saleReturnDetailForm.controls['ItemId'].setValue(this.saleDetail.ItemId);
    this.saleReturnDetailForm.controls['SaleDetailId'].setValue(this.saleDetail.id);
    this.saleReturnDetailForm.controls['ItemName'].setValue(this.saleDetail.ItemName);
    this.saleReturnDetailForm.controls['UM'].setValue(this.saleDetail.UM);
    this.saleReturnDetailForm.controls['Price'].setValue( this.numbersService.Convert2Decimal(this.saleDetail.Price) );
    this.saleReturnDetailForm.controls['DiscountType'].setValue('percent');
    this.saleReturnDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(0));
    this.saleReturnDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));
    this.saleReturnDetailForm.controls['PriceCategory'].setValue(this.saleDetail.PriceCategory);
    this.saleReturnDetailForm.controls['ExpiryDate'].setValue('na');
    this.saleReturnDetailForm.controls['ExpiryDate2'].setValue('na');
    this.saleReturnDetailForm.controls['BatchLotNo'].setValue('na');
    this.saleReturnDetailForm.controls['Reason'].setValue('na');
    this.computeSaleReturnDetailAmount();
  }


  computeSaleReturnDetailAmount(){
    var price = +this.saleReturnDetailForm.controls['Price'].value;
    var discountValue = +this.saleReturnDetailForm.controls['DiscountValue'].value;
    var discountType = this.saleReturnDetailForm.controls['DiscountType'].value;
    var qty = +this.saleReturnDetailForm.controls['Qty'].value;

    var vATType="";
    if (this.saleDetail != null)
        vATType = this.saleDetail.VATType;
    else
        vATType = this.saleReturnDetail.VATType;

    this.saleReturnDetailsService.computeSaleReturnDetailAmount(price, discountValue, qty, discountType, vATType)
    .subscribe((amounts: any) => {
      this.saleReturnDetailForm.controls['Discount'].setValue(this.numbersService.Convert2Decimal(amounts.Discount));
      this.saleReturnDetailForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(amounts.Amount));
    });

  }

  onSubmit(){
    this.loading = true;
    this.saleReturnDetailsService.updateSaleReturnDetail(this.saleReturnDetailForm.getRawValue(), this.action).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.saleReturnDetail);
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
    this.computeSaleReturnDetailAmount();
    this.onSubmit();  
  }
  
}
