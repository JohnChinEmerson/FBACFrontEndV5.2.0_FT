import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { ItemCategorysService } from 'src/app/services/Files/item-categorys.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { FastSlowMovingItemsService } from 'src/app/services/Reports/fast-slow-moving-items.service';
import { StringHelperService } from 'src/app/services/string-helper.service';

@Component({
  selector: 'app-fast-slow-moving-items',
  templateUrl: './fast-slow-moving-items.component.html',
  styleUrls: ['./fast-slow-moving-items.component.css']
})
export class FastSlowMovingItemsComponent implements OnInit {
  movingItems: any=[];
  categorys: any;
  category: string = 'All';
  speedFilters: any = ['Up', 'Down'];
  speedFilter: string = 'Up';
  value: any;
  isLoading       : boolean = false;
  loaded       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  title :any;
  withDate          : boolean = false;
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
  branches : any;
  branchId : any;
  constructor(
    private dialog              : MatDialog,
    private fastSlowMovingItemsService        : FastSlowMovingItemsService,
    private itemCategorysService        : ItemCategorysService,
    private dateTimesService      : DateTimesService,
    private notificationService: NotificationService,
    private printService        : PrintService,
    private router              : Router,
    private stringHelperService : StringHelperService,
    private branchesService : BranchesService,  
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCBOBranches();
    this.getCategorys();
  }
  async getCBOBranches(){
    this.branches = await firstValueFrom(this.branchesService.getBranchesCBO());
    this.branchId = this.branches[0].BranchId;
  }

  async getCategorys(){
    this.categorys = await firstValueFrom(this.itemCategorysService.getCBOCategorys());
    this.categorys.push(this.stringHelperService.allCategoryCBO());
  }

  async onClickView(){
    if (this.value == null || this.value === '') 
      return this.notificationService.toastrWarning('Invalid Speed.');
  
    this.isLoading = true;
    this.loaded = false;

    var speedFilter = "Fast Moving";
    if ( this.speedFilter.toLowerCase() == 'down')
        speedFilter = "Slow Moving";

    this.movingItems = await firstValueFrom(this.fastSlowMovingItemsService.getMovingItemsByDateFromByDateToByWithDateByCategoryBySpeedFilterByValue(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      this.withDate,
      this.category, 
      speedFilter, 
      this.value,
      this.branchId
    ));
    this.isLoading = false;
    
  
    this.displayRecords();
    this.loaded = true;
  }

  displayRecords(){
    var speedFilter = "Above";
    if ( this.speedFilter.toLowerCase() == 'down')
        speedFilter = "Below";
    
      this.title  = this.getBranchName()+' '+this.category.toUpperCase()+' FAST MOVING ITEMS WITH THE SPEED OF '+ this.value +'% AND '+speedFilter.toUpperCase();
      if(this.withDate)
         this.title  = this.getBranchName()+' '+this.category.toUpperCase()+' FAST MOVING ITEMS WITH THE SPEED OF '+ this.value +'% AND ' +speedFilter.toUpperCase() +' FROM '+ this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
      this.loaded = true;
  }
  getBranchName(){
    var branch = this.branches.find(x => x.BranchId.toLowerCase() == this.branchId.toLowerCase());
    return branch.BranchName.toUpperCase()+' BRANCH';
   }
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printfastslowmovingitems']));
    this.printService.popupWindow(url, 'printfastslowmovingitems', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(this.movingItems));
    localStorage.setItem('Title', this.title);
  }

}
