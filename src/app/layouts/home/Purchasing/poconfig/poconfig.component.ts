import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { POConfigService } from 'src/app/services/Purchasing/poconfig.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-poconfig',
  templateUrl: './poconfig.component.html',
  styleUrls: ['./poconfig.component.css']
})
export class POConfigComponent implements OnInit {
  btnText                   : string = "Save";
  poConfig     : any=[];
  loading                   : boolean = false;
  poConfigForm                = new FormGroup({
        AutoVoucher               : new FormControl(''),
        SortByAvailable           : new FormControl(''),
  });
  cash  : any=[];
  bankDeposits  : any=[];
  checks  : any=[];

  constructor(
    private configService        : POConfigService,
    private notif               : NotificationService,
    private toolBoxService    : ToolBoxService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.poConfig = await firstValueFrom(this.configService.getPOConfig());
    this.GetpoConfigFormData();
  }

  GetpoConfigFormData(){
    this.poConfigForm.controls['AutoVoucher'].setValue(this.poConfig.AutoVoucher);
    this.poConfigForm.controls['SortByAvailable'].setValue(this.poConfig.SortByAvailable);
    this.onCheck('AutoVoucher', this.poConfig.AutoVoucher.toLowerCase() == 'yes', this.poConfig.AutoVoucher, 'Boolean');
    this.onCheck('SortByAvailable', this.poConfig.SortByAvailable.toLowerCase() == 'yes', this.poConfig.SortByAvailable, 'Boolean');
  }

  onCheck(Column, Check, Value:any, Type){
    if(Check == true){
      this.poConfigForm.controls[Column].enable();
      if(Type == 'Number'){
        this.poConfigForm.controls[Column].setValue(Value);
      }
      if(Type == 'String'){
        this.poConfigForm.controls[Column].setValue(Value);
      }   
      if(Type == 'Boolean'){
        this.poConfigForm.controls[Column].setValue('yes');
        this.poConfigForm.controls[Column].disable();
      }
    }
    
    if(Check == false){
      this.poConfigForm.controls[Column].disable();
      if(Type == 'Number'){
        this.poConfigForm.controls[Column].setValue(0);
      }
      if(Type == 'String'){
        this.poConfigForm.controls[Column].setValue('');
      }   
      if(Type == 'Boolean'){
        this.poConfigForm.controls[Column].setValue('no');
      }
    }
  }

  onSubmit(){
    this.loading = true;
    this.configService.updatePOConfig(this.poConfigForm.getRawValue()).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.ngOnInit();
        this.loading = false;
      },
      error:(err)=>{
        this.notif.toastrError(err.error);
        this.loading = false;
      },
    })
  }

  onClose(){
    this.toolBoxService.onHome();
  }



}
