import { error } from 'protractor';
import { Validators } from '@angular/forms';
import {
  NgcPage
  , NgcFormGroup
  , NgcFormControl
  , NgcFormArray
  , NgcButtonComponent
  , NgcWindowComponent
  , PageConfiguration
  , NgcUtility,
  NgcDataTableComponent
} from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { BuildupService } from './../buildup.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-uld-details',
  templateUrl: './uld-details.component.html',
  styleUrls: ['./uld-details.component.scss']
})

@PageConfiguration({
  trackInit: true,
  //autoBackNavigation: true,
  //restorePageOnBack: true
})
export class UldDetailsComponent extends NgcPage {
  fromFlightList: boolean = false;
  dlsFalg: boolean = false;
  navigatedDataUldFlightInfo: any;
  response: any;
  groupedData: any = [];
  term: any;
  additionalInfoForReturnFlag: boolean;
  hasReadPermission: boolean = false;
  isactiveByDefault: boolean = false;
  isactiveByUld: boolean = false;
  isactiveByHeight: boolean = false;
  isactiveByAllotment: boolean = false;

  // notReleasedCheckBox
  @ViewChild('uldDetailsWindow') uldDetailsWindow: NgcWindowComponent;
  @ViewChild('osiWindow') osiWindow: NgcWindowComponent;
  @ViewChild('windowPrinter') windowPrinter: NgcWindowComponent;
  @ViewChild('releasedtable') releasetable: NgcDataTableComponent;
  popupPrinterForm: NgcFormGroup = new NgcFormGroup({
    printerdropdown: new NgcFormControl(),
  });
  private uldDetailsForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    flight: new NgcFormControl(),
    flightId: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    dateStd: new NgcFormControl(),
    dateEtd: new NgcFormControl(),
    std: new NgcFormControl(),
    etd: new NgcFormControl(),
    terminals: new NgcFormControl(),
    bay: new NgcFormControl(),
    uld: new NgcFormControl(),
    trolley: new NgcFormControl(),
    status: new NgcFormControl(),
    dlsFinalizeAt: new NgcFormControl(),
    dlsVersion: new NgcFormControl(),
    aircraftType: new NgcFormControl(),
    finalizeStatus: new NgcFormControl(),
    // dlsVersion: new NgcFormControl(),
    releasedTrolleyList: new NgcFormArray([]),
    notReleasedTrolleyList: new NgcFormArray([]),
    additionalInfo: new NgcFormArray([]),
    airlineLoadingInstructions: new NgcFormArray([]),
    additionalInfoForReturn: new NgcFormArray([]),
    aliDetails: new NgcFormGroup({
      totalTrollies: new NgcFormControl(0),
      remainingTrollies: new NgcFormControl(0),
      usedTrollies: new NgcFormControl(0),
      palletsforFlight: new NgcFormControl(0),
      containerForFlight: new NgcFormControl(0),
      palletsForCargo: new NgcFormControl(0),
      containersForCargo: new NgcFormControl(0),
      palletsUsedForCargo: new NgcFormControl(0),
      containersUsedForCargo: new NgcFormControl(0),
      palletsUsed: new NgcFormControl(0),
      containersUsed: new NgcFormControl(0),
      remainingPallets: new NgcFormControl(0),
      remainingContainers: new NgcFormControl(0),
      remainingPalletsUsedForCargo: new NgcFormControl(0),
      remainingContainerUsedForCargo: new NgcFormControl(0)
    }),
    osiRemarks: new NgcFormControl(),
    uldtypeali: new NgcFormArray([
      new NgcFormGroup({
        uldType: new NgcFormControl([]),
        totalUldType: new NgcFormControl([]),
        uldTypeUsed: new NgcFormControl([]),
        remainingUldType: new NgcFormControl([])
      })
    ]),
    heighttypeali: new NgcFormArray([
      new NgcFormGroup({
        heightCode: new NgcFormControl([]),
        totalHeightType: new NgcFormControl([]),
        heightTypeUsed: new NgcFormControl([]),
        remainingHeightType: new NgcFormControl([])
      })
    ]),
    allotmenttypeali: new NgcFormArray([
      new NgcFormGroup({
        allotmentType: new NgcFormControl([]),
        totalAllotment: new NgcFormControl([]),
        usedAllotment: new NgcFormControl([]),
        remainingAllotmentType: new NgcFormControl([])
      })
    ]),
  });

  private uldReleasedDetailsForm: NgcFormGroup = new NgcFormGroup({
    containerTrolleyNumber: new NgcFormControl(),
    releasedDate: new NgcFormControl(),
    releasedUser: new NgcFormControl(),
    driverId: new NgcFormControl(),
    shc: new NgcFormControl(),
    handlingArea: new NgcFormControl(),
    bay: new NgcFormControl()
  });
  requestData: any;
  request1: any;
  terminalToSendBack: any;
  toDate: any;
  FromDate: any;
  navigatedDataFromFlightList: any;
  additionalInfoFlag: boolean = false;
  navigateOrNot: boolean = false;
  std: any;
  showDateFlag: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private _buildupService: BuildupService, private toRoute: Router
    , private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.additionalInfoFlag = false;
    this.additionalInfoForReturnFlag = false;
    if (this._buildupService.requestUld) {
      this.requestData = this._buildupService.requestUld;
      this.requestData.forEach(element => {
        this.uldDetailsForm.get('flight').setValue(element.flight);
        this.uldDetailsForm.get('flightKey').setValue(element.flight);

        this.uldDetailsForm.get('flightId').setValue(element.flightId);
        this.uldDetailsForm.get('flightDate').setValue(element.date);
        this.uldDetailsForm.get('std').setValue(element.sta);
        this.uldDetailsForm.get('terminals').setValue(element.terminalPoint);
        this.uldDetailsForm.get('bay').setValue(element.bay);

        this.request1 = this.uldDetailsForm.getRawValue();
      });
      this.fromFlightList = true;
      this.navigatedDataFromFlightList = this.getNavigateData(this.activatedRoute);

      this._buildupService.fetchUldDetails(this.request1).subscribe(data => {
        this.refreshFormMessages(data);
        this.response = data.data;

        if (data.success) {
          this.uldDetailsForm.patchValue(this.response);
          this.uldDetailsForm.get('aliDetails').patchValue(this.response.aliDetails);
          this.uldDetailsForm.get('osiRemarks').patchValue(this.response.osiRemarks);
          this.isactiveByUld = this.response.activeTab.activeByULD;
          this.isactiveByDefault = this.response.activeTab.activeByDefault;
          this.isactiveByHeight = this.response.activeTab.activeByHeight;
          this.isactiveByAllotment = this.response.activeTab.activeByAllotment;
          this.uldDetailsForm.get('uldtypeali').patchValue(this.response.activeTab.uldTypeAliAssignUld);
          this.uldDetailsForm.get('heighttypeali').patchValue(this.response.activeTab.heightTypeAliAssignUld);
          this.uldDetailsForm.get('allotmenttypeali').patchValue(this.response.activeTab.allotmentTypeAliAssignUld);
          console.log(this.uldDetailsForm.get('uldtypeali').value);
          if (this.response.dlsCompletedAt != null) {
            this.dlsFalg = true;
          }
          this.navigateOrNot = true;
          //For ETD
          if (this.response.showDateFlag) {
            this.showDateFlag = true;
            this.uldDetailsForm.get('dateEtd').setValue(this.response.dateEtd);
          }
          else {
            this.uldDetailsForm.get('etd').setValue(NgcUtility.getTimeAsString(NgcUtility.getDateTime(this.response.dateEtd)));
          }
          // this.uldDetailsForm.get('std').setValue(this.response.dateStd);
          // this.uldDetailsForm.get('etd').setValue(this.response.dateEtd);
          if (this.response.uldRemovedFromDlsIndicator) {
            this.showMessage(this.response.uldRemovedFromDlsIndicator);
          }
          this.uldDetailsForm.get('dlsVersion').setValue(this.response.dlsVersion);
          if(this.response.dlsVersion && this.response.dlsVersion > 0){
            this.uldDetailsForm.get('finalizeStatus').setValue('SENT');
          }
          this.uldDetailsForm.get('aircraftType').setValue(this.response.aircraftType);
          this.uldDetailsForm.get('trolley').setValue(this.response.bulk);
          this.uldDetailsForm.get('releasedTrolleyList').patchValue(this.response.releasedTrolleyList);
          this.uldDetailsForm.get('notReleasedTrolleyList').patchValue(this.response.notReleasedTrolleyList);
          (<NgcFormArray>this.uldDetailsForm.get('notReleasedTrolleyList')).getRawValue().forEach(element => {
            element.notReleasedCheckBox = false;
          });
          if (this.response.additionalInfo != null && this.response.additionalInfo.length > 0) {
            this.additionalInfoFlag = true;
            this.uldDetailsForm.get('additionalInfo').patchValue(this.response.additionalInfo);
          }
          if (this.response.additionalInfoForReturn != null && this.response.additionalInfoForReturn.length > 0) {
            this.additionalInfoForReturnFlag = true;
            this.uldDetailsForm.get('additionalInfoForReturn').patchValue(this.response.additionalInfoForReturn);
          }
          this.showSuccessStatus('g.completed.successfully');
        } else {
          this.showSuccessStatus('NO_RECORDS_EXIST');
        }
      }, error => {
        this.showErrorMessage('g.not.able.to.connect');
      });
      this._buildupService.requestUld = null;
    } else {
      this.navigatedDataUldFlightInfo = this.getNavigateData(this.activatedRoute);
      // this.navigatedDataUldFlightInfo;
      this.uldDetailsForm.get('flight').setValue(this.navigatedDataUldFlightInfo.flightKey);
      this.uldDetailsForm.get('flightDate').setValue(this.navigatedDataUldFlightInfo.flightDate);
      this.uldDetailsForm.get('terminals').setValue(this.navigatedDataUldFlightInfo.terminals);
      this.uldDetailsForm.get('bay').setValue(this.navigatedDataUldFlightInfo.bay);
      this.uldDetailsForm.get('uld').setValue(this.navigatedDataUldFlightInfo.uld);
      this.uldDetailsForm.get('trolley').setValue(this.navigatedDataUldFlightInfo.bulk);
      this.uldDetailsForm.get('dlsFinalizeAt').setValue(this.navigatedDataUldFlightInfo.dlsCompletedAt);
      if (this.navigatedDataUldFlightInfo.dlsCompletedAt != null) {

      }
      // if (this.navigatedDataUldFlightInfo.dlsCompletedAt != null || this.navigatedDataUldFlightInfo.dlsCompletedAt != undefined) {
      //   this.uldDetailsForm.get('status').setValue('DLS Completed');
      // }
      this.toDate = this.navigatedDataUldFlightInfo.toDateTime;
      this.FromDate = this.navigatedDataUldFlightInfo.fromDateTime;
      this.terminalToSendBack = this.navigatedDataUldFlightInfo.terminal;
      this.term = this.navigatedDataUldFlightInfo.terminals;
      let request = {
        flightKey: this.navigatedDataUldFlightInfo.flightKey,
        flightDate: this.navigatedDataUldFlightInfo.flightDate
      };


      this._buildupService.fetchUldDetails(request).subscribe(data => {
        this.refreshFormMessages(data);
        this.response = data.data;
        if (data.success) {
          this.uldDetailsForm.patchValue(this.response);
          if (this.response.dlsCompletedAt != null) {
            this.uldDetailsForm.get('dlsFinalizeAt').setValue(this.response.dlsCompletedAt);
            this.dlsFalg = true;
          }
          //For ETD
          if (this.response.showDateFlag) {
            this.showDateFlag = true;
            this.uldDetailsForm.get('dateEtd').setValue(this.response.dateEtd);
          }
          else {
            this.uldDetailsForm.get('etd').setValue(NgcUtility.getTimeAsString(NgcUtility.getDateTime(this.response.dateEtd)));
          }
          this.std = this.uldDetailsForm.get('std').value;
          // this.uldDetailsForm.get('std').setValue(this.response.dateStd);
          // this.uldDetailsForm.get('etd').setValue(this.response.dateEtd);
          this.uldDetailsForm.get('osiRemarks').patchValue(this.response.osiRemarks);
          this.uldDetailsForm.get('aliDetails').patchValue(this.response.aliDetails);
          this.uldDetailsForm.get('dlsVersion').setValue(this.response.dlsVersion);
          if(this.response.dlsVersion && this.response.dlsVersion > 0){
            this.uldDetailsForm.get('finalizeStatus').setValue('SENT');
          }
          this.uldDetailsForm.get('aircraftType').setValue(this.response.aircraftType);
          this.uldDetailsForm.get('uld').setValue(this.response.uld);
          this.uldDetailsForm.get('trolley').setValue(this.response.bulk);
          this.uldDetailsForm.get('releasedTrolleyList').patchValue(this.response.releasedTrolleyList);
          this.uldDetailsForm.get('notReleasedTrolleyList').patchValue(this.response.notReleasedTrolleyList);
          if (this.response.activeTab != null) {
            this.isactiveByUld = this.response.activeTab.activeByULD;
            this.isactiveByDefault = this.response.activeTab.activeByDefault;
            this.isactiveByHeight = this.response.activeTab.activeByHeight;
            this.isactiveByAllotment = this.response.activeTab.activeByAllotment;
            this.uldDetailsForm.get('uldtypeali').patchValue(this.response.activeTab.uldTypeAliAssignUld);
            this.uldDetailsForm.get('heighttypeali').patchValue(this.response.activeTab.heightTypeAliAssignUld);
            this.uldDetailsForm.get('allotmenttypeali').patchValue(this.response.activeTab.allotmentTypeAliAssignUld);
            console.log(this.uldDetailsForm.get('uldtypeali').value);
          } else {
            this.isactiveByDefault = true;
          }
          if (this.uldDetailsForm.get('terminals').value == null || this.uldDetailsForm.get('terminals').value == undefined) {
            this.uldDetailsForm.get('terminals').setValue((this.getUserProfile().terminalId));
          }
          (<NgcFormArray>this.uldDetailsForm.get('notReleasedTrolleyList')).getRawValue().forEach(element => {
            element.notReleasedCheckBox = false;
          });
          if (this.response.additionalInfo != null && this.response.additionalInfo.length > 0) {
            this.additionalInfoFlag = true;
            this.uldDetailsForm.get('additionalInfo').patchValue(this.response.additionalInfo);
          }
          if (this.response.additionalInfoForReturn != null && this.response.additionalInfoForReturn.length > 0) {
            this.additionalInfoForReturnFlag = true;
            this.uldDetailsForm.get('additionalInfoForReturn').patchValue(this.response.additionalInfoForReturn);
          }
          if (this.response.uldRemovedFromDlsIndicator) {
            this.showMessage(this.response.uldRemovedFromDlsIndicator);
          }
          this.showSuccessStatus('g.completed.successfully');
        } else {
          this.showSuccessStatus('NO_RECORDS_EXIST');
        }
      }, error => {
        this.showErrorMessage('g.not.able.to.connect');
      });
    }

    this.hasReadPermission = NgcUtility.hasReadPermission('RAMP_FLIGHT_ULD_DETAILS');
  }

  // Get the details for Not Released ULD/Trolley
  // public onNotReleasedDetails(event) {
  //   console.log(event);
  //   this.uldDetailsWindow.open();
  // }

  // Get the details for Released ULD/Trolley
  public onReleasedDetails(index) {
    console.log(this.response.releasedTrolleyList[index].containerTrolleyNumber);
    this.uldReleasedDetailsForm.patchValue(this.response.releasedTrolleyList[index]);
    // this.uldReleasedDetailsForm.get('bay').setValue(this.uldDetailsForm.get('bay').value);
    this.uldDetailsWindow.open();
  }

  public onGroup() {
    // api/ulddetails/group
    let selectedRowCount = true;
    this.groupedData = new Array();
    const selectRow = (<NgcFormArray>this.uldDetailsForm.get('notReleasedTrolleyList')).getRawValue();
    for (const eachRowData of selectRow) {
      if (eachRowData.notReleasedCheckBox) {
        this.groupedData.push(eachRowData);
        selectedRowCount = false;
      }
    }

    if (selectedRowCount) {
      this.showErrorMessage('export.select.checkbox.grouping');
      return;
    }

    this.groupedData.forEach(element => {
      element.flightKey = this.uldDetailsForm.get('flight').value;
      element.flightDate = this.uldDetailsForm.get('flightDate').value;
      element.terminal = this.uldDetailsForm.get('terminals').value;
    });

    const reqObj = this.uldDetailsForm.getRawValue();
    reqObj.std = null;
    reqObj.etd = null;
    reqObj.notReleasedTrolleyList = this.groupedData;
    console.log(JSON.stringify(reqObj));
    this._buildupService.groupUldTrolley(reqObj).subscribe(data => {
      this.showResponseErrorMessages(data);
      this.response = data.data;
      //this.showResponseErrorMessages(data);
      this.serachUldDetails();
      if (data.success) {
        this.showSuccessStatus('export.grouped.successfully');
      }
    }, error => {
      this.showErrorMessage('export.not.able.to.connect');
    });
  }

  public onUnGroup() {
    let selectedRowCount = true;
    this.groupedData = new Array();
    const selectRow = (<NgcFormArray>this.uldDetailsForm.get('notReleasedTrolleyList')).getRawValue();
    for (const eachRowData of selectRow) {
      if (eachRowData.notReleasedCheckBox) {
        this.groupedData.push(eachRowData);
        selectedRowCount = false;
      }
    }

    if (selectedRowCount) {
      this.showErrorMessage('export.select.checkbox.ungrouping');
      return;
    }

    this.groupedData.forEach(element => {
      element.flightKey = this.uldDetailsForm.get('flight').value;
      element.flightDate = element.flightDate = this.uldDetailsForm.get('flightDate').value;
    });

    const reqObj = this.uldDetailsForm.getRawValue();
    reqObj.std = null;
    reqObj.etd = null;
    reqObj.notReleasedTrolleyList = this.groupedData;
    this._buildupService.unGroupUldTrolley(reqObj).subscribe(data => {
      this.showResponseErrorMessages(data);
      this.response = data.data;
      //this.showResponseErrorMessages(data);
      if (data.success) {
        this.showSuccessStatus('export.ungrouped.successfully');
        this.serachUldDetails();
      }
    }, error => {
      this.showErrorMessage('export.not.able.to.connect');
    });

  }

  serachUldDetails() {

    //const reqObjForDetails = this.navigatedDataUldFlightInfo;

    const reqObjForDetails = this.uldDetailsForm.getRawValue();
    reqObjForDetails.flightKey = this.uldDetailsForm.get('flight').value;
    reqObjForDetails.std = null;
    reqObjForDetails.etd = null;
    this._buildupService.fetchUldDetails(reqObjForDetails).subscribe(data => {
      this.refreshFormMessages(data);
      this.response = data.data;
      if (data.success) {
        this.uldDetailsForm.get('releasedTrolleyList').patchValue(this.response.releasedTrolleyList);
        this.uldDetailsForm.get('notReleasedTrolleyList').patchValue(this.response.notReleasedTrolleyList);
        // (<NgcFormArray>this.uldDetailsForm.get('notReleasedTrolleyList')).getRawValue().forEach(element => {
        //   element.notReleasedCheckBox = true;
        // });
      }
    }, error => {
      this.showErrorMessage('g.not.able.to.connect');
    });
  }
  public onCancel(event) {
    if (this.fromFlightList) {
      if (this.navigatedDataFromFlightList.fromMyFlight != undefined && this.navigatedDataFromFlightList.fromMyFlight != null
        && this.navigatedDataFromFlightList.fromMyFlight == true) {
        let tranferData = {
          value: this.navigatedDataFromFlightList.searchData.value,
          userId: this.navigatedDataFromFlightList.searchData.userId,
          dateFrom: this.navigatedDataFromFlightList.searchData.dateFrom,
          terminalPoint: this.navigatedDataFromFlightList.searchData.terminalPoint,
          flight: this.navigatedDataFromFlightList.searchData.flight,
          flightListData: this.navigatedDataFromFlightList
        }
        this.navigateTo(this.toRoute, '/export/buildup/myflight', tranferData);
      }
      else {
        let tranferData = {
          dateFrom: this.navigatedDataFromFlightList.dateFrom,
          dateTo: this.navigatedDataFromFlightList.dateTo,
          terminalPoint: this.navigatedDataFromFlightList.terminalPoint
        }
        this.navigateTo(this.toRoute, '/export/buildup/flightlist', tranferData);
      }

    }
    else {
      if (this.navigatedDataUldFlightInfo != null && this.navigatedDataUldFlightInfo != undefined) {
        if (this.navigatedDataUldFlightInfo.navigatedDataFromFlightList != null && this.navigatedDataUldFlightInfo.navigatedDataFromFlightList != undefined) {
          if (this.navigatedDataUldFlightInfo.navigatedDataFromFlightList.fromMyFlight != null && this.navigatedDataUldFlightInfo.navigatedDataFromFlightList.fromMyFlight != undefined) {
            this.navigateTo(this.toRoute, '/export/buildup/myflight', this.navigatedDataUldFlightInfo.navigatedDataFromFlightList.searchData);
          } else {
            this.navigateTo(this.toRoute, '/export/buildup/flightlist', this.navigatedDataUldFlightInfo.navigatedDataFromFlightList);
          }

        }

        else {
          const passdata = {
            terminalFromNavigate: this.terminalToSendBack,
            term: this.term,
            toDateTime: this.toDate,
            fromDateTime: this.FromDate,
            flightKey: null,
            flightDate: null
          }
          if (this.navigatedDataUldFlightInfo) {
            passdata.flightKey = this.navigatedDataUldFlightInfo.flightKey;
            passdata.flightDate = this.navigatedDataUldFlightInfo.flightDate;
          }
          this.navigateTo(this.toRoute, '/export/buildup/uldsummary', passdata);
        }
      }
    }

  }


  //ramp release navigation
  onRampRelease() {
    let formData = this.uldDetailsForm.getRawValue();
    formData.std = this.std;
    formData.etd = null;
    let NotReleasedUld = formData.notReleasedTrolleyList;
    let groupFliteredArray = NotReleasedUld.filter(uld => uld.group != null)
    if (groupFliteredArray != null && groupFliteredArray != undefined && groupFliteredArray.length > 0) {

    }
    else {
      this.showErrorMessage("export.group.uld.to.release");
    }
    let selectedUldToMove = groupFliteredArray.filter(uld => uld.notReleasedCheckBox == true);

    let sameGroupFliteredUlds = selectedUldToMove;
    if (selectedUldToMove == null || selectedUldToMove == undefined || selectedUldToMove.length < 1) {
      this.showErrorMessage("export.select.grouped.ulds.to.release");
    }
    else {

      let group = selectedUldToMove[0].group;
      let flag = false;
      for (let i = 0; i < selectedUldToMove.length; i++) {
        if (group != selectedUldToMove[i].group) {
          flag = true;
          break;
        }
      }
      if (flag) {
        this.showErrorMessage("export.select.uld.same.group.uld");
        return;
      }
      else {
        sameGroupFliteredUlds = [];
        sameGroupFliteredUlds = groupFliteredArray.filter(t => {
          if (t.group == group) {
            return t;
          }
        });
        console.log("sameGroupFliteredUlds", sameGroupFliteredUlds);
      }
      let navigate;
      if (this.navigateOrNot) {
        navigate = false;
      }
      else {
        navigate = true;
      }
      let navigateObj = {
        navigatedDataUldFlightInfo: this.navigatedDataUldFlightInfo,
        flight: this.uldDetailsForm.get('flight').value,
        flightDate: this.uldDetailsForm.get('flightDate').value,
        bay: this.uldDetailsForm.get('bay').value,
        releasedTrolleyList: sameGroupFliteredUlds,
        handlingArea: this.uldDetailsForm.get('terminals').value,
        tripId: selectedUldToMove[0].group,
        std: this.uldDetailsForm.get('std').value,
        etd: this.uldDetailsForm.get('dateEtd').value,
        fromUldDetails: navigate,
        toDate: this.toDate,
        fromDate: this.FromDate,
        terminalFromNavigate: this.terminalToSendBack,
        showDateFlag: this.showDateFlag,
        navigatedDataFromFlightList: this.navigatedDataFromFlightList
      }
      this.navigateTo(this.toRoute, "export/buildup/ramprelease", navigateObj);
    }

  }

  onSelectCheckBox(event) {
    console.log("event", event);
    let data = this.uldDetailsForm.get(["notReleasedTrolleyList", +event.record.NGC_ROW_ID, "group"]).value;
    let flag = this.uldDetailsForm.get(["notReleasedTrolleyList", +event.record.NGC_ROW_ID, "notReleasedCheckBox"]).value;
    console.log("event", data);
    if (flag == true && data != null) {
      let formArray = this.uldDetailsForm.getRawValue();
      formArray.notReleasedTrolleyList.forEach(t => {
        if (t.group == data)
          t.notReleasedCheckBox = true;
      });
      this.uldDetailsForm.get('notReleasedTrolleyList').patchValue(formArray.notReleasedTrolleyList);

    }

  }

  viewOsiRemarks() {
    this.osiWindow.open();
  }

  releaseEvent(event) {
    if (event.index == 1) {
      this.releasetable.render();
    }

  }
  rePrintRelease() {
    let uldDetailsObject = this.uldDetailsForm.getRawValue();
    let filterreleasedArray = uldDetailsObject.releasedTrolleyList.filter(t => {
      if (t.releasedCheckBox == true) {
        return t;
      }
    });
    let uldListWithourSelection = uldDetailsObject.releasedTrolleyList.filter(t => {
      if (t.releasedCheckBox == false) {
        return t;
      }
    });
    if (filterreleasedArray == null || filterreleasedArray.length < 1) {
      this.showErrorMessage("export.select.uld.to.print");
      return;
    }
    else {
      let group = filterreleasedArray[0].group;
      let driverId = filterreleasedArray[0].driverId;
      // check if not grouped  and length is greater than 1 resrict USer to reprint
      if ((group == null || group == undefined) && filterreleasedArray.length > 1) {
        this.showErrorMessage("export.one.ungrouped.uld.reprinted.at.a.time");
        return;
      }
      let flag = false;
      for (let i = 0; i < filterreleasedArray.length; i++) {
        if (driverId != filterreleasedArray[i].driverId) {
          flag = true;
          break;
        }
      }
      if (flag) {
        this.showErrorMessage("export.select.ulds.of.same.driverid");
        return;
      }

      // check for same driver id and prompt confirmation
      let filteredUldArrayBasedOnDriverId = uldListWithourSelection.filter(t => {
        if (t.driverId == filterreleasedArray[0].driverId) {
          return t;
        }
      });
      if (filteredUldArrayBasedOnDriverId != null && filteredUldArrayBasedOnDriverId.length > 0) {
        this.showConfirmMessage('export.uld.with.same.driverId.confirmation').then(fullfilled => {
          let patchUldArray = uldDetailsObject.releasedTrolleyList.map(t => {
            if (t.driverId == filterreleasedArray[0].driverId) {
              t.releasedCheckBox = true;
            }
            return t;
          });
          this.uldDetailsForm.get('releasedTrolleyList').patchValue(patchUldArray);
          // now Call reprint serviceFor Printing
          this.windowPrinter.open();
        }).catch(reason => {
          // now Call reprint serviceFor Printing
          this.windowPrinter.open();
        }
        );
      }
      else {
        this.windowPrinter.open();
      }

    }

  }

  onSelectReleasedCheckBox(event) {
    console.log("event", event);
    let data = this.uldDetailsForm.get(["releasedTrolleyList", +event.record.NGC_ROW_ID, "group"]).value;
    let flag = this.uldDetailsForm.get(["releasedTrolleyList", +event.record.NGC_ROW_ID, "releasedCheckBox"]).value;
    if (flag == true && data != null) {
      let formArray = this.uldDetailsForm.getRawValue();
      formArray.releasedTrolleyList.forEach(t => {
        if (t.group == data)
          t.releasedCheckBox = true;
      });
      this.uldDetailsForm.get('releasedTrolleyList').patchValue(formArray.releasedTrolleyList);
    }
  }
  printHandover() {
    this.windowPrinter.hide();
    if (this.popupPrinterForm.get("printerdropdown").value == null) {
      this.showErrorStatus("expaccpt.select.printer.and.proceed");
    }
    else {
      let printerName = this.popupPrinterForm.get("printerdropdown").value;
      //BuildObject For Printing
      let uldDetailsObject = this.uldDetailsForm.getRawValue();
      let filterreleasedArray = uldDetailsObject.releasedTrolleyList.filter(t => {
        if (t.releasedCheckBox == true) {
          return t;
        }
      });
      this.commonRampReprintMethod(printerName, filterreleasedArray, uldDetailsObject);
    }
  }
  //common method to call reprint 
  commonRampReprintMethod(printerName: any, filterreleasedArray: any, uldDetailsObject: any) {
    let handOverContainerTrolley = filterreleasedArray.map(t => {
      let obj = {
        containertrolleynumber: t.containerTrolleyNumber,
        flightKey: uldDetailsObject.flightKey,
        date: uldDetailsObject.flightDate,
        pieces: t.noOfBags,
        remarks: t.remarks
      }
      return obj;
    });
    let obj = {
      printerName: printerName,
      fromReprint: true,
      flightKey: uldDetailsObject.flightKey,
      startedat: uldDetailsObject.dateStd,
      releaseDateTime: NgcUtility.getDateTime(filterreleasedArray[0].releasedDate),
      bay: uldDetailsObject.bay,
      driverId: filterreleasedArray[0].driverId,
      handOverContainerTrolley: handOverContainerTrolley
    }
    this._buildupService.reprint(obj).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('export.print.successfully');
      }
      else {
        this.showResponseErrorMessages(response);
      }
    });
  }
  offloadHandover() {
    let uldDetailsObject = this.uldDetailsForm.getRawValue();
    let checkOffloadOrReturned = uldDetailsObject.releasedTrolleyList.filter(t => {
      if ((t.offloadFlag == true || t.returnFlag == true) && t.releasedCheckBox == true) {
        return t;
      }
    });
    if (checkOffloadOrReturned && checkOffloadOrReturned.length >= 1) {
      this.showErrorMessage("export.select.non.offloaded.returned.ulds.bts");
      return;
    }
    let filterreleasedArray = uldDetailsObject.releasedTrolleyList.filter(t => {
      if (t.releasedCheckBox == true) {
        return t;
      }
    });
    if (filterreleasedArray == null || filterreleasedArray.length < 1) {
      this.showErrorMessage("export.select.atleast.one.uld.bt.to.perform.offload.handover");
      return;
    }
    else {
      let offloadHandOverUlds = filterreleasedArray.map(t => {
        let obj = {
          driverId: null,
          flightKey: uldDetailsObject.flightKey,
          flightDate: uldDetailsObject.dateStd,
          std: NgcUtility.getTimeAsString(NgcUtility.getDateTime(uldDetailsObject.dateStd)),
          etd: uldDetailsObject.dateEtd,
          uldNumber: t.containerTrolleyNumber,
          shc: t.shc,
          reason: null,
          handCarry: false,
          handlingArea: t.handlingArea,
          showDateFlag: this.showDateFlag
        };
        return obj;
      })
      let navigateObj = {
        driverId: offloadHandOverUlds[0].driverId,
        flightKey: this.uldDetailsForm.get('flight').value,
        flightDate: this.uldDetailsForm.get('flightDate').value,
        handlingArea: this.uldDetailsForm.get('terminals').value,
        toDateTime: this.toDate,
        fromDateTime: this.FromDate,
        terminalToSendBack: this.terminalToSendBack,
        offloadHandOverUlds: offloadHandOverUlds
      }
      this.navigateTo(this.toRoute, "export/buildup/offloadhandover", navigateObj);
    }

  }
  returnToWareHouse() {
    let uldDetailsObject = this.uldDetailsForm.getRawValue();
    let checkOffload = uldDetailsObject.releasedTrolleyList.filter(t => {
      if ((t.offloadFlag == true || t.returnFlag == true) && t.releasedCheckBox == true) {
        return t;
      }
    });
    if (checkOffload && checkOffload.length >= 1) {
      this.showErrorMessage("export.select.non.offloaded.returned.ulds.bts");
      return;
    }
    let filterreleasedArray = uldDetailsObject.releasedTrolleyList.filter(t => {
      if (t.releasedCheckBox == true) {
        return t;
      }
    });
    if (filterreleasedArray == null || filterreleasedArray.length < 1) {
      this.showErrorMessage("export.select.one.uld.bt.for.return.warehouse");
      return;
    }
    else {
      let offloadHandOverUlds = filterreleasedArray.map(t => {
        let obj = {
          driverId: null,
          flightKey: uldDetailsObject.flightKey,
          flightDate: uldDetailsObject.dateStd,
          std: NgcUtility.getTimeAsString(NgcUtility.getDateTime(uldDetailsObject.dateStd)),
          etd: uldDetailsObject.dateEtd,
          uldNumber: t.containerTrolleyNumber,
          shc: t.shc,
          reason: null,
          handCarry: false,
          handlingArea: t.handlingArea,
          showDateFlag: this.showDateFlag
        };
        return obj;
      })
      let navigateObj = {
        driverId: offloadHandOverUlds[0].driverId,
        flightKey: this.uldDetailsForm.get('flight').value,
        flightDate: this.uldDetailsForm.get('flightDate').value,
        handlingArea: this.uldDetailsForm.get('terminals').value,
        toDateTime: this.toDate,
        fromDateTime: this.FromDate,
        terminalToSendBack: this.terminalToSendBack,
        offloadHandOverUlds: offloadHandOverUlds
      }
      this.navigateTo(this.toRoute, "export/buildup/returntowarehouse", navigateObj);
    }
  }
}
