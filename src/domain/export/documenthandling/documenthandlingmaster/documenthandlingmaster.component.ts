import { DocumentService } from './../document/document.service';
import {
  BaseResponse, NgcFormGroup, NgcFormArray, NgcFormControl,
  NotificationMessage, StatusMessage, MessageType, DropDownListRequest, NgcPage, PageConfiguration, NgcWindowComponent
} from 'ngc-framework';

import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, OnInit, HostListener, OnDestroy, ViewChild
} from '@angular/core';

import {
  DocumenthandlingmasterRequest, DocumenthandlingmasterResultBO,
  DocumenthandlingmasterResponseData, LocationConfigResultBO
} from '../document/document.sharedmodel';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-documenthandlingmaster',
  templateUrl: './documenthandlingmaster.component.html',
  styleUrls: ['./documenthandlingmaster.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  // restorePageOnBack: true
})

export class DocumenthandlingmasterComponent extends NgcPage implements OnInit {
  previousRoute: any;
  showData: boolean = false;
  // flightType: any[] = [{ "code": "C", "desc": "C" }, { "code": "P", "desc": "P" }];
  // yesNo: any[] = [{ "code": "Y", "desc": "Yes" }, { "code": "N", "desc": "No" }];
  // offices: any[] = [{ "code": "T3", "desc": "T3" }, { "code": "T5", "desc": "T5" }];

  @ViewChild('editWindow') editWindow: NgcWindowComponent;

  private form: NgcFormGroup = new NgcFormGroup({
    office: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    resultList: new NgcFormArray([]),
  });

  private editForm: NgcFormGroup = new NgcFormGroup({
    slaId: new NgcFormControl(),
    flightCarrier: new NgcFormControl(),
    office: new NgcFormControl(),
    paxFreighter: new NgcFormControl(),
    veriRequired: new NgcFormControl(),
    nilPouchRequired: new NgcFormControl(),
    lblPrintRed: new NgcFormControl(),
    lblPrintOrg: new NgcFormControl(),
    docReceivedRed: new NgcFormControl(),
    docReceivedOrg: new NgcFormControl(),
    maniFinalRed: new NgcFormControl(),
    maniFinalOrg: new NgcFormControl(),
    dlsFinalRed: new NgcFormControl(),
    dlsFinalOrg: new NgcFormControl(),
    pouchStartRed: new NgcFormControl(),
    pouchStartOrg: new NgcFormControl(),
    pouchCompRed: new NgcFormControl(),
    pouchCompOrg: new NgcFormControl(),
    chkoutRed: new NgcFormControl(),
    chkoutOrg: new NgcFormControl(),
    deliACRed: new NgcFormControl(),
    deliACOrg: new NgcFormControl(),
    pouchStartX: new NgcFormControl(),
    reVerificationX: new NgcFormControl(),
    notifyFltDisc: new NgcFormControl(),
    dlvTo1: new NgcFormControl(),
    dlvTo2: new NgcFormControl(),
    dlvTo3: new NgcFormControl()
  })

