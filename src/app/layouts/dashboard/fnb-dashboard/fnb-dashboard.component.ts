import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { firstValueFrom } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { DateRange, DateRangeFilterComponent } from '../../shared/date-range-filter/date-range-filter.component';

// Owner / manager view of the branch: one request (getFnbDashboardByDateRange) fills every card.
// The date range vs the same number of days before it, sales trend, top items, category share, payment types,
// discounts; open orders and low stock are as of now. Refreshes itself every 2 minutes while shown.
@Component({
  selector: 'app-fnb-dashboard',
  templateUrl: './fnb-dashboard.component.html',
  styleUrls: ['./fnb-dashboard.component.css']
})
export class FnbDashboardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() branchId: string;
  Highcharts: typeof Highcharts = Highcharts;
  range       : DateRange = DateRangeFilterComponent.rangeOf('today');
  data        : any = null;
  isLoading   : boolean = false;
  hasError    : boolean = false;
  updateFlag  : boolean = false;
  trendChart  : Highcharts.Options = {};
  categoryChart : Highcharts.Options = {};
  private timer: any;
  private readonly palette = ['#3F51B5', '#26A69A', '#FFA726', '#EF5350', '#AB47BC', '#90A4AE'];

  constructor(
    private dashboardService: DashboardService,
    private dateTimesService: DateTimesService,
  ) { }

  ngOnInit(): void {
    this.load();
    this.timer = setInterval(() => this.load(true), 120000);
  }

  ngOnChanges(): void {
    if (this.data || this.isLoading) this.load();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  onRangeChange(range: DateRange){
    this.range = range;
    this.load();
  }

  // silent: background refresh, the cards stay as they are while loading
  async load(silent: boolean = false){
    if (!silent) this.isLoading = true;
    try {
      this.data = await firstValueFrom(this.dashboardService.getFnbDashboardByDateRange(
          this.dateTimesService.ConvertToDateFormat(this.range.from),
          this.dateTimesService.ConvertToDateFormat(this.range.to),
          this.branchId));
      this.hasError = false;
      this.buildCharts();
    } catch (e) {
      if (!silent) this.hasError = true;
    } finally {
      this.isLoading = false;
    }
  }

  // % change of the range against the days before it; null when those had nothing to compare with
  change(current: number, previous: number){
    if (!previous) return null;
    return ((current - previous) / Math.abs(previous)) * 100;
  }

  get periodLabel(){
    var preset = { today: 'Today', week: 'This Week', month: 'This Month' }[this.range.preset];
    if (preset) return preset;
    var format = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    return this.range.from.getTime() == this.range.to.getTime() ? format(this.range.from) : format(this.range.from) + ' – ' + format(this.range.to);
  }

  // what the % change compares with, and the text when that had no sales
  get compareLabel(){
    if (this.range.preset == 'today') return 'vs yesterday';
    var days = this.data?.days || 1;
    return days == 1 ? 'vs the day before' : 'vs the ' + days + ' days before';
  }

  get noCompareLabel(){
    if (this.range.preset == 'today') return 'No sales yesterday';
    var days = this.data?.days || 1;
    return days == 1 ? 'No sales the day before' : 'No sales in the ' + days + ' days before';
  }

  share(amount: number, rows: any[]){
    var total = (rows || []).reduce((t, r) => t + (+r.Amount || 0), 0);
    return total > 0 ? (amount / total) * 100 : 0;
  }

  get hasTrend(){
    return (this.data?.trend || []).some(p => p.sales != 0 || p.count != 0);
  }

  private buildCharts(){
    var trend = this.data?.trend || [];
    var byMonth = this.data?.trendUnit == 'month';
    var labels = trend.map(p => {
      var d = new Date(p.date + 'T00:00:00');
      return byMonth ? d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    });
    this.trendChart = {
      chart: { type: 'areaspline', height: 260, style: { fontFamily: 'inherit' } },
      title: { text: null },
      credits: { enabled: false },
      exporting: { enabled: false },
      accessibility: { enabled: false },
      legend: { enabled: false },
      xAxis: { categories: labels, tickmarkPlacement: 'on', labels: { step: Math.max(1, Math.ceil(trend.length / 7)), rotation: 0 } },
      yAxis: { title: { text: null }, min: 0, gridLineColor: '#eef0f4' },
      tooltip: {
        shared: true,
        pointFormatter: function(){
          var p: any = this;
          return 'Sales: <b>' + Highcharts.numberFormat(p.y, 2) + '</b><br/>Transactions: <b>' + trend[p.index].count + '</b>';
        }
      },
      plotOptions: { areaspline: { fillOpacity: 0.15, marker: { radius: 3 } } },
      series: [{ type: 'areaspline', name: 'Sales', color: '#3F51B5', data: trend.map(p => p.sales) }],
    };
    var categories = this.data?.categories || [];
    this.categoryChart = {
      chart: { type: 'pie', height: 260, style: { fontFamily: 'inherit' } },
      title: { text: null },
      credits: { enabled: false },
      exporting: { enabled: false },
      accessibility: { enabled: false },
      colors: this.palette,
      tooltip: { pointFormat: '<b>{point.y:,.2f}</b> ({point.percentage:.1f}%)' },
      plotOptions: { pie: { innerSize: '60%', dataLabels: { enabled: false }, showInLegend: true } },
      legend: { itemStyle: { fontWeight: '600' } },
      series: [{ type: 'pie', name: 'Sales', data: categories.map(c => ({ name: c.Category, y: c.Amount })) }],
    };
    this.updateFlag = true;
  }

  trackByIndex(index: number){
    return index;
  }
}
