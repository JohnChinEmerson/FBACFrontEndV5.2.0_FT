import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-branch-update-ui',
  templateUrl: './branch-update-ui.component.html',
  styleUrls: ['./branch-update-ui.component.css']
})
export class BranchUpdateUIComponent implements OnInit {
Branches            : any[];
  SelectedData        : any;
  searchKey           : string = "";
  RecordStatus        : string = "active";
  SelectedId          : number = 0;
  pageSizeOptions     : number[] = [5, 10, 25, 100];
  listData            : MatTableDataSource<any>;
  IsTrue              : boolean = false;
  action : any;
  displayedColumns    : string[] = [
    'BranchName',
  ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private dialog          : MatDialog,
    private dialogRef : MatDialogRef<BranchUpdateUIComponent>,
    private branchesService      : BranchesService,
    private notif           : NotificationService,
    public matTableService : MatTableService, 
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
    
  ) { }

  ngOnInit(): void {
    this.action = this.data;
    this.GetBranches();
    this.branchesService.requiredRefresh.subscribe(()=>{
      this.GetBranches();
    });
  }

  async GetBranches(){
    this.IsTrue = true;
    this.Branches = await firstValueFrom(this.branchesService.getBranchesToDisplay());
    if(this.Branches)
      this.IsTrue = false;
    this.DisplayRecords();
  }

  applyFilter() {
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch() {
    this.searchKey = this.matTableService.clearSearch(this.listData);
  }

  DisplayRecords(){
    var data      = this.Branches.filter(x => x.RecordStatus == this.RecordStatus);
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
  }

  getRecord(data : any){
    this.SelectedId = data.id;
    this.SelectedData = data;
  }

  getCheckboxValues(data, id) {
    let obj = id;
    var branches = this.Branches.filter(x=> x.BranchId == id);
    if(data == true){
      branches[0].IsUpdate = 'yes';
    }else{
      branches[0].IsUpdate = 'no';
    }
  }
  onClickUpdate(){
    return this.notif.popupWarning("Update Branches", "Are you sure to  update the price and cost of each branches ?").then((result) => {
      if(result.isConfirmed){
        this.branchesService.branchUpdate(this.Branches, this.action).subscribe({
          next:async (res)=>{
            if(this.action){
              await this.branchesService.branchUpdateByItemName('all').subscribe({
              next:async (res)=>{
                this.notif.toastrSuccess(res.message);
                this.dialogRef.close();
              },
              error:async (err)=>{
                this.notif.toastrError(err.error.message);
              }
              });
            }else{
              this.notif.toastrSuccess(res.message);
              this.dialogRef.close();
            }
          },
          error:(err)=>{
            this.notif.toastrError(err.error.message);
          },
        });
      }else{
        return;
      }
    });
    
  }

}
