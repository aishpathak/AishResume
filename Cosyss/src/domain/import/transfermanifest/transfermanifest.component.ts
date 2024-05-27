import { SelectedUld } from './../import.sharedmodel';
import { element } from 'protractor';
import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ChangeDetectorRef,
  QueryList, Pipe, ViewChild, AfterViewInit, OnInit,
} from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import 'rxjs';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SearchTransferManifest, TransferManifestDetails
} from '../import.sharedmodel';


// Application
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcReportComponent,
  NotificationMessage, StatusMessage, CellsRendererStyle,
  DropDownListRequest, MessageType, NgcCheckBoxComponent,
  NgcUtility, PageConfiguration, NgcWindowComponent,
  ReactiveModel, NgcDataTableComponent, NgcControl
} from 'ngc-framework';
import { ImportService } from '../import.service';

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

@Component({
  selector: 'app-transfermanifest',
  templateUrl: './transfermanifest.component.html',
  styleUrls: ['./transfermanifest.component.css']
})
export class TransfermanifestComponent extends NgcPage {
  @ViewChild("transferMenifestWindow") transferMenifestWindow: NgcReportComponent;
  reportParams: any = new Object();


  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private activatedRoute: ActivatedRoute, private router: Router, private importService: ImportService) {
    super(appZone, appElement, appContainerElement);
  }
  showFlag: boolean = false;
  carrier: any;
  searchResp: any;
  trans: any;
  isNext: boolean = false;
  showTable: boolean = false;
  tempTransferManifestDetails: any;
  showCreateTM: boolean = true;
  showPrint: boolean = false;
  dataToPatch: any;
  mailbagHandover = false;
  enableTMPrint = false;

  private transferManifestForm: NgcFormGroup = new NgcFormGroup({

    incomingCarrier: new NgcFormControl(''),
    transferCarrier: new NgcFormControl(''),
    destination: new NgcFormControl(''),
    dispatchNumber: new NgcFormControl(''),
    transferManifestDetails: new NgcFormArray([]),
  });


  ngOnInit() {
  }

  onSearch(event, index) {
    this.enableTMPrint = false;
    this.isNext = false;
    this.showTable = false;
    (<NgcFormArray>this.transferManifestForm.controls['transferManifestDetails']).resetValue([]);
    this.carrier = this.transferManifestForm.get('incomingCarrier').value;
    const req: SearchTransferManifest = new SearchTransferManifest();
    req.incomingCarrier = this.transferManifestForm.get('incomingCarrier').value;
    req.transferCarrier = this.transferManifestForm.get('transferCarrier').value;
    req.destination = this.transferManifestForm.get('destination').value;
    req.dispatchNumber = this.transferManifestForm.get('dispatchNumber').value;
    this.importService.fetchTransferManifestDetails(req).subscribe(data => {
      if (!data.messageList) {
        if (data.data.length != 0) {
          this.searchResp = data.data;
          this.showFlag = true;
          this.isNext = true;
          this.showTable = true;
          (<NgcFormArray>this.transferManifestForm.get(['transferManifestDetails'])).patchValue(this.searchResp);
          this.resetFormMessages();
        }

        else {
          this.showInfoStatus("no.record.found");
          (<NgcFormArray>this.transferManifestForm.controls['transferManifestDetails']).resetValue([]);
          this.showFlag = true;
          this.isNext = false;
          this.showTable = false;
          this.resetFormMessages();
        }
      }
      else if (data.messageList) {
        this.refreshFormMessages(data);
        (<NgcFormArray>this.transferManifestForm.controls['transferManifestDetails']).resetValue([]);
      }
    });

  }


  onsave(item) {
    this.showCreateTM = false;
    this.showPrint = true;
    this.trans = new Array();
    let index = 0;
    let req = (<NgcFormArray>this.transferManifestForm.get(['transferManifestDetails'])).getRawValue();
    this.importService.saveTransferManifestDetails(req).subscribe(response => {
      this.refreshFormMessages(response);
      if (response.data != null) {
        this.enableTMPrint = true;
        this.mailbagHandover = true;
        this.resetFormMessages();
        this.showSuccessStatus('g.completed.successfully');
        this.onPrint();
        return;
      }
    }, error => {
        this.showErrorMessage(error);
    });
  }

  onNext(item) {
    this.isNext = false;
    this.showCreateTM = true;
    this.showPrint = false;
    this.trans = new Array();
    let index = 0;
    let req = (<NgcFormArray>this.transferManifestForm.get(['transferManifestDetails'])).getRawValue();
    this.tempTransferManifestDetails = req;
    const tempArray: any = new Array<TransferManifestDetails>();
    req.forEach(e => {
      e.transferCarrierDetails.forEach(e1 => {
        if (e1.select) {
          e1.select = e.select;
          e1.transferCarrier = e.transferCarrier;
          e1.origin = e.origin;
          e1.destination = e.destination;
          e1.dispatchNumber = e.dispatchNumber;
          tempArray.push(e1);
          this.trans.push(index);
        }
      });
      index++;
    });
    if (tempArray.length === 0) {
      this.showErrorStatus("imp.err134");
      this.isNext = true;
    } else {
      (<NgcFormArray>this.transferManifestForm.get(['transferManifestDetails'])).patchValue(tempArray);
      this.resetFormMessages();
    }
  }




  onBack() {
    this.enableTMPrint = false;
    if (this.mailbagHandover) {
      this.carrier = this.transferManifestForm.get('incomingCarrier').value;
      const req: SearchTransferManifest = new SearchTransferManifest();
      req.incomingCarrier = this.transferManifestForm.get('incomingCarrier').value;
      req.transferCarrier = this.transferManifestForm.get('transferCarrier').value;
      req.destination = this.transferManifestForm.get('destination').value;
      req.dispatchNumber = this.transferManifestForm.get('dispatchNumber').value;
      this.importService.fetchTransferManifestDetails(req).subscribe(data => {
        if (!data.messageList) {
          if (data.data.length != 0) {
            this.searchResp = data.data;
            this.showFlag = true;
            this.isNext = true;
            this.showTable = true;
            (<NgcFormArray>this.transferManifestForm.get(['transferManifestDetails'])).patchValue(this.searchResp);
            this.resetFormMessages();
          } else {
            this.showInfoStatus("no.record.found");
            (<NgcFormArray>this.transferManifestForm.controls['transferManifestDetails']).resetValue([]);
            this.showFlag = true;
            this.isNext = false;
            this.showTable = false;
            this.resetFormMessages();
          }

        }
      })
      this.mailbagHandover = false;
    }
    else {
      (<NgcFormArray>this.transferManifestForm.get(['transferManifestDetails'])).patchValue(this.tempTransferManifestDetails);
      this.resetFormMessages();
      this.isNext = true;
    }
  }

  onPrint() {
    // this.showCreateTM = true;
    this.showConfirmMessage('want.to.print.mailbags').then(fulfilled => {
      this.reportParams.carrierCodeFrom = this.transferManifestForm.get('incomingCarrier').value;
      this.reportParams.carrierCodeTo = this.transferManifestForm.get('transferCarrier').value;
      this.reportParams.destination = this.transferManifestForm.get('destination').value;
      this.reportParams.dispatchNumber = this.transferManifestForm.get('dispatchNumber').value;
      this.transferMenifestWindow.open();
    })
  }



  onCheckBox(data) {
    var st = (<NgcFormArray>this.transferManifestForm.get(['transferManifestDetails'])).getRawValue();
    st.forEach(e1 => {

      if (e1.select == true) {
        e1.transferCarrierDetails.forEach(e2 => {
          e2.select = true;
        });
      } else if (e1.select == false) {
        e1.transferCarrierDetails.forEach(e2 => {
          e2.select = false;
        });
      }
    });
    (<NgcFormArray>this.transferManifestForm.get(['transferManifestDetails'])).patchValue(st);
  }

}


