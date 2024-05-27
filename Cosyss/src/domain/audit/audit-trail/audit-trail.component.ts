import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ChangeDetectorRef,
  ViewChild,
  Directive
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcButtonComponent,
  PageConfiguration,
  NgcUtility,
  NgcWindowComponent,
  NgcPopoverComponent,
  CellsRendererStyle
} from "ngc-framework";
import { AuditService } from "./../audit.service";
import {
  AuditRequest
} from './../audit.sharedmodel';
import { Validators } from "@angular/forms";
import { CellsStyleClass } from '../../../shared/shared.data';

@Component({
  selector: 'ngc-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  // autoBackNavigation: true,
  restorePageOnBack: true
})

export class AuditTrailComponent extends NgcPage implements OnInit {
  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  eventData = [];
  eventDetails = new Array();
  flagToDisplayData: boolean = false;
  // @ViewChild('popupChild') popupChild: NgcPopoverComponent;
  @ViewChild('windowComponent') windowComponent: NgcWindowComponent;
  auditListDataResponse: any;
  getTransferredData: any;
  showuldNumber = false;
  showflightInput = false;
  showShipmentNumber = false;
  showAWBFields = true;
  showFlightRelatedField = true;
  showUldRelatedField = true;
  customerFlag = false;
  modifiedAuditList: any;
  newAudits: boolean = false;
  isAvailableForNewImplementation = false;
  showMailBagNumber = false;
  appendTabSpace = "&nbsp;&nbsp;&nbsp;&nbsp;";
  mandatoryFields: boolean = false;
  showEventType: boolean = true;
  showLocationInput: boolean = false;
  indexnumber: any;
  showCPE: boolean = false;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private auditService: AuditService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private auditForm: NgcFormGroup = new NgcFormGroup({
    fromDate: new NgcFormControl(''),
    toDate: new NgcFormControl(),
    user: new NgcFormControl(),
    entityType: new NgcFormControl(),
    entityValue: new NgcFormControl(),
    eventType: new NgcFormControl(),
    auditList: new NgcFormArray([]),
    sno: new NgcFormControl(),
    //added on 23JAN19
    shipmentNumber: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    mailbagNumber: new NgcFormControl(),
    warehouseLocation: new NgcFormControl(),
    displayInformation: new NgcFormControl(),
    entityDataArray: new NgcFormArray([]),
    entityAttributes: new NgcFormControl(),
    popupevents: new NgcFormControl(),
    popupusers: new NgcFormControl(),
    popupdatetime: new NgcFormControl()
  })

