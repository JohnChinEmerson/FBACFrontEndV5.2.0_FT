import { environment } from 'src/environments/environment';

export const _url:string = environment.apiUrl;
export const _systemTitle:string = 'Food and Beverage Web Accounting V5.2.0';
export const _codingStandard:string = 'Mariosoft Coding Standard Framework V 3.1.0';



// Kitchen Queue / Sales Transaction kitchen updates: how often the screens poll the queue, and how long a
// "ready to serve" notice stays on the Sales Transaction screen (seconds)
export const _kitchenRefreshMs:number = 10000;
export const _kitchenNoticeSeconds:number = 5;
