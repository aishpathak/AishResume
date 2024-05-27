
import { TracingListResponseObj, EmailInfo, MaintainTracingActivitiesActivityModel } from './../tracing.shared';
import { Component, ElementRef, NgZone, ViewContainerRef, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage, NgcUtility, PageConfiguration, NgcWindowComponent, NgcFileUploadComponent } from 'ngc-framework';
import { MaintainTracingActivity, MaintainTracingActivityShipmentData } from '../tracing.shared';
import { TracingService } from './../tracing.service';
import { IfStmt, ThrowStmt } from '@angular/compiler';
import { TranshipmentHandlingSummaryModel } from '../../export/transhipment/transhipment.sharedmodel.ts';
import { UploadedFiles } from '../../common/common.sharedmodel';

@Component({
  selector: 'app-maintain-tracing-activities',
  templateUrl: './maintain-tracing-activities.component.html',
  styleUrls: ['./maintain-tracing-activities.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class MaintainTracingActivitiesComponent extends NgcPage {
  @ViewChild('showPopUpWindow') showPopUpWindow: NgcWindowComponent;
  @ViewChild('mainFlies') mainFlies: NgcFileUploadComponent;
  @ViewChild('showPopUpfiles') showPopUpfiles: NgcFileUploadComponent;
  @ViewChild('claimSettelement') claimSettelement: NgcFileUploadComponent;



  mailattachmentRef: any;
  isAWBSelected: boolean = false;
  pagetitle: string = 'tracing.createNewTrace';
  displayData = false;
  response: any;
  saveRequest: any;
  errors: any;
  date = new Date();
  dateto: any
  handledBy: any;
  acivityFlag: any = true;
  create: any = false;
  formDisabled = false;
  refDoc = true;
  disabledisplay = false;
  caseNum: String;
  shcs = [];
  shcsfromshimentpmaster = [];
  data: { create: any, caseNum: String };
  caseNumb: string;
  enableCloseButton = true;
  disableclose: any = true;
  enableClose: any = true;
  enable: any = false;
  invalid: any = true;
  invalidTracing = true;
  enableShipmentRemarks = false;
  referencenumber: string = '2';
  shipmentRemarksFlag = true;
  shipNum: String;
  shipNumber: String;
  shipNo: any;
  disableMail: any;
  screenfiles = [];
  isvalidmail: boolean = false;
  navigateBackData: any;
  hasReadPermission: boolean = false;
  isClaimSettlementOption: boolean;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private tracingService: TracingService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);

  }

  ngOnInit() {
    super.ngOnInit();

    this.caseNumb = '';
    // = 'CT' + this.randomInt()
    this.displayData = false;
    this.disableMail = true;

    let forwardedData = this.getNavigateData(this.activatedRoute);
    this.navigateBackData = forwardedData;
    //let forwardedData:{shipmentNumber:String,createFlag:any,caseNumber:any};
    // checking if the fetched data is not null
    console.log(forwardedData);

    if (forwardedData != null && forwardedData.createFlag) {
      this.maintainTracingActivity.get('shipmentNumber').patchValue(forwardedData.shipmentNumber);
      this.maintainTracingActivity.get('houseNumber').patchValue(forwardedData.houseNumber);
      if (forwardedData.createFlag === 'C') {
        this.create = true;
        this.disableMail = true;
        this.pagetitle = 'tracing.createNewTrace';

      } else {
        this.disableMail = false;
        this.pagetitle = 'tracing.maintain.tracing.activities';
        this.caseNum = forwardedData.caseNumber;
      }

      this.onCreateTracingActivity();
    }


    if (this.caseNum === '' || this.caseNum === null) {
      this.maintainTracingActivity.get('shipmentNumber').valueChanges.subscribe((newValue) => {
        if (newValue !== this.shipNo) {
          if (this.maintainTracingActivity.get('shipmentNumber').value !== null) {
            if (this.maintainTracingActivity.get('shipmentNumber').value.length === 11
              && this.referencenumber !== this.maintainTracingActivity.get('shipmentNumber').value) {
              if (newValue !== this.shipNum) {
                const request: MaintainTracingActivityShipmentData = new MaintainTracingActivityShipmentData();
                request.shipmentNumber = this.maintainTracingActivity.get('shipmentNumber').value;
                this.shipNo = this.maintainTracingActivity.get('shipmentNumber').value;
                this.tracingService.getTracingActivityShipmentData(request).subscribe(data => {
                  this.response = data.data;
                  //console.log(this.response);
                  this.refreshFormMessages(data);
                  if (this.response) {
                    //console.log(this.response);
                    this.maintainTracingActivity.patchValue(this.response, {
                      onlySelf: true,
                      emitEvent: false
                    });

                    this.maintainTracingActivity.get('houseNumber').patchValue(forwardedData.houseNumber);
                    this.maintainTracingActivity.get('shipmentNumber').patchValue(forwardedData.shipmentNumber);
                    this.referencenumber = this.maintainTracingActivity.get('shipmentNumber').value;
                    this.shipNum = this.maintainTracingActivity.get('shipmentNumber').value;
                    this.shipmentRemarksFlag = false;
                    this.maintainTracingActivity.get('shc').patchValue(this.shcsfromshimentpmaster);
                  } else {
                    this.displayData = false;
                    return;
                  }

                })
              }
            }
          }
        }
      });

      (<NgcFormArray>this.maintainTracingActivity.get('maintainTracingActivitiesActivityModel')).controls.forEach(element => {
        element.get('activityPerformedBy').setValue(this.getUserProfile().userLoginCode);
        element.get('activityPerformedOn').setValue(NgcUtility.getCurrentDateOnly());
      })

      this.maintainTracingActivity.get('houseNumber').patchValue(forwardedData.houseNumber);
      this.maintainTracingActivity.get('shipmentNumber').patchValue(forwardedData.shipmentNumber);
      if (forwardedData.createFlag === 'C') {
        this.tracingService.getTracingNumberOnCreate(forwardedData).subscribe(data => {
          this.maintainTracingActivity.get('caseNumber').patchValue(data.data);
        });
      }
    }
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.displayData = false;
    (<NgcFormArray>this.maintainTracingActivity.get('maintainTracingActivitiesActivityModel')).controls.forEach(element => {
      element.get('activityPerformedBy').setValue(this.getUserProfile().userLoginCode);
      element.get('activityPerformedOn').setValue(NgcUtility.getCurrentDateOnly());
    })
    this.maintainTracingActivity.valueChanges.subscribe((newValue) => {
      let casestatu = this.maintainTracingActivity.getRawValue;

      const casestatus = this.maintainTracingActivity.get('caseStatus').value;
      const stage = this.maintainTracingActivity.get('stage').value;
      let reasonForClose
      if (casestatus === 'INVALID') {
        this.invalidTracing = true;
        this.formDisabled = true;
      } if (casestatus === 'CLOSED') {
        this.invalidTracing = true;
        this.enableClose = true;
        this.enableCloseButton = true;
        this.formDisabled = true;
      }
      if (casestatus === 'OPEN') {

        this.maintainTracingActivity.get('caseStatus').setValue('OPEN', {
          onlySelf: true,
          emitEvent: false
        });
        this.invalidTracing = false;
        if (this.maintainTracingActivity.get('reasonforClosing').value) {
          this.enableClose = false;
          this.enableCloseButton = false;
        }
      }
      if (stage === 'INPRORGRESSPENDING' || stage === 'INPROGRESS') {

        this.maintainTracingActivity.get('stage').setValue('INPROGRESS', {
          onlySelf: true,
          emitEvent: false
        });
        this.invalidTracing = false;
        if (this.maintainTracingActivity.get('reasonforClosing').value) {
          this.enableClose = false;
          this.enableCloseButton = false;
        }
      }

    });

    this.maintainTracingActivity.get('reasonforClosing').valueChanges.subscribe((newValue) => {

      //if (this.enable === true) {

      let reason = this.maintainTracingActivity.get('reasonforClosing').value;
      if (this.maintainTracingActivity.get('reasonforClosing').value) {
        this.enableClose = false;
        this.enableCloseButton = false;
      }
      else if (this.maintainTracingActivity.get('reasonforClosing').value === null) {
        this.enableClose = true;
        this.enableCloseButton = true;
      }
      //}
    });
    this.maintainTracingActivity.get('shipmentNumber').valueChanges.subscribe(
      (newValue) => {
        if (newValue !== this.shipNum) {
          if (this.maintainTracingActivity.get('shipmentNumber').value) {
            if (this.maintainTracingActivity.get('shipmentNumber').value !== null && this.maintainTracingActivity.get('shipmentNumber').value.length === 11
              && this.referencenumber !== this.maintainTracingActivity.get('shipmentNumber').value) {
              const request: MaintainTracingActivityShipmentData = new MaintainTracingActivityShipmentData();
              request.shipmentNumber = this.maintainTracingActivity.get('shipmentNumber').value;
              this.tracingService.getTracingActivityShipmentData(request).subscribe(data => {
                this.response = data.data;
                this.refreshFormMessages(data);
                if (this.response) {
                  //console.log(this.response);
                  this.maintainTracingActivity.patchValue(this.response, {
                    onlySelf: true,
                    emitEvent: false
                  });
                  this.shipNum = this.maintainTracingActivity.get('shipmentNumber').value;
                  this.shipmentRemarksFlag = false;

                  //this.maintainTracingActivity.get('shc').patchValue(null);
                  //this.maintainTracingActivity.get('shc').patchValue(this.shcsfromshimentpmaster);

                } else {
                  this.displayData = false;
                  return;
                }

              })
            }
          }
        }
      });
    if (this.response.houseNumber !== null) {
      this.maintainTracingActivity.get('houseNumber').patchValue(this.response.houseNumber);
    }
    this.maintainTracingActivity.get('shipmentNumber').patchValue(this.response.shipmentNumber);
  }

  private maintainTracingActivity: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    shipmentDate: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    houseNumber: new NgcFormControl('', [Validators.maxLength(30)]),
    caseNumber: new NgcFormControl(),
    caseStatus: new NgcFormControl(),
    //   fileUpload: new NgcFormArray([]),
    irregularityTypeCode: new NgcFormControl('', [Validators.required]),
    importExportIndicator: new NgcFormControl(),
    tracingCreatedfor: new NgcFormControl(),
    shipmentId: new NgcFormControl(),
    houseId: new NgcFormControl(),
    agentCode: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    totalPieces: new NgcFormControl(),
    totalWeight: new NgcFormControl(),
    irregularitypieces: new NgcFormControl('', [Validators.maxLength(5)]),
    irregularityWeight: new NgcFormControl('', [Validators.maxLength(5)]),
    natureOfGoodsDescription: new NgcFormControl('', [Validators.maxLength(25)]),
    shc: new NgcFormControl(),
    importUserCode: new NgcFormControl(),
    importstaffNumber: new NgcFormControl(),
    importStaffName: new NgcFormControl(),
    exportUserCode: new NgcFormControl(),
    exportstaffNumber: new NgcFormControl(),
    exportStaffName: new NgcFormControl(),
    followUpDate: new NgcFormControl(this.date),
    reasonforClosing: new NgcFormControl(),
    createdUserCode: new NgcFormControl(),
    closedOn: new NgcFormControl(),
    createdDateTime: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    remarks: new NgcFormControl(),
    stages: new NgcFormControl(),
    irpStatus: new NgcFormControl(),
    maintainTracingActivityLocationModel: new NgcFormArray([
      new NgcFormGroup({
        shipmentLocationCode: new NgcFormControl('', [Validators.maxLength(12)]),
        pieces: new NgcFormControl(),
        weight: new NgcFormControl(),
        weightUnitCode: new NgcFormControl('K'),
        warehouseLocationCode: new NgcFormControl()
      })]),
    maintainTracingActivityDimensionModel: new NgcFormArray([
      new NgcFormGroup({
        numberOfPieces: new NgcFormControl(),

        dimensionLength: new NgcFormControl(),
        dimensionWidth: new NgcFormControl(),

        dimensionHeight: new NgcFormControl(),
        measurementUnitCode: new NgcFormControl('MC')

      })]),

    maintainTracingActivitiesActivityModel: new NgcFormArray([
      new NgcFormGroup({
        activity: new NgcFormControl('', [Validators.required]),
        activityType: new NgcFormControl(),
        activityPerformedOn: new NgcFormControl(NgcUtility.getCurrentDateOnly(), []),
        activityPerformedBy: new NgcFormControl('userId', []),
      })]),
    maintainTracingActivitySHCModel: new NgcFormArray([
      new NgcFormGroup({
        comTracingShipmentSHCId: new NgcFormControl(),
        comTracingShipmentInfoId: new NgcFormControl(),
        specialHandlingCode: new NgcFormControl(),
      })
    ]),


  })

  private mailForm: NgcFormGroup = new NgcFormGroup({
    // mailIDs: new NgcFormControl('', [Validators.required, Validators.pattern('[a-z,0-9,A-Z, ]*')]),
    mailContent: new NgcFormControl(),
    subject: new NgcFormControl(),
    mailIDs: new NgcFormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ]))

  }
  )


  onCreateTracingActivity() {
    this.hasReadPermission = NgcUtility.hasReadPermission('DISPLAY_TRACING_RECORDS');
    if (this.create === 'false' || this.create === false) {
      this.maintainTracingActivity.get('caseNumber').patchValue(this.caseNum);
      const request: MaintainTracingActivity = new MaintainTracingActivity();
      // request.caseNumber = this.maintainTracingActivity.get('caseNumber').value;
      request.caseNumber = this.caseNum;
      this.tracingService.getTracingActivityDetails(request).subscribe(data => {
        this.response = data.data;
        this.refreshFormMessages(data);
        if (this.response) {
          this.isClaimSettlementOption = true;
          this.maintainTracingActivity.patchValue(this.response);

          if (this.response.shipmentNumber) {
            this.shipNumber = this.response.shipmentNumber;
            this.refDoc = false;
          }

          if (this.response.caseStatus === 'INVALID' || this.response.caseStatus === 'CLOSED') {
            this.invalidTracing = true;
            this.formDisabled = true;

            this.maintainTracingActivity.disable();

          }
          this.maintainTracingActivity.get('irregularityTypeCode').patchValue(this.response.irregularityTypeCode);
          this.maintainTracingActivity.get('flightDate').patchValue(this.response.flightDate);

          this.onDisableEnable();
          this.readSHCArray();

          this.maintainTracingActivity.get('shipmentNumber').patchValue(this.response.shipmentNumber);
          this.maintainTracingActivity.get('houseNumber').patchValue(this.response.houseNumber);
        } else {
          this.displayData = false;
          return;
        }

      })
    } else if (this.create) {
      this.maintainTracingActivity.get('caseNumber').patchValue(this.caseNumb);
      this.maintainTracingActivity.get('caseStatus').patchValue('OPEN');
    }

    if (this.maintainTracingActivity.get(['tracingCreatedfor']).value === 'AWB') {
      this.isAWBSelected = true;
    } else {
      this.isAWBSelected = false;
    }
  }

  public onLocationAddRow() {

    (<NgcFormArray>this.maintainTracingActivity.controls[
      'maintainTracingActivityLocationModel'
    ]).addValue([
      {
        shipmentLocationCode: null,
        pieces: null,
        weight: null,
        weightUnitCode: 'K',
        warehouseLocationCode: null,
      }
    ]);
  }
  public onDimensionAddRow() {

    (<NgcFormArray>this.maintainTracingActivity.controls[
      'maintainTracingActivityDimensionModel'
    ]).addValue([
      {
        numberOfPieces: null,
        dimensionLength: null,
        dimensionWidth: null,
        dimensionHeight: null,
        measurementUnitCode: 'MC'

      }
    ]);
  }
  public onActivityAddRow() {
    this.date = new Date();
    (<NgcFormArray>this.maintainTracingActivity.controls[
      'maintainTracingActivitiesActivityModel'
    ]).addValue([
      {
        activity: '',
        activityType: '',
        activityPerformedOn: this.date,
        activityPerformedBy: this.getUserProfile().userLoginCode,

      }
    ]);
  }
  onReferenceDocument() {
    let movedata = { flightNumber: null, shipmentNumber: this.maintainTracingActivity.get('shipmentNumber').value, flightDate: null, shipmentType: this.maintainTracingActivity.get('tracingCreatedfor').value }

    if (this.maintainTracingActivity.get('tracingCreatedfor').value == 'AWB' || this.maintainTracingActivity.get('tracingCreatedfor').value == 'CBV') {
      this.navigateTo(this.router, 'awbmgmt/shipmentinfo', movedata);
    } else {
      this.navigateTo(this.router, 'awbmgmt/mailbagoverview', movedata);
    }
  }


  onLinkClick(event, index: any): void {
    (<NgcFormArray>this.maintainTracingActivity.controls['maintainTracingActivitiesActivityModel']).markAsDeletedAt(index);


  }

  onLocationLinkClick(event, index: any): void {
    (<NgcFormArray>this.maintainTracingActivity.controls['maintainTracingActivityLocationModel']).markAsDeletedAt(index);


  }

  onDimensionLinkClick(event, index: any): void {
    (<NgcFormArray>this.maintainTracingActivity.controls['maintainTracingActivityDimensionModel']).markAsDeletedAt(index);


  }


  onSave(event) {

    let irregularitypieces = this.maintainTracingActivity.get('irregularitypieces').value;
    let totalPieces = this.maintainTracingActivity.get('totalPieces').value;
    if (totalPieces < irregularitypieces) {
      this.showWarningMessage('tracing.irregularity.total.pieces.less');
      return
    }


    (this.maintainTracingActivity.get('maintainTracingActivityLocationModel') as NgcFormArray).controls.forEach((element: any, index: number) => {
      //console.log(element, index);
      if ((element.get('pieces').value === null || element.get('pieces').value === '') && (element.get('weight').value === null || element.get('weight').value === '')
        && (element.get('shipmentLocationCode').value === null || element.get('shipmentLocationCode').value === '') && (element.get('warehouseLocationCode').value === null || element.get('warehouseLocationCode').value === '')) {
        (this.maintainTracingActivity.get('maintainTracingActivityLocationModel') as NgcFormArray).markAsDeletedAt(index);

        (this.maintainTracingActivity.get('maintainTracingActivityLocationModel') as NgcFormArray).deleteValueAt(index);

      }

    });
    (this.maintainTracingActivity.get('maintainTracingActivitiesActivityModel') as NgcFormArray).controls.forEach((element: any, index: number) => {
      if (element.get('activity').value === null || element.get('activity').value === '' && element.get('activityPerformedBy').value === null || element.get('activityPerformedBy').value === '') {
        (this.maintainTracingActivity.get('maintainTracingActivitiesActivityModel') as NgcFormArray).markAsDeletedAt(index);
        (this.maintainTracingActivity.get('maintainTracingActivitiesActivityModel') as NgcFormArray).deleteValueAt(index);
      }

    });


    (this.maintainTracingActivity.get('maintainTracingActivityDimensionModel') as NgcFormArray).controls.forEach((element: any, index: number) => {
      if ((element.get('numberOfPieces').value === null || element.get('numberOfPieces').value === '') &&
        (element.get('dimensionLength').value === null || element.get('dimensionLength').value === '')
        && (element.get('dimensionWidth').value === null || element.get('dimensionWidth').value === '') &&
        (element.get('dimensionHeight').value === null || element.get('dimensionHeight').value === '')) {
        (this.maintainTracingActivity.get('maintainTracingActivityDimensionModel') as NgcFormArray).markAsDeletedAt(index);
        (this.maintainTracingActivity.get('maintainTracingActivityDimensionModel') as NgcFormArray).deleteValueAt(index);
      }

    });



    this.performSaveOperation();
  }


  performSaveOperation() {
    if (this.maintainTracingActivity.invalid) {
      return;
    }
    this.resetFormMessages();

    // this.createSHCArray();
    const importOrExport = this.maintainTracingActivity.get('importExportIndicator');
    if (importOrExport.value === 'IMPORT') {
      this.maintainTracingActivity.get('importExportIndicator').setValue('IMPORT');
    } if (importOrExport.value === 'EXPORT') {
      this.maintainTracingActivity.get('importExportIndicator').setValue('EXPORT');
    }

    let Irregularitytyweight = this.maintainTracingActivity.get('irregularityWeight').value;

    let totalWeight = this.maintainTracingActivity.get('totalWeight').value;
    if (totalWeight < Irregularitytyweight) {
      this.showWarningMessage('tracing.irregularity.total.weight.less');
      return
    }




    let reason = this.maintainTracingActivity.get('followUpDate').value;
    const tempDate = NgcUtility.getCurrentDateOnly();
    if (reason !== null) {
      if (reason < tempDate) {
        this.showWarningMessage('tracing.followup.date.should.future');
        return
      }
    }

    this.saveRequest = this.maintainTracingActivity.getRawValue();


    if (this.maintainTracingActivity.get('caseStatus').value === null || this.maintainTracingActivity.get('caseStatus').value === '') {
      this.saveRequest.caseStatus = 'OPEN';
    }
    if (this.maintainTracingActivity.get('stages').value === null || this.maintainTracingActivity.get('stages').value === '') {
      this.saveRequest.stages = 'INPROGRESS';
    }


    this.tracingService.onSaveTracingActivity(this.saveRequest).subscribe(data => {
      this.response = data.data;
      this.refreshFormMessages(data);
      if (this.response) {
        this.maintainTracingActivity.get('caseNumber').patchValue(this.response.caseNumber)
        // this.create=false;
        this.enable = true;
        this.enableClose = true;
        if (this.invalid === true) {
          this.invalidTracing = false;
          this.invalid = false;
        }


        this.readData();
        this.disableMail = false;
        this.showSuccessStatus('g.completed.successfully');
        if (this.maintainTracingActivity.get('shipmentNumber')) {
          this.refDoc = false;
        }
      } else {
        if (this.response.messageList.length !== 0) {
          this.errors = this.response.messageList;
          this.showErrorStatus(this.errors);
        }

      }
    }, error => this.showErrorStatus(' Error'));

  }
  public onImageSelect(event) {

    this.maintainTracingActivity.get('image').setValue(event.data);
  }


  public onUserIdSelect(data) {
    if (data) {
      if (data) {
        let userid: string = data.code;
        let userdetails: string = data.desc;

        let importstaffNumber = userdetails.split(':')[1];
        let importStaffName = userdetails.split(':')[0];
        this.maintainTracingActivity.get('importstaffNumber').patchValue(importstaffNumber);
        this.maintainTracingActivity.get('importStaffName').patchValue(importStaffName);
        ///   this.showInfoStatus(JSON.stringify(event));
      }
    }
  }
  public onexportUserIdSelect(data) {

    if (data) {
      let userid: string = data.code;
      let userdetails: string = data.desc;

      let exportstaffNumber = userdetails.split(':')[1];
      let exportStaffName = userdetails.split(':')[0];
      this.maintainTracingActivity.get('exportstaffNumber').patchValue(exportstaffNumber);
      this.maintainTracingActivity.get('exportStaffName').patchValue(exportStaffName);
      ///   this.showInfoStatus(JSON.stringify(event));
    }
  }

  public onSelectOfAWB(data) {
    if (data) {
      let awb: string = data.code;
      let hawb: string = data.desc;

      this.maintainTracingActivity.get('houseNumber').patchValue(hawb);
    }
  }
  public onDisableEnable() {


    let resultList = (<NgcFormArray>this.maintainTracingActivity.get('maintainTracingActivitiesActivityModel')).controls;
    for (let record of resultList) {
      let handledBy: string = record.get('activityPerformedBy').value;
      if (handledBy.toUpperCase() === 'SYSTEM') {
        record.disable();
      }
    }
  }
  public readSHCArray() {
    this.shcs = [];
    let resultList = (<NgcFormArray>this.maintainTracingActivity.get('maintainTracingActivitySHCModel')).controls;
    for (let record of resultList) {

      let handledBy: string = record.get('specialHandlingCode').value;
      this.shcs.push(handledBy);
    }
    this.maintainTracingActivity.get('shc').patchValue(null);
    this.maintainTracingActivity.get('shc').patchValue(this.shcs);
  }
  randomInt() {
    return Math.floor(100000 + Math.random() * 9000);

  }


  readData() {
    const request: MaintainTracingActivity = new MaintainTracingActivity();
    request.caseNumber = this.maintainTracingActivity.get('caseNumber').value;
    //   request.irregularityTypeCode = this.maintainTracingActivity.get('irregularityTypeCode').value;
    this.tracingService.getTracingActivityDetails(request).subscribe(data => {
      this.response = data.data;
      this.refreshFormMessages(data);
      if (this.response) {
        this.isClaimSettlementOption = true;
        this.refreshFormMessages(this.response);
        this.resetFormMessages();
        this.maintainTracingActivity.patchValue(this.response);
        this.maintainTracingActivity.get('irregularityTypeCode').patchValue(this.response.irregularityTypeCode);
        this.maintainTracingActivity.get('maintainTracingActivityDimensionModel').patchValue(this.response.maintainTracingActivityDimensionModel);
        this.maintainTracingActivity.get('flightDate').patchValue(this.response.flightDate);


        this.readSHCArray();
        this.onDisableEnable();

        this.maintainTracingActivity.get('shipmentNumber').patchValue(this.response.shipmentNumber);
        this.maintainTracingActivity.get('houseNumber').patchValue(this.response.houseNumber);
        if (this.response.caseStatus === 'CLOSED' || this.response.caseStatus === 'INVALID') {
          this.formDisabled = true;
          this.maintainTracingActivity.disable();
        }
      } else {
        this.displayData = false;
        this.showErrorStatus('tracing.no.record.found');
        return;
      }
    })
  }
  onInvalidTracing() {

    if (this.maintainTracingActivity.get('flagCRUD').value === 'C') {
      this.performSaveOperation();
      // this.onCreateTracingActivity();
      if (this.disabledisplay) {
        this.maintainTracingActivity.disable();
        this.formDisabled = true;
        this.enableCloseButton = true;
        this.maintainTracingActivity.get('caseStatus').patchValue('INVALID');
        this.refreshFormMessages(this.response);
        this.resetFormMessages();
        //this.showSuccessStatus("Operation Successful!");
      }

    } else {
      if (this.maintainTracingActivity.get('reasonforClosing').value === null
        || this.maintainTracingActivity.get('reasonforClosing').value === '') {
        (<NgcFormControl>this.maintainTracingActivity.get('reasonforClosing')).setValidators([Validators.required]);
        return;
      }
      this.maintainTracingActivity.get('caseStatus').patchValue('INVALID');
      this.performSaveOperation();
      //this.onCreateTracingActivity();
      this.enableCloseButton = true;
      this.invalidTracing = true;
      this.formDisabled = true;


      this.maintainTracingActivity.disable();
      this.refreshFormMessages(this.response);
      this.resetFormMessages();
      //this.showSuccessStatus("Operation Successful!");

    }

  }
  onClose() {

    if (this.maintainTracingActivity.get('flagCRUD').value === 'C') {
      this.maintainTracingActivity.disable();
      this.formDisabled = true;
      this.enableCloseButton = true;
      this.invalidTracing = true;
      this.maintainTracingActivity.get('caseStatus').patchValue('CLOSED');
      this.refreshFormMessages(this.response);
      this.resetFormMessages();
    } else {
      this.maintainTracingActivity.get('caseStatus').patchValue('CLOSED');
      this.performSaveOperation();
      this.refreshFormMessages(this.response);
      this.resetFormMessages();
      this.enableCloseButton = true;
      this.invalidTracing = true;
      this.formDisabled = true;
      this.maintainTracingActivity.disable();
      //this.showSuccessStatus("Operation Successful!");


    }


  }


  public onCancel(event) {
    this.navigateBack(this.navigateBackData);
  }


  public readSHCArrays() {
    this.shcsfromshimentpmaster = [];

    for (let record of this.response.MaintainTracingActivityShipmentInventoryModel) {

      //  let handledBy: string = record.get('specialHandlingCode_1').value;
      this.shcsfromshimentpmaster.push(record.get('specialHandlingCode_1').value);
      this.shcsfromshimentpmaster.push(record.get('specialHandlingCode_2').value);
      this.shcsfromshimentpmaster.push(record.get('specialHandlingCode_3').value);
    }
    this.maintainTracingActivity.get('shc').patchValue(null);
    this.maintainTracingActivity.get('shc').patchValue(this.shcsfromshimentpmaster);
  }

  onTracingForChange(event) {
    if (event === 'AWB')
      this.isAWBSelected = true;
    else
      this.isAWBSelected = false;
  }

  onSendEmail() {
    this.mailattachmentRef = this.maintainTracingActivity.get('caseNumber').value + this.maintainTracingActivity.get('shipmentNumber').value;
    const request = this.maintainTracingActivity.getRawValue();
    this.screenfiles = this.mainFlies.getFiles();
    this.screenfiles.forEach(element => {
      element.entityKey = this.mailattachmentRef;
      element.uploadDocId = null;
      element.referenceId = null;
    });
    //this.showPopUpfiles.getFiles().forEach(element=>{
    //this.screenfiles.push(element);
    // });
    this.showPopUpfiles.updateFiles(this.screenfiles);
    console.log(this.mailattachmentRef);
    console.log(this.screenfiles);

    this.tracingService.getTracingEmailInfo(request).subscribe(data => {
      this.response = data.data;
      this.refreshFormMessages(data);
      if (this.response) {
        //console.log(this.response);
        const mailInfo = this.response;
        this.mailForm.patchValue(this.response);

      } else {
        this.displayData = false;
        return;
      }

    })
    this.showPopUpWindow.open();
  }
  private validateEmail(Email) {
    let patt = new RegExp("[a-zA-Z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+(\.[a-zA-Z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.([a-zA-Z]{2,})");
    return patt.test(Email);
  }

  sendMail() {
    this.isvalidmail = true;
    var request: EmailInfo = new EmailInfo();
    var tracingActivity = new MaintainTracingActivitiesActivityModel();
    request = this.mailForm.getRawValue();
    request.uploadFilekey = this.maintainTracingActivity.get('caseNumber').value + this.maintainTracingActivity.get('shipmentNumber').value;
    request.caseNumber = this.maintainTracingActivity.get('caseNumber').value;
    tracingActivity.activity = 'Email For ' + this.maintainTracingActivity.get('irregularityTypeCode').value;
    tracingActivity.activityPerformedOn = new Date();
    tracingActivity.activityPerformedBy = this.getUserProfile().userLoginCode;
    request.tracingFollowup = tracingActivity;
    request.mailIDs.forEach(element => {
      if (!this.validateEmail(element)) {
        this.isvalidmail = false;
        return this.showErrorStatus('tracing.invalid.email');
      }
    });

    if (this.isvalidmail) {
      this.tracingService.sendTracingMail(request).subscribe(data => {
        this.response = data.data;
        this.refreshFormMessages(data);
        if (this.response) {
          //console.log(this.response);
          const mailInfo = this.response;
          this.mailForm.patchValue(this.response);
          (<NgcFormArray>this.maintainTracingActivity.controls[
            'maintainTracingActivitiesActivityModel'
          ]).addValue([
            {
              activity: 'Email For ' + this.maintainTracingActivity.get('irregularityTypeCode').value,
              activityPerformedOn: new Date(),
              activityPerformedBy: this.getUserProfile().userLoginCode,
            }
          ]);
          this.showSuccessStatus('tracing.email.sent');
          this.showPopUpWindow.close();
        } else {
          this.errors = this.response.messageList;
          console.log(this.errors);
          this.showErrorStatus(this.response);
        }

      });
    }

  }

  onChange(event) {

  }


  onShipmentRemarks() {
    let movedata = { shipmentNumber: null, caseNumb: null, caseNumber: null, shipmentType: null, createFlag: "U" }
    movedata['caseNumb'] = this.maintainTracingActivity.get('caseNumber').value;
    movedata['caseNumber'] = this.maintainTracingActivity.get('caseNumber').value;
    movedata['shipmentNumber'] = this.maintainTracingActivity.get('shipmentNumber').value;
    movedata['shipmentType'] = this.maintainTracingActivity.get('tracingCreatedfor').value;
    this.navigateTo(this.router, '/awbmgmt/maintainremarks', movedata);
  }

  openMaintainHousePage() {
    let movedata = { shipmentNumber: null, caseNumb: null, caseNumber: null, shipmentType: null, createFlag: "U" }
    movedata['caseNumb'] = this.maintainTracingActivity.get('caseNumber').value;
    movedata['caseNumber'] = this.maintainTracingActivity.get('caseNumber').value;
    movedata['awbNumber'] = this.maintainTracingActivity.get('shipmentNumber').value;
    movedata['shipmentNumber'] = this.maintainTracingActivity.get('shipmentNumber').value;
    console.log(movedata);
    this.navigateTo(this.router, 'awbmgmt/maintainhouse', movedata);
  }

  openIrregularityPage() {
    let movedata = { shipmentNumber: null, caseNumb: null, caseNumber: null, shipmentType: null, createFlag: "U" }
    movedata['caseNumb'] = this.maintainTracingActivity.get('caseNumber').value;
    movedata['caseNumber'] = this.maintainTracingActivity.get('caseNumber').value;
    movedata['shipmentNumber'] = this.maintainTracingActivity.get('shipmentNumber').value;
    movedata['shipmentType'] = this.maintainTracingActivity.get('tracingCreatedfor').value;
    this.navigateTo(this.router, 'awbmgmt/irregularity', movedata);
  }

  openLocationPage() {
    let movedata = { shipmentNumber: null, caseNumb: null, caseNumber: null, shipmentType: null, createFlag: "U" }
    movedata['caseNumb'] = this.maintainTracingActivity.get('caseNumber').value;
    movedata['caseNumber'] = this.maintainTracingActivity.get('caseNumber').value;
    movedata['shipmentNumber'] = this.maintainTracingActivity.get('shipmentNumber').value;
    movedata['shipmentType'] = this.maintainTracingActivity.get('tracingCreatedfor').value;
    this.navigateTo(this.router, 'awbmgmt/shipmentLocation', movedata);
  }

  openHoldShipmentPage() {
    let movedata = { shipmentNumber: null, caseNumb: null, caseNumber: null, shipmentType: null, createFlag: "U" }
    movedata['caseNumb'] = this.maintainTracingActivity.get('caseNumber').value;
    movedata['caseNumber'] = this.maintainTracingActivity.get('caseNumber').value;
    movedata['shipmentNumber'] = this.maintainTracingActivity.get('shipmentNumber').value;
    movedata['shipmentType'] = this.maintainTracingActivity.get('tracingCreatedfor').value;
    this.navigateTo(this.router, 'awbmgmt/shipmentonhold', movedata);
  }

  openShipmentInfoPage() {
    let movedata = { shipmentNumber: null, caseNumb: null, caseNumber: null, shipmentType: null, createFlag: "U" }
    movedata['caseNumb'] = this.maintainTracingActivity.get('caseNumber').value;
    movedata['caseNumber'] = this.maintainTracingActivity.get('caseNumber').value;
    movedata['shipmentNumber'] = this.maintainTracingActivity.get('shipmentNumber').value;
    movedata['shipmentType'] = this.maintainTracingActivity.get('tracingCreatedfor').value;
    this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', movedata);
  }

  onRestore() {
    const request: MaintainTracingActivityShipmentData = this.maintainTracingActivity.getRawValue();
    this.resetFormMessages();
    this.tracingService.restoreTracingRecord(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.maintainTracingActivity.get('caseStatus').patchValue('INPROGRESS');
        this.maintainTracingActivity.get('reasonforClosing').patchValue(null);
        this.enableCloseButton = false;
        this.invalidTracing = false;
        this.formDisabled = false;
        this.readData();
        this.maintainTracingActivity.enable();
        this.showSuccessStatus("tracing.record.restored");
      }

    }, error => { this.showErrorStatus(error); });





  }

  claimSettlement(claimSettlement, event, entityKey) {
    let uploadePhotoList: Array<any> = claimSettlement.getAllItems();

    if (event && event.file) {
      event.file.remarks = "claim Settlement" + entityKey;
    }
  }

}



