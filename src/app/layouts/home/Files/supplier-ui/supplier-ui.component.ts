import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { BusinessStylesService } from 'src/app/services/Files/business-styles.service';
import { SuppliersService } from 'src/app/services/Files/suppliers.service';
import { NotificationService } from 'src/app/services/notification.service';
import { BusinessStylesUIComponent } from '../business-styles-ui/business-styles-ui.component';

@Component({
  selector: 'app-supplier-ui',
  templateUrl: './supplier-ui.component.html',
  styleUrls: ['./supplier-ui.component.css']
})
export class SupplierUIComponent implements OnInit {
  btnText           : string = "Save";
  loading           : boolean = false;
  businessStyles : any=[];
  supplier: any=[];
  suppliers: any=[];
  type:string;
  supplierForm = new FormGroup({
      id            : new FormControl(''),
      SupplierId    : new FormControl('generated'),
      SupplierName  : new FormControl(''),
      ContactPerson : new FormControl('-'),
      ContactNo     : new FormControl('-'),
      Address       : new FormControl('-'),
      SupplierTIN   : new FormControl('-'),
      BusinessStyle   : new FormControl('-'),
      TermDays    : new FormControl(0),
  });

  constructor(
    private dialogRef         : MatDialogRef<SupplierUIComponent>,
    private dialog                      : MatDialog,
    private suppliersService  : SuppliersService,
    private businessStylesService  : BusinessStylesService,
    private notif             : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    this.getBusinessStyles();
    this.businessStylesService.requiredRefresh.subscribe(()=>{
      this.getBusinessStyles();
    });
    if (this.data) {
      this.supplier = this.data[0];
      this.type     = this.data[1];
      this.suppliers = this.data[2];
      if (this.supplier) {
        this.btnText = "Update";
        this.getsupplierFormData();
      }

    }
  }

  async getBusinessStyles(){
    this.businessStyles = await firstValueFrom(this.businessStylesService.getBusinessStyles());
  }
  
  getsupplierFormData(){
    this.supplierForm.controls['id'].setValue(this.supplier.id);
    this.supplierForm.controls['SupplierId'].setValue(this.supplier.SupplierId);
    this.supplierForm.controls['SupplierName'].setValue(this.supplier.SupplierName);
    this.supplierForm.controls['ContactPerson'].setValue(this.supplier.ContactPerson);
    this.supplierForm.controls['ContactNo'].setValue(this.supplier.ContactNo);
    this.supplierForm.controls['Address'].setValue(this.supplier.Address);
    this.supplierForm.controls['SupplierTIN'].setValue(this.supplier.SupplierTIN);
    this.supplierForm.controls['TermDays'].setValue(this.supplier.TermDays);
    this.supplierForm.controls['BusinessStyle'].setValue(this.supplier.BusinessStyle);
  }

  onClickBusinessStyle(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    this.dialog.open(BusinessStylesUIComponent,dialogConfig);
  }

  onSubmit(){
    this.loading = true;
    this.suppliersService.saveEditSuppliers(this.supplierForm.getRawValue(), this.btnText).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        if(this.btnText == "Save"){
          this.suppliers = [res.supplier,...this.suppliers]; 
          this.ResetForm();
          this.loading = false;
          if(this.type == 'receiving'||this.type == 'po' ){
            this.dialogRef.close(res.supplier);
          }
        }
        else{
          this.dialogRef.close(res.supplier);
          this.loading = false;
           }
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  ResetForm(){
    this.supplierForm.controls['id'].setValue('');
    this.supplierForm.controls['SupplierId'].setValue('generated');
    this.supplierForm.controls['SupplierName'].setValue('');
    this.supplierForm.controls['ContactPerson'].setValue('-');
    this.supplierForm.controls['ContactNo'].setValue('-');
    this.supplierForm.controls['Address'].setValue('-');
    this.supplierForm.controls['TermDays'].setValue('0');
    this.supplierForm.controls['BusinessStyle'].setValue('');
  }

  onClose(){
    if(this.type == 'suppliers'){
      this.dialogRef.close(this.suppliers);
    }else{
      this.dialogRef.close();
    }
  }
}
