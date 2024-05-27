import { ApplicationFeatures } from './../../common/applicationfeatures';
import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcFormControl, PageConfiguration, NgcReportComponent, NgcUtility, NgcCheckBoxComponent } from 'ngc-framework';
import { ImportService } from "../import.service";
import { Validators, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-customorderexamination',
  templateUrl: './customorderexamination.component.html',
  styleUrls: ['./customorderexamination.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class CustomorderexaminationComponent extends NgcPage implements OnInit {
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('showPopUpWindow') showPopUpWindow: NgcWindowComponent;
  showTable: boolean = false;
  customOrderSaveRequest: any;
  customOrderNextRequest: any;
  requestPieces: any = null;
  customDetailsInfo: any;
  hawbSourceParameters: {};
  handledByMasterHouse: boolean;
  checkFlag: any = 0;
  printerName: any;
  checkPrint: boolean = false;
  printDisable: number = 0;
  disablePiecesFlag: boolean = false;
  locationDetailsInfo: any = [];
  reportParameters: any;
  reportFlag: boolean = false;
  shipmentType1: any = "AWB";
  patchDataValue: { shipmentNumber: any; };
  inspectionNumber: any;
  createFlag: boolean = false;
  arraySelectedFlight: any = [];
  arrayForLocation: any = [];
  createOnFFEFlag: boolean = false;
  reportFlightId: any;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private importService: ImportService, private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }
  private customOrderExaminationForm: NgcFormGroup = new NgcFormGroup(
    {
      flightId: new NgcFormControl(),
      flightKey: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      inspectionNumber: new NgcFormControl(),
      inspectionAuthority: new NgcFormControl(),
      inspectionRequestedBy: new NgcFormControl(),
      inspectionRequestedOnDt: new NgcFormControl(),
      inspectionRequestType: new NgcFormControl(),
      inspectionRequestPieces: new NgcFormControl(),
      movedToInspectionPieces: new NgcFormControl(),
      movedToInspectionDt: new NgcFormControl(),
      inspectedPieces: new NgcFormControl(),
      inspectedDt: new NgcFormControl(),
      inspectionStatus: new NgcFormControl(),
      inspectionStatusDt: new NgcFormControl(),
      customsImportDocumentNumber: new NgcFormControl(),
      customsImportDocumentDate: new NgcFormControl(),
      customsImportDocumentType: new NgcFormControl(),
      customsImportFlightNumber: new NgcFormControl(),
      customsImportFlightDate: new NgcFormControl(),
      customsStationCode: new NgcFormControl(),
      customsAgentCode: new NgcFormControl(),
      importerLicenseNo: new NgcFormControl(),
      shipmentId: new NgcFormControl(),
      shipmentNumber: new NgcFormControl(),
      shipmentDate: new NgcFormControl(),
      shipmentType: new NgcFormControl(),
      shipmentHouseId: new NgcFormControl(),
      hawbNumber: new NgcFormControl(),
      svc: new NgcFormControl(),
      chargeCode: new NgcFormControl('', Validators.required),
      origin: new NgcFormControl(),
      destination: new NgcFormControl(),
      deliveryPieces: new NgcFormControl(),
      deliveryWeight: new NgcFormControl(),
      chargeableWeight: new NgcFormControl(),
      natureOfGoodsDescription: new NgcFormControl(),
      shc: new NgcFormControl(),
      consigneeName: new NgcFormControl(),
      notifyParty: new NgcFormControl(),
      customerId: new NgcFormControl(),
      appointedAgent: new NgcFormControl(),
      blackListed: new NgcFormControl(),
      remarks: new NgcFormControl('', [Validators.required, Validators.maxLength(75)]),
      lastUpdatedDateTime: new NgcFormControl(),
      locationDetailsInfo: new NgcFormArray([

      ]),
      customDetailsInfo: new NgcFormArray([]),
      hawbInfo: new NgcFormGroup({
        hawbNumber: new NgcFormControl(),
        hawbOrigin: new NgcFormControl(),
        hawbDestination: new NgcFormControl(),
        hawbPieces: new NgcFormControl(),
        hawbWeight: new NgcFormControl(),
        hawbChargeableWeight: new NgcFormControl(),
        hawbNatureOfGoodsDescription: new NgcFormControl(),
        hawbDeliveredPieces: new NgcFormControl(),
        hawbDeliveredWeight: new NgcFormControl(),
        hawbShc: new NgcFormControl(),
        consigneeName: new NgcFormControl(),
        appointedAgent: new NgcFormControl(),
        notifyParty: new NgcFormControl(),
        paymentStatus: new NgcFormControl(),
        hawbCustomerId: new NgcFormControl()
      })
    }
  )
  ngOnInit() {
    super.ngOnInit();
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData != null) {

      this.customOrderExaminationForm.get('shipmentNumber').setValue(forwardedData.shipmentNumber);
      if (forwardedData.hawbnumber != null) {
        this.handledByMasterHouse = true;
        this.customOrderExaminationForm.get('hawbNumber').setValidators([Validators.required, Validators.maxLength(16)]);
      }
      else {
        this.handledByMasterHouse = false;
      }
      this.customOrderExaminationForm.get('hawbNumber').setValue(forwardedData.hawbnumber);
      this.customOrderExaminationForm.get('inspectionNumber').setValue(forwardedData.inspectionNumber);
      this.onSearch();
    }

  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  //On search
  onSearch() {
    this.disablePiecesFlag = false;
    this.checkPrint = false;
    //this.printDisable = 0;
    if (this.handledByMasterHouse && !this.customOrderExaminationForm.get('hawbNumber').valid) {
      this.showErrorMessage("hawb.mandatory");
      return;
    }
    if (!this.customOrderExaminationForm.get('shipmentNumber').valid) {
      this.showErrorMessage("g.shipment.number.mandatory")
      return;
    }
    const requestData = {
      shipmentNumber: this.customOrderExaminationForm.get('shipmentNumber').value,
      shipmentType: this.customOrderExaminationForm.get('shipmentType').value,
      hawbNumber: this.customOrderExaminationForm.get('hawbNumber').value,
      inspectionNumber: this.customOrderExaminationForm.get('inspectionNumber').value

    }
    // if (requestData.inspectionNumber != null) {
    //   this.createFlag = false;
    // }
    if (!this.createFlag && requestData.inspectionNumber == null) {
      this.showErrorMessage("import.inspection.number.mandatory");
      return;
    }
    this.importService.getCustomExaminationInfo(requestData).subscribe(response => {
      const resp = response.data;

      console.log(response.data);
      this.refreshFormMessages(response);
      if (!this.showResponseErrorMessages(response)) {
        if (resp) {
          console.log(resp);
          let customOrderExaminationDetails = this.customOrderExaminationForm.getRawValue();
          // if (resp.locationDetailsInfo == null) {
          //   this.showErrorMessage("import.error.breakdown.completed.delivered");
          //   return;
          // }
          if (resp.inspectionRequestPieces != null) {
            this.disablePiecesFlag = true;
          }
          // const locationDetailsInfo = resp.locationDetailsInfo
          const customDetailsInfoforFlag = resp.customDetailsInfo
          let customFilter = new Array();
          /* locationDetailsInfo.forEach(element => {
             customDetailsInfoforFlag.forEach(item => {
               if (element.flightId == item.flightId) {
                 customFilter.push(item);
               }
             })
           })
           const toFindDuplicates = customFilter => customFilter.filter((item, index) => customFilter.indexOf(item) == index)
           const duplicateElements = toFindDuplicates(customFilter);
           console.log(duplicateElements);*/
          customDetailsInfoforFlag.forEach(element => {
            element.disableFlag = false;
            element.checkAll = 1;
            this.reportFlightId = element.flightId;
            console.log(element.inspectionRequestedOnDt)
            console.log(element.movedToInspectionDt)
            if (!this.createFlag) {
              element.check = 1;
            }
            if (!NgcUtility.getDateAsString(element.inspectionRequestedOnDt)) {
              element.rfeNullCheckFlag = true;
            }
            else {
              element.rfeNullCheckFlag = false;
            }
            if (!NgcUtility.getDateAsString(element.movedToInspectionDt) && this.customOrderExaminationForm.get('inspectionNumber').value != null) {
              element.ffeNullCheckFlag = true;
            }
            else {
              element.ffeNullCheckFlag = false;
            }
            if (NgcUtility.getDateAsString(element.movedToInspectionDt)) {
              this.createOnFFEFlag = true;
              element.createOnFFEFlag = true;
            }
            else {
              element.createOnFFEFlag = false;
            }

          });
          // resp.customDetailsInfo = duplicateElements;
          if (resp.inspectionNumber == null) {
            this.reportFlag = false;
          }
          else {
            this.reportFlag = true;
          }

          this.customOrderExaminationForm.patchValue(resp);
        }
        this.showTable = true;
        this.createFlag = false;

      }

    }, error => {
      this.showErrorStatus(error);
    });
  }
  // On save
  onSave(event) {
    this.checkFlag = 0;
    if ((this.customOrderExaminationForm.get('inspectionRequestPieces').value == null || this.customOrderExaminationForm.get('inspectionRequestPieces').value == 0) || !this.customOrderExaminationForm.get('remarks').valid) {
      this.showErrorStatus("export.fill.in.mandatory.details");
      return;
    }
    this.customOrderSaveRequest = this.customOrderExaminationForm.getRawValue();
    let customDetailsInfo = this.customOrderExaminationForm.get('customDetailsInfo').value;
    customDetailsInfo.forEach(obj => {
      if (obj.check) {
        this.reportFlightId = obj.flightId;
        this.customOrderSaveRequest.flightId = obj.flightId;
        this.customOrderSaveRequest.flightKey = obj.flightKey;
        this.customOrderSaveRequest.flightDate = obj.flightDate;

        if (obj.customsImportDocumentNumber != null) {
          var documentNumberArray = obj.customsImportDocumentNumber.split(',');/* changed */
          this.customOrderSaveRequest.customsImportDocumentNumber = documentNumberArray[documentNumberArray.length - 1];
          documentNumberArray.splice(0, documentNumberArray.length);
        } else {
          this.customOrderSaveRequest.customsImportDocumentNumber = obj.customsImportDocumentNumber;
        }
        if (obj.customsImportDocumentDate != null) {
          var documentNumberDateArray = obj.customsImportDocumentDate.split(',');/* changed */
          this.customOrderSaveRequest.customsImportDocumentDate = new Date(documentNumberDateArray[documentNumberDateArray.length - 1]);
          documentNumberDateArray.splice(0, documentNumberDateArray.length);
        } else {
          this.customOrderSaveRequest.customsImportDocumentDate = new Date(obj.customsImportDocumentDate);
        }
        if (obj.customsImportDocumentType != null) {
          var customsImportDocumentTypeArray = obj.customsImportDocumentType.split(','); /* changed */
          this.customOrderSaveRequest.customsImportDocumentType = customsImportDocumentTypeArray[customsImportDocumentTypeArray.length - 1];
          customsImportDocumentTypeArray.splice(0, customsImportDocumentTypeArray.length);
        }
        else {
          this.customOrderSaveRequest.customsImportDocumentType = obj.customsImportDocumentType;
        }
        this.customOrderSaveRequest.customsImportFlightNumber = obj.customsImportFlightNumber;
        this.customOrderSaveRequest.customsImportFlightDate = obj.customsImportFlightDate;
        this.customOrderSaveRequest.inspectionRequestedOnDt = obj.inspectionRequestedOnDt;
        this.customOrderSaveRequest.movedToInspectionDt = obj.movedToInspectionDt;

        if (obj.customsStationCode != null) {
          var customsStationCodeArray = obj.customsStationCode.split(','); /* changed */
          this.customOrderSaveRequest.customsStationCode = customsStationCodeArray[customsStationCodeArray.length - 1];
          customsStationCodeArray.splice(0, customsStationCodeArray.length);
        } else {
          this.customOrderSaveRequest.customsStationCode = obj.customsStationCode;
        }

        if (obj.customsAgentCode != null) {
          var customsAgentCodeArray = obj.customsAgentCode.split(','); /* changed */
          this.customOrderSaveRequest.customsAgentCode = customsAgentCodeArray[customsAgentCodeArray.length - 1];
          customsAgentCodeArray.splice(0, customsAgentCodeArray.length);
        }
        else {
          this.customOrderSaveRequest.customsAgentCode = obj.customsAgentCode;
        }

        if (obj.importerLicenseNo != null) {
          var ImporterLicenseNoArray = obj.importerLicenseNo.split(','); /* changed */
          this.customOrderSaveRequest.importerLicenseNo = ImporterLicenseNoArray[ImporterLicenseNoArray.length - 1];
          ImporterLicenseNoArray.splice(0, ImporterLicenseNoArray.length);
        }
        else {
          this.customOrderSaveRequest.importerLicenseNo = obj.importerLicenseNo;
        }

        this.customOrderSaveRequest.createOnFFEFlag = obj.createOnFFEFlag;
        this.customOrderSaveRequest.locDetails = obj.locationDetailsInfo;

        this.checkFlag = this.checkFlag + 1
      }
    })
    console.log(this.checkFlag)
    if (this.checkFlag == 0) {
      this.showErrorMessage("import.error.select.flight");
      return;
    }
    else if (this.checkFlag > 1) {
      this.showErrorMessage("import.error.select.flight.only.one");
      return;
    }
    if (this.customOrderSaveRequest.createOnFFEFlag) {
      this.showErrorMessage("import.inspection.ffe.date.exist.error");
      return;
    }
    if (this.customOrderSaveRequest.inspectionRequestedOnDt == null) {
      this.showErrorMessage("import.error.enter.rfe.date");
      return;
    }
    if (this.checkFlag == 1 && this.customOrderSaveRequest.locDetails.length == 0) {
      this.showErrorMessage("import.inspection.shp.loc.not.updated");
      return;
    }
    /*if (this.printDisable == 0 && this.customOrderExaminationForm.get('printerName').value == null) {
      this.showErrorMessage("expaccpt.select.printer");
      return;
    }*/


    this.customOrderSaveRequest.inspectionAuthority = 'CUSTOMS';
    this.customOrderSaveRequest.inspectionRequestedBy = this.getUserProfile().userLoginCode;
    this.customOrderSaveRequest.inspectionRequestType = 'Inspection';
    this.customOrderSaveRequest.movedToInspectionPieces = null;
    this.customOrderSaveRequest.inspectedPieces = null;
    this.customOrderSaveRequest.inspectedDt = null;
    this.customOrderSaveRequest.inspectionStatus = 'INITIATED';
    this.customOrderSaveRequest.inspectionStatusDt = null;
    this.customOrderSaveRequest.createdBy = this.getUserProfile().userLoginCode;
    this.customOrderSaveRequest.modifiedBy = this.getUserProfile().userLoginCode;
    if (this.customOrderSaveRequest.inspectionNumber == null) {
      this.customOrderSaveRequest.flagCRUD = 'C';
    }
    else {
      this.customOrderSaveRequest.flagCRUD = 'U';
    }

    this.importService.onSaveCustomOrder(this.customOrderSaveRequest).subscribe(response => {
      const resp = response.data;
      console.log(resp);
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.inspectionNumber = resp.inspectionNumber;
        this.onPrint();
        this.customOrderExaminationForm.reset();

        this.showTable = false;
        this.createFlag = false;
        this.createOnFFEFlag = false;

        this.customOrderExaminationForm.enable();
      }


    }, error => {
      this.showErrorStatus("error");
    });
  }
  private onShipmentSelect(event) {
    {
      this.customOrderExaminationForm.get('shipmentType').patchValue(event.shipmentType);
      this.customOrderExaminationForm.get('hawbNumber').patchValue(null);
      this.customOrderExaminationForm.get('inspectionNumber').patchValue(null);
    }
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.handledByMasterHouse = false;
      this.hawbSourceParameters = this.createSourceParameter(this.customOrderExaminationForm.get('shipmentNumber').value);
      this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
        if (data != null && data.length > 0) {
          this.handledByMasterHouse = true;
          this.customOrderExaminationForm.get('hawbNumber').setValidators([Validators.required, Validators.maxLength(16)]);
          this.retrieveLOVRecords("HWBNUMBER", this.hawbSourceParameters).subscribe(data => {
            console.log(data[0].code);
            if (data != null && data.length == 1) {
              this.customOrderExaminationForm.get('hawbNumber').setValue(data[0].code);
            }

          })
        } else {
          this.handledByMasterHouse = false;
        }
      },
      );
    }
    this.createOnFFEFlag = false;

  }

  /* onPrintCheck(event) {
     if (event) {
       this.printDisable = 1;
     }
     else {
       this.printDisable = 0;
     }
 
   }*/
  onPrint() {
    this.reportParameters = new Object();
    this.reportParameters.ShipmentId = this.customOrderExaminationForm.get('shipmentId').value;
    this.reportParameters.ShipmentHouseId = this.customOrderExaminationForm.get('shipmentHouseId').value;
    this.reportParameters.flightId = this.reportFlightId;
    if (this.customOrderExaminationForm.get('inspectionNumber').value != null) {
      this.reportParameters.InspectionNumber = this.customOrderExaminationForm.get('inspectionNumber').value;
    }
    else {
      this.reportParameters.InspectionNumber = this.inspectionNumber;
    }
    this.reportParameters.handledByMasterHouse = this.handledByMasterHouse;

    this.reportWindow.open();
  }
  patchData() {
    this.patchDataValue = {
      shipmentNumber: this.customOrderExaminationForm.get('shipmentNumber').value,
    }
  }
  onAwbDocument() {
    this.patchData();
    this.navigateTo(this.router, 'awbmgmt/awbdocument', { "shipmentNumber": this.customOrderExaminationForm.get('shipmentNumber').value, "shipmentType": this.customOrderExaminationForm.get('shipmentType').value });
  }
  onPayment() {
    this.patchData();

    this.navigateTo(this.router, '/billing/collectPayment/enquireCharges', {
      shipment: this.customOrderExaminationForm.get('shipmentNumber').value,
    });
  }
  onAddService() {
    this.patchData();
    this.navigateTo(this.router, '/billing/createServiceRequest', this.patchDataValue);

  }

  onRemarks() {
    this.patchData();
    this.navigateTo(this.router, '/awbmgmt/maintainremarks', this.patchDataValue);
  }
  onHoldShipment() {
    const request = this.customOrderExaminationForm.getRawValue();
    const obj = {
      shipmentId: request.shipmentId,
      shipmentNumber: request.shipmentNumber,
      shipmentType: request.shipmentType,
      hwbNumber: request.hawbNumber
    }
    this.navigateTo(this.router, '/awbmgmt/shipmentonhold', obj);
  }
  onHAWBInformation() {
    const request = this.customOrderExaminationForm.getRawValue();
    const obj = {
      shipmentId: request.shipmentId,
      shipmentNumber: request.shipmentNumber,
      shipmentType: request.shipmentType,
      hwbNumber: request.hawbNumber
    }
    this.navigateTo(this.router, 'awbmgmt/hwb-informationCR', obj);
  }
  onShipmentInformation() {
    const request = this.customOrderExaminationForm.getRawValue();
    const obj = {
      shipmentId: request.shipmentId,
      shipmentNumber: request.shipmentNumber,
      shipmentType: request.shipmentType
    }
    this.navigateTo(this.router, '/awbmgmt/shipmentinfoCR', obj);
  }

  onCreate(event) {
    this.createFlag = true;
    this.customOrderExaminationForm.get('inspectionNumber').patchValue(null);
    this.onSearch();
  }


}