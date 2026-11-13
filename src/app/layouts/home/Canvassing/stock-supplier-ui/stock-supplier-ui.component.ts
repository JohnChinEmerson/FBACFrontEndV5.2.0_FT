import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig ,MatDialogRef} from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { SuppliersService } from 'src/app/services/Files/suppliers.service';
import { StockSuppliersService } from 'src/app/services/Inventory/stock-suppliers.service';
import { SupplierUIComponent } from '../../Files/supplier-ui/supplier-ui.component';
import { NotificationService } from 'src/app/services/notification.service';
import { MatTableService } from 'src/app/services/mat-table.service';

@Component({
  selector: 'app-stock-supplier-ui',
  templateUrl: './stock-supplier-ui.component.html',
  styleUrls: ['./stock-supplier-ui.component.css']
})
export class StockSupplierUIComponent implements OnInit {
 stockSupplierForm = new FormGroup({
      id            : new FormControl(''),
      CanvassDetailSupplierId            : new FormControl(''),
      ItemId        : new FormControl(''),
      ItemName      : new FormControl(''),
      UM            : new FormControl(''),
      Category      : new FormControl(''),
      ItemType      : new FormControl(''),
      Cost          : new FormControl(),
      SupplierId      : new FormControl(''),
      SupplierName      : new FormControl(''),
      Address      : new FormControl(''),
      ContactNo      : new FormControl(''),
      TermDays      : new FormControl(''),
      DiscountPercent      : new FormControl('0'),
      MinimumQty      : new FormControl('0'),
  });
  stock : any = [];
  suppliers : any = [];
  canvassDetail : any = [];
  canvassDetailSupplier : any=[];
  btnText : string = 'Save';
  action : string;
  loading               : boolean = false;
  btnDisableSupplierId :boolean;
  btnDisableSupplierName :boolean;
  btnDisableTermDays:boolean;
  btnDisableDiscountPercent :boolean;
  btnDisableMinimumQty :boolean;
  constructor(
    private stockSuppliersService : StockSuppliersService,
    private suppliersService : SuppliersService,
    private dialog : MatDialog,
    private dialogRef : MatDialogRef<StockSupplierUIComponent>,
    private notif : NotificationService,
    public matTableService : MatTableService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    this.stock = this.data[0];
    this.canvassDetail = this.data[1];
    this.action = this.data[2];
    this.canvassDetailSupplier = this.data[3];
    this.getCBOSuppliers();
    this.getstockSupplierForm();
    if(this.canvassDetailSupplier){
      this.btnText = 'Update';
      this.getstockSupplierForm2();
    }
  
  }

  async getCBOSuppliers(){
    this.suppliers = await firstValueFrom(this.suppliersService.getCBOSuppliers());
  }

  getstockSupplierForm(){
    this.stockSupplierForm.controls['ItemId'].setValue(this.stock.ItemId);
    this.stockSupplierForm.controls['ItemName'].setValue(this.stock.ItemName);
    this.stockSupplierForm.controls['UM'].setValue(this.stock.UM);
    this.stockSupplierForm.controls['Category'].setValue(this.stock.Category);
    this.stockSupplierForm.controls['ItemType'].setValue(this.stock.ItemType);

    this.btnDisableSupplierId = false;
    this.btnDisableSupplierName = false;

    this.btnDisableTermDays= false;
    this.btnDisableDiscountPercent = false;
    this.btnDisableMinimumQty = false;
  }


  getstockSupplierForm2(){
    this.stockSupplierForm.controls['CanvassDetailSupplierId'].setValue(this.canvassDetailSupplier.id);
    this.stockSupplierForm.controls['ItemId'].setValue(this.canvassDetailSupplier.ItemId);
    this.stockSupplierForm.controls['ItemName'].setValue(this.canvassDetailSupplier.ItemName);
    this.stockSupplierForm.controls['UM'].setValue(this.canvassDetailSupplier.UM);
    this.stockSupplierForm.controls['Category'].setValue(this.canvassDetailSupplier.Category);
    this.stockSupplierForm.controls['ItemType'].setValue(this.canvassDetailSupplier.ItemType);
    this.stockSupplierForm.controls['Cost'].setValue(this.canvassDetailSupplier.Cost);
    this.stockSupplierForm.controls['SupplierId'].setValue(this.canvassDetailSupplier.SupplierId);
    this.stockSupplierForm.controls['SupplierName'].setValue(this.canvassDetailSupplier.SupplierName);
    this.stockSupplierForm.controls['Address'].setValue(this.canvassDetailSupplier.Address);
    this.stockSupplierForm.controls['ContactNo'].setValue(this.canvassDetailSupplier.ContactNo);
    this.stockSupplierForm.controls['TermDays'].setValue(this.canvassDetailSupplier.TermDays);
    this.stockSupplierForm.controls['DiscountPercent'].setValue(this.canvassDetailSupplier.DiscountPercent);
    this.stockSupplierForm.controls['MinimumQty'].setValue(this.canvassDetailSupplier.MinimumQty);

    this.stockSupplierForm.controls['SupplierId'].disable();
    this.stockSupplierForm.controls['SupplierName'].disable();

    this.btnDisableSupplierId = true;
    this.btnDisableSupplierName = true;


    this.btnDisableTermDays= false;
    this.btnDisableDiscountPercent = false;
    this.btnDisableMinimumQty = false;
  }

  async onChangeSupplier(data){
    var supplier:any = await firstValueFrom(this.suppliersService.getSupplierBySupplierId(data.SupplierId));
    this.stockSupplierForm.controls['SupplierId'].setValue(supplier.SupplierId);
    this.stockSupplierForm.controls['Address'].setValue(supplier.Address);
    this.stockSupplierForm.controls['ContactNo'].setValue(supplier.ContactNo);
    this.stockSupplierForm.controls['TermDays'].setValue(supplier.TermDays);
    this.stockSupplierForm.controls['DiscountPercent'].setValue(supplier.DiscountPercent);
    this.stockSupplierForm.controls['MinimumQty'].setValue(0);
  }

  onClickNewSupplier(){
     if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = (['','receiving', []]);
    this.dialog.open(SupplierUIComponent,dialogConfig).beforeClosed().subscribe(supplier => {
      if(supplier){
        this.suppliers = [supplier,...this.suppliers]; 
      }
    });
  }

  onSubmit(){
    this.loading = true;
    this.stockSuppliersService.saveStockSupplier2(this.stockSupplierForm.getRawValue(), this.btnText).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.stockSupplier);
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
}
