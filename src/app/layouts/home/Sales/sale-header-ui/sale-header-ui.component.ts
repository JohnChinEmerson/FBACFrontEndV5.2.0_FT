import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  EMPTY,
  firstValueFrom,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BanksService } from 'src/app/services/Cashflow/banks.service';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { MachinePermitsService } from 'src/app/services/Config/machine-permits.service';
import { VendorPermitsService } from 'src/app/services/Config/vendor-permits.service';
import { CustomerChecksService } from 'src/app/services/CustomerChecks/customer-checks.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { SharedMultiplePaymentHeadersService } from 'src/app/services/MultiplePayments/shared-multiple-payment-headers.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PrintService } from 'src/app/services/print.service';
import { DiscountApplicationsService } from 'src/app/services/Sales/discount-applications.service';
import { SaleConfigAccessRightsService } from 'src/app/services/Sales/sale-config-access-rights.service';
import { SaleConfigService } from 'src/app/services/Sales/sale-config.service';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { SaleRestaurantService } from 'src/app/services/Sales/sale-restaurant.service';
import { SalesConfigPerMachineService } from 'src/app/services/Sales/sales-config-per-machine.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { TaxHelperService } from 'src/app/services/tax-helper.service';
import { MultiplePaymentHeadersService } from '../../../../services/MultiplePayments/multiple-payment-headers.service';
import { fitHeaderDialogToPhone } from '../../../shared/transaction-header/transaction-header';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';
import { UnpaidCustomerChecksUIComponent } from '../../CustomerChecks/unpaid-customer-checks-ui/unpaid-customer-checks-ui.component';
import { MultiplePaymentUIComponent } from '../../MultiplePayments/multiple-payment-ui/multiple-payment-ui.component';
import { ChangeUIComponent } from '../change-ui/change-ui.component';
import { DiscountApplicationUIComponent } from '../discount-application-ui/discount-application-ui.component';
import { DiscountPersonsUIComponent } from '../discount-persons-ui/discount-persons-ui.component';

@Component({
  selector: 'app-sale-header-ui',
  templateUrl: './sale-header-ui.component.html',
  styleUrls: [
    '../../../shared/transaction-header/transaction-header.css',
    './sale-header-ui.component.css',
  ],
})
export class SaleHeaderUIComponent implements OnInit, OnDestroy {
  btnText: string = 'Save';
  loading: boolean = false;
  saleHeader: any = [];
  discountPersons: any = [];
  paymentTypes: any = [];
  paymentType: string;
  deliveryTypes: any = ['pickup', 'deliver'];
  discountTypes: any = ['percent', 'amount'];
  vatTypes: any = ['No VAT', 'VAT Included', 'Add VAT'];
  cashAccounts: any = [];
  checks: any = [];
  banks: any = [];
  action: string;
  totalAmount: string;
  transNo: string; // the pending sale (temporary TransNo) or the saved one
  discountPersonTxt: string;
  oHeader: any;
  recordStatusCashiering: string;
  customer: any = [];
  saleConfig: any = [];
  saleConfigAccessRight: any = [];
  saleconfigPerMachine: any = [];
  requiredDepositTo: boolean = false;
  requiredCheck: boolean = false;
  requiredBank: boolean = false;
  useRebate: boolean = false;
  amountPaid: number;
  displayBank = (value: string): string => value || '';
  saleHeaderForm = new FormGroup({
    id: new FormControl(''),
    TransNo: new FormControl(''),
    TransDate: new FormControl(new Date()),
    OrderNo: new FormControl(''),
    InvNo: new FormControl(''),
    CustomerId: new FormControl(''),
    CustomerName: new FormControl(''),
    DeliveryType: new FormControl(''),
    DeliveryDate: new FormControl(new Date()),
    TotalAmount: new FormControl(''),
    DeliveryFee: new FormControl(''),
    DiscountAmount: new FormControl(this.numbersService.Convert2Decimal(0)),
    DiscountValue: new FormControl(this.numbersService.Convert2Decimal(0)),
    DiscountType: new FormControl(''),
    DiscountId: new FormControl(''),
    DiscountPerson: new FormControl('NA'),
    WHTaxAmount: new FormControl(this.numbersService.Convert2Decimal(0)),
    WHTaxValue: new FormControl(this.numbersService.Convert2Decimal(0)),
    WHTaxType: new FormControl(''),
    AdvancePayment: new FormControl(''),
    TotalDue: new FormControl(''),
    AmountPaid: new FormControl(''),
    Change: new FormControl(''),
    RebatePaid: new FormControl(''),
    VATType: new FormControl(''),
    LessVAT: new FormControl(''),
    PaymentType: new FormControl(''),
    TermDays: new FormControl(''),
    DepositTo: new FormControl(''),
    DepositToCashType: new FormControl(''),
    ReferenceNo: new FormControl('-'),
    CheckId: new FormControl(''),
    CheckNo: new FormControl(''),
    CheckDate: new FormControl(''),
    CheckDate2: new FormControl(null),
    BankName: new FormControl(''),
    Remarks: new FormControl(''),
    VATSales: new FormControl(''),
    VATExemptSales: new FormControl(''),
    VATableAmount: new FormControl(''),
    NonVATSales: new FormControl(''),
    VATAmount: new FormControl(''),
    ZeroRatedSales: new FormControl(''),
    Balance: new FormControl(''),
    PrintReceipt: new FormControl(''),
    ServiceFeeAmount: new FormControl(this.numbersService.Convert2Decimal(0)),
    ServiceFeeValue: new FormControl(this.numbersService.Convert2Decimal(0)),
    ServiceFeeType: new FormControl('percent'),
    PaxCount: new FormControl(1),
  });
  // Desktop DiscountApplication rows of this sale (several discounts can stack)
  discountApplications: any[] = [];
  printDiscounts: any[] = [];
  billOutText: string = 'Bill Out';
  // set by Sales Transaction for the hidden quick-pay dialog (Enter on AMOUNT PAID)
  closeOnError: boolean = false;
  // typed amounts are sent once the cashier pauses; switchMap drops replies of older keystrokes
  private recompute$ = new Subject<void>();
  private subscriptions = new Subscription();
  printReceipt: boolean = false;
  disablePrintReceipt: boolean = false;
  toggleType: string = 'change';
  selectCheck: boolean = false;
  enableDiscountBtn: boolean = false;
  @Output() formReady = new EventEmitter<void>();
  @ViewChild('amountPaidInput') myInputField!: ElementRef;
  constructor(
    private dialogRef: MatDialogRef<SaleHeaderUIComponent>,
    private dialog: MatDialog,
    private saleHeadersService: SaleHeadersService,
    private saleDetailsService: SaleDetailsService,
    private notif: NotificationService,
    private saleConfigService: SaleConfigService,
    private saleConfigAccessRightsService: SaleConfigAccessRightsService,
    private salesConfigPerMachineService: SalesConfigPerMachineService,
    private numbersService: NumbersService,
    private cashAccountsService: CashAccountsService,
    private banksService: BanksService,
    private taxHelperService: TaxHelperService,
    private dateTimesService: DateTimesService,
    private stringHelperService: StringHelperService,
    private customerChecksService: CustomerChecksService,
    private machinePermitsService: MachinePermitsService,
    private vendorPermitsService: VendorPermitsService,
    private sharedMultiplePaymentHeadersService: SharedMultiplePaymentHeadersService,
    private multiplePaymentHeadersService: MultiplePaymentHeadersService,
    private printService: PrintService,
    private router: Router,
    private authService: AuthService,
    private discountApplicationsService: DiscountApplicationsService,
    private saleRestaurantService: SaleRestaurantService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) {}

