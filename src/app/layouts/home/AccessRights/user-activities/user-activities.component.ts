
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { UserActivitiesService } from 'src/app/services/User/user-activities.service';
import { AuthService } from 'src/app/services/auth.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { ACTIVITY_OPENERS } from './activity-openers';
import { ActivityDetailsUIComponent } from './activity-details-ui/activity-details-ui.component';

@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.css']
})
export class UserActivitiesComponent implements OnInit {
  UserActivities      : any[];
  feedTotal           : number = 0;   // events there are in the period (the list holds the newest ones)
  UserFullNames       : any[];
  AccessRights        : any[];
  Modules             : any[];
  Actions             : any[];
  Types               : string[] = ['ALL', 'Transactions', 'Files', 'System'];

  SelectedUser        : string = 'ALL';
  SelectedAccessRight :  string = 'ALL';
  SelectedModule      :  string = 'ALL';
  SelectedAction      :  string = 'ALL';
  SelectedType        :  string = 'ALL';

  selectedData        : any;
  searchKey           : string = "";
  RecordStatus        : string = "active";
  selectedId          : any = 0;
  TransDateFrom       : any = (new Date);
  TransDateTo         : any = (new Date);
  pageSizeOptions     : number[] = [5, 10, 25, 100];
  listData            : MatTableDataSource<any>;
  isLoading           : boolean = false;


  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];
  contextButtons  =  [];
  defaultColumns  = [  'TransDate','TransTime', 'FullName',  'AccessRight',  'Module',  'Action', 'RefNo', 'Subject'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  branches : any;
  branchId : any; 
  loadedBranchId : any;   // the branch the list on screen was read from
  constructor(
    private user_act_service    : UserActivitiesService,
    private router              : Router,
    private dateTimesService    : DateTimesService,
    private branchesService      : BranchesService,
    public auth                 : AuthService,
    private printService        : PrintService,
    private homeTs              : HomeComponent,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private dialog              : MatDialog,
    private viewContainerRef    : ViewContainerRef,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.getCBOBranches();
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    this.user_act_service.requiredRefresh.subscribe(()=>{
      this.onClickView();
    });
    this.onClickView();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }
  async getCBOBranches(){
    this.branches = await firstValueFrom(this.branchesService.getBranchesCBONotAll());
    this.branchId = this.branches[0].BranchId;
  }

  async onClickView(){
    this.isLoading = true;
    try {
      const feed = await firstValueFrom(this.user_act_service.getActivityFeed(this.dateTimesService.ConvertToDateFormat(new Date(this.TransDateFrom)), this.dateTimesService.ConvertToDateFormat(new Date(this.TransDateTo)), this.branchId));
      this.UserActivities = feed.rows ?? [];
      this.feedTotal      = feed.total ?? this.UserActivities.length;
    } finally {
      this.isLoading = false;
    }
    this.loadedBranchId = this.branchId;
    this.displayRecords();
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }
  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }
  displayRecords(){
    var data      = this.UserActivities;

    this.UserFullNames    = [...new Set(data.map(x =>  x['FullName'] ?? ''))];
    this.UserFullNames.push('ALL');

    this.AccessRights    = [...new Set(data.map(x =>  x['AccessRight'] ?? ''))];
    this.AccessRights.push('ALL');

    this.Modules    = [...new Set(data.map(x =>  x['Module'] ?? ''))];
    this.Modules.push('ALL');

    this.Actions    = [...new Set(data.map(x =>  x['Action'] ?? ''))];
    this.Actions.push('ALL');


    if (this.SelectedUser != 'ALL') {
      data = data.filter(x => x.FullName == this.SelectedUser);
    }


    if(this.SelectedAccessRight != 'ALL'){
      data  = data.filter(x => x.AccessRight == this.SelectedAccessRight);
    }

    if(this.SelectedModule != 'ALL'){
      data  = data.filter(x => x.Module == this.SelectedModule);
    }

    if(this.SelectedType != 'ALL'){
      const kind = {'Transactions': 'transaction', 'Files': 'file', 'System': 'system'}[this.SelectedType];
      data  = data.filter(x => x.Kind == kind);
    }

    if(this.SelectedAction != 'ALL'){
      data  = data.filter(x => x.Action == this.SelectedAction);
    }

    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  getRecord(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

  // Double-click: a transaction opens the details dialog of its module (the same one the module's receipts screen
  // has); anything else - a file record, a login, a print, a deleted or other-branch record - opens Activity Details.
  onDoubleClick(row : any){
    this.getRecord(row);
    const opener = ACTIVITY_OPENERS[row.TransType];
    // the module dialogs read the branch of the login, so another branch's records are shown by Activity Details
    const sameBranch = this.loadedBranchId == (this.auth.Branch ? this.auth.Branch.BranchId : null);
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.viewContainerRef = this.viewContainerRef;
    if(opener && row.RefNo && sameBranch && row.RecordStatus != 'deleted'){
      dialogConfig.width = '1500px';
      dialogConfig.data  = [this.TransDateFrom, this.TransDateTo, row.RefNo];
      this.dialog.open(opener, dialogConfig);
      return;
    }
    dialogConfig.width = '1000px';
    dialogConfig.data  = [row, this.loadedBranchId, sameBranch];
    this.dialog.open(ActivityDetailsUIComponent, dialogConfig);
  }

  async onClickPrint(){
    var url = this.router.serializeUrl(
      this.router.createUrlTree(['print/printuseractivities'])
    );
    var data:any = this.listData.filteredData;
    this.printService.popupWindow(url, 'UserActivities', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', 'USER ACTIVITIES FROM '+ this.dateTimesService.ConvertToDateFormat(new Date(this.TransDateFrom)) +' to '+ this.dateTimesService.ConvertToDateFormat(new Date(this.TransDateTo)));
  }


}
