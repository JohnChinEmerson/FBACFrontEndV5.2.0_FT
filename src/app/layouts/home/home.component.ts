import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { StocksExpiryService } from 'src/app/services/Inventory/stocks-expiry.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PayableDuesService } from 'src/app/services/Payables/payable-dues.service';
import { PrintService } from 'src/app/services/print.service';
import { ReceivableDuesService } from 'src/app/services/Receivables/receivable-dues.service';
import { PopupAccessRightsService } from 'src/app/services/Support/popup-access-rights.service';
import { PopupsService } from 'src/app/services/Support/popups.service';
import { _systemTitle } from 'src/global-variables';
import { AccessRightSubMenuButtonsService } from '../../services/User/access-right-sub-menu-buttons.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  subscription: Subscription = new Subscription();
  BusinessInfo: any;
  BusinessName: string = '';
  menus: any;
  AccessRight: any;
  Branch: any;
  Branches: any = [];
  SelectedBranch: any = [];
  BranchId: string;
  pageReloaded: boolean = false;
  Sessions: any = [];
  HostActivation: any = [];
  User: any = [];
  Username: any = [];
  ServerDateTime: any = [];
  MachinePermit: any = [];
  VendorPermit: any = [];
  UserAccount: any = [];
  popups: any = [];
  errorMessage: string;
  Menus: any;
  SubMenus: any;
  showLayout: boolean = true;
  // after login (laptop and phone) the home page is the dashboard, not the background logo
  isShowDashboard: boolean = true;

  // Overflow nav
  hiddenMenuIndexes: number[] = [];

  @ViewChild('drawer') drawer!: MatSidenav;
  @ViewChild('navMenuContainer') navMenuContainer!: ElementRef;
  @ViewChildren('navItem') navItems!: QueryList<ElementRef>;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private notif: NotificationService,
    public auth_service: AuthService,
    private branchesService: BranchesService,
    private popupsService: PopupsService,
    private popupAccessRightsService: PopupAccessRightsService,
    private stocksExpiryService: StocksExpiryService,
    private stocksService: StocksService,
    private receivableDuesService: ReceivableDuesService,
    private payableDuesService: PayableDuesService,
    private dateTimesService: DateTimesService,
    private printService: PrintService,
    private accessRightSubMenuButtonsService: AccessRightSubMenuButtonsService,
    private dialog: MatDialog,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.showLayout = params['showLayout'] !== 'false'; // Default to true
    });
    if (!this.auth_service.isLoggedIn()) {
      this.notif.toastrError('Please login your account first!');
      this.router.navigate(['landing']);
    } else {
      this.updateOnlineUser();
    }
    if (!this.auth_service.ServerDateTime) {
      this.logout();
    } else {
      this.checkServerDateTime();
    }
  }

  async ngOnInit(): Promise<void> {
    this.pageReloaded = false;

    this.AccessRight = this.auth_service.AccessRight;
    this.GetBusinessInfo();
    this.GetMenus();
    this.GetBranch();
    // this.GetBranches();
    this.CheckExpiry();
    // Kitchen Queue "ready to serve" notices: only inside Sales Transaction (SalesTransaction2Component)

    await this.getPopups();
  }

  // phones: the side menu covers the screen, so it closes once a submenu is chosen
  closeNavOnPhone() {
    if (this.drawer && window.matchMedia && window.matchMedia('(max-width: 767.98px)').matches) this.drawer.close();
  }

  ngAfterViewInit(): void {
    // Wait for menus to render then calculate overflow
    setTimeout(() => this.calculateOverflow(), 300);
    this.measureLayout();
    setTimeout(() => this.measureLayout(), 300);
  }

  // Full-height screens (Sales / Order Transaction) size themselves with these instead of fixed pixel guesses:
  // --app-top-h = the toolbars above the page, --app-footer-h = the fixed footer (0 on phones: it is in the side menu)
  measureLayout(): void {
    var root = document.documentElement;
    var container = document.querySelector('mat-sidenav-container') as HTMLElement;
    var footer = document.querySelector('.content-footer .footer') as HTMLElement;
    var top = container ? Math.max(0, Math.round(container.getBoundingClientRect().top + window.scrollY)) : 0;
    // fixed elements have no offsetParent: a hidden footer (phones) has no client rects
    var footerHeight = footer && footer.getClientRects().length > 0 ? Math.round(footer.getBoundingClientRect().height) : 0;
    root.style.setProperty('--app-top-h', top + 'px');
    root.style.setProperty('--app-footer-h', footerHeight + 'px');
  }

  @HostListener('window:resize')
  onResize(): void {
    this.calculateOverflow();
    this.measureLayout();
  }

  calculateOverflow(): void {
    if (!this.navMenuContainer || !this.navItems) return;

    const container = this.navMenuContainer.nativeElement as HTMLElement;
    // Reserve ~90px for the "More" button itself
    const MORE_BUTTON_WIDTH = 90;
    const containerWidth = container.offsetWidth - MORE_BUTTON_WIDTH;

    const hidden: number[] = [];
    let usedWidth = 0;

    this.navItems.forEach((item, index) => {
      const el = item.nativeElement as HTMLElement;
      // Temporarily show to measure
      el.classList.remove('nav-item-hidden');
      const itemWidth = el.offsetWidth;

      if (usedWidth + itemWidth > containerWidth) {
        hidden.push(index);
        el.classList.add('nav-item-hidden');
      } else {
        usedWidth += itemWidth;
      }
    });

    this.hiddenMenuIndexes = hidden;
  }

  updateOnlineUser() {
    setInterval(() => {
      console.log('Updating activity log...');
      this.auth_service.updateOnlineUser().subscribe({
        next: (response) => {
          console.log('Activity log successful.', response);
        },
        error: (err) => {
          console.error('Activity log failed.', err);
        },
      });
    }, 120000); //2 minutes
  }

  async checkServerDateTime() {
    try {
      const ServerDateTime: any = this.auth_service.ServerDateTime;
      const serverDate = new Date(ServerDateTime).toDateString();
      const currentDate = new Date().toDateString();
      if (serverDate !== currentDate) {
        this.logout();
      }
    } catch (error) {
      console.error('Error checking server date time:', error);
    }
  }

  async GetBranches() {
    this.Branches = await firstValueFrom(
      this.branchesService.getBranchesCBONotAllForCommonAdmin(),
    );
  }

  onClickSelectBranch(data) {
    if (this.Branch?.BranchId == data.BranchId) {
      return;
    }
    this.notif.toastrInfo('Navigating in ' + data.BranchName + ' ...');
    this.auth_service.deleteSession().subscribe({
      next: (res) => {
        this.auth_service.logout().subscribe({
          next: (res) => {
            return this.reloginToBranch(data);
          },
          error: (err) => {
            this.notif.toastrError(err.error.message);
          },
        });
      },
      error: (err) => {
        this.notif.toastrError(err.error.message);
      },
    });
  }

  reloginToBranch(data) {
    var login: any = {
      Username: this.auth_service.UserAccount.Username,
      Password: 'commonadmin',
      BranchId: data.BranchId,
      Edition: 'default',
    };
    this.subscription = this.auth_service.Login(login).subscribe({
      next: async (res) => {
        this.auth_service.ClearLocalStorage();
        this.Sessions = res['Sessions'];
        this.AccessRight = res['AccessRight'];
        this.HostActivation = res['HostActivation'];
        this.User = res['User'];
        this.BusinessInfo = res['BusinessInfo'];
        this.Username = res['Username'];
        this.ServerDateTime = res['ServerDateTime'];
        this.MachinePermit = res['MachinePermit'];
        this.VendorPermit = res['VendorPermit'];
        this.Branch = res['Branch'];
        this.UserAccount = res['UserAccount'];
        this.Menus = res['Menus'];
        this.SubMenus = res['SubMenus'];
        await this.auth_service.LoginSuccess(
          this.Sessions,
          this.HostActivation,
          this.AccessRight,
          this.User,
          this.BusinessInfo,
          this.Username,
          this.ServerDateTime,
          this.MachinePermit,
          this.VendorPermit,
          this.Branch,
          this.UserAccount,
          this.Menus,
          this.SubMenus,
        );
        window.location.reload();
      },
      error: (err) => {
        this.notif
          .popup('Invalid Action ', err.error.message)
          .then((result) => {
            this.reloginToBranch(this.Branch);
          });
      },
    });
  }

  GetBusinessInfo() {
    this.BusinessName = this.auth_service.BusinessName;
  }

  async GetBranch() {
    this.Branch = this.auth_service.Branch;
    if (this.auth_service.AccessRight == 'commonadmin') {
      await this.GetBranches();
    }
  }

  GetMenus() {
    const Menus = this.auth_service.Menus;
    this.Menus = Menus;
    const SubMenus = this.auth_service.SubMenus;
    this.SubMenus = SubMenus;
  }

  onSelect(Route: string) {
    this.router.navigate([Route], { relativeTo: this.route });
  }

  logout() {
    this.auth_service.deleteSession().subscribe({
      next: (res) => {
        this.auth_service.logout().subscribe({
          next: (res) => {
            this.notif.toastrSuccess('Logout Successfully');
            this.auth_service.ClearLocalStorage();
            this.router.navigate(['landing']);
          },
          error: (err) => {
            this.notif.toastrError(err.error.message);
          },
        });
      },
      error: (err) => {
        this.notif.toastrError(err.error.message);
      },
    });
  }

  getPath(Menu: string) {
    Menu = Menu.replace(' ', '');
    Menu = Menu.replace(' ', '');

    var data: string = this.router.url;
    var data2: any = data.split('/');
    let route = data2[data2.length - 2].replace(/[^\w\s]/gi, '');
    var route2 = route.replace(/[0-9]/g, '');

    if (route2.includes('return')) {
      return Menu.includes('return');
    } else {
      return route2 == Menu;
    }
  }

  async onSelectSubMenu(SubMenuId) {
    localStorage.removeItem('SubMenuButtons');
    localStorage.setItem('SubMenuId', SubMenuId);
  }

  async getButtons() {
    var SubMenuId = localStorage.getItem('SubMenuId');
    var buttons = await firstValueFrom(
      this.accessRightSubMenuButtonsService.getAccessRightSubMenuButtonsByAccessRightIdBySubMenuIdForAction(
        this.auth_service.UserAccount.AccessRightId,
        SubMenuId,
        this.auth_service.Branch.BranchId,
      ),
    );
    this.auth_service.SetSubMenuButtons(buttons);
  }

  CheckExpiry() {
    var expiryDate: any = new Date(this.auth_service.HostActivation.ExpiryDate);
    var today: any = new Date();
    var timeDiff = expiryDate - today;
    var dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (
      dayDiff >= 1 &&
      dayDiff <= 10 &&
      this.auth_service.HostActivation.LicensePlan != 'unlimited'
    ) {
      this.notif.popup(
        'Expiring License',
        _systemTitle + ' license is set to expire in ' + dayDiff + ' day(s).',
      );
    }
  }

  async getPopups() {
    this.popups = await firstValueFrom(
      this.popupAccessRightsService.getPopupAccessRightsByUserId(
        this.auth_service.UserAccount.id,
      ),
    );

    this.popups.forEach(async (data) => {
      var p = await firstValueFrom(
        this.popupsService.getPopupConfigById(data.PopupId),
      );
      var days = 0;
      if (p) {
        days = p.OnOrBeforeDays;
      }
      switch (data.Popup.toLowerCase()) {
        case 'stocks expiry':
          if (
            this.checkEdition(
              this.auth_service.UserAccount.Edition.toLowerCase(),
              p,
            ) &&
            localStorage.getItem('HasPrintStocksExpiry').toLowerCase() == 'no'
          ) {
            this.PopupExpiry(days);
          }
          break;
        case 'out of stocks':
          if (
            this.checkEdition(
              this.auth_service.UserAccount.Edition.toLowerCase(),
              p,
            ) &&
            localStorage.getItem('HasPrintItems').toLowerCase() == 'no'
          ) {
            this.PopupOutOfStocks();
          }
          break;
        case 'receivables':
          if (
            this.checkEdition(
              this.auth_service.UserAccount.Edition.toLowerCase(),
              p,
            ) &&
            localStorage.getItem('HasPrintReceivableDues').toLowerCase() == 'no'
          ) {
            this.PopupReceivables(days);
          }
          break;
        case 'payables':
          if (
            this.checkEdition(
              this.auth_service.UserAccount.Edition.toLowerCase(),
              p,
            ) &&
            localStorage.getItem('HasPrintPayableDues').toLowerCase() == 'no'
          ) {
            this.PopupPayables(days);
          }
          break;
        case 'dashboard':
          this.PopupDashBoard();
          break;
      }
    });
  }

  checkEdition(edition, popup) {
    if (edition == 'enterprise') {
      return popup.Enterprise.toLowerCase() == 'yes';
    } else if (edition == 'standard') {
      return popup.Standard.toLowerCase() == 'yes';
    } else if (edition == 'express') {
      return popup.Express.toLowerCase() == 'yes';
    } else if (edition == 'pos') {
      return popup.POS.toLowerCase() == 'yes';
    } else if (edition == 'pos/bir') {
      return popup.POSBIR.toLowerCase() == 'yes';
    } else return popup.POSBIRBackOffice.toLowerCase() == 'yes';
  }
  async PopupExpiry(days: number) {
    let dateFrom: Date = new Date();
    let dateTo: Date = new Date();
    dateTo.setDate(dateTo.getDate() + days);

    let data = await firstValueFrom(
      this.stocksExpiryService.getStocksExpiryByCategoryByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(dateFrom),
        this.dateTimesService.ConvertToDateFormat(dateTo),
        'all',
      ),
    );

    if (data.length > 0) {
      var url = this.router.serializeUrl(
        this.router.createUrlTree(['print/printstocksexpiry']),
      );
      var title = 'ALL STOCKS EXPIRY';
      title +=
        ' FROM ' +
        this.dateTimesService.ConvertToDateFormat(dateFrom) +
        ' TO ' +
        this.dateTimesService.ConvertToDateFormat(dateTo);

      this.printService.popupWindow(url, 'printstocksexpiry', window, 800, 800);
      localStorage.setItem('StocksExpiry', JSON.stringify(data));
      localStorage.setItem('Title', title);
      localStorage.setItem('Title4', title);
      localStorage.setItem('Type4', 'Title4');
    }
  }

  async PopupOutOfStocks() {
    let data = await firstValueFrom(this.stocksService.getStocks());
    data = data.filter((x) => +x.Available <= +x.AlertQty || +x.Available <= 0);

    if (data.length > 0) {
      var url = this.router.serializeUrl(
        this.router.createUrlTree(['print/printstocks']),
      );
      this.printService.popupWindow(url, 'Items', window, 800, 800);

      localStorage.setItem('Items', JSON.stringify(data));
      localStorage.setItem('Title', 'OUT OF STOCKS ITEMS');
      localStorage.setItem('Title1', 'OUT OF STOCKS ITEMS');
      localStorage.setItem('Type1', 'Title1');
    }
  }

  async PopupReceivables(days) {
    let dateFrom: Date = new Date();
    let dateTo: Date = new Date();
    dateTo.setDate(dateTo.getDate() + days);

    let data = await firstValueFrom(
      this.receivableDuesService.getReceivableDuesByDateFromByDateToByTarget(
        this.dateTimesService.ConvertToDateFormat(new Date(dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(dateTo)),
        'Date Range',
      ),
    );

    if (data.length > 0) {
      var url = this.router.serializeUrl(
        this.router.createUrlTree(['print/printreceivabledues']),
      );
      var title =
        'RECEIVABLES DUES FROM ' +
        this.dateTimesService.ConvertToDateFormat(new Date(dateFrom)) +
        ' TO ' +
        this.dateTimesService.ConvertToDateFormat(new Date(dateTo));
      this.printService.popupWindow(
        url,
        'printreceivabledues',
        window,
        800,
        800,
      );
      localStorage.setItem('ReceivableDues', JSON.stringify(data));
      localStorage.setItem('Data2', JSON.stringify(data));
      localStorage.setItem('Title', title);
      localStorage.setItem('Title2', title);
      localStorage.setItem('Type2', 'Title2');
    }
  }

  async PopupPayables(days) {
    let dateFrom: Date = new Date();
    let dateTo: Date = new Date();
    dateTo.setDate(dateTo.getDate() + days);

    let data = await firstValueFrom(
      this.payableDuesService.getPayableDuesByDateFromByDateToByTarget(
        this.dateTimesService.ConvertToDateFormat(new Date(dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(dateTo)),
        'Date Range',
      ),
    );

    if (data.length > 0) {
      var url = this.router.serializeUrl(
        this.router.createUrlTree(['print/printpayabledues']),
      );
      var title =
        'PAYABLE DUES FROM ' +
        this.dateTimesService.ConvertToDateFormat(new Date(dateFrom)) +
        ' TO ' +
        this.dateTimesService.ConvertToDateFormat(new Date(dateTo));
      this.printService.popupWindow(url, 'printpayabledues', window, 800, 800);
      localStorage.setItem('PayableDues', JSON.stringify(data));
      localStorage.setItem('Data3', JSON.stringify(data));
      localStorage.setItem('Title', title);
      localStorage.setItem('Title3', title);
      localStorage.setItem('Type3', 'Title3');
    }
  }

  PopupDashBoard() {
    this.isShowDashboard = true;
  }
}