  // phones: the less used fields are folded until MORE DETAILS
  showMore: boolean = false;

  async ngOnInit(): Promise<void> {
    // phones: the dialog takes the whole screen (not the hidden auto-save dialog of the Amount Paid box)
    if (!this.closeOnError) {
      fitHeaderDialogToPhone(this.dialogRef);
    }
    this.subscriptions.add(
      this.recompute$
        .pipe(
          debounceTime(250),
          switchMap(() =>
            this.saleHeadersService
              .getSaleHeaderComputedAmounts(this.getComputeInputs())
              .pipe(catchError(() => EMPTY)),
          ),
        )
        .subscribe((result) => this.displayComputedAmounts(result)),
    );

    if (this.data) {
      this.customer = this.data[0];
      this.saleHeader = this.data[1];
      this.transNo = this.data[2];
      this.totalAmount = this.data[3];
      this.oHeader = this.data[4];
      this.recordStatusCashiering = this.data[5];
      this.action = this.data[6];
      this.amountPaid = this.data[7];

      await this.getsaleHeaderFormDefault();
      // settings, payment types and the sale's discounts are independent: fetched together
      // (the VAT breakdown comes with the computed amounts)
      var customerId =
        this.action.toLowerCase() == 'updatesaleheader'
          ? this.saleHeader.CustomerId
          : this.customer.CustomerId;
      await Promise.all([
        this.getSaleConfig(),
        this.getPaymentType(customerId),
        this.loadDiscountApplications(),
      ]);

      if (this.action.toLowerCase() == 'savesalestransaction') {
        this.btnText = 'Save';
        await this.getsaleHeaderForm1();
      }
      if (this.action.toLowerCase() == 'updatesaleheader') {
        this.btnText = 'Update';
        await this.getsaleHeaderForm2();
      }
      this.myInputField.nativeElement.focus();
      this.formReady.emit();
    }
  }

  async getSaleConfig() {
    // independent settings: fetched together
    [this.saleConfig, this.saleConfigAccessRight, this.saleconfigPerMachine] =
      await Promise.all([
        firstValueFrom(this.saleConfigService.getSaleConfig()),
        firstValueFrom(
          this.saleConfigAccessRightsService.getSaleConfigAccessRightByAccessRightName(
            this.authService.UserAccount.AccessRightName,
          ),
        ),
        firstValueFrom(
          this.salesConfigPerMachineService.getSaleConfigPerMachineByComputerName(
            this.authService.UserAccount.ComputerName,
          ),
        ),
      ]);
    this.setUpFields();
  }

  setUpFields() {
    if (
      (this.saleConfigAccessRight.DisableReceiptDiscount || '').toLowerCase() ==
      'yes'
    ) {
      this.saleHeaderForm.controls['DiscountValue'].disable();
      this.saleHeaderForm.controls['DiscountType'].disable();
      this.saleHeaderForm.controls['DiscountPerson'].disable();
      this.enableDiscountBtn = false;
    } else {
      this.saleHeaderForm.controls['DiscountValue'].enable();
      this.saleHeaderForm.controls['DiscountType'].enable();
      this.saleHeaderForm.controls['DiscountPerson'].enable();
      this.enableDiscountBtn = true;
    }

    if (
      (this.saleConfigAccessRight.DisableTransDate || '').toLowerCase() == 'yes'
    ) {
      this.saleHeaderForm.controls['TransDate'].disable();
    } else {
      this.saleHeaderForm.controls['TransDate'].enable();
    }

    this.onChangePrintReceipt(
      (this.saleconfigPerMachine.PrintReceipt || '').toLowerCase() == 'yes',
    );
    this.saleHeaderForm.controls['Remarks'].setValue(
      this.saleConfig.ReceiptNotes,
    );
    this.saleHeaderForm.controls['VATType'].setValue(this.saleConfig.VATType);
  }

  getsaleHeaderFormDefault() {
    this.saleHeaderForm.controls['DeliveryFee'].setValue(
      this.numbersService.Convert2Decimal(0),
    );
    this.discountPersonTxt = 'No Discount';
    this.saleHeaderForm.controls['AdvancePayment'].setValue(
      this.numbersService.Convert2Decimal(0),
    );
    this.saleHeaderForm.controls['TermDays'].setValue(
      this.numbersService.Convert0Decimal(0),
    );
    this.saleHeaderForm.controls['LessVAT'].setValue(
      this.numbersService.Convert2Decimal(0),
    );
  }