  ngOnInit() {

    this.showuldNumber = false;
    this.showflightInput = false;
    this.showShipmentNumber = false;
    this.showCPE = false;
    this.auditForm.get('entityType').setValidators([Validators.required]);
    this.getTransferredData = this.getNavigateData(this.activatedRoute);
    if (this.getTransferredData) {
      if (this.getTransferredData.entityType === 'AWB') {
        this.auditForm.get('shipmentNumber').setValue(this.getTransferredData.entityValue);
        this.auditForm.get('flightKey').setValue(null);
        this.auditForm.get('flightDate').setValue(null)
        this.auditForm.get('uldNumber').setValue(null)
        this.showuldNumber = false;
        this.showflightInput = false;
        this.showMailBagNumber = false;
        this.showShipmentNumber = true;
      }
      this.auditForm.get('fromDate').patchValue(NgcUtility.addDate(this.getTransferredData.fromDate, -1, 'd'));
      this.auditForm.get('toDate').patchValue(NgcUtility.addDate(this.getTransferredData.toDate, 1, 'd'));
      this.auditForm.get('entityValue').patchValue(this.getTransferredData.entityValue);
      this.auditForm.get('entityType').patchValue(this.getTransferredData.entityType);
      if (this.getTransferredData.entityType == 'ULD') {
        this.showMailBagNumber = false;
        this.showuldNumber = true;
        this.auditForm.get('uldNumber').setValue(this.getTransferredData.entityValue);
      }
      this.onSearch();
    }
    this.auditForm.get('entityType').valueChanges.subscribe(response => {
      if (response) {
        if (response === 'AWB') {
          this.auditForm.get('shipmentNumber').setValidators([Validators.required]);
          this.auditForm.get('flightKey').clearValidators();
          this.auditForm.get('flightDate').clearValidators();
          this.auditForm.get('uldNumber').clearValidators();
          this.showuldNumber = false;
          this.showflightInput = false;
          this.showMailBagNumber = false;
          this.showShipmentNumber = true;
          this.showLocationInput = false;
        }
        else if (response === 'FLIGHT') {
          this.auditForm.get('flightKey').setValidators([Validators.required]);
          this.auditForm.get('flightDate').setValidators([Validators.required]);
          this.auditForm.get('shipmentNumber').clearValidators();
          this.auditForm.get('uldNumber').clearValidators();
          this.showuldNumber = false;
          this.showflightInput = true;
          this.showMailBagNumber = false;
          this.showShipmentNumber = false;
          this.showLocationInput = false;
        }
        else if (response === 'ULD') {
          this.auditForm.get('uldNumber').setValidators([Validators.required]);
          this.auditForm.get('shipmentNumber').clearValidators();
          this.auditForm.get('flightKey').clearValidators();
          this.auditForm.get('flightDate').clearValidators();
          this.showuldNumber = true;
          this.showflightInput = false;
          this.showShipmentNumber = false;
          this.showMailBagNumber = false;
          this.showLocationInput = false;
        }
        else if (response === 'MAILBAG') {
          this.showflightInput = false;
          this.showMailBagNumber = true;
          this.showShipmentNumber = false;
          this.showLocationInput = false;
          this.auditForm.get('mailbagNumber').clearValidators();
          this.auditForm.get('mailbagNumber').setValidators([Validators.maxLength(30)]);
        } else if (response === 'LOCATION') {
          this.showflightInput = false;
          this.showMailBagNumber = false;
          this.showShipmentNumber = false;
          this.showLocationInput = true;
          this.auditForm.get('warehouseLocation').clearValidators();
        }

        else {
          this.showuldNumber = false;
          this.showflightInput = false;
          this.showShipmentNumber = false;
          this.showMailBagNumber = false;
        }
      }
      else {
        this.showuldNumber = false;
        this.showflightInput = false;
        this.showShipmentNumber = false;
        this.showMailBagNumber = false;
        this.showCPE = false;
      }
      this.cd.detectChanges();
    });
  }

