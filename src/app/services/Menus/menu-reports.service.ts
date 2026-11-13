import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

// Menu Sales Report, End-of-Day Inventory and Production (Desktop Mariosoft.Costing)
@Injectable({
  providedIn: 'root'
})
export class MenuReportsService {

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

  // ---------- Menu Sales Report ----------
  getMenuSalesReport(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getMenuSalesReport/'+dateFrom+'/'+dateTo,this.BranchId);
  }

  getIngredientSalesReport(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getIngredientSalesReport/'+dateFrom+'/'+dateTo,this.BranchId);
  }

  // ---------- End-of-Day Inventory ----------
  getEndOfDayInventoryByDate(inputDate) : Observable<any>{
    return this.http.get<any>(_url+'getEndOfDayInventoryByDate/'+inputDate,this.BranchId);
  }

  getIngredientsUsedByDate(inputDate) : Observable<any>{
    return this.http.get<any>(_url+'getIngredientsUsedByDate/'+inputDate,this.BranchId);
  }

  saveEndOfDayInventory(data: any) : Observable<any>{
    return this.http.post<any>(_url+'saveEndOfDayInventory',data, this.BranchId).pipe(
      tap(()=>{ this.requiredRefresh.next(); })
    );
  }

  voidEndOfDayInventory(endOfDayInventoryId) : Observable<any>{
    return this.http.get<any>(_url+'voidEndOfDayInventory/'+endOfDayInventoryId,this.BranchId).pipe(
      tap(()=>{ this.requiredRefresh.next(); })
    );
  }

  // ---------- Production ----------
  getItemsForProduction() : Observable<any>{
    return this.http.get<any>(_url+'getItemsForProduction',this.BranchId);
  }

  getPendingProductionDetails() : Observable<any>{
    return this.http.get<any>(_url+'getPendingProductionDetails',this.BranchId);
  }

  addProductionItem(itemId, qty) : Observable<any>{
    return this.http.post<any>(_url+'addProductionItem',{ 'ItemId': itemId, 'Qty': qty }, this.BranchId);
  }

  updateProductionItemQty(id, qty) : Observable<any>{
    return this.http.post<any>(_url+'updateProductionItemQty/'+id,{ 'Qty': qty }, this.BranchId);
  }

  deleteProductionItem(id) : Observable<any>{
    return this.http.get<any>(_url+'deleteProductionItem/'+id,this.BranchId);
  }

  deleteProductionItems() : Observable<any>{
    return this.http.get<any>(_url+'deleteProductionItems',this.BranchId);
  }

  saveProduction(data: any) : Observable<any>{
    return this.http.post<any>(_url+'saveProduction',data, this.BranchId);
  }

  getProductionReceipts(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getProductionReceipts/'+dateFrom+'/'+dateTo,this.BranchId);
  }

  getProductionDetails(productionNo) : Observable<any>{
    return this.http.get<any>(_url+'getProductionDetails/'+productionNo,this.BranchId);
  }

  voidProduction(productionNo) : Observable<any>{
    return this.http.get<any>(_url+'voidProduction/'+productionNo,this.BranchId).pipe(
      tap(()=>{ this.requiredRefresh.next(); })
    );
  }

  // Desktop ProductionReceiptsUI Edit (ProductionHeaderUI update) / Add Item (AddItemToReceiptUI)
  updateProductionHeader(transNo, data: any) : Observable<any>{
    return this.http.post<any>(_url+'updateProductionHeader/'+transNo, data, this.BranchId).pipe(
      tap(()=>{ this.requiredRefresh.next(); })
    );
  }

  addProductionReceiptItem(data: any) : Observable<any>{
    return this.http.post<any>(_url+'addProductionReceiptItem', data, this.BranchId).pipe(
      tap(()=>{ this.requiredRefresh.next(); })
    );
  }

  deleteProductionDetail(id) : Observable<any>{
    return this.http.get<any>(_url+'deleteProductionDetail/'+id,this.BranchId).pipe(
      tap(()=>{ this.requiredRefresh.next(); })
    );
  }

  getProductionReport(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getProductionReport/'+dateFrom+'/'+dateTo,this.BranchId);
  }
}
