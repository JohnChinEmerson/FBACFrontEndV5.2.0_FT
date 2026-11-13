import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SaleDetailsService {

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

  get RequiredRefresh(){
    return this._refreshrequired;
  }

  // the lines of a pending (temporary TransNo) or paid sale
  getOrderDetails(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getOrderDetails/'+transNo, this.BranchId );
  }
  getSaleDetailById(id) : Observable<any>{
    return this.http.get<any>(_url+'getSaleDetailById/'+id, this.BranchId );
  }
  updateSaleDetail(data, action) : Observable<any>{
    return this.http.post<any>(_url+'updateSaleDetail/'+action,data, this.BranchId );
  }
  computeSaleDetailAmount(price, discountValue, qty, discountType, vATType) : Observable<any>{
    return this.http.get<any>(_url+'computeSaleDetailAmount/'+price+'/'+discountValue+'/'+qty+'/'+discountType+'/'+vATType, this.BranchId );
  }
  getSalesType(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getSalesType/'+transNo, this.BranchId );
  }
  getSaleDetailsByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getSaleDetailsByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  getSaleDetailsByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getSaleDetailsByTransNo/'+transNo, this.BranchId );
  }
  getSaleDetailsForSalesReturnByDateFromByDateToByCustomerIdWDate(dateFrom, dateTo, customerId, withDate) : Observable<any>{
    return this.http.get<any>(_url+'getSaleDetailsForSalesReturnByDateFromByDateToByCustomerIdWDate/'+dateFrom+'/'+dateTo+'/'+customerId+'/'+withDate, this.BranchId );
  }
  getSaleDetailsForDelivery(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getSaleDetailsForDelivery/'+transNo, this.BranchId );
  }
  getQtySoldbyItemIdByDateFromByDateTo(itemId, dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getQtySoldbyItemIdByDateFromByDateTo/'+itemId+'/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  updateSaleDetailRecordStatus(id, action) : Observable<any>{
    return this.http.get<any>(_url+'updateSaleDetailRecordStatus/'+id+'/'+action, this.BranchId );
  }
  
  
}
