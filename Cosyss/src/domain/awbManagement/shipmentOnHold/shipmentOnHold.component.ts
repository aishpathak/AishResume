import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcInputComponent,
  NgcUtility, NgcWindowComponent, NgcContainerComponent, PageConfiguration, StatusMessage
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { AwbManagementService } from '../awbManagement.service';
import { FormArray, FormControl, AbstractControl, Validator, Validators } from '@angular/forms';
import { NgcFormControl } from 'ngc-framework';
import { SearchAWB, ShipmentInfoReqModel, ShipmentInventory, ShipmentMaster } from '../awbManagement.shared';
import { exit } from 'process';
import { ApplicationEntities } from '../../common/applicationentities';
import { ApplicationFeatures } from '../../common/applicationfeatures';


@Component({
  selector: 'app-shipmentOnHold',
  templateUrl: './shipmentOnHold.component.html',
  styleUrls: ['./shipmentOnHold.component.scss'],
  providers: [AwbManagementService]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  //autoBackNavigation: true
})
export class ShipmentOnHoldComponent extends NgcPage {
  reasonValue: boolean;
  isTableFlg = false;
  selected: boolean;
  sn: any;
  lockAWBDetails: any;
  arrayShipmentOHold: any;
  resp: any;
  holdInventory: any;
  requestobj: any;
  req: any;
  saveFlag: boolean = false;
  forwardedData: any;
  handledbyHouse: boolean = false;
  houseInfoFlag: boolean = false;
  // bug-742 change
  hawbInvalid: boolean = false;
  hawbSourceParameters: {};

  @ViewChild('searchFunction')
  private searchFunction: NgcInputComponent;
  @Input('shipmentNumberData') shipmentNumberData: string;
  @Input('hwbNumberData') hwbNumberData: string;
  @Input('shipmentTypeData') shipmentTypeData: string;
  @Input('showAsPopup') showAsPopup: boolean;
  @Output() autoSearchShipmentInfo = new EventEmitter<boolean>();
  // Root Form
  private awbHoldForm: NgcFormGroup = new NgcFormGroup({
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    natureOfGoods: new NgcFormControl(),
    specialHandlingCode: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    shipmentId: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightKeyDate: new NgcFormControl(),
    selectAll: new NgcFormControl(false),
    selected: new NgcFormControl(),
    flagUpdate: new NgcFormControl(),
    hold: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    hawbDetails: new NgcFormGroup({
      hwbNumber: new NgcFormControl(),
      hwbOrigin: new NgcFormControl(),
      hwbDestination: new NgcFormControl(),
      hwbPieces: new NgcFormControl(),
      hwbWeight: new NgcFormControl(),
      hwbNatureOfGoods: new NgcFormControl(),
      hwbSHC: new NgcFormArray([]),
      specialHandlingCodeHAWB: new NgcFormControl(),
    }),
    shipmentInventories: new NgcFormArray([
      new NgcFormGroup({
        selected: new NgcFormControl(),
        shcListInv: new NgcFormArray([
          new NgcFormGroup({
            shcInv: new NgcFormControl()
          })
        ])
      })
    ])
  });
  obj: any;

  shipmentId: any;