  onSearch() {
    this.showUldRelatedField = true;
    this.showFlightRelatedField = true;
    this.showAWBFields = true;
    this.auditForm.validate();
    if (this.auditForm.invalid === true) {
      return;
    }
    const audit: AuditRequest = new AuditRequest();
    audit.fromDate = this.auditForm.get('fromDate').value;
    audit.toDate = this.auditForm.get('toDate').value;
    if (audit.toDate - audit.fromDate < 0) {
      this.showErrorMessage('billing.error.maxdate');
      return;
    }
    audit.entityType = this.auditForm.get('entityType').value;
    audit.entityValue = this.auditForm.get('entityValue').value;
    audit.user = this.auditForm.get('user').value;
    audit.eventType = this.auditForm.get('eventType').value;
    audit.shipmentNumber = this.auditForm.get('shipmentNumber').value;
    audit.flightKey = this.auditForm.get('flightKey').value;
    audit.flightDate = this.auditForm.get('flightDate').value;
    audit.uldNumber = this.auditForm.get('uldNumber').value;
    // audit.mailbagNumber = this.auditForm.get('mailbagNumber').value;
    audit.warehouseLocation = this.auditForm.get('warehouseLocation').value;
    audit.entityAttributes = this.auditForm.get('entityAttributes').value;
    // if (audit.entityType === 'MAILBAG') {
    //   audit.entityType = 'AWB'
    // }

    // Date range validation ends
    // Validate the data to search
    if ((audit.fromDate === null || audit.fromDate === '')
      && audit.toDate === null
      && audit.uldNumber === null
      && audit.shipmentNumber === null
      && audit.flightKey === null && !this.isAvailableForNewImplementation) {
      this.showErrorMessage('error.shipment.uld.flight.required');
      return;
    } else {
      this.onClearMessage;
    }
    this.auditService.onSearch(audit).subscribe(response => {
      this.refreshFormMessages(response);
      if (this.showResponseErrorMessages(response)) {
        (<NgcFormArray>this.auditForm.controls['auditList']).resetValue([]);
        this.showResponseErrorMessages(response);
        return;
      }
      if (!response.data) {
        this.showErrorMessage('no.record');
        this.auditForm.get('auditList').setValue([]);
        return;
      }
      if (response.data.auditList) {
        this.auditListDataResponse = response.data.auditList;
        let auditListData = response.data.auditList;
        let index = 1;
        this.eventData = [];
        auditListData.forEach(element => {
          element.sno = index++;
          let dataNeedToShow = element.entityValue + ' | ' + this.dateFormated(element.eventDateTime);
          if (element.eventChanges) {
            dataNeedToShow = dataNeedToShow + element.eventChanges;
          }
          element.listDetails = dataNeedToShow;
          if (response.data.availableForNewImplementation) {
            this.newAudits = true;
            if (element.eventValue) {
              element.parsedValue = element.eventValue.replace(/[,]/g, '<br>');
              let classAttributes = element.eventValue.split(",");
              element.attibutesLst = new Array();
              let listName = null;
              classAttributes.forEach(element1 => {
                let eventValueObj: any = new Object();
                let colonIndex = element1.indexOf(':');
                eventValueObj.label = element1.substr(0, colonIndex);
                eventValueObj.value = element1.substr(colonIndex + 1);
                // element.eventValue = element.eventValue.replace(eventValueObj.value, eventValueObj.value.fontcolor("blue"));
                eventValueObj.index = null;
                let colonMatch = eventValueObj.value.match(/: /gi);
                if (colonMatch) {
                  let valueColonCount = colonMatch.length;
                  let firstColonIndex = eventValueObj.value.indexOf(': ');
                  if (valueColonCount === 2) {
                    listName = eventValueObj.label;
                    let lastColonIndex = eventValueObj.value.lastIndexOf(': ');
                    let listIndexLabel = eventValueObj.value.substring(firstColonIndex + 1, lastColonIndex);
                    let listIndexValues = eventValueObj.value.substring(lastColonIndex + 1);
                    eventValueObj.label = listIndexLabel;
                    eventValueObj.value = listIndexValues;
                  }
                  else if (valueColonCount === 1) {
                    eventValueObj.index = eventValueObj.label;
                    let listIndexLabel = eventValueObj.value.substring(0, firstColonIndex);
                    let listIndexValues = eventValueObj.value.substring(firstColonIndex + 1);
                    eventValueObj.label = listIndexLabel;
                    eventValueObj.value = listIndexValues;
                  } else {
                    eventValueObj.index = null;
                  }
                }
                if (!eventValueObj.index) {
                  eventValueObj.index = '';
                }

                //

                let openBracketIndex = eventValueObj.value.indexOf('{');
                let closeBracketIndex = eventValueObj.value.indexOf('}');
                eventValueObj.changedValue = eventValueObj.value.substring(openBracketIndex + 1, closeBracketIndex);
                let changedValueWIthBraces = eventValueObj.value.substring(openBracketIndex , closeBracketIndex+1);
                element.eventValue = element.eventValue.replace(changedValueWIthBraces, (changedValueWIthBraces.bold()).fontcolor("blue"));
                eventValueObj.value = eventValueObj.value.replace(eventValueObj.value.substr(eventValueObj.value.indexOf('{'), eventValueObj.value.indexOf('}')), '');
                element.eventValue = element.eventValue.replace(',', this.appendTabSpace);
                element.attibutesLst.push(eventValueObj);
              });
              this.eventData.push(element.parsedValue);
            }

          } else {
            this.newAudits = false;
            element.eventValue = JSON.parse(element.eventValue).eventValue;
            element.stringEventValue = JSON.stringify(element.eventValue);
            this.eventData.push(element.eventValue);
          }
        });
        this.flagToDisplayData = true;
        this.modifiedAuditList = auditListData;
        if (audit.entityType === 'AWB') {
          this.showAWBFields = false;
          this.showFlightRelatedField = true;
          this.showUldRelatedField = true;

          this.auditForm.get('auditList').patchValue(auditListData);

        }
        else if (audit.entityType === 'FLIGHT') {
          this.showFlightRelatedField = false;
          this.showAWBFields = true;
          this.showUldRelatedField = true;

          this.auditForm.get('auditList').patchValue(auditListData);
        }
        else if (audit.entityType === 'ULD') {
          this.showAWBFields = true;
          this.showFlightRelatedField = true;
          this.showUldRelatedField = false;
          this.auditForm.get('auditList').patchValue(auditListData);
          this.cd.detectChanges();
        }
        this.auditForm.get('auditList').patchValue(auditListData);
      } else if (response.data.messageList) {
        this.flagToDisplayData = false;
      }

    });
  }



