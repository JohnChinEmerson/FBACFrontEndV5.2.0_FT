import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenusService } from 'src/app/services/User/menus.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-selected-menu-ui',
  templateUrl: './selected-menu-ui.component.html',
  styleUrls: ['./selected-menu-ui.component.css']
})
export class SelectedMenuUIComponent implements OnInit {
  btnText   : string = "Save";
  loading   : boolean = false;
  MenuForm = new FormGroup({
    id: new FormControl(''),
    MenuName: new FormControl(''),
    Order: new FormControl(''),
  })
  BranchId : any;
  constructor(
    private MenuService: MenusService,
    private dialogRef: MatDialogRef<SelectedMenuUIComponent>,
    private notif: NotificationService,
    @Inject(MAT_DIALOG_DATA) public updateData: any, // passing data here from update
  ) { }

  ngOnInit(): void {
    this.BranchId = this.updateData[1];
    if(this.updateData[0])
    {
      this.btnText = "Update";
      this.DisplayRecords();
    }
  }

  public DisplayRecords()
  {
    this.MenuForm.controls['id'].setValue(this.updateData[0].id);
    this.MenuForm.controls['MenuName'].setValue(this.updateData[0].MenuName);
    this.MenuForm.controls['Order'].setValue(this.updateData[0].Order);
  }
  async onSubmit(){
    this.loading = true;
    this.MenuService.saveEditMenu(this.MenuForm.getRawValue(), this.BranchId).subscribe({
      next:(res)=>{
        if(this.btnText == "Save"){
          this.notif.toastrSuccess(res.message);
          this.MenuForm.reset();
        }
        else{
          this.notif.toastrSuccess(res.message);
          this.dialogRef.close();
        }
        this.loading = false;
      },
        error: (e)=>{
          this.notif.toastrError(e.error.message);
          this.loading = false;
      }
    })
  }
}
