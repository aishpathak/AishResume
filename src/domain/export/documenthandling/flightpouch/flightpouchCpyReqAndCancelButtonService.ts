import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { CopyRequestDetails } from "./flightpouch.shared";

@Injectable()
export class flightpouchCpyReqAndCancelButtonService {

  private subject = new BehaviorSubject<any>('');

  /**
    * Get Copy-Request and Cancel-Button Details from FlightPouch Screen To UpdateDocumentScreen
    * and set it in BehaviorSubject object
  */
  sendcpyRqAndCancelButtonDetails(CopyRequestDetails: any) {
    this.subject.next({ cpyReqDetails: CopyRequestDetails });
  }

  /**
   * Send BehaviorSubject object(set with Copy-Request and Cancel-Button Details)
   * to the subscribers
   */
  getcpyRqAndCancelButtonDetails(): Observable<any> {
    return this.subject.asObservable();
  }

}