  ngOnInit() {
    super.ngOnInit();
  }

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private documentService: DocumentService, private router: Router) {
    super(appZone, appElement, appContainerElement);
    this.previousRoute = sessionStorage.getItem('previousRoute');
    console.log('DOC HANDLING MASTER : ' + this.previousRoute);
    sessionStorage.setItem('previousRoute', this.router.url);
  }

  onSearch() {
    if (this.form.get('office').value == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.form.get("office"), "Mandatory");
      return;
    }
    let request: DocumenthandlingmasterResultBO = new DocumenthandlingmasterResultBO();
    request.carrierCode = this.form.get('carrierCode').value;
    request.office = this.form.get('office').value;
    this.resetFormMessages();
    this.documentService.getDocumentHandlingMaster(request).subscribe(responseBean => {
      this.form.controls["resultList"].patchValue(responseBean.data);
      (<NgcFormArray>this.form.get("resultList")).controls.forEach((item, i) => {
        if (item.get('dlvTo1').value.includes(",")) {
          (<NgcFormGroup>(<NgcFormArray>this.form.controls.resultList).controls[i]).get('dlvTo2').patchValue(item.get('dlvTo1').value.split(',')[1]);
          (<NgcFormGroup>(<NgcFormArray>this.form.controls.resultList).controls[i]).get('dlvTo3').patchValue(item.get('dlvTo1').value.split(',')[2]);
          (<NgcFormGroup>(<NgcFormArray>this.form.controls.resultList).controls[i]).get('dlvTo1').patchValue(item.get('dlvTo1').value.split(',')[0]);
        }
      });
      this.showData = true;
    }, error => {
      this.showErrorStatus("export.unable.fetch.details");
    });
  }

  onUpdate() {
    let dlv = "";
    let docMasterList: DocumenthandlingmasterResultBO[] = [];
    let docMaster: DocumenthandlingmasterResultBO = new DocumenthandlingmasterResultBO();
    let request = this.editForm.getRawValue();

    if (request.flightCarrier == null) {
      this.showErrorStatus("export.select.carrier");
      return;
    }
    if (request.office == null) {
      this.showErrorStatus("export.select.office");
      return;
    }
    if (request.paxFreighter == null) {
      this.showErrorStatus("export.select.pax.frtr");
      return;
    }
    if (request.veriRequired == null) {
      this.showErrorStatus("export.select.verify");
      return;
    }
    if (request.nilPouchRequired == null) {
      this.showErrorStatus("export.select.nilpouch");
      return;
    }
    if (request.notifyFltDisc == null) {
      this.showErrorStatus("export.select.notify.disc");
      return;
    }

    if (request.slaId)
      docMaster.action = 'U';
    else
      docMaster.action = 'C';

    docMaster.slaId = request.slaId;
    docMaster.flightCarrier = request.flightCarrier;
    docMaster.carrierName = request.carrierName;
    docMaster.office = request.office;
    docMaster.paxFreighter = request.paxFreighter;
    docMaster.veriRequired = request.veriRequired == 'Y' ? '1' : '0';
    docMaster.nilPouchRequired = request.nilPouchRequired == 'Y' ? '1' : '0';
    docMaster.lblPrintRed = request.lblPrintRed;
    docMaster.lblPrintOrg = request.lblPrintOrg;
    docMaster.docReceivedRed = request.docReceivedRed;
    docMaster.docReceivedOrg = request.docReceivedOrg;
    docMaster.maniFinalRed = request.maniFinalRed;
    docMaster.maniFinalOrg = request.maniFinalOrg;
    docMaster.dlsFinalRed = request.dlsFinalRed;
    docMaster.dlsFinalOrg = request.dlsFinalOrg;
    docMaster.pouchStartRed = request.pouchStartRed;
    docMaster.pouchStartOrg = request.pouchStartOrg;
    docMaster.pouchCompRed = request.pouchCompRed;
    docMaster.pouchCompOrg = request.pouchCompOrg;
    docMaster.pouchReadyRed = request.pouchReadyRed;
    docMaster.pouchReadyOrg = request.pouchReadyOrg;
    docMaster.chkoutRed = request.chkoutRed;
    docMaster.chkoutOrg = request.chkoutOrg;
    docMaster.deliACRed = request.deliACRed;
    docMaster.deliACOrg = request.deliACOrg;
    docMaster.pouchStartX = request.pouchStartX;
    docMaster.reVerificationX = request.reVerificationX;
    docMaster.notifyFltDisc = request.notifyFltDisc == 'Y' ? '1' : '0';

    dlv = "";
    if (request.dlvTo1 != null && request.dlvTo1 != undefined && request.dlvTo1 != 'undefined') {
      dlv += request.dlvTo1;
    }
    if (request.dlvTo2 != null && request.dlvTo2 != undefined && request.dlvTo2 != 'undefined') {
      if (dlv != '') {
        dlv += "," + request.dlvTo2;
      } else {
        dlv += request.dlvTo2;
      }
    }
    if (request.dlvTo3 != null && request.dlvTo3 != undefined && request.dlvTo3 != 'undefined') {
      if (dlv != '') {
        dlv += "," + request.dlvTo3;
      } else {
        dlv += request.dlvTo3;
      }
    }
    docMaster.dlvTo = dlv;
    docMaster.dlvTo1 = request.dlvTo1;
    docMaster.dlvTo2 = request.dlvTo2;
    docMaster.dlvTo3 = request.dlvTo3;
    docMasterList.push(docMaster);
    // console.log(JSON.stringify(docMasterList));
    this.documentService.updateDocumentHandlingMaster(docMasterList).subscribe(responseBean => {
      this.onSearch();
      this.editWindow.hide();
      this.showSuccessStatus("g.updated.successfully");
      this.editForm.reset();
    }, error => {
      this.showErrorStatus("export.unable.update.details");
    });
  }

  onDelete() {
    // (this.form.get(["resultList", index]) as NgcFormGroup).markAsDeleted();
    let docMasterList: DocumenthandlingmasterResultBO[] = [];
    let docMaster: DocumenthandlingmasterResultBO = null;
    let i: any = 0;
    for (let obj of this.form.controls.resultList.value) {
      if (obj.sel) {
        ++i;
        docMaster = new DocumenthandlingmasterResultBO();
        docMaster.action = 'D';
        docMaster.slaId = obj.slaId;
        docMaster.flightCarrier = obj.flightCarrier;
        docMaster.office = obj.office;
        docMaster.paxFreighter = obj.paxFreighter;
        docMaster.veriRequired = obj.veriRequired == 'Y' ? '1' : '0';
        docMaster.nilPouchRequired = obj.nilPouchRequired == 'Y' ? '1' : '0';
        docMaster.lblPrintRed = obj.lblPrintRed;
        docMaster.lblPrintOrg = obj.lblPrintOrg;
        docMaster.docReceivedRed = obj.docReceivedRed;
        docMaster.docReceivedOrg = obj.docReceivedOrg;
        docMaster.maniFinalRed = obj.maniFinalRed;
        docMaster.maniFinalOrg = obj.maniFinalOrg;
        docMaster.dlsFinalRed = obj.dlsFinalRed;
        docMaster.dlsFinalOrg = obj.dlsFinalOrg;
        docMaster.pouchStartRed = obj.pouchStartRed;
        docMaster.pouchStartOrg = obj.pouchStartOrg;
        docMaster.pouchCompRed = obj.pouchCompRed;
        docMaster.pouchCompOrg = obj.pouchCompOrg;
        docMaster.pouchReadyRed = obj.pouchReadyRed;
        docMaster.pouchReadyOrg = obj.pouchReadyOrg;
        docMaster.chkoutRed = obj.chkoutRed;
        docMaster.chkoutOrg = obj.chkoutOrg;
        docMaster.deliACRed = obj.deliACRed;
        docMaster.deliACOrg = obj.deliACOrg;
        docMaster.pouchStartX = obj.pouchStartX;
        docMaster.reVerificationX = obj.reVerificationX;
        docMaster.notifyFltDisc = obj.notifyFltDisc == 'Y' ? '1' : '0';
        // docMaster.dlvTo = dlv;
        docMaster.dlvTo1 = obj.dlvTo1;
        docMaster.dlvTo2 = obj.dlvTo2;
        docMaster.dlvTo3 = obj.dlvTo3;
        docMasterList.push(docMaster);
      }
    }
    if (i == 0) {
      this.showErrorStatus("export.select.atleast.one.carrier");
      return;
    }
    this.documentService.updateDocumentHandlingMaster(docMasterList).subscribe(responseBean => {
      this.onSearch();
      this.showSuccessStatus("g.deleted.successfully");
    }, error => {
      this.showErrorStatus("export.unable.delete.details");
    });
  }

  onEditAndAdd(index) {
    this.editForm.reset();
    let data = this.form.get(['resultList', index]);
    if (data) {
      this.editForm.get('slaId').setValue(data.get('slaId').value);
      this.editForm.get('flightCarrier').setValue(data.get('flightCarrier').value);
      this.editForm.get('office').patchValue(data.get('office').value);
      this.editForm.get('paxFreighter').setValue(data.get('paxFreighter').value);
      this.editForm.get('veriRequired').setValue(data.get('veriRequired').value);
      this.editForm.get('nilPouchRequired').setValue(data.get('nilPouchRequired').value);
      this.editForm.get('lblPrintRed').patchValue(data.get('lblPrintRed').value);
      this.editForm.get('lblPrintOrg').setValue(data.get('lblPrintOrg').value);
      this.editForm.get('docReceivedRed').setValue(data.get('docReceivedRed').value);
      this.editForm.get('docReceivedOrg').setValue(data.get('docReceivedOrg').value);
      this.editForm.get('maniFinalRed').setValue(data.get('maniFinalRed').value);
      this.editForm.get('maniFinalOrg').patchValue(data.get('maniFinalOrg').value);
      this.editForm.get('dlsFinalRed').setValue(data.get('dlsFinalRed').value);
      this.editForm.get('dlsFinalOrg').setValue(data.get('dlsFinalOrg').value);
      this.editForm.get('pouchStartRed').setValue(data.get('pouchStartRed').value);
      this.editForm.get('pouchStartOrg').setValue(data.get('pouchStartOrg').value);
      this.editForm.get('pouchCompRed').patchValue(data.get('pouchCompRed').value);
      this.editForm.get('pouchCompOrg').setValue(data.get('pouchCompOrg').value);
      this.editForm.get('chkoutRed').setValue(data.get('chkoutRed').value);
      this.editForm.get('chkoutOrg').setValue(data.get('chkoutOrg').value);
      this.editForm.get('deliACRed').setValue(data.get('deliACRed').value);
      this.editForm.get('deliACOrg').patchValue(data.get('deliACOrg').value);
      this.editForm.get('pouchStartX').setValue(data.get('pouchStartX').value);
      this.editForm.get('reVerificationX').setValue(data.get('reVerificationX').value);
      this.editForm.get('notifyFltDisc').setValue(data.get('notifyFltDisc').value);
      this.editForm.get('dlvTo1').setValue(data.get('dlvTo1').value);
      this.editForm.get('dlvTo2').setValue(data.get('dlvTo2').value);
      this.editForm.get('dlvTo3').setValue(data.get('dlvTo3').value);
    }
    this.editWindow.open();
  }


}