  dateFormated(obj: String): string {
    let dateTime: string;
    if (obj !== null) {
      dateTime = obj.toString();
      dateTime = dateTime.replace('T', ' ');
    }
    return dateTime;
  }

  detailsInformation(event) {
    this.auditForm.get('displayInformation').patchValue(this.eventData[event.record.NGC_ROW_ID]);
    this.windowComponent.open();
  }

  detailsInformationNew(event) {
    this.auditForm.get('entityDataArray').patchValue(new Array());
    this.auditForm.get('entityDataArray').patchValue(this.modifiedAuditList[event.record.NGC_ROW_ID].attibutesLst);
    this.auditForm.get('popupevents').patchValue(this.modifiedAuditList[event.record.NGC_ROW_ID].eventName);
    this.auditForm.get('popupusers').patchValue(this.modifiedAuditList[event.record.NGC_ROW_ID].actor);
    this.auditForm.get('popupdatetime').patchValue(this.modifiedAuditList[event.record.NGC_ROW_ID].eventDateTime);
    this.indexnumber = event.record.NGC_ROW_ID;
    this.windowComponent.open();
  }

  onSelectEntityType(event) {
    if (event.code) {
      // this.auditForm.get('entityValue').setValidators([Validators.required]);
      if(event.code === 'CPE'){
        this.showCPE = true;
        this.showuldNumber = false;
        this.showflightInput = false;
        this.showShipmentNumber = false;
      }
      if (event.code === 'AWB') {
        this.auditForm.get('shipmentNumber').setValidators([Validators.required]);
        this.showuldNumber = false;
        this.showflightInput = false;
        this.showShipmentNumber = true;
      }
      if (event.code === 'FLIGHT') {
        this.auditForm.get('flightKey').setValidators([Validators.required]);
        this.auditForm.get('flightDate').setValidators([Validators.required]);
        this.showuldNumber = false;
        this.showflightInput = true;
        this.showShipmentNumber = false;
      }
      if (event.code === 'ULD') {
        this.auditForm.get('uldNumber').setValidators([Validators.required]);
        this.showuldNumber = true;
        this.showflightInput = false;
        this.showShipmentNumber = false;
      }
    } else {
      this.auditForm.get('entityValue').clearValidators();
      this.showuldNumber = false;
      this.showflightInput = false;
      this.showShipmentNumber = false;
      this.showCPE = false;
    }
  }

