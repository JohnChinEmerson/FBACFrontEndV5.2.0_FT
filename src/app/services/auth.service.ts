import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { _url } from 'src/global-variables';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token       : string | undefined;
  menus       : any;
  decryptionKey: string = 'Mariosoft143';
  branch = new HttpHeaders({
    'Content-Type': 'application/json',     
    'AuthBranchId': `${this.Branch ? this.Branch.BranchId : ""}`,
    'UserId': `${this.LoginId}`,
    'Edition': `${this.Edition}`,
    'Token': `${localStorage.getItem('SessionToken')}`
  });
  BranchId : any;
  constructor(
    private http: HttpClient,
  ) { 
    this.BranchId ={ headers: this.branch};
  }

  Login(data: any) : Observable<any>{
    return this.http.post<any>(_url+'loginUser',data);
  }
  validateLicense() : Observable<any>{
    return this.http.get<any>(_url+'validateLicense');
  }
  getHostName() : Observable<any>{
    return this.http.get<any>(_url+'getHostName');
  }
  isLoggedIn()
  {
    return this.SessionToken!==null;
  }


  async LoginSuccess(session:any, hostActivation:any, accessright:any, user:any, businessInfo:any, username:any, serverDateTime:any, machinePermit:any, vendorPermit:any, branch:any, userAccount:any, menus:any, subMenus:any)
  {
    var Sessions = CryptoJS.AES.encrypt(JSON.stringify(session), this.decryptionKey).toString();
    var SessionToken = CryptoJS.AES.encrypt(session.SessionToken, this.decryptionKey).toString();
    var MaxUsers = CryptoJS.AES.encrypt(session.MaxUsers.toString(), this.decryptionKey).toString(); // Assuming MaxUsers is a number
    var OnlineUsers = CryptoJS.AES.encrypt(session.OnlineUsers.toString(), this.decryptionKey).toString(); // Assuming OnlineUsers is a number
    var LoginId = CryptoJS.AES.encrypt(session.loginId.toString(), this.decryptionKey).toString();
    var Edition = CryptoJS.AES.encrypt(session.Edition.toString(), this.decryptionKey).toString();

    localStorage.setItem('Sessions', Sessions);
    localStorage.setItem('SessionToken', SessionToken);
    localStorage.setItem('MaxUsers', MaxUsers);
    localStorage.setItem('OnlineUsers', OnlineUsers);
    localStorage.setItem('LoginId', LoginId);
    localStorage.setItem('Edition', Edition);
    localStorage.setItem('HasPrintStocksExpiry', 'no');
    localStorage.setItem('HasPrintItems', 'no');
    localStorage.setItem('HasPrintReceivableDues', 'no');
    localStorage.setItem('HasPrintPayableDues', 'no');



    var HostActivation:any  = CryptoJS.AES.encrypt(JSON.stringify(hostActivation), this.decryptionKey).toString();
    localStorage.setItem('HostActivation', HostActivation);

    var UserAccount:any  = CryptoJS.AES.encrypt(JSON.stringify(userAccount), this.decryptionKey).toString();
    var AccessRight:any       = CryptoJS.AES.encrypt(userAccount.AccessRightName, this.decryptionKey).toString();
    localStorage.setItem('UserAccount',UserAccount); 
    localStorage.setItem('AccessRight',AccessRight);

    var User:any  = CryptoJS.AES.encrypt(JSON.stringify(user), this.decryptionKey).toString();
    localStorage.setItem('User',User); 

    var Username:any  = CryptoJS.AES.encrypt(JSON.stringify(username), this.decryptionKey).toString();
    localStorage.setItem('Username',Username); 

    var BusinessInfo:any  = CryptoJS.AES.encrypt(JSON.stringify(businessInfo), this.decryptionKey).toString();
    localStorage.setItem('BusinessInfo',BusinessInfo); 

    var ServerDateTime:any  = CryptoJS.AES.encrypt(serverDateTime, this.decryptionKey).toString();
    localStorage.setItem('ServerDateTime',ServerDateTime); 

    var MachinePermit:any  = CryptoJS.AES.encrypt(JSON.stringify(machinePermit), this.decryptionKey).toString();
    localStorage.setItem('MachinePermit',MachinePermit); 

    var VendorPermit:any  = CryptoJS.AES.encrypt(JSON.stringify(vendorPermit), this.decryptionKey).toString();
    localStorage.setItem('VendorPermit',VendorPermit); 

    var Branch:any  = CryptoJS.AES.encrypt(JSON.stringify(branch), this.decryptionKey).toString();
    localStorage.setItem('Branch',Branch); 

    var Menus:any  = CryptoJS.AES.encrypt(JSON.stringify(menus), this.decryptionKey).toString();
    localStorage.setItem('Menus',Menus); 

    var SubMenus:any  = CryptoJS.AES.encrypt(JSON.stringify(subMenus), this.decryptionKey).toString();
    localStorage.setItem('SubMenus',SubMenus); 
  }


  SetSubMenuButtons(data){
    var SubMenuButtons:any  = CryptoJS.AES.encrypt(JSON.stringify(data), this.decryptionKey).toString();
    localStorage.setItem('SubMenuButtons', SubMenuButtons);
  }

  logout()
  {
    return this.http.get<any>(_url+'logout/'+this.LoginId+'/' + this.SessionToken);
  }

  deleteSession()
  {
    return this.http.get<any>(_url+'deleteSession/'+this.LoginId+'/' + this.SessionToken, this.BranchId);
  }

  updateOnlineUser(){
    return this.http.get<any>(_url+'updateOnlineUser/'+this.LoginId+'/' + this.SessionToken, this.BranchId);
  }
  ClearLocalStorage(){
    // Remember me (branch / edition / username, never the password) stays after a logout
    var remembered = localStorage.getItem('LoginRemember');
    localStorage.clear();
    if (remembered) localStorage.setItem('LoginRemember', remembered);
  }

  get SessionToken(){
    if(localStorage.getItem('SessionToken') != null){
      var encryptedSessionToken:any  = localStorage.getItem('SessionToken')
      var decryptedSessionToken     = CryptoJS.AES.decrypt(encryptedSessionToken, this.decryptionKey).toString(CryptoJS.enc.Utf8);
      return decryptedSessionToken;
    }else{
      return null;
    }
  }

  get LoginId(){
    if(localStorage.getItem('LoginId') != null){
      var encryptedLoginId:any  = localStorage.getItem('LoginId');
      var decryptedLoginId = CryptoJS.AES.decrypt(encryptedLoginId, this.decryptionKey).toString(CryptoJS.enc.Utf8);
      return decryptedLoginId;
    }else{
      return null;
    }
  }
  get Edition(){
    if(localStorage.getItem('Edition') != null){
      var encryptedEdition:any  = localStorage.getItem('Edition');
      var decryptedEdition = CryptoJS.AES.decrypt(encryptedEdition, this.decryptionKey).toString(CryptoJS.enc.Utf8);
      return decryptedEdition;
    }else{
      return null;
    }
  }
  get AccessRight(){
    var encryptedAccessRight:any  = localStorage.getItem('AccessRight');
    var decryptedAccessRight = CryptoJS.AES.decrypt(encryptedAccessRight, this.decryptionKey).toString(CryptoJS.enc.Utf8);
    return decryptedAccessRight;
  }
  get BusinessName(){
    var encryptedBusinessInfo:any  = localStorage.getItem('BusinessInfo');
    var decryptedBusinessInfo = CryptoJS.AES.decrypt(encryptedBusinessInfo, this.decryptionKey).toString(CryptoJS.enc.Utf8);
    const data = JSON.parse(decryptedBusinessInfo);
    return data.BusinessName;
  }

  get BusinessInfo(){
    var encryptedBusinessInfo:any  = localStorage.getItem('BusinessInfo');
    var decryptedBusinessInfo = CryptoJS.AES.decrypt(encryptedBusinessInfo, this.decryptionKey).toString(CryptoJS.enc.Utf8);
    const data = JSON.parse(decryptedBusinessInfo);
    return data;
  }
  get MachinePermit(){
    var encryptedMachinePermit:any  = localStorage.getItem('MachinePermit');
    var decryptedMachinePermit = CryptoJS.AES.decrypt(encryptedMachinePermit, this.decryptionKey).toString(CryptoJS.enc.Utf8);
    const data = JSON.parse(decryptedMachinePermit);
    return data;
  }

  get VendorPermit(){
    var encryptedVendorPermit:any  = localStorage.getItem('VendorPermit');
    var decryptedVendorPermit = CryptoJS.AES.decrypt(encryptedVendorPermit, this.decryptionKey).toString(CryptoJS.enc.Utf8);
    const data = JSON.parse(decryptedVendorPermit);
    return data;
  }

  get UserAccount(){
    var encryptedUserAccount:any  = localStorage.getItem('UserAccount');
    var decryptedUserAccount = CryptoJS.AES.decrypt(encryptedUserAccount, this.decryptionKey).toString(CryptoJS.enc.Utf8);
    const data = JSON.parse(decryptedUserAccount);
    return data;
  }

  get Branch(){
    if(localStorage.getItem('Branch')){
      var encryptedBranch:any  = localStorage.getItem('Branch');
      var decryptedBranch = CryptoJS.AES.decrypt(encryptedBranch, this.decryptionKey).toString(CryptoJS.enc.Utf8);
      const data = JSON.parse(decryptedBranch);
      return data;
    }else{
      return null;
    }
  }
  get Menus(){
    if(localStorage.getItem('Menus').length > 0){
      var encryptedMenus:any  = localStorage.getItem('Menus');
      var decryptedMenus = CryptoJS.AES.decrypt(encryptedMenus, this.decryptionKey).toString(CryptoJS.enc.Utf8);
      const data = JSON.parse(decryptedMenus);
      return data;
    }else{
      return null;
    }
   
  }
  get SubMenus(){
    if(localStorage.getItem('SubMenus').length > 0){
      var encryptedSubMenus:any  = localStorage.getItem('SubMenus');
      var decryptedSubMenus = CryptoJS.AES.decrypt(encryptedSubMenus, this.decryptionKey).toString(CryptoJS.enc.Utf8);
      const data = JSON.parse(decryptedSubMenus);
      return data;
    }else{
      return null;
    }
  }
  get User(){
    var encryptedUser:any  = localStorage.getItem("User");
    var decryptedUser = CryptoJS.AES.decrypt(encryptedUser, this.decryptionKey).toString(CryptoJS.enc.Utf8);
    const data = JSON.parse(decryptedUser);
    return data;

  }
  get Username(){
    var encryptedUsername:any  = localStorage.getItem("Username");
    var decryptedUsername = CryptoJS.AES.decrypt(encryptedUsername, this.decryptionKey).toString(CryptoJS.enc.Utf8);
    return decryptedUsername;
  }
  get ServerDateTime(){
    var encryptedServerDateTime:any  = localStorage.getItem("ServerDateTime");
    var decryptedServerDateTime = CryptoJS.AES.decrypt(encryptedServerDateTime, this.decryptionKey).toString(CryptoJS.enc.Utf8);
    return decryptedServerDateTime;
  }

  get SubMenuButtons(){
    var encryptedSubMenuButtons:any  = localStorage.getItem('SubMenuButtons');
    var decryptedSubMenuButtons = CryptoJS.AES.decrypt(encryptedSubMenuButtons, this.decryptionKey).toString(CryptoJS.enc.Utf8);
    const data = JSON.parse(decryptedSubMenuButtons);
    return data;
  }

  get HostActivation(){
    var encryptedHostActivation:any  = localStorage.getItem("HostActivation");
    var decryptedHostActivation = CryptoJS.AES.decrypt(encryptedHostActivation, this.decryptionKey).toString(CryptoJS.enc.Utf8);
    const data = JSON.parse(decryptedHostActivation);
    return data;
  }

  HasButton(ButtonName: string): boolean {
      const encryptedSubMenuButtons = localStorage.getItem('SubMenuButtons');
      
      const decrypted = CryptoJS.AES.decrypt(encryptedSubMenuButtons, this.decryptionKey).toString(CryptoJS.enc.Utf8);
      try {
        const buttons = JSON.parse(decrypted); 
        return buttons.length === 0 || buttons.includes(ButtonName);
      } catch (e) {
          return false;
      }
  }

}
