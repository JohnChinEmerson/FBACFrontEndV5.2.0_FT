import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class AccessRightSubMenusService {

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
    private toolbox: ToolBoxService,
  ) { 
    this.BranchId ={ headers: this.branch};
  }


  get requiredRefresh(){
    return this._refreshrequired;
  }
  getAccessRightSubMenusByAccessRightIdByMenuId(AccessRightId, MenuId, BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'getAccessRightSubMenusByAccessRightIdByMenuId/'+AccessRightId+'/'+MenuId,this.BranchId);
  }

  getListByIdMenuId(accessRightId:string,subMenuId:string) : Observable<any>{
    return this.http.get<any>(_url+'GetAccessRightSubMenusByIdMenuId/'+accessRightId+'/'+subMenuId,this.BranchId);
  }
  getListById(id:string) : Observable<any>{
    return this.http.get<any>(_url+'GetAccessRightSubMenusById/'+id,this.BranchId);
  }
  addAccessRightSubMenu(data: any, AcesssRight, BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.post<any>(_url+'addAccessRightSubMenu/'+AcesssRight,data,this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
  deleteAccessRightSubMenuById(id:string): Observable<any> {
    return this.http.get<any>(_url + 'deleteAccessRightSubMenuById/'+id, this.BranchId).pipe(
      tap(() => {
        this.requiredRefresh.next();
      })
    );
  }
}
