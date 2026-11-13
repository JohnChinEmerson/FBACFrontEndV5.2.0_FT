import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  public _requiredRefresh=new Subject<void>();
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
    private toolBoxService: ToolBoxService,
  ) { 
    this.BranchId ={ headers: this.branch};
  }

  get requiredRefresh(){
    return this._requiredRefresh;
  }

  getCustomersToDisplay() : Observable<any>{
    return this.http.get<any>(_url+'getCustomersToDisplay',this.BranchId);
  }
  getCustomerByCustomerId(CustomerId) : Observable<any>{
    return this.http.get<any>(_url+'getCustomerByCustomerId/'+CustomerId,this.BranchId);
  }
  getCBOCustomers(): Observable<any>{
    return this.http.get<any>(_url+'getCBOCustomers',this.BranchId);
  }
  getCBOCustomers2(branchId): Observable<any>{
    this.BranchId = this.toolBoxService.updateAuthorizationHeader(branchId);
    return this.http.get<any>(_url+'getCBOCustomers2',this.BranchId);
  }
  getCustomersWithRebates(): Observable<any>{
    return this.http.get<any>(_url+'getCustomersWithRebates',this.BranchId);
  }
  saveEditCustomers(data: any, btnText) : Observable<any>{
    return this.http.post<any>(_url+'saveEditCustomers/'+btnText,data,this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
  deleteCustomer(id) : Observable<any>{
    return this.http.get<any>(_url+'deleteCustomer/'+id,this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
 
  
}
