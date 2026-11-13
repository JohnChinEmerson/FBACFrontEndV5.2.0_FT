import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { SubMenusService } from 'src/app/services/User/sub-menus.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-selected-sub-menu-ui',
  templateUrl: './selected-sub-menu-ui.component.html',
  styleUrls: ['./selected-sub-menu-ui.component.css']
})
export class SelectedSubMenuUIComponent implements OnInit {

  btnText       : string = 'Save';
  loading       : boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  BranchId      : any;
  subMenuForm = new FormGroup({
    id: new FormControl(''),
    MenuId : new FormControl(''),
    MenuName : new FormControl(''),
    SubMenuName: new FormControl(''),
    RouteName: new FormControl(''),
    Order: new FormControl(''),
  })
  errorMessage:string = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public updateData: any, // passing data here from update
    private dialog: MatDialog,
    private subMenuService: SubMenusService,
    private notif: NotificationService,
    private dialogref : MatDialogRef<SelectedSubMenuUIComponent>
  ) { }

  ngOnInit(): void {
    this.BranchId = this.updateData[2];
    if(this.updateData){
      if(this.updateData[0].id){
        this.GetSubMenuData();
        this.btnText = "Update";
      }
      else{
        this.subMenuForm.controls['MenuId'].setValue(this.updateData[1].id);
        this.subMenuForm.controls['MenuName'].setValue(this.updateData[1].MenuName);
      }
    }
  }

  GetSubMenuData(){
    this.subMenuForm.controls['id'].setValue(this.updateData[0].id);
    this.subMenuForm.controls['MenuId'].setValue(this.updateData[0].MenuId);
    this.subMenuForm.controls['MenuName'].setValue(this.updateData[0].MenuName);
    this.subMenuForm.controls['SubMenuName'].setValue(this.updateData[0].SubMenuName);
    this.subMenuForm.controls['RouteName'].setValue(this.updateData[0].RouteName);
    this.subMenuForm.controls['Order'].setValue(this.updateData[0].Order);
  }

  onSubmit() {
    this.loading = true;
    this.subMenuService.saveEditSubMenu(this.subMenuForm.value, this.BranchId).subscribe({
      next: (res)=>{
        this.notif.toastrSuccess(res.message);
        if(this.btnText == 'Save'){
          this.subMenuForm.controls['SubMenuName'].setValue('');
          this.subMenuForm.controls['RouteName'].setValue('');
          this.subMenuForm.controls['Order'].setValue('');
        }else{
          this.dialogref.close();
        }
        this.loading = false;
      },
      error: (res)=>{
        this.notif.toastrWarning(res.error.message);
        this.loading = false;
      }
    })
  }

}
