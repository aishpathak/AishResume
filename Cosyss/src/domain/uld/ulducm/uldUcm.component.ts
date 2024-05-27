import { request } from 'http';
import { Component, OnInit } from '@angular/core';
import { NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList, ChangeDetectorRef, Pipe, PipeTransform, ContentChildren, forwardRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroupDirective, FormArray, FormGroup, FormControl, FormControlName, Validators } from '@angular/forms';
import { FlightLegs, FlightFcts } from '../../flight/flight.sharedmodel';
import { FlightService } from '../../flight/flight.service';
import { UldUcmManagement } from '../../uld/uld.shared';
import { UldUcmManagementRequest } from '../../uld/uld.shared';
import {
  NgcPage, NgcFormGroup, NgcFormArray,// NgcWindowComponent,
  NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, BaseResponse, NgcDropDownComponent, NgcButtonComponent,
  NgcUtility, NgcTabsComponent, PageConfiguration, CellsRendererStyle, NgcFormControl, NgcSHCInputComponent
} from 'ngc-framework';
import { UldService } from './../uld.service';
import { CellsStyleClass } from './../../../shared/shared.data';
@Component({
  selector: 'app-uldUcm',
  templateUrl: './uldUcm.component.html',
  styleUrls: ['./uldUcm.component.scss']
})


@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true,
  focusToBlank: true
})



export class UldUcmComponent extends NgcPage {

  @ViewChild('mydropdown') mydropdown: NgcDropDownComponent;
  @ViewChild('searchButton') searchButton: NgcButtonComponent;

