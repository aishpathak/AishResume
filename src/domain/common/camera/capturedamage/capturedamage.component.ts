import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, NgcCapturePhotoComponent } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcUtility, NgcFormArray, NgcWindowComponent, PageConfiguration } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from './../../common.service';
import { uploadPhotodata, MailingDetails, UploadedFiles, ManifestFlightData, Capturedamage, ShipmentInfoReqModel } from './../../common.sharedmodel'
import { ApplicationEntities } from './../../applicationentities';
import { ApplicationFeatures } from '../../applicationfeatures';
import { NumberValueAccessor } from '@angular/forms/src/directives';




@Component({
  selector: 'common-capturedamage',
  templateUrl: './capturedamage.component.html',
  styleUrls: ['./capturedamage.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class CapturedamageComponent extends NgcPage {
  @ViewChild(NgcCapturePhotoComponent)
  private uploadedPhoto: NgcCapturePhotoComponent;
  @ViewChild("shipmentType") shipmentType: any;
  @Input('showAsPopup') showAsPopup: boolean;
  @Input('shipmentNumberData') shipmentNumberData: string;
  @Input('shipmentTypeData') shipmentTypeData: string;
  @Input('hwbNumberData') hwbNumberData: string;
  @Output() autoSearchShipmentInfo = new EventEmitter<boolean>();

  @ViewChild('addMaintainHouseWindow') addMaintainHouseWindow: NgcWindowComponent;
  hawbInvalid: boolean = false;
  handledbyHouse: boolean = false;
  serialNumber: number = 1;
  deleteArray: any;
  entityType: any;
  entityKey: any;
  shipmentDate: Date = new Date();
  entityDate: any;
  natureOfDamageSourceId: string = null;
  sendDataToPrvPage: any;
  awbNo: boolean = false;
  isReadOnly: boolean = false;
  importExportFlag: boolean;
  manifestData: ManifestFlightData = new ManifestFlightData();
  responseData: any;
  disableSendEmail: boolean = true;
  showSave: boolean = false;
  forwardedData: any;
  hawbSourceParameters: {};
  importService: any;
  maintainAddHouseIndex: any;
  damageLineItemsId: Number;
  damageLineItemsPiecs: Number;
  damageLineItemsWeight: Number;
  hawbInfoFeatureEnabled: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private commonService: CommonService) {
    super(appZone, appElement, appContainerElement);
  }


  private captureDamageForm: NgcFormGroup = new NgcFormGroup({
    entityType: new NgcFormControl(),
    entityType2: new NgcFormControl(),
    entityKey: new NgcFormControl(),
    subEntityKey: new NgcFormControl(),
    uploadPhotoEntityKey: new NgcFormControl(),
    shipmentHouseId: new NgcFormControl(),
    isHandleByHouse: new NgcFormControl(),
    associatedTo: new NgcFormControl(),
    stage: new NgcFormControl(),
    emailTo: new NgcFormControl(),
    remarks: new NgcFormControl(),
    imagePreview: new NgcFormControl(),
    damageInfoId: new NgcFormControl(),
    damagePieces: new NgcFormControl(),
    damageWeight: new NgcFormControl(),
    content: new NgcFormControl('', [Validators.maxLength(20)]),
    remark: new NgcFormControl('', [Validators.maxLength(65)]),
    accsHandler: new NgcFormControl(),
    console: new NgcFormControl(),
    awbPcsWt: new NgcFormControl(),
    manifestPcsWt: new NgcFormControl(),
    referenceId: new NgcFormControl(),
    id: new NgcFormControl(),
    flight: new NgcFormControl(),
    flightSegmentId: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    captureDetails: new NgcFormArray([
      new NgcFormGroup({
        sno: new NgcFormControl(this.serialNumber),
        damageInfoId: new NgcFormControl(),
        damageLineItemsId: new NgcFormControl(),

        listNatureOfDamage: new NgcFormControl(),

        damagePieces: new NgcFormControl('', [Validators.maxLength(4)]),
        damageWeight: new NgcFormControl(),

        severity: new NgcFormControl(),
        occurrence: new NgcFormControl(),
        entityType: new NgcFormControl(),
        entityKey: new NgcFormControl(),
        subEntityKey: new NgcFormControl(),
        selectDeleteIcon: new NgcFormControl(),
        lineRemarks: new NgcFormControl(),
      })
    ])
  })

  private maintainDamageHouseInfoFormGroup: NgcFormGroup = new NgcFormGroup({
    houseNum: new NgcFormControl(),
    damageHouseInfo: new NgcFormArray([
      new NgcFormGroup({
        houseNumber: new NgcFormControl(),
        housePicecWeight: new NgcFormControl(),
        hawbDamagePcs: new NgcFormControl(),
        hawbDamageWt: new NgcFormControl(),
        hawbRemarks: new NgcFormControl(),
        hawbPieces: new NgcFormControl(),
        hawbWeight: new NgcFormControl()

      })
    ]),
  });
  ngOnInit() {
    super.ngOnInit();
    this.hawbInfoFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBInfo);
    if (this.shipmentNumberData && this.shipmentTypeData) {
      this.captureDamageForm.get('entityKey').patchValue(this.shipmentNumberData);
      this.captureDamageForm.get('entityType').patchValue(this.shipmentTypeData);
      if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
        if (this.forwardedData == null || this.forwardedData == '') {
          this.captureDamageForm.get('subEntityKey').reset();
        }
        this.entityKey = this.captureDamageForm.get('entityKey').value;
        this.captureDamageForm.validate();
        const req: ShipmentInfoReqModel = new ShipmentInfoReqModel();
        req.entityKey = this.captureDamageForm.get('entityKey').value;
        req.entityType = this.captureDamageForm.get('entityType').value;
        this.commonService.isHandledByHouse(req).subscribe(response => {
          if (!this.showResponseErrorMessages(response)) {
            if (response.data) {
              this.handledbyHouse = true;
              this.captureDamageForm.get('entityType2').setValue("HAWB");
            }
            else {
              this.handledbyHouse = false;
            }
          }
        })
      }
      this.captureDamageForm.get('subEntityKey').patchValue(this.hwbNumberData);
      switch (this.shipmentTypeData) {
        case 'AWB':
          this.natureOfDamageSourceId = 'CaptureDamage$Nature_Of_Damage_AWB';
          break;
        case 'MBN':
          this.natureOfDamageSourceId = 'CaptureDamage$Nature_Of_Damage_Mail';
          break;
        case 'ULD':
          this.natureOfDamageSourceId = 'CaptureDamage$Nature_Of_Damage_ULD';
          break;
        default:
          this.natureOfDamageSourceId = 'NONE';
      }
      this.onFetch();
    } else {
      this.selectData({ shipmentType: this.shipmentTypeData, shipmentNo: this.shipmentTypeData })
      this.forwardedData = this.getNavigateData(this.activatedRoute);
      this.sendDataToPrvPage = this.forwardedData;
      if (this.sendDataToPrvPage) {
        //this.isReadOnly = true;
        //this.selectData({ shipmentType: this.forwardedData.entityType, shipmentNo: this.forwardedData.entityKey });
        this.captureDamageForm.get(['entityKey']).disable();
        this.captureDamageForm.patchValue(this.forwardedData);
        this.selectData({ shipmentType: this.forwardedData.entityType, shipmentNo: this.forwardedData.entityKey, subEntityKey: this.forwardedData.subEntityKey });
        this.responseData = null;
        this.onFetch();
        if (!this.responseData) {
          if (this.forwardedData.entityType === "MBN") {
            this.captureDamageForm.get('content').patchValue(this.forwardedData.content);
          }
        }

      } else {
        this.captureDamageForm.get(['entityKey']).enable();
      }
    }
  }
  public onImageSelect(event) {
    if (event) {
      this.captureDamageForm.get('imagePreview').setValue(event.document);
    }
  }

  onSave() {
    this.captureDamageForm.validate();
    //
    if (this.captureDamageForm.invalid) {
      return;
    }

    this.captureDamageForm.get('isHandleByHouse').setValue(this.handledbyHouse);
    let request = this.captureDamageForm.getRawValue();
    this.uploadedPhoto.upload();
    if (this.captureDamageForm.get)
      request.captureDetails.forEach(element => {
        element.entityType = request.entityType;
        element.entityKey = request.entityKey;
        if (this.handledbyHouse) {
          element.subEntityKey = request.subEntityKey;
        }

      })
    // request.id = this.sendDataToPrvPage.id;
    this.commonService.save(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.onFetch();
        this.autoSearchShipmentInfo.emit(true)
        this.showSuccessStatus('g.completed.successfully');
      }
    }, error => {
      this.showErrorStatus(error);
    });

  }

  onCancel(event) {
    this.navigateBack(this.sendDataToPrvPage);
  }

  addDamage() {

    const noOfRows = (<NgcFormArray>this.captureDamageForm.get('captureDetails')).length;
    const lastRow = noOfRows ? (<NgcFormArray>this.captureDamageForm.get('captureDetails')).controls[noOfRows - 1] : null;
    if (noOfRows === 0 || (lastRow.get('listNatureOfDamage').value && lastRow.get('damagePieces').value && lastRow.get('severity').value)) {
      this.serialNumber = this.serialNumber + 1;
      (<NgcFormArray>this.captureDamageForm.get('captureDetails')).addValue([
        {
          sno: this.serialNumber,
          transNo: "",
          damageInfoId: "",
          damageLineItemsId: "",
          listNatureOfDamage: "",
          damagePieces: "",
          severity: "",
          occurrence: "",
          entityType: "",
          entityKey: "",
          subEntityKey: "",
          selectDeleteIcon: "",
          lineRemarks: "",
          damageWeight: null
        }
      ]);
    } else {
      this.showInfoStatus("common.adding.row.warning");
    }
  }

  someMethodWithFocusOutEvent() {
    console.log(this.captureDamageForm.get('flightDate').setValue(new Date()));
  }

  selectData(event) {
    this.manifestData = new ManifestFlightData();
    if (event.shipmentType == 'AWB') {
      this.awbNo = true;
    } else {
      this.awbNo = false;
    }
    if (event.shipmentType) {
      switch (event.shipmentType) {
        case 'AWB':
          this.natureOfDamageSourceId = 'CaptureDamage$Nature_Of_Damage_AWB';
          break;
        case 'MBN':
          this.natureOfDamageSourceId = 'CaptureDamage$Nature_Of_Damage_Mail';
          break;
        case 'ULD':
          this.natureOfDamageSourceId = 'CaptureDamage$Nature_Of_Damage_ULD';
          break;
        default:
          this.natureOfDamageSourceId = 'NONE';
      }
      this.entityType = event.shipmentType;
      this.entityKey = event.shipmentNo;
      this.manifestData.entityKey = event.shipmentNo;
      this.manifestData.entityType = event.shipmentType;
      this.captureDamageForm.get('entityType').setValue(this.entityType);
      this.getManifestFlightDetails(this.manifestData);
      this.onFetch();
      if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
        if (this.forwardedData == null || this.forwardedData == '') {
          this.captureDamageForm.get('subEntityKey').reset();
        }
        this.entityKey = this.captureDamageForm.get('entityKey').value;
        this.captureDamageForm.validate();
        const req: ShipmentInfoReqModel = new ShipmentInfoReqModel();
        req.entityKey = this.captureDamageForm.get('entityKey').value;
        req.entityType = this.captureDamageForm.get('entityType').value;
        this.commonService.isHandledByHouse(req).subscribe(response => {
          if (!this.showResponseErrorMessages(response)) {
            if (response.data) {
              this.handledbyHouse = true;
              this.captureDamageForm.get('subEntityKey').patchValue("");
              this.captureDamageForm.get('subEntityKey').clearValidators();
              if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
                this.hawbSourceParameters = this.createSourceParameter(this.captureDamageForm.get('entityKey').value);

                this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
                  if (data != null && data.length > 0) {
                    this.handledbyHouse = true;
                    this.captureDamageForm.get('subEntityKey').setValidators([Validators.required, Validators.maxLength(16)]);
                    this.retrieveLOVRecords("HWBNUMBER", this.hawbSourceParameters).subscribe(data => {
                      if (data != null && data.length == 1) {
                        this.captureDamageForm.get('subEntityKey').setValue(data[0].code);
                      }
                    })
                  }
                },
                );
              }
              this.onFetch();
            }
            else {
              this.handledbyHouse = false;
            }
          }
        })
      }
    }
  }

  sumPieces(item) {
    let allData: any = (<NgcFormArray>this.captureDamageForm.get('captureDetails')).getRawValue();
    let sumOfDamagedPieces = 0;
    allData.forEach(element => {
      sumOfDamagedPieces = sumOfDamagedPieces + element.damagePieces;
    })
    this.captureDamageForm.get('damagePieces').patchValue(sumOfDamagedPieces);
  }

  public onLocationLinkClick(event, index) {
    const damageDetails: any = (<NgcFormGroup>this.captureDamageForm.get('captureDetails.' + index)).getRawValue();
    if (damageDetails.flagCRUD === 'C') {
      (<NgcFormArray>this.captureDamageForm.get('captureDetails')).deleteValueAt(index);
      this.sumPieces(index);
    } else {
      var formData = this.captureDamageForm.getRawValue();
      damageDetails.entityKey = formData.entityKey;
      damageDetails.entityDate = formData.entityDate;
      damageDetails.entityType = formData.entityType;
      if (this.handledbyHouse) {
        damageDetails.subEntityKey = formData.subEntityKey;
      }
      this.commonService.deleteDamage(damageDetails).subscribe(data => {
        this.refreshFormMessages(data);
        if (!data.messageList) {
          if (!this.showResponseErrorMessages(data)) {
            (<NgcFormArray>this.captureDamageForm.get(['captureDetails'])).deleteValueAt(index);
            this.showSuccessStatus('g.completed.successfully');
            this.sumPieces(index);
          }
        }
      },
        error => { this.showErrorStatus('common.not.success'); }
      );
    }

  }

  getManifestFlightDetails(data: any) {
    this.captureDamageForm.get('flightSegmentId').setValue(null);
    this.captureDamageForm.get('damagePieces').reset();
    this.captureDamageForm.get('damageWeight').reset();
    (this.captureDamageForm.get('captureDetails') as NgcFormArray).resetValue([]);
    // To insert a new row if no damage records are found
    (<NgcFormArray>this.captureDamageForm.get('captureDetails')).addValue([
      {
        sno: this.serialNumber,
        transNo: "",
        damageInfoId: "",
        damageLineItemsId: "",
        listNatureOfDamage: "",
        damagePieces: "",
        damageWeight: "",
        severity: "",
        occurrence: "",
        entityType: "",
        entityKey: "",
        subEntityKey: "",
        selectDeleteIcon: "",
        lineRemarks: ""
      }
    ]);
    let flightSegmentId = null;
    this.commonService.fetchManifestFlightDetails(this.manifestData).subscribe(response => {
      if (response.data != null) {
        if (response.data[0].flight != null) {
          this.captureDamageForm.get('flight').setValue(response.data[0].flight);
          this.captureDamageForm.get('flightDate').setValue(response.data[0].flightDate);
          this.captureDamageForm.get('content').setValue(response.data[0].content);
          this.captureDamageForm.get('accsHandler').setValue(response.data[0].accsHandler);
          this.captureDamageForm.get('console').setValue(response.data[0].console);
          this.captureDamageForm.get('awbPcsWt').setValue(response.data[0].awbPcsWt);
          this.captureDamageForm.get('manifestPcsWt').setValue(response.data[0].manifestPcsWt);
        }
        flightSegmentId = response.data.flightSegmentId;
        this.manifestData.flight = response.data.flight;
        this.manifestData.flightDate = response.data.flightDate;
        var parameters = { 'parameter1': response.data.flight, 'parameter2': response.data.flightDate };
        this.retrieveDropDownListRecords('IRREGULARITY_SEGMENT_DETAILS', 'query', parameters)
          .subscribe(segmentdata => {
            segmentdata.forEach(value => {
              if (value.code == flightSegmentId) {
                this.captureDamageForm.get('flightSegmentId').setValue(value.code);
              }
            });
          })
        this.showSave = false;
      } else {
        this.showSave = true;
      }
    });
  }
  onFetch() {
    if (this.handledbyHouse && this.hawbInvalid) {
      this.showErrorStatus('hawb.invalid');
      return;
    }
    //Disable the email send button by default
    this.disableSendEmail = true;
    this.captureDamageForm.get('isHandleByHouse').setValue(this.handledbyHouse);
    let request = this.captureDamageForm.getRawValue();
    this.resetFormMessages();

    (this.captureDamageForm.get('captureDetails') as NgcFormArray).resetValue([]);

    this.addDamage();

    this.commonService.fetch(request).subscribe(response => {
      this.responseData = response.data;
      if (response.data != null) {
        if (response.data.entityDate != null) {
          this.entityDate = response.data.entityDate;
        }
        this.showSave = false;
      } else {
        this.showSave = true;
      }
      if (!this.showResponseErrorMessages(response)) {
        if (!response.data || response.data.length === 0) {
          this.showErrorMessage("common.no.damage");
          this.captureDamageForm.get('damagePieces').reset();
          this.captureDamageForm.get('damageWeight').reset();
          if (this.manifestData.flight == null) {
            this.captureDamageForm.get('remark').reset();
            this.captureDamageForm.get('content').reset();
          }
          (this.captureDamageForm.get('captureDetails') as NgcFormArray).resetValue([]);
          if (request.entityType === "MBN") {
            this.defaultPatchForMail(request);
          }
        } else {
          if (response.data.flight != null) {
            this.captureDamageForm.get(['flight']).setValue(response.data.flight, { onlySelf: true, emitEvent: false });
            this.captureDamageForm.get(['flightDate']).setValue(response.data.flightDate, { onlySelf: true, emitEvent: false });
          }
          if (response.data && response.data.origin && NgcUtility.isTenantCityOrAirport(response.data.origin)) {
            this.importExportFlag = false;
          } else {
            this.importExportFlag = true;
          }
          this.captureDamageForm.get(['flightSegmentId']).setValue(response.data.flightSegmentId);
          this.captureDamageForm.get(['remark']).setValue(response.data.remark);
          this.captureDamageForm.get(['content']).patchValue(response.data.content);
          (<NgcFormArray>this.captureDamageForm.get(['captureDetails'])).patchValue(response.data.captureDetails);
          if (this.handledbyHouse) {
            this.uploadedPhoto.entityKey2 = this.captureDamageForm.get('subEntityKey').value;
            this.uploadedPhoto.entityType2 = "HAWB";
          }
          let awbEntityKey = this.captureDamageForm.get('entityKey').value;
          this.uploadedPhoto.entityKey = awbEntityKey;
          this.sumPieces(null);

          //Check the damage info id
          if (response.data.damageInfoId != null && response.data.damageInfoId != '') {
            this.disableSendEmail = false;
          }
        }

      } else {
        if (!response.data || response.data.length === 0) {
          this.captureDamageForm.get('remark').reset();
          this.captureDamageForm.get('content').reset();

        }
      }
    });
    this.uploadedPhoto.fetch();
  }

  defaultPatchForMail(request) {
    this.captureDamageForm.get('content').patchValue('MAIL');
    let mailPieces = 0;
    if (!request.entityKey.includes("___")) {
      mailPieces = 1;
    }
    (<NgcFormArray>this.captureDamageForm.get('captureDetails')).addValue([
      {
        sno: this.serialNumber,
        transNo: "",
        damageInfoId: "",
        damageLineItemsId: "",
        listNatureOfDamage: "",
        damagePieces: mailPieces,
        damageWeight: "",
        severity: "",
        occurrence: "",
        entityType: "",
        entityKey: "",
        selectDeleteIcon: "",
        lineRemarks: ""
      }
    ]);
  }

  public onSendEmail() {
    let request = this.captureDamageForm.getRawValue();
    this.commonService.sendEmail(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
      }
    }, error => {
      this.showErrorStatus(error);
    });

  }

  onSelect(event, index) {

    this.captureDamageForm.get(['captureDetails', index, 'lineRemarks']).clearValidators();

    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBInfo) && event == 'Others') {
      this.captureDamageForm.get(['captureDetails', index, 'lineRemarks']).setValidators([Validators.required]);
    } else {
      this.captureDamageForm.get(['captureDetails', index, 'lineRemarks']).clearValidators();

    }
  }

  // @NgModule({
  //     imports: [
  //       CommonModule,
  //       ReactiveFormsModule,
  //       RouterModule,
  //       NgcCoreModule,
  //       NgcControlsModule,
  //       NgcDirectivesModule,
  //       NgcDomainModule
  //     ],
  //     exports: [CapturedamageComponent],
  //     declarations: [CapturedamageComponent]
  // })
  // export class CapturedamageComponentModule {
  // }


  sendEmailWithUploadedDoc() {
    let request = this.setMailingContent();
    this.commonService.sendEmailForDamageWithUploadedDoc(request).subscribe((res) => {
      this.showSuccessStatus('g.completed.successfully');
    })
  }
  setMailingContent() {
    let mailingDetails: MailingDetails = new MailingDetails();
    mailingDetails.to = this.captureDamageForm.get('emailTo').value;
    if (!this.captureDamageForm.get('emailTo').value) {
      this.showErrorMessage("common.email.error");
      return;
    }
    mailingDetails.shipmentNumber = this.captureDamageForm.get('entityKey').value;
    mailingDetails.type = this.captureDamageForm.get('entityType').value;
    mailingDetails.user = this.getUserProfile().userLoginCode;
    mailingDetails.tenantAirportCode = NgcUtility.getTenantConfiguration().airportCode;
    mailingDetails.flight = this.captureDamageForm.get('flight').value;
    mailingDetails.flightdate = this.captureDamageForm.get('flightDate').value;
    if (this.handledbyHouse) {
      mailingDetails.subEntityKey = this.captureDamageForm.get('subEntityKey').value;
    }
    let uploadePhotoList: Array<any> = this.uploadedPhoto.getAllItems();
    uploadePhotoList.forEach((uploadPhoto) => {
      let doc: UploadedFiles = new UploadedFiles();
      doc.fileId = uploadPhoto.uploadDocId;
      doc.fileName = uploadPhoto.documentName;
      doc.fileType = uploadPhoto.documentType;
      mailingDetails.uploadedFiles.push(doc);
    })
    return mailingDetails;
  }

  onFlightDate() {
    if (this.captureDamageForm.get('flight').value && this.captureDamageForm.get('flightDate').value) {
      this.captureDamageForm.get('flightSegmentId').setValue(null);
      this.onFetch();
    }
  }

  onFlightChange() {
    if (this.captureDamageForm.get('flight').value && this.captureDamageForm.get('flightDate').value) {
      this.captureDamageForm.get('flightSegmentId').setValue(null);
      this.onFetch();
    }
  }

  setAWBNumber(object) {
    if (object.code == null) {
      this.hawbInvalid = true;
      this.showErrorStatus('hawb.invalid');
    }
    else {
      this.hawbInvalid = false;
      this.captureDamageForm.get('isHandleByHouse').setValue(object.code);
      this.onFetch();
    }
  }

  addHosue(event, index) {
    console.log(event.value);
    this.maintainDamageHouseInfoFormGroup.get('damageHouseInfo').patchValue[''];
    this.maintainDamageHouseInfoFormGroup.get('houseNum').setValue(null);
    // const houseModel = new CaptureDamageShipmentHouseModel();
    // houseModel.damageLineItemsId = event.value.damageLineItemsId;
    this.damageLineItemsId = event.value.damageLineItemsId;

    this.damageLineItemsPiecs = event.value.damagePieces;
    this.damageLineItemsWeight = event.value.damageWeight;


    // this.commonService.getMaintainHouseCaptureDamage(houseModel).subscribe((response) => {
    //   if (this.showResponseErrorMessages(response)) {
    //     return;
    //   }

    //   if (response.data != null) {
    //     this.maintainDamageHouseInfoFormGroup.get('damageHouseInfo').patchValue(response.data);
    //   }
    // })
    this.addMaintainHouseWindow.open()
  }

  // maintainHouseSearch() {
  //   const houseModel = new CaptureDamageShipmentHouseModel();
  //   houseModel.damageLineItemsId = this.damageLineItemsId;
  //   houseModel.houseNumber = this.maintainDamageHouseInfoFormGroup.get('houseNum').value;
  //   this.commonService.getMaintainHouseCaptureDamage(houseModel).subscribe((response) => {
  //     if (this.showResponseErrorMessages(response)) {
  //       return;
  //     }

  //     if (response.data != null) {
  //       this.maintainDamageHouseInfoFormGroup.get('damageHouseInfo').patchValue(response.data);
  //     }

  //   })

  // }

  maintainAddNewHouse() {
    (<NgcFormArray>this.maintainDamageHouseInfoFormGroup.get('damageHouseInfo')).addValue([
      {
        damageLineItemsByHouseInfoId: null,
        damageLineItemsId: null,
        shipmentHouseId: null,
        hawbPieces: null,
        hawbWeight: null,
        type: this.captureDamageForm.get('entityKey').value,
        houseNumber: null,
        housePicecWeight: null,
        hawbDamagePcs: null,
        hawbDamageWt: null,
        hawbRemarks: null,
        flagCRUD: 'C'
      }
    ]);

  }

  saveMaintainHouseInfo() {
    let invalid = (<NgcFormArray>this.maintainDamageHouseInfoFormGroup.get("damageHouseInfo")).invalid;
    if (invalid) {
      this.showErrorMessage("import.please.enter.all.mandatory.fileds");
      return;
    }
    let controlData = (<NgcFormArray>this.maintainDamageHouseInfoFormGroup.get("damageHouseInfo")).value;
    if (controlData == null || controlData.length == 0) {
      this.showErrorMessage("export.add.atleast.one.record");
      return;
    }
    controlData.forEach(element => {
      console.log(element);
      element.damageLineItemsId = this.damageLineItemsId;
      element.shipmentNumber = this.captureDamageForm.get('entityKey').value
      element.houseNumber = element.houseNumber;
      element.damageLineItemsPiecs = this.damageLineItemsPiecs;
      element.damageLineItemsWeight = this.damageLineItemsWeight
    });
    // this.commonService.createMaintainHouseDamageData(controlData).subscribe((response) => {
    //   if (this.showResponseErrorMessages(response)) {
    //     return;
    //   }
    //   this.showSuccessStatus('g.completed.successfully');
    //   this.addMaintainHouseWindow.close();
    //   this.maintainHouseSearch();
    // })
  }



  setHouseInfo(data: any, index: any) {
    if (data.code != null) {
      (this.maintainDamageHouseInfoFormGroup.get(["damageHouseInfo", index, "shipmentHouseId"]) as NgcFormControl).setValue(Number(data.param1));
      (this.maintainDamageHouseInfoFormGroup.get(["damageHouseInfo", index, "housePicecWeight"]) as NgcFormControl).setValue(data.param2 + "/" + data.param3);
      (this.maintainDamageHouseInfoFormGroup.get(["damageHouseInfo", index, "shipmentHouseId"]) as NgcFormControl).setValue(Number(data.param1));
      (this.maintainDamageHouseInfoFormGroup.get(["damageHouseInfo", index, "hawbPieces"]) as NgcFormControl).setValue(Number(data.param2));
      (this.maintainDamageHouseInfoFormGroup.get(["damageHouseInfo", index, "hawbPieces"]) as NgcFormGroup).disable();
      (this.maintainDamageHouseInfoFormGroup.get(["damageHouseInfo", index, "hawbWeight"]) as NgcFormControl).setValue(Number(data.param3));
      (this.maintainDamageHouseInfoFormGroup.get(["damageHouseInfo", index, "hawbWeight"]) as NgcFormGroup).disable();
      (this.maintainDamageHouseInfoFormGroup.get(["damageHouseInfo", index, "hawbOrigin"]) as NgcFormControl).setValue(data.param4);
      (this.maintainDamageHouseInfoFormGroup.get(["damageHouseInfo", index, "hawbDestination"]) as NgcFormControl).setValue(data.param5);
      (this.maintainDamageHouseInfoFormGroup.get(["damageHouseInfo", index, "hawbNatureOfGoods"]) as NgcFormControl).setValue(data.param6);
    }
  }

  onHouseWayBillPieceChange(index: any) {
    let hawbLineInfo = this.maintainDamageHouseInfoFormGroup.get(["damageHouseInfo", index]).value;
    hawbLineInfo.hawbDamageWt = hawbLineInfo.hawbDamagePcs * (hawbLineInfo.hawbDamageWt / hawbLineInfo.hawbDamagePcs);
    (this.maintainDamageHouseInfoFormGroup.get(["damageHouseInfo", index, "hawbDamageWt"]) as NgcFormControl).setValue(hawbLineInfo.hawbDamageWt)
  }

  deleteDamageHouse(data: any, index: any) {
    (this.maintainDamageHouseInfoFormGroup.get(["damageHouseInfo", index]) as NgcFormControl).markAsDeleted();
  }


}
