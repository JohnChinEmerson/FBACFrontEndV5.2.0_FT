import { UserActivitiesComponent } from './user-activities.component';
import { ActivityDetailsUIComponent } from './activity-details-ui/activity-details-ui.component';
import { ACTIVITY_OPENERS } from './activity-openers';
import { SaleDetailsUIComponent } from '../../Sales/sale-details-ui/sale-details-ui.component';
import { ReceivingDetailsUIComponent } from '../../Receiving/receiving-details-ui/receiving-details-ui.component';

describe('UserActivitiesComponent', () => {
  let component: UserActivitiesComponent;
  let opened: { component: any, config: any }[];

  const saleRow = { id: 'Rsale|SL1|CREATE', TransType: 'sale', RefNo: 'SL1', RecordStatus: 'open', Kind: 'transaction' };

  beforeEach(() => {
    opened = [];
    const dialog: any = { open: (c: any, config: any) => { opened.push({ component: c, config }); return {}; } };
    const auth: any = { Branch: { BranchId: 'b01' } };
    // only the services onDoubleClick / displayRecords use are real; the rest of the constructor is not touched
    component = new UserActivitiesComponent(
      null, null, null, null, auth, null, null, null, null, dialog, { } as any);
    component.loadedBranchId = 'b01';
    component.TransDateFrom  = new Date(2026, 10, 1);
    component.TransDateTo    = new Date(2026, 10, 7);
  });

  it('opens the details dialog of the module for a transaction of the branch of the login', () => {
    component.onDoubleClick(saleRow);
    expect(opened.length).toBe(1);
    expect(opened[0].component).toBe(SaleDetailsUIComponent);
    expect(opened[0].config.data[2]).toBe('SL1');
  });

  it('opens the dialog that belongs to each kind of transaction', () => {
    component.onDoubleClick({ ...saleRow, TransType: 'receiving', RefNo: 'RR1' });
    expect(opened[0].component).toBe(ReceivingDetailsUIComponent);
    expect(Object.keys(ACTIVITY_OPENERS).sort()).toEqual([
      'canvass', 'delivery', 'expense', 'order', 'payment', 'po', 'receiving', 'returntosupplier', 'sale',
      'salereturn', 'supplierpayment'
    ]);
  });

  it('opens Activity Details when there is no module dialog, no reference, or the record is deleted', () => {
    component.onDoubleClick({ id: 'L1', Kind: 'system', Action: 'Login' });
    component.onDoubleClick({ ...saleRow, TransType: 'item', RefNo: '10' });
    component.onDoubleClick({ ...saleRow, RecordStatus: 'deleted' });
    expect(opened.map(o => o.component)).toEqual([ActivityDetailsUIComponent, ActivityDetailsUIComponent, ActivityDetailsUIComponent]);
  });

  it('opens Activity Details for a record of another branch (the module dialogs read the branch of the login)', () => {
    component.loadedBranchId = 'b02';
    component.onDoubleClick(saleRow);
    expect(opened[0].component).toBe(ActivityDetailsUIComponent);
    expect(opened[0].config.data[2]).toBeFalse();
  });

  it('filters the list by type and module', () => {
    component.UserActivities = [
      { id: 1, Kind: 'transaction', Module: 'Sales',     FullName: 'A', AccessRight: 'x', Action: 'CREATE' },
      { id: 2, Kind: 'file',        Module: 'Item',      FullName: 'A', AccessRight: 'x', Action: 'CREATE' },
      { id: 3, Kind: 'system',      Module: 'MARIOSOFT', FullName: 'A', AccessRight: 'x', Action: 'Login' },
    ];
    component.SelectedType = 'Transactions';
    component.displayRecords();
    expect(component.listData.data.map(d => d.id)).toEqual([1]);
    component.SelectedType = 'ALL';
    component.SelectedModule = 'Item';
    component.displayRecords();
    expect(component.listData.data.map(d => d.id)).toEqual([2]);
  });
});