  onCancel() {
    this.navigateBack(this.getTransferredData);
  }
  public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    const renderedText: string = this.getDetails(JSON.parse(rowData.stringEventValue));
    const attributeDetails = JSON.parse(rowData.stringEventValue);
    let renderedTextDetails: string = "";
    //filter the array attribute
    const details = JSON.parse(rowData.stringEventValue);
    let textToRender = "";
    for (let key in details) {
      if (NgcUtility.isArray(details[key]) && details[key].length > 0) {

        let datarender = this.getDetails(details[key]);
        console.log("datatirender", datarender);
        if (datarender != '<table><tr><table></table></tr><tr><table></table></tr><tr><table></table></tr></table>') {
          textToRender = textToRender + "<Br><B><p>" + key + "</p></B>";
          datarender = datarender.replace(/<tr><table>/g, "<tr>");
          datarender = datarender.replace(/<\/table><\/tr>/g, "</tr>");
          textToRender = textToRender + datarender;
        }
      }
    }

    cellsStyle.data = rowData.details + "<Br>" + textToRender;
    //
    return cellsStyle;
  };

  private getDetails(detail: any): string {
    let retValue: string = '<table>';
    for (let key in detail) {
      if (NgcUtility.isArray(detail[key])) {
        retValue += '<tr>';
        detail[key].forEach((item: any) => {
          const newRetValue: string = this.getDetails(item);
          retValue += newRetValue;
        });
        retValue += '</tr>';
      } else if (NgcUtility.isObject(detail[key])) {
        retValue += '<tr>'
        retValue += this.getDetails(detail[key]);
        retValue += '</tr>';
      } else if (detail[key] != null && detail[key] != "") {
        retValue += '<td>';
        retValue += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<B>${key}</B> &nbsp;: &nbsp; ${detail[key]}  `;
        retValue += '</td>';
      }
    }
    // if (stringToCheck == null) {
    //   retValue = null;
    // } else {
    //   retValue += "</table>";
    // }
    retValue += "</table>";
    //
    return retValue;
  }

  onEntityTypeLOVSelect(object) {
    if (object.desc == 'CUSTOMER') {
      this.customerFlag = true;
    } else {
      this.customerFlag = false;
    }
    this.auditForm.get('entityValue').setValue(null);
  }

  onEntityValueLOVSelect(object) {
    this.auditForm.get('entityValue').setValue(object.code);
  }
  public getValue(index: number): string {
    try {
      return this.auditForm.get(['auditList', index, 'stringEventValue']).value;
    } catch (e) { }
    //
    return null;
  }

  onEntityTypeClick(item) {
    if(item.code == 'CPE'){
      this.showCPE = true;
    }
    

    if (!item.booleanParameter1) {
      this.isAvailableForNewImplementation = false;
      this.mandatoryFields = true;
    } else {
      this.isAvailableForNewImplementation = true;
      if (item.booleanParameter2) {
        this.mandatoryFields = true;
      } else {
        this.mandatoryFields = false;
      }
    }
    if (item.code === 'BILLING' || item.code === 'BILLING' || item.code === 'CUSTOM'
      || item.code === 'EFACILITATION' || item.code === 'MASTER' || item.code === 'ROLE'
      || item.code === 'TRACING' || item.code === 'BILLING') {
      this.showEventType = false;
    } else {
      this.showEventType = true;
    }
  }

  onPrevious() {
    this.indexnumber = Number(this.indexnumber) - 1;
    this.auditForm.get('popupevents').patchValue(this.modifiedAuditList[this.indexnumber].eventName);
    this.auditForm.get('popupusers').patchValue(this.modifiedAuditList[this.indexnumber].actor);
    this.auditForm.get('popupdatetime').patchValue(this.modifiedAuditList[this.indexnumber].eventDateTime);
    this.auditForm.get('entityDataArray').patchValue(this.modifiedAuditList[this.indexnumber].attibutesLst);
  }

  onNext() {
    this.indexnumber = Number(this.indexnumber) + 1;
    this.auditForm.get('popupevents').patchValue(this.modifiedAuditList[this.indexnumber].eventName);
    this.auditForm.get('popupusers').patchValue(this.modifiedAuditList[this.indexnumber].actor);
    this.auditForm.get('popupdatetime').patchValue(this.modifiedAuditList[this.indexnumber].eventDateTime);
    this.auditForm.get('entityDataArray').patchValue(this.modifiedAuditList[this.indexnumber].attibutesLst);
  }

}
