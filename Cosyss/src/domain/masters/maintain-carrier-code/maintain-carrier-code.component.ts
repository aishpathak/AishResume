import { forEach } from '@angular/router/src/utils/collection';
import { NgcFormControl, NgcUtility } from 'ngc-framework';
import { CarrierCodeUpdateRequest, AwbPrefixListRequest } from './../masters.sharedmodel';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcDropDownComponent, PageConfiguration } from 'ngc-framework';
import { Validators, PatternValidator } from '@angular/forms';
import { MastersService } from '../masters.service';
import { Router } from '@angular/router';
import {
  CarrierCodeDetailsRequest, CarrierCodeDetailsResponse, CarrierCodeSearchRequest, CarrierCodeSearchResponse,
  CarrierCodeUpdateResponse, CarrierPrefix, CarrierCodeDeleteRequest, AwbPrefixRequest
} from '../masters.sharedmodel';
import { ServicesProvided } from '../../flight/flight.sharedmodel';

/**
 * Airline Master Maintain Carrier Code
 */
@Component({
  selector: 'ngc-maintain-carrier-code',
  templateUrl: './maintain-carrier-code.component.html',
  styleUrls: ['./maintain-carrier-code.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class MaintainCarrierCodeComponent extends NgcPage {
  lovValue: string;
  parameter: {
  };
  @ViewChild("goTo") goTo: any;
  @ViewChild('window') window: NgcWindowComponent;
  @ViewChild('awbWindow') awbWindow: NgcWindowComponent;
  @ViewChild('editWindow') editWindow: NgcWindowComponent;
  @ViewChild('awbDropDown') awbDropDown: NgcDropDownComponent;
  @ViewChild('partBookingWindow') partBookingWindow: NgcWindowComponent;
  @ViewChild('bubdOfficeWindow') bubdOfficeWindow: NgcWindowComponent;
  requestToPartBooking: any;
  columnName: String = 'edit';
  displayAddEditForm: boolean;
  updateFormData: boolean;
  addFormData: boolean;
  resp: any;
  disableControls: any[] = [];
  awbArray: any[];
  showTable: boolean;
  awbValue: any;
  responseArray: any;
  awbPrefixList: any[] = [];
  errors: any[];
  CarrierCode: string;
  carrierCodeToDisplay: any;
  isBuBdOfficeHidden: boolean = true;
  disabledBuBdOfficeSave: boolean;

  private carrierCodeForm: NgcFormGroup = new NgcFormGroup({
    carrierCodeValue: new NgcFormControl(),
    carrierName: new NgcFormControl(),
    iataFlag: new NgcFormControl(),
    cargoIqFlag: new NgcFormControl(),
    pwgInd: new NgcFormControl(),
    notocFormat: new NgcFormControl(),
    volumeFlag: new NgcFormControl(),
    autoFlightFlag: new NgcFormControl(),
    messageSequenceFlag: new NgcFormControl(),
    // form array to handle table data
    carrierCodeList: new NgcFormArray([
    ]),
    // form array to handle setup part booking data
    partBookingList: new NgcFormArray([
      new NgcFormGroup({
        partBookingCarrier: new NgcFormControl(),
        crossBookingFlag: new NgcFormControl(),
        crossBookCarrier: new NgcFormControl(),
        startPrefix: new NgcFormControl(),
        endPrefix: new NgcFormControl(),
        primaryIdentifier: new NgcFormControl(),
        excludePrefix: new NgcFormControl(),
      })
    ]),
    // Form Array to manage Awbprefix
    awBPrefixList: new NgcFormArray([
    ]),
    // controls for adding and updating carrier code records
    carrierCode: new NgcFormControl(),
    carrierShortName: new NgcFormControl('', [Validators.maxLength(65)]),
    carrierAWBPrefix: new NgcFormControl(),
    assistedCarrierFlag: new NgcFormControl(),
    logo: new NgcFormControl(),
    imagePath: new NgcFormControl(),
    awbPrefix: new NgcFormControl(),
    dlsWeightUnit: new NgcFormControl(),
    mailHandler: new NgcFormControl(),
    bubdOfficeList: new NgcFormArray([
      new NgcFormGroup({
        carrierCode: new NgcFormControl(),
        flightType: new NgcFormControl(),
        buBdOffice: new NgcFormControl()
      })
    ])
  });

  /**
   * Initialize
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private masterCarrierCodeService: MastersService, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  /**
   * On Intialization
   */
  ngOnInit() {
    super.ngOnInit();
    this.showTable = false;
    this.parameter = this.createSourceParameter(',');
    if (NgcUtility.isEntityAttributeEnabled("Flight.BuBdOffice")) {
      this.isBuBdOfficeHidden = false;
      this.disabledBuBdOfficeSave = false;
    }
  }

  /**
   * Function to get all records for table
   */
  getCarrierCodeData() {
    const carrierCodeDetails: CarrierCodeDetailsRequest = new CarrierCodeDetailsRequest();
    this.masterCarrierCodeService.fetchCarrierCodeDetails(carrierCodeDetails).subscribe(data => {
      this.resp = data;
      this.responseArray = this.resp.data;
      if (this.responseArray.length > 0) {
        this.masterCarrierCodeService.abWPrefixList(carrierCodeDetails).subscribe(data => {
          this.awbValue = data;
          this.awbArray = this.awbValue.data;
          for (let i = 0; i < this.responseArray.length; i++) {
            if (this.awbArray.length !== 0) {
              for (let index = 0; index < this.awbArray.length; index++) {
                if (this.awbArray[index].flagIATA === 1) {
                  this.responseArray[i]['awbPrefix'] = this.awbArray[index]['awbPrefix'];
                  (<NgcFormArray>this.carrierCodeForm.get('carrierCodeList')).patchValue(this.responseArray);
                  break;
                } else {
                  this.responseArray[i]['awbPrefix'] = this.awbArray[0]['awbPrefix'];
                  (<NgcFormArray>this.carrierCodeForm.get('carrierCodeList')).patchValue(this.responseArray);
                }
              }
            } else {
              this.responseArray[i]['awbPrefix'] = 'awbPrefix';
              (<NgcFormArray>this.carrierCodeForm.get('carrierCodeList')).patchValue(this.responseArray);
            }
          }
        },
        );
        this.showTable = true;
        this.selFunction();
        this.editFunction();
        //this.setAwbPrefix();
        // this.populateTable();
      }
    },
    );
  }

  /**
    * For intializing AwbPrefix link
    */
  public setAwbPrefix() {
    for (let index = 0; index < this.responseArray.length; index++) {
      this.responseArray[index]['awbPrefix'] = 'awbPrefix';

    }
  }

  /**
   * On Link Click for edit the carrier code values
   * @param event Event
   */
  public onEditAddLink(event) {
    this.displayAddEditForm = true;
    this.updateFormData = false;
    this.addFormData = true;
    this.window.open();
    this.carrierCodeForm.get('carrierCode').setValue('');
    this.carrierCodeForm.get('carrierShortName').setValue('');
    this.carrierCodeForm.get('assistedCarrierFlag').setValue('');
    this.carrierCodeForm.get('awbPrefix').setValue('');
    this.carrierCodeForm.get('dlsWeightUnit').setValue('');
    this.carrierCodeForm.get('iataFlag').setValue(false);
    this.carrierCodeForm.get('volumeFlag').setValue(false);
    this.carrierCodeForm.get('cargoIqFlag').setValue(false);
    this.carrierCodeForm.get('pwgInd').setValue(false);
    this.carrierCodeForm.get('messageSequenceFlag').setValue(false);
    this.carrierCodeForm.get('autoFlightFlag').setValue('');
    this.carrierCodeForm.get('notocFormat').setValue('');
  }

  /**
    * Function to populate table data
    */
  populateAwbData() {
    console.log(this.awbArray);
    const listAry = this.awbArray;
    //
    this.disableControls = [];
    //
    for (let i = 0; i < listAry.length; i++) {
      listAry[i].sel = false;
      listAry[i].flagUpdate = 'Y';
      listAry[i].flagInsert = 'N';

      const newData: any = [{
        sel: 'sel',
        awbPrefix: listAry[i].awbPrefix,
        flagIATA: listAry[i].flagIATA,
        awbModelCheckFlag: listAry[i].awbModelCheckFlag,
        flagUpdate: 'Y',
        flagInsert: 'N'
      }];
      this.disableControls.push({
        disableAwbFlag: true
      });
    }
    (<NgcFormArray>this.carrierCodeForm.controls['awBPrefixList']).patchValue(listAry);
  }

  /**
   * @param event
   * Function handled request Save/Update table data
   */
  onSubmitData(event) {
    const carrierRecord: CarrierCodeUpdateRequest = new CarrierCodeUpdateRequest();
    carrierRecord.carrierCode = this.carrierCodeForm.get('carrierCode').value;
    carrierRecord.carrierShortName = this.carrierCodeForm.get('carrierShortName').value;
    carrierRecord.assistedCarrierFlag = this.carrierCodeForm.get('assistedCarrierFlag').value;
    carrierRecord.iataFlag = this.carrierCodeForm.get('iataFlag').value;
    carrierRecord.cargoIqFlag = this.carrierCodeForm.get('cargoIqFlag').value;
    carrierRecord.pwgInd = this.carrierCodeForm.get('pwgInd').value;
    carrierRecord.volumeFlag = this.carrierCodeForm.get('volumeFlag').value;
    carrierRecord.notocFormat = this.carrierCodeForm.get('notocFormat').value;
    carrierRecord.messageSequenceFlag = this.carrierCodeForm.get('messageSequenceFlag').value;
    carrierRecord.dlsWeightUnit = this.carrierCodeForm.get('dlsWeightUnit').value;
    carrierRecord.groundHandlerCode = this.carrierCodeForm.get('assistedCarrierFlag').value;
    carrierRecord.mailHandler = this.carrierCodeForm.get('mailHandler').value;
    carrierRecord.autoFlightFlag = this.carrierCodeForm.get('autoFlightFlag').value;
    this.lovValue = carrierRecord.carrierShortName;
    // Null check for mandatory fields
    if ((carrierRecord.carrierShortName == null) ||
      (carrierRecord.assistedCarrierFlag == null)) {
      this.showErrorMessage("admin.fill.mandatory.fields");
      return;
    }
    if (this.updateFormData === true) {

      this.masterCarrierCodeService.updateCarrierCodeData(carrierRecord).subscribe(data => {
        this.resp = data;
        this.responseArray = this.resp.data;
        this.refreshFormMessages(data);
        this.parameter = this.createSourceParameter(',');
        if (this.responseArray != null) {
          this.window.hide();
          //this.carrierCodeForm.get('carrierCodeValue').setValue(this.responseArray.carrierCode);
          // this.carrierCodeForm.get('carrierShortName').setValue(this.responseArray.carrierShortName);
          this.onCarrierSearch();
          this.showSuccessStatus('g.completed.successfully');
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors[0].message);
        }
      },
      );
    } else {
      this.masterCarrierCodeService.addCarrierCodeData(carrierRecord).subscribe(data => {
        this.resp = data;
        this.responseArray = this.resp.data;
        this.parameter = this.createSourceParameter(',');
        this.refreshFormMessages(data);
        if (this.resp.success) {
          this.window.hide();
          this.carrierCodeForm.get('carrierCodeValue').setValue(this.responseArray.carrierCode);
          this.carrierCodeForm.get('carrierName').setValue(this.responseArray.carrierShortName);
          this.onCarrierSearch();
          this.showSuccessStatus('g.completed.successfully');
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors[0].message);
        }
      },
      );
    }
  }

  /**
   * Function to cancel the popup
  */
  onWindowCancel(event) {
    this.window.hide();
    this.awbWindow.hide();
  }

  /**
   * Function to populate table
   */
  public populateTable() {
    console.log(this.responseArray);
    console.log(JSON.stringify(this.responseArray));
    (<NgcFormArray>this.carrierCodeForm.get('carrierCodeList')).patchValue(this.responseArray);
    console.log((<NgcFormArray>this.carrierCodeForm.get('carrierCodeList')).getRawValue());
    console.log(this.carrierCodeForm);
  }

  /**
  * function will add new carrier code record to DB
  * @param event Event
  */
  saveNewRecord(event) {
    const control = (<NgcFormArray>this.carrierCodeForm.controls['resultList']);
  }

  /**
  * function will update the AWB 
   value for corresponding carrier record
  * @param event Event
  */
  onAwbValueUpdate(event) {
  }

  public editFunction() {
    for (let index = 0; index < this.responseArray.length; index++) {
      this.responseArray[index]['edit'] = 'Edit';
    }
  }

  public selFunction() {
    for (let index = 0; index < this.responseArray.length; index++) {
      this.responseArray[index]['select'] = 'SEL';
    }
  }

  public selectFunction() {
    for (let index = 0; index < this.awbArray.length; index++) {
      this.awbArray[index]['sel'] = false;
    }
  }

  /**
    * This Function will fetch Uld Type  onSearch
    * @param:carrierCode and carrier Code Search
    */
  public onCarrierSearch() {
    const carrierCodeSearch: CarrierCodeSearchRequest = new CarrierCodeSearchRequest();
    carrierCodeSearch.carrierCode = this.carrierCodeForm.get('carrierCodeValue').value;
    carrierCodeSearch.carrierShortName = this.carrierCodeForm.get('carrierName').value;
    carrierCodeSearch.carrierAWBPrefix = this.carrierCodeForm.get('carrierAWBPrefix').value;
    let obj: any = new Object();
    obj.code = carrierCodeSearch.carrierCode;
    obj.desc = this.lovValue;
    if (this.lovValue != null && carrierCodeSearch.carrierCode != null && carrierCodeSearch.carrierShortName) {
      carrierCodeSearch.carrierShortName = this.lovValue;
      this.onCarrierCodeLOVSelect(obj);
    }
    if (carrierCodeSearch.carrierCode != "" || carrierCodeSearch.carrierShortName != null && carrierCodeSearch.carrierShortName != "" && carrierCodeSearch.carrierAWBPrefix != "") {
      this.masterCarrierCodeService.searchCarrierCodeDetails(carrierCodeSearch).subscribe(data => {
        this.resp = data;
        this.lovValue = null;
        this.responseArray = this.resp.data;
        if (this.responseArray === null || !this.responseArray.length) {
          this.showErrorStatus('no.record.found');
          this.showTable = false;
          return;
        } else {
          this.showTable = true;
          this.selFunction();
          //this.setAwbPrefix();
          this.editFunction();
          //this.populateTable();
          this.refreshFormMessages(this.resp);
          for (const eachRow of this.responseArray) {
            eachRow.select = false;
          }
          (<NgcFormArray>this.carrierCodeForm.get('carrierCodeList')).patchValue(this.responseArray);
        }
      },
      );
    } else {
      this.getCarrierCodeData();
    }

  }

  /**
   * @param event
   * Function to handle delete carrier code request
   */
  onDeleteButtonClick(event) {
    this.showConfirmMessage('delete.selected.records').then(fulfilled => {
      const indices: any = [];
      const item = (<NgcFormArray>this.carrierCodeForm.get('carrierCodeList')).controls;
      console.log(item);
      for (let index = 0; index < item.length; index++) {
        if (item[index].value.select) {
          const deleteData: CarrierCodeDeleteRequest = new CarrierCodeDeleteRequest();
          deleteData.carrierCode = item[index].value.carrierCode;
          deleteData.carrierShortName = item[index].value.carrierShortName;
          deleteData.assistedCarrierFlag = '';
          deleteData.groundHandlerCode = '';
          indices.push(deleteData);
        }
      }
      console.log(JSON.stringify(indices));
      console.log(indices);
      this.masterCarrierCodeService.deleteCarrierCodeData(indices).subscribe(data => {
        this.resp = data;
        this.responseArray = this.resp.data;
        if (this.responseArray != null) {
          this.showSuccessStatus('g.completed.successfully');
          this.refreshFormMessages(data);
          this.getCarrierCodeData();
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors[0].message);
        }
      },
      );
    }).catch(reason => {
    });
  }

  /**
   * @param event
   * Function to add new row on  Awb Prefix popup window
   */
  onAddRow(event) {
    const noOfRows = (<NgcFormArray>this.carrierCodeForm.get('awBPrefixList')).length;
    const lastRow = noOfRows ? (<NgcFormArray>this.carrierCodeForm.get('awBPrefixList')).controls[noOfRows - 1] : null;
    if (noOfRows === 0 || (lastRow.get('awbPrefix').value)) {
      this.disableControls.push({
        disableAwbFlag: false
      });
      (<NgcFormArray>this.carrierCodeForm.controls['awBPrefixList']).addValue([
        {
          awbPrefix: '',
          flagIATA: false,
          awbModelCheckFlag: false,
          sel: false,
          flagUpdate: 'N',
          flagInsert: 'Y'
        }
      ]);
      if (noOfRows !== 0) {
        this.goTo.goToLastPage();
      }
    }
  }

  /*
   * @param event
   * Function to handle save request for Master Carrier Prfix records
   */
  onPrefixSave(event) {
    let prefixAdd: AwbPrefixRequest;
    const indices: any = [];
    const item = (<NgcFormArray>this.carrierCodeForm.get('awBPrefixList')).controls;
    let flagIATA = 0;
    for (let i = 0; i < item.length; i++) {
      prefixAdd = new AwbPrefixRequest();
      prefixAdd.carrierCode = this.CarrierCode;
      prefixAdd.awbPrefix = item[i].value.awbPrefix;
      prefixAdd.flagIATA = item[i].value.flagIATA ? 1 : 0;
      prefixAdd.awbModelCheckFlag = item[i].value.awbModelCheckFlag ? 1 : 0;
      prefixAdd.flagInsert = item[i].value.flagInsert;
      prefixAdd.flagUpdate = item[i].value.flagUpdate;
      indices.push(prefixAdd);
    }
    this.masterCarrierCodeService.updateAwbPrefixList(indices).subscribe(data => {
      this.awbValue = data;
      this.awbArray = this.awbValue.data;
      this.refreshFormMessages(data);
      if (this.awbArray != null) {
        this.showSuccessStatus('g.completed.successfully');
        this.awbWindow.hide();
      } else {
        this.errors = this.resp.messageList;
        this.showErrorStatus(this.resp.messageList[0].message);
      }
    },
    );
  }

  /**
   * @param event
   * Function to handle delete request for Master Carrier Prfix records
   */
  onPrefixDelete(event) {
    const listArray = (<NgcFormArray>this.carrierCodeForm.get('awBPrefixList')).controls;
    const indices: any = [];

    for (let index = 0; index < listArray.length; index++) {
      if (listArray[index].value.sel === true) {
        const prefixUpdate: AwbPrefixRequest = new AwbPrefixRequest();
        prefixUpdate.carrierCode = this.CarrierCode;
        prefixUpdate.awbPrefix = listArray[index].value.awbPrefix;
        indices.push(prefixUpdate);
      }
    }
    if (indices.length === 0) {
      return this.showErrorStatus('master.select.atleast.one.awb.to.delete');
    }
    this.showConfirmMessage('delete.selected.records').then(fulfilled => {
      this.masterCarrierCodeService.deleteAbWPrefixList(indices).subscribe(data => {
        this.awbValue = data;
        this.awbArray = this.awbValue.data;
        this.refreshFormMessages(data);
        if (this.awbArray != null) {
          this.awbWindow.hide();
          this.showSuccessStatus('g.completed.successfully');
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors[0].message);
        }
      },
      );
    }).catch(reason => {
    });
  }

  onClickAWBPrefix(index) {
    const carrierCode = this.carrierCodeForm.get(['carrierCodeList', index, 'carrierCode']).value;
    const carrierCodeDetails: AwbPrefixListRequest = new AwbPrefixListRequest();
    carrierCodeDetails.carrierCode = carrierCode;
    this.CarrierCode = carrierCode;
    this.masterCarrierCodeService.abWPrefixList(carrierCodeDetails).subscribe(data => {
      this.awbValue = data;
      this.awbArray = this.awbValue.data;
      if (this.awbArray != null) {
        this.selectFunction();
        this.awbWindow.open();
        this.populateAwbData();
      }
    });
  }

  onClickEdit(index) {
    this.updateFormData = true;
    this.addFormData = false;
    const carrierCode = this.carrierCodeForm.get(['carrierCodeList', index, 'carrierCode']).value;
    const patchData = (<NgcFormArray>this.carrierCodeForm.get(['carrierCodeList', index])).getRawValue();
    if (carrierCode) {
      this.carrierCodeForm.patchValue(patchData);
      this.window.open();
    }
  }

  onClickPartBooking(index) {
    this.carrierCodeToDisplay = (<NgcFormArray>this.carrierCodeForm.get(['carrierCodeList', index, 'carrierCode'])).value;
    const carrierData = (<NgcFormArray>this.carrierCodeForm.get(['carrierCodeList', index])).getRawValue();
    const dataPresent = (<NgcFormArray>this.carrierCodeForm.get(['carrierCodeList', index, 'partBookingCarrier'])).value;
    if (carrierData['crossBookCarrier']) {
      let crossBookCarrierList = carrierData['crossBookCarrier'].split(',');
      carrierData['crossBookCarrier'] = [];
      for (let eachShc of crossBookCarrierList) {
        carrierData['crossBookCarrier'].push(eachShc);
      }
    }
    if (dataPresent) {
      this.carrierCodeForm.get(['partBookingList', 0]).patchValue(carrierData);
    } else {
      (<NgcFormArray>this.carrierCodeForm.get('partBookingList')).resetValue([]);
    }
    this.partBookingWindow.open();
  }

  onSubmitPartBooking() {
    this.partBookingWindow.close();
    this.requestToPartBooking = (<NgcFormArray>this.carrierCodeForm.get(['partBookingList', 0])).value;
    const requestData = {
      partBookingCarrier: this.requestToPartBooking.partBookingCarrier,
      crossBookingFlag: this.requestToPartBooking.crossBookingFlag,
      crossBookCarrierList: this.requestToPartBooking.crossBookCarrier,
      startPrefix: this.requestToPartBooking.startPrefix,
      endPrefix: this.requestToPartBooking.endPrefix,
      primaryIdentifier: this.requestToPartBooking.primaryIdentifier,
      excludePrefix: this.requestToPartBooking.excludePrefix,
      carrierCode: this.requestToPartBooking.carrierCode,
      flagCRUD: this.requestToPartBooking.flagCRUD
    }
    this.masterCarrierCodeService.savePartBooking(requestData).subscribe(data => {
      this.resp = data;
      if (data.messageList != null) {
        this.showErrorStatus(data.messageList[0].message);
      } else {
        this.showSuccessStatus('g.completed.successfully');
        this.onCarrierSearch();
      }
    });
  }

  deletePartBooking(index) {
    (<NgcFormArray>this.carrierCodeForm.get(['partBookingList'])).markAsDeletedAt(index);
  }

  onAddPartBooking() {
    const addRow = (<NgcFormArray>this.carrierCodeForm.controls['partBookingList']).length;
    if (!addRow) {
      (<NgcFormArray>this.carrierCodeForm.controls['partBookingList']).addValue([
        {
          partBookingCarrier: this.carrierCodeToDisplay,
          crossBookingFlag: '',
          crossBookCarrier: '',
          startPrefix: '',
          endPrefix: '',
          primaryIdentifier: '',
          excludePrefix: '',
          carrierCode: '',
        }
      ]);

    }
  }

  onCarrierCodeLOVSelect(object) {
    if (object.code) {
      this.carrierCodeForm.get('carrierName').setValue(object.desc, { onlySelf: true, emitEvent: false });
      this.carrierCodeForm.get('carrierCodeValue').setValue(object.code, { onlySelf: true, emitEvent: false });
    } else {
      this.carrierCodeForm.get('carrierName').setValue(null, { onlySelf: true, emitEvent: false });
    }
  }

  selectAwbPrefix(event) {
    if (event.code) {
      this.carrierCodeForm.get('carrierAWBPrefix').setValue(event.code, { onlySelf: true, emitEvent: false });
    }
  }
  onClear() {
    this.parameter = this.createSourceParameter(',');
  }

  RouteToMaintainServiceProvider(item) {
    var dataToSend = {
      carrierCode: this.carrierCodeForm.get(['carrierCodeList', item, 'carrierCode']).value,
      serviceType: "RHO"
    }
    this.navigateTo(this.router, "/import/maintainserviceprovider", dataToSend);

  }

  onClickBuBdOffice(index) {
    this.carrierCodeForm.get(['bubdOfficeList']).patchValue(new Array());
    this.CarrierCode = (<NgcFormArray>this.carrierCodeForm.get(['carrierCodeList', index, 'carrierCode'])).value;
    const request = {
      carrierCode: this.CarrierCode
    }
    this.masterCarrierCodeService.fetchBuBdOfficeDetails(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        if (response.data.length != 0) {
          (<NgcFormArray>this.carrierCodeForm.get('bubdOfficeList')).patchValue(response.data);
        }
      }
    })
    this.bubdOfficeWindow.open();
  }
  onBuBDCancel(event) {
    this.window.hide();
    this.bubdOfficeWindow.hide();
  }
  addRowBuBdOffice(event) {
    const noOfRows = (<NgcFormArray>this.carrierCodeForm.get(['bubdOfficeList'])).length;
    if (noOfRows < 2) {
      (<NgcFormArray>this.carrierCodeForm.controls['bubdOfficeList']).addValue([{
        flightType: '',
        buBdOffice: ''
      }])
    }
  }
  onSelectFlightType() {
    this.disabledBuBdOfficeSave = false;
    const formData = (<NgcFormArray>this.carrierCodeForm.get(['bubdOfficeList'])).getRawValue();
    if ((<NgcFormArray>this.carrierCodeForm.get(['bubdOfficeList'])).getSize() > 1) {
      if (formData[0].flightType == formData[1].flightType) {
        this.showErrorStatus("flight.same.flight.type.not.allowed");
        this.disabledBuBdOfficeSave = true;
      } else if (formData[0].flightType == "All" || formData[1].flightType == "All") {
        this.showErrorMessage("can.not.allowed.to add.other.flight.type");
        this.disabledBuBdOfficeSave = true;
      } else {
        this.disabledBuBdOfficeSave = false;
      }

    }
  }
  onDeleteBuBdOffice(index) {
    this.disabledBuBdOfficeSave = false;
    const request: any = [];
    const formData = (<NgcFormArray>this.carrierCodeForm.get(['bubdOfficeList', index])).getRawValue();
    if (!NgcUtility.isNullOrUndefined(formData['flightType']) && !NgcUtility.isNullOrUndefined(formData['buBdOffice'])) {
      formData['carrierCode'] = this.CarrierCode;
      formData['flagCRUD'] = 'D';
      request.push(formData);
    }

    if (request) {
      this.masterCarrierCodeService.saveBuBdDetails(request).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus("g.completed.successfully");
          // this.window.hide();
          // this.bubdOfficeWindow.hide();
        }
      })
    }

    (<NgcFormArray>this.carrierCodeForm.get(['bubdOfficeList'])).removeAt(index);
  }
  onBuBdOfficeSave() {
    const request: any = [];
    const formData = (<NgcFormArray>this.carrierCodeForm.get(['bubdOfficeList'])).getRawValue();
    if (formData) {
      formData.forEach(e => {
        if (e['flagCRUD'] != 'D' && e['flagCRUD'] != 'R' && (NgcUtility.isNullOrUndefined(e['flightType']) || NgcUtility.isNullOrUndefined(e['buBdOffice']))) {
          this.showErrorMessage("flight.bubd.ofc.details.missing");
          return;
        } else {
          if (e['flagCRUD'] != 'D' && e['flagCRUD'] != 'R') {
            e.carrierCode = this.CarrierCode;
            request.push(e);
          }
        }
      })
      if (request) {
        this.masterCarrierCodeService.saveBuBdDetails(request).subscribe(response => {
          if (!this.showResponseErrorMessages(response)) {
            this.showSuccessStatus("g.completed.successfully");
            this.window.hide();
            this.bubdOfficeWindow.hide();
            this.onCarrierSearch();
          }
        })

      }
    }
  }
}

