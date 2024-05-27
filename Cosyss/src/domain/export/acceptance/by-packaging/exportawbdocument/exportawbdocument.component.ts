import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcPage,
  NgcButtonComponent, PageConfiguration, NgcFormControl, UserProfile,
  NgcLOVComponent, NgcUtility, NgcPrinterComponent, NgcReportComponent
} from 'ngc-framework';
import { RclserviceService } from '../rclservice.service';
import { isBuffer } from 'util';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-exportawbdocument',
  templateUrl: './exportawbdocument.component.html',
  styleUrls: ['./exportawbdocument.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class ExportawbdocumentComponent extends NgcPage implements OnInit {

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private rclService: RclserviceService, private cd: ChangeDetectorRef) {
    super(appZone, appElement, appContainerElement);

  }

  @ViewChild("shipmentType") shipmentType: any = 'AWB';
  @Input('shipmentNumberData') shipmentNumberData: string;
  @Input('shipmentTypeData') shipmentTypeData: string;
  @Input('showAsPopup') showAsPopup: boolean;
  @ViewChild("reportAWB") reportAWB: NgcReportComponent;
  navigateData: any;
  shipmentTypeValue: any = 'AWB';
  lithiumBatteryFlag: boolean = true;
  shcsFromService: any;
  shipperDetailFlag: boolean = false;
  exportFormFlag: boolean = false;
  responseArray: any = null;
  reportParameters: any;
  saveFlag: boolean = true;
  private PIList = {
    reference: null
  }
  private liBattery = {
    reference: null,
    pieces: null,
  }

  searchForm: NgcFormGroup = new NgcFormGroup({
    nonIataStandard: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    shipmentType: new NgcFormControl(),
  })

  form: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    weightUnitCode: new NgcFormControl(),
    natureOfGoodsDescription: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    carCreated: new NgcFormControl(),
    svc: new NgcFormControl(),
    shc: new NgcFormArray([]),
    routingInfo: new NgcFormArray([]),
    pi: new NgcFormArray([]),
    li: new NgcFormArray([]),
    license: new NgcFormArray([]),
    acceptanceInfo: new NgcFormArray([]),
    //contactInformation: new NgcFormArray([]),
    ectCargoHandler: new NgcFormControl(),
    muwPermissionType: new NgcFormControl(),
    directTow: new NgcFormControl(),
    dutiableCommodity: new NgcFormControl(),
    eli: new NgcFormControl(),
    elm: new NgcFormControl(),
    dgm: new NgcFormControl(),
    others: new NgcFormControl(),
    lock: new NgcFormControl(),
    lockReason: new NgcFormControl(),
    lockRemarks: new NgcFormControl(),
    groupToNotify: new NgcFormControl(),
    agentIataCode: new NgcFormControl(),
    agentName: new NgcFormControl(),
    agentCode: new NgcFormControl(),
    agentId: new NgcFormControl(),
    shipperInfo: new NgcFormGroup({
      customerCode: new NgcFormControl(),
      customerName: new NgcFormControl(),
      accountNumber: new NgcFormControl(),
      address: new NgcFormControl(),
      place: new NgcFormControl(),
      postalCode: new NgcFormControl(),
      state: new NgcFormControl(),
      country: new NgcFormControl(),
      customerId: new NgcFormControl(),
      appointedAgentCode: new NgcFormControl(),
      contactEmail: new NgcFormControl(),
      contactInfo: new NgcFormArray([]),
    })
  })

  ngOnInit() {
    this.navigateData = this.getNavigateData(this.activatedRoute);
    if (this.shipmentTypeData || this.shipmentNumberData) {
      this.searchForm.get('shipmentNumber').patchValue(this.shipmentNumberData);
      this.searchForm.get('shipmentType').patchValue(this.shipmentTypeData);
      this.shipmentType = this.shipmentTypeData;
      //this.search();
    } else {
      this.shipmentType = 'AWB';
      this.searchForm.get('shipmentType').patchValue(this.shipmentType);
    }
  }

  selectShipmentType(event) {
    if (event.shipmentType) {
      this.shipmentTypeValue = event.shipmentType;
      this.searchForm.get('shipmentType').patchValue(event.shipmentType);
    }
  }

  onSearch() {
    this.searchForm.validate();
    if (this.searchForm.invalid) {
      return;
    }
    this.responseArray = null;
    this.form.reset();
    this.rclService.fetchExportAwbDocumentDetails(this.searchForm.getRawValue()).subscribe(response => {
      if (!this.showResponseErrorMessages(response) && response.data) {
        this.responseArray = response.data;
        if (this.responseArray != null && this.responseArray.carCreated == false) {
          this.saveFlag = false;
        } else {
          this.saveFlag = true;
        }
        let PIlenght = response.data.pi.length;
        for (let i = 0; i < 6 - PIlenght; i++) {
          response.data.pi.push(this.PIList);
        }
        let LIlenght = response.data.li.length;
        for (let i = 0; i < 3 - LIlenght; i++) {
          response.data.li.push(this.liBattery);
        }
        const routingList = new Array();
        for (let index = 0; index < 3; index++) {
          if (this.responseArray.routingInfo && index < this.responseArray.routingInfo.length) {
            if (this.responseArray.routingInfo[index]) {
              routingList.push({ carrier: this.responseArray.routingInfo[index].carrier, fromPoint: this.responseArray.routingInfo[index].fromPoint });
            }
          } else {
            routingList.push({ carrier: null, fromPoint: null });
          }
        }
        response.data.routingInfo = routingList;
        if (response.data.shc.length > 0) {
          this.onShcChanges();
        }
        this.form.patchValue(response.data);
        if (this.form.get('agentCode').value == 'EXX' || this.form.get('agentName').value == 'DIRECT SHIPPER') {
          this.shipperDetailsMandatory(true, null);
        }
      }
    })
  }

  onSave() {
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    this.rclService.saveExportAwbDocumentDetails(this.form.getRawValue()).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.onSearch();
        this.showSuccessStatus('g.completed.successfully');
      }
    })
  }

  confirmAWBDoc() {
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    const saveRequest = this.form.getRawValue();
    this.rclService.confirmExportAwbDocumentDetails(saveRequest).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        // this.onSearch();
        this.form.get('carCreated').setValue(response.data.carCreated);
        this.saveFlag = true;
        this.showSuccessStatus('g.completed.successfully');
      }
    })
  }

  unConfirmAWBDoc() {
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    const saveRequest = this.form.getRawValue();
    this.rclService.unConfirmExportAwbDocumentDetails(saveRequest).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        // this.onSearch();
        this.form.get('carCreated').setValue(response.data.carCreated);
        this.saveFlag = false;
        this.showSuccessStatus('g.completed.successfully');
      }
    })
  }

  onShcChanges() {
    this.lithiumBatteryFlag = true;
    this.form.get('eli').setValue(false);
    this.form.get('elm').setValue(false);
    this.form.get('others').setValue(false);
    this.retrieveLOVRecords('SHC_WITH_GROUP').subscribe(data => {
      console.log("shc data", data)
      let otherCheckboxFlag = false;
      this.shcsFromService = this.form.get(['shc']).value.map(shc => shc.specialHandlingCode);
      console.log("this.shcsFromService", this.shcsFromService);
      let shcsArray: Array<any> = new Array();
      shcsArray = this.shcsFromService;
      const shcs = data.filter(shc => this.shcsFromService.includes(shc.code));
      console.log("shcs", shcs);
      let i = 0;
      const ELICount = shcs.filter(obj => (obj.param2 === 'ELI'));
      if (ELICount.length > 0) {
        this.lithiumBatteryFlag = false;
      } else {
        this.lithiumBatteryFlag = true;
      }

      let j = 0;
      let dgrobj = [];
      let dgrEliobj = [];
      shcsArray.forEach(ele => {
        let filteredShc = shcs.filter(obj => (obj.code === ele));
        let dgrobj = filteredShc.filter(obj => (obj.param2 === 'DGR'));
        let dgrEliobj = filteredShc.filter(obj => (obj.param2 === 'ELI'));
        if (dgrobj.length > 0 && dgrEliobj.length == 0) {
          j++;
        }

        if (ele == 'ELI') {
          this.form.get('eli').setValue(true);
          otherCheckboxFlag = true;
        }
        if (ele == 'ELM') {
          this.form.get('elm').setValue(true);
          otherCheckboxFlag = true;
        }
      })
      if (otherCheckboxFlag == false) {
        this.form.get('others').setValue(true);
      }

      if (j > 0) {
        this.form.get('dgm').setValue(true);
      }
      else {
        this.form.get('dgm').setValue(false);
      }
      //  })
    });

  }

  setAgentDetails(event, isAgentCode) {
    if (event && event.code) {
      this.form.get('agentIataCode').setValue(event.param1, { emitEvent: false, onlySelf: true });
      this.form.get('agentCode').setValue(event.code, { emitEvent: false, onlySelf: true });
      this.form.get('agentName').setValue(event.desc, { emitEvent: false, onlySelf: true });
      this.form.get('agentAccountNumber').setValue(event.param3, { emitEvent: false, onlySelf: true });
      this.form.get('agentId').setValue(event.param2, { emitEvent: false, onlySelf: true });
      if (this.form.get(['shipperInfo', 'customerCode']).value == null || this.form.get(['shipperInfo', 'customerCode']).value == null) {
        this.shipperDetailsMandatory(event.code == 'EXX' ? true : false, null);
      }
    } else {
      this.form.get('agentIataCode').setValue(null, { emitEvent: false, onlySelf: true });
      this.form.get('agentCode').setValue(null, { emitEvent: false, onlySelf: true });
      this.form.get('agentName').setValue(null, { emitEvent: false, onlySelf: true });
      this.form.get('agentAccountNumber').setValue(null, { emitEvent: false, onlySelf: true });
      this.form.get('agentId').setValue(null, { emitEvent: false, onlySelf: true });
    }
  }

  onSelectShipperName(event, item) {
    if (event && event.code) {
      this.form.get(['shipperInfo', 'customerId']).setValue(event.param5, { emitEvent: false, onlySelf: true });
      this.form.get(['shipperInfo', 'customerCode']).setValue(event.code, { emitEvent: false, onlySelf: true });
      this.form.get(['shipperInfo', 'accountNumber']).setValue(event.param4, { emitEvent: false, onlySelf: true });
      this.form.get(['shipperInfo', 'place']).setValue(event.param2, { emitEvent: false, onlySelf: true });
      this.form.get(['shipperInfo', 'postalCode']).setValue(event.parameter1, { emitEvent: false, onlySelf: true });
      this.form.get(['shipperInfo', 'customerName']).setValue(event.desc, { emitEvent: false, onlySelf: true });
      this.form.get(['shipperInfo', 'address']).setValue(event.param1, { emitEvent: false, onlySelf: true });
      this.form.get(['shipperInfo', 'state']).setValue(event.parameter2, { emitEvent: false, onlySelf: true });
      this.form.get(['shipperInfo', 'country']).setValue(event.parameter3, { emitEvent: false, onlySelf: true });
      this.insertContactDetails(event.param5);
      this.shipperDetailsMandatory(true, null);
    } else {
      this.form.get(['shipperInfo', 'customerId']).setValue(null, { emitEvent: false, onlySelf: true });
      this.form.get(['shipperInfo', 'accountNumber']).setValue(null, { emitEvent: false, onlySelf: true });
      this.form.get(['shipperInfo', 'place']).setValue(null, { emitEvent: false, onlySelf: true });
      this.form.get(['shipperInfo', 'postalCode']).setValue(null, { emitEvent: false, onlySelf: true });
      this.form.get(['shipperInfo', 'address']).setValue(null, { emitEvent: false, onlySelf: true });
      this.form.get(['shipperInfo', 'state']).setValue(null, { emitEvent: false, onlySelf: true });
      this.form.get(['shipperInfo', 'country']).setValue(null, { emitEvent: false, onlySelf: true });
      if (item == 'code') {
        this.shipperDetailsMandatory(false, null);
        this.form.get(['shipperInfo', 'customerName']).setValue(null, { emitEvent: false, onlySelf: true });
      } else if (item == 'desc') {
        this.form.get(['shipperInfo', 'customerCode']).setValue(null, { emitEvent: false, onlySelf: true });
        if (this.form.get('agentCode').value != 'EXX') {
          this.shipperDetailsMandatory(this.form.get(['shipperInfo', 'customerName']).value ? true : false, true);
        } else {
          this.shipperDetailsMandatory(true, true);
        }
      }
    }
  }

  shipperDetailsMandatory(event, isValidName) {
    if (event) {
      if (!isValidName) {
        (<NgcFormControl>this.form.get(['shipperInfo', 'customerCode'])).setValidators([Validators.required]);
      } else {
        (<NgcFormControl>this.form.get(['shipperInfo', 'customerCode'])).setValidators([]);
      }
      (<NgcFormControl>this.form.get(['shipperInfo', 'customerName'])).setValidators([Validators.required]);
      (<NgcFormControl>this.form.get(['shipperInfo', 'place'])).setValidators([Validators.required, Validators.maxLength(17)]);
      (<NgcFormControl>this.form.get(['shipperInfo', 'postalCode'])).setValidators([Validators.required, Validators.maxLength(10)]);
      (<NgcFormControl>this.form.get(['shipperInfo', 'address'])).setValidators([Validators.required, Validators.maxLength(70)]);
    } else {
      // No Validators as Value selected in shipper LOV is wrong
      if (this.form.get('agentCode').value != 'EXX') {
        (<NgcFormControl>this.form.get(['shipperInfo', 'customerName'])).setValidators([]);
      }
      (<NgcFormControl>this.form.get(['shipperInfo', 'customerCode'])).setValidators([]);
      (<NgcFormControl>this.form.get(['shipperInfo', 'state'])).setValidators([]);
      (<NgcFormControl>this.form.get(['shipperInfo', 'country'])).setValidators([]);
      (<NgcFormControl>this.form.get(['shipperInfo', 'address'])).setValidators([]);
      (<NgcFormControl>this.form.get(['shipperInfo', 'postalCode'])).setValidators([]);
      (<NgcFormControl>this.form.get(['shipperInfo', 'place'])).setValidators([]);
      // Setting Null Value as Value selected in shipper LOV is wrong
      (<NgcFormControl>this.form.get(['shipperInfo', 'accountNumber'])).setValue(null);
      (<NgcFormControl>this.form.get(['shipperInfo', 'place'])).setValue(null);
      (<NgcFormControl>this.form.get(['shipperInfo', 'postalCode'])).setValue(null);
      (<NgcFormControl>this.form.get(['shipperInfo', 'address'])).setValue(null);
      (<NgcFormControl>this.form.get(['shipperInfo', 'state'])).setValue(null);
      (<NgcFormControl>this.form.get(['shipperInfo', 'country'])).setValue(null);
    }
  }

  insertContactDetails(record) {
    this.retrieveLOVRecords("KEY_AWB_CONTACT_DETAILS", { param5: record }).subscribe(response => {
      if (response != null && response.length > 0) {
        const contactInformation = [];
        for (let data of response) {
          let contactInfo = {};
          contactInfo['contactTypeCode'] = data.code;
          contactInfo['contactTypeDetail'] = data.desc;
          contactInformation.push(contactInfo);
        }
        (<NgcFormArray>this.form.get(['shipperInfo', 'contactInfo'])).patchValue(contactInformation);
      } else {
        (<NgcFormArray>this.form.get(['shipperInfo', 'contacts'])).patchValue([]);
      }
    });
  }

  onPrint() {
    this.reportParameters = new Object();
    this.reportParameters.shipmentId = this.responseArray.shipmentId;
    this.reportParameters.shipmentNumber = this.responseArray.shipmentNumber;
    this.reportParameters.shipmentDate = this.responseArray.shipmentDate;
    // this.reportParameters.nawbID = this.responseArray.shipmentType;
    // this.reportParameters.tenantAirportCode = this.responseArray.shipmentType;
    this.reportAWB.open();
  }

  onAddClearanceTbl() {
    (<NgcFormArray>this.form.get('license')).addValue([
      {
        documentType: '',
        documentNo: '',
        issueDate: '',
        expiryDate: '',
        duration: ''
        //delete: ''
      }
    ]);
  }

  onAddContactInformation() {
    (<NgcFormArray>this.form.get(['shipperInfo', 'contactInfo'])).addValue([
      {
        contactTypeCode: '',
        contactTypeDetail: '',
        //delete: ''
      }
    ]);
  }

  onDeleteClearance(index) {
    (<NgcFormArray>this.form.get(['license'])).markAsDeletedAt(index);
  }

  onDeleteContactInformation(event, index, segmentrow) {
    let obj = (this.form.get(['shipperInfo', 'contactInfo']) as NgcFormArray).getRawValue();
    obj.splice(index, 1);
    this.form.get(['shipperInfo', 'contactInfo']).patchValue(obj);
  }

  maintainBUPList() {
    this.navigateTo(this.router, 'export/buplist', '');
  }

  awbRemarks() {
    this.navigateTo(this.router, 'awbmgmt/maintainremarks', '');
  }

  maintainPremanifest() {
    this.navigateTo(this.router, 'export/premanifest', '');
  }

  fwbNavigaion() {
    this.navigateTo(this.router, 'import/maintainfwb', '');
  }

  fhlNavigaion() {
    this.navigateTo(this.router, 'awbmgmt/maintainhouse', '');
  }

  screeningPoint() {
    this.navigateTo(this.router, 'export/acceptance/rcarscreeningpoint', '');
  }

  onCancel() {
    this.navigateBack(this.navigateData);
  }

  changeDocumentType(event, index) {
    console.log("document event", event);
    this.form.get(['license', index]).get('issueDate').setValue(NgcUtility.getDateTimeAsStringByFormat(event.parameter2, "YYYY-MM-DD HH:mm:ss.S"));
    if (event.parameter3 != '1900-01-01 00:00:00.0')
      this.form.get(['license', index]).get('expiryDate').setValue(NgcUtility.getDateTimeAsStringByFormat(event.parameter3, "YYYY-MM-DD HH:mm:ss.S"));
  }
}
