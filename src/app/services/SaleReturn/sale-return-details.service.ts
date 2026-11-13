import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SaleReturnDetailsService {

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

  getSaleReturnDetailsByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getSaleReturnDetailsByTransCode/'+transCode, this.BranchId );
  }
  getSaleReturnDetailById(id) : Observable<any>{
    return this.http.get<any>(_url+'getSaleReturnDetailById/'+id, this.BranchId );
  }
  updateSaleReturnDetail(data, action) : Observable<any>{
    return this.http.post<any>(_url+'updateSaleReturnDetail/'+action,data, this.BranchId );
  }
  computeSaleReturnDetailAmount(price, discountValue, qty, discountType, vATType) : Observable<any>{
    return this.http.get<any>(_url+'computeSaleReturnDetailAmount/'+price+'/'+discountValue+'/'+qty+'/'+discountType+'/'+vATType, this.BranchId );
  }
  getSalesType(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getSalesType/'+transCode, this.BranchId );
  }
  getSaleReturnDetailsByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getSaleReturnDetailsByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  getSaleReturnDetailsByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getSaleReturnDetailsByTransNo/'+transNo, this.BranchId );
  }
  getSaleReturnType(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getSaleReturnType/'+transCode, this.BranchId );
  }
  getSaleReturnDetailsReportByYearByCategory(year,category ) : Observable<any>{
    return this.http.get<any>(_url+'getSaleReturnDetailsReportByYearByCategory/'+year+'/'+category, this.BranchId );
  }
  getSaleReturnDetailsReportByYearByMonthByCategoryByItemId(year,month,category,itemId ) : Observable<any>{
    return this.http.get<any>(_url+'getSaleReturnDetailsReportByYearByMonthByCategoryByItemId/'+year+'/'+month+'/'+category+'/'+itemId, this.BranchId );
  }
  getOpenSaleReturnDetailsByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getOpenSaleReturnDetailsByTransNo/'+transNo, this.BranchId );
  }
  updateSaleReturnDetailRecordStatus(id, action) : Observable<any>{
    return this.http.get<any>(_url+'updateSaleReturnDetailRecordStatus/'+id+'/'+action, this.BranchId );
  }
  
}
