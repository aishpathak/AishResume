import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MaintainAccsInformation } from '../customs.sharedmodel';
import { ElementRef, ViewContainerRef, NgZone } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ShipmentMasterCustomerInfoModel } from './../../export/export.sharedmodel';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray } from 'ngc-framework';
import { CustomACESService } from './../customs.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-maintain-accs',
  templateUrl: './maintain-accs.component.html',
  styleUrls: ['./maintain-accs.component.scss']
})
export class MaintainAccsComponent extends NgcPage {
  @Input()
  parentData = new MaintainAccsInformation();
  @Input('shipmentLists') shipmentLists: string;
  @Input('showAsPopup') showAsPopup: boolean;
  @Output() autoSearchShipment = new EventEmitter<boolean>();

  houseModel = new MaintainAccsInformation();
  forwardedData: any;
  simpleArray: any;
  data: any;

  private MaintainAccsInformation = new MaintainAccsInformation();
  shipperConsigneeRecord: ShipmentMasterCustomerInfoModel = new ShipmentMasterCustomerInfoModel();
  response;
  private shipmentInfoForm: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(''),
    awbPieces: new NgcFormControl(''),
    awbWeight: new NgcFormControl(''),
    manPieces: new NgcFormControl(''),
    manifestPieces: new NgcFormControl(''),
    manifestWeight: new NgcFormControl(''),
    origin: new NgcFormControl(''),
    destination: new NgcFormControl(''),
    loadingPoint: new NgcFormControl(''),
    natureOfGoods: new NgcFormControl(''),
    flightATA: new NgcFormControl(''),
    flightKey: new NgcFormControl(''),
    flightId: new NgcFormControl(''),
    flightDate: new NgcFormControl(''),
    flightKeyDate: new NgcFormControl(''),
    hawbPiecesWeight: new NgcFormControl(''),
    customFlightId: new NgcFormControl(''),
    shcCode: new NgcFormArray([]),
    splCode: new NgcFormArray([
      new NgcFormGroup({
        shipmentMasterSHCId: new NgcFormControl(''),
        shipmentId: new NgcFormControl(''),
        code: new NgcFormControl(''),
      })
    ]),
    handlingAgent: new NgcFormControl(''),
    relIndicator: new NgcFormControl(''),
    charges: new NgcFormGroup({
      currencyCode: new NgcFormControl(),
      wtValCharge: new NgcFormControl(),
      remark: new NgcFormControl(),
      otherCharge: new NgcFormControl(),
      carriageValue: new NgcFormControl('NVD', [Validators.maxLength(12)]),
      customValue: new NgcFormControl('NCV', [Validators.maxLength(12)])
    }),
    license: new NgcFormArray([
      new NgcFormGroup({
        detail: new NgcFormControl('', [Validators.maxLength(5)]),
        type: new NgcFormControl('LIC'),
      })
    ]),
    permit: new NgcFormArray([
      new NgcFormGroup({
        detail: new NgcFormControl('', [Validators.maxLength(5)]),
        type: new NgcFormControl('PER'),
      })
    ]),
    shipperInfo:
      new NgcFormGroup({
        customerCode: new NgcFormControl(''),
        customerName: new NgcFormControl(''),
        streetAddress: new NgcFormControl(''),
        country: new NgcFormControl(''),
        postal: new NgcFormControl(''),
        place: new NgcFormControl(''),
        state: new NgcFormControl(''),
        type: new NgcFormControl('')
      }),
    consigneeInfo:
      new NgcFormGroup({
        customerCode: new NgcFormControl(''),
        customerName: new NgcFormControl(''),
        streetAddress: new NgcFormControl(''),
        country: new NgcFormControl(''),
        postal: new NgcFormControl(''),
        place: new NgcFormControl(''),
        state: new NgcFormControl(''),
        type: new NgcFormControl('')
      })
  });

  searchButtonClicked = true;
  disableSaveButton = false
  setDob: string;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private route: ActivatedRoute,
    private customsService: CustomACESService,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    const transferData = this.getNavigateData(this.route);
    console.log(transferData);
    try {
      if (transferData !== null && transferData !== undefined) {
        this.shipmentInfoForm.patchValue(transferData);
        this.shipmentInfoForm.get('flightATA').patchValue(transferData.flightATA);
        this.shipmentInfoForm.get('customFlightId').patchValue(transferData.customFlightID);
        this.MaintainAccsInformation = this.shipmentInfoForm.getRawValue();
        this.customsService.maintainAccsFlightInfo(this.MaintainAccsInformation).subscribe(details => {
          if (details.data) {
            this.simpleArray = details.data.splCode;
            let licArr = (<NgcFormArray>this.simpleArray).length;
            if (licArr >= 0) {
              console.log("Inside loop" + licArr);
              (<NgcFormArray>this.shipmentInfoForm.get("splCode")).patchValue(
                this.simpleArray
              );
            }
            this.shipmentInfoForm.get('flightKey').patchValue(details.data.flightKey);
            this.shipmentInfoForm.get('flightDate').patchValue(details.data.flightDate);
            var datePipe = new DatePipe('en-US');
            this.setDob = datePipe.transform(details.data.flightDate, 'ddMMMyy');
            this.shipmentInfoForm.controls.flightKeyDate.patchValue(details.data.flightKey + "/" + this.setDob);
            //Shipper Info
            this.shipmentInfoForm.controls.shipperInfo.get('customerName').patchValue(details.data.shipperInfo.customerName);
            this.shipmentInfoForm.controls.shipperInfo.get('customerCode').patchValue(details.data.shipperInfo.customerCode);
            this.shipmentInfoForm.controls.shipperInfo.get('streetAddress').patchValue(details.data.shipperInfo.streetAddress);
            this.shipmentInfoForm.controls.shipperInfo.get('place').patchValue(details.data.shipperInfo.place);
            this.shipmentInfoForm.controls.shipperInfo.get('postal').patchValue(details.data.shipperInfo.postal);
            this.shipmentInfoForm.controls.shipperInfo.get('state').patchValue(details.data.shipperInfo.state);
            this.shipmentInfoForm.controls.shipperInfo.get('country').patchValue(details.data.shipperInfo.country);
            //Consignee Info
            this.shipmentInfoForm.controls.consigneeInfo.get('customerName').patchValue(details.data.consigneeInfo.customerName);
            this.shipmentInfoForm.controls.consigneeInfo.get('customerCode').patchValue(details.data.consigneeInfo.customerCode);
            this.shipmentInfoForm.controls.consigneeInfo.get('streetAddress').patchValue(details.data.consigneeInfo.streetAddress);
            this.shipmentInfoForm.controls.consigneeInfo.get('place').patchValue(details.data.consigneeInfo.place);
            this.shipmentInfoForm.controls.consigneeInfo.get('postal').patchValue(details.data.consigneeInfo.postal);
            this.shipmentInfoForm.controls.consigneeInfo.get('state').patchValue(details.data.consigneeInfo.state);
            this.shipmentInfoForm.controls.consigneeInfo.get('country').patchValue(details.data.consigneeInfo.country);
            //License-Permit info
            this.shipmentInfoForm.controls.license.patchValue(details.data.license);
            this.shipmentInfoForm.controls.permit.patchValue(details.data.permit);
            //Charges
            this.shipmentInfoForm.controls.charges.patchValue(details.data.charges);
            if (details.data.shipmentStatus == "Disabled") {
              this.disableSaveButton = true;
            } else {
              this.disableSaveButton = false;
            }



          }
        });

      }
    }
    catch (e) { }
    console.log(this.shipmentInfoForm.getRawValue());
  }

  //select shipper information
  onSelectShipperName(event) {
    if (event.code) {
      if (this.shipperConsigneeRecord.customerCode == event.code) {
        return;
      }
      else {
        let request: ShipmentMasterCustomerInfoModel = new ShipmentMasterCustomerInfoModel();
        request.customerCode = event.code;
        if (request.customerCode) {
          this.shipperConsigneeRecord = request;
          this.customsService.maintainAccsAddressInfo(request).subscribe(data => {
            if (data.data) {
              this.shipmentInfoForm.controls.shipperInfo.get('customerName').patchValue(event.desc);
              this.shipmentInfoForm.controls.shipperInfo.get('customerCode').patchValue(event.code);
              this.shipmentInfoForm.controls.shipperInfo.get('streetAddress').patchValue(data.data.streetAddress);
              this.shipmentInfoForm.controls.shipperInfo.get('place').patchValue(data.data.postal);
              this.shipmentInfoForm.controls.shipperInfo.get('state').patchValue(data.data.state);
              this.shipmentInfoForm.controls.shipperInfo.get('country').patchValue(data.data.country);
              this.shipmentInfoForm.controls.shipperInfo.get('type').patchValue('SHP');
            }
          });
        }
      }
    }
    else {
      this.patchShipperNull();
    }
  }

  patchShipperNull() {
    this.shipmentInfoForm.controls.shipperInfo.get('customerName').patchValue(null);
    this.shipmentInfoForm.controls.shipperInfo.get('customerCode').patchValue(null);
    this.shipmentInfoForm.controls.shipperInfo.get('streetAddress').patchValue(null);
    this.shipmentInfoForm.controls.shipperInfo.get('place').patchValue(null);
    this.shipmentInfoForm.controls.shipperInfo.get('state').patchValue(null);
    this.shipmentInfoForm.controls.shipperInfo.get('country').patchValue(null);
    this.shipmentInfoForm.controls.shipperInfo.get('type').patchValue(null);
  }

  //select Consignee information
  onSelectConsigneeName(event) {
    if (event && event.code) {
      if (this.shipperConsigneeRecord.customerCode == event.code) {
        return;
      }
      else {
        let request: ShipmentMasterCustomerInfoModel = new ShipmentMasterCustomerInfoModel();
        request.customerCode = event.code;
        if (request.customerCode) {
          this.shipperConsigneeRecord = request;
          this.customsService.maintainAccsAddressInfo(request).subscribe(data => {
            if (data.data) {
              this.shipmentInfoForm.controls.consigneeInfo.get('customerName').patchValue(event.desc);
              this.shipmentInfoForm.controls.consigneeInfo.get('customerCode').patchValue(event.code);
              this.shipmentInfoForm.controls.consigneeInfo.get('streetAddress').patchValue(data.data.streetAddress);
              this.shipmentInfoForm.controls.consigneeInfo.get('place').patchValue(data.data.postal);
              this.shipmentInfoForm.controls.consigneeInfo.get('state').patchValue(data.data.state);
              this.shipmentInfoForm.controls.consigneeInfo.get('country').patchValue(data.data.country);
              this.shipmentInfoForm.controls.consigneeInfo.get('type').patchValue('CNE');
            }
          });
        }
      }
    } else {
      this.patchConsigneeNull();
    }
  }

  patchConsigneeNull() {
    this.shipmentInfoForm.controls.consigneeInfo.get('customerName').patchValue(null);
    this.shipmentInfoForm.controls.consigneeInfo.get('customerCode').patchValue(null);
    this.shipmentInfoForm.controls.consigneeInfo.get('streetAddress').patchValue(null);
    this.shipmentInfoForm.controls.consigneeInfo.get('place').patchValue(null);
    this.shipmentInfoForm.controls.consigneeInfo.get('state').patchValue(null);
    this.shipmentInfoForm.controls.consigneeInfo.get('country').patchValue(null);
    this.shipmentInfoForm.controls.consigneeInfo.get('type').patchValue(null);
  }

  //save shipment details
  saveAwbDetails() {
    //check mandatory fields
    if ((this.shipmentInfoForm.controls.shipperInfo.get('customerName').value) == '' ||
      (this.shipmentInfoForm.controls.shipperInfo.get('customerName').value) == null ||
      (this.shipmentInfoForm.controls.shipperInfo.get('streetAddress').value) == null ||
      (this.shipmentInfoForm.controls.shipperInfo.get('streetAddress').value) == '' ||
      (this.shipmentInfoForm.controls.shipperInfo.get('place').value) == null ||
      (this.shipmentInfoForm.controls.shipperInfo.get('place').value) == '' ||
      (this.shipmentInfoForm.controls.shipperInfo.get('country').value) == '' ||
      (this.shipmentInfoForm.controls.shipperInfo.get('country').value) == null) {
      this.showErrorMessage("Please fill mandatory Info");
      return;
    }
    if ((this.shipmentInfoForm.controls.consigneeInfo.get('customerName').value) == '' ||
      (this.shipmentInfoForm.controls.consigneeInfo.get('customerName').value) == null ||
      (this.shipmentInfoForm.controls.consigneeInfo.get('streetAddress').value) == null ||
      (this.shipmentInfoForm.controls.consigneeInfo.get('streetAddress').value) == '' ||
      (this.shipmentInfoForm.controls.consigneeInfo.get('place').value) == null ||
      (this.shipmentInfoForm.controls.consigneeInfo.get('place').value) == '' ||
      (this.shipmentInfoForm.controls.consigneeInfo.get('country').value) == '' ||
      (this.shipmentInfoForm.controls.consigneeInfo.get('country').value) == null) {
      this.showErrorMessage("Please fill mandatory Info");
      return;
    }

    //check for duplicate license
    let licArr: any = (<NgcFormArray>this.shipmentInfoForm.controls["license"]).getRawValue();
    for (let i = 0; i < licArr.length; i++) {
      for (let j = 0; j < licArr.length; j++) {
        if (i != j) {
          if (licArr[i].detail == licArr[j].detail) {
            this.showErrorStatus("duplicate license");
            return;
          }
        }
      }
    }
    //check for duplicate permit
    let perArr: any = (<NgcFormArray>this.shipmentInfoForm.controls["permit"]).getRawValue();
    for (let i = 0; i < perArr.length; i++) {
      for (let j = 0; j < perArr.length; j++) {
        if (i != j) {
          if (perArr[i].detail == perArr[j].detail) {
            this.showErrorStatus("duplicate permit");
            return;
          }
        }
      }
    }

    if ((this.shipmentInfoForm.controls.charges.get('currencyCode').value) == '' ||
      (this.shipmentInfoForm.controls.charges.get('currencyCode').value) == null ||
      (this.shipmentInfoForm.controls.charges.get('otherCharge').value) == null ||
      (this.shipmentInfoForm.controls.charges.get('otherCharge').value) == '') {
      this.showErrorMessage("Please fill mandatory Info");
      return;
    }
    //save shipment
    this.MaintainAccsInformation = this.shipmentInfoForm.getRawValue();
    this.customsService.maintainAccsInformationList(this.MaintainAccsInformation).subscribe(data => {
      if (data.data) {
        this.resetFormMessages();
        this.showSuccessStatus("g.completed.successfully");
        this.response = data.data;
      }
    });
  }

  //delete license
  deleteLicense(index) {
    let licArr = (<NgcFormArray>this.shipmentInfoForm.get("license")).length;
    console.log(licArr);
    if (licArr > 1) {
      (this.shipmentInfoForm.get(["license", index]) as NgcFormGroup).markAsDeleted();
    }
  }
  //delete Permit
  deletePermit(index) {
    let perArr = (<NgcFormArray>this.shipmentInfoForm.get("permit")).length;
    console.log(perArr);
    if (perArr > 1) {
      (this.shipmentInfoForm.get(["permit", index]) as NgcFormGroup).markAsDeleted();
    }
  }

  //Add license
  addLicense() {
    (<NgcFormArray>this.shipmentInfoForm.get("license")).addValue([
      {
        detail: "",
        type: 'LIC'
      }
    ]);
  }

  //Add permit
  addPermit() {
    (<NgcFormArray>this.shipmentInfoForm.get("permit")).addValue([
      {
        detail: "",
        type: 'PER'
      }
    ]);
  }

  onCancel() {
    console.log(this.shipmentInfoForm.getRawValue());
    var dataToSend = {
      flightId: this.shipmentInfoForm.get('flightId').value
    }
    console.log(dataToSend);
    this.navigateBack(dataToSend);
  }

  /**
   * LifeCycle Hook
   * search the shipment info if the parentData value is changed
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes.parentData.currentValue);
    try {
      if (changes.parentData.currentValue !== null && changes.parentData.currentValue !== undefined) {
        this.shipmentInfoForm.patchValue(changes.parentData.currentValue);
        this.shipmentInfoForm.get('flightATA').patchValue(changes.parentData.currentValue.flightATA);
        this.shipmentInfoForm.get('customFlightId').patchValue(changes.parentData.currentValue.customFlightId);
        this.shipmentInfoForm.get('handlingAgent').patchValue(changes.parentData.currentValue.handlingAgent);
        this.MaintainAccsInformation = this.shipmentInfoForm.getRawValue();
        console.log(this.shipmentInfoForm.getRawValue());
        this.customsService.maintainAccsFlightInfo(this.MaintainAccsInformation).subscribe(details => {
          if (details.data) {
            this.shipmentInfoForm.get('flightKey').patchValue(details.data.flightKey);
            this.shipmentInfoForm.get('flightDate').patchValue(details.data.flightDate);
            var datePipe = new DatePipe('en-US');
            this.setDob = datePipe.transform(details.data.flightDate, 'ddMMMyyyy');
            this.shipmentInfoForm.controls.flightKeyDate.patchValue(details.data.flightKey + "/" + this.setDob);
            //Shipper-Consignee Info
            this.shipmentInfoForm.controls.shipperInfo.get('customerName').patchValue(details.data.shipperInfo.customerName);
            this.shipmentInfoForm.controls.shipperInfo.get('customerCode').patchValue(details.data.shipperInfo.customerCode);
            this.shipmentInfoForm.controls.shipperInfo.get('streetAddress').patchValue(details.data.shipperInfo.streetAddress);
            this.shipmentInfoForm.controls.shipperInfo.get('place').patchValue(details.data.shipperInfo.place);
            this.shipmentInfoForm.controls.shipperInfo.get('postal').patchValue(details.data.shipperInfo.postal);
            this.shipmentInfoForm.controls.shipperInfo.get('state').patchValue(details.data.shipperInfo.state);
            this.shipmentInfoForm.controls.shipperInfo.get('country').patchValue(details.data.shipperInfo.country);

            this.shipmentInfoForm.controls.consigneeInfo.get('customerName').patchValue(details.data.consigneeInfo.customerName);
            this.shipmentInfoForm.controls.consigneeInfo.get('customerCode').patchValue(details.data.consigneeInfo.customerCode);
            this.shipmentInfoForm.controls.consigneeInfo.get('streetAddress').patchValue(details.data.consigneeInfo.streetAddress);
            this.shipmentInfoForm.controls.consigneeInfo.get('place').patchValue(details.data.consigneeInfo.place);
            this.shipmentInfoForm.controls.consigneeInfo.get('postal').patchValue(details.data.consigneeInfo.postal);
            this.shipmentInfoForm.controls.consigneeInfo.get('state').patchValue(details.data.consigneeInfo.state);
            this.shipmentInfoForm.controls.consigneeInfo.get('country').patchValue(details.data.consigneeInfo.country);
            //License-Permit info
            this.shipmentInfoForm.controls.license.patchValue(details.data.license);
            this.shipmentInfoForm.controls.permit.patchValue(details.data.permit);
            //Charges
            this.shipmentInfoForm.controls.charges.patchValue(details.data.charges);

            this.disableSaveButton = true;

            this.simpleArray = details.data.splCode;
            (<NgcFormArray>this.shipmentInfoForm.get("splCode")).patchValue(
              this.simpleArray
            );

            console.log(this.shipmentInfoForm.getRawValue());
          }
        });

      }
    }
    catch (e) { }
    console.log(this.shipmentInfoForm.getRawValue());
  }

}