  async getsaleHeaderForm1() {
    this.saleHeaderForm.controls['CustomerId'].setValue(
      this.customer.CustomerId,
    );
    this.saleHeaderForm.controls['CustomerName'].setValue(
      this.customer.CustomerName,
    );
    this.saleHeaderForm.controls['DiscountPerson'].setValue(
      this.customer.DiscountPerson,
    );
    this.saleHeaderForm.controls['DiscountValue'].setValue(
      this.customer.DiscountPercent,
    );
    this.saleHeaderForm.controls['DiscountId'].setValue(
      this.customer.DiscountId,
    );
    this.discountPersonTxt = this.customer.DiscountPerson;

    this.saleHeaderForm.controls['TotalAmount'].setValue(
      this.numbersService.Convert2Decimal(this.totalAmount),
    );
    this.saleHeaderForm.controls['AmountPaid'].setValue(
      this.numbersService.Convert2Decimal(this.amountPaid),
    );

    this.saleHeaderForm.controls['DeliveryType'].setValue(
      this.deliveryTypes[0],
    );
    this.saleHeaderForm.controls['DiscountType'].setValue(
      this.discountTypes[0],
    );
    this.saleHeaderForm.controls['WHTaxType'].setValue(this.discountTypes[0]);
    // Desktop SaleHeaderUI: service fee from Sales Config, none for a Take out order
    var takeOut =
      (this.saleHeader?.OrderType || '').toLowerCase() == 'take out';
    this.saleHeaderForm.controls['ServiceFeeValue'].setValue(
      this.numbersService.Convert2Decimal(
        takeOut ? 0 : +(this.saleConfig.ServiceFee || 0),
      ),
    );
    this.saleHeaderForm.controls['ServiceFeeType'].setValue(
      takeOut
        ? 'percent'
        : (this.saleConfig.ServiceFeeType || 'percent').toLowerCase(),
    );
    // this.saleHeaderForm.controls['VATType'].setValue(this.vatTypes[0]);

    this.saleHeaderForm.controls['PaymentType'].setValue(this.paymentTypes[0]);
    // this.saleHeaderForm.controls['VATType'].setValue(this.taxHelperService.VATType());

    var billOutNo = (this.saleHeader?.BillOutNo || 'na')
      .toString()
      .toLowerCase();
    this.billOutText =
      billOutNo != 'na' && billOutNo != '-' ? 'Re-Print' : 'Bill Out';
    // Desktop: pax of the applied discounts, else 1 (the restaurant pax when the table has one)
    this.saleHeaderForm.controls['PaxCount'].setValue(
      this.discountApplications.length > 0
        ? +this.discountApplications[0].PaxCount
        : Math.max(1, +(this.saleHeader?.PaxCount || 0)),
    );
    this.saleHeaderForm.controls['RebatePaid'].setValue(
      this.numbersService.Convert2Decimal(0),
    );
    if (this.oHeader != null) {
      this.displayOrderNo();
      this.saleHeaderForm.controls['AdvancePayment'].setValue(
        this.numbersService.Convert2Decimal(this.oHeader.AdvancePayment),
      );
    }
    await this.onChangePaymentType(this.paymentTypes[0]);
    this.onCheckUseRebate(this.useRebate, false);
    await this.computeTotalDue();
    this.onChangeDeliveryType(this.deliveryTypes[0]);
  }

  async getPaymentType(customerId) {
    this.paymentTypes = await firstValueFrom(
      this.cashAccountsService.setPaymentTypes(customerId, true),
    );
    this.paymentTypes.push('MULTIPLE');
  }

  async computeVATSales(transNo) {
    var data: any = await firstValueFrom(
      this.saleDetailsService.getSalesType(transNo),
    );

    this.saleHeaderForm.controls['VATSales'].setValue(
      this.numbersService.Convert2Decimal(data.VATSales),
    );
    this.saleHeaderForm.controls['VATAmount'].setValue(
      this.numbersService.Convert2Decimal(data.VATAmount),
    );
    this.saleHeaderForm.controls['VATableAmount'].setValue(
      this.numbersService.Convert2Decimal(data.VATableSales),
    );
    this.saleHeaderForm.controls['VATExemptSales'].setValue(
      this.numbersService.Convert2Decimal(data.VATExemptSales),
    );
    this.saleHeaderForm.controls['ZeroRatedSales'].setValue(
      this.numbersService.Convert2Decimal(data.ZeroRatedSales),
    );
    this.saleHeaderForm.controls['NonVATSales'].setValue(
      this.numbersService.Convert2Decimal(data.NonVATSales),
    );
  }

  // the server takes the sale amounts from the sale details and its discounts; only the inputs are sent
  getComputeInputs() {
    var num = (control: string) => {
      var value = (
        this.saleHeaderForm.controls[control].value ?? ''
      ).toString();
      return this.numbersService.isNotNumeric(value) ? 0 : +value;
    };
    return {
      TransNo: this.transNo,
      PaxCount: Math.max(1, Math.floor(num('PaxCount'))),
      WHTaxValue: num('WHTaxValue'),
      WHTaxType: (
        this.saleHeaderForm.controls['WHTaxType'].value || 'percent'
      ).toLowerCase(),
      VATType: (
        this.saleHeaderForm.controls['VATType'].value || ''
      ).toLowerCase(),
      DeliveryFee: num('DeliveryFee'),
      RebatePaid: num('RebatePaid'),
      AdvancePayment: num('AdvancePayment'),
      ServiceFeeValue: num('ServiceFeeValue'),
      ServiceFeeType: (
        this.saleHeaderForm.controls['ServiceFeeType'].value || 'percent'
      ).toLowerCase(),
    };
  }