  disabledTable: boolean;
  dataSuccessFlag = false;
  lengthLegList = 0;
  lengthExpUldTypeList = 0;
  errorMessage: any;
  disableclosebutton: boolean = false;
  editableSTD = 0;
  editableSTDFlag = false;
  editableBoolean: any;
  lengthFactList = 0;
  resultSet: any;
  resp: any;
  flightType: any;
  sequenceNumber: number;
  ucmDetail: boolean = false;
  ucmDetails: boolean = false;
  // onSearchFlag: boolean = false;
  onSaveFlag: boolean = false;
  incomingFlag: boolean = false;
  outgoingFlag: boolean = false;
  // saveFlag: boolean = false;
  showTable = false
  flightCarrierCode: string;
  flightBoardPoint: string;
  flightOffPoint: string;
  flightId: string;
  ucmFlightDetailsID: string;
  unloadingAirport: string;
  countOfIncomingCarrierUldModel: number = 0;
  countOfIncomingForeignUldModel: number = 0;
  countOfOutgoingCarrierUldModel: number = 0;
  countOfOutgoingForeignUldModel: number = 0;
  uldNumber: any;
  contentCode: any;
  loadingAirport: any;
  finalize: any;
  ucmIn: boolean = false;
  ucmOut: boolean = false;
  noUld: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private uldService: UldService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);

  }

  private ulducm: NgcFormGroup = new NgcFormGroup({
    byIncoming: new NgcFormControl(''),
    byOutgoing: new NgcFormControl(''),
    byTransit: new NgcFormControl(''),
    flightKey: new NgcFormControl('', [Validators.minLength(3), Validators.maxLength(7)]),
    date: new NgcFormControl(),
    flightId: new NgcFormControl(),
    ucmFlightDetailsID: new NgcFormControl(),
    arrivalDate: new NgcFormControl(),
    departureDate: new NgcFormControl(),
    flightType: new NgcFormControl(),
    aircraftRegistration: new NgcFormControl(),
    ucmDate: new NgcFormControl(),
    ucmSentBy: new NgcFormControl(),
    osi: new NgcFormControl(),
    countForIncomingCarrierUld: new NgcFormControl(),
    countForIncomingForeignUld: new NgcFormControl(),
    countForOutgoingCarrierUld: new NgcFormControl(),
    countForOutgoingForeignUld: new NgcFormControl(),
    osiFormArray: new NgcFormArray([]),
    incomingCarrierUldModel: new NgcFormArray([]),
    incomingForeignUldModel: new NgcFormArray([]),
    outgoingCarrierUldModel: new NgcFormArray([]),
    outgoingForeignUldModel: new NgcFormArray([]),
  });

  ngOnInit() {
    super.ngOnInit();
    this.ulducm.get('byIncoming').patchValue(true);
    this.onAddOsi(event);
  }


  someMethodWithFocusOutEvent() {
    if (this.ulducm.get('date').value == null) {
      this.ulducm.get('date').setValue(new Date());
    }
  }

  public onSearch() {
    if (this.ulducm.get('flightKey').value == ''
      && this.ulducm.get('date')) {
      this.ulducm.validate();
      this.showErrorStatus('uld.mandatory.field.must.not.be.empty!');
    } else {

      if (this.ulducm.get('date').value instanceof Array) {
        this.ulducm.get('date').setValue(NgcUtility.toDateFromLocalDate(this.ulducm.get('date').value));

      } else {
        this.ulducm.get('date').setValue(this.ulducm.get('date').value);
      }
      const request = this.ulducm.getRawValue();
      this.resetFormMessages();
      this.getResponse(request);
    }

  }

  clearFormAndSetData() {
    let tempflightKey = this.ulducm.get('flightKey');
    let tempDate = this.ulducm.get('date');
    this.ulducm.reset();
    this.ulducm.get('flightKey').setValue(tempflightKey);
    this.ulducm.get('date').setValue(tempDate);
    this.resetFormMessages();
  }

  getResponse(uldRequest) {
    this.uldService.searchUcmUld(uldRequest).subscribe(data => {
      this.showResponseErrorMessages(data);
      this.resultSet = data.data;
      if (this.resultSet === null) {
        this.onSaveFlag = true;
        this.dataSuccessFlag = false;
        return;
      }
      else {
        this.dataSuccessFlag = true;
        if (this.resultSet.incomingCarrierUldModel.length == 0
          && this.resultSet.incomingForeignUldModel.length == 0
          && this.resultSet.outgoingCarrierUldModel.length == 0
          && this.resultSet.outgoingForeignUldModel.length == 0) {
          this.onSaveFlag = true;
          this.dataSuccessFlag = true;
          this.noUld = true;
        } else {
          this.noUld = false;
        }
        if (this.resultSet.flightInfo[0].flightType === "EXPORT") {
          this.resultSet.incomingCarrierUldModel = null;
          this.resultSet.incomingForeignUldModel = null;
          this.ulducm.get('incomingCarrierUldModel').patchValue(new Array());
          this.ulducm.get('incomingForeignUldModel').patchValue(new Array());
        }
        if (this.resultSet.flightInfo[0].flightType === "IMPORT") {
          this.resultSet.outgoingCarrierUldModel = null;
          this.resultSet.outgoingForeignUldModel = null;
          this.ulducm.get('outgoingCarrierUldModel').patchValue(new Array());
          this.ulducm.get('outgoingForeignUldModel').patchValue(new Array());
        }
        this.dataSuccessFlag = true;
        this.onSaveFlag = true;
        this.flightCarrierCode = this.resultSet.flightInfo[0].flightCarrierCode;
        this.flightBoardPoint = this.resultSet.flightInfo[0].flightBoardPoint;
        this.flightOffPoint = this.resultSet.flightInfo[0].flightOffPoint;
        this.flightId = this.resultSet.flightInfo[0].flightId;
        this.ucmFlightDetailsID = this.resultSet.flightInfo[0].ucmFlightDetailsID;
        this.flightType = this.resultSet.flightInfo[0].flightType;
        this.ucmIn = this.resultSet.flightInfo[0].ucmIn;
        this.ucmOut = this.resultSet.flightInfo[0].ucmOut;

        let tempDate = this.ulducm.get('date').value;
        this.ulducm.patchValue(this.resultSet.flightInfo[0]);
        this.ulducm.get('date').setValue(tempDate);
      }

      if (this.resultSet
        && this.resultSet.incomingCarrierUldModel && this.resultSet.incomingCarrierUldModel.length) {
        this.ulducm.get('countForIncomingCarrierUld').patchValue(this.resultSet.incomingCarrierUldModel.length);
      }


      if (this.resultSet
        && this.resultSet.incomingForeignUldModel && this.resultSet.incomingForeignUldModel.length) {
        this.ulducm.get('countForIncomingForeignUld').patchValue(this.resultSet.incomingForeignUldModel.length);
      }


      if (this.resultSet
        && this.resultSet.outgoingCarrierUldModel && this.resultSet.outgoingCarrierUldModel.length) {
        this.countOfOutgoingCarrierUldModel = this.resultSet.outgoingCarrierUldModel.length;
      }
      this.ulducm.get('countForOutgoingCarrierUld').patchValue(this.countOfOutgoingCarrierUldModel);

      if (this.resultSet
        && this.resultSet.outgoingForeignUldModel && this.resultSet.outgoingForeignUldModel.length) {
        this.countOfOutgoingForeignUldModel = this.resultSet.outgoingForeignUldModel.length;
      }
      this.ulducm.get('countForOutgoingForeignUld').patchValue(this.countOfOutgoingForeignUldModel);

      if (this.resultSet.incomingCarrierUldModel) {
        this.resultSet.incomingCarrierUldModel.forEach(e1 => {
          e1.flagCRUD = 'R';
          e1.finalize = e1.finalize === true || e1.finalize === '1' ? 'Y' : 'N';
        });
        this.ulducm.get('incomingCarrierUldModel').patchValue(this.resultSet.incomingCarrierUldModel);
      }

      if (this.resultSet.incomingForeignUldModel) {
        this.resultSet.incomingForeignUldModel.forEach(e1 => {
          e1.flagCRUD = 'R';
          e1.finalize = e1.finalize === true || e1.finalize === '1' ? 'Y' : 'N';
        });
        this.ulducm.get('incomingForeignUldModel').patchValue(this.resultSet.incomingForeignUldModel);
      }

      if (this.resultSet.outgoingCarrierUldModel) {
        this.resultSet.outgoingCarrierUldModel.forEach(e1 => {
          e1.flagCRUD = 'R';
          e1.finalize = e1.finalize === true || e1.finalize === '1' ? 'Y' : 'N';
        });
        this.ulducm.get('outgoingCarrierUldModel').patchValue(this.resultSet.outgoingCarrierUldModel);
      }

      if (this.resultSet.outgoingForeignUldModel) {
        this.resultSet.outgoingForeignUldModel.forEach(e1 => {
          e1.flagCRUD = 'R';
          e1.finalize = e1.finalize === true || e1.finalize === '1' ? 'Y' : 'N';
        });

        this.ulducm.get('outgoingForeignUldModel').patchValue(this.resultSet.outgoingForeignUldModel);
      }

      this.enableDisableControls();
    });
  }

  private enableDisableControls() {
    const flightType: string = this.ulducm.get('flightType').value;
    if (flightType === 'EXPORT') {
      this.outgoingFlag = true;
      this.incomingFlag = false;
      this.ulducm.get('incomingCarrierUldModel').disable();
      this.ulducm.get('incomingForeignUldModel').disable();
      this.ulducm.get('outgoingCarrierUldModel').enable();
      this.ulducm.get('outgoingForeignUldModel').enable();
    } else if (flightType === 'TRANSIT' || flightType === 'CIRCULAR') {
      this.outgoingFlag = true;
      this.incomingFlag = true;
      this.ulducm.get('incomingCarrierUldModel').enable();
      this.ulducm.get('incomingForeignUldModel').enable();
      this.ulducm.get('outgoingCarrierUldModel').enable();
      this.ulducm.get('outgoingForeignUldModel').enable();
    } else if (flightType === 'IMPORT') {
      this.incomingFlag = true;
      this.outgoingFlag = false;
      this.ulducm.get('incomingCarrierUldModel').enable();
      this.ulducm.get('incomingForeignUldModel').enable();
      this.ulducm.get('outgoingCarrierUldModel').disable();
      this.ulducm.get('outgoingForeignUldModel').disable();
    }
    let incoming = this.ulducm.get('byIncoming').value;
    let outgoing = this.ulducm.get('byOutgoing').value;
    let transit = this.ulducm.get('byTransit').value;
    if (this.noUld) {
      if (flightType === 'TRANSIT' || flightType === 'CIRCULAR') {
        this.ucmIn = false;
        this.ucmOut = false;
      }
      if (flightType === 'IMPORT') {
        this.ucmIn = false;
        this.ucmOut = true;
      }
      if (flightType === 'EXPORT') {
        this.ucmIn = true;
        this.ucmOut = false;
      }
    }
  }


  public onAddIncomingCarrierUld() {
    this.sequenceNumber = (<NgcFormArray>this.ulducm.get('incomingCarrierUldModel')).length + 1;
    (<NgcFormArray>this.ulducm.get(["incomingCarrierUldModel"])).addValue([
      {
        select: false,
        flagCRUD: 'C',
        uldNumber: "",
        unloadingAirport: "",
        contentCode: "",
        finalize: "",
      }
    ]);
    this.enableDisableControls();
  }


  public onAddIncomingForeignUld() {
    this.sequenceNumber = (<NgcFormArray>this.ulducm.get('incomingForeignUldModel')).length + 1;
    (<NgcFormArray>this.ulducm.get(["incomingForeignUldModel"])).addValue([
      {
        select: false,
        flagCRUD: 'C',
        uldNumber: "",
        unloadingAirport: "",
        contentCode: "",
        finalize: "",
      }
    ]);
    this.enableDisableControls();
  }

  public onAddOutgoingCarrierUld(event) {

    this.sequenceNumber = (<NgcFormArray>this.ulducm.get('outgoingCarrierUldModel')).length + 1;
    (<NgcFormArray>this.ulducm.get(['outgoingCarrierUldModel'])).addValue([
      {
        select: false,
        flagCRUD: 'C',
        uldNumber: "",
        unloadingAirport: "",
        contentCode: "",
        finalize: "",
      }
    ]);
    this.enableDisableControls();
  }

  public onAddOutgoingForeignUld(event) {
    this.sequenceNumber = (<NgcFormArray>this.ulducm.get('outgoingForeignUldModel')).length + 1;
    (<NgcFormArray>this.ulducm.get(["outgoingForeignUldModel"])).addValue([
      {
        select: false,
        flagCRUD: 'C',
        uldNumber: "",
        unloadingAirport: "",
        contentCode: "",
        finalize: "",
      }
    ]);
    this.enableDisableControls();
  }

  public deleteOsi(event, index) {
  }


  public onDeleteIncomingCarrierUld(event, index) {
    const deleteIncomingCarrierRec: any = (<NgcFormGroup>this.ulducm.get("incomingCarrierUldModel." + index)).getRawValue();
    if (deleteIncomingCarrierRec.flagCRUD == 'C' && (deleteIncomingCarrierRec.finalize == null || deleteIncomingCarrierRec.finalize == '')) {
      (<NgcFormArray>this.ulducm.get('incomingCarrierUldModel')).deleteValueAt(index);
    } else {
      deleteIncomingCarrierRec.flightType = this.flightType;
      deleteIncomingCarrierRec.flightKey = this.ulducm.get('flightKey').value;
      deleteIncomingCarrierRec.date = this.ulducm.get('date').value;
      this.uldService.deleteUcmUld(deleteIncomingCarrierRec).subscribe(data => {
        this.resultSet = data.data;
        this.onSearch();
        this.showSuccessStatus('g.operation.successful');
      }, error => {
        this.showErrorStatus(error);
      });

    }
  }


  public onDeleteIncomingForeignUld(event, index) {
    const deleteIncomingForeignRec: any = (<NgcFormGroup>this.ulducm.get("incomingForeignUldModel." + index)).getRawValue();
    if (deleteIncomingForeignRec.flagCRUD == 'C' && (deleteIncomingForeignRec.finalize == null || deleteIncomingForeignRec.finalize == '')) {
      (<NgcFormArray>this.ulducm.get('incomingForeignUldModel')).deleteValueAt(index);
    } else {

      deleteIncomingForeignRec.flightType = this.flightType;
      deleteIncomingForeignRec.flightKey = this.ulducm.get('flightKey').value;
      deleteIncomingForeignRec.date = this.ulducm.get('date').value;
      this.uldService.deleteUcmUld(deleteIncomingForeignRec).subscribe(data => {
        this.resultSet = data.data;
        this.onSearch();
        this.showSuccessStatus('g.operation.successful');
      }, error => {
        this.showErrorStatus(error);
      });

    }
  }

  public onDeleteOutgoingCarrierUld(event, index) {
    const deleteOutgoingCarrierRec: any = (<NgcFormGroup>this.ulducm.get("outgoingCarrierUldModel." + index)).getRawValue();
    if (deleteOutgoingCarrierRec.flagCRUD == 'C' && (deleteOutgoingCarrierRec.finalize == null || deleteOutgoingCarrierRec.finalize == '')) {
      (<NgcFormArray>this.ulducm.get('outgoingCarrierUldModel')).deleteValueAt(index);
    } else {
      deleteOutgoingCarrierRec.flightType = this.flightType;
      deleteOutgoingCarrierRec.flightKey = this.ulducm.get('flightKey').value;
      deleteOutgoingCarrierRec.date = this.ulducm.get('date').value;
      this.uldService.deleteUcmUld(deleteOutgoingCarrierRec).subscribe(data => {
        this.resultSet = data.data;
        this.showSuccessStatus('g.operation.successful');
        this.onSearch();
      }, error => {
        this.showErrorStatus(error);
      });
    }
  }

  public onDeleteOutgoingForeignUld(event, index) {
    const deleteOutgoingForeignRec: any = (<NgcFormGroup>this.ulducm.get("outgoingForeignUldModel." + index)).getRawValue();
    if (deleteOutgoingForeignRec.flagCRUD == 'C' && (deleteOutgoingForeignRec.finalize == null || deleteOutgoingForeignRec.finalize == '')) {
      (<NgcFormArray>this.ulducm.get('outgoingForeignUldModel')).deleteValueAt(index);
    } else {
      deleteOutgoingForeignRec.flightType = this.flightType;
      deleteOutgoingForeignRec.flightKey = this.ulducm.get('flightKey').value;
      deleteOutgoingForeignRec.date = this.ulducm.get('date').value;
      this.uldService.deleteUcmUld(deleteOutgoingForeignRec).subscribe(data => {
        this.resultSet = data.data;
        this.showSuccessStatus('g.operation.successful');
        this.onSearch();
      }, error => {
        this.showErrorStatus(error);
      });

    }
  }

  public onAddOsi(event) {
    this.sequenceNumber = (<NgcFormArray>this.ulducm.get('osiFormArray')).length + 1;
    (<NgcFormArray>this.ulducm.get(["osiFormArray"])).addValue([
      {
        osi: "",
      }
    ]);
  }

  public onDeleteOsi(index) {
    (<NgcFormArray>this.ulducm.get('osiFormArray')).deleteValueAt(index);
  }

  onSave() {
    const updateRequest = this.ulducm.getRawValue();
    this.refreshFormMessages(updateRequest);
    /********   Incoming Carrier ULD Landing airport Validation ***********/
    for (let e1 of updateRequest.incomingCarrierUldModel) {
      e1.finalize = e1.finalize === true || e1.finalize === 'Y' ? 1 : 0;
      e1.flightId = this.flightId;
    }

    /********   Incoming Foreign ULD Landing airport Validation ***********/

    for (let e1 of updateRequest.incomingForeignUldModel) {
      e1.finalize = e1.finalize === true || e1.finalize === 'Y' ? 1 : 0;
      e1.flightId = this.flightId;
    }


    /********   Outgoing Carrier ULD Landing airport Validation ***********/

    for (let e1 of updateRequest.outgoingCarrierUldModel) {
      e1.finalize = e1.finalize === true || e1.finalize === 'Y' ? 1 : 0;
      e1.flightId = this.flightId;
    }


    /********   Outgoing Foreign ULD Landing airport Validation ***********/

    for (let e1 of updateRequest.outgoingForeignUldModel) {
      e1.finalize = e1.finalize === true || e1.finalize === 'Y' ? 1 : 0;
      e1.flightId = this.flightId;
    }

    this.uldService.checkUldExistance(updateRequest).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.messageList && data.messageList.length) {
          data.messageList.push({ code: "Operation Falied" });
        }

        if (data.data.duplicateUldList && data.data.duplicateUldList.length) {
          this.showConfirmMessage(NgcUtility.translateMessage("uld.duplicate.uld.warn", [data.data.duplicateUldList.toString()])).then(fulfilled => {


            if (data.data.uldNumberExistanceCheck && data.data.uldNumberExistanceCheck.length) {
              this.showConfirmMessage(NgcUtility.translateMessage("uld.not.found.uld.entry.warn", [data.data.uldNumberExistanceCheck.toString()])
              ).then(fulfilled => {

                this.createUcmUld(updateRequest);



              })
            }
            else {
              if (data.data.uldAssignmentExistanceCheck && data.data.uldAssignmentExistanceCheck.length) {
                this.showConfirmMessage(NgcUtility.translateMessage("uld.associated.with.another.flight", [data.data.uldAssignmentExistanceCheck.toString()])
                ).then(fulfilled => {
                  this.createUcmUld(updateRequest);
                })
              } else {
                this.createUcmUld(updateRequest);
              }
            }


          })

        } else {


          if (data.data.uldNumberExistanceCheck && data.data.uldNumberExistanceCheck.length) {
            this.showConfirmMessage(NgcUtility.translateMessage("uld.not.found.uld.entry.warn", [data.data.uldNumberExistanceCheck.toString()])
            ).then(fulfilled => {

              this.createUcmUld(updateRequest);



            })
          }
          else {
            if (data.data.uldAssignmentExistanceCheck && data.data.uldAssignmentExistanceCheck.length) {
              this.showConfirmMessage(NgcUtility.translateMessage("uld.associated.with.another.flight", [data.data.uldAssignmentExistanceCheck.toString()])
              ).then(fulfilled => {
                this.createUcmUld(updateRequest);
              })
            } else {
              this.createUcmUld(updateRequest);
            }
          }

        }

      }

    })

  }

  createUcmUld(updateRequest) {
    this.uldService.createUcmUld(updateRequest).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.messageList && data.messageList.length) {
          data.messageList.push({ code: "Operation Falied" });
        }
        this.resp = data;
        this.refreshFormMessages(data);
        if (this.resp.success) {
          this.disabledTable = true;
          this.showSuccessStatus('g.operation.successful');
          this.onSearch();
        } else {
          error => this.showErrorStatus(error);
          return;
        }
        this.ucmDetails = true;
      }
    })

  }

  public onUcmBoth() {
    this.ulducm.validate();
    if (this.ulducm.invalid) {
      this.showErrorStatus('uld.please.fill.all.the.mandatory.fields');
      return;
    } else {
      this.ucmDetail = true;
      this.onSaveFlag = true;

      const updateRequest = this.ulducm.getRawValue();
      updateRequest.handlingCarrierCode = this.flightCarrierCode;
      for (let item of updateRequest.incomingCarrierUldModel) {
        if (!item.uldID) {
          this.showErrorStatus("ucm.savedata");
          return;
        }
        item.finalize = item.finalize === true || item.finalize === 'Y' ? 1 : 0;
      }
      for (let item of updateRequest.incomingForeignUldModel) {
        if (!item.uldID) {
          this.showErrorStatus("ucm.savedata");
          return;
        }
        item.finalize = item.finalize === true || item.finalize === 'Y' ? 1 : 0;
      }
      for (let item of updateRequest.outgoingCarrierUldModel) {
        if (!item.uldID) {
          this.showErrorStatus("ucm.savedata");
          return;
        }
        item.finalize = item.finalize === true || item.finalize === 'Y' ? 1 : 0;
      }
      for (let item of updateRequest.outgoingForeignUldModel) {
        if (!item.uldID) {
          this.showErrorStatus("ucm.savedata");
          return;
        }
        item.finalize = item.finalize === true || item.finalize === 'Y' ? 1 : 0;
      }
      this.uldService.ucmUldBoth(updateRequest).subscribe(data => {
        this.resp = data;
        if (data.success) {
          this.showSuccessStatus('uld.updated.successfully');
          this.onSearch();
        } else {
          error => this.showErrorStatus('uld.not.updated.or.created');
        }
      },
        error => this.showErrorStatus('uld.validation.error'));
    }

  }

  public onUcmIn() {
    this.ucmDetail = true;
    this.onSaveFlag = true;

    const updateRequest = this.ulducm.getRawValue();
    updateRequest.handlingCarrierCode = this.flightCarrierCode;
    for (let item of updateRequest.incomingCarrierUldModel) {
      if (!item.uldID) {
        this.showErrorStatus("ucm.savedata");
        return;
      }
      item.finalize = item.finalize === true || item.finalize === 'Y' ? 1 : 0;
    }
    for (let item of updateRequest.incomingForeignUldModel) {
      if (!item.uldID) {
        this.showErrorStatus("ucm.savedata");
        return;
      }
      item.finalize = item.finalize === true || item.finalize === 'Y' ? 1 : 0;
    }
    for (let item of updateRequest.outgoingCarrierUldModel) {
      if (!item.uldID) {
        this.showErrorStatus("ucm.savedata");
        return;
      }
      item.finalize = item.finalize === true || item.finalize === 'Y' ? 1 : 0;
    }
    for (let item of updateRequest.outgoingForeignUldModel) {
      if (!item.uldID) {
        this.showErrorStatus("ucm.savedata");
        return;
      }
      item.finalize = item.finalize === true || item.finalize === 'Y' ? 1 : 0;
    }

    this.uldService.ucmUldIn(updateRequest).subscribe(data => {
      this.resp = data;
      this.refreshFormMessages(data);

      if (data.success) {
        this.showSuccessStatus('uld.updated.successfully');
        this.onSearch();
      } else {
        error => this.showErrorStatus('uld.not.updated.or.created');
      }
    },
      error => this.showErrorStatus('uld.validation.error'));
  }

  public onUcmOut() {
    this.ulducm.validate();
    if (this.ulducm.invalid) {
      this.showErrorStatus('uld.please.fill.all.the.mandatory.fields');
      return;
    }
    this.ucmDetail = true;
    this.onSaveFlag = true;
    const updateRequest = this.ulducm.getRawValue();
    updateRequest.handlingCarrierCode = this.flightCarrierCode;
    for (let item of updateRequest.incomingCarrierUldModel) {
      if (!item.uldID) {
        this.showErrorStatus("ucm.savedata");
        return;
      }
      item.finalize = item.finalize === true || item.finalize === 'Y' ? 1 : 0;
    }
    for (let item of updateRequest.incomingForeignUldModel) {
      if (!item.uldID) {
        this.showErrorStatus("ucm.savedata");
        return;
      }
      item.finalize = item.finalize === true || item.finalize === 'Y' ? 1 : 0;
    }
    for (let item of updateRequest.outgoingCarrierUldModel) {
      if (!item.uldID) {
        this.showErrorStatus("ucm.savedata");
        return;
      }
      item.finalize = item.finalize === true || item.finalize === 'Y' ? 1 : 0;
    }

    for (let item of updateRequest.outgoingForeignUldModel) {
      if (!item.uldID) {
        this.showErrorStatus("ucm.savedata");
        return;
      }
      item.finalize = item.finalize === true || item.finalize === 'Y' ? 1 : 0;
    }

    this.uldService.ucmUldOut(updateRequest).subscribe(data => {
      this.resp = data;
      this.refreshFormMessages(data);

      if (data.success) {
        this.showSuccessStatus('uld.updated.successfully');
        this.onSearch();
      } else {
        error => this.showErrorStatus('uld.not.updated.or.created');
      }
    },
      error => this.showErrorStatus('uld.validation.error'));
  }

  onCancel(event) {
    this.navigateTo(this.router, '/', null);
  }

  onUldNumberChange(event, index, column, modelType, sourceId) {
    this.retrieveLOVRecords(sourceId, { 'parameter1': this.flightId }).subscribe(record => {
      if (record) {
        if (record.length === 1)
          this.ulducm.get([modelType, index, column]).setValue(record[0].code)
      }
    }, (error) => {

    });
  }

}



