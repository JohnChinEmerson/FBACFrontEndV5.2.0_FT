import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PopUpService } from 'src/app/services/pop-up.service';
import { _systemTitle } from 'src/global-variables';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  // phones get their own login screen (same form, same login()); tablets and desktops keep the card
  static readonly PHONE_QUERY = '(max-width: 767.98px)';
  isPhone        : boolean = typeof window != 'undefined' && window.matchMedia ? window.matchMedia(LoginComponent.PHONE_QUERY).matches : false;
  showPassword   : boolean = false;
  rememberMe     : boolean = false;
  submitted      : boolean = false;
  private layoutSubscription = new Subscription();
  subscription: Subscription = new Subscription;
  Branches:any;
  errorMessage: string;
  editions : any = ['ENTERPRISE', 'STANDARD', 'EXPRESS', 'POS', 'POS/BIR', 'POS/BIR BACK OFFICE', 'DEFAULT']
  loginForm = new FormGroup({
    Username: new FormControl(''),
    Password: new FormControl(''),
    BranchId: new FormControl(''),
    Edition: new FormControl(''),
  })
  Menus: any;
  SubMenus: any;
  systemTitle: string;
  loading               : boolean = false;

  constructor(
    private router: Router,
    private notif: NotificationService,
    private auth_service: AuthService,
    private br_service: BranchesService,
    private popUpService: PopUpService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  pageReloaded: boolean = false;
  Sessions        : any=[];
  AccessRight     : any=[];
  HostActivation  : any=[];
  User            : any=[];
  BusinessInfo    : any=[];
  Username        : any=[];
  ServerDateTime  : any=[];
  MachinePermit   : any=[];
  VendorPermit    : any=[];
  Branch          : any=[];
  ShowBranches    : boolean = false;
  UserAccount     : any=[];
  hostName          : string;
  ngOnInit(): void {
    this.pageReloaded = false;
    this.layoutSubscription.add(this.breakpointObserver.observe(LoginComponent.PHONE_QUERY).subscribe(state => this.isPhone = state.matches));
    // phone dropdowns show their placeholder only without a value ('' counts as one); login() gets '' back
    if (this.isPhone) this.loginForm.patchValue({ 'BranchId': null, 'Edition': null });
    this.loadRemembered();
    this.GetBranches();
  }

  ngOnDestroy(): void {
    this.layoutSubscription.unsubscribe();
  }

  // Remember me keeps the branch, edition and username on this device (never the password); the session itself
  // is kept until Logout, as before
  private loadRemembered(){
    try {
      var saved = JSON.parse(localStorage.getItem('LoginRemember') || 'null');
      if (!saved) return;
      this.rememberMe = true;
      this.loginForm.patchValue({ 'Username': saved.Username || '', 'BranchId': saved.BranchId || this.loginForm.value.BranchId, 'Edition': saved.Edition || this.loginForm.value.Edition });
    } catch (e) { }
  }

  private saveRemembered(){
    try {
      if (this.rememberMe)
        localStorage.setItem('LoginRemember', JSON.stringify({ 'Username': this.loginForm.value.Username, 'BranchId': this.loginForm.value.BranchId, 'Edition': this.loginForm.value.Edition }));
      else
        localStorage.removeItem('LoginRemember');
    } catch (e) { }
  }

  // phone login: inline errors for the empty fields first, then the same login()
  fieldMissing(name: string): boolean {
    var value = this.loginForm.get(name)?.value;
    return this.submitted && (value === null || value === undefined || String(value).trim() === '');
  }

  onPhoneLogin(){
    this.submitted = true;
    this.errorMessage = '';
    var required = ['BranchId', 'Username', 'Password'];
    if (this.hostName == 'mariosoftacctng.com') required.push('Edition');
    if (required.some(name => this.fieldMissing(name)) || this.loading) return;
    // the same values the desktop form sends for an unused dropdown
    if (this.loginForm.value.Edition == null) this.loginForm.patchValue({ 'Edition': '' });
    this.login();
  }

  async GetBranches(){
    this.systemTitle = _systemTitle;
    this.hostName = await firstValueFrom(this.auth_service.getHostName());
    this.Branches = await firstValueFrom(this.br_service.getBranchesToDisplay());
    this.Branches = this.Branches.filter(x=> x.RecordStatus == 'active');
    this.Branches.push('Super Admin');
  }
  
  login()
  {
    this.loading = true;
    this.saveRemembered();
    this.subscription = this.auth_service.Login(this.loginForm.value).subscribe({
      next: async (res)=>{
        this.notif.toastrSuccess('Login Successfully');
        this.Sessions         = res['Sessions'];
        this.AccessRight      = res['AccessRight'];
        this.HostActivation   = res['HostActivation'];
        this.User             = res['User'];
        this.BusinessInfo     = res['BusinessInfo'];
        this.Username         = res['Username'];
        this.ServerDateTime   = res['ServerDateTime'];
        this.MachinePermit    = res['MachinePermit'];
        this.VendorPermit     = res['VendorPermit'];
        this.Branch           = res['Branch'];
        this.UserAccount      = res['UserAccount'];
        this.Menus          = res['Menus'];
        this.SubMenus       = res['SubMenus'];
         await this.auth_service.LoginSuccess(this.Sessions, this.HostActivation, this.AccessRight, this.User, this.BusinessInfo,this.Username, this.ServerDateTime,  this.MachinePermit,  this.VendorPermit , this.Branch, this.UserAccount, this.Menus, this.SubMenus);
          this.router.navigate(['home']).then(() => {
            if(this.loginForm.controls['BranchId'].value != 'Super Admin'){
              if (!this.pageReloaded) {
                this.pageReloaded = true;
                window.location.reload();
              }
            }
          });
        this.loading = false;

      },
      error: (err)=>{
        this.loading = false;
        this.errorMessage = err.error.message;
        setTimeout(() => {
          this.errorMessage = "";
        }, 3000);
      }
    });
  }

  onClose(){
    this.router.navigate(['landing']);
  }
}
