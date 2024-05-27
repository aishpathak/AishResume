import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';

import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration
} from 'ngc-framework';

import { FormArray, FormControl, AbstractControl, Validator, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { EquipmentSerachRequest, EquipmentReqShipments } from '../equipmentsharedmodel';
import { EquipmentService } from '../equipment.service';

@Component({
  selector: 'app-equipmentRequestMaintain',
  templateUrl: './equipmentRequestMaintain.component.html',
  styleUrls: ['./equipmentRequestMaintain.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class EquipmentRequestMaintainComponent extends NgcPage implements OnInit {

  equipmentIdForSearch: any;
  req: EquipmentSerachRequest;
  variableData: any;
  form: any;
  showDetails: boolean;
  resp: any;
  list: any;
  response: any;
  variable: any;
  disablecreate: boolean = false;
  disableblock: boolean = false;
  responseAfterSave: any
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private equipService: EquipmentService
    , private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  private equipmentForm: NgcFormGroup = new NgcFormGroup({
    DateLabel: new NgcFormControl(),
    equipmentRequestId: new NgcFormControl(),
    agentCustomerCode: new NgcFormControl(),
    byFlightMode: new NgcFormControl(true),
    byAwbMode: new NgcFormControl(false),
    requestfor: new NgcFormControl(),
    collectiondatetime: new NgcFormControl(),
    blocktime: new NgcFormControl(),
    typeofcollection: new NgcFormControl(),
    handlingarea: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    requestforDisp: new NgcFormControl(),
    flightDisp: new NgcFormControl(),
    flightDateDisp: new NgcFormControl(),
    specialinstruction: new NgcFormControl(),
    deliveryaddress: new NgcFormControl(),
    estimatedpdfortowing: new NgcFormControl(),
    reqShipmets: new NgcFormArray([]),
    reqContainers: new NgcFormArray([])
  });

  ngOnInit() {
    super.ngOnInit();
    this.equipmentForm.get('requestfor').setValue('EXPORT');
    this.equipmentForm.get('DateLabel').setValue('equipment.dateof.collection');
    this.equipmentForm.get('typeofcollection').setValue('SELFCOLLECT');
    const routeData = this.getNavigateData(this.activatedRoute);
    if (routeData && routeData.equipmentReqId) {
      this.equipmentForm.get('requestfor').patchValue(routeData.shipmenttype);
      this.equipmentForm.get('flightKey').patchValue(routeData.flightKey);
      this.equipmentForm.get('flightDate').patchValue(routeData.flightDate);
      this.equipmentForm.get('agentCustomerCode').patchValue(routeData.agent);
      this.equipmentForm.get('equipmentRequestId').patchValue(routeData.equipmentReqId);
      if (routeData.mode == "byAwbMode") {
        this.equipmentForm.get('byAwbMode').setValue(true);
        this.equipmentForm.get('byFlightMode').setValue(false);
      }
      this.equipService.searchByReqId(this.equipmentForm.getRawValue()).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          // if (response.data) {
          this.disablecreate = true;
          this.showDetails = true;
          this.resp = response.data;
          this.list = this.resp;
          this.equipmentForm.get('collectiondatetime').patchValue(this.list.collectiondatetime);
          this.equipmentForm.get('blocktime').patchValue(this.list.blocktime);
          this.equipmentForm.get('typeofcollection').patchValue(this.list.typeofcollection);
          this.equipmentForm.get('handlingarea').patchValue(this.list.handlingarea);
          this.equipmentForm.get('specialinstruction').patchValue(this.list.specialinstruction);
          this.equipmentForm.get('estimatedpdfortowing').patchValue(this.list.estimatedpdfortowing);
          (<NgcFormArray>this.equipmentForm.controls['reqShipmets']).patchValue(this.list.reqShipmets);
          (<NgcFormArray>this.equipmentForm.controls['reqContainers']).patchValue(this.list.reqContainers);
        }
      }, error => {
        this.showErrorMessage(error);
      });
      //this.onCreateAuto();
    }
  }

  public onTypeOfCollection(typeofcollectionChange) {
    if (typeofcollectionChange == 'DLVTOPRE') {
      this.equipmentForm.get("DateLabel").setValue("equipment.delivery.date");
    }
    else if (typeofcollectionChange == null || typeofcollectionChange == 'SELFCOLLECT') {
      this.equipmentForm.get("DateLabel").setValue("equipment.dateof.collection");
    }
  }

  // onCreateAuto() {
  //   this.resetFormMessages();
  //   this.equipService.searchByReqId(this.equipmentForm.getRawValue()).subscribe(response => {
  //     if (!this.showResponseErrorMessages(response)) {
  //       // if (response.data) {
  //       this.disablecreate = true;
  //       this.showDetails = true;
  //       this.resp = response.data;
  //       this.list = this.resp;
  //       this.equipmentForm.patchValue(this.list);
  //     }
  //   }, error => {
  //     this.showErrorMessage(error);
  //   });
  // }


  onCreate() {
    this.equipmentForm.controls['requestforDisp'].patchValue(this.equipmentForm.get('requestfor').value);
    this.equipmentForm.controls['flightDisp'].patchValue(this.equipmentForm.get('flightKey').value);
    this.equipmentForm.controls['flightDateDisp'].patchValue(this.equipmentForm.get('flightDate').value);
    this.req = new EquipmentSerachRequest();
    this.req.byFlightMode = this.equipmentForm.get('byFlightMode').value;
    this.req.byAwbMode = this.equipmentForm.get('byAwbMode').value;
    this.req.requestfor = this.equipmentForm.get('requestfor').value;
    this.req.flightKey = this.equipmentForm.get('flightKey').value;
    this.req.flightDate = this.equipmentForm.get('flightDate').value;
    this.req.agentCustomerCode = this.equipmentForm.get('agentCustomerCode').value;
    if (this.equipmentIdForSearch && this.equipmentIdForSearch != "") {
      this.req.equipmentRequestId = this.equipmentIdForSearch;
    }

    this.resetFormMessages();
    const searchFrom: NgcFormGroup = (<NgcFormGroup>this.equipmentForm);
    searchFrom.validate()
    if (searchFrom.invalid) {
      return;
    }
    else {
      this.equipService.searchByReqId(this.req).subscribe(response => {
        if (response.data != null && response.data.messageList.length > 0 && response.data.messageList[0].code == 'equipment.servicing') {
          this.showConfirmMessage(response.data.messageList[0].code).then(fulfilled => {
            this.initializePage();
          }).catch(reason => {
            this.reloadPage();
          });
        }
        else if (!this.showResponseErrorMessages(response)) {
          // if (response.data) {
          this.disablecreate = true;
          this.showDetails = true;
          this.resp = response.data;
          if (this.resp) {
            this.list = this.resp;
            this.equipmentForm.get('collectiondatetime').patchValue(this.list.collectiondatetime);
            this.equipmentForm.get('blocktime').patchValue(this.list.blocktime);
            this.equipmentForm.get('typeofcollection').patchValue(this.list.typeofcollection);
            if (this.list.handlingarea == null) {
              this.equipmentForm.get('handlingarea').patchValue(this.getUserProfile().terminalId);
            }
            else {
              this.equipmentForm.get('handlingarea').patchValue(this.list.handlingarea);
            }

            this.equipmentForm.get('specialinstruction').patchValue(this.list.specialinstruction);
            this.equipmentForm.get('equipmentRequestId').patchValue(this.list.equipmentRequestId);
            this.equipmentForm.get('estimatedpdfortowing').patchValue(this.list.estimatedpdfortowing);
            (<NgcFormArray>this.equipmentForm.controls['reqShipmets']).patchValue(this.list.reqShipmets);
            (<NgcFormArray>this.equipmentForm.controls['reqContainers']).patchValue(this.list.reqContainers);
          } else {
            this.initializePage();
          }

        }
      }, error => {
        this.showErrorMessage(error);
      });
    }

    //if (this.equipmentForm.get('byFlightMode').value && this.equipmentForm.get('requestforDisp').value == 'EXPORT') {

    //  }
    // else {
    // this.equipmentForm.controls['requestforDisp'].patchValue(this.equipmentForm.get('requestfor').value);
    // this.equipmentForm.controls['flightDisp'].patchValue(this.equipmentForm.get('flightKey').value);
    // this.equipmentForm.controls['flightDateDisp'].patchValue(this.equipmentForm.get('flightDate').value);

    // // let value: any = this.equipmentForm.get('byFlightMode').value;
    // // let newValue = this.equipmentForm.get('byAwbMode').value;
    // this.req = new EquipmentSerachRequest();
    // this.req.byFlightMode = this.equipmentForm.get('byFlightMode').value;
    // this.req.byAwbMode = this.equipmentForm.get('byAwbMode').value;
    // this.req.requestfor = this.equipmentForm.get('requestfor').value;
    // this.req.flightKey = this.equipmentForm.get('flightKey').value;
    // this.req.flightDate = this.equipmentForm.get('flightDate').value;
    // this.req.agentCustomerCode = this.equipmentForm.get('agentCustomerCode').value;


    // this.equipService.searchByFlight(this.req).subscribe(data => {
    //   if (!this.showResponseErrorMessages(data)) {
    //     if (this.req.requestfor == "IMPORT") {
    //       this.equipmentForm.controls['blocktime'].setValue('U');
    //       this.disableblock = true;
    //     } else {
    //       this.disableblock = false;
    //     }
    //     this.resp = data.data;
    //     this.list = this.resp;
    //     if (this.list == null || this.list == '' && this.list.messageList != null) {
    //       this.showDetails = false;
    //     }
    //     else {
    //       this.disablecreate = true;
    //       this.showDetails = true;


    //       // if (req.requestfor == 'IMPORT') {
    //       //   //this.equipmentForm.controls['reqShipmets'].clearValidators();
    //       //   //this.list.at(0).controls.shipmentNumber.clearValidators();
    //       //   this.list.forEach(ele => {

    //       //     ele.shipmentNumber.forEach(elem => {
    //       //       elem.clearValidartors();
    //       //     });
    //       //   });
    //       // }
    //       // else {
    //       //   this.equipmentForm.controls['reqShipmets'].setValidators(Validators.required);
    //       // }

    //       (<NgcFormArray>this.equipmentForm.controls['reqShipmets']).patchValue(this.list);

    //       this.resetFormMessages();
    //     }
    //   }
    // },
    //   error => {
    //     this.showErrorMessage(error);
    //   });
    //  }
  }

  OnSave(event) {
    this.resetFormMessages();
    const saveFormGroup: NgcFormGroup = (<NgcFormGroup>this.equipmentForm);
    saveFormGroup.validate();
    if (this.equipmentForm.invalid) {
      return;
    }
    else if (((this.equipmentForm.get('reqContainers') as NgcFormArray).length <= 0) && (this.equipmentForm.get('estimatedpdfortowing')).value == null) {
      this.showErrorMessage("equipment.enter.pdsoruld");
      return;
    }
    
    else {
      let request: any = this.equipmentForm.getRawValue();
      request.equipmentRequestId = this.equipmentForm.get('equipmentRequestId').value;
      // if (request.collectiondatetime != null || request.collectiondatetime != "")
      //   request.flagCRUD = "U";
      this.equipService.saveDeliveryRequest(request).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.responseAfterSave = data.data;
          // if (response == null) {
          //   this.refreshFormMessages(data);
          // } else {
          // if (this.responseAfterSave.reqContainers.length) {
          this.equipmentIdForSearch = this.responseAfterSave.equipmentRequestId;
          if (this.equipmentForm.get('byFlightMode').value == true) {
            if (this.equipmentForm.get('flightDate').value) {
              this.onCreate();
            }

          }

          this.showSuccessStatus("g.completed.successfully");
       

        }
      }
        , error => {
          this.showErrorMessage(error);
        });
    }
  }


  onAwbNumber(index, event) {
    const eq = new EquipmentReqShipments();
    eq.shipmentNumber = event;

    this.equipService.searchByAWB(eq).subscribe(data => {
      this.response = data;
      if (this.response != null) {
        this.variableData = this.response.data;
        this.equipmentForm.get(['reqShipmets', index, 'flightKey']).setValue(this.variableData.flightKey);
        this.equipmentForm.get(['reqShipmets', index, 'flightDate']).setValue(this.variableData.flightDate);
      }
    },
      error => {
        this.showErrorStatus('equipment.error.fetchoperation' + error);
      });
  }

  addAwb() {
    (<NgcFormArray>this.equipmentForm.get("reqShipmets")).addValue([{ shipmentNumber: '', flightKey: '', flightDate: '' }])
  }

  addRowUld() {
    (<NgcFormArray>this.equipmentForm.get("reqContainers")).addValue([{ uldType: '', qty: '' }])
    let index = (this.equipmentForm.get('reqContainers') as NgcFormArray).length - 1;
    this.equipmentForm.get(['reqContainers', index, 'qty']).setValidators(Validators.min(1))
  }

  onConfirm(event, index) {
    (<NgcFormArray>this.equipmentForm.controls['reqShipmets']).removeAt(index);
  }

  deleteUld(event, index) {
    (<NgcFormArray>this.equipmentForm.controls['reqContainers']).removeAt(index);
  }

  public onBack(event) {
    this.navigateBack(this.equipmentForm.getRawValue());
  }
  disableDate() {
    this.equipmentForm.get('flightDate').disable();
  }
  initializePage() {
    this.disablecreate = true;
    this.showDetails = true;
    //this.resp = response.data;
    //this.list = this.resp;
    this.equipmentForm.get('collectiondatetime').patchValue(null);
    this.equipmentForm.get('blocktime').patchValue(null);
    this.equipmentForm.get('typeofcollection').patchValue(null);
    this.equipmentForm.get('specialinstruction').patchValue(null);
    this.equipmentForm.get('equipmentRequestId').patchValue(null);
    this.equipmentForm.get('handlingarea').patchValue(this.getUserProfile().terminalId);
    (<NgcFormArray>this.equipmentForm.controls['reqShipmets']).patchValue(null);
    (<NgcFormArray>this.equipmentForm.controls['reqContainers']).patchValue(null);

  }

  onTaskList() {
    this.navigateTo(this.router, 'equipment/tasklist', null);
  }
}
