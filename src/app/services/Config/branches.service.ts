import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class BranchesService {

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

  getBranchesToDisplay() : Observable<any>{
    return this.http.get<any>(_url+'getBranchesToDisplay', this.BranchId);
  }

  getBranchesCBO() : Observable<any>{
    var branchId = this.auth.Branch ? this.auth.Branch.BranchId : 'all';
    return this.http.get<any>(_url+'getBranchesCBO/'+branchId, this.BranchId);
  }
  getAllBranchesCBO() : Observable<any>{
    var branchId = 'all';
    return this.http.get<any>(_url+'getBranchesCBO/'+branchId, this.BranchId);
  }
  getBranchesCBONotAll() : Observable<any>{
    var branchId = this.auth.Branch ? this.auth.Branch.BranchId : 'not all';
    return this.http.get<any>(_url+'getBranchesCBO/'+branchId, this.BranchId);
  }
  getBranchesCBONotAllForCommonAdmin() : Observable<any>{
    var branchId =  'not all';
    return this.http.get<any>(_url+'getBranchesCBO/'+branchId, this.BranchId);
  }
  getBranchesCBOExcept() : Observable<any>{
    var branchId = 'except';
    return this.http.get<any>(_url+'getBranchesCBO/'+branchId, this.BranchId);
  }
  getBranchById(Id) : Observable<any>{
    return this.http.get<any>(_url+'getBranchById/'+Id, this.BranchId);
  }

  saveEditBranch(data: any) : Observable<any>{
    return this.http.post<any>(_url+'SaveEditBranch',data, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  deleteBranch(Id) : Observable<any>{
    return this.http.get<any>(_url+'deleteBranch/'+Id, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  branchUpdate(data: any,action) : Observable<any>{
    return this.http.post<any>(_url+'branchUpdate/'+action,data, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  branchUpdateByItemName(itemName) : Observable<any>{
    return this.http.get<any>(_url+'branchUpdateByItemName/'+itemName, this.BranchId);
  }
}