  async computeTotalDue() {
    var result: any = await firstValueFrom(
      this.saleHeadersService.getSaleHeaderComputedAmounts(
        this.getComputeInputs(),
      ),
    );
    this.displayComputedAmounts(result);
  }

  // for typed inputs: one request after the cashier pauses
  queueComputeTotalDue() {
    this.recompute$.next();
  }

  displayComputedAmounts(result) {
    var amounts = [
      'TotalAmount',
      'DiscountAmount',
      'VATableAmount',
      'VATAmount',
      'WHTaxAmount',
      'AdvancePayment',
      'LessVAT',
      'TotalDue',
      'VATSales',
      'VATExemptSales',
      'NonVATSales',
      'ZeroRatedSales',
      'ServiceFeeAmount',
    ];
    amounts.forEach((x) =>
      this.saleHeaderForm.controls[x].setValue(
        this.numbersService.Convert2Decimal(result[x] || 0),
      ),
    );
    // Check / Bank Deposit pay the whole amount due: it follows the total when that changes after the payment
    // type was picked (a discount, a fee, the VAT type); it kept the old total and the sale could not be saved
    if (['check', 'bank deposit'].includes((this.paymentType || '').toLowerCase()))
      this.saleHeaderForm.controls['AmountPaid'].setValue(
        this.saleHeaderForm.controls['TotalDue'].value,
      );
    this.computeChange();
  }

  // AmountPaid only changes the change; no server call
  computeChange() {
    let numericAmount = parseFloat(
      this.saleHeaderForm.controls['AmountPaid'].value,
    );
    if (!isNaN(numericAmount)) {
      let change =
        numericAmount - +this.saleHeaderForm.controls['TotalDue'].value;
      this.saleHeaderForm.controls['Change'].setValue(
        this.numbersService.Convert2Decimal(change),
      );
    } else {
      this.saleHeaderForm.controls['Change'].setValue('');
    }
  }

  async loadDiscountApplications() {
    this.discountApplications =
      (await firstValueFrom(
        this.discountApplicationsService.getDiscountApplications(this.transNo),
      )) || [];
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  // Desktop DiscountPersonsUI + DiscountPersonUI: pick a discount not yet applied, then its details
  onClickAddDiscount() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = [
      ['No Discount', ...this.discountApplications.map((x) => x.DiscountName)],
    ];
    this.dialog
      .open(DiscountPersonsUIComponent, dialogConfig)
      .beforeClosed()
      .subscribe((discountPerson) => {
        if (discountPerson) this.openDiscountApplication(discountPerson);
      });
  }

  onClickEditDiscount(discount) {
    this.openDiscountApplication(discount);
  }

