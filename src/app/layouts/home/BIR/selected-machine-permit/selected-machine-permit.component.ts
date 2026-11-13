import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MachinePermitsService } from 'src/app/services/Config/machine-permits.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-selected-machine-permit',
  templateUrl: './selected-machine-permit.component.html',
  styleUrls: ['./selected-machine-permit.component.css']
})
export class SelectedMachinePermitComponent implements OnInit {
  loading               : boolean = false;
  MachinePermit      : any;
  btnText             : string = "Save";
  MachinePermitForm = new FormGroup({
        id            : new FormControl(''),
        PermitNo      : new FormControl(''),
        RDOCode       : new FormControl(''),
        DateIssued    : new FormControl((new Date)),
        ExpiryDate    : new FormControl((new Date)),
        ComputerName  : new FormControl(''),
        SerialNo      : new FormControl('-'),
        MachineNo     : new FormControl('-'),
        PSINo    : new FormControl('0000'),
        SINo     : new FormControl('1'),
        SILastNo  : new FormControl('999999999'),
        PSRNo         : new FormControl('0000'),
        SRNo          : new FormControl('1'),
        SRLastNo       : new FormControl('999999999'),
        // Desktop MachinePermitUI: VOID receipt counter and store hours ("8:00:00 AM"; an AM end is the next day)
        PVoidNo        : new FormControl('VD'),
        VoidNo         : new FormControl('1'),
        VoidLastNo     : new FormControl('999999999'),
        StoreHourStart : new FormControl('12:00:00 AM'),
        StoreHourEnd   : new FormControl('11:59:59 PM'),
  });

  constructor(
    private dialog            : MatDialog,
    private dialogRef         : MatDialogRef<SelectedMachinePermitComponent>,
    private mp_service        : MachinePermitsService,
    private notif             : NotificationService,
    private DateTimesService   : DateTimesService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  ngOnInit(): void {
   
    if (this.data) {
      this.MachinePermit = this.data;
      this.btnText = "Update";
      this.GetMachinePermitFormData();
    }
  }
  
  GetMachinePermitFormData(){
    this.MachinePermitForm.controls['id'].setValue(this.MachinePermit.id);
    this.MachinePermitForm.controls['PermitNo'].setValue(this.MachinePermit.PermitNo);
    this.MachinePermitForm.controls['RDOCode'].setValue(this.MachinePermit.RDOCode);
    this.MachinePermitForm.controls['DateIssued'].setValue(this.DateTimesService.ConvertToDateFormat(new Date(this.MachinePermit.DateIssued)) );
    this.MachinePermitForm.controls['ExpiryDate'].setValue(this.DateTimesService.ConvertToDateFormat(new Date(this.MachinePermit.ExpiryDate)));
    this.MachinePermitForm.controls['ComputerName'].setValue(this.MachinePermit.ComputerName);
    this.MachinePermitForm.controls['SerialNo'].setValue(this.MachinePermit.SerialNo);
    this.MachinePermitForm.controls['MachineNo'].setValue(this.MachinePermit.MachineNo);
    this.MachinePermitForm.controls['PSINo'].setValue(this.MachinePermit.PSINo);
    this.MachinePermitForm.controls['SINo'].setValue(this.MachinePermit.SINo);
    this.MachinePermitForm.controls['SILastNo'].setValue(this.MachinePermit.SILastNo);
    this.MachinePermitForm.controls['PSRNo'].setValue(this.MachinePermit.PSRNo);
    this.MachinePermitForm.controls['SRNo'].setValue(this.MachinePermit.SRNo);
    this.MachinePermitForm.controls['SRLastNo'].setValue(this.MachinePermit.SRLastNo);
    this.MachinePermitForm.controls['PVoidNo'].setValue(this.MachinePermit.PVoidNo ?? 'VD');
    this.MachinePermitForm.controls['VoidNo'].setValue(this.MachinePermit.VoidNo ?? 1);
    this.MachinePermitForm.controls['VoidLastNo'].setValue(this.MachinePermit.VoidLastNo ?? 999999999);
    this.MachinePermitForm.controls['StoreHourStart'].setValue(this.MachinePermit.StoreHourStart || '12:00:00 AM');
    this.MachinePermitForm.controls['StoreHourEnd'].setValue(this.MachinePermit.StoreHourEnd || '11:59:59 PM');
  }

  onSubmit(){
    this.loading = true;
    this.MachinePermitForm.controls['DateIssued'].setValue(this.DateTimesService.ConvertToDateFormat(new Date(this.MachinePermitForm.controls['DateIssued'].value)) );
    this.MachinePermitForm.controls['ExpiryDate'].setValue(this.DateTimesService.ConvertToDateFormat(new Date(this.MachinePermitForm.controls['ExpiryDate'].value)));

      this.mp_service.saveEditMachinePermit(this.MachinePermitForm.getRawValue(), this.btnText).subscribe({
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
