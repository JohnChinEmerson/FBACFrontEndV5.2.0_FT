import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { StringHelperService } from 'src/app/services/string-helper.service';

@Component({
  selector: 'app-item-history',
  templateUrl: './item-history.component.html',
  styleUrls: ['./item-history.component.css']
})
export class ItemHistoryComponent implements OnInit {
  data: any=[];
  filteredData: any=[];
  items: any;
  itemName: string = 'All';
  reportType : string = 'Customers'
  filterTypes: any = ['Summary', 'Details'];
  filterType: string = 'Summary';
  isLoading       : boolean = false;
  loaded       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  title :any;
  tab:any;
  withDate          : boolean = false;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
  ];  
  contextButtons     = [
  ];
  branches : any;
  branchId : any;
  constructor(
    private dialog                : MatDialog,
    private stocksService         : StocksService,
    private dateTimesService      : DateTimesService,
    private notificationService   : NotificationService,
    private printService          : PrintService,
    private router                : Router,
    private stringHelperService   : StringHelperService,
    private branchesService : BranchesService,  
    
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCBOBranches();
    this.getCBOItems();
    this.displayTab('Customers');
  }
  async getCBOBranches(){
    this.branches = await firstValueFrom(this.branchesService.getBranchesCBO());
    this.branchId = this.branches[0].BranchId;
  }
  async getCBOItems(){
    this.items = await firstValueFrom(this.stocksService.getStocks());
    this.items.push(this.stringHelperService.allItemNameCBO());
  }

  displayTab(reportType){
    this.reportType = reportType;
  }

  async onClickView(){
    if((this.reportType.toLowerCase() == 'price history' || this.reportType.toLowerCase() == 'cost history') && this.itemName.toLowerCase() == 'all')
      return this.notificationService.toastrWarning("No Selected Item.");

    this.filteredData = {
      'dateFrom' :   this.dateFrom,
      'dateTo' :   this.dateTo,
      'withDate' : this.withDate,
      'itemName' : this.itemName,
      'filterType' : this.filterType,
      'branchId' : this.branchId,
      'branchName' : this.getBranchName(),
    }
  }
  getBranchName(){
    var branch = this.branches.find(x => x.BranchId.toLowerCase() == this.branchId.toLowerCase());
    return branch.BranchName.toUpperCase()+' BRANCH';
   }
}
