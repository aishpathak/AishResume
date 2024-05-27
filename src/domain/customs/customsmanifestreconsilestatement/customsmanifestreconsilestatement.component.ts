
import { ViewChild } from '@angular/core';
import { Component, ElementRef, NgZone, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// Application
import { NgcFormArray, NgcFormControl, NgcUtility, NgcFormGroup, NgcPage, PageConfiguration, CellsRendererStyle, NgcReportComponent, NgcWindowComponent } from 'ngc-framework';
import { CustomACESService } from './../customs.service';
import { customMRSMOdel, customMrs, mrsModel } from './../customs.sharedmodel';



@Component({
  selector: 'app-customsmanifestreconsilestatement',
  templateUrl: './customsmanifestreconsilestatement.component.html',
  styleUrls: ['./customsmanifestreconsilestatement.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class CustomsmanifestreconsilestatementComponent extends NgcPage {
  response: any;
  initialResponse: any;
  showTable = false;
  req: any;
  mrs: any;
  errors: any;
  open: any;
  date: any;
  ShipmentNumbersOnDetails: any[];
  ShipmentNumbers: any[];
  ShipmentNumbersOnUpdate: any[];
  openMRSButton = true;
  delete: any;
  deleteYes: any;
  nilCargo: any = false;
  shipmentNo: any;
  data: any;
  validToSendmrs: any = false;
  selectedShipmentNumber: any;
  reportParameters: any;
  reportParameters1: any;
  reportParameters2: any;

  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('reportWindow2') reportWindow2: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private customACESService: CustomACESService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);

  }

  @ViewChild('showPopUpWindow') showPopUpWindow: NgcWindowComponent;
  @ViewChild('confirm') confirm: NgcWindowComponent;
  @ViewChild('mrsOpen') mrsOpen: NgcWindowComponent;
  @Output('closewindow')
  change: EventEmitter<number> = new EventEmitter<number>();
  ngOnInit() {
    super.ngOnInit();
    let forwardedData = this.getNavigateData(this.activatedRoute);
    this.data = this.getNavigateData(this.activatedRoute);
    if (forwardedData) {
      if (forwardedData.cmd) {
        this.showErrorMessage('noCmdRecieve');
      }
      this.manifestReconsilationStatementForm.get('exportOrImport').patchValue(forwardedData.exportOrImport);
      this.manifestReconsilationStatementForm.get('flightKey').patchValue(forwardedData.flightKey);
      this.manifestReconsilationStatementForm.get('flightDate').patchValue(forwardedData.flightDate);
      this.onSearchMrs();
    }
    let status = this.manifestReconsilationStatementForm.get('shipmentstatus').value;
    this.manifestReconsilationStatementForm.get('shipmentstatus').valueChanges.subscribe(
      (newValue) => {
        if (newValue !== status) {
          status = this.manifestReconsilationStatementForm.get('shipmentstatus').value;
          (<NgcFormArray>this.manifestReconsilationStatementForm.get('mrsModel')).patchValue(this.mrs);
          if (newValue !== 'All') {
            this.performstatusFilter(status);
          } else {
            this.refreshFormMessages(this.manifestReconsilationStatementForm.getRawValue());
          }

        }
      });


  }



  ngAfterViewInit() {
    super.ngAfterViewInit();

    let status = this.manifestReconsilationStatementForm.get('shipmentstatus').value;
    this.manifestReconsilationStatementForm.get('shipmentstatus').valueChanges.subscribe(
      (newValue) => {
        if (newValue !== status) {
          status = this.manifestReconsilationStatementForm.get('shipmentstatus').value;
          (<NgcFormArray>this.manifestReconsilationStatementForm.get('mrsModel')).patchValue(this.mrs);
          if (newValue !== 'All') {
            this.performstatusFilter(status);
          }

        }
      });

  }



  private manifestReconsilationStatementForm: NgcFormGroup = new NgcFormGroup({
    exportOrImport: new NgcFormControl(null, [Validators.required]),
    flightDate: new NgcFormControl(null, [Validators.required]),
    flightKey: new NgcFormControl(null, [Validators.required]),
    shipmentstatus: new NgcFormControl(),
    mrsSequenceNo: new NgcFormControl(),
    acknowledgeCode: new NgcFormControl(),
    acknowledgeDate: new NgcFormControl(),
    customsFlightId: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    mrsfirstWindowForImport: new NgcFormControl(),
    mrsFirstWindowForExport: new NgcFormControl(),
    isValidMrsWindow: new NgcFormControl(),
    selectAll: new NgcFormControl(),
    month: new NgcFormControl(),
    year: new NgcFormControl(),
    mrsModel: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        sno: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        type: new NgcFormControl(),
        natureOfGoods: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        shipmentPiece: new NgcFormControl(),
        shipmentWeight: new NgcFormControl(),
        totalPiece: new NgcFormControl(),
        totalWeight: new NgcFormControl(),
        cmdReceived: new NgcFormControl(),
        mrsStatusCode: new NgcFormControl(),
        shipmentstatus: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        flightKey: new NgcFormControl(), exportOrImport: new NgcFormControl(),
        customShipmentCustomerInfoId: new NgcFormControl(),
        customShipmentLocalAuthorityRequirementId: new NgcFormControl(),
        customShipmentInfoId: new NgcFormControl(),
        appointedAgentCode: new NgcFormControl(),
        referenceNumber: new NgcFormControl(),
        doNuumber: new NgcFormControl(),
      })
    ]),


  })
  performstatusFilter(status: any) {
    this.mrs = (<NgcFormArray>this.manifestReconsilationStatementForm.get('mrsModel')).getRawValue();
    const mrsRawValue = (<NgcFormArray>this.manifestReconsilationStatementForm.get('mrsModel')).getRawValue();
    const customerFilterVaule = mrsRawValue.filter(element => {
      let splitVal = element['shipmentStatus']
      if (splitVal && splitVal.search("-") !== -1) {
        splitVal = splitVal.split("-")[0];
      }

      if (splitVal) {
        // const splitVa = splitVal.split("-");
        //  const shpStatus = splitVa[0];
        return (splitVal === status);
      }
      return false;

    });

    (<NgcFormArray>this.manifestReconsilationStatementForm.get('mrsModel')).patchValue(customerFilterVaule);
    if (customerFilterVaule.length === 0) {
      this.showErrorStatus('no.record.found');
    } else {
      this.refreshFormMessages(this.manifestReconsilationStatementForm.getRawValue());

    }
  }
  onRefresh() {
    this.onSearchMrs();
  }
  onSearchMrs() {
    this.shipmentNo = this.manifestReconsilationStatementForm.get('shipmentNumber').value;
    const req: customMRSMOdel = new customMRSMOdel();
    if (this.manifestReconsilationStatementForm.get('exportOrImport').value === 'EXPORT') {
      this.manifestReconsilationStatementForm.get('exportOrImport').patchValue('E');
    } else if (this.manifestReconsilationStatementForm.get('exportOrImport').value === 'IMPORT') {

      this.manifestReconsilationStatementForm.get('exportOrImport').patchValue('I');
    }
    req.exportOrImport = this.manifestReconsilationStatementForm.get('exportOrImport').value;
    req.flightKey = this.manifestReconsilationStatementForm.get('flightKey').value;
    req.flightDate = this.manifestReconsilationStatementForm.get('flightDate').value;
    req.shipmentNumber = this.manifestReconsilationStatementForm.get('shipmentNumber').value;
    this.date = new Date();
    this.date.setDate(this.date.getDate() + 90);
    if (req.flightDate > this.date) {
      this.showErrorStatus('noRecordDateOutOfRange ');
      return;
    }
    console.log(req);
    this.customACESService.getMrsInfo(req).subscribe(data => {
      this.response = data.data;
      this.initialResponse = this.response;
      this.refreshFormMessages(data);
      if (this.response) {
        this.manifestReconsilationStatementForm.patchValue(this.response);
        if (this.response.mrsSequenceNo !== null && this.response.mrsSequenceNo !== " ") {
          this.openMRSButton = false;
        }

        this.manifestReconsilationStatementForm.get('mrsSequenceNo').patchValue(this.response.mrsSequenceNo);
        if (this.manifestReconsilationStatementForm.get('exportOrImport').value === 'I') {
          this.manifestReconsilationStatementForm.get('exportOrImport').patchValue('IMPORT');
        } else {

          this.manifestReconsilationStatementForm.get('exportOrImport').patchValue('EXPORT');
        }
        this.manifestReconsilationStatementForm.get('shipmentNumber').patchValue(this.shipmentNo);


        if (this.response.mrsModel) {
          this.patchPtf();
        }
        this.showTable = true;

        if (this.response.mrsModel.length === 0) {
          this.showErrorStatus('no.record.found');
          this.nilCargo = true;
          if (this.shipmentNo && this.response.messageList.length > 0) {
            //AWB change
            let dat = this.response.messageList;
            if (dat[0].code == "SHIP_NOTEXIST") {
              let er = this.shipmentNo + '- Shipment does not exist in ACES.';
              this.showErrorStatus(er);
            } else {
              let de = 'AWB Exists in ';
              for (let i = 0; i < dat.length; i++) {
                de = de + dat[i]['referenceId'];
                de = de + ',';
                // this.showFormErrorMessages(dat);
              }
              this.showErrorStatus(de);
            }


          }

        } else {
          this.nilCargo = false;
          this.refreshFormMessages(this.manifestReconsilationStatementForm.getRawValue());
          if (this.shipmentNo && this.response.messageList.length > 0) {

            let dat = this.response.messageList;
            if (dat[0].code == "SHIP_NOTEXIST") {
              let er = this.shipmentNo + '- Shipment does not exist in ACES.';
              this.showErrorStatus(er);
            }
            else {

              let de = 'AWB Exists in ';
              for (let i = 0; i < dat.length; i++) {
                de = de + dat[i]['referenceId'];
                de = de + ',';
                // this.showFormErrorMessages(dat);
              }
              this.showErrorStatus(de);
            }

          }

        }
        NgcUtility.trackCheckUnCheckAll(this.manifestReconsilationStatementForm.get('selectAll') as NgcFormControl, this.manifestReconsilationStatementForm.get('mrsModel') as NgcFormArray, "select");

      } else {
        if (this.response === null) {
          if (this.manifestReconsilationStatementForm.get('exportOrImport').value === 'I') {
            this.manifestReconsilationStatementForm.get('exportOrImport').patchValue('IMPORT');
          } else {

            this.manifestReconsilationStatementForm.get('exportOrImport').patchValue('EXPORT');
          }
          this.showErrorStatus('FlIGHTDOESNTEXIST');
        }
        this.showTable = false;
        this.errors = this.response.messageList;
        this.showErrorStatus(this.response);
      }
    }, error => this.showErrorStatus('g.error'));


  }
  onUpdate() {
    if (this.manifestReconsilationStatementForm.get('mrsSequenceNo').value !== 'SENT') {

      this.ShipmentNumbersOnUpdate = new Array;
      let movedata = { exportOrImport: null, flightKey: null, shipmentNumber: null, operation: null, flightDate: null, customsFlightId: null, doNumber: null, shipmentPiece: null, shipmentWeight: null, curruentpage: null }

      let customsFlightId: NgcFormControl = this.manifestReconsilationStatementForm.get('customsFlightId') as NgcFormControl;
      let formArray: NgcFormArray = this.manifestReconsilationStatementForm.get('mrsModel') as NgcFormArray;
      formArray.controls.forEach((formGroup: NgcFormGroup) => {
        let selectItem: NgcFormControl = formGroup.get('select') as NgcFormControl;
        let shipmentNumber: NgcFormControl = formGroup.get('shipmentNumber') as NgcFormControl;
        let exportOrImport: NgcFormControl = formGroup.get('exportOrImport') as NgcFormControl;
        let flightDate: NgcFormControl = formGroup.get('flightDate') as NgcFormControl;
        let flightKey: NgcFormControl = formGroup.get('flightKey') as NgcFormControl;
        let doNuumber: NgcFormControl = formGroup.get('doNuumber') as NgcFormControl;
        let mrsStatusCode: NgcFormControl = formGroup.get('mrsStatusCode') as NgcFormControl;
        let shipmentPiece: NgcFormControl = formGroup.get('shipmentPiece') as NgcFormControl;
        let shipmentWeight: NgcFormControl = formGroup.get('shipmentWeight') as NgcFormControl;
        let select
        if (selectItem && selectItem.value === true) {
          movedata['shipmentNumber'] = shipmentNumber.value;
          movedata['exportOrImport'] = exportOrImport.value;
          movedata['flightDate'] = this.manifestReconsilationStatementForm.get('flightDate').value;
          movedata['flightKey'] = this.manifestReconsilationStatementForm.get('flightKey').value;
          movedata['doNumber'] = formGroup.get('doNumber').value;
          movedata['mrsStatusCode'] = mrsStatusCode.value;
          movedata['operation'] = 'UPDATE';
          movedata['customsFlightId'] = this.manifestReconsilationStatementForm.get('customsFlightId').value;
          movedata['shipmentPiece'] = shipmentPiece.value;
          movedata['shipmentWeight'] = shipmentWeight.value;
          if (this.data !== null) {
            movedata['withCargoFlag'] = this.data.withCargoFlag;
            movedata['mrsSentFlag'] = this.data.mrsSentFlag;
            movedata['fmaReceivedFlag'] = this.data.fmaReceivedFlag;
            movedata['directShpCneShipment'] = this.data.directShpCneShipment;
            movedata['directShpCneShipmentWithPermit'] = this.data.directShpCneShipmentWithPermit;
            movedata['curruentpage'] = this.data.curruentpage;
          }
          this.ShipmentNumbersOnUpdate.push(shipmentNumber.value);
        }


      });
      if (this.ShipmentNumbersOnUpdate.length === 1) {
        this.navigateTo(this.router, '/customs/customsshipmentaddupdate', movedata);

      } else if (this.ShipmentNumbersOnUpdate.length === 0) {
        this.showErrorStatus('selectSM');
      } else {
        this.showErrorStatus('selectOneSM');
      }
    } else {
      this.showErrorStatus('mrsSentCantDeleteUpdate');
    }
  }
  onAddRow() {
    if (this.manifestReconsilationStatementForm.get('mrsSequenceNo').value !== 'SENT') {
      let movedata = { exportOrImport: null, flightKey: null, shipmentNumber: null, operation: null, flightDate: null, customsFlightId: null, curruentpage: null };
      let formArray: NgcFormGroup = this.manifestReconsilationStatementForm as NgcFormGroup;


      let exportOrImport: NgcFormControl = formArray.get('exportOrImport') as NgcFormControl;
      let flightDate: NgcFormControl = formArray.get('flightDate') as NgcFormControl;
      let flightKey: NgcFormControl = formArray.get('flightKey') as NgcFormControl;
      let customsFlightId: NgcFormControl = formArray.get('customsFlightId') as NgcFormControl;
      if (exportOrImport.value === 'IMPORT') {
        movedata['exportOrImport'] = 'IMPORT';
      }
      if (exportOrImport.value === 'EXPORT') {
        movedata['exportOrImport'] = 'EXPORT';
      }
      movedata['flightDate'] = flightDate.value;
      movedata['flightKey'] = flightKey.value;
      movedata['operation'] = 'ADD';
      movedata['customsFlightId'] = customsFlightId.value;
      if (this.data !== null) {
        movedata['curruentpage'] = this.data.curruentpage;
      }
      movedata['withCargoFlag'] = this.data.withCargoFlag;
      movedata['mrsSentFlag'] = this.data.mrsSentFlag;
      movedata['fmaReceivedFlag'] = this.data.fmaReceivedFlag;
      movedata['directShpCneShipment'] = this.data.directShpCneShipment;
      movedata['directShpCneShipmentWithPermit'] = this.data.directShpCneShipmentWithPermit;
      this.navigateTo(this.router, '/customs/customsshipmentaddupdate', movedata);
    } else {
      this.showErrorStatus('mrsSentCantDeleteUpdate');
    }
  }
  ondetails() {
    // this.router.navigate(/awb,);
    this.navigateTo(this.router, '/customs/customslocalauthorityrequest', 'jhfjhf');

  }
  openMrs() {
    this.showConfirmMessage('MrsStatusChangeWarning').then(fullFilled => {
      this.manifestReconsilationStatementForm.get('mrsSequenceNo').reset();
      this.manifestReconsilationStatementForm.get('acknowledgeCode').reset();
      this.manifestReconsilationStatementForm.get('acknowledgeDate').reset();
      this.open = true;
      this.OnSend();
    });
  }
  onAcesFlightSchedule() {
    let movedata = { exportOrImport: null, flightKey: null, shipmentNumber: null, operation: null, flightDate: null, customsFlightId: null };
    let formArray: NgcFormGroup = this.manifestReconsilationStatementForm as NgcFormGroup;
    let exportOrImport: NgcFormControl = formArray.get('exportOrImport') as NgcFormControl;
    let flightDate: NgcFormControl = formArray.get('flightDate') as NgcFormControl;
    let flightKey: NgcFormControl = formArray.get('flightKey') as NgcFormControl;
    movedata['exportOrImport'] = exportOrImport.value;
    movedata['flightKey'] = flightKey.value;
    movedata['flightDate'] = flightDate.value;

    this.navigateTo(this.router, '/customs/customflightschedule', movedata);


  }
  OnShipment() {

    this.ShipmentNumbers = new Array;

    let movedata = { exportOrImport: null, flightKey: null, shipmentNumber: null, operation: null, flightDate: null, customsFlightId: null }

    let customsFlightId: NgcFormControl = this.manifestReconsilationStatementForm.get('customsFlightId') as NgcFormControl;
    let formArray: NgcFormArray = this.manifestReconsilationStatementForm.get('mrsModel') as NgcFormArray;
    formArray.controls.forEach((formGroup: NgcFormGroup) => {
      let selectItem: NgcFormControl = formGroup.get('select') as NgcFormControl;
      let shipmentNumber: NgcFormControl = formGroup.get('shipmentNumber') as NgcFormControl;
      let exportOrImport: NgcFormControl = formGroup.get('exportOrImport') as NgcFormControl;
      let flightDate: NgcFormControl = formGroup.get('flightDate') as NgcFormControl;
      let flightKey: NgcFormControl = formGroup.get('flightKey') as NgcFormControl;
      if (selectItem && selectItem.value === true) {
        movedata['shipmentNumber'] = shipmentNumber.value;
        movedata['exportOrImport'] = exportOrImport.value;
        movedata['flightDate'] = this.manifestReconsilationStatementForm.get('flightDate').value;
        movedata['flightKey'] = this.manifestReconsilationStatementForm.get('flightKey').value;
        movedata['customsFlightId'] = this.manifestReconsilationStatementForm.get('customsFlightId').value;
        this.ShipmentNumbers.push(shipmentNumber.value);
      }
      let select

    });
    console.log()
    if (this.ShipmentNumbers.length === 1) { this.navigateTo(this.router, '/awbmgmt/shipmentinfoCR', movedata); }
    else if (this.ShipmentNumbers.length === 0) {
      this.showErrorStatus('selectSM');
    } else {
      this.showErrorStatus('selectOneSM');
    }
  }
  OnSend() {

    if (!this.initialResponse.validMrsWindow && this.manifestReconsilationStatementForm.get('exportOrImport').value === 'EXPORT' && !this.open) {
      //  this.showErrorMessage("INVALID ACTION MRS CAN ONLY BE SEND AFTER  " + this.manifestReconsilationStatementForm.get('mrsFirstWindowForExport').value + "  DAYS OF FLIGHT");
      return;
    } else {

      this.validToSendmrs = false;
      (<NgcFormArray>this.manifestReconsilationStatementForm.get('mrsModel')).controls.forEach((item: NgcFormGroup) => {
        if (item.get('mrsStatusCode').value === null) {

          this.validToSendmrs = true;
          return;
        }
      })

      if (this.validToSendmrs) {
        this.showErrorMessage('agentANDacesMrsMandatory');
        return;
      }



      const req: customMRSMOdel = new customMRSMOdel();
      if (this.manifestReconsilationStatementForm.get('exportOrImport').value === 'EXPORT') {
        this.manifestReconsilationStatementForm.get('exportOrImport').patchValue('E');
      } else if (this.manifestReconsilationStatementForm.get('exportOrImport').value === 'IMPORT') {

        this.manifestReconsilationStatementForm.get('exportOrImport').patchValue('I');
      }
      if (this.manifestReconsilationStatementForm.get('mrsSequenceNo').value === 'SENT') {
        this.showErrorStatus("mrsAlreadySent ");
        return;
      }
      req.exportOrImport = this.manifestReconsilationStatementForm.get('exportOrImport').value;
      req.flightKey = this.manifestReconsilationStatementForm.get('flightKey').value;
      req.flightDate = this.manifestReconsilationStatementForm.get('flightDate').value;
      req.mrssentby = this.getUserProfile().userLoginCode;
      if (this.open) {
        req.openMrs = true;
        req.customsFlightId = this.manifestReconsilationStatementForm.get('customsFlightId').value
      } else {
        req.openMrs = false;
      }
      console.log(req);
      this.customACESService.sendMrsInfo(req).subscribe(data => {
        this.response = data.data;
        this.refreshFormMessages(data);
        if (this.response) {
          this.manifestReconsilationStatementForm.patchValue(this.response);
          this.showSuccessStatus('g.completed.successfully');
          if (this.response.mrsSequenceNo) {
            this.openMRSButton = false;
          }
          this.manifestReconsilationStatementForm.get('mrsSequenceNo').patchValue(this.response.mrsSequenceNo);
          if (this.manifestReconsilationStatementForm.get('exportOrImport').value === 'I') {
            this.manifestReconsilationStatementForm.get('exportOrImport').patchValue('IMPORT');
          } else {

            this.manifestReconsilationStatementForm.get('exportOrImport').patchValue('EXPORT');
          }
          this.showTable = true;
          this.open = false;
          this.onSearchMrs();
        } else {
          this.showTable = false;
          this.errors = this.response.messageList;
          this.showErrorStatus(this.response);
        }
      }, error => this.showErrorStatus('g.error'));
    }


  }

  public onCancel(event) {
    this.navigateTo(this.router, '/customs/customflightschedule', this.data);
  }
  onLinkClick(evnet, index) {



    this.ShipmentNumbersOnDetails = new Array;
    let movedata = { exportOrImport: null, flightKey: null, shipmentNumber: null, operation: null, flightDate: null, customsFlightId: null, totalPiece: null, totalWeight: null, curruentpage: null }

    let formArray: NgcFormArray = this.manifestReconsilationStatementForm.get('mrsModel') as NgcFormArray;

    let formGroup = (Object)(<NgcFormArray>this.manifestReconsilationStatementForm.get('mrsModel')).controls[index];
    if (formGroup.get('cmdReceived').value === 'N') {
      this.showErrorMessage('noCmdRecieve');
      return;
    }
    let selectItem: NgcFormControl = formGroup.get('select') as NgcFormControl;
    let shipmentNumber: NgcFormControl = formGroup.get('shipmentNumber') as NgcFormControl;
    let exportOrImport: NgcFormControl = formGroup.get('exportOrImport') as NgcFormControl;
    let flightDate: NgcFormControl = formGroup.get('flightDate') as NgcFormControl;
    let flightKey: NgcFormControl = formGroup.get('flightKey') as NgcFormControl;
    let totalPiece: NgcFormControl = formGroup.get('totalPiece') as NgcFormControl;
    let totalWeight: NgcFormControl = formGroup.get('totalWeight') as NgcFormControl;

    movedata['shipmentNumber'] = shipmentNumber.value;
    movedata['exportOrImport'] = exportOrImport.value;
    movedata['flightDate'] = this.manifestReconsilationStatementForm.get('flightDate').value;
    movedata['flightKey'] = this.manifestReconsilationStatementForm.get('flightKey').value;
    movedata['customsFlightId'] = this.manifestReconsilationStatementForm.get('customsFlightId').value;
    movedata['totalPiece'] = totalPiece.value;
    movedata['totalWeight'] = totalWeight.value;
    if (this.data !== null) {
      movedata['curruentpage'] = this.data.curruentpage;
    }
    this.ShipmentNumbersOnDetails.push(shipmentNumber.value);

    this.navigateTo(this.router, '/customs/customsmanifestdecleration', movedata);
  }



  ondelete(event, index: any): void {
    this.delete = true;
    (<NgcFormArray>this.manifestReconsilationStatementForm.controls['mrsModel']).markAsDeletedAt(index);

  }
  ondelet() {
    if (this.manifestReconsilationStatementForm.get('mrsSequenceNo').value !== 'SENT') {



      let formArray: NgcFormArray = this.manifestReconsilationStatementForm.get('mrsModel') as NgcFormArray;
      formArray.controls.forEach((formGroup: NgcFormGroup) => {
        let selectItem: NgcFormControl = formGroup.get('select') as NgcFormControl;
        let awbNumber: NgcFormControl = formGroup.get('awbNumber') as NgcFormControl;
        if (selectItem && selectItem.value === true) {
          const req: customMrs = this.manifestReconsilationStatementForm.getRawValue();

          // req.exportOrImport=  this.manifestReconsilationStatementForm.get('exportOrImport').value;
          // req.flightKey=  this.manifestReconsilationStatementForm.get('flightKey').value;
          // req.flightDate=this.manifestReconsilationStatementForm.get('flightDate').value;
          this.customACESService.deleteMrsInfo(req).subscribe(data => {
            this.response = data.data;
            this.refreshFormMessages(data);
            if (this.response) {
              this.manifestReconsilationStatementForm.patchValue(this.response);
              //          this.manifestReconsilationStatementForm.get('flightKey').patchValue(req.flightKey);
              // this.manifestReconsilationStatementForm.get('flightDate').patchValue(req.flightDate);

            } else {

              this.showErrorStatus('no.record.found');
              return;
            }
          })

        }
      });
    }
    else {
      this.showErrorStatus('mrsSentCantDeleteUpdate');
    }
  }
  onACES(evnet, index) {
    this.ShipmentNumbersOnDetails = new Array;
    let movedata = { exportOrImport: null, flightKey: null, shipmentNumber: null, operation: null, flightDate: null, customsFlightId: null, doNumber: null, curruentpage: null }

    let formArray: NgcFormArray = this.manifestReconsilationStatementForm.get('mrsModel') as NgcFormArray;

    let formGroup = (Object)(<NgcFormArray>this.manifestReconsilationStatementForm.get('mrsModel')).controls[index];

    let selectItem: NgcFormControl = formGroup.get('select') as NgcFormControl;
    let shipmentNumber: NgcFormControl = formGroup.get('shipmentNumber') as NgcFormControl;
    let exportOrImport: NgcFormControl = formGroup.get('exportOrImport') as NgcFormControl;
    let flightDate: NgcFormControl = formGroup.get('flightDate') as NgcFormControl;
    let flightKey: NgcFormControl = formGroup.get('flightKey') as NgcFormControl;
    let org: NgcFormControl = formGroup.get('origin') as NgcFormControl;
    let des: NgcFormControl = formGroup.get('destination') as NgcFormControl;
    let mrsStatusCode: NgcFormControl = formGroup.get('mrsStatusCode') as NgcFormControl;

    //if (formGroup.get('origin').value != 'SIN' && formGroup.get('destination').value != 'SIN') {

    // return this.showErrorStatus('No records found');

    //}

    movedata['shipmentNumber'] = shipmentNumber.value;
    movedata['exportOrImport'] = exportOrImport.value;
    movedata['flightDate'] = this.manifestReconsilationStatementForm.get('flightDate').value;
    movedata['flightKey'] = this.manifestReconsilationStatementForm.get('flightKey').value;
    movedata['doNumber'] = formGroup.get('doNumber').value;
    movedata['mrsStatusCode'] = mrsStatusCode.value;
    movedata['operation'] = 'READ';
    movedata['customsFlightId'] = this.manifestReconsilationStatementForm.get('customsFlightId').value;
    if (this.data !== null) {
      movedata['curruentpage'] = this.data.curruentpage;
    }

    this.ShipmentNumbersOnDetails.push(shipmentNumber.value);

    this.navigateTo(this.router, '/customs/customsshipmentaddupdate', movedata);
    //      if(this.ShipmentNumbersOnDetails.length === 1){ }
    //  else if(this.ShipmentNumbersOnDetails.length===0) {
    //  this.showErrorStatus('Please Select a Shipment to continue');
    //  }else{
    //     this.showErrorStatus('Please Select only one Shipment to continue');
    //  }
  }



  onSave() {
    if (this.delete) {
      this.confirm.open();
      return;
    } if (this.deleteYes) {
      const req: customMrs = this.manifestReconsilationStatementForm.getRawValue();
      this.customACESService.deleteMrsInfo(req).subscribe(data => {
        this.response = data.data;
        this.refreshFormMessages(data);
        if (this.response) {

          this.manifestReconsilationStatementForm.patchValue(this.response);
          this.onSearchMrs();
          //          this.manifestReconsilationStatementForm.get('flightKey').patchValue(req.flightKey);
          // this.manifestReconsilationStatementForm.get('flightDate').patchValue(req.flightDate);
          this.showSuccessStatus('g.completed.successfully');
        } else {
          //   this.displayData = false;
          this.showErrorStatus('no.record.found');
          return;
        }
      })
    } else {
      this.onSearchMrs();
    }
  }
  /**
   * Cells Style Renderer
   *
   * @param value Value
   * @param rowData Row Data
   * @param level Level
   */
  public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    console.log(rowData);
    if (!value || value === ' ') {
      cellsStyle.data = "NIL";
    } else {
      cellsStyle.data = value;
    }
    //
    return cellsStyle;
  };
  ondeleteYes() {
    this.delete = false;
    this.deleteYes = true;
    this.confirm.close();
    this.onSave();

  }
  ondeleteNo() {
    this.change.emit(7);
    this.deleteYes = false;
    this.confirm.close();
    this.delete = false;
  }
  onOpenMrsYes() {
    this.mrsOpen.close();
    this.openMrs();

  }
  onOpenMrsNo() {
    this.change.emit(7);
    this.mrsOpen.close();

  }
  performShipmentFilter() {
    let arr: any[];
    let shipmentNumber = this.manifestReconsilationStatementForm.get('shipmentNumber').value;
    this.mrs = (<NgcFormArray>this.manifestReconsilationStatementForm.get('mrsModel')).getRawValue();
    const mrsRawValue = (<NgcFormArray>this.manifestReconsilationStatementForm.get('mrsModel')).getRawValue();
    const customerFilterVaule = mrsRawValue.filter(element => {
      if (arr && arr.length > 0) {
        return;
      }
      if (element['shipmentNumber'] === shipmentNumber) {
        arr.push(shipmentNumber);
      }
    });

    if (!arr || arr.length <= 0) {
      this.showErrorStatus('no.record.found');
    }
  }



  openAwbDocumentPage() {
    let count = 0;
    let formArray: NgcFormArray = this.manifestReconsilationStatementForm.get('mrsModel') as NgcFormArray;
    var form;
    formArray.controls.forEach((formGroup: NgcFormGroup) => {
      let selectItem: NgcFormControl = formGroup.get('select') as NgcFormControl;
      let exportOrImportflag = this.manifestReconsilationStatementForm.get('exportOrImport').value;
      if (this.manifestReconsilationStatementForm.get('exportOrImport').value === 'EXPORT') {
        this.manifestReconsilationStatementForm.get('exportOrImport').patchValue('E');
      } else if (this.manifestReconsilationStatementForm.get('exportOrImport').value === 'IMPORT') {

        this.manifestReconsilationStatementForm.get('exportOrImport').patchValue('I');
      }
      let shipmentNumber;
      if (selectItem && selectItem.value === true) {
        count++;
        form = {
          shipmentNumber: formGroup.get('shipmentNumber').value,
          shipmentType: "AWB",
          exportOrImport: this.manifestReconsilationStatementForm.get('exportOrImport').value,
          flightDate: this.manifestReconsilationStatementForm.get('flightDate').value,
          flightKey: this.manifestReconsilationStatementForm.get('flightKey').value,
          customsFlightId: this.manifestReconsilationStatementForm.get('customsFlightId').value
        }
      }
    })
    if (count > 1) {
      this.showErrorStatus('export.select.only.one.record');
      return;
    } else if (count === 1) {
      this.navigateTo(this.router, '/awbmgmt/awbdocument', form);
    } else {
      this.showErrorStatus('selectAtleastOneRecord');
    }
  }


  patchPtf() {
    const mrsRawValue = (<NgcFormArray>this.manifestReconsilationStatementForm.get('mrsModel')).getRawValue();
    const customerFilterVaule = mrsRawValue.forEach(element => {
      if (element['type'] === 'PTF') {
        element['referenceNumber'] = 'PTF';
      }


    });


    (<NgcFormArray>this.manifestReconsilationStatementForm.get('mrsModel')).patchValue(mrsRawValue);
  }
  exportToExcel() {
    this.reportParameters = new Object();
    this.reportParameters.CustomFlightId = this.response.customsFlightId;
    this.reportParameters.FlightKey = this.manifestReconsilationStatementForm.get('flightKey').value;
    this.reportParameters.FlightDate = this.manifestReconsilationStatementForm.get('flightDate').value;


    this.reportWindow.downloadReport();



  }

  openpopwindow() {
    this.showPopUpWindow.open();
  }

  printMRSreport() {
    this.reportParameters1 = new Object();
    const today = new Date();
    console.log(today.getMonth())
    console.log(this.manifestReconsilationStatementForm.get('year').value, today.getFullYear(), this.manifestReconsilationStatementForm.get('month').value, today.getMonth() + 1)
    if ((this.manifestReconsilationStatementForm.get('month').value == null) || (this.manifestReconsilationStatementForm.get('month').value == '') || (this.manifestReconsilationStatementForm.get('year').value) == null || (this.manifestReconsilationStatementForm.get('year').value == '')) {
      this.showErrorStatus('selectBothMonthYear')
    }
    else {
      if ((this.manifestReconsilationStatementForm.get('year').value <= today.getFullYear()) && (this.manifestReconsilationStatementForm.get('month').value <= (today.getMonth() + 1))) {
        this.reportParameters1.Month = this.manifestReconsilationStatementForm.get('month').value;
        this.reportParameters1.Year = this.manifestReconsilationStatementForm.get('year').value;
        this.reportWindow1.open();
      }
      else
        this.showErrorStatus('MonthandYearNotGreaterThanCurrent')
    }


  }

  onClick(evnet, index) {
    let x = this.manifestReconsilationStatementForm.get([
      "mrsModel",
      index, "shipmentNumber"
    ]).value;
    this.reportParameters2 = new Object();
    this.reportParameters2.awb = x;
    this.reportWindow2.open();



  }
}