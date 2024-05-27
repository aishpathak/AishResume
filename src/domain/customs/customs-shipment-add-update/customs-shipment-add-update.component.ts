import { Component, OnInit } from '@angular/core';
import {
  NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, ContentChildren, forwardRef, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroupDirective, FormArray, FormGroup, FormControl, FormControlName, Validators } from '@angular/forms';
// Application   
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, BaseResponse, NgcWindowComponent,
  NgcUtility, NgcTabsComponent, PageConfiguration, CellsRendererStyle, NgcFormControl, NgcSHCInputComponent
} from 'ngc-framework';
import { CustomACESService } from './../customs.service';
import { customMrs } from './../customs.sharedmodel';

import { CellsStyleClass } from './../../../shared/shared.data';

@Component({
  selector: 'app-customs-shipment-add-update',
  templateUrl: './customs-shipment-add-update.component.html',
  styleUrls: ['./customs-shipment-add-update.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class CustomsShipmentAddUpdateComponent extends NgcPage {
  response: any;
  excemptionCodeFlag: boolean;
  permitNumberFlag: boolean;
  permitToFollowFlag: boolean;
  showTable = false;
  displayData = false;
  disableForm = false;
  create: boolean = true;
  fltKey: String;
  fltDate: any;
  shipper: boolean = true;
  consignee: boolean = false;
  tsredoc: boolean = false;
  partshipment: boolean = false;
  updateflag = false;
  addflag = true;
  acesflag = false;
  errors: any;
  imp = true;
  exp = false;
  custFlightId: any;
  trackExportImport: string;
  trackExportImports: string;
  isremarks: string;
  prevValue: string;
  searchFlag: false;
  data: any;
  ondetails: any = false;
  fwddata: any;
  custDtlsExist: any = false;
  airportCode: any;
  cityCode: any;
  hasReadPermission: boolean = false;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private customACESService: CustomACESService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);

  }
  ngOnInit() {
    super.ngOnInit();
    this.tsredoc = false;
    this.partshipment = false;
    this.airportCode = NgcUtility.getTenantConfiguration().airportCode;
    this.cityCode = NgcUtility.getTenantConfiguration().cityCode;
    //  this.customsShipmentAddUpdateForm.get('localAuthorityType').setValue('PT');
    this.permitToFollowFlag = true;
    this.customsShipmentAddUpdateForm.get('localAuthorityType').valueChanges.subscribe(
      (newValue) => {
        if (newValue) {

          let appointed = null;
          if (newValue !== this.prevValue) {
            if (this.response.localAuthorityinfo && this.response.localAuthorityinfo.length > 0 && this.response.localAuthorityinfo[0].appointedAgent && this.response.localAuthorityinfo[0].appointedAgent !== null) {
              appointed = this.response.localAuthorityinfo[0].appointedAgent;
            }
            if (newValue === 'EC') {
              this.customsShipmentAddUpdateForm.get('localAuthorityinfo').patchValue([{

                referenceNumber: null,
                appointedAgent: appointed,
                license: null,
                remarks: null,
                deliveryOrderNo: null,
              }]);
              // this.showLicenseRemarksFlag = true;
              this.permitNumberFlag = false;
              this.excemptionCodeFlag = true;
              this.permitToFollowFlag = false;
              this.prevValue = newValue;
            }
            if (newValue === 'PN') {
              this.customsShipmentAddUpdateForm.get('localAuthorityinfo').patchValue([{
                referenceNumber: null,
                appointedAgent: appointed,
                license: null,
                remarks: null,
                deliveryOrderNo: null,
              }]);
              // this.showLicenseRemarksFlag = false;
              this.permitNumberFlag = true;
              this.excemptionCodeFlag = false;
              this.permitToFollowFlag = false;
              this.prevValue = newValue;
            }
            if (newValue === 'IA') {
              this.customsShipmentAddUpdateForm.get('localAuthorityinfo').patchValue([{

                referenceNumber: null,
                appointedAgent: appointed,
                license: null,
                remarks: null,
                deliveryOrderNo: null,
              }]);
              // this.showLicenseRemarksFlag = false;
              this.permitNumberFlag = false;
              this.permitToFollowFlag = true;
              this.excemptionCodeFlag = false;
              this.prevValue = newValue;
            }
            if (newValue === 'PTF') {
              this.customsShipmentAddUpdateForm.get('localAuthorityinfo').patchValue([{

                referenceNumber: null,
                appointedAgent: appointed,
                license: null,
                remarks: null
              }]);
              // this.showLicenseRemarksFlag = false;
              this.permitNumberFlag = false;
              this.permitToFollowFlag = true;
              this.excemptionCodeFlag = false;
              this.prevValue = newValue;
            }

          }
        }
      }
    );



    this.customsShipmentAddUpdateForm.get('exportOrImport').valueChanges.subscribe(
      (newValue) => {
        if (newValue !== this.trackExportImport && newValue !== this.trackExportImports) {
          if ((newValue === 'E' || newValue === 'EXPORT')) {
            this.trackExportImport = 'E';
            this.trackExportImports = newValue;
            this.imp = false;
            this.exp = true;
            if (!this.customsShipmentAddUpdateForm.get('localAuthorityType').value) {
              this.customsShipmentAddUpdateForm.get('localAuthorityType').setValue('PTF');
              this.permitNumberFlag = false;
              this.permitToFollowFlag = true;
              this.excemptionCodeFlag = false;
              this.customsShipmentAddUpdateForm.get(['localAuthorityinfo', 0, 'referenceNumber']).patchValue('PTF');
            }
          } else if ((newValue === 'I' || newValue === 'IMPORT')) {
            this.trackExportImport = 'I';
            this.trackExportImports = newValue;
            //{
            if (!this.customsShipmentAddUpdateForm.get('localAuthorityType').value) {
              this.customsShipmentAddUpdateForm.get('localAuthorityType').setValue('IA');
              this.permitNumberFlag = false;
              this.permitToFollowFlag = true;
              this.excemptionCodeFlag = false;
            }
            this.imp = true;
            this.exp = false;

          }
        }
      });
    // this.customsShipmentAddUpdateForm.get('customerType').valueChanges.subscribe(
    //   (newValue) => {
    //     if (newValue) {
    //       if (newValue === 'AGT') {
    //         this.consignee = false;
    //         this.shipper = true;
    //         //     this.refreshCustomerAdress();
    //         (<NgcFormArray>this.customsShipmentAddUpdateForm.get('customerList')).controls.forEach(element => {
    //           if (element.get('customerType').value === 'AGT') { this.customerAdress(element) }


    //         })

    //       }
    //       else if (newValue === 'CNE') {
    //         this.consignee = true;
    //         this.shipper = false;
    //         //  this.refreshCustomerAdress();
    //         (<NgcFormArray>this.customsShipmentAddUpdateForm.get('customerList')).controls.forEach(element => {
    //           if (element.get('customerType').value === 'CNE') {
    //             this.customerAdress(element)

    //           }


    //         })

    //       }
    //       else if (newValue === 'SHP') {
    //         this.consignee = false;
    //         this.shipper = true;
    //         //  this.refreshCustomerAdress();
    //         (<NgcFormArray>this.customsShipmentAddUpdateForm.get('customerList')).controls.forEach(element => {
    //           if (element.get('customerType').value === 'SHP') { this.customerAdress(element) }



    //         })

    //       }
    //       else if ((newValue === 'SHP' || newValue === 'DSHP') && (this.customsShipmentAddUpdateForm.get('localAuthorityinfo.appointedAgent').value === null)) {
    //         this.consignee = false;
    //         this.shipper = true;
    //         //   this.refreshCustomerAdress();
    //         (<NgcFormArray>this.customsShipmentAddUpdateForm.get('customerList')).controls.forEach(element => {
    //           if (element.get('customerType').value === 'SHP') {
    //             this.customerAdress(element)

    //             this.partshipment = true;

    //           }



    //         })

    //       }
    //     }
    //   }
    // );





    let forwardedData = this.getNavigateData(this.activatedRoute);
    this.fwddata = forwardedData;
    if (forwardedData) {
      this.data = forwardedData;
      // if(forwardedData.operation==='UPDATE'){
      //   this.disableForm=true;
      // }
      if (forwardedData.operation === 'UPDATE') {
        this.updateflag = true;
        this.addflag = false;
        this.acesflag = false;
        this.customsShipmentAddUpdateForm.get('customsFlightId').patchValue(forwardedData.customsFlightId);
        this.custFlightId = forwardedData.customsFlightId;
        this.onupdate(forwardedData, true);

      }


      else if (forwardedData.operation === 'ADD') {
        this.updateflag = false;
        this.addflag = true;
        this.acesflag = false;
        this.customsShipmentAddUpdateForm.get('exportOrImport').patchValue(forwardedData.exportOrImport);
        this.customsShipmentAddUpdateForm.get('flightKey').patchValue(forwardedData.flightKey);
        this.customsShipmentAddUpdateForm.get('flightDate').patchValue(forwardedData.flightDate);
        this.customsShipmentAddUpdateForm.get('customsFlightId').patchValue(forwardedData.customsFlightId);
        this.custFlightId = forwardedData.customsFlightId;
        this.fltKey = forwardedData.flightKey;
        this.fltDate = forwardedData.flightDate;
        this.customsShipmentAddUpdateForm.get('exportOrImport').disable();
        this.customsShipmentAddUpdateForm.get('flightKey').disable();
        this.customsShipmentAddUpdateForm.get('flightDate').disable();
      } else if (forwardedData.operation === 'READ') {
        this.updateflag = false;
        this.addflag = false;
        this.acesflag = true;
        this.custFlightId = forwardedData.customsFlightId;
        this.onupdate(forwardedData, true);
        this.customsShipmentAddUpdateForm.disable();
        this.customeradress.disable();
        (<NgcFormArray>this.customsShipmentAddUpdateForm.get('localAuthorityinfo')).controls.forEach(element => {
          element.get('referenceNumber').disable();
          element.get('appointedAgent').disable();
          element.get('license').disable();
          element.get('remarks').disable();
          element.disable();
        });
        this.ondetails = true;


      }
    }

    this.hasReadPermission = NgcUtility.hasReadPermission('MANIFEST_RECONCILLATION_STMT');
  }



  private customeradress: NgcFormGroup = new NgcFormGroup
    ({
      appointedAgent: new NgcFormControl(),
      customerType: new NgcFormControl(),
      customerName: new NgcFormControl(null, [Validators.maxLength(35)]),
      streetAddress: new NgcFormControl(null, [Validators.maxLength(35)]),
      customerNameTwo: new NgcFormControl(null, [Validators.maxLength(35)]),
      streetAddressTwo: new NgcFormControl(null, [Validators.maxLength(35)]),
      place: new NgcFormControl(),
      postal: new NgcFormControl(),
      stateCode: new NgcFormControl(),
      countryCode: new NgcFormControl(),
      incoming: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      tsRedocflightDate: new NgcFormControl(),
      tsredoc: new NgcFormControl(),
    })
  private customsShipmentAddUpdateForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(null, [Validators.required]),
    flightDate: new NgcFormControl(null, [Validators.required]),
    shipmentNumber: new NgcFormControl(null, [Validators.required]),
    exportOrImport: new NgcFormControl(null, [Validators.required]),
    pieces: new NgcFormControl(null, [Validators.required]),
    weight: new NgcFormControl(null, [Validators.required]),
    shipmentPiece: new NgcFormControl(null, [Validators.required]),
    shipmentWeight: new NgcFormControl(null, [Validators.required]),
    natureOfGoodsDescription: new NgcFormControl(null, [Validators.required]),
    origin: new NgcFormControl(null, [Validators.required]),
    destination: new NgcFormControl(null, [Validators.required]),
    agentCode: new NgcFormControl(null, [Validators.required]),
    incoming: new NgcFormControl(),
    partShipment: new NgcFormControl(),
    date: new NgcFormControl(),
    license: new NgcFormControl(),
    remarks: new NgcFormControl(null, [Validators.maxLength(65)]),
    customShipmentInfoId: new NgcFormControl(),
    customsFlightId: new NgcFormControl(),
    firstFlightKey: new NgcFormControl(),
    firstFlightDate: new NgcFormControl(),
    //  localAuthorityinfo : new NgcFormGroup({
    flag: new NgcFormControl(),
    customerType: new NgcFormControl(null, [Validators.required]),
    localAuthorityType: new NgcFormControl(),
    directConsigneeCustomerId: new NgcFormControl(),
    directShipperCustomerId: new NgcFormControl(),
    localAuthorityinfo: new NgcFormArray([
      new NgcFormGroup({
        localAuthorityType: new NgcFormControl(),
        referenceNumber: new NgcFormControl(),
        appointedAgent: new NgcFormControl(),
        license: new NgcFormControl(),
        remarks: new NgcFormControl(),
        deliveryOrderNo: new NgcFormControl(),
        tSRedocFlightKey: new NgcFormControl(),
        tSRedocFlightDate: new NgcFormControl(),
      })
    ]),
    customerList: new NgcFormArray([
      new NgcFormGroup({
        appointedAgent: new NgcFormControl(),
        customerType: new NgcFormControl(),
        customerName: new NgcFormControl(null),
        streetAddress: new NgcFormControl(null),
        place: new NgcFormControl(),
        postal: new NgcFormControl(),
        stateCode: new NgcFormControl(),
        countryCode: new NgcFormControl(),
        incoming: new NgcFormControl(),
        flightDate: new NgcFormControl(),
      })

    ])

  })

  onSearch() {
    //searchFlag: true;
    // this.partshipment = false;
    // this.tsredoc = false;
    const req: customMrs = new customMrs();
    if (this.customsShipmentAddUpdateForm.get('exportOrImport').value === 'IMPORT') {
      this.customsShipmentAddUpdateForm.get('exportOrImport').patchValue('I');
    } else {
      this.customsShipmentAddUpdateForm.get('exportOrImport').patchValue('E');
    }
    req.exportOrImport = this.customsShipmentAddUpdateForm.get('exportOrImport').value;
    req.flightKey = this.customsShipmentAddUpdateForm.get('flightKey').value;
    req.flightDate = this.customsShipmentAddUpdateForm.get('flightDate').value;
    req.shipmentNumber = this.customsShipmentAddUpdateForm.get('shipmentNumber').value;
    this.fltKey = this.customsShipmentAddUpdateForm.get('flightKey').value;
    this.fltDate = this.customsShipmentAddUpdateForm.get('flightDate').value;
    req.customsFlightId = this.custFlightId;


    if (this.fwddata && this.fwddata.operation && this.fwddata.operation === 'ADD') {
      req.addOrUpdate = 'ADD'
    } else if (this.fwddata && this.fwddata.operation && this.fwddata.operation === 'UPDATE') {
      req.addOrUpdate = 'UPDATE'
    } else if (this.fwddata && this.fwddata.operation && this.fwddata.operation === 'READ') {
      req.addOrUpdate = 'READ'

    }
    if (this.updateflag) {
      req.addOrUpdate = 'UPDATE'
    }
    if (this.addflag) {
      req.addOrUpdate = 'ADD'
    }
    console.log(req);
    this.customACESService.getMrsShipmentInfo(req).subscribe(data => {
      this.response = data.data;
      this.refreshFormMessages(data);
      if (this.response) {
        this.customsShipmentAddUpdateForm.patchValue(this.response);

        if (this.customsShipmentAddUpdateForm.get('partShipmentFlag').value === 1) {

          if (this.response.firstFlightKey !== null) {
            this.customeradress.get('incoming').setValue(this.response.firstFlightKey)
          }
          if (this.response.firstFlightDate !== null
          ) {
            this.customeradress.get('flightDate').setValue(this.response.firstFlightDate)
          }
        }
        let formData: any = this.response;
        if (formData.localAuthorityinfo.length > 0) {
          this.customeradress.get('tsRedocflightDate').patchValue(formData.localAuthorityinfo[0].tsredocFlightDate);
          this.customeradress.get('tsredoc').patchValue(formData.localAuthorityinfo[0].tsredocFlightKey);
        }

        this.customsShipmentAddUpdateForm.get('localAuthorityinfo').patchValue(this.response.localAuthorityinfo);
        //      this.customsShipmentAddUpdateForm.get(['localAuthorityinfo', 0, 'localAuthorityType']).patchValue(this.customsShipmentAddUpdateForm.get('localAuthorityType'));
        this.customsShipmentAddUpdateForm.get('customsFlightId').patchValue(this.response.customsFlightId);
        this.customsShipmentAddUpdateForm.get('customerType').patchValue(this.response.customerType);
        if (this.response.partShipment === 'N') {
          this.customsShipmentAddUpdateForm.get('pieces').setValue(null);
          this.customsShipmentAddUpdateForm.get('weight').setValue(null);
        }
        if (this.customsShipmentAddUpdateForm.get('exportOrImport').value === 'I') {
          this.customsShipmentAddUpdateForm.get('exportOrImport').patchValue('IMPORT');
          //    this.customeradress.get('incoming').patchValue(this.fltKey);

          //   this.customeradress.get('date').patchValue(this.fltDate);
        } else {

          this.customsShipmentAddUpdateForm.get('exportOrImport').patchValue('EXPORT');
        }
        this.customsShipmentAddUpdateForm.get('flightKey').patchValue(this.fltKey);
        this.customsShipmentAddUpdateForm.get('flightDate').patchValue(this.fltDate);
        (<NgcFormArray>this.customsShipmentAddUpdateForm.get('customerList')).controls.forEach(element => {
          if (element.get('customerType').value === 'SHP' || element.get('customerType').value === 'DSHP') {

            this.tsredoc = true;
          }



        })

        // if (this.customsShipmentAddUpdateForm.get('partShipmentFlag').value === 1) {

        //   if (this.customsShipmentAddUpdateForm.getRawValue().firstFlightKey !== null) {
        //     this.customeradress.get('incoming').setValue(this.customsShipmentAddUpdateForm.get('firstFlightKey').value)
        //   }
        //   if (this.customsShipmentAddUpdateForm.getRawValue().firstFlightDate !== null
        //   ) {
        //     this.customeradress.get('flightDate').setValue(this.customsShipmentAddUpdateForm.get('firstFlightDate').value)
        //   }
        // }

        // if (this.customsShipmentAddUpdateForm.get('flightKey').value !== null) {
        //   this.customeradress.get('tsredoc').setValue(this.customsShipmentAddUpdateForm.get('flightKey').value)
        // }
        // if (this.customsShipmentAddUpdateForm.get('flightDate').value !== null) {
        //   this.customeradress.get('tsRedocflightDate').setValue(this.customsShipmentAddUpdateForm.get('flightDate').value)
        // }


        // if (this.customsShipmentAddUpdateForm.get('destination').value === 'SIN') {
        //   (<NgcFormArray>this.customsShipmentAddUpdateForm.get(['localAuthorityinfo', 0, 'referenceNumber'])).setValue("PTF");
        // }
        //  this.defaultLarType()

        this.showTable = true;
        this.readCustomerarry();
        if (this.response.localAuthorityinfo && this.response.localAuthorityinfo.length > 0) {
          if (this.response.localAuthorityinfo[0].license) {
            this.customsShipmentAddUpdateForm.get('license').patchValue(this.response.localAuthorityinfo[0].license);
          }
          if (this.response.localAuthorityinfo[0].remarks) {
            this.customsShipmentAddUpdateForm.get('remarks').patchValue(this.response.localAuthorityinfo[0].remarks);
          }
          if (this.response.localAuthorityinfo[0].localAuthorityType) {
            this.customsShipmentAddUpdateForm.get('localAuthorityType').patchValue(this.response.localAuthorityinfo[0].localAuthorityType);
          }
        }
        this.onAddLarType();
        this.showSuccessStatus('g.completed.successfully');
      } else {

        this.errors = this.response.messageList;
        this.showErrorStatus(this.response);
      }
    }, error => this.showErrorStatus('g.error'));

  }
  onSave(event) {
    let count = 0;
    if (this.customsShipmentAddUpdateForm.get('localAuthorityType').value && (<NgcFormArray>this.customsShipmentAddUpdateForm.get('localAuthorityinfo')).length > 0) {

      (<NgcFormArray>this.customsShipmentAddUpdateForm.get('localAuthorityinfo')).controls.forEach(element => {
        if (count === 0) {
          count++;
          if (this.customsShipmentAddUpdateForm.get('localAuthorityType').value === 'EC') {
            if (element.get('referenceNumber').value === null || element.get('referenceNumber').value === '') {
              this.showErrorStatus('exemptionCodeMandatory');
              return;
            }
            if ((element.get('appointedAgent').value === null || element.get('appointedAgent').value === '') && element.get('referenceNumber').value !== 'TS') {
              this.showErrorStatus('agent.code.is.mandatory');
              return;
            }
            if (element.get('referenceNumber').value === 'ZZ') {
              if (!this.customsShipmentAddUpdateForm.get('remarks').value) {
                this.showErrorStatus('export.reason.mandatory');


                return;
              }
              else {
                this.performSave();
              }

            } else {
              this.performSave();
            }
          } else if (this.customsShipmentAddUpdateForm.get('localAuthorityType').value === 'PN') {
            if (element.get('referenceNumber').value === null || element.get('referenceNumber').value === '') {
              this.showErrorStatus('permitNumberMandatory');
              return;
            }
            if (element.get('appointedAgent').value === null || element.get('appointedAgent').value === '') {
              this.showErrorStatus('agent.code.is.mandatory');
              return;
            } else {
              this.performSave();
            }
          }
          else if (this.customsShipmentAddUpdateForm.get('localAuthorityType').value === 'IA' || this.customsShipmentAddUpdateForm.get('localAuthorityType').value === 'PTF') {
            if (element.get('referenceNumber').value === null || element.get('referenceNumber').value === '') {
              this.showErrorStatus('acesCodeMandatory');
              return;
            }
            if (element.get('appointedAgent').value === null || element.get('appointedAgent').value === '') {
              this.showErrorStatus('agent.code.is.mandatory');
              return;
            }
            else {
              this.performSave();
            }
          }

          else {
            this.performSave();
          }
        }
      });

    } else {

      this.performSave();


    }



  }
  onupdate(object: any, flag: any) {
    // this.partshipment = false;
    // this.tsredoc = false;
    // searchFlag: false;
    let req: customMrs = new customMrs();

    req = this.customsShipmentAddUpdateForm.getRawValue();
    req.exportOrImport = object.exportOrImport;
    req.exportOrImport = object.exportOrImport;
    req.flightKey = object.flightKey;
    req.flightDate = object.flightDate;
    req.shipmentNumber = object.shipmentNumber;
    req.doNumber = object.doNumber;
    req.mrsStatusCode = object.mrsStatusCode;
    req.shipmentPiece = object.shipmentPiece;
    req.shipmentWeight = object.shipmentWeight;
    req.flag = flag;
    req.customsFlightId = this.custFlightId;
    this.fltDate = object.flightDate;
    this.fltKey = object.flightKey;
    console.log(req);
    this.customsShipmentAddUpdateForm.get('flightKey').disable();
    this.customsShipmentAddUpdateForm.get('flightDate').disable();
    this.customsShipmentAddUpdateForm.get('exportOrImport').disable();
    this.customsShipmentAddUpdateForm.get('shipmentNumber').disable();
    this.partshipment = false;
    this.tsredoc = false;
    if (this.fwddata && this.fwddata.operation && this.fwddata.operation === 'ADD') {
      req.addOrUpdate = 'ADD'
    } else if (this.fwddata && this.fwddata.operation && this.fwddata.operation === 'UPDATE') {
      req.addOrUpdate = 'UPDATE'
    } else if (this.fwddata && this.fwddata.operation && this.fwddata.operation === 'READ') {
      req.addOrUpdate = 'READ'
    }

    this.customACESService.getCustomsShipmentInfo(req).subscribe(data => {
      this.response = data.data;
      this.refreshFormMessages(data);
      if (this.response) {
        this.create = false;
        this.customsShipmentAddUpdateForm.patchValue(this.response);
        if (this.customsShipmentAddUpdateForm.get('partShipmentFlag').value === 1) {

          if (this.response.firstFlightKey !== null) {
            this.customeradress.get('incoming').setValue(this.response.firstFlightKey)
          }
          if (this.response.firstFlightDate !== null
          ) {
            this.customeradress.get('flightDate').setValue(this.response.firstFlightDate)
          }
        }
        if (this.response.localAuthorityinfo && this.response.localAuthorityinfo.length > 0) {
          if (this.response.localAuthorityinfo[0].license) {
            this.customsShipmentAddUpdateForm.get('license').patchValue(this.response.localAuthorityinfo[0].license);
          }
          if (this.response.localAuthorityinfo[0].remarks) {
            this.customsShipmentAddUpdateForm.get('remarks').patchValue(this.response.localAuthorityinfo[0].remarks);
          }

        }
        this.customsShipmentAddUpdateForm.get('localAuthorityinfo').patchValue(this.response.localAuthorityinfo);

        this.showTable = true;
        this.customsShipmentAddUpdateForm.get('flightKey').patchValue(object.flightKey);
        this.customsShipmentAddUpdateForm.get('flightDate').patchValue(object.flightDate);
        this.customsShipmentAddUpdateForm.get('customerType').patchValue(this.response.customerType);
        this.customsShipmentAddUpdateForm.get('exportOrImport').patchValue(object.exportOrImport);
        this.customsShipmentAddUpdateForm.get('partShipmentFlag').patchValue(this.response.partShipmentFlag);
        if (this.response.firstFlightKey && this.customsShipmentAddUpdateForm.get('partShipmentFlag').value === 1) {
          this.partshipment = true;
          this.customsShipmentAddUpdateForm.get('firstFlightKey').patchValue(this.response.firstFlightKey);
          this.customsShipmentAddUpdateForm.get('firstFlightDate').patchValue(this.response.firstFlightDate);
          this.customeradress.get('incoming').setValue(this.customsShipmentAddUpdateForm.get('firstFlightKey').value);
          this.customeradress.get('flightDate').setValue(this.customsShipmentAddUpdateForm.get('firstFlightDate').value);
        }


        if (this.customsShipmentAddUpdateForm.get('exportOrImport').value === 'I') {
          this.customsShipmentAddUpdateForm.get('exportOrImport').patchValue('IMPORT');
          //    this.customeradress.get('incoming').patchValue(this.fltKey);

          // this.customeradress.get('date').patchValue(this.fltDate);
        } else {

          this.customsShipmentAddUpdateForm.get('exportOrImport').patchValue('EXPORT');
        }
        this.showSuccessStatus('g.completed.successfully');
        (<NgcFormArray>this.customsShipmentAddUpdateForm.get('customerList')).controls.forEach(element => {
          if (element.get('customerType').value === 'SHP' || element.get('customerType').value === 'DSHP') {
            this.tsredoc = true;
          }
        })


        // if (this.customsShipmentAddUpdateForm.get('firstFlightKey').value !== null) {
        //   this.customeradress.get('tsredoc').setValue(this.customsShipmentAddUpdateForm.get('flightKey').value)
        // }
        // if (this.customsShipmentAddUpdateForm.get('firstFlightDate').value !== null) {
        //   this.customeradress.get('tsRedocflightDate').setValue(this.customsShipmentAddUpdateForm.get('flightDate').value)
        // }

        this.readCustomerarry();
        this.onAddLarType();
        // this.defaultLarType()

      }
    }, error => this.showErrorStatus('g.error'));

  }
  onAddPermitNumber(index) {
    (<NgcFormArray>this.customsShipmentAddUpdateForm.get('localAuthorityinfo')).addValue([
      {
        referenceNumber: '',
        appointedAgent: null,
        deliveryOrderNo: null
      }
    ]);
  }

  onDeletePermitNumberRows(index) {
    (<NgcFormArray>this.customsShipmentAddUpdateForm.get('localAuthorityinfo')).deleteValueAt(index);
  }


  public onCancel() {
    this.navigateBack(this.data);
  }

  customerAdress(element) {
    if ((<NgcFormArray>this.customsShipmentAddUpdateForm.get("localAuthorityinfo")).length > 0) {
      (<NgcFormArray>this.customsShipmentAddUpdateForm.get("localAuthorityinfo")).controls.forEach(elements => {
        let val = elements.get('appointedAgent').value;
        if (val && (val === 'IXX' || val === 'EXX' || val === 'ixx' || val === 'exx')) {

          // this.customeradress.get('appointedAgent').patchValue(element.get('appointedAgent').value)
          if (element.get('customerName').value) {
            this.customeradress.get('appointedAgent').patchValue(element.get('customerName').value)
            this.customeradress.get('appointedAgent').setValidators([Validators.required]);
          }
          if (element.get('customerType').value) {
            this.customeradress.get('customerType').patchValue(element.get('customerType').value)
          }
          if (element.get('customerName').value) {
            let name = element.get('customerName').value;
            if (name.length !== null && name.length > 35) {
              this.customeradress.get('customerName').patchValue(name.substring(0, 35));
              this.customeradress.get('customerName').setValidators([Validators.required]);
              this.customeradress.get('customerNameTwo').patchValue(name.substring(35));
            } else {
              this.customeradress.get('customerName').patchValue(name);
              this.customeradress.get('customerName').setValidators([Validators.required]);

            }
          }
          if (element.get('streetAddress').value) {
            let addressvalue = element.get('streetAddress').value;
            if (addressvalue.length !== null && addressvalue.length > 35) {
              this.customeradress.get('streetAddress').patchValue(addressvalue.substring(0, 35));
              this.customeradress.get('streetAddress').setValidators([Validators.required]);
              this.customeradress.get('streetAddressTwo').patchValue(addressvalue.substring(35));
            } else {
              this.customeradress.get('streetAddress').patchValue(addressvalue);
              this.customeradress.get('streetAddress').setValidators([Validators.required]);
            }
          }

          if (element.get('place').value) {
            this.customeradress.get('place').patchValue(element.get('place').value)
          }
          if (element.get('postal').value) {
            this.customeradress.get('postal').patchValue(element.get('postal').value);
            this.customeradress.get('postal').setValidators([Validators.required]);

          }
          if (element.get('stateCode').value) {
            this.customeradress.get('stateCode').patchValue(element.get('stateCode').value)
          }
          if (element.get('countryCode').value) {
            this.customeradress.get('countryCode').patchValue(element.get('countryCode').value)
          }

          let formData: any = this.response;
          if (formData.localAuthorityinfo.length > 0) {
            this.customeradress.get('tsRedocflightDate').patchValue(formData.localAuthorityinfo[0].tSRedocFlightDate);
            this.customeradress.get('tsredoc').patchValue(formData.localAuthorityinfo[0].tsredocFlightKey);
          }
        }
      })
    }
    if (this.customsShipmentAddUpdateForm.get('partShipmentFlag').value === 1) {

      if (this.response.firstFlightKey !== null) {
        this.customeradress.get('incoming').setValue(this.response.firstFlightKey)
      }
      if (this.response.firstFlightDate !== null
      ) {
        this.customeradress.get('flightDate').setValue(this.response.firstFlightDate)
      }
    }
  }
  refreshCustomerAdress() {
    this.customeradress.reset();

  }
  readCustomerarry() {

    (<NgcFormArray>this.customsShipmentAddUpdateForm.get('customerList')).controls.forEach(element => {
      //  if (element.get('customerType').value == this.customsShipmentAddUpdateForm.get('customerType').value) {
      this.customerAdress(element)

      //   }


    })




  }

  patchCustomerarry() {

    let arr = [];
    let custTwo = this.customeradress.get('customerNameTwo').value;
    let streetTwo = this.customeradress.get('streetAddressTwo').value;
    if (custTwo) {
      this.customeradress.get('customerName').patchValue(this.customeradress.get('customerName').value + custTwo);
    }
    if (streetTwo) {

      this.customeradress.get('streetAddress').patchValue(this.customeradress.get('streetAddress').value + streetTwo);
    }
    arr.push(this.customeradress.getRawValue());
    (<NgcFormArray>this.customsShipmentAddUpdateForm.get('customerList'))
      .patchValue(arr);

    // }

  }





  onIANumberChange(event, index) {
    const requestData = {
      referenceNumber: event

    }
    if (event && this.customsShipmentAddUpdateForm.getRawValue().exportOrImport == 'IMPORT') {
      this.customACESService.validateIANumber(requestData).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {

          const resp = response.data
          if (!resp) {
            this.showFormControlErrorMessage(<NgcFormControl>this.customsShipmentAddUpdateForm.get(['localAuthorityinfo', index, 'referenceNumber']), 'Please enter a valid IA Number');
          } else {
            // this.customsShipmentAddUpdateForm.get(['localAuthorityinfo', index, 'appointedAgent']).patchValue(resp.appointedAgent);
          }
        }
      });

    }
  }

  onExemptCodeSelect(event) {
    if (event.code == 'ZZ') {
      this.customsShipmentAddUpdateForm.get('remarks').setValidators(Validators.required);
    } else {
      this.customsShipmentAddUpdateForm.get('remarks').clearValidators();
    }
    if (event.code == 'TS') {
      this.customsShipmentAddUpdateForm.get(['localAuthorityinfo', 0, 'appointedAgent']).clearValidators();
    } else {
      this.customsShipmentAddUpdateForm.get(['localAuthorityinfo', 0, 'appointedAgent']).setValidators([Validators.required]);
    }

  }

  onAppAgent(event, index, type) {
    if (event && event.code) {
      this.customsShipmentAddUpdateForm.get("customerType").setValue(event.code);

      this.customsShipmentAddUpdateForm.get(['localAuthorityinfo', index, 'appointedAgent']).setValue(event.code);


    }
    if (this.response.localAuthorityinfo && this.response.localAuthorityinfo.length > 0) {
      this.customsShipmentAddUpdateForm.get(['localAuthorityinfo', 0, 'appointedAgent']).valueChanges.subscribe(value => {
        let flag = true;
        let agent = this.customsShipmentAddUpdateForm.get(['localAuthorityinfo', 0, 'appointedAgent']).value;
        let importAgent = this.customsShipmentAddUpdateForm.get('directConsigneeCustomerId').value;
        let exportAgent = this.customsShipmentAddUpdateForm.get('directShipperCustomerId').value;
        if (importAgent && agent && agent === importAgent) {
          flag = false;
        } else if (exportAgent && agent && agent === exportAgent) {
          flag = false;
        } else if (agent && (agent === 'IXX' || agent === 'ixx')) {
          flag = false;
        } else if (agent && (agent === 'EXX' || agent === 'exx')) {
          flag = false;
        } else {
          flag = true;
        }
        let refNumber = this.customsShipmentAddUpdateForm.get(['localAuthorityinfo', 0, 'referenceNumber']).value;
        if (refNumber && refNumber === 'TS') {
          this.customsShipmentAddUpdateForm.get(['localAuthorityinfo', 0, 'appointedAgent']).clearValidators();
        } else {
          this.customsShipmentAddUpdateForm.get(['localAuthorityinfo', 0, 'appointedAgent']).setValidators([Validators.required]);
        }
        if (flag) {
          this.customeradress.reset();
          this.customeradress.clearValidators();
          this.customeradress.get('postal').setValidators([]);
          this.customeradress.get('customerName').setValidators([]);
          this.customeradress.get('customerName').setValidators([]);
          this.customeradress.get('streetAddress').setValidators([]);
          this.customeradress.get('place').setValidators([]);

        } else {
          this.customeradress.get('postal').setValidators([Validators.required]);
          this.customeradress.get('customerName').setValidators([Validators.required]);
          this.customeradress.get('customerName').setValidators([Validators.required]);
          this.customeradress.get('streetAddress').setValidators([Validators.required]);
          this.customeradress.get('place').setValidators([Validators.required]);

        }
      })
    } else {

      //this.errors = this.response.messageList;
      //this.showErrorStatus(this.response);
    }
  }
  performSave() {
    this.custDtlsExist = false;
    this.customsShipmentAddUpdateForm.validate();
    if (!this.customsShipmentAddUpdateForm.get("customerType").value) {
      this.customsShipmentAddUpdateForm.get("customerType").setValue('IXX');
    }

    if ((<NgcFormArray>this.customsShipmentAddUpdateForm.get("localAuthorityinfo")).length > 0) {
      (<NgcFormArray>this.customsShipmentAddUpdateForm.get("localAuthorityinfo")).controls.forEach(elements => {
        let val = elements.get('appointedAgent').value;
        if (val && (val === 'IXX' || val === 'EXX' || val === 'ixx' || val === 'exx')) {
          if ((!this.customeradress.get('postal').value)
            || (!this.customeradress.get('customerName').value)
            || (!this.customeradress.get('streetAddress').value)
            || (!this.customeradress.get('place').value)) {
            this.customeradress.get('postal').setValidators([Validators.required]);
            this.customeradress.get('customerName').setValidators([Validators.required]);
            this.customeradress.get('customerName').setValidators([Validators.required]);
            this.customeradress.get('streetAddress').setValidators([Validators.required]);
            this.customeradress.get('place').setValidators([Validators.required]);
            this.custDtlsExist = true;
          }

        }
      })
    }
    if (this.custDtlsExist) {
      this.showErrorStatus('customerDetailsMandatory');
      return;
    }
    let req: any = new customMrs();
    if (this.customsShipmentAddUpdateForm.get('exportOrImport').value === 'IMPORT') {

      this.customsShipmentAddUpdateForm.get('exportOrImport').patchValue('I');

    } else if (this.customsShipmentAddUpdateForm.get('exportOrImport').value === 'EXPORT') {
      this.customsShipmentAddUpdateForm.get('exportOrImport').patchValue('E');
    } else if (NgcUtility.isTenantCityOrAirport(this.customsShipmentAddUpdateForm.get('destination').value)) {
      this.customsShipmentAddUpdateForm.get('exportOrImport').patchValue('I');
    }
    else if (NgcUtility.isTenantCityOrAirport(this.customsShipmentAddUpdateForm.get('origin').value)) {
      this.customsShipmentAddUpdateForm.get('exportOrImport').patchValue('E');
    }

    this.customsShipmentAddUpdateForm.get('exportOrImport').enable();
    this.customsShipmentAddUpdateForm.get('flightKey').enable();

    this.patchCustomerarry();
    req = this.customsShipmentAddUpdateForm.getRawValue();
    req.customerList[0] = this.customeradress.getRawValue();
    if (this.fltKey && this.fltDate) {
      this.customsShipmentAddUpdateForm.get('flightKey').patchValue(this.fltKey);
      this.customsShipmentAddUpdateForm.get('flightDate').patchValue(this.fltDate);
      req.flightKey = this.fltKey;
      req.flightDate = this.fltDate;
    }
    else {
      req.flightKey = this.customsShipmentAddUpdateForm.get('flightKey').value;
      req.flightDate = this.customsShipmentAddUpdateForm.get('flightDate').value;
      this.fltKey = this.customsShipmentAddUpdateForm.get('flightKey').value;
      this.fltDate = this.customsShipmentAddUpdateForm.get('flightDate').value;
    }
    req.flag = false;
    req.customsFlightId = this.custFlightId;
    this.customsShipmentAddUpdateForm.get('exportOrImport').disable();
    this.customsShipmentAddUpdateForm.get('flightKey').disable();
    // if( this.create){
    //   req.flagCRUD='C';
    //  for( let rec of  req.localAuthorityDetail){
    // rec['flagCRUD']='C';
    //  }
    // }
    console.log(req);
    if (NgcUtility.isTenantCityOrAirport(req.origin)) {
      req.customerList[0].customerType = 'SHP';
    }
    else if (NgcUtility.isTenantCityOrAirport(req.destination)) {
      req.customerList[0].customerType = 'CNE';
    } else {
      //needs to change with correct value
      req.customerList[0].customerType = 'SHP'
    }

    let formData: any = this.customeradress.getRawValue();
    // req.localAuthorityinfo[0].tsredocFlightDate = formData.tsRedocflightDate;
    //req.localAuthorityinfo[0].tsredocFlightKey = formData.tsredoc;
    if (this.fwddata && this.fwddata.operation && this.fwddata.operation === 'ADD') {
      req.addOrUpdate = 'ADD'
    } else if (this.fwddata && this.fwddata.operation && this.fwddata.operation === 'UPDATE') {
      req.addOrUpdate = 'UPDATE'
    } else if (this.fwddata && this.fwddata.operation && this.fwddata.operation === 'READ') {
      req.addOrUpdate = 'READ'

    }

    if (this.customsShipmentAddUpdateForm.get('remarks').valid) {
      this.customACESService.addMrsShipmentInfo(req).subscribe(data => {
        this.response = data.data;
        // this.refreshFormMessages(data);
        if (!this.showResponseErrorMessages(data)) {
          this.create = false;
          this.customsShipmentAddUpdateForm.patchValue(this.response);
          this.customsShipmentAddUpdateForm.get('flagCRUD').reset();

          this.customsShipmentAddUpdateForm.get('localAuthorityinfo').patchValue(this.response.localAuthorityinfo);
          this.customsShipmentAddUpdateForm.get('flightKey').patchValue(this.fltKey);
          this.customsShipmentAddUpdateForm.get('flightDate').patchValue(this.fltDate);
          if (this.customsShipmentAddUpdateForm.get('exportOrImport').value === 'I') {
            this.customsShipmentAddUpdateForm.get('exportOrImport').patchValue('IMPORT');
          } else {

            this.customsShipmentAddUpdateForm.get('exportOrImport').patchValue('EXPORT');
          }
          //  this.patchCustomerarry();
          this.readCustomerarry();


          this.showTable = false;
          this.showSuccessStatus('g.completed.successfully');
          this.onCancel();
        } else {

          this.errors = this.response.messageList;
          // this.showErrorStatus(this.response);
        }
      }, error => this.showErrorStatus('g.error'));
    }
  }


  onrefresh() {
    this.onSave(event);
  }



  defaultLarType() {
    if (this.customsShipmentAddUpdateForm.get('localAuthorityType').value) {
      if (this.customsShipmentAddUpdateForm.get('localAuthorityType').value === "IA") {
        (<NgcFormArray>this.customsShipmentAddUpdateForm.get('localAuthorityinfo')).controls.forEach(element => {
          element.get('appointedAgent').setValue('IXX');
        })

      }
      if (this.customsShipmentAddUpdateForm.get('localAuthorityType').value === "EC") {
        (<NgcFormArray>this.customsShipmentAddUpdateForm.get('localAuthorityinfo')).controls.forEach(element => {
          element.get('referenceNumber').setValue('TS');
        })

      }
      if (this.customsShipmentAddUpdateForm.get('localAuthorityType').value === "PTF") {
        (<NgcFormArray>this.customsShipmentAddUpdateForm.get('localAuthorityinfo')).controls.forEach(element => {
          element.get('referenceNumber').setValue('EXX');
        })

      }
    }
  }
  onDeleteLarType(event, index) {

    (this.customsShipmentAddUpdateForm.get(["localAuthorityinfo", index]) as NgcFormGroup).markAsDeleted();
  }

  onAddLarType() {

    if ((<NgcFormArray>this.customsShipmentAddUpdateForm.get("localAuthorityinfo")).length === 0) {
      this.customsShipmentAddUpdateForm.get("localAuthorityType").patchValue('IA');
      if ((<NgcFormArray>this.customsShipmentAddUpdateForm.get(["localAuthorityinfo"])).length < 1) {
        (<NgcFormArray>this.customsShipmentAddUpdateForm.get("localAuthorityinfo")).addValue([
          {
            localAuthorityType: 'IA',
            referenceNumber: '',
            appointedAgent: '',
            license: '',
            remarks: '',
            deliveryOrderNo: '',
          }
        ])
      }
    }

    // else {
    //   this.showWarningMessage('Maximum Number of rows Exceeded');
    // }
  }

  onLarChange(event) {
    let appointed = null;
    if (this.response.localAuthorityinfo && this.response.localAuthorityinfo.length > 0 && this.response.localAuthorityinfo[0].appointedAgent && this.response.localAuthorityinfo[0].appointedAgent !== null) {
      appointed = this.response.localAuthorityinfo[0].appointedAgent;
    }
    if (event === 'EC') {
      this.customsShipmentAddUpdateForm.get('localAuthorityinfo').patchValue([{

        referenceNumber: null,
        appointedAgent: appointed,
        license: null,
        remarks: null,
        deliveryOrderNo: null,
      }]);
      // this.showLicenseRemarksFlag = true;
      this.permitNumberFlag = false;
      this.excemptionCodeFlag = true;
      this.permitToFollowFlag = false;
      this.prevValue = event;
    }
    if (event === 'PN') {
      this.customsShipmentAddUpdateForm.get('localAuthorityinfo').patchValue([{
        referenceNumber: null,
        appointedAgent: appointed,
        license: null,
        remarks: null,
        deliveryOrderNo: null,
      }]);
      // this.showLicenseRemarksFlag = false;
      this.permitNumberFlag = true;
      this.excemptionCodeFlag = false;
      this.permitToFollowFlag = false;
      this.prevValue = event;
    }
    if (event === 'IA') {
      this.customsShipmentAddUpdateForm.get('localAuthorityinfo').patchValue([{

        referenceNumber: null,
        appointedAgent: appointed,
        license: null,
        remarks: null,
        deliveryOrderNo: null,
      }]);
      // this.showLicenseRemarksFlag = false;
      this.permitNumberFlag = false;
      this.permitToFollowFlag = true;
      this.excemptionCodeFlag = false;
      this.prevValue = event;
    }
    if (event === 'PTF') {
      this.customsShipmentAddUpdateForm.get('localAuthorityinfo').patchValue([{

        referenceNumber: null,
        appointedAgent: appointed,
        license: null,
        remarks: null
      }]);
      // this.showLicenseRemarksFlag = false;
      this.permitNumberFlag = false;
      this.permitToFollowFlag = true;
      this.excemptionCodeFlag = false;
      this.prevValue = event;
    }
  }
}

