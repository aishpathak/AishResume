import { Component, OnInit, ViewChild, NgZone, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { NgcButtonComponent, NgcWindowComponent, NgcFormGroup, NgcFormControl, NgcFormArray, NgcUtility, CellsRendererStyle, PageConfiguration, NgcPage } from 'ngc-framework';
import { AuditService } from '../audit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { AuditRequest } from '../audit.sharedmodel';
import { ApplicationEntities } from '../../common/applicationentities';
import { ShipmentInfoReqModel } from '../../awbManagement/awbManagement.shared';
import { AwbManagementService } from '../../awbManagement/awbManagement.service';

@Component({
  selector: 'app-audit-trail-by-location',
  templateUrl: './audit-trail-by-location.component.html',
  styleUrls: ['./audit-trail-by-location.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class AuditTrailByLocationComponent extends NgcPage implements OnInit {

  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  eventData = [];
  eventDetails = new Array();
  flagToDisplayData: boolean = false;
  // @ViewChild('popupChild') popupChild: NgcPopoverComponent;
  @ViewChild('windowComponent') windowComponent: NgcWindowComponent;
  auditListDataResponse: any;
  getTransferredData: any;
  showShipmentNumber = false;
  modifiedAuditList: any;
  isAvailableForNewImplementation = false;
  appendTabSpace = "&nbsp;&nbsp;&nbsp;&nbsp;";
  mandatoryFields: boolean = false;
  showEventType: boolean = true;
  indexnumber: any;
  awbrequired: boolean = false;
  locationrequired: boolean = true;
  handledbyHouse: boolean = false;

  constructor(
    private awbService: AwbManagementService,
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
    auditList: new NgcFormArray([]),
    displayInformation: new NgcFormControl(),
    entityDataArray: new NgcFormArray([]),
    entityAttributes: new NgcFormControl(),
    popupevents: new NgcFormControl(),
    popupusers: new NgcFormControl(),
    popupdatetime: new NgcFormControl(),
    warehouseLocation: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    locationRadio: new NgcFormControl(true),
    awbRadio: new NgcFormControl(false),
    hawbNumber: new NgcFormControl(),
  })

  ngOnInit() {
    super.ngOnInit;
  }
  onSearch() {
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

    audit.warehouseLocation = this.auditForm.get('warehouseLocation').value;
    if (this.auditForm.get('locationRadio').value === true) {
      audit.locationSearchType = "LOCATION";
    }
    if (this.auditForm.get('awbRadio').value === true) {
      audit.locationSearchType = "AWB";
      audit.entityValue = this.auditForm.get('shipmentNumber').value;
      audit.hawbNumber = this.auditForm.get('hawbNumber').value;
    }

    this.auditService.getAuditTrailByLocation(audit).subscribe(response => {
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
              let openBracketIndex = eventValueObj.value.indexOf('{');
              let closeBracketIndex = eventValueObj.value.indexOf('}');
              eventValueObj.changedValue = eventValueObj.value.substring(openBracketIndex + 1, closeBracketIndex);
              let changedValueWIthBraces = eventValueObj.value.substring(openBracketIndex, closeBracketIndex + 1);
              element.eventValue = element.eventValue.replace(changedValueWIthBraces, (changedValueWIthBraces.bold()).fontcolor("blue"));
              eventValueObj.value = eventValueObj.value.replace(eventValueObj.value.substr(eventValueObj.value.indexOf('{'), eventValueObj.value.indexOf('}')), '');
              element.eventValue = element.eventValue.replace(',', this.appendTabSpace);
              element.attibutesLst.push(eventValueObj);
            });
            this.eventData.push(element.parsedValue);


          }
        });
        this.flagToDisplayData = true;
        this.modifiedAuditList = auditListData;
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
    retValue += "</table>";
    return retValue;
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

  changeAWBRadio() {
    this.awbrequired = true;
    this.locationrequired = false;
    this.flagToDisplayData = false;
    this.auditForm.get('warehouseLocation').setValue('');
    this.auditForm.get('fromDate').setValue('');
    this.auditForm.get('toDate').setValue('');
  }

  changeLocationRadio(event) {
    this.locationrequired = true;
    this.awbrequired = false;
    this.flagToDisplayData = false;
    this.auditForm.get('shipmentNumber').setValue('');
  }

  onShipmentInformation() {
    var shipmentNumber = this.auditForm.get('shipmentNumber').value;
    const obj = {
      shipmentNumber: shipmentNumber,
      shipmentType: 'AWB'
    }
    this.navigateTo(this.router, '/awbmgmt/shipmentinfoCR', obj);
  }

  onTabOutCheckHandledBy() {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      this.handledbyHouse = false;
      this.auditForm.get('hawbNumber').patchValue("");
      this.auditForm.get('hawbNumber').clearValidators();
      const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.auditForm);
      const req: ShipmentInfoReqModel = new ShipmentInfoReqModel();
      req.shipmentNumber = searchFormGroup.get('shipmentNumber').value;
      this.handledbyHouse = false;
      this.awbService.isHandledByHouse(req).subscribe(response => {
        if (response) {
          this.handledbyHouse = true;
        }
        console.log(this.handledbyHouse);
      })
    }
  }
}