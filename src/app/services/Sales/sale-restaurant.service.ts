import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

// Restaurant workflow of the Desktop SaleTransUI, on top of SalesTransactionService.
@Injectable({
  providedIn: 'root'
})
export class SaleRestaurantService {

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

  getRestaurantConfig() : Observable<any>{
    return this.http.get<any>(_url+'getRestaurantConfig',this.BranchId);
  }
  updateHasTable(hasTable) : Observable<any>{
    return this.http.get<any>(_url+'updateHasTable/'+hasTable,this.BranchId);
  }
  getTableCategorys() : Observable<any>{
    return this.http.get<any>(_url+'getTableCategorysForSales',this.BranchId);
  }
  getTablesWithStatus(tableCategory) : Observable<any>{
    return this.http.get<any>(_url+'getTablesWithStatus/'+encodeURIComponent(tableCategory || 'all'),this.BranchId);
  }
  getTableOrders(tableId) : Observable<any>{
    return this.http.get<any>(_url+'getTableOrders/'+tableId,this.BranchId);
  }
  // the unpaid orders of a table that this cashier cannot open (another cashier / another reading)
  getTableOtherOrders(tableId) : Observable<any>{
    return this.http.get<any>(_url+'getTableOtherOrders/'+tableId,this.BranchId);
  }
  releaseTable(tableId) : Observable<any>{
    return this.http.get<any>(_url+'releaseTable/'+tableId,this.BranchId);
  }
  afterAddSaleDetail(data: any) : Observable<any>{
    return this.http.post<any>(_url+'afterAddSaleDetail',data, this.BranchId);
  }
  getSetComponents(saleDetailId) : Observable<any>{
    return this.http.get<any>(_url+'getSetComponents/'+saleDetailId,this.BranchId);
  }
  // UPGRADE: swaps a Set's component for another item at an upgrade price (the Set price does not change)
  upgradeSetComponent(data: any) : Observable<any>{
    return this.http.post<any>(_url+'upgradeSetComponent',data, this.BranchId);
  }
  deleteSetComponent(id) : Observable<any>{
    return this.http.get<any>(_url+'deleteSetComponent/'+id,this.BranchId);
  }
  deleteRestaurantSaleDetail(id) : Observable<any>{
    return this.http.get<any>(_url+'deleteRestaurantSaleDetail/'+id,this.BranchId);
  }
  cancelOrder(id) : Observable<any>{
    return this.http.get<any>(_url+'cancelOrder/'+id,this.BranchId);
  }
  cancelWholeOrder(transNo) : Observable<any>{
    return this.http.get<any>(_url+'cancelWholeOrder/'+transNo,this.BranchId);
  }
  syncSetComponents(saleDetailId) : Observable<any>{
    return this.http.get<any>(_url+'syncSetComponents/'+saleDetailId,this.BranchId);
  }
  setOrderType(transNo, orderType) : Observable<any>{
    return this.http.post<any>(_url+'setOrderType',{ 'TransNo': transNo, 'OrderType': orderType }, this.BranchId);
  }
  sendOrder(transNo) : Observable<any>{
    return this.http.get<any>(_url+'sendOrder/'+transNo,this.BranchId);
  }
  serveOrder(transNo) : Observable<any>{
    return this.http.get<any>(_url+'serveOrder/'+transNo,this.BranchId);
  }
  transferTable(transNo, tableId) : Observable<any>{
    return this.http.post<any>(_url+'transferTable',{ 'TransNo': transNo, 'TableId': tableId }, this.BranchId);
  }
  mergeTable(transNo, tableId) : Observable<any>{
    return this.http.post<any>(_url+'mergeTable',{ 'TransNo': transNo, 'TableId': tableId }, this.BranchId);
  }
  splitBill(transNo, ids: any[]) : Observable<any>{
    return this.http.post<any>(_url+'splitBill',{ 'TransNo': transNo, 'Ids': ids }, this.BranchId);
  }
  // the new bill takes this amount (whole lines in order, the rest cut by quantity from one line)
  splitBillByAmount(transNo, amount) : Observable<any>{
    return this.http.post<any>(_url+'splitBillByAmount',{ 'TransNo': transNo, 'Amount': amount }, this.BranchId);
  }
  unsplitBill(transNo, originalTransNo) : Observable<any>{
    return this.http.post<any>(_url+'unsplitBill',{ 'TransNo': transNo, 'OriginalTransNo': originalTransNo }, this.BranchId);
  }
  finishSplitBill(transNo, originalTransNo) : Observable<any>{
    return this.http.post<any>(_url+'finishSplitBill',{ 'TransNo': transNo, 'OriginalTransNo': originalTransNo }, this.BranchId);
  }
  // inputs: the payment dialog's amounts (Desktop SaleHeaderUI Bill Out); none from Sales Transaction
  billOut(transNo, inputs: any = null) : Observable<any>{
    if (inputs)
      return this.http.post<any>(_url+'billOut/'+transNo, inputs, this.BranchId);
    return this.http.get<any>(_url+'billOut/'+transNo,this.BranchId);
  }
  completeOrder(transNo) : Observable<any>{
    return this.http.get<any>(_url+'completeOrder/'+transNo,this.BranchId);
  }
}
