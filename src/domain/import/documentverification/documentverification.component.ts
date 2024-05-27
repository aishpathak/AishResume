import { CellsStyleClass } from './../../../shared/shared.data';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DocumentVerificationRequest, DocumentVerificationGroup, DgdAWBNumber, AwbPrintRequestList, EliElmSavRequest, SearchRegulation
} from './../import.shared';
import {
  NgcFormControl, NgcFormGroup, NgcFormArray, NgcPage, NgcReportComponent,
  NgcWindowComponent, CellsRendererStyle, NgcButtonComponent, NgcUtility, PageConfiguration, NgcPrinterComponent
} from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ImportService } from '../import.service';
import { trigger } from '@angular/animations';
import { ApplicationFeatures } from '../../common/applicationfeatures';

@Component({
  selector: 'app-documentverification',
  templateUrl: './documentverification.component.html',
  styleUrls: ['./documentverification.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class DocumentverificationComponent extends NgcPage implements OnInit {
  //dgPackingGroup: string[] = [];
  supplierNumber: any;
  docComeStatus: any;
  isDisplayDetailsFlag: boolean;
  displayData: boolean;
  displayNil: boolean;
  documentVerificationShipmentModelList: any[];
  documentVerificationShipmentModelListBySegemt: any[] = [];
  displayBySegmentData: boolean = false;
  documentVerificationOffload: any[] = [];
  documentVerificationRemarks: any[] = [];
  documentVerificationShipmentCompleteList: any[] = [];
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('offLoadPopup') offLoadPopup: NgcWindowComponent;
  @ViewChild("remarksPopup") private remarksPopup: NgcWindowComponent;
  @ViewChild("eliElmWindow") eliElmWindow: NgcWindowComponent;
  @ViewChild("dgeliElmWindow") dgeliElmWindow: NgcWindowComponent;
  @ViewChild('printerName') printerName: NgcPrinterComponent;
  //declare let $: any;
  resp: any;
  isFlightDetails: boolean;
  DocumentVerificationRequest: any;
  reopenDocumentTab: boolean;
  transferData: any
  openDocumentTab: boolean = true;
  documentCompleteStatus: boolean;
  ata: string = null;
  dgRegulationRes: any;
  dgRegulationId: number;
  search = new SearchRegulation();
  allNumbers: any[];
  multiselect = 0;
  yellow = false;
  blue = false;
  green = false;
  istouched: any;
  deleteEliArray: any;
  remarksOnHold: any = false;
  delayStatus: boolean = false;
  eliShipmentNumber: any = null;
  dgEntryShipmentNumber: any = null;
  freeTextifOutboundFlightNotExist: boolean = false;
  elielmDropdownCheck: boolean = false;
  handlingInstrctionsFound: boolean = false;
  private dataSyncSearch: number = 0;
  codeAdminStatus: any;
  eliElmIndex: number = 0;
  printerForAT: any;
  reportParameters: any;
  sourceIdSegmentDropdown: any;
  segmentDropDown: any[] = [];

  @ViewChild("overpackWindow")
  overpackWindow: NgcWindowComponent;
  @ViewChild('reOpenDocumentCompleteButton') reOpenDocumentCompleteButton: NgcButtonComponent;
  @ViewChild('documentCompleteButton') documentCompleteButton: NgcButtonComponent;
  @ViewChild('offloadButton') offloadButton: NgcButtonComponent;
  @ViewChild('delayButton') delayButton: NgcButtonComponent;
  @ViewChild("dgEntrypopup") dgEntrypopup: NgcWindowComponent;
  updateBookingObject: any;
  @ViewChild('updateBookingWindow') updateBookingWindow: NgcWindowComponent;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
    this.isFlightDetails = true;
    this.documentCompleteStatus = false;

  }
  unidRowData = {
    select: false,
    unidNumber: "",
    packingGroupCode: "",
    pgList: "",
    packageWeight: "",
    packagePieces: "",
    packageQuantity: "",
    packingInstructions: "",
    piList: "",
    packingInstructionCategory: "",
    transportIndex: "",
    notificationFlightType: "",
    technicalName: "",
    categoryList: "",
    packingRemarks: "",
    packingGroupCodeList: "",
    packingGroupInstructionList: ""
  };
  private form: NgcFormGroup = new NgcFormGroup({
    flightId: new NgcFormControl(),
    flightNumber: new NgcFormControl(),
    printerName: new NgcFormControl(),
    segment: new NgcFormControl(),
    flightDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    sta: new NgcFormControl(),
    eta: new NgcFormControl(),
    ata: new NgcFormControl(),
    documentCheckInAt: new NgcFormControl(),
    customsFlightNumber: new NgcFormControl(),
    boardPoint: new NgcFormControl(),
    flightRemarks: new NgcFormControl(),
    aircraftType: new NgcFormControl(),
    status: new NgcFormControl(),
    offloadpopup: new NgcFormGroup({
      awbNumber: new NgcFormControl(),
      offloasReson: new NgcFormControl(),
    }),
    remarks: new NgcFormGroup({
      remarks: new NgcFormControl(),
      remarkType: new NgcFormControl(),
    }),
    countDetails: new NgcFormGroup({
      awbCount: new NgcFormControl(),
      eAwbCount: new NgcFormControl(),
      noOfDIRShipments: new NgcFormControl(),
      flightHandlingReportDocumentGeneratedAt: new NgcFormControl(),
      docRecCount: new NgcFormControl(),
      penCount: new NgcFormControl(),
    }),
    documentVerificationShipmentModelList: new NgcFormArray(
      [
      ]
    ),
    documentVerificationShipmentModelListBySegemt: new NgcFormArray(
      [
      ]
    ),
    awbArrayList: new NgcFormArray(
      [
      ]
    )
  });


  ngOnInit() {
    super.ngOnInit();
    this.allNumbers = new Array();
    this.transferData = this.getNavigateData(this.activatedRoute);
    if (this.transferData != null) {
      this.form.get('flightNumber').setValue(this.transferData.flightKey);
      this.form.get('flightDate').setValue(this.transferData.flightDate);
      this.getDocumentVerificationTable();
    }

    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData) {
      if (forwardedData.flightNumber != null && forwardedData.flightNumber != "" && forwardedData.flightDate != null && forwardedData.flightDate != "") {
        this.form.get('flightNumber').setValue(forwardedData.flightNumber);
        this.form.get('flightDate').setValue(forwardedData.flightDate);
        this.getDocumentVerificationTable();
      }
    }


  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.form.get('flightNumber').value && this.form.get('flightDate').value) {
      this.getDocumentVerificationTable();
    }

    this.allNumbers = new Array();
    this.dgdRadioActiveForm
      .get("dgdDetailsForm")
      .get("shipmentRadioactiveFlag1")
      .valueChanges.subscribe(flagValue => {
        if (flagValue === true) {
          this.shipmentFlag = true;
          this.dgdRadioActiveForm
            .get("dgdDetailsForm")
            .get("shipmentRadioactiveFlag")
            .patchValue("RAD");
        }
      });

    this.dgdRadioActiveForm
      .get("dgdDetailsForm")
      .get("shipmentRadioactiveFlag2")
      .valueChanges.subscribe(flagValue => {
        if (flagValue === true) {
          this.shipmentFlag = false;
          this.dgdRadioActiveForm
            .get("dgdDetailsForm")
            .get("shipmentRadioactiveFlag")
            .patchValue("NON");
        }
      });
  }

  public onSegmentChange(event) {
    this.displayBySegmentData = true;
    let segment = "";
    this.documentVerificationShipmentModelListBySegemt = [];
    if (this.segmentDropDown != null && this.segmentDropDown.length > 0) {
      for (let item of this.segmentDropDown) {
        if (item.code == event) {
          segment = item.desc.substring(0, 3);
        }
      }
    }
    this.form.get('documentVerificationShipmentModelListBySegemt').patchValue([]);
    this.documentVerificationShipmentModelList = (<NgcFormArray>this.form.get('documentVerificationShipmentModelList')).getRawValue();
    if (event != null && event != '') {
      for (let item of this.documentVerificationShipmentModelList) {
        let segementId = item['flightSegmentId'] + "";
        item.segOrign = item.segOrign + "   [ " + segment + " ]";
        if (segementId === event) {
          this.documentVerificationShipmentModelListBySegemt.push(item);
        }
      }
    } else {
      this.documentVerificationShipmentModelListBySegemt = [];
      this.displayBySegmentData = false;
      this.form.get('documentVerificationShipmentModelListBySegemt').patchValue([]);
    }

    this.form.get('documentVerificationShipmentModelListBySegemt').patchValue(this.documentVerificationShipmentModelListBySegemt);

  }

  public getDocumentVerificationTable() {
    this.displayBySegmentData = false;
    this.segmentDropDown = [];
    this.ata = null;
    let eawbCount = 0;
    let docRecievedCount = 0;
    this.isDisplayDetailsFlag = false;
    this.displayData = false;
    this.form.get('segment').patchValue("");
    if (this.form.get('flightNumber').value == null || this.form.get('flightDate').value == null) {
      this.form.validate();
      this.showErrorMessage("enter.flight.details");
      return;
    }
    const documentVerificationRequest: DocumentVerificationRequest = new DocumentVerificationRequest();
    documentVerificationRequest.flightNumber = this.form.get('flightNumber').value;
    documentVerificationRequest.flightDate = this.form.get('flightDate').value;
    documentVerificationRequest.flightSegmentId = 0;
    this.resetFormMessages();
    this.importService.getDocumentVerificationTable(documentVerificationRequest).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.resp = data;
        //console.log(this.resp.data);
        if (this.resp.data != null) {
          this.istouched = false;
          this.documentCompleteStatus = this.resp.data.documentCompleteStatus;
          if (this.resp.data.ata != null) {
            this.ata = this.resp.data.ata;
          }
          this.sourceIdSegmentDropdown = this.createSourceParameter(
            this.form.get("flightNumber").value,
            this.form.get("flightDate").value
          );
          this.retrieveDropDownListRecords('ARRIVAL_FLIGHTSEGMENT', 'query', this.sourceIdSegmentDropdown)
            .subscribe(value => {
              this.segmentDropDown = value;
              if (value.length == 1) {
                //this.form.get("segment").patchValue(value[0].code);
              } else {
                let dropdown: any = null;
                dropdown = { code: "ALL", desc: "ALL" };
                value.push(dropdown);
              }
            });

          this.refreshFormMessages(data);
          this.form.get('countDetails.docRecCount').setValue(this.resp.data.docRecievedCount);
          this.form.get('countDetails.eAwbCount').setValue(this.resp.data.eawbCount);
          this.form.get('countDetails.noOfDIRShipments').setValue(this.resp.data.noOfDIRShipments);
          this.form.get('countDetails.flightHandlingReportDocumentGeneratedAt').setValue(this.resp.data.flightHandlingReportDocumentGeneratedAt);

          //let resultList: NgcFormArray = this.form.get("documentVerificationShipmentModelList") as NgcFormArray;
          this.form.get('countDetails.awbCount').setValue(this.resp.data.documentVerificationShipmentModelList.length);
          this.form.get('countDetails.penCount').setValue(this.resp.data.documentVerificationShipmentModelList.length - this.resp.data.docRecievedCount);
          if (this.resp.data.handlinginSystem && this.dataSyncSearch == 0) {
            this.showConfirmMessage('entered.flight.not.handled.in.cosys').then(reason => {
              this.bindData();
              this.dataSyncSearch++;
            }).catch(reason => {
              this.isFlightDetails = false;
              this.dataSyncSearch = 0;
            });
          } else {
            this.bindData();
          }
        } else {
          this.refreshFormMessages(data);
          this.isDisplayDetailsFlag = false;
          this.displayData = false;
          this.showErrorMessage("no.record.found");
        }
      }
    });
  }

  bindData() {
    //console.log(this.resp.data);
    this.form.patchValue(this.resp.data);
    if (this.resp.data.inboundFlightDelayReason) {
      this.delayStatus = true;
    }
    this.isDisplayDetailsFlag = true;
    if (this.resp.data.documentCompleteStatus) {
      this.reopenDocumentTab = true;
      this.openDocumentTab = false;
    } else {
      this.openDocumentTab = true;
      this.reopenDocumentTab = false;
    }
    if (this.resp.data != null) {
      this.displayData = true;
    } else {
      this.displayNil = true;
    }
    this.resp.data.documentVerificationShipmentModelList.forEach(rowData => {
      if (rowData.awbPieceWeight.indexOf('/ 0.0') >= 0
        && rowData.irregularity === null) {
        this.showErrorStatus('import.err101');
      } else if (rowData.shc !== null && !NgcUtility.isTenantCityOrAirport(rowData.destination)) {
        if (rowData.eliInfo !== 'Y' && rowData.shc.indexOf('ELI') >= 0 && rowData.throughService === 'N') {
          this.showErrorStatus('import.err102');
        }
        if (rowData.elmInfo !== 'Y' && rowData.shc.search('ELM') >= 0 && rowData.throughService === 'N'
        ) {
          this.showErrorStatus('import.err102');
        }
        if (rowData.dgInfo !== 'Y'
          && (rowData.shc.indexOf('RLI') >= 0
            || rowData.shc.search('RLM') >= 0
            || rowData.shc.search('RLB') >= 0)) {

          this.showErrorStatus('import.err103');

        }

      }
      if (rowData.cpeFwbAction == 'ERROR' || rowData.cpeFwbAction == 'WARNING' || rowData.cpeFwbAction == 'INFO') {
        this.showErrorStatus(NgcUtility.translateMessage("import.err104", [rowData.reason]));
      }
      let data = rowData.awbPieceWeight;
      if (data) {
        data = data + '';
        if (data.includes("/")) {
          if (data.split("/")[1] === null) {
            this.showErrorStatus('import.err101');
          }
        }
      }
      if (rowData.segOrign == 'TRANSHIPMENT') {
        rowData.segOrign = '.' + rowData.segOrign
      }
    });
  }

  dgEntry(event) {
    let ind: any;
    this.multiselect = 0;
    if (this.documentVerificationShipmentModelListBySegemt.length > 0) {
      (<NgcFormArray>this.form.get('documentVerificationShipmentModelListBySegemt')).controls.forEach((formGroup: NgcFormGroup, index) => {
        let select = formGroup.get('selectCheck').value;
        if (select) {
          ind = index;
          this.multiselect++;
        }
      });
    } else {
      (<NgcFormArray>this.form.get('documentVerificationShipmentModelList')).controls.forEach((formGroup: NgcFormGroup, index) => {
        let select = formGroup.get('selectCheck').value;
        if (select) {
          ind = index;
          this.multiselect++;
        }
      });
    }


    if (this.multiselect === 1) {
      this.dgEntrypopup.open();
      let formGroup: any;
      if (this.documentVerificationShipmentModelListBySegemt.length > 0) {
        formGroup = (this.form.get(['documentVerificationShipmentModelListBySegemt', ind])) as NgcFormGroup;
      } else {
        formGroup = (this.form.get(['documentVerificationShipmentModelList', ind])) as NgcFormGroup;
      }
      let shipmentNumber = formGroup.get('shipmentNumber').value;
      this.dgEntryShipmentNumber = formGroup.get('shipmentNumber').value;
      let departureAirport = formGroup.get('origin').value;
      let destinationAirport = formGroup.get('destination').value;

      this.dgdRadioActiveForm.get('searchFormGroup.shipmentNumber').patchValue(shipmentNumber);
      this.dgdRadioActiveForm.get('dgdDetailsForm.shipmentNumber').patchValue(shipmentNumber);
      this.dgdRadioActiveForm.get('dgdDetailsForm.departureAirport').patchValue(departureAirport);
      this.dgdRadioActiveForm.get('dgdDetailsForm.destinationAirport').patchValue(destinationAirport);
      if (this.dgdRadioActiveForm.get('dgdDetailsForm.shipmentRadioactiveFlag2').value) {
        this.dgdRadioActiveForm.get('dgdDetailsForm.shipmentRadioactiveFlag2').patchValue(true);
      }
      this.dgdRadioActiveForm.get('dgdDetailsForm.shipmentRadioactiveFlag2').patchValue(true);
      //  this.dgdRadioActiveForm.get('dgdDetailsForm.dgdReferenceNo').patchValue(0);
      this.dgdRadioActiveForm.get('dgdDetailsForm.aircraftType').patchValue(this.form.get('aircraftType').value);
      this.multiselect++;
      this.onSearch(formGroup);
    } else {
      this.showInfoStatus('select.shipment.dg.declaration');
    }

  }
  getPackingInstruction(item, index) {
    console.log(item.value);
    const gerRemarkReq: any = new Object();
    gerRemarkReq.eliElm = item.value.unidShc
    gerRemarkReq.piData = item.value.packingInstructions;
    gerRemarkReq.shipmentNumber = this.dgEntryShipmentNumber;
    this.resetFormMessages();
    if (gerRemarkReq && (gerRemarkReq.piData !== '')) {
      this.importService.getRemarkOnPiAndShc(gerRemarkReq).subscribe(remarkRes => {
        if (remarkRes.data && remarkRes.data.remark) {
          this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "packingRemarks"]).patchValue(remarkRes.data.remark);
        }
      });
      //this.resetFormMessages();
    }
  }

  public offloadsave() {
    this.documentVerificationOffload = [];
    const documentVerificationGroup = new DocumentVerificationGroup();
    documentVerificationGroup.flightId = this.form.get('flightId').value;
    documentVerificationGroup.flightNumber = this.form.get('flightNumber').value;
    documentVerificationGroup.flightDate = this.form.get('flightDate').value;
    this.documentVerificationShipmentCompleteList[0].offloadRemarksCode = this.form.get('offloadpopup.offloasReson').value;
    this.documentVerificationOffload.push(this.documentVerificationShipmentCompleteList[0]);
    documentVerificationGroup.documentVerificationShipmentModelList = this.documentVerificationOffload;
    this.importService.offLoadShipmentDocumentVerifyication(documentVerificationGroup).subscribe(data => {
      this.refreshFormMessages(data);
      if (data.messageList === null) {
        this.offLoadPopup.hide();
        this.getDocumentVerificationTable();
        this.showSuccessStatus('g.completed.successfully');
      }
    });
  }

  offloadpopup(event) {
    this.documentVerificationShipmentCompleteList = [];
    const documentVerificationGroup = new DocumentVerificationGroup();
    if (this.documentVerificationShipmentModelListBySegemt.length > 0) {
      this.documentVerificationShipmentModelList = (<NgcFormArray>this.form.get('documentVerificationShipmentModelListBySegemt')).getRawValue();
      for (let item of this.documentVerificationShipmentModelList) {
        if (item['selectCheck'] === true) {
          item.outboundFlight = null;
          item.readyfordelivery = null;
          this.documentVerificationShipmentCompleteList.push(item);
        }
      }
    } else {
      this.documentVerificationShipmentModelList = (<NgcFormArray>this.form.get('documentVerificationShipmentModelList')).getRawValue();
      for (let item of this.documentVerificationShipmentModelList) {
        if (item['selectCheck'] === true) {
          item.outboundFlight = null;
          item.readyfordelivery = null;
          this.documentVerificationShipmentCompleteList.push(item);
        }
      }
    }

    if (this.documentVerificationShipmentCompleteList.length == 1) {
      this.form.get('offloadpopup.awbNumber').setValue(
        this.documentVerificationShipmentCompleteList[0].shipmentNumber);
      this.offLoadPopup.open();
    } else {
      this.showInfoStatus('import.info107');
    }

  }

  changeToCode(event) {
    this.form.get('offloadpopup.offloasReson').setValue(event.desc);
  }

  onSelectPrinter(event) {
    this.printerForAT = event.desc;
  }

  onDocumentComplete() {
    // if (this.istouched === true) {
    //   this.showErrorStatus("Please save changes before document complete");
    //   return;
    // }
    let count = 0;
    let check = false;
    this.documentVerificationShipmentCompleteList = [];
    let shipments = null;
    let partShipmentsCountWithZeroWt = 0;
    const documentVerificationGroup = new DocumentVerificationGroup();
    this.documentVerificationShipmentModelList = (<NgcFormArray>this.form.get('documentVerificationShipmentModelList')).getRawValue();
    if (this.ata == null) {
      this.showWarningStatus('import.warn101')
      return;
    }

    if (this.documentVerificationShipmentModelList.length > 0) {
      for (let item of this.documentVerificationShipmentModelList) {
        if (item.cpeFwbAction == 'ERROR') {
          this.showErrorStatus(NgcUtility.translateMessage("import.err104", [item.reason]));
          return;
        }
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_DocumentPouchCheckInRequiredForDocumentComplete)) {
          if (this.form.get('documentCheckInAt').value == null) {
            this.showErrorStatus(NgcUtility.translateMessage("import.doc.not.checkin.err ", [item.shipmentNumber]));
            return;
          }
        }
        if (!NgcUtility.isTenantCityOrAirport(item.destination) && item.foreignAwbWithOnwordInfo == 'Y') {
          this.showErrorStatus(NgcUtility.translateMessage("import.err106", [item.shipmentNumber]));
          check = false;
          return;
        }
        if (item.awbPieces != null || item.offloadRemarksCode == 'OFFLOADED') {
          item.outboundFlight = null;
          item.readyfordelivery = null;
          this.documentVerificationShipmentCompleteList.push(item);
          check = true;
        }
        if ((item.awbPieces != null || item.awbPieces != 0) && (item.awbWeight == null || item.awbWeight == 0)) {
          if (item.irregularity != null) {
            this.documentVerificationShipmentCompleteList.push(item);
            check = true;
          } else {
            check = false;
            ++partShipmentsCountWithZeroWt;
            if (shipments == null) {
              shipments = item.shipmentNumber;
            } else {
              shipments = shipments + "," + item.shipmentNumber
            }
          }
        }
      }
    } else {
      check = true;
      count = 0;
    }

    if (partShipmentsCountWithZeroWt > 0) {
      this.showWarningStatus(NgcUtility.translateMessage("import.warn102", [shipments]));
      return;
    }

    let dgCount = 0;
    let eliCount = 0;
    let elmCount = 0;
    let pendingForVerificationCount = 0;
    this.documentVerificationShipmentModelList.forEach(record => {
      if (record.shc !== null &&
        (record.shc.indexOf('RLI') >= 0
          || record.shc.search('RLM') >= 0
          || record.shc.search('RLB') >= 0)
        && !NgcUtility.isTenantCityOrAirport(record.destination)) {
        if ((record['dgInfo'] !== 'Y' || record['dgn'] !== 'Y') && record['throughService'] === 'N') {
          dgCount++;
        }
      }
      if (!NgcUtility.isTenantCityOrAirport(record.origin) && !NgcUtility.isTenantCityOrAirport(record.destination) && record.shc !== null)
        if (record.shc.includes('ELM')) {
          if (record['elmInfo'] !== 'Y' && record['throughService'] === 'N') {
            elmCount++;
          }
        }
      if (!NgcUtility.isTenantCityOrAirport(record.origin) && !NgcUtility.isTenantCityOrAirport(record.destination) && record.shc !== null)
        if (record.shc.includes('ELI')) {
          if (record['eliInfo'] !== 'Y' && record['throughService'] === 'N') {
            eliCount++;
          }
        }
      if (!record.docRecieved && !record.copyAwb) {
        pendingForVerificationCount++;
      }
    })
    if (dgCount > 0) {
      this.showWarningStatus('import.warn103');
      return;
    }
    if (eliCount > 0) {
      this.showWarningStatus('import.warn104');
      return;
    }
    if (elmCount > 0) {
      this.showWarningStatus('import.warn105');
      return;
    }

    documentVerificationGroup.flightId = this.form.get('flightId').value;
    documentVerificationGroup.flightNumber = this.form.get('flightNumber').value;
    documentVerificationGroup.flightDate = this.form.get('flightDate').value;
    documentVerificationGroup.customsFlightNumber = this.form.get('customsFlightNumber').value;
    documentVerificationGroup.terminal = this.getUserProfile().terminalId;
    documentVerificationGroup.printerName = this.printerName['value'];
    documentVerificationGroup.printerForAT = this.printerForAT;
    documentVerificationGroup.documentVerificationShipmentModelList = this.documentVerificationShipmentCompleteList;
    let i = 10;

    if (check && count == 0) {
      if (pendingForVerificationCount > 0) {
        this.showConfirmMessage('shipments.pending.verification').then(fulfilled => {
          this.documentCompeltefuntion(documentVerificationGroup);
        });
      } else {
        this.documentCompeltefuntion(documentVerificationGroup);
      }
    }

  }

  public documentCompeltefuntion(documentVerificationGroup) {
    this.importService.documentCompleteTable(documentVerificationGroup).subscribe(data => {
      if (!this.refreshFormMessages(data) && data.messageList === null) {
        this.docComeStatus = true;
        this.getDocumentVerificationTable();
        this.showSuccessStatus('g.completed.successfully');
      }
      if (data.messageList != null && data.messageList[0].code === 'DOC_BOOKING_UPDATE' &&
        (this.resp.data != null || this.resp.data.codeAdminStatus == null || this.resp.data.codeAdminStatus != 'ERROR')) {
        this.showConfirmMessage(NgcUtility.translateMessage("import.confirm101", [data.messageList[0].message])).then(fulfilled => {
          documentVerificationGroup.finalizeCheck = 'PROCEED';
          this.documentCompeltefuntion(documentVerificationGroup);
        });
      }
    });
  }

  public onLinkClick(event) {
    console.log(event.parent.data.destination);
    if (this.reopenDocumentTab) {
      this.showInfoStatus("import.info108");
      return;
    }
    if (!NgcUtility.isTenantCityOrAirport(event.parent.data.destination)) {
      this.navigateTo(this.router, 'import/maintainfwb', { "awbNumber": event.record.shipmentNumber });
    } else {

      this.navigateTo(this.router, 'awbmgmt/awbdocument', {
        "shipmentNumber": event.record.shipmentNumber,
        "shipmentType": event.record.shipmentType
      });
    }
  }

  public onHold(event) {
    let shipmentNumber = null;
    this.documentVerificationShipmentCompleteList = [];
    const documentVerificationGroup = new DocumentVerificationGroup();
    this.documentVerificationShipmentModelList = (<NgcFormArray>
      this.form.get('documentVerificationShipmentModelList')).getRawValue();
    for (let item of this.documentVerificationShipmentModelList) {
      if (item['selectCheck'] === true) {
        this.documentVerificationShipmentCompleteList.push(item);
        shipmentNumber = item['shipmentNumber'];
      }
    }

    if (this.documentVerificationShipmentCompleteList.length === 1) {
      let data = { shipmentNumber: null, flightKey: null, flightDate: null }
      data.shipmentNumber = shipmentNumber, data.flightDate = null, data.flightKey = null
      this.navigateTo(this.router, "/awbmgmt/shipmentonhold", data);
    }
    else if (this.documentVerificationShipmentCompleteList.length > 1) {
      this.showInfoStatus('import.info109');
    }
    else {
      this.showInfoStatus('import.info105');
    }



  }
  public onRemarks(event) {
    let data = { shipmentNumber: null, flightKey: null, flightDate: null }
    let shipmentNumber = null;
    this.documentVerificationShipmentCompleteList = [];
    const documentVerificationGroup = new DocumentVerificationGroup();
    this.documentVerificationShipmentModelList = (<NgcFormArray>
      this.form.get('documentVerificationShipmentModelList')).getRawValue();
    for (let item of this.documentVerificationShipmentModelList) {
      if (item['selectCheck'] === true) {
        this.documentVerificationShipmentCompleteList.push(item);
        shipmentNumber = item['shipmentNumber'];
      }
    }

    if (this.documentVerificationShipmentCompleteList.length === 1) {
      data.shipmentNumber = shipmentNumber, data.flightDate = null, data.flightKey = null
      this.navigateTo(this.router, "/awbmgmt/maintainremarks", data);
    }
    else if (this.documentVerificationShipmentCompleteList.length > 1) {
      this.showInfoStatus('import.info109');
    }
    else {
      this.showInfoStatus('import.info105');
    }

  }

  public hold() {
    const documentVerificationGroup = new DocumentVerificationGroup();
    this.documentVerificationShipmentCompleteList = [];
    this.documentVerificationShipmentModelList = (<NgcFormArray>
      this.form.get('documentVerificationShipmentModelList')).getRawValue();
    for (let item of this.documentVerificationShipmentModelList) {
      if (item['selectCheck'] === true) {
        item.outboundFlight = null;
        item.readyfordelivery = null;
        this.documentVerificationShipmentCompleteList.push(item);
      }
    }

    if (this.documentVerificationShipmentCompleteList.length > 0) {
      this.showConfirmMessage('hold.shipments').then(fulfilled => {
        this.remarksOnHold = true;
        this.remarks();

      });
    } else {
      this.showInfoStatus("import.info105")
    }
  }
  public navigationReUse() {
    this.supplierNumber = null;
    this.documentVerificationShipmentCompleteList = [];
    const documentVerificationGroup = new DocumentVerificationGroup();
    if (this.documentVerificationShipmentModelListBySegemt.length > 0) {
      this.documentVerificationShipmentModelList = (<NgcFormArray>this.form.get('documentVerificationShipmentModelListBySegemt')).getRawValue();
      for (let item of this.documentVerificationShipmentModelList) {
        if (item['selectCheck'] === true) {
          item.outboundFlight = null;
          item.readyfordelivery = null;
          this.documentVerificationShipmentCompleteList.push(item);
        }
      }
    } else {
      this.documentVerificationShipmentModelList = (<NgcFormArray>this.form.get('documentVerificationShipmentModelList')).getRawValue();
      for (let item of this.documentVerificationShipmentModelList) {
        if (item['selectCheck'] === true) {
          item.outboundFlight = null;
          item.readyfordelivery = null;
          this.documentVerificationShipmentCompleteList.push(item);
        }
      }
    }
    if (this.documentVerificationShipmentCompleteList.length === 0) {
      this.showInfoStatus('import.info106');
      return;
    }
    if (this.documentVerificationShipmentCompleteList.length > 1) {
      this.showInfoStatus('import.info106');
      return;
    } else {
      this.supplierNumber = this.documentVerificationShipmentCompleteList[0].shipmentNumber;
    }
  }

  public remarks() {
    //this.navigationReUse();
    //this.navigateTo(this.router, 'awbmgmt/maintainremarks', { 'shipmentNumber': this.supplierNumber });
    this.form.get('remarks.remarks').reset();
    this.documentVerificationShipmentCompleteList = [];
    const documentVerificationGroup = new DocumentVerificationGroup();
    if (this.documentVerificationShipmentModelListBySegemt.length > 0) {
      this.documentVerificationShipmentModelList = (<NgcFormArray>this.form.get('documentVerificationShipmentModelListBySegemt')).getRawValue();
      for (let item of this.documentVerificationShipmentModelList) {
        if (item['selectCheck'] === true) {
          item.outboundFlight = null;
          item.readyfordelivery = null;
          this.documentVerificationShipmentCompleteList.push(item);
        }
      }
    } else {
      this.documentVerificationShipmentModelList = (<NgcFormArray>this.form.get('documentVerificationShipmentModelList')).getRawValue();
      for (let item of this.documentVerificationShipmentModelList) {
        if (item['selectCheck'] === true) {
          item.outboundFlight = null;
          item.readyfordelivery = null;
          this.documentVerificationShipmentCompleteList.push(item);
        }
      }
    }

    if (this.documentVerificationShipmentCompleteList.length > 0) {
      this.remarksPopup.open();
    } else {
      this.showInfoStatus('import.info105');
    }
  }
  remarkSave() {
    const documentVerificationGroup = new DocumentVerificationGroup();
    if (this.form.get('remarks.remarks').value != null) {
      this.documentVerificationShipmentCompleteList.forEach(element => {
        element.remarks = this.form.get('remarks.remarks').value;
        element.remarkType = this.form.get('remarks.remarkType').value;
      });
      console.log(this.documentVerificationShipmentCompleteList);
      documentVerificationGroup.documentVerificationShipmentModelList = this.documentVerificationShipmentCompleteList
      this.importService.updateShipmentRemarks(documentVerificationGroup).subscribe(data => {
        this.refreshFormMessages(data);
        if (data.messageList === null) {
          this.remarksPopup.hide();
          if (this.remarksOnHold) {
            documentVerificationGroup.documentVerificationShipmentModelList = this.documentVerificationShipmentCompleteList
            this.importService.onHoldShipments(documentVerificationGroup).subscribe(data => {
              this.refreshFormMessages(data);
              if (data.messageList === null) {
                this.getDocumentVerificationTable();
                this.showSuccessStatus('g.completed.successfully');
              }
              this.remarksOnHold = false;
            });
          }

          this.getDocumentVerificationTable();
        } else {
          this.showErrorMessage('remark.content.limit');
        }
      });
    } else {
      this.showErrorMessage('please.enter.remarks');
    }
  }
  public irregularity() {
    this.navigationReUse();
    const dataToNavigate = {
      shipmentnumber: this.supplierNumber,
      shipmentType: 'AWB'
    }
    this.navigateTo(this.router, 'awbmgmt/irregularity', { 'shipmentNumber': this.supplierNumber });
  }

  public shipmentinfo() {
    this.navigationReUse();
    if (this.documentVerificationShipmentCompleteList.length === 1) {
      this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', { 'shipmentNumber': this.supplierNumber });
    }
  }

  public navigateToPrintBarCode() {

    let awbList: AwbPrintRequestList[] = [];
    let awb: AwbPrintRequestList = null;
    if (this.documentVerificationShipmentModelListBySegemt.length > 0) {
      for (let obj of this.form.controls.documentVerificationShipmentModelListBySegemt.value) {
        if (obj.selectCheck && (obj.docRecieved || obj.copyAwb) && (!NgcUtility.isTenantCityOrAirport(obj.origin) && !NgcUtility.isTenantCityOrAirport(obj.destination))) {
          awb = new AwbPrintRequestList();
          awb.awbNumber = obj.shipmentNumber;
          awb.flightOffPoint = obj.origin;
          awb.destination = obj.destination;
          awb.carrierCode = obj.carrierCode;
          awb.shipmentId = obj.shipmentId;
          awb.printerName = this.printerName['value'];
          awb.printerForAT = this.printerForAT;
          awbList.push(awb);
        }
      }
    } else {
      for (let obj of this.form.controls.documentVerificationShipmentModelList.value) {
        if (obj.selectCheck && (obj.docRecieved || obj.copyAwb) && (!NgcUtility.isTenantCityOrAirport(obj.origin) && !NgcUtility.isTenantCityOrAirport(obj.destination))) {
          awb = new AwbPrintRequestList();
          awb.awbNumber = obj.shipmentNumber;
          awb.flightOffPoint = obj.origin;
          awb.destination = obj.destination;
          awb.carrierCode = obj.carrierCode;
          awb.shipmentId = obj.shipmentId;
          awb.printerName = this.printerName['value'];
          awb.printerForAT = this.printerForAT;
          awbList.push(awb);
        }
      }
    }
    console.log(awbList)
    if (awbList.length > 0) {
      this.importService.printMultiAWBBarcode(awbList).subscribe(data => {
        this.refreshFormMessages(data);
        if (data.messageList === null) {
          this.getDocumentVerificationTable();
          this.showSuccessStatus('g.completed.successfully');
          this.istouched = true;
        }
      });
    } else {
      this.showInfoStatus("import.info105")
    }

  }


  public updateDelayforSegment() {
    this.documentVerificationShipmentCompleteList = [];
    const documentVerificationGroup = new DocumentVerificationGroup();
    documentVerificationGroup.flightId = this.form.get('flightId').value;
    documentVerificationGroup.flightNumber = this.form.get('flightNumber').value;
    documentVerificationGroup.flightDate = this.form.get('flightDate').value;
    this.documentVerificationShipmentModelList = (<NgcFormArray>this.form.get('documentVerificationShipmentModelList')).getRawValue();
    for (let item of this.documentVerificationShipmentModelList) {
      //if (item['flagDelete'] === true) {
      item.outboundFlight = null;
      item.readyfordelivery = null;
      this.documentVerificationShipmentCompleteList.push(item);
      //}
    }
    documentVerificationGroup.documentVerificationShipmentModelList = this.documentVerificationShipmentCompleteList;
    this.importService.updatFlightDelayforShipment(documentVerificationGroup).subscribe(data => {
      this.refreshFormMessages(data);
      if (data.messageList === null) {
        this.showSuccessStatus('g.completed.successfully');
      }
    });
  }

  public reOpenDocumentComplete() {
    const documentVerificationRequest: DocumentVerificationRequest = new DocumentVerificationRequest();
    documentVerificationRequest.flightId = this.form.get('flightId').value;
    documentVerificationRequest.flightNumber = this.form.get('flightNumber').value;
    documentVerificationRequest.flightDate = this.form.get('flightDate').value;

    this.importService.reopenDocuementVerification(documentVerificationRequest).subscribe(data => {
      this.refreshFormMessages(data);
      if (data.messageList === null) {
        this.offLoadPopup.hide();
        this.docComeStatus = false;
        this.getDocumentVerificationTable();
        this.showSuccessStatus('g.completed.successfully');
      }
    });

  }


  saveUpdateDocumentVerification() {

    let check;
    this.documentVerificationShipmentCompleteList = [];
    let documentVerificationShipmentModelList: any[] = []
    let fwbRequiredList = null;
    let zeroWeightShipments = null;
    let piecesDiffShipments = null;
    let partShipmentsCountWithZeroWt = 0;
    let tatalandmanifestPicesDiff = 0;
    let fwbRequiredListCount = 0;
    const documentVerificationGroup = new DocumentVerificationGroup();
    documentVerificationGroup.flightId = this.form.get('flightId').value;
    documentVerificationGroup.customsFlightNumber = this.form.get('customsFlightNumber').value;
    if (this.documentVerificationShipmentModelListBySegemt.length > 0) {
      documentVerificationShipmentModelList = (<NgcFormArray>this.form.get('documentVerificationShipmentModelListBySegemt')).getRawValue()
    } else {
      documentVerificationShipmentModelList = (<NgcFormArray>this.form.get('documentVerificationShipmentModelList')).getRawValue();
    }
    console.log(documentVerificationShipmentModelList);

    if (this.form.get(['ata']).value === null) {
      this.showWarningStatus('import.warn106')
      return;
    }

    for (let item of documentVerificationShipmentModelList) {
      if (!NgcUtility.isTenantCityOrAirport(item.destination) && item.foreignAwbWithOnwordInfo == 'Y') {
        this.showErrorStatus(NgcUtility.translateMessage("import.err106", [item.shipmentNumber]));
        return;
      }
      if (item.docRecieved && item.copyAwb) {
        this.showErrorStatus(NgcUtility.translateMessage("import.err107", [item.shipmentNumber]));
        return;
      } else {
        item.outboundFlight = null;
        item.readyfordelivery = null;
        this.documentVerificationShipmentCompleteList.push(item);
        check = true;
      }
      if (item.cpeFwbAction == 'WARNING') {
        ++fwbRequiredListCount;
        if (fwbRequiredList == null) {
          fwbRequiredList = item.shipmentNumber;
        } else {
          fwbRequiredList = fwbRequiredList + "," + item.shipmentNumber;
        }
      }
      if ((item.docRecieved || item.copyAwb) && item.awbWeight === 0) {
        ++partShipmentsCountWithZeroWt;
        if (zeroWeightShipments == null) {
          zeroWeightShipments = item.shipmentNumber;
        } else {
          zeroWeightShipments = zeroWeightShipments + "," + item.shipmentNumber;
        }
      }

      if (item.awbPieces < item.manifestPieces) {
        ++tatalandmanifestPicesDiff;
        if (piecesDiffShipments == null) {
          piecesDiffShipments = item.shipmentNumber;
        } else {
          piecesDiffShipments = piecesDiffShipments + "," + item.shipmentNumber;
        }
      }
    }

    if (partShipmentsCountWithZeroWt > 0) {
      this.showWarningStatus(NgcUtility.translateMessage("import.warn107", [zeroWeightShipments]));
      return;
    }

    if (tatalandmanifestPicesDiff > 0) {
      this.showConfirmMessage(NgcUtility.translateMessage("import.confirm102", [piecesDiffShipments])).then(reason => {
        if (fwbRequiredListCount > 0) {
          this.fwbRequiredConfirmation(fwbRequiredList, documentVerificationGroup, check);
        } else {
          this.saveDocumentVerification(documentVerificationGroup, check);
        }
      }).catch(reason => {
        return;
      });
    } else if (fwbRequiredListCount > 0) {
      this.fwbRequiredConfirmation(fwbRequiredList, documentVerificationGroup, check);
    }
    else {
      this.saveDocumentVerification(documentVerificationGroup, check);
    }
  }

  private fwbRequiredConfirmation(fwbRequiredList: any, documentVerificationGroup: DocumentVerificationGroup, check: any) {
    this.showConfirmMessage(NgcUtility.translateMessage("import.confirm103", [fwbRequiredList])).then(reason => {
      this.saveDocumentVerification(documentVerificationGroup, check);
    }).catch(reason => {
      return;
    });
  }

  public saveDocumentVerification(documentVerificationGroup, check) {
    documentVerificationGroup.flightNumber = this.form.get('flightNumber').value;
    documentVerificationGroup.flightDate = this.form.get('flightDate').value;
    documentVerificationGroup.documentVerificationShipmentModelList = this.documentVerificationShipmentCompleteList;
    if (check) {
      this.importService.saveUpdateDocumentVerification(documentVerificationGroup).subscribe(data => {
        this.refreshFormMessages(data);
        if (data.messageList === null) {
          // this.getDocumentVerificationTable();
          this.showSuccessStatus('g.completed.successfully');
          this.istouched = true;
        }
      });
    } else {
      this.showInfoStatus("import.info105")
    }
  }
  public groupsRenderer = (value: string | number, rowData: any, level: any): string => {
    //console.log(rowData);
    return '&nbsp;&nbsp;<strong> ' + value + '</strong>';
  }
  awbDocument() {
    this.navigationReUse();
    if (this.documentVerificationShipmentCompleteList.length === 1) {
      this.navigateTo(this.router, 'awbmgmt/awbdocument', {
        "shipmentNumber": this.documentVerificationShipmentCompleteList[0].shipmentNumber,
        "shipmentType": 'AWB'
      });
    }
  }

  //****************************************DG POPUP ******************************************************************************************/
  dgdRadioActiveForm: NgcFormGroup = new NgcFormGroup({
    searchFormGroup: new NgcFormGroup({
      shipmentNumber: new NgcFormControl("")
    }),
    dgdRefernceForm: new NgcFormGroup({
      dgdReferenceNo: new NgcFormControl(1),
      awbNumber: new NgcFormControl("")
    }),
    dgdDetailsForm: new NgcFormGroup({
      checkAll: new NgcFormControl(false),
      expDgShipperDeclarationId: new NgcFormControl(),
      dgdReferenceNo: new NgcFormControl(),
      shipmentNumber: new NgcFormControl(),
      departureAirport: new NgcFormControl(),
      destinationAirport: new NgcFormControl(),
      aircraftType: new NgcFormControl(),
      aircraftType1: new NgcFormControl(),
      aircraftType2: new NgcFormControl(),
      shipmentRadioactiveFlag: new NgcFormControl(),
      shipmentRadioactiveFlag1: new NgcFormControl(),
      shipmentRadioactiveFlag2: new NgcFormControl(),
      additionalHandlingInformation: new NgcFormControl(),
      declarationDetails: new NgcFormArray([
        new NgcFormGroup({
          dgRegulationId: new NgcFormControl(),
          unidnumber: new NgcFormControl(),
          dgSubriskCode1: new NgcFormControl(),
          dgSubriskCode2: new NgcFormControl(),
          packingInstructionCategory: new NgcFormControl(),
          packingGroupCode: new NgcFormControl(),
          packagePieces: new NgcFormControl(),
          packageQuantity: new NgcFormControl(),
          packingType: new NgcFormControl(),
          packingInstructions: new NgcFormControl(),
          authorizationDetail: new NgcFormControl(),
          apioNumber: new NgcFormControl(),
          properShippingName: new NgcFormControl(),
          dgclassCode: new NgcFormControl(),
          transportIndex: new NgcFormControl(),
          packingDimension1: new NgcFormControl(),
          packingDimension2: new NgcFormControl(),
          packingDimension3: new NgcFormControl(),
          overPackDelimStr: new NgcFormControl(),
          selectCheckBox: new NgcFormControl(),
          overPackDetails: new NgcFormArray([]),
          packingGroupCodeList: new NgcFormArray([]),
          packingGroupInstructionList: new NgcFormArray([]),
          packingRemarks: new NgcFormControl(),
          unidShc: new NgcFormControl()
        })
      ])
    }),
    dgdOverpackPopupForm: new NgcFormGroup({
      expDgShipperDeclarationId: new NgcFormControl(),
      dgdReferenceNo: new NgcFormControl(),
      dgRegulationId: new NgcFormControl(),
      overpackNumber: new NgcFormControl(),
      autoManualFlag: new NgcFormControl(),
      manualOvp: new NgcFormControl(),
      generateOvp: new NgcFormControl()
    }),
    eliElmFormGroup: new NgcFormGroup({
      eliElmFormDetails: new NgcFormArray([
        new NgcFormGroup({
          selectEliCheckBox: new NgcFormControl(),
          carrierCode: new NgcFormControl(),
          eliElm: new NgcFormControl(),
          flightType: new NgcFormControl(),
          piData: new NgcFormControl(),
          forbiddenFlag: new NgcFormControl(false),
          remark: new NgcFormControl()
        })
      ])
    }),
    dgGroupShipmentList: new NgcFormGroup({
      dgEntryShipmentList: new NgcFormArray([
        new NgcFormGroup({
          shipmentNumber: new NgcFormControl(''),
          shc: new NgcFormControl(''),
          outboundFlight: new NgcFormControl(''),
          elielminfoStatus: new NgcFormControl('')
        })
      ])
    }),
  });
  showFlag: boolean = false;
  searchFlag: boolean = false;
  addFlag: boolean = false;
  deleteArray: any;
  shipmentFlag: boolean = false;
  closeBtn: boolean = false;
  autoOrManualFlag: boolean = false;
  transhipmentFlag: boolean = false;
  counter: number;
  isDGDDetails: boolean = false;
  isAddDgdDocFlag: boolean = false;
  searchResponse: any;
  transhipmentSearchResponse: any;
  dgdReferenceArray: any[];
  isRow() {
    let rowNo = (<NgcFormArray>(
      this.dgdRadioActiveForm.get("dgdDetailsForm").get("declarationDetails")
    )).length;
    if (rowNo > 0) {
      return true;
    } else {
      return false;
    }
  }


  onDeleteRow(item) {
    this.deleteArray = [];
    let select: any = this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails"]).value;
    let index = 0;
    select.forEach(a => {
      if (a["selectCheckBox"]) {
        a["flagCRUD"] = "D";
        this.deleteArray.push(a);
        (<NgcFormArray>(this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails"]))).removeAt(index);
      } else {
        index++;
      }
    });
    this.showErrorMessage('save.after.delete.records');
  }

  getUnidDetailsByPsn(item, index) {
    console.log(item, index);

    var pgCode: any = [];
    var categoryCodes: any = [];
    this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "properShippingName"]).patchValue(item.desc);
    this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "unidShc"]).patchValue(item.param3);
    const dgdDetailsForm: NgcFormGroup = <NgcFormGroup>(this.dgdRadioActiveForm.get("dgdDetailsForm"));

    this.search.dgRegulationId = item.param1;
    this.importService.getDgRegulationsDetails(this.search).subscribe(response => {
      if (response.data) {
        this.dgRegulationRes = response.data;
        if (this.dgRegulationRes[0]) {
          this.dgRegulationId = this.dgRegulationRes[0].regId;
          this.dgRegulationRes[0].dgDetails.forEach(pgRes => {
            pgCode.push(pgRes.pg);
          });

          if (this.dgdRadioActiveForm.get("dgdDetailsForm").get("shipmentRadioactiveFlag").value == "RAD") {
            if (this.dgRegulationRes[0].shc == "RRW") {
              categoryCodes.push("I");
            } else if (this.dgRegulationRes[0].shc == "RRY") {
              categoryCodes.push("II");
              categoryCodes.push("III");
            } else {
              categoryCodes.push("I");
              categoryCodes.push("II");
              categoryCodes.push("III");
            }
          }
        }


        // if (this.dgRegulationRes[0]) {
        this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "dgclassCode"]).patchValue(this.dgRegulationRes[0].classCode);
        this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "dgRegulationId"]).patchValue(this.dgRegulationRes[0].regId);
        this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "packingGroupCodeList"]).patchValue(this.dgRegulationRes[0].packingGroupCodeList);
        this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "packingGroupInstructionList"]).patchValue(this.dgRegulationRes[0].packingGroupInstructionList);
        this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "packagePieces"]).patchValue(null);
        this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "packageQuantity"]).patchValue(null);
        this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "authorizationDetail"]).patchValue(null);
        if (this.dgRegulationRes && this.dgRegulationRes[index] && this.dgRegulationRes[index].packingGroupCodeList.length === 1) {
          this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "packingGroupCode"]).patchValue(this.dgRegulationRes[index].packingGroupCodeList);
        } else {
          this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "packingGroupCode"]).patchValue(null);
        }

        if (this.dgRegulationRes && this.dgRegulationRes[index] && this.dgRegulationRes[index].packingGroupInstructionList.length === 1) {
          this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "packingInstructions"]).patchValue(this.dgRegulationRes[index].packingGroupInstructionList);
        } else {
          this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "packingInstructions"]).patchValue(null);
        }
      }
    });
  }
  onAddRow() {
    const noOfRows = (<NgcFormArray>(this.dgdRadioActiveForm.get("dgdDetailsForm").get("declarationDetails"))).length;
    const lastRow = noOfRows ? (<NgcFormArray>(this.dgdRadioActiveForm.get("dgdDetailsForm").get("declarationDetails"))).controls[noOfRows - 1] : null;
    if (noOfRows > -1) {
      (<NgcFormArray>(this.dgdRadioActiveForm.get("dgdDetailsForm").get("declarationDetails"))).addValue([
        {
          unidnumber: "",
          properShippingName: "",
          dgRegulationId: "",
          dgclassCode: "",
          dgSubriskCode1: "",
          dgSubriskCode2: "",
          packingInstructionCategory: "",
          packingGroupCode: "",
          packagePieces: "",
          packageQuantity: "",
          packingType: "",
          packingInstructions: "",
          authorizationDetail: "",
          apioNumber: "",
          overPackDelimStr: "",
          overPackDetails: new Array(),
          overPackNumber: "",
          transportIndex: "",
          packingDimension1: "",
          packingDimension2: "",
          packingDimension3: "",
          selectCheckBox: false,
          pgList: "",
          piList: "",
          categoryList: "",
          packingGroupCodeList: "",
          packingGroupInstructionList: "",
          packingRemarks: "",
          unidShc: ""
        }
      ]);
    }
  }

  generateApio(event) {
    let declDtlArry = this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails"]).value;
    let apioLast = declDtlArry.filter(decDtlObj => decDtlObj.apioNumber != null && decDtlObj.apioNumber != "").slice(-1)[0];
    if (apioLast) {
      var newApio = parseInt(apioLast.apioNumber) + 1;
    } else {
      var newApio = 1;
    }
    for (let i = declDtlArry.indexOf(apioLast) + 1; i < declDtlArry.length; i++) {
      this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", i, "apioNumber"]).setValue(newApio);
    }
  }

  generateOverpack(event) {
    this.dgdRadioActiveForm.get("dgdOverpackPopupForm").get("generateOvp").patchValue(true);
    this.dgdRadioActiveForm.get("dgdOverpackPopupForm").get("autoManualFlag").patchValue("S");

    this.dgdRadioActiveForm.get(["dgdOverpackPopupForm", "overpackNumber"]).reset();
    this.overpackWindow.open();
    this.closeBtn = false;
    this.autoOrManualFlag = false;
    this.allNumbers = new Array();
  }

  checkForInput(event) {
    this.closeBtn = true;
    this.dgdRadioActiveForm.get("dgdOverpackPopupForm").get("autoManualFlag").patchValue("M");
  }
  saveOverpackWin(event) {
    let overPack = this.dgdRadioActiveForm.get(["dgdOverpackPopupForm", "overpackNumber"]).value;
    if (overPack) {
      let str = overPack.join(",");
      let declDtlArry = this.dgdRadioActiveForm.getRawValue().dgdDetailsForm
        .declarationDetails;
      //fetch last non empty overpack UNID record
      let ovrPackLast = declDtlArry
        .filter(decDtlObj => decDtlObj.overPackDetails.length > 0)
        .slice(-1)[0];
      //last Overpack in UNID
      // let patchOverPackSeq = parseInt(ovrPackLast.overPackDetails.slice(-1)[0].overpackNumber)+1;
      let start = declDtlArry.indexOf(ovrPackLast) + 1;
      let end = declDtlArry.length;
      let i = 0;
      if (ovrPackLast) {
        for (i = start; i < end; i++) {
          this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", i, "overPackDelimStr"]).patchValue(str);
          let over = new Array();
          overPack.forEach(ele => {
            over.push({
              overpackNumber: ele,
              dgRegulationId: this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", i, "dgRegulationId"]).value,
              dgdReferenceNo: this.dgdRadioActiveForm.get(["dgdDetailsForm", "dgdReferenceNo"]).value,
              expDgShipperDeclarationId: null,
              autoManualFlag: this.dgdRadioActiveForm.get(["dgdOverpackPopupForm", "autoManualFlag"]).value
            });
          });
          this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", i, "overPackDetails"]).patchValue(over);
        }
      } else {
        this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", 0, "overPackDelimStr"]).patchValue(str);
        let over = new Array();
        overPack.forEach(ele => {
          over.push({
            overpackNumber: ele,
            dgRegulationId: this.dgRegulationId,
            dgdReferenceNo: this.dgdRadioActiveForm.get(["dgdDetailsForm", "dgdReferenceNo"]).value,
            // dgdReferenceNo: 0,
            expDgShipperDeclarationId: null,
            autoManualFlag: this.dgdRadioActiveForm.get(["dgdOverpackPopupForm", "autoManualFlag"]).value
          });
        });
        let dgdDetailsRec = this.dgdRadioActiveForm.get([
          "dgdDetailsForm",
          "declarationDetails",
          0
        ]).value;
        dgdDetailsRec.overPackDetails = over;
        this.dgdRadioActiveForm
          .get(["dgdDetailsForm", "declarationDetails", 0])
          .patchValue(dgdDetailsRec);
      }
    }
    this.overpackWindow.close();
  }
  genOverpackNum(event) {
    this.counter++;
    this.allNumbers.push(this.counter);
    this.dgdRadioActiveForm
      .get(["dgdOverpackPopupForm", "overpackNumber"])
      .patchValue(this.allNumbers);
  }
  onSelectAircraft1() {
    this.dgdRadioActiveForm.get('dgdDetailsForm.aircraftType').patchValue("PAX");
  }
  onSelectAircraft2() {
    this.dgdRadioActiveForm.get('dgdDetailsForm.aircraftType').patchValue("CAO");
  }
  onSave(event) {

    const dgdDetailsForm: NgcFormGroup = <NgcFormGroup>(this.dgdRadioActiveForm.get("dgdDetailsForm"));
    // Validate
    dgdDetailsForm.validate();
    // If Invalid, Don't Process
    // if (this.dgdRadioActiveForm.get("dgdDetailsForm").invalid) {
    //   return;
    // }
    let req: any;
    req = this.dgdRadioActiveForm.getRawValue();
    req.dgRegulationId = this.dgRegulationId;
    req.dgdDetailsForm.shipmentNumber = this.dgdRadioActiveForm.get(["searchFormGroup", "shipmentNumber"]).value;
    if (req.dgdDetailsForm.dgdReferenceNo === null) {
      req.dgdDetailsForm.dgdReferenceNo = 0;
    }
    if (!req.dgdDetailsForm.aircraftType1 && !req.dgdDetailsForm.aircraftType2) {
      this.showErrorMessage("select.aircraft.type");
      return;
    }
    if (req.dgdDetailsForm.aircraftType1) {
      req.dgdDetailsForm.aircraftType = 'PAX';
    } else if (req.dgdDetailsForm.aircraftType2) {
      req.dgdDetailsForm.aircraftType = 'CAO';
    }

    if (req && req.dgdDetailsForm && req.dgdDetailsForm.declarationDetails) {
      req.dgdDetailsForm.declarationDetails.forEach(record => {
        if (record.packingGroupCode instanceof Array) {
          let packingGroupCode = record.packingGroupCode[0];
          record.packingGroupCode = null;
          record.packingGroupCode = packingGroupCode;
        }
        record.packingGroupCodeList = null;
      });
    }
    console.log(req.dgdDetailsForm);

    this.importService.saveDGDDetails(req.dgdDetailsForm).subscribe(response => {
      if (!this.showResponseErrorMessages(response, null, "dgdDetailsForm")) {
        this.dgEntrypopup.close();
        this.showSuccessStatus("g.completed.successfully");
      } else {
        this.isDGDDetails = false;
      }
    });

    let req2: any = this.dgdRadioActiveForm.getRawValue();
    req2.dgdDetailsForm.declarationDetails = this.deleteArray;
    req2.dgdDetailsForm.shipmentNumber = this.dgdRadioActiveForm.get([
      "searchFormGroup",
      "shipmentNumber"
    ]).value;

    //req2.dgdDetailsForm.flagCRUD = "D";
    if (req2.dgdDetailsForm.declarationDetails) {
      this.importService
        .deleteDgDecDetails(req2.dgdDetailsForm)
        .subscribe(response => {
          if (response.data == null) {
            // this.showErrorStatus(response.messageList[0].message);
            this.isDGDDetails = false;
          } else {
            this.deleteArray = new Array();
          }
        });
    }
  }
  onSearch(formGroup: NgcFormGroup) {
    this.addFlag = false;
    this.searchFlag = false;
    this.isAddDgdDocFlag = false;
    this.searchResponse = "";
    this.dgdReferenceArray = new Array();
    // this.dgdReferenceArray.push("Select");
    //
    const decDetails: NgcFormArray = this.dgdRadioActiveForm.get('dgdDetailsForm.declarationDetails') as NgcFormArray;
    if (decDetails) {
      decDetails.resetValue([]);
    }
    const searchFormGroup: NgcFormGroup = <NgcFormGroup>(
      this.dgdRadioActiveForm.get("searchFormGroup")
    );
    searchFormGroup.validate();
    if (this.dgdRadioActiveForm.get("searchFormGroup").invalid) {
      return;
    }
    const req: DgdAWBNumber = new DgdAWBNumber();
    req.flagCRUD = "C";
    req.shipmentNumber = searchFormGroup.get("shipmentNumber").value;
    req.dgdReferenceNo = 0;

    this.resetFormMessages();
    this.importService.getDGDDetails(req).subscribe(response => {
      console.log(response.data);
      if (response.data.length == 0) {
        this.showInfoStatus("import.info111");
        this.isDGDDetails = false;
        this.showFlag = true;
        this.searchResponse = "";
        var shipmentNo = this.dgdRadioActiveForm.get([
          "searchFormGroup",
          "shipmentNumber"
        ]).value;
        this.dgdRadioActiveForm
          .get(["dgdRefernceForm", "awbNumber"])
          .patchValue(req.shipmentNumber);
      } else {
        this.showFlag = true;
        this.isAddDgdDocFlag = true;
        this.isDGDDetails = true;
        this.searchResponse = response.data;
        this.dgdRadioActiveForm
          .get(["dgdRefernceForm", "awbNumber"])
          .patchValue(req.shipmentNumber);
        this.dgdReferenceArray = new Array();
        this.dgdReferenceArray.push("Select");
        // this.searchResponse.forEach(element => {
        //   this.dgdReferenceArray.push(element.dgdReferenceNo);
        // });

        if (this.searchResponse) {
          this.searchResponse.forEach(element => {
            if (
              element.dgdReferenceNo != null &&
              element.dgdReferenceNo != -1
            ) {
              console.log("Inside If : ", this.searchResponse);
              // this.transhipmentFlag = false;
              this.dgdReferenceArray.push(element.dgdReferenceNo);
            } else {
              console.log("Inside Else : ", this.searchResponse);
              this.transhipmentFlag = true;
              this.transhipmentSearchResponse = response.data;
            }
          });
        }
        (<NgcFormArray>(
          this.dgdRadioActiveForm.get(["dgdRefernceForm", "dgdReferenceNo"])
        )).patchValue(this.dgdReferenceArray);
      }
      if (this.dgdReferenceArray.length > 0) {
        let dgdRefNumber = 1;
        this.dgdRadioActiveForm.get("dgdDetailsForm").reset();
        this.dgdRadioActiveForm.get(["dgdDetailsForm", "additionalHandlingInformation"]).patchValue(this.searchResponse.additionalHandlingInformation);
        this.searchResponse.forEach(dgdRecObj => {
          if (dgdRecObj.dgdReferenceNo == dgdRefNumber) {
            if (dgdRecObj.aircraftType == "PAX") {
              this.dgdRadioActiveForm.get("dgdDetailsForm").get("aircraftType1").patchValue(true);
              this.dgdRadioActiveForm.get("dgdDetailsForm").get("aircraftType2").patchValue(false);
            } else if (dgdRecObj.aircraftType == "CAO") {
              this.dgdRadioActiveForm.get("dgdDetailsForm").get("aircraftType2").patchValue(true);
              this.dgdRadioActiveForm.get("dgdDetailsForm").get("aircraftType1").patchValue(false);
            }
            if (dgdRecObj.shipmentRadioactiveFlag == "RAD") {
              this.dgdRadioActiveForm.get("dgdDetailsForm").get("shipmentRadioactiveFlag1").patchValue(true);
              this.dgdRadioActiveForm.get("dgdDetailsForm").get("shipmentRadioactiveFlag2").patchValue(false);
            } else if (dgdRecObj.shipmentRadioactiveFlag == "NON") {
              this.dgdRadioActiveForm.get("dgdDetailsForm").get("shipmentRadioactiveFlag2").patchValue(true);
              this.dgdRadioActiveForm.get("dgdDetailsForm").get("shipmentRadioactiveFlag1").patchValue(false);
            }

            dgdRecObj.checkAll = false;

            if (dgdRecObj.declarationDetails.length == 0) {
              this.dgdRadioActiveForm.get("dgdDetailsForm").patchValue(dgdRecObj);
            }
            // this.dgdRadioActiveForm.get('dgdDetailsForm').patchValue(dgdRecObj);
            dgdRecObj.declarationDetails.forEach((decDtlRecObj, index) => {
              decDtlRecObj["selectCheckBox"] = false;
              decDtlRecObj["overPackDelimStr"] = "";
              decDtlRecObj.overPackDetails.forEach(dtlOvrPackObj => {
                if (decDtlRecObj.overPackDelimStr === "") {
                  decDtlRecObj.overPackDelimStr = dtlOvrPackObj.overpackNumber;
                } else {
                  decDtlRecObj.overPackDelimStr += "," + dtlOvrPackObj.overpackNumber;
                }
                if (dgdRecObj.autoManualFlag == "S") {
                  this.dgdRadioActiveForm.get("dgdOverpackPopupForm").get("generateOvp").patchValue(true);
                  this.dgdRadioActiveForm.get("dgdOverpackPopupForm").get("manualOvp").patchValue(false);
                } else if (dgdRecObj.autoManualFlag == "M") {
                  this.dgdRadioActiveForm.get("dgdOverpackPopupForm").get("manualOvp").patchValue(true);
                  this.dgdRadioActiveForm.get("dgdOverpackPopupForm").get("generateOvp").patchValue(false);
                }
              });
              // if (this.dgdRadioActiveForm && this.dgdRadioActiveForm.get(["dgdDetailsForm"]) && this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index])) {
              //   this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "packingGroupCode"]).patchValue(decDtlRecObj.packingGroupCode);
              //   this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "packingInstructions"]).patchValue(decDtlRecObj.packingInstructions);
              //   this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "packingInstructionCategory"]).patchValue(decDtlRecObj.packingInstructionCategory);

              // }
              // (<NgcFormArray>this.dgdRadioActiveForm.get(['dgdDetailsForm', 'declarationDetails', index, 'packingGroupCode'])).patchValue(decDtlRecObj.packingGroupCode);
              // this.search.unid = decDtlRecObj.unidnumber;
              // this.search.psn = decDtlRecObj.properShippingName;
              this.search.dgRegulationId = decDtlRecObj.dgRegulationId;
              this.dgdRadioActiveForm.get("dgdDetailsForm").patchValue(dgdRecObj);
            });

            //this.dgdRadioActiveForm.get('dgdDetailsForm').patchValue(dgdRecObj);
          }
        });

      }

      if (this.dgdRadioActiveForm.get('dgdDetailsForm.departureAirport').value === null) {
        let departureAirport = formGroup.get('origin').value;
        this.dgdRadioActiveForm.get('dgdDetailsForm.departureAirport').patchValue(departureAirport);


      }
      if (this.dgdRadioActiveForm.get('dgdDetailsForm.destinationAirport').value === null) {
        let destinationAirport = formGroup.get('destination').value;
        this.dgdRadioActiveForm.get('dgdDetailsForm.destinationAirport').patchValue(destinationAirport);

      }

      if (!this.dgdRadioActiveForm.get('dgdDetailsForm.shipmentRadioactiveFlag1').value) {
        this.dgdRadioActiveForm.get('dgdDetailsForm.shipmentRadioactiveFlag2').patchValue(true);
      }

      // if (this.dgdRadioActiveForm.get('dgdDetailsForm.shipmentRadioactiveFlag2').value) {
      //   this.dgdRadioActiveForm.get('dgdDetailsForm.shipmentRadioactiveFlag2').patchValue(true);
      // }
      // this.dgdRadioActiveForm.get('dgdDetailsForm.shipmentRadioactiveFlag2').patchValue(true);
      //  this.dgdRadioActiveForm.get('dgdDetailsForm.dgdReferenceNo').patchValue(0);
    },
      error => {
        this.showErrorStatus("Error:" + error);
      }
    );
  }
  getOverPackSeqNo() {
    let req: any = new Object();
    req.shipmentNumber = this.dgdRadioActiveForm.get([
      "searchFormGroup",
      "shipmentNumber"
    ]).value;
    this.importService
      .getOverPackSequenceNumber(req)
      .subscribe(response => {
        this.counter = response.data;
      });
  }

  getDGDDataByRefNo(event) {
    let dgdRefNumber = event;
    if (dgdRefNumber[0] == "Select") {
      dgdRefNumber = 1;
      this.searchFlag = true;
    } else {
      this.searchFlag = true;
    }
    this.getOverPackSeqNo();
    this.dgdRadioActiveForm.get("dgdDetailsForm").reset();
    this.dgdRadioActiveForm
      .get(["dgdDetailsForm", "additionalHandlingInformation"])
      .patchValue(this.searchResponse.additionalHandlingInformation);
    this.searchResponse.forEach(dgdRecObj => {
      if (dgdRecObj.dgdReferenceNo == dgdRefNumber) {
        if (dgdRecObj.aircraftType == "PAX") {
          this.dgdRadioActiveForm
            .get("dgdDetailsForm")
            .get("aircraftType1")
            .patchValue(true);
          this.dgdRadioActiveForm
            .get("dgdDetailsForm")
            .get("aircraftType2")
            .patchValue(false);
        } else if (dgdRecObj.aircraftType == "CAO") {
          this.dgdRadioActiveForm
            .get("dgdDetailsForm")
            .get("aircraftType2")
            .patchValue(true);
          this.dgdRadioActiveForm
            .get("dgdDetailsForm")
            .get("aircraftType1")
            .patchValue(false);
        }
        if (dgdRecObj.shipmentRadioactiveFlag == "RAD") {
          this.dgdRadioActiveForm
            .get("dgdDetailsForm")
            .get("shipmentRadioactiveFlag1")
            .patchValue(true);
          this.dgdRadioActiveForm
            .get("dgdDetailsForm")
            .get("shipmentRadioactiveFlag2")
            .patchValue(false);
        } else if (dgdRecObj.shipmentRadioactiveFlag == "NON") {
          this.dgdRadioActiveForm
            .get("dgdDetailsForm")
            .get("shipmentRadioactiveFlag2")
            .patchValue(true);
          this.dgdRadioActiveForm
            .get("dgdDetailsForm")
            .get("shipmentRadioactiveFlag1")
            .patchValue(false);
        }

        dgdRecObj.checkAll = false;

        if (dgdRecObj.declarationDetails.length == 0) {
          this.dgdRadioActiveForm.get("dgdDetailsForm").patchValue(dgdRecObj);
        }
        // this.dgdRadioActiveForm.get('dgdDetailsForm').patchValue(dgdRecObj);
        dgdRecObj.declarationDetails.forEach((decDtlRecObj, index) => {
          decDtlRecObj["selectCheckBox"] = false;
          decDtlRecObj["overPackDelimStr"] = "";
          decDtlRecObj.overPackDetails.forEach(dtlOvrPackObj => {
            if (decDtlRecObj.overPackDelimStr === "") {
              decDtlRecObj.overPackDelimStr = dtlOvrPackObj.overpackNumber;
            } else {
              decDtlRecObj.overPackDelimStr +=
                "," + dtlOvrPackObj.overpackNumber;
            }
            if (dgdRecObj.autoManualFlag == "S") {
              this.dgdRadioActiveForm
                .get("dgdOverpackPopupForm")
                .get("generateOvp")
                .patchValue(true);
              this.dgdRadioActiveForm
                .get("dgdOverpackPopupForm")
                .get("manualOvp")
                .patchValue(false);
            } else if (dgdRecObj.autoManualFlag == "M") {
              this.dgdRadioActiveForm
                .get("dgdOverpackPopupForm")
                .get("manualOvp")
                .patchValue(true);
              this.dgdRadioActiveForm
                .get("dgdOverpackPopupForm")
                .get("generateOvp")
                .patchValue(false);
            }
          });

          this.search.dgRegulationId = decDtlRecObj.dgRegulationId;
          this.dgdRadioActiveForm.get("dgdDetailsForm").patchValue(dgdRecObj);
        });
      }
    });
  }

  //********************************************ENDS*************************************************//
  //********************************************ELI?ELM POPUP STARTS HERE**************************** */

  //Open ELI/ELM DirectButton
  openEliElmShipmentList() {
    this.dgeliElmWindow.open();
    let array: any[] = [];
    this.resp.data.documentVerificationShipmentModelList.forEach(element => {
      if (
        !NgcUtility.isTenantCityOrAirport(element.origin)
        && !NgcUtility.isTenantCityOrAirport(element.destination)
        && element.shc !== null
        && (element.shc.indexOf('ELI') >= 0
          || element.shc.search('ELM') >= 0)
      ) {
        const data: any = new Object();
        data.shipmentNumber = element.shipmentNumber;
        data.shc = element.shc;
        if (element.eliInfo == 'Y' || element.elmInfo == 'Y') {
          data.elielminfoStatus = 'YES';
        } else {
          data.elielminfoStatus = 'NO';
        }
        data.outboundFlight = element.outboundFlight;
        array.push(data);
      }
    });
    this.dgdRadioActiveForm.get(['dgGroupShipmentList', 'dgEntryShipmentList']).patchValue(array);
  }

  addEliElmDataForMultipleShipmets(eventData: any, index) {
    //reset the value
    this.freeTextifOutboundFlightNotExist = false;
    this.elielmDropdownCheck = false;
    this.eliElmIndex = index;
    //console.log(eventData);
    if (eventData.outboundFlight == null) {
      this.freeTextifOutboundFlightNotExist = true;
    } else {
      this.freeTextifOutboundFlightNotExist = false;
    }

    this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails"]).patchValue([]);
    this.eliShipmentNumber = null;
    let array: any[] = [];
    const eliGetReq: any = new Object();
    eliGetReq.shipmentNumber = eventData.shipmentNumber;
    this.eliShipmentNumber = eventData.shipmentNumber;
    this.importService.getEliDetails(eliGetReq).subscribe(eliRes => {
      console.log(eliRes.data);
      if (eliRes.data) {
        if (eliRes.data.eliElmFormDetails) {
          eliRes.data.eliElmFormDetails.forEach(element => {
            element.selectEliCheckBox = false;
          });
        }
      }
      if (eliRes.data && eliRes.data.eliElmFormDetails.length > 0) {
        this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails"]).patchValue(eliRes.data.eliElmFormDetails);
      } else {
        this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails"]).patchValue([]);
        this.onAddEliRow();
        if (eventData.outboundFlight != null && eventData.outboundFlight != '') {
          this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails", 0, 'carrierCode']).setValue(eventData.outboundFlight.substring(0, 2));
        }
      }
      if ((eventData.shc.indexOf('ELI') >= 0)
      ) {
        this.elielmDropdownCheck = true;
        this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails", 0, 'eliElm']).setValue('ELI');
      }
      if ((eventData.shc.indexOf('ELM') >= 0)
      ) {
        this.elielmDropdownCheck = true;
        this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails", 0, 'eliElm']).setValue('ELM');
      }
      if ((eventData.shc.indexOf('ELI') >= 0
        && eventData.shc.search('ELM') >= 0)
      ) {
        this.elielmDropdownCheck = false;
      }
      this.eliElmWindow.open();
    },
      error => {
        this.showErrorStatus("Error:" + error);
      }
    );
  }

  protected afterFocus() {
    this.async(() => {
      try {
        (this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails", 0, 'flightType']) as NgcFormControl).focus();
      } catch (e) { }
    }, 100);
  }

  onCancelEliElmDetails() {
    this.eliElmWindow.close();
    this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails"]).reset();
  }

  saveEliElmDetails() {

    const eliElmFormGroup: NgcFormGroup = <NgcFormGroup>(this.dgdRadioActiveForm.get("eliElmFormGroup"));
    eliElmFormGroup.validate();
    if (this.dgdRadioActiveForm.get("eliElmFormGroup").invalid) {
      this.showErrorMessage("mandatory.field.not.empty")
      return;
    }
    let eliSaveReq = new EliElmSavRequest();
    eliSaveReq.shipmentNumber = this.eliShipmentNumber;
    eliSaveReq.boardPoint = this.resp.data.origin;
    eliSaveReq.offPoint = this.resp.data.destination;
    eliSaveReq.eliElmFormDetails = [];
    eliSaveReq.eliElmFormDetails = eliElmFormGroup.getRawValue().eliElmFormDetails;
    this.resetFormMessages();
    this.importService.saveDGDEliElmDetails(eliSaveReq).subscribe(response => {
      if (!this.showResponseErrorMessages(response, null, "eliElmFormGroup")) {
        this.eliElmWindow.close();
        this.dgdRadioActiveForm.get(['dgGroupShipmentList', 'dgEntryShipmentList', this.eliElmIndex, 'elielminfoStatus']).setValue('YES');
        this.showSuccessStatus("g.completed.successfully");
      }
    });

  }

  getRemark(data, index) {
    let formData = (this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails", index]) as NgcFormGroup).getRawValue();
    const gerRemarkReq: any = new Object();
    gerRemarkReq.carrierCode = formData.carrierCode;
    gerRemarkReq.eliElm = formData.eliElm;
    gerRemarkReq.flightType = formData.flightType;
    gerRemarkReq.piData = formData.piData;
    gerRemarkReq.shipmentNumber = this.eliShipmentNumber;
    this.resetFormMessages();
    if (gerRemarkReq && (gerRemarkReq.eliElm !== '') && (gerRemarkReq.flightType !== '') && (gerRemarkReq.piData !== '')) {
      this.importService.getRemarkOnPiAndShc(gerRemarkReq).subscribe(remarkRes => {
        if (remarkRes.data && remarkRes.data.remark) {
          this.handlingInstrctionsFound = true;
          this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails", index, "remark"]).patchValue(remarkRes.data.remark);
        }
        else {
          if (!this.freeTextifOutboundFlightNotExist) {
            this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails", index, "remark"]).reset();
            this.showConfirmMessage('handling.instruction.not.configured.outbound').then(reason => {
              this.freeTextifOutboundFlightNotExist = true;
            }).catch(reason => {
              this.freeTextifOutboundFlightNotExist = false;
            });
          } else {
            this.handlingInstrctionsFound = false;
            this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails", index, "remark"]).patchValue(null);
            this.showErrorMessage("handling.instruction.not.configured")
          }
        }
        error => {
          this.showErrorStatus("Error:" + error);
        }
      });
    }

  }
  onDeleteEliRow(item) {
    let elmDetails: any[] = [];
    let index = 0;
    let elidelReq2: any = (<NgcFormArray>this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails"])).getRawValue();
    const finaleliObject: any = new Object();
    elidelReq2.forEach(a => {
      if (a["selectEliCheckBox"] && a["flagCRUD"] == "C") {
        (<NgcFormArray>(this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails"]))).removeAt(index);
      } else {
        index++;
      }
    });

    elidelReq2.forEach(element => {
      const eliObject: any = new Object();
      if (element.selectEliCheckBox && element.flagCRUD == 'U') {
        eliObject.transactionSequenceNo = element.transactionSequenceNo;
        elmDetails.push(eliObject);
      }
    });
    finaleliObject.eliElmFormDetails = elmDetails;
    if (finaleliObject.eliElmFormDetails.length <= 0) {
      this.showInfoStatus("import.info105");
      return;
    }
    this.importService.deleteDGDEliElmDetails(finaleliObject).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus("g.deleted.successfully");
        this.eliElmWindow.close();
      }
    });

  }
  //*********************************************ELI ELM END************************************************ */


  private rowCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();

    if (rowData.awbPieceWeight.indexOf('/ 0.0') >= 0
      && rowData.irregularity === null) {
      rowData.reason = 'Weight is info is required';
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shc !== null && !NgcUtility.isTenantCityOrAirport(rowData.destination)) {
      if (rowData.elmInfo !== 'Y' && rowData.throughService === 'N' && rowData.shc.search('ELM') >= 0
      ) {
        cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
        rowData.reason = 'ELM details required';
      }
      if (rowData.eliInfo !== 'Y' && rowData.throughService === 'N' && rowData.shc.indexOf('ELI') >= 0
      ) {
        cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
        rowData.reason = 'ELI details required';
      }
      if (rowData.dgInfo !== 'Y'
        && (rowData.shc.indexOf('RLI') >= 0
          || rowData.shc.search('RLM') >= 0
          || rowData.shc.search('RLB') >= 0)) {
        cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
        rowData.reason = 'DG Declaration entry is required';
      }

    }
    if (rowData.awbPieces < rowData.manifestPieces) {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
      rowData.reason = 'THE SUM OF MANIFEST PIECES MORE THAN TOTAL PIECES';
    }
    if (rowData.cpeFwbAction == 'ERROR' || rowData.cpeFwbAction == 'WARNING' || rowData.cpeFwbAction == 'INFO') {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    let data = rowData.awbPieceWeight;
    if (data) {
      data = data + '';
      if (data.includes("/")) {
        if (data.split("/")[1] === null) {
          rowData.reason = 'Weight is info is required';
          cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
        }
      }
    }
    if ((rowData.eawb === 'Y' || rowData.eaw === 'Y' || rowData.eap === 'Y') && rowData.fwb === 'Y' && !rowData.copyAwb) {
      rowData.docRecieved = 'true';
    }
    return cellsStyle;
  };

  public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {

    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.locked === "Y" && rowData.partShipment === "Y") {
      const rowId: number = rowData.NGC_ROW_ID;
      cellsStyle.data = ` ${value} (P)
       <a href="javascript:void(0)" data-row="${rowId}" data-column="${column}">
        <i class="fa fa-lock"  style="color:red" data-row="${rowId}" data-column="${column}"></i>
       </a> `;
    }
    else if (rowData.locked === "Y") {
      // console.log(rowData);
      // console.log(cellsStyle.className);
      const rowId: number = rowData.NGC_ROW_ID;
      cellsStyle.data = ` ${value}
       <a href="javascript:void(0)" data-row="${rowId}" data-column="${column}">
        <i class="fa fa-lock"  style="color:red" data-row="${rowId}" data-column="${column}"></i>
       </a>`;

    } else if (rowData.partShipment === "Y") {
      // console.log(rowData);
      // console.log(cellsStyle.className);
      const rowId: number = rowData.NGC_ROW_ID;
      cellsStyle.data = ` ${value}   (P)  `;

    } else if (rowData.offloadRemarksCode) {
      const rowId: number = rowData.NGC_ROW_ID;
      cellsStyle.data = ` ${value}   (OFLD)  `;
    }
    else {
      cellsStyle.data = value;

    }

    return cellsStyle;
  };
  //for Serial Number
  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  onAddEliRow() {
    this.handlingInstrctionsFound = false;
    const noOfRows = (<NgcFormArray>(this.dgdRadioActiveForm.get("eliElmFormGroup").get("eliElmFormDetails"))).length;
    if (noOfRows > -1) {
      (<NgcFormArray>(
        this.dgdRadioActiveForm.get("eliElmFormGroup").get("eliElmFormDetails")
      )).addValue([
        {
          selectEliCheckBox: false,
          carrierCode: noOfRows == 0 ? null : (<NgcFormArray>(this.dgdRadioActiveForm.get("eliElmFormGroup").get("eliElmFormDetails"))).value[0].carrierCode,
          eliElm: noOfRows == 0 ? null : (<NgcFormArray>(this.dgdRadioActiveForm.get("eliElmFormGroup").get("eliElmFormDetails"))).value[0].eliElm,
          flightType: "",
          piData: "",
          forbiddenFlag: false,
          remark: null,
          flagCRUD: 'C'
        }
      ]);
    }
  }
  closeElielm() {
    this.getDocumentVerificationTable();
  }

  updateBooking() {
    let ind: any = 0;
    this.multiselect = 0;
    this.documentVerificationShipmentCompleteList = [];
    if (this.documentVerificationShipmentModelListBySegemt.length > 0) {
      this.documentVerificationShipmentModelList = (<NgcFormArray>this.form.get('documentVerificationShipmentModelListBySegemt')).getRawValue();
      for (let item of this.documentVerificationShipmentModelList) {
        if (item['selectCheck'] === true) {
          this.documentVerificationShipmentCompleteList.push(item);
        }
      }
    } else {
      this.documentVerificationShipmentModelList = (<NgcFormArray>this.form.get('documentVerificationShipmentModelList')).getRawValue();
      for (let item of this.documentVerificationShipmentModelList) {
        if (item['selectCheck'] === true) {
          this.documentVerificationShipmentCompleteList.push(item);
        }
      }
    }

    if (this.documentVerificationShipmentCompleteList.length == 1) {
      this.updateBookingWindow.open();
      this.updateBookingObject = {
        shipmentNumber: this.documentVerificationShipmentCompleteList[0].shipmentNumber,
        //shipmentDate: this.inboundBreakDowndata.shipmentdate
      }
    } else {
      this.showInfoStatus('select.one.record');
    }

  }
  closeUpdateBooking() {
    this.updateBookingWindow.close();
  }
  onChangeFlight() {
    this.dataSyncSearch = 0;
  }

  print() {
    this.reportParameters = new Object();
    const reportParameters: any = {};
    reportParameters.FlightKey = this.form.get('flightNumber').value;
    reportParameters.FlightDate = this.form.get('flightDate').value;
    reportParameters.TenantId = "AAT";
    this.reportParameters = reportParameters;
    this.reportWindow.downloadReport();
  }
  sendEmailReport() {
    const documentVerificationRequest: DocumentVerificationRequest = new DocumentVerificationRequest();
    documentVerificationRequest.flightNumber = this.form.get('flightNumber').value;
    documentVerificationRequest.flightDate = this.form.get('flightDate').value;
    documentVerificationRequest.flightSegmentId = 0;
    this.resetFormMessages();
    this.importService.sendEmailSpecialCargoHandlingForm(documentVerificationRequest).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.showErrorMessage('Error sending email');
      }
    }
    )
  }


}


