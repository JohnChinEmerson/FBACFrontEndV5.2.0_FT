import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { StringHelperService } from 'src/app/services/string-helper.service';

@Component({
  selector: 'app-customer-history',
  templateUrl: './customer-history.component.html',
  styleUrls: ['./customer-history.component.css']
})
export class CustomerHistoryComponent implements OnInit {
  data: any=[];
  filteredData: any=[];
  customers: any;
  customerName: string = 'All';
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
    private customersService        : CustomersService,
    private dateTimesService      : DateTimesService,
    private notificationService: NotificationService,
    private printService        : PrintService,
    private router              : Router,
    private stringHelperService : StringHelperService,
    private branchesService : BranchesService,  
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCBOBranches();
    this.getCBOCustomers();
  }
  async getCBOBranches(){
    this.branches = await firstValueFrom(this.branchesService.getBranchesCBO());
    this.branchId = this.branches[0].BranchId;
  }
  async getCBOCustomers(){
    this.customers = await firstValueFrom(this.customersService.getCBOCustomers2(this.branchId));
    this.customers.push(this.stringHelperService.allCustomerNameCBO());
    this.customers.push(this.stringHelperService.withCASHCustomerCBO());
  }

  async onClickView(){
    this.filteredData = {
      'dateFrom' :   this.dateFrom,
      'dateTo' :   this.dateTo,
      'withDate' : this.withDate,
      'customerName' : this.customerName,
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
