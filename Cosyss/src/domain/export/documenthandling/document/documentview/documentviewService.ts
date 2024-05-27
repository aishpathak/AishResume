import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class DocumentviewService {


  private subject = new Subject<any>();

  sendAwbToUpdateDocument(awbPassedFromDocumentView: any) {
    console.log('Inside @Injected Service : AWB Passed from DocView' + awbPassedFromDocumentView);
    this.subject.next({ awb: awbPassedFromDocumentView });
  }

  getAwb(): Observable<any> {
    return this.subject.asObservable();
  }

}
