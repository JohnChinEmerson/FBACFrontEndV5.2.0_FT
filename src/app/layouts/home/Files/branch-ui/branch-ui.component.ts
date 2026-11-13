import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-branch-ui',
  templateUrl: './branch-ui.component.html',
  styleUrls: ['./branch-ui.component.css']
})
export class BranchUIComponent implements OnInit {

  btnText               : string = "Save";
  btnTextToEdit         : boolean = false;
  loading               : boolean = false;
  branch: any=[];
  type:string;
  branchForm = new FormGroup({
        id            : new FormControl(''),
        BranchId    : new FormControl(''),
        BranchName  : new FormControl(''),
  });

  constructor(
    private dialogRef         : MatDialogRef<BranchUIComponent>,
    private dialog            : MatDialog,
    private branchesService   : BranchesService,
    private notif             : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.branch = this.data;
      if (this.branch) {
        this.btnText = "Update";
        this.getbranchFormData();
      }
    }
  }

 
  getbranchFormData(){
    this.branchForm.controls['id'].setValue(this.branch.id);
    this.branchForm.controls['BranchId'].setValue(this.branch.BranchId);
    this.branchForm.controls['BranchName'].setValue(this.branch.BranchName);
  }
  
  onSubmit(){
    this.loading = true;
    this.branchesService.saveEditBranch(this.branchForm.getRawValue()).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close();
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
