import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SalesConfigPerMachineService } from 'src/app/services/Sales/sales-config-per-machine.service';

@Component({
  selector: 'app-sales-config-per-machine',
  templateUrl: './sales-config-per-machine.component.html',
  styleUrls: ['./sales-config-per-machine.component.css']
})
export class SalesConfigPerMachineComponent implements OnInit {
  saleConfigPerMachines : any=[];
  btnText               : string = "Save";
  loading               : boolean = false;
  machineName           : string;
  saleConfigPerMachineForm = new FormGroup({
      ComputerName: new FormControl(''),
      CashDrawerTrigger : new FormControl(''),
      PoleDisplay : new FormControl(''),
      PrintCashiering : new FormControl(''),
      PrintReceipt : new FormControl(''),
      Printer : new FormControl(''),
      // Desktop SaleConfigUI (per machine): POS printer width / font sizes, read-only for an ordinary printer
      POSPrinterWidth : new FormControl(0),
      POSPrinterFontSize : new FormControl(0),
      OrderSlipPOSPrinterFontSize : new FormControl(0),
  });
  constructor(
    private authService : AuthService,
    private salesConfigPerMachineService : SalesConfigPerMachineService,
    private notificationService : NotificationService, 
    private dialogRef : MatDialogRef<SalesConfigPerMachineComponent>,
  ) { }

  async ngOnInit(): Promise<void> {
    this.machineName  = this.authService.UserAccount.ComputerName;
    await this.getSaleConfigPerComputerName();
  }

  async getSaleConfigPerComputerName(){
    this.saleConfigPerMachines = await firstValueFrom(this.salesConfigPerMachineService.getSaleConfigPerMachineByComputerName(this.machineName));
    this.getsaleConfigPerMachineFormData();
  }

  getsaleConfigPerMachineFormData(){
      this.saleConfigPerMachineForm.controls['ComputerName'].setValue(this.machineName);
      this.saleConfigPerMachineForm.controls['CashDrawerTrigger'].setValue(this.saleConfigPerMachines.CashDrawerTrigger);
      this.saleConfigPerMachineForm.controls['PoleDisplay'].setValue(this.saleConfigPerMachines.PoleDisplay);
      this.saleConfigPerMachineForm.controls['PrintCashiering'].setValue(this.saleConfigPerMachines.PrintCashiering);
      this.saleConfigPerMachineForm.controls['PrintReceipt'].setValue(this.saleConfigPerMachines.PrintReceipt);
      this.saleConfigPerMachineForm.controls['Printer'].setValue(this.saleConfigPerMachines.Printer);

      this.onCheck('CashDrawerTrigger', (this.saleConfigPerMachines.CashDrawerTrigger || '').toLowerCase() == 'yes', this.saleConfigPerMachines.CashDrawerTrigger, 'Boolean');
      this.onCheck('PoleDisplay', (this.saleConfigPerMachines.PoleDisplay || '').toLowerCase() == 'yes', this.saleConfigPerMachines.PoleDisplay, 'Boolean');
      this.onCheck('PrintCashiering', (this.saleConfigPerMachines.PrintCashiering || '').toLowerCase() == 'yes', this.saleConfigPerMachines.PrintCashiering, 'Boolean');
      this.onCheck('PrintReceipt', (this.saleConfigPerMachines.PrintReceipt || '').toLowerCase() == 'yes', this.saleConfigPerMachines.PrintReceipt, 'Boolean');
      this.onCheck('Printer', this.saleConfigPerMachines.Printer, this.saleConfigPerMachines.Printer, 'String');
      this.saleConfigPerMachineForm.controls['POSPrinterWidth'].setValue(+(this.saleConfigPerMachines.POSPrinterWidth || 0));
      this.saleConfigPerMachineForm.controls['POSPrinterFontSize'].setValue(+(this.saleConfigPerMachines.POSPrinterFontSize || 0));
      this.saleConfigPerMachineForm.controls['OrderSlipPOSPrinterFontSize'].setValue(+(this.saleConfigPerMachines.OrderSlipPOSPrinterFontSize || 0));
  }

  // Desktop cboPrinter_SelectedIndexChanged: POS sizes are read-only for an ordinary printer
  get isOrdinaryPrinter(): boolean {
    return (this.saleConfigPerMachineForm.controls['Printer'].value || '').toLowerCase() == 'ordinary';
  }

   onCheck(Column, Check, Value:any, Type){
    if(Check == true){
      this.saleConfigPerMachineForm.controls[Column].enable();
      if(Type == 'Number'){
        this.saleConfigPerMachineForm.controls[Column].setValue(Value);
      }
      if(Type == 'String'){
        this.saleConfigPerMachineForm.controls[Column].setValue(Value);
      }   
      if(Type == 'Boolean'){
        this.saleConfigPerMachineForm.controls[Column].setValue('yes');
        this.saleConfigPerMachineForm.controls[Column].disable();
      }
    }
    
    if(Check == false){
      this.saleConfigPerMachineForm.controls[Column].disable();
      if(Type == 'Number'){
        this.saleConfigPerMachineForm.controls[Column].setValue(0);
      }
      if(Type == 'String'){
        this.saleConfigPerMachineForm.controls[Column].setValue('');
      }   
      if(Type == 'Boolean'){
        this.saleConfigPerMachineForm.controls[Column].setValue('no');
      }
    }
  }

  onSubmit(){
    this.loading = true;
    this.salesConfigPerMachineService.updateSaleConfigPerMachine(this.saleConfigPerMachineForm.getRawValue()).subscribe({
      next:(res)=>{
        this.notificationService.toastrSuccess(res.message);
        this.loading = false;
      },
      error:(err)=>{
        this.notificationService.toastrHttpError(err, 'Unable to save the Sales Config.');
        this.loading = false;
      },
    })
  }

  onClose(){
    this.dialogRef.close();
  }


}