  openDiscountApplication(discount) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '700px';
    dialogConfig.maxWidth = '95vw';
    dialogConfig.data = [
      discount,
      this.transNo,
      this.getComputeInputs().PaxCount,
      this.saleHeaderForm.controls['TotalAmount'].value,
      this.saleHeaderForm.controls['VATType'].value,
    ];
    this.dialog
      .open(DiscountApplicationUIComponent, dialogConfig)
      .beforeClosed()
      .subscribe(async (discountApplications) => {
        if (discountApplications) {
          this.discountApplications = discountApplications;
          await this.computeTotalDue();
        }
      });
  }

  async onClickRemoveDiscount(discount) {
    try {
      var res: any = await firstValueFrom(
        this.discountApplicationsService.deleteDiscountApplication(
          this.transNo,
          discount.id,
        ),
      );
      this.notif.toastrSuccess(res.message);
      this.discountApplications = res.discountApplications;
      await this.computeTotalDue();
    } catch (err: any) {
      this.notif.toastrError(err.error?.message);
    }
  }

  // Desktop SaleHeaderUI.btnBillOut_Click: bill out with this dialog's amounts (Re-Print once a bill exists)
  onClickBillOut() {
    this.saleRestaurantService
      .billOut(this.transNo, this.getComputeInputs())
      .subscribe({
        next: (res) => {
          this.notif.toastrSuccess(res.message);
          this.billOutText = 'Re-Print';
          localStorage.setItem(
            'OrderSlip',
            JSON.stringify({
              Type: 'bill',
              BillOut: res.billOut,
              Details: res.saleDetails,
              Reprint: res.reprint,
              Discounts: res.discountApplications,
              MachinePermit: res.machinePermit,
              VendorPermit: res.vendorPermit,
              Config: this.saleConfig,
              FontSize: +this.saleconfigPerMachine?.POSPrinterFontSize || 0,
            }),
          );
          var url = this.router.serializeUrl(
            this.router.createUrlTree(['print/printorderslip']),
          );
          this.printService.popupWindow(url, 'OrderSlip', window, 420, 700);
        },
        error: (err) => this.notif.toastrError(err.error?.message),
      });
  }

  get discountedPax(): number {
    return this.discountApplications.reduce(
      (total, x) => total + (+x.DiscountedPax || 0),
      0,
    );
  }

  displayOrderNo() {
    this.saleHeaderForm.controls['OrderNo'].setValue(this.oHeader.TransNo);
    this.saleHeaderForm.controls['OrderNo'].disable();
    this.saleHeaderForm.controls['DeliveryType'].setValue(
      this.oHeader.DeliveryType,
    );
    this.saleHeaderForm.controls['DeliveryFee'].setValue(
      this.numbersService.Convert2Decimal(this.oHeader.DeliveryFee),
    );
    this.saleHeaderForm.controls['DiscountValue'].setValue(
      this.numbersService.Convert2Decimal(this.oHeader.DiscountValue),
    );
    this.saleHeaderForm.controls['DiscountType'].setValue(
      this.oHeader.DiscountType,
    );
    this.saleHeaderForm.controls['DeliveryDate'].setValue(
      this.dateTimesService.ConvertToDateFormat(this.oHeader.DeliveryDate),
    );
    this.saleHeaderForm.controls['DiscountPerson'].setValue(
      this.oHeader.DiscountPerson,
    );
    this.saleHeaderForm.controls['WHTaxValue'].setValue(
      this.numbersService.Convert2Decimal(this.oHeader.WHTaxValue),
    );
    this.saleHeaderForm.controls['WHTaxType'].setValue(this.oHeader.WHTaxType);
    this.saleHeaderForm.controls['VATType'].setValue(this.oHeader.VATType);
    this.saleHeaderForm.controls['TermDays'].setValue(
      this.numbersService.Convert0Decimal(this.oHeader.TermDays),
    );
    this.saleHeaderForm.controls['Remarks'].setValue(this.oHeader.Remarks);
  }

  async getsaleHeaderForm2() {
    if (this.oHeader != null) {
      this.displayOrderNo();
    }
    this.printReceipt = false;
    this.disablePrintReceipt = true;
    this.recordStatusCashiering = this.saleHeader.RecordStatusCashiering;
    this.displaySaleHeaderValues();
    this.saleHeaderForm.controls['PaxCount'].setValue(
      Math.max(1, +(this.saleHeader.PaxCount || 0)),
    );
    await this.computeTotalDue();
    this.onChangeDeliveryType(this.saleHeader.DeliveryType);
    // await this.onChangePaymentType(this.saleHeader.PaymentType);
    // this.onCheckUseRebate(this.saleHeader.RebatePaid > 0);
  }

  displaySaleHeaderValues() {
    this.saleHeaderForm.controls['id'].setValue(this.saleHeader.id);
    this.saleHeaderForm.controls['TransNo'].setValue(this.saleHeader.TransNo);
    this.saleHeaderForm.controls['CustomerId'].setValue(
      this.saleHeader.CustomerId,
    );
    this.saleHeaderForm.controls['OrderNo'].setValue(this.saleHeader.OrderNo);
    this.saleHeaderForm.controls['CustomerName'].setValue(
      this.saleHeader.CustomerName,
    );
    this.saleHeaderForm.controls['TotalAmount'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.TotalAmount),
    );
    this.saleHeaderForm.controls['DiscountValue'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.DiscountValue),
    );
    this.saleHeaderForm.controls['DiscountType'].setValue(
      this.saleHeader.DiscountType,
    );
    this.saleHeaderForm.controls['WHTaxValue'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.WHTaxValue),
    );
    this.saleHeaderForm.controls['WHTaxType'].setValue(
      this.saleHeader.WHTaxType,
    );
    this.saleHeaderForm.controls['WHTaxAmount'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.WHTaxAmount),
    );
    this.saleHeaderForm.controls['VATAmount'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.VATAmount),
    );
    this.saleHeaderForm.controls['VATType'].setValue(this.saleHeader.VATType);
    this.saleHeaderForm.controls['DeliveryFee'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.DeliveryFee),
    );
    this.saleHeaderForm.controls['PaymentType'].setValue(
      this.saleHeader.PaymentType,
    );
    this.saleHeaderForm.controls['AdvancePayment'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.AdvancePayment),
    );
    this.saleHeaderForm.controls['Change'].setValue(
      this.numbersService.Convert2Decimal(
        +this.saleHeader.AmountPaid - +this.saleHeader.TotalDue,
      ),
    );
    this.saleHeaderForm.controls['CheckNo'].setValue(this.saleHeader.CheckNo);
    this.saleHeaderForm.controls['BankName'].setValue(this.saleHeader.BankName);
    this.saleHeaderForm.controls['CheckDate'].setValue(
      this.saleHeader.CheckDate,
    );
    this.saleHeaderForm.controls['CheckDate2'].setValue(
      this.dateTimesService.ConvertToDateFormat(this.saleHeader.CheckDate2),
    );
    this.saleHeaderForm.controls['Remarks'].setValue(this.saleHeader.Remarks);
    this.saleHeaderForm.controls['InvNo'].setValue(this.saleHeader.InvNo);
    this.saleHeaderForm.controls['VATableAmount'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.VATableAmount),
    );
    this.saleHeaderForm.controls['TermDays'].setValue(
      this.numbersService.Convert0Decimal(this.saleHeader.TermDays),
    );
    this.saleHeaderForm.controls['VATSales'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.VATSales),
    );
    this.saleHeaderForm.controls['VATExemptSales'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.VATExemptSales),
    );
    this.saleHeaderForm.controls['ZeroRatedSales'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.ZeroRatedSales),
    );
    this.saleHeaderForm.controls['NonVATSales'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.NonVATSales),
    );
    this.saleHeaderForm.controls['RebatePaid'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.RebatePaid),
    );
    this.saleHeaderForm.controls['DiscountAmount'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.DiscountAmount),
    );
    this.saleHeaderForm.controls['DiscountValue'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.DiscountValue),
    );
    this.saleHeaderForm.controls['DeliveryDate'].setValue(
      this.dateTimesService.ConvertToDateFormat(this.saleHeader.DeliveryDate),
    );
    this.saleHeaderForm.controls['TransDate'].setValue(
      this.dateTimesService.ConvertToDateFormat(this.saleHeader.TransDate),
    );
    this.saleHeaderForm.controls['DeliveryType'].setValue(
      this.saleHeader.DeliveryType,
    );
    this.saleHeaderForm.controls['DiscountType'].setValue(
      this.saleHeader.DiscountType,
    );
    this.saleHeaderForm.controls['DiscountId'].setValue(
      this.saleHeader.DiscountId,
    );
    this.saleHeaderForm.controls['DiscountPerson'].setValue(
      this.saleHeader.DiscountPerson,
    );
    this.saleHeaderForm.controls['DepositTo'].setValue(
      this.saleHeader.DepositTo,
    );
    this.saleHeaderForm.controls['DepositToCashType'].setValue(
      this.saleHeader.DepositToCashType,
    );
    this.saleHeaderForm.controls['ReferenceNo'].setValue(
      this.saleHeader.ReferenceNo,
    );
    this.saleHeaderForm.controls['LessVAT'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.LessVAT),
    );
    this.saleHeaderForm.controls['ServiceFeeAmount'].setValue(
      this.numbersService.Convert2Decimal(
        this.saleHeader.ServiceFeeAmount || 0,
      ),
    );
    this.saleHeaderForm.controls['ServiceFeeValue'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.ServiceFeeValue || 0),
    );
    this.saleHeaderForm.controls['ServiceFeeType'].setValue(
      (this.saleHeader.ServiceFeeType || 'percent').toLowerCase(),
    );
    this.saleHeaderForm.controls['AmountPaid'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.AmountPaid),
    );

    this.saleHeaderForm.controls['TotalDue'].setValue(
      this.numbersService.Convert2Decimal(this.saleHeader.TotalDue),
    );
    this.saleHeaderForm.controls['CheckId'].setValue(this.saleHeader.CheckId);
    this.saleHeaderForm.controls['CheckNo'].setValue(this.saleHeader.CheckNo);
    this.discountPersonTxt = this.saleHeader.DiscountPerson;

    if (this.saleHeader.PaymentType.toLowerCase() == 'charge') {
      this.saleHeaderForm.controls['TermDays'].enable();
      this.saleHeaderForm.controls['AmountPaid'].disable();
    } else {
      this.saleHeaderForm.controls['TermDays'].disable();
      this.saleHeaderForm.controls['AmountPaid'].enable();
    }
  }

  onChangeDeliveryType(data) {
    if (data.toLowerCase() == 'pickup') {
      this.saleHeaderForm.controls['DeliveryFee'].disable();
      this.saleHeaderForm.controls['DeliveryDate'].disable();
    }
    if (data.toLowerCase() == 'deliver') {
      this.saleHeaderForm.controls['DeliveryDate'].enable();
      this.saleHeaderForm.controls['DeliveryFee'].enable();
    }
  }

  async getcashAccounts() {
    this.cashAccounts = await firstValueFrom(
      this.cashAccountsService.loadCashAccounts(this.paymentType),
    );
  }
  async getBanks() {
    this.banks = await firstValueFrom(this.banksService.getBanks());
  }

  async onChangePaymentType(paymentType) {
    this.paymentType = paymentType.toLowerCase();
    await Promise.all([this.getcashAccounts(), this.getBanks()]);

    if (this.paymentType.toLowerCase() == 'charge') {
      this.saleHeaderForm.controls['DepositTo'].setValue('NA');
    }

    this.ToggleCheck(this.paymentType.toLowerCase() == 'check');
    this.ToggleDepositTo(this.paymentType.toLowerCase() == 'bank deposit');

    if (
      this.paymentType.toLowerCase() == 'check' ||
      this.paymentType.toLowerCase() == 'bank deposit'
    ) {
      this.saleHeaderForm.controls['AmountPaid'].setValue(
        this.saleHeaderForm.controls['TotalDue'].value,
      );
      this.saleHeaderForm.controls['AmountPaid'].disable();
      this.saleHeaderForm.controls['Change'].setValue(
        this.numbersService.Convert2Decimal(0),
      );
    } else this.saleHeaderForm.controls['AmountPaid'].enable();

    this.ToggleTerms(this.paymentType.toLowerCase() == 'charge');
    if (this.paymentType.toLowerCase() == 'charge') {
      this.ToogleChange('Balance');
      this.saleHeaderForm.controls['Change'].setValue(
        this.numbersService.Convert2Decimal(
          this.saleHeaderForm.controls['Change'].value,
        ),
      );
    } else {
      this.ToogleChange('Change');
    }
    if (this.paymentType.toLowerCase() == 'multiple') {
      this.saleHeaderForm.controls['AmountPaid'].disable();
      this.saleHeaderForm.controls['AmountPaid'].setValue(
        this.numbersService.Convert2Decimal(0),
      );

      var data: any = await firstValueFrom(
        this.sharedMultiplePaymentHeadersService.getSharedMultiplePaymentHeadersData(
          this.transNo,
          this.totalAmount,
          this.oHeader,
          this.recordStatusCashiering,
          this.action,
          this.saleHeaderForm.getRawValue(),
        ),
      );
      data.SourceTransName = 'Item Sales';
      data.TransDate = this.dateTimesService.ConvertToDateFormat(
        new Date(data.TransDate),
      );
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '600px';
      dialogConfig.data = [data, 'saleheaderui', 'Save', null, this.btnText];
      this.dialog
        .open(MultiplePaymentUIComponent, dialogConfig)
        .beforeClosed()
        .subscribe((x) => {
          if (x) {
            this.saleHeaderForm.controls['AmountPaid'].setValue(
              this.numbersService.Convert2Decimal(x),
            );
            this.computeTotalDue();
          }
          if (x == false) {
            this.onChangePaymentType(this.saleHeader.PaymentType);
            this.saleHeaderForm.controls['PaymentType'].setValue(
              this.saleHeader.PaymentType,
            );
            this.saleHeaderForm.controls['AmountPaid'].setValue(
              this.numbersService.Convert2Decimal(this.saleHeader.AmountPaid),
            );
            this.computeTotalDue();
          }
        });
    } else if (this.paymentType.toLowerCase() == 'cash') {
      this.saleHeaderForm.controls['AmountPaid'].enable();
      if (this.amountPaid.toString() != '') {
        this.saleHeaderForm.controls['AmountPaid'].setValue(
          this.numbersService.Convert2Decimal(this.amountPaid),
        );
      } else {
        this.saleHeaderForm.controls['AmountPaid'].setValue('');
        this.saleHeaderForm.controls['Change'].setValue('');
      }
    }
  }

  ToggleCheck(value) {
    if (value) {
      this.saleHeaderForm.controls['CheckNo'].enable();
      this.saleHeaderForm.controls['CheckDate'].enable();
      this.saleHeaderForm.controls['BankName'].enable();
      this.requiredCheck = true;
    } else {
      this.saleHeaderForm.controls['CheckNo'].disable();
      this.saleHeaderForm.controls['CheckDate'].disable();
      this.saleHeaderForm.controls['BankName'].disable();
      this.requiredCheck = false;
    }
    this.selectCheck = value;
  }
  ToggleDepositTo(value) {
    if (value) {
      this.saleHeaderForm.controls['DepositTo'].enable();
      this.requiredBank = true;
    } else {
      this.saleHeaderForm.controls['DepositTo'].disable();
      this.requiredBank = false;
    }
  }
  ToggleTerms(value) {
    if (value) {
      this.saleHeaderForm.controls['TermDays'].enable();
      this.saleHeaderForm.controls['AmountPaid'].disable();
    } else {
      this.saleHeaderForm.controls['TermDays'].disable();
      this.saleHeaderForm.controls['AmountPaid'].enable();
    }

    if (value) {
      this.saleHeaderForm.controls['TermDays'].setValue(
        this.numbersService.Convert0Decimal(this.customer.TermDays ?? 0),
      );
      this.saleHeaderForm.controls['AmountPaid'].setValue(
        this.numbersService.Convert2Decimal(0),
      );
    } else {
      this.saleHeaderForm.controls['TermDays'].setValue(
        this.numbersService.Convert0Decimal(0),
      );
      if (this.paymentType.toLowerCase() == 'cash')
        this.saleHeaderForm.controls['AmountPaid'].setValue('');
    }
  }
  ToogleChange(value) {
    this.toggleType = value.toLowerCase();
  }

  // compute = false when the caller recomputes the totals itself right after (form init)
  onCheckUseRebate(value, compute: boolean = true) {
    this.useRebate = value;

    if (this.customer.CustomerId.toLowerCase() == 'cash' && value) {
      this.useRebate = false;
      return this.notif.toastrWarning(
        'RebatePaid not applicable for CASH customer.',
      );
    } else {
      var saleRebate = 0;
      if (this.saleHeader != null) saleRebate = this.saleHeader.RebatePaid;
      var RebatePaid = value ? +this.customer.RemainingRebate + +saleRebate : 0;
      this.saleHeaderForm.controls['RebatePaid'].setValue(
        this.numbersService.Convert2Decimal(RebatePaid),
      );
      if (compute) this.computeTotalDue();
      if (this.useRebate) this.saleHeaderForm.controls['RebatePaid'].enable();
      else this.saleHeaderForm.controls['RebatePaid'].disable();
    }
  }

  async onClickSelectCheck() {
    var customerChecks: any = await firstValueFrom(
      this.customerChecksService.getUnPaidCustomerChecks(
        this.customer.CustomerId,
      ),
    );

    var cC: any = customerChecks.filter(
      (x) =>
        Number(x.Amount).toFixed(2) ==
        Number(this.saleHeaderForm.controls['TotalDue'].value).toFixed(2),
    );
    if (!cC[0]) {
      this.saleHeaderForm.controls['PaymentType'].setValue('CASH');
      this.onChangePaymentType('CASH');
      return this.notif.toastrWarning(
        'No Check Amounting to ' +
          Number(this.saleHeaderForm.controls['TotalDue'].value).toFixed(2),
      );
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '600px';
      dialogConfig.data = [this.customer, 'saleheaderui'];
      this.dialog
        .open(UnpaidCustomerChecksUIComponent, dialogConfig)
        .beforeClosed()
        .subscribe((customerCheck) => {
          if (customerCheck) {
            this.saleHeaderForm.controls['CheckId'].setValue(
              customerCheck.CheckId,
            );
            this.saleHeaderForm.controls['CheckNo'].setValue(
              customerCheck.CheckNo,
            );
            this.saleHeaderForm.controls['CheckDate'].setValue(
              this.dateTimesService.ConvertToDateFormat(
                new Date(customerCheck.CheckDate),
              ),
            );
            this.saleHeaderForm.controls['CheckDate2'].setValue(
              this.dateTimesService.ConvertToDateFormat(
                new Date(customerCheck.CheckDate2),
              ),
            );
            this.saleHeaderForm.controls['BankName'].setValue(
              customerCheck.BankName,
            );
          }
        });
    }
  }

  validateForm() {
    if (
      this.numbersService.isNotGreaterThanOrEqualToZero(
        this.saleHeaderForm.controls['TotalDue'].value.toString(),
      )
    ) {
      return this.notif.toastrWarning(
        'TotalDue is Not Greater Than Or Equal To Zero.',
      );
    }

    if (
      this.saleHeaderForm.controls['CustomerName'].value.toLowerCase() ==
        'cash' &&
      this.saleHeaderForm.controls['PaymentType'].value.toLowerCase() ==
        'charge'
    ) {
      return this.notif.toastrWarning(
        'CASH customer cannot have a payment type of CHARGE.',
      );
    }
    // Desktop: a Senior/PWD discount carries the person's name/ID/TIN, so a CASH customer may have one
    if (this.discountedPax > this.getComputeInputs().PaxCount) {
      return this.notif.toastrWarning(
        'Discounted pax cannot be more than the pax count (' +
          this.getComputeInputs().PaxCount +
          ').',
      );
    }
    if (
      this.saleHeaderForm.controls['PaymentType'].value.toLowerCase() !=
      'charge'
    ) {
      if (
        this.numbersService.AmountPaidIsLessThan(
          this.saleHeaderForm.controls['AmountPaid'].value.toString(),
          this.saleHeaderForm.controls['TotalDue'].value.toString(),
        )
      ) {
        return this.notif.toastrWarning('AmountPaid Is LessThan TotalDue.');
      }
    }
    if (this.useRebate) {
      if (
        +this.customer.RemainingRebate <
        +this.saleHeaderForm.controls['RebatePaid'].value
      ) {
        return this.notif.toastrWarning('Insufficient Remaining Rebate.');
      }
    }

    return this.onSubmit();
  }
  onSubmit() {
    this.loading = true;

    var dates = ['TransDate', 'CheckDate2', 'DeliveryDate'];
    dates.forEach((x) => {
      if (this.saleHeaderForm.controls[x].value != null)
        this.saleHeaderForm.controls[x].setValue(
          this.dateTimesService.ConvertToDateFormat(
            new Date(this.saleHeaderForm.controls[x].value),
          ),
        );
    });

    // if(this.saleHeaderForm.controls['DiscountPerson'].value){
    //   this.data[7]
    // }

    this.saleHeadersService
      .updateSaleHeader(
        this.transNo,
        this.totalAmount,
        this.oHeader,
        this.recordStatusCashiering,
        this.action,
        this.saleHeaderForm.getRawValue(),
      )
      .subscribe({
        next: (res) => {
          var saleHeader = res.saleHeader;
          var saleDetails = res.saleDetails;
          this.printDiscounts = res.discountApplications || [];

          this.notif.toastrSuccess(res.message);
          if (this.action == 'savesalestransaction') {
            if (this.printReceipt) {
              this.print(saleHeader, saleDetails);
            }
            this.displayChange(saleHeader);
          }
          this.dialogRef.close(res.saleHeader);
          this.loading = false;
        },
        error: (err) => {
          this.notif.toastrError(err.error?.message);
          this.loading = false;
          if (this.closeOnError) this.dialogRef.close(null);
        },
      });
  }

  async print(saleHeader, saleDetails) {
    var machinePermit: any = await firstValueFrom(
      this.machinePermitsService.getMachinePermitByComputerName(
        saleHeader.MachineName,
      ),
    );
    var vendorPermit: any = await firstValueFrom(
      this.vendorPermitsService.getVendorPermit(),
    );
    var title = 'SALES INVOICE';
    saleHeader.TotalItems = 0;
    saleDetails.forEach((x) => {
      saleHeader.TotalItems += +x.Qty;
    });

    if ((this.saleconfigPerMachine.Printer || '').toLowerCase() == 'both') {
      this.printBoth(saleHeader, saleDetails, machinePermit, vendorPermit);
    }
    if ((this.saleconfigPerMachine.Printer || '').toLowerCase() == 'pos') {
      this.printPOS(saleHeader, saleDetails, machinePermit, vendorPermit);
    }
    if ((this.saleconfigPerMachine.Printer || '').toLowerCase() == 'ordinary') {
      this.printOrdinary(saleHeader, saleDetails);
    }
  }

  printPOS(saleHeader, saleDetails, machinePermit, vendorPermit) {
    if (saleHeader.BIRRegistered.toLowerCase() == 'no') {
      var url = this.router.serializeUrl(
        this.router.createUrlTree(['print/printpos']),
      );
      var title = 'SALES RECEIPT';
    } else {
      var url = this.router.serializeUrl(
        this.router.createUrlTree(['print/printposbir']),
      );
      title = 'SALES INVOICE';
    }

    localStorage.setItem('Header', JSON.stringify(saleHeader));
    localStorage.setItem('Details', JSON.stringify(saleDetails));
    localStorage.setItem('Discounts', JSON.stringify(this.printDiscounts));
    localStorage.setItem('machinePermit', JSON.stringify(machinePermit));
    localStorage.setItem('vendorPermit', JSON.stringify(vendorPermit));
    localStorage.setItem('Config', JSON.stringify(this.saleConfig));
    localStorage.setItem('Title', title);
    localStorage.setItem('ReceiptType', 'sale');
    localStorage.setItem('Reprint', 'false');
    this.printService.popupWindow(url, 'POSPrint', window, 1000, 700);
  }

  async printOrdinary(saleHeader, saleDetails) {
    if (saleHeader.PaymentType.toLowerCase() == 'multiple')
      var mpHeaders = await firstValueFrom(
        this.multiplePaymentHeadersService.getMultiplePaymentsBySourceTransCode(
          saleHeader.TransNo,
        ),
      );
    else mpHeaders = null;

    var url = this.router.serializeUrl(
      this.router.createUrlTree(['print/printsaledetails']),
    );
    var data = saleDetails.filter(
      (x) => x.TransNo == saleHeader.TransNo && x.RecordStatus == 'open',
    );
    var title = 'SALES INVOICE OF  - ' + saleHeader.TransNo;

    this.printService.popupWindow(url, 'saleDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(saleHeader));
    localStorage.setItem('MPHeader', JSON.stringify(mpHeaders));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('SaleConfig', JSON.stringify(this.saleConfig));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', saleHeader.TransNo);
  }

  async printBoth(
    saleHeader: any,
    saleDetails: any,
    machinePermit: any,
    vendorPermit: any,
  ) {
    this.printPOS(saleHeader, saleDetails, machinePermit, vendorPermit);
    await this.delay(1000);
    await this.printOrdinary(saleHeader, saleDetails);
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  displayChange(saleHeader) {
    if (saleHeader.PaymentType.toLowerCase() != 'charge') {
      if (saleHeader.RecordStatusCashiering.toLowerCase() == 'open') {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '600px';
        dialogConfig.data = [saleHeader, 'sales'];
        this.dialog.open(ChangeUIComponent, dialogConfig);
      } else this.notif.popup('Save', 'Kindly, go to Cashiering.');
    }
  }

  onClickSignatures() {
    if (this.btnText.toLowerCase() == 'update') {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '1000px';
      dialogConfig.data = [this.saleHeader.TransNo, 'SaleHeaders'];
      this.dialog.open(SignaturesUIComponent, dialogConfig);
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '1000px';
      dialogConfig.data = [null, 'SaleHeaders'];
      this.dialog.open(SignaturesUIComponent, dialogConfig);
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onChangePrintReceipt(value) {
    this.printReceipt = value;
    if (value) {
      this.saleHeaderForm.controls['PrintReceipt'].setValue('yes');
    } else {
      this.saleHeaderForm.controls['PrintReceipt'].setValue('no');
    }
  }
}
