import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserAccountsService } from 'src/app/services/User/user-accounts.service';
import { AccessRightsService } from 'src/app/services/User/access-rights.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { BranchLicensesService } from 'src/app/services/Config/branch-licenses.service';
import { MachinePermitsService } from 'src/app/services/Config/machine-permits.service';

@Component({
  selector: 'app-selected-user-account-ui',
  templateUrl: './selected-user-account-ui.component.html',
  styleUrls: ['./selected-user-account-ui.component.css']
})
export class SelectedUserAccountUIComponent implements OnInit {
  User          : any;
  Editions      : any = [];
  MachinePermits: any = [];
  btnText       : string = "Save";
  AccessRights  : any;
  loading       : boolean = false;
  branches                : any;
  BranchId                : string = null;
  UserForm = new FormGroup({
        id                  : new FormControl(''),
        Username            : new FormControl(''),
        UserFullName        : new FormControl(''),
        AccessRightId       : new FormControl(''),
        AccessRightName     : new FormControl(''),
        Edition             : new FormControl(''),
        ShowDashboard       : new FormControl('no'),
        MachinePermitId     : new FormControl('NA'),
        PermitNo            : new FormControl('NA'),
        RDOCode             : new FormControl('NA'),
        ComputerName        : new FormControl('NA'),
        MachineNo           : new FormControl('NA'),
  });

  constructor(
    private dialog            : MatDialog,
    private dialogRef         : MatDialogRef<SelectedUserAccountUIComponent>,
    private user_service      : UserAccountsService,
    private access_service    : AccessRightsService,
    private notif             : NotificationService,
    private auth              : AuthService,
    private toolbox           : ToolBoxService,
    private branchLicenseService    : BranchLicensesService,
    private machinePermitService    : MachinePermitsService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  async ngOnInit(): Promise<void> {
    this.BranchId = this.data[1];
    this.GetLicenses();
    this.GetMachinePermits();
    this.GetAccessRights();
    if (this.data[0]) {
      this.User = this.data[0];
      this.btnText = "Update";
      this.GetUserFormData();
    }
  }
  
  async GetMachinePermits(){
    this.MachinePermits = await firstValueFrom(this.machinePermitService.getMachinePermitsToDisplay(this.BranchId));
    this.MachinePermits.forEach(x => {
      x.MachineDetails = x.ComputerName;
      x.id = x.id.toString();
    });

    var a:any = {
      'id'              : 'NA',
      'PermitNo'        : 'NA',
      'MachineNo'       : 'NA',
      'RDOCode'         : 'NA',
      'ComputerName'    : 'NA',
      'MachineDetails'  : 'NA',
    };
    this.MachinePermits.push(a);
  }

  async GetLicenses(){
    this.Editions = await firstValueFrom(this.branchLicenseService.getCBOEditionsByBranchId(this.BranchId));
    this.Editions.forEach(x => {
      x.Edition = x.Edition.toUpperCase();
    });
    this.Editions.push('NA');
  }

  async GetAccessRights(){
    this.AccessRights = await firstValueFrom(this.access_service.getCBOAccessRightsAll(this.BranchId));
    this.AccessRights.forEach(x => {
      // x.id = x.id.toString();
    });
  }
  
  GetUserFormData(){
    this.UserForm.controls['id'].setValue(this.User.id);
    this.UserForm.controls['Username'].setValue(this.User.Username);
    this.UserForm.controls['UserFullName'].setValue(this.User.UserFullName);
    this.UserForm.controls['AccessRightId'].setValue(this.User.AccessRightId);
    this.UserForm.controls['AccessRightName'].setValue(this.User.AccessRightName);
    this.UserForm.controls['Edition'].setValue(this.User.Edition);
    this.UserForm.controls['MachinePermitId'].setValue(this.User.MachinePermitId);
    this.UserForm.controls['PermitNo'].setValue(this.User.PermitNo);
    this.UserForm.controls['RDOCode'].setValue(this.User.RDOCode);
    this.UserForm.controls['ComputerName'].setValue(this.User.ComputerName);
    this.UserForm.controls['MachineNo'].setValue(this.User.MachineNo);
    this.UserForm.controls['ShowDashboard'].setValue(this.User.ShowDashboard);
  }
  
  onChangeAccessRight(AccessRightId){
    var accessRight:any = this.AccessRights.filter(x=> x.id == AccessRightId);
      accessRight = accessRight[0];

      this.UserForm.controls['AccessRightId'].setValue(accessRight.id);
      this.UserForm.controls['AccessRightName'].setValue(accessRight.AccessRightName);
  }

  onChangeMachinePermit(id){
    var mp:any = this.MachinePermits.filter(x=> x.id == id);
            mp = mp[0];
    this.UserForm.controls['MachinePermitId'].setValue(mp.id);
    this.UserForm.controls['PermitNo'].setValue(mp.PermitNo);
    this.UserForm.controls['PermitNo'].setValue(mp.PermitNo);
    this.UserForm.controls['RDOCode'].setValue(mp.RDOCode);
    this.UserForm.controls['ComputerName'].setValue(mp.ComputerName);
    this.UserForm.controls['MachineNo'].setValue(mp.MachineNo);
  } 

  onSubmit(){
      this.loading = true;
      this.user_service.saveEditUserAccount(this.UserForm.getRawValue(), this.BranchId).subscribe({
        next:(res)=>{
          this.notif.toastrSuccess(res.message);
          this.dialogRef.close();
          this.loading = false;
        },
        error:(err)=>{
          this.notif.toastrError(err.error.message);
          this.loading = false;
        },
      });
  }
}