  constructor(private awbService: AwbManagementService,
    appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private shipmentonholdservice: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {

    if (this.shipmentNumberData) {
      this.awbHoldForm.get('shipmentNumber').patchValue(this.shipmentNumberData);
      this.awbHoldForm.get('hawbNumber').patchValue(this.hwbNumberData);
      this.onSearch();
    }

    const transferData = this.getNavigateData(this.activatedRoute);
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (!this.shipmentNumberData && transferData != null) {
      this.awbHoldForm.get('shipmentNumber').patchValue(transferData.shipmentNumber);
      this.awbHoldForm.get('hawbNumber').setValue(transferData.hwbNumber);
      this.onSearch();
    }

    this.awbHoldForm.controls.selectAll.valueChanges.subscribe(
      (newValue) => {
        let shipHoldDtl = (<NgcFormArray>this.awbHoldForm.controls['shipmentInventories']).getRawValue();
        shipHoldDtl = shipHoldDtl.map(function (obj) {
          obj.selected = newValue;
          return obj;
        });
        this.awbHoldForm.controls['shipmentInventories'].patchValue(shipHoldDtl);
      });

    this.awbHoldForm.controls.hold.valueChanges.subscribe(
      (newValue) => {
        if (!newValue) {
          this.awbHoldForm.controls['flagUpdate'].setValue("Y");
        } else {
          this.awbHoldForm.controls.reasonForHold.enable();
          this.holdInventory = (<NgcFormArray>this.awbHoldForm.controls['shipmentInventories']).controls[0];
          this.holdInventory = (<NgcFormGroup>this.holdInventory);
          if ((<NgcFormArray>this.awbHoldForm.controls['shipmentInventories']).length > 0 && this.holdInventory.controls['flagCRUD'].value !== 'C') {
            for (let i = 0; i < (<NgcFormArray>this.awbHoldForm.controls['shipmentInventories']).length; i++) {
              this.onLock(event, i);
            }
          }
          this.awbHoldForm.controls['flagUpdate'].setValue("Y");
        }
      });

    let forwardedData = this.getNavigateData(this.activatedRoute);

    // checking if the fetched data is not null
    if (!this.shipmentNumberData && forwardedData != null) {
      this.awbHoldForm.get('shipmentNumber').setValue(forwardedData.shipmentNumber);
      this.awbHoldForm.get('flightKey').setValue(forwardedData.flightNumber);
      this.awbHoldForm.get('flightKeyDate').setValue(forwardedData.flightDate);
      this.onSearch();
    }


  }
  /**
  * On Search of Function
  *
  * @param event Event
  */
  //bug-742 change
  private onSearch() {
    if (this.handledbyHouse && this.hawbInvalid) {
      this.showErrorStatus('hawb.invalid');
      return;
    }
    if (this.handledbyHouse && NgcUtility.isBlank(this.awbHoldForm.getRawValue().hawbNumber)) {
      this.awbHoldForm.validate();
      this.showErrorStatus('hawb.mandatory');
      return;
    }
    this.resetFormMessages();
    this.awbHoldForm.get('hawbDetails').reset();
    this.houseInfoFlag = false;
    let search: SearchAWB = new SearchAWB();
    search.shipmentNumber = this.awbHoldForm.get('shipmentNumber').value;
    search.hawbNumber = this.awbHoldForm.get('hawbNumber').value;
    search.flightKey = this.awbHoldForm.get('flightKey').value;
    search.flightKeyDate = this.awbHoldForm.get('flightKeyDate').value;
    search.handledbyHouse = this.handledbyHouse;
    if (!search.shipmentNumber) {
      this.awbHoldForm.validate();
      this.showErrorStatus('g.enter.awb');
      return;
    }
    else {
      this.shipmentonholdservice.fetchOnSearch(search).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.saveFlag = true;
          this.isTableFlg = false;
          if (data.data[0].shipmentNumber == null || (search.flightKey && search.flightKeyDate == null) || (search.flightKey == null && search.flightKeyDate)) {
            this.showInfoStatus('export.both.flight.date.mandatory');
            this.isTableFlg = false;
          } else {
            this.isTableFlg = true;
            this.resp = data.data[0];
            this.lockAWBDetails = this.resp;
            if (this.lockAWBDetails.shipmentInventories != null && this.lockAWBDetails.shipmentInventories.length != 0) {
              if (this.lockAWBDetails.shipmentInventories.length === 1) {
                this.lockAWBDetails.shipmentInventories.forEach(inventory => {
                  inventory.selected = true;
                });
              }
            }
            this.awbHoldForm.patchValue(this.lockAWBDetails);
            if (this.resp.houseInformation) {
              this.awbHoldForm.controls['hawbDetails'].patchValue(this.resp.houseInformation);
              this.awbHoldForm.get(['hawbDetails', 'specialHandlingCodeHAWB']).patchValue(this.resp.specialHandlingCodeHAWB);
              this.houseInfoFlag = true;
            }


          }
        }
      }, error => {
        this.showErrorMessage(error);
      });
    }

  }


  private onLock(event, index) {
    this.holdInventory = (<NgcFormArray>this.awbHoldForm.controls['shipmentInventories']).controls[index];
    this.holdInventory = (<NgcFormGroup>this.holdInventory);
    this.holdInventory.controls['hold'].patchValue(true);
    this.reasonValue = true;
    this.awbHoldForm.get(["shipmentInventories", index, "reasonForHold"]).setValidators(Validators.required);
    this.awbHoldForm.get(["shipmentInventories", index, "holdNotifyGroup"]).setValidators(Validators.required);
    this.awbHoldForm.get(["shipmentInventories", index, "remarks"]).setValidators(Validators.required);

  }

  private onUnLock(event, index) {
    this.holdInventory = (<NgcFormArray>this.awbHoldForm.controls['shipmentInventories']).controls[index];
    this.holdInventory = (<NgcFormGroup>this.holdInventory);
    this.holdInventory.controls['hold'].patchValue(false);
    this.holdInventory.controls['reasonForHold'].setValue('');
    this.holdInventory.controls['remarks'].setValue('');
    this.holdInventory.controls['holdNotifyGroup'].setValue('');
    this.reasonValue = false;
    this.awbHoldForm.get(["shipmentInventories", index, "reasonForHold"]).clearValidators();
    this.awbHoldForm.get(["shipmentInventories", index, "holdNotifyGroup"]).clearValidators();
    this.awbHoldForm.get(["shipmentInventories", index, "remarks"]).setValidators(Validators.required);
  }

  private onSave(event) {
    var selectedRecords: any = [];
    var invalidForm = false;
    var holdUnchanged = false;
    this.resetFormMessages();
    const request = this.awbHoldForm.getRawValue();
    this.obj = this.awbHoldForm.getRawValue().shipmentInventories;
    this.obj.forEach(e => {
      if (e['selected']) {
        if (e['hold']) {
          if (e['reasonForHold'] === null || e['reasonForHold'] === '') {
            this.showErrorMessage('CUST003');
            invalidForm = true;
          } else if (e['holdNotifyGroup'] === null || e['holdNotifyGroup'] === '') {
            invalidForm = true;
          } else if (e['remarks'] === null || e['remarks'] === '') {
            invalidForm = true;
          }
        } else if (!e['hold']) {
          if (e['remarks'] === null || e['remarks'] === '') {
            invalidForm = true;
          }
        }
        if ((e['remarksOldValue'] != e['remarks']) && (e['holdOldValue'] === e['hold'])) {
          holdUnchanged = true;
        }
        e['shipmentId'] = this.shipmentId;
        selectedRecords.push(e);
      }
    });
    if (holdUnchanged) {
      this.showErrorMessage('awb.change.hold.value');
      return;
    }

    if (invalidForm) {
      this.showErrorMessage('CUST003');
      return;
    }
    if (selectedRecords.length === 0) {
      this.showErrorStatus('export.select.atleast.one.record');
      return;
    }
    request['shipmentInventories'] = selectedRecords;
    this.shipmentonholdservice.updateHold(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        const response = data.data;
        if (response) {
          this.onSearch();
          this.autoSearchShipmentInfo.emit(true)
        }
        (<NgcFormArray>this.awbHoldForm.get('shipmentInventories'))
          .patchValue(response.shipmentInventories);
        this.showSuccessStatus('g.completed.successfully');

        (<NgcFormControl>this.awbHoldForm.get('selectAll')).setValue(false);
      }
    }, error => {
      this.showErrorMessage(error);
    });
  }

  public onBack(event) {
    this.navigateBack(this.awbHoldForm.getRawValue);
  }

  public onGenerateCTO(event) {
    const request = this.awbHoldForm.getRawValue();
    let array = new Array();
    let arrayforhold = new Array();
    request.shipmentInventories.forEach(element => {
      if (element.selected == true) {
        if (element.hold == true) {
          array.push(element);
        } else {
          arrayforhold.push(element);
        }
      }
    });


    if (arrayforhold.length > 0) {
      this.showErrorStatus('awb.cto.gen.hold.inv');
    } else if (array.length > 0) {
      this.requestobj = request;

      const requestObject = {
        shipmentNumber: this.requestobj.shipmentNumber,
        origin: this.requestobj.origin,
        destination: this.requestobj.destination,
        pieces: this.requestobj.pieces,
        weight: this.requestobj.weight,
        natureOfGoods: this.requestobj.natureOfGoods,
        hawbNumber: this.requestobj.hawbNumber,
        shcList: this.requestobj.shcList,
        shipmentInventories: array
      }
      this.shipmentonholdservice.generateCTO(requestObject).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus('g.completed.successfully');
        }
      }, error => {
        this.showErrorMessage(error);
      });
    }
    else {
      this.showErrorStatus('awb.select.one.loc.cto');
    }
  }


  private onAddLocation() {
    const request = this.awbHoldForm.getRawValue();
    console.log("request", request);
    const reqObj = {
      shipmentId: request.shipmentId,
      shipmentNumber: request.shipmentNumber,
      hwbNumber: request.hawbNumber,
      shipmentType: 'AWB'
    }
    this.navigateTo(this.router, '/awbmgmt/shipmentLocation', reqObj);
  }
  private onHAWBInformation() {
    const request = this.awbHoldForm.getRawValue();
    let navigateObj = {
      shipmentNumber: request.shipmentNumber,
      hwbNumber: request.hawbNumber
    }
    this.navigateTo(this.router, 'awbmgmt/hwb-informationCR', navigateObj);
  }
  onCancel(event) {
    this.navigateBack(this.forwardedData);
  }

  onClickShipmentInformation() {
    const request = this.awbHoldForm.getRawValue();
    let navigateObj = {
      shipmentNumber: request.shipmentNumber
    }
    this.navigateTo(this.router, '/awbmgmt/shipmentinfoCR', navigateObj);
  }
  // BUG-742 change
  onTabOutCheckHandledBy() {
    this.handledbyHouse = false;
    this.awbHoldForm.get('hawbNumber').patchValue("");
    this.awbHoldForm.get('hawbNumber').clearValidators();
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.hawbSourceParameters = this.createSourceParameter(this.awbHoldForm.get('shipmentNumber').value);

      this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
        if (data != null && data.length > 0) {
          this.handledbyHouse = true;
          this.awbHoldForm.get('hawbNumber').setValidators([Validators.required, Validators.maxLength(16)]);
          this.retrieveLOVRecords("HWBNUMBER", this.hawbSourceParameters).subscribe(data => {
            if (data != null && data.length == 1) {
              this.awbHoldForm.get('hawbNumber').setValue(data[0].code);
            }

          })

        } else {
          this.handledbyHouse = false;
          this.awbHoldForm.get('hawbNumber').clearValidators();
        }
      },
      );
    }
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.awbHoldForm);
      const req: ShipmentInfoReqModel = new ShipmentInfoReqModel();
      req.shipmentNumber = searchFormGroup.get('shipmentNumber').value;
      // this.handledbyHouse = false;
      this.awbService.isHandledByHouse(req).subscribe(response => {

        if (!this.showResponseErrorMessages(response)) {

          if (response) {
            this.handledbyHouse = true;
          }
          else {
            this.handledbyHouse = false;
          }
        }

      })
    }
  }
  // BUG-742 change END
  onClear() {
    this.resetFormMessages();
    this.awbHoldForm.get(['awbHoldForm', 'shipmentNumber']).reset();
    this.awbHoldForm.get('hawbDetails').reset();
  }
  // BUG-742 change
  setAWBNumber(object) {
    if (object.code == null) {
      this.hawbInvalid = true;
      this.showErrorStatus('hawb.invalid');
    }
    else {
      this.hawbInvalid = false;
      this.awbHoldForm.get('hawbNumber').setValue(object.code);
    }
  }
}