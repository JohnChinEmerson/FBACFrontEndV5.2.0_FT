import { CanvassDetailsUIComponent } from '../../Canvassing/canvass-details-ui/canvass-details-ui.component';
import { DeliveryDetailsUIComponent } from '../../Delivery/delivery-details-ui/delivery-details-ui.component';
import { ExpenseDetailsUIComponent } from '../../Expenses/expense-details-ui/expense-details-ui.component';
import { OrderDetailsUIComponent } from '../../Orders/order-details-ui/order-details-ui.component';
import { SupplierPaymentDetailsUIComponent } from '../../Payables/supplier-payment-details-ui/supplier-payment-details-ui.component';
import { PODetailsUIComponent } from '../../Purchasing/podetails-ui/podetails-ui.component';
import { PaymentDetailsUIComponent } from '../../Receivables/payment-details-ui/payment-details-ui.component';
import { ReceivingDetailsUIComponent } from '../../Receiving/receiving-details-ui/receiving-details-ui.component';
import { ReturnToSupplierDetailsUIComponent } from '../../ReturnToSupplier/return-to-supplier-details-ui/return-to-supplier-details-ui.component';
import { SaleDetailsUIComponent } from '../../Sales/sale-details-ui/sale-details-ui.component';
import { SaleReturnDetailsUIComponent } from '../../SaleReturn/sale-return-details-ui/sale-return-details-ui.component';

// What a double-click on a User Activities row opens.
// Key = TransType of the row (App\AppToolBox\ActivityRegistry in the back end). The value is the details dialog the
// module already has; every one of them takes [dateFrom, dateTo, TransNo] and lists the lines of that transaction.
// Anything not listed here (files, cash drawers, vouchers, stock adjustments, logins ...) opens Activity Details.
export const ACTIVITY_OPENERS: { [transType: string]: any } = {
  sale             : SaleDetailsUIComponent,
  receiving        : ReceivingDetailsUIComponent,
  expense          : ExpenseDetailsUIComponent,
  order            : OrderDetailsUIComponent,
  delivery         : DeliveryDetailsUIComponent,
  canvass          : CanvassDetailsUIComponent,
  po               : PODetailsUIComponent,
  payment          : PaymentDetailsUIComponent,
  supplierpayment  : SupplierPaymentDetailsUIComponent,
  salereturn       : SaleReturnDetailsUIComponent,
  returntosupplier : ReturnToSupplierDetailsUIComponent,
};
