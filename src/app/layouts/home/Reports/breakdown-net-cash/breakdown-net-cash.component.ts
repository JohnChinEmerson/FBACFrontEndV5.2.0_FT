import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { BreakdownNetCashService } from 'src/app/services/Reports/breakdown-net-cash.service';

@Component({
  selector: 'app-breakdown-net-cash',
  templateUrl: './breakdown-net-cash.component.html',
  styleUrls: ['./breakdown-net-cash.component.css']
})
export class BreakdownNetCashComponent implements OnInit {
  data : any=[];
  isLoading       : boolean = false;
  loaded       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  title :any;
  withDate          : boolean = true;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,}, 
  ];  
  toolButtons2     = [
 
  ];  
  contextButtons     = [
  ];
  total: any;
  orderDownPayments: any;
  checkOutPayments: any;
  itemSalesPayments: any;
  pODownPayments: any;
  receivingPayments: any;
  payablePayments: any;
  expensePayments: any;
  branches : any;
  branchId : any;
  constructor(
    private dialog              : MatDialog,
    private breakdownNetCashService        : BreakdownNetCashService,
    private dateTimesService      : DateTimesService,
    private ref: ChangeDetectorRef,
    private printService        : PrintService,
    private router              : Router,
    private notificationService : NotificationService,
    private branchesService : BranchesService,  
    
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCBOBranches();
  }
  async getCBOBranches(){
    this.branches = await firstValueFrom(this.branchesService.getBranchesCBO());
    this.branchId = this.branches[0].BranchId;
  }

  async onClickView(){
    this.isLoading = true;
    this.loaded = false;


    this.data = await firstValueFrom(this.breakdownNetCashService.getBreakdownNetCashByDateFromByDateTo(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      this.branchId
    ));
    if(this.data)
      this.isLoading = false;

    this.total = this.data['total'];
    this.orderDownPayments = this.data['orderDownPayments'];
    this.checkOutPayments = this.data['checkOutPayments'];
    this.itemSalesPayments = this.data['itemSalesPayments'];
    this.pODownPayments = this.data['pODownPayments'];
    this.receivingPayments = this.data['receivingPayments'];
    this.payablePayments = this.data['payablePayments'];
    this.expensePayments = this.data['expensePayments'];
    
  
    this.displayRecords();
    this.loaded = true;
  }

  displayRecords(){
      this.title  = this.getBranchName()+' NET CASH BREAKDOWN FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
      this.loaded = true;
    }

    getTotal(data, column){
      let sum = 0;
      this[data].forEach(x => {
        sum += +x[column];
      });
      return sum;
    }
    getBranchName(){
      var branch = this.branches.find(x => x.BranchId.toLowerCase() == this.branchId.toLowerCase());
      return branch.BranchName.toUpperCase()+' BRANCH';
     }
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printbreakdownnetcash']));
    this.printService.popupWindow(url, 'printbreakdownnetcash', window, 800, 800);
    localStorage.setItem('total', JSON.stringify(this.total));
    localStorage.setItem('orderDownPayments', JSON.stringify(this.orderDownPayments));
    localStorage.setItem('checkOutPayments', JSON.stringify(this.checkOutPayments));
    localStorage.setItem('itemSalesPayments', JSON.stringify(this.itemSalesPayments));
    localStorage.setItem('pODownPayments', JSON.stringify(this.pODownPayments));
    localStorage.setItem('receivingPayments', JSON.stringify(this.receivingPayments));
    localStorage.setItem('payablePayments', JSON.stringify(this.payablePayments));
    localStorage.setItem('expensePayments', JSON.stringify(this.expensePayments));
    localStorage.setItem('Title', this.title);
  }


}
