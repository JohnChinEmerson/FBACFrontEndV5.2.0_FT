import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryStocksService {

  private _refreshrequired=new Subject<void>();
  branch = new HttpHeaders({
    'Content-Type': 'application/json',
    'AuthBranchId': `${this.auth.Branch ? this.auth.Branch.BranchId : ""}`,
   'UserId': `${this.auth.LoginId}`,
    'Edition': `${this.auth.Edition}`,
     
    'Token': `${localStorage.getItem('SessionToken')}`
  });

  BranchId : any;
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) { 
    this.BranchId ={ headers: this.branch};
  }


  get requiredRefresh(){
    return this._refreshrequired;
  }

  getInventoryRecordByItemId(itemId) : Observable<any>{
    return this.http.get<any>(_url+'getInventoryRecordByItemId/'+itemId,this.BranchId);
  }

  getInventoryRecordByCategoryInventoryStatus(category, inventoryStatus) : Observable<any>{
    return this.http.get<any>(_url+'getInventoryRecordByCategoryInventoryStatus/'+category+'/'+inventoryStatus,this.BranchId);
  }

  setNewInventoryByCategory(category,target, dtFrom, dtTo) : Observable<any>{
    return this.http.get<any>(_url+'setNewInventoryByCategory/'+category+'/'+target+'/'+dtFrom+'/'+dtTo,this.BranchId);
  }

  setNewInventoryByStocks(stocks) : Observable<any>{
    return this.http.post<any>(_url+'setNewInventoryByStocks',stocks,this.BranchId);
  }

  finishInventory(data) : Observable<any>{
    return this.http.post<any>(_url+'finishInventory',data,this.BranchId);
  }
  backToOngoingInventory(itemId) : Observable<any>{
    return this.http.get<any>(_url+'backToOngoingInventory/'+itemId,this.BranchId);
  }
  updateInventoryPhysicalCount(itemId,physicalCount, systemCount) : Observable<any>{
    return this.http.get<any>(_url+'updateInventoryPhysicalCount/'+itemId+'/'+physicalCount+'/'+systemCount,this.BranchId);
  }
  setAllPhysicalCountToZero(category) : Observable<any>{
    return this.http.get<any>(_url+'setAllPhysicalCountToZero/'+category,this.BranchId);
  }
}
