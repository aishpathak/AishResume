import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcInputComponent, UserProfile,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcContainerComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchShipmentLocation, ShipmentInventory, ShipmentInventoryHouse } from '../awbManagement.shared';
import { AwbManagementService } from '../awbManagement.service';
import { ApplicationFeatures } from '../../common/applicationfeatures';
import { ApplicationEntities } from '../../common/applicationentities';


@Component({
  selector: 'app-shipmentLocation',
  templateUrl: './shipmentLocation.component.html',
  styleUrls: ['./shipmentLocation.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  //autoBackNavigation: true
})
export class ShipmentLocationComponent extends NgcPage implements OnInit {

  resp: any;
  showresp: any;
  shipmentInv: any;
  totalpieces: any = 0;
  totalWeight: any = 0;
  remainingWeight: any = 0;
  totalChargeableWeight: any = 0;
  totalCalculatedWeight: any = 0;
  inventoryPieces: any = 0;
  inventoryWeight: any = 0;
  inventoryChargeableWeight: any = 0;
  availablePieces: any = 0;
  availableWeight: any = 0;
  totalFrightPieces: any = 0;
  totalFreightWeight: any = 0;
  totalFreightChargeableWeight: any = 0;
  requestobj: any;
  ShipmentIDlist: any;
  houseIDlist: any;
  flightList: any;
  inventoryData: any;
  totalpiecesInv: Number = 0;
  totalweightInv: any = 0;
  totalChargeableWeightInv: any = 0;
  isTableFlg = false;
  saveFlag: boolean = false;
  isTableFlgforfreightout = false;
  displayDocInfoTable = false;
  displayBookingInfoTable = false;
  FrieghtFlag = false;
  FlightLabelcount: any;
  count: any;
  UldCount: any;
  UldorTrolley: any;
  arrayOfShcs: any;
  partSuffixListDisplay: any;
  forwardedData: any;
  lastUpdatedTime: any;
  suffixValuesExist: boolean = false;
  handledbyHouse: boolean = false;
  hawbInvalid: boolean = false;
  hawbSourceParameters: {};

  @ViewChild("shipmentType") shipmentType: any = 'AWB';
  @Input('shipmentNumberData') shipmentNumberData: string;
  @Input('shipmentTypeData') shipmentTypeData: string;
  @Input('showAsPopup') showAsPopup: boolean;
  @Input('hwbNumberData') hwbNumberData: string;
  @Output() autoSearchShipmentInfo = new EventEmitter<boolean>();

  //update booking component integration.
  updateBookingObject: any;
  @ViewChild('updateBookingWindow') updateBookingWindow: NgcWindowComponent;

  @ViewChild('addMaintainHouseWindow') addMaintainHouseWindow: NgcWindowComponent;

  private maintainLocationForm: NgcFormGroup = new NgcFormGroup({
    FlightLbl: new NgcFormControl(),
    FlightDateLbl: new NgcFormControl(),
    flightId: new NgcFormControl(),
    ShpTypePiecesLabel: new NgcFormControl(),
    ShpTypeWeightLabel: new NgcFormControl(),
    ShpTypeNumberLabel: new NgcFormControl(),
    shipmentType: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    shipmentTypeflag: new NgcFormControl(),
    shipmentDate: new NgcFormControl(),
    hwbNumber: new NgcFormControl(''),
    chargeableWeight: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    bookingPieces: new NgcFormControl(),
    bookingWeight: new NgcFormControl(),
    natureOfGoods: new NgcFormControl(),
    specialHandlingCode: new NgcFormControl(),
    shcList: new NgcFormControl(),
    utlPieces: new NgcFormControl(),
    partShipment: new NgcFormControl(),
    bookingDetails: new NgcFormArray([]),
    docArrivalInfoList: new NgcFormArray([]),
    partSuffix: new NgcFormControl(),
    flagForPartSuffixDropdown: new NgcFormControl(),
    partSuffixList: new NgcFormArray([]),
    shipmentInventories: new NgcFormArray([
      new NgcFormGroup({
        OutboundflightKey: new NgcFormControl(),
        dipSvcSTATS: new NgcFormControl(),
        OutboundflightKeyDate: new NgcFormControl(),
        select: new NgcFormControl(false),
        hold: new NgcFormControl(),
        holdRemarks: new NgcFormControl(),
        byPass: new NgcFormControl(),
        packing: new NgcFormControl(),
        houseId: new NgcFormControl(),
        sector: new NgcFormControl(),
        shcListInv: new NgcFormArray([
          new NgcFormGroup({
            shcInv: new NgcFormControl()
          })
        ])
      })
    ]),
    houseInformation: new NgcFormGroup({
      hwbNumber: new NgcFormControl(),
      hwbOrigin: new NgcFormControl(),
      hwbDestination: new NgcFormControl(),
      hwbPieces: new NgcFormControl(),
      hwbWeight: new NgcFormControl(),
      hwbChgWeight: new NgcFormControl(),
      hwbNatureOfGoods: new NgcFormControl(),
      hwbSHC: new NgcFormControl()
    }),
    freightOutArray: new NgcFormArray([
      new NgcFormGroup({
        sno: new NgcFormControl()
      })
    ]),
    arrivalFltlist: new NgcFormArray([])
  })

  private maintainBreakdownHouseInfoFormGroup: NgcFormGroup = new NgcFormGroup({
    houseNum: new NgcFormControl(),
    breakdownHouseInfo: new NgcFormArray([
      new NgcFormGroup({
        houseNumber: new NgcFormControl(),
        housePicecWeight: new NgcFormControl(),
        hawbPieces: new NgcFormControl(),
        hawbWeight: new NgcFormControl(),
        hawbBDPcs: new NgcFormControl(),
        hawbBDWt: new NgcFormControl(),
        hawwbRemarks: new NgcFormControl()
      })
    ]),
  });
  shipmentInventoryId: any;
  shipmentId: any;
  maintainAddHouseIndex: any;
  hawbInfoFeatureEnabled: boolean;
  actualLocationFeatureEnabled: boolean;
  shipmentTerminalAwareLocation: boolean;
  terminalRequired: boolean = true;
  sectorId: any;


  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private awbManagementService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }


  ngOnInit() {
    this.hawbInfoFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBInfo);
    this.actualLocationFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_Shipment_ActualLocation);
    this.shipmentTerminalAwareLocation = NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_Shipment_TerminalAware_Location);
    if (this.shipmentTerminalAwareLocation) {
      this.terminalRequired = false;
    } else {
      this.terminalRequired = true;
    }
    if (this.shipmentTypeData && this.shipmentNumberData) {
      this.shipmentType = this.shipmentTypeData;
      this.maintainLocationForm.get('shipmentNumber').setValue(this.shipmentNumberData);
      this.maintainLocationForm.get('shipmentType').setValue(this.shipmentTypeData);
      this.maintainLocationForm.get('hwbNumber').setValue(this.hwbNumberData);
      this.onSearch();
    } else {
      let forwardedData = this.getNavigateData(this.activatedRoute);
      this.forwardedData = this.getNavigateData(this.activatedRoute);
      if (forwardedData && forwardedData.shipmentNumber) {
        this.onSearchAuto(forwardedData);
      } else {
        this.shipmentType = 'AWB'
      }
    }
  }

  onSearchAuto(forwardedData) {
    let req: SearchShipmentLocation = new SearchShipmentLocation();
    req.shipmentNumber = forwardedData.shipmentNumber;
    req.shipmentType = forwardedData.shipmentType;
    this.shipmentType = forwardedData.shipmentType
    this.maintainLocationForm.get('shipmentNumber').setValue(forwardedData.shipmentNumber);
    this.maintainLocationForm.get('shipmentType').setValue(forwardedData.shipmentType);
    this.maintainLocationForm.get('hwbNumber').setValue(forwardedData.hwbNumber);
    this.onSearch();
  }

  onSearch() {
    if (NgcUtility.isUndefined(this.maintainLocationForm.getRawValue().shipmentNumber)) {
      this.maintainLocationForm.validate();
      this.showErrorStatus('g.enter.awb');
      return;
    }
    if (this.handledbyHouse && this.hawbInvalid) {
      this.showErrorStatus('hawb.invalid');
      return;
    }
    if (this.handledbyHouse && NgcUtility.isBlank(this.maintainLocationForm.getRawValue().hwbNumber)) {
      this.maintainLocationForm.validate();
      this.showErrorStatus('hawb.mandatory');
      return;
    }
    this.suffixValuesExist = false;
    this.resetFormMessages();
    let search: SearchShipmentLocation = new SearchShipmentLocation();

    this.maintainLocationForm.get('bookingDetails').reset();
    this.maintainLocationForm.get('docArrivalInfoList').reset();
    this.maintainLocationForm.get('partSuffix').reset();
    this.maintainLocationForm.get('shipmentDate').reset();

    search = this.maintainLocationForm.getRawValue();
    let userInfo: UserProfile = this.getUserProfile();
    search.loggedInUser = userInfo.userLoginCode;
    if (search.shipmentType == null) {
      search.shipmentType = this.shipmentType;
    }

    this.awbManagementService.searchLocation(search).subscribe(data => {
      this.maintainLocationForm.get('ShpTypeNumberLabel').setValue(this.shipmentType.shipmentType + " " + "Number");
      this.maintainLocationForm.get('ShpTypePiecesLabel').setValue(this.shipmentType.shipmentType + " " + "Pieces");
      this.maintainLocationForm.get('ShpTypeWeightLabel').setValue(this.shipmentType.shipmentType + " " + "Weight");
      this.isTableFlg = false;
      this.saveFlag = true;
      if (!this.showResponseErrorMessages(data)) {
        if (data.data != null) {
          if (data.data.shipmentTypeflag == 'EXPORT') {
            this.FrieghtFlag = true;
          }
          else {
            this.FrieghtFlag = false;
          }
          this.lastUpdatedTime = data.data.lastUpdatedTime;
          this.isTableFlg = true;
          this.resp = data.data;
          this.showresp = this.resp;
          this.totalpiecesInv = 0;
          this.totalweightInv = 0;
          this.totalChargeableWeightInv = 0;
          this.totalFrightPieces = 0;
          this.totalFreightWeight = 0;
          this.totalFreightChargeableWeight = 0;
          this.count = 0;
          this.FlightLabelcount = 0;
          this.showresp.shipmentInventories.forEach(ele => {
            ele['select'] = false;
            ele['flightKeyOld'] = ele.flightKey;
            ele['flightKeyDateOld'] = ele.flightKeyDate;

            this.totalpiecesInv += ele.piecesInv;
            this.totalweightInv += ele.weightInv;
            if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
              this.totalChargeableWeightInv += ele.chargeableWeightInv;
            }
            ele.unableToLocate = null;

            //Handling Area
            if (ele.handlingArea === null) {
              ele['handlingArea'] = userInfo.terminalId;
            }

            //
            if (ele.shcListInv && ele.shcListInv.length <= 0) {
              ele.shcListInv = [];
            }
            if (data.data.partShipment == false && (ele.deliveryRequestOrderNo || ele.assignedUldTrolley || ele.deliveryOrderNo)) {
              this.count++;
            }
            if (ele.assignedUldTrolley && this.showresp.shipmentTypeflag == 'TRANS') {
              ele['OutboundflightKey'] = ele.flightKey;
              ele['OutboundflightKeyDate'] = ele.flightKeyDate;
              ele['flightKey'] = null;
              ele['flightKeyDate'] = null;
              this.FlightLabelcount++;

            } else {
              ele['OutboundflightKey'] = null;
              ele['OutboundflightKeyDate'] = null;
            }
          });
          if (this.showresp.freightOutArray != null) {
            this.showresp.freightOutArray.forEach(elem => {
              this.totalFrightPieces += elem.piecesFreightOut;
              this.totalFreightWeight += elem.weightFreightOut;
              if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
                this.totalFreightChargeableWeight += elem.chargeableWeightFreightOut;
              }
            })
          }
          this.totalpieces = this.totalpiecesInv + this.totalFrightPieces;
          this.totalWeight = this.totalweightInv + this.totalFreightWeight;
          if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
            this.totalChargeableWeight = this.totalChargeableWeightInv + this.totalFreightChargeableWeight;
          }

          if (this.showresp.freightOutArray.length == 0) {
            this.isTableFlgforfreightout = false;
          } else {
            this.isTableFlgforfreightout = true;
          }
          if (this.showresp.bookingDetails && this.showresp.bookingDetails.length > 0 && this.showresp.flagForPartSuffixDropdown == true) {
            this.displayDocInfoTable = true;
            this.displayBookingInfoTable = true;
          } else {
            this.displayDocInfoTable = false;
            this.displayBookingInfoTable = false;
          }
          if (this.showresp['freightOutArray'] != null) {
            for (let index = 0; index < this.showresp['freightOutArray'].length; index++) {
              this.showresp['freightOutArray'][index]['sno'] = index + 1;
            }
          }

          this.partSuffixListDisplay = data.data.partSuffixList;
          if (this.showresp.flagForPartSuffixDropdown == true
            && this.partSuffixListDisplay != null && this.partSuffixListDisplay.length > 0
            && data.data.shipmentTypeflag != 'IMPORT') {
            this.suffixValuesExist = true;
          }
          //  (<NgcFormArray>this.maintainLocationForm.get("partSuffixList")).addValue(data.data.partSuffixList)
          if (this.partSuffixListDisplay != null && this.partSuffixListDisplay.length == 1) {
            this.maintainLocationForm.get('partSuffix').setValue(data.data.partSuffixList[0]);
          }
          this.maintainLocationForm.patchValue(this.showresp);
        }
        else {
          this.isTableFlg = false;
        }
      }
      this.CalculateRemainingWeight();
    }, error => {
      this.showErrorMessage(error);
    });
  }

  public onShcChanges(event, index) {
    this.maintainLocationForm.get(['shipmentInventories', index, 'shcDummy']).setErrors(null);
  }

  updateBookingPcsWt() {
    this.updateBookingObject = {
      shipmentNumber: this.maintainLocationForm.get('shipmentNumber').value,
      shipmentDate: this.maintainLocationForm.get('shipmentDate').value
    }
    this.updateBookingWindow.open();

  }
  closeUpdateBooking() {
    this.updateBookingWindow.close();
  }
  clickAddRow() {
    const request = this.maintainLocationForm.getRawValue();
    let userInfo: UserProfile = this.getUserProfile();
    const noOfRows = (<NgcFormArray>this.maintainLocationForm.get('shipmentInventories')).length;
    const lastRow = noOfRows ? (<NgcFormArray>this.maintainLocationForm.get('shipmentInventories')).controls[noOfRows - 1] : null;
    this.ShipmentIDlist = request.shipmentId;
    this.houseIDlist = request.houseInformation.houseId;
    let inv = new ShipmentInventory();
    inv.shipmentNumber = request.shipmentNumber;
    inv.partSuffix = request.partSuffix;
    if (request.shipmentTypeflag == 'TRANS' && request.partSuffix != null) {

      this.awbManagementService.retiveInboundFlightDetailsForPartSuffix(inv).subscribe(data => {
        if (data.data != null) {
          (<NgcFormArray>this.maintainLocationForm.get('shipmentInventories')).at(noOfRows).get('flightKey').setValue(data.data.flightKey);
          (<NgcFormArray>this.maintainLocationForm.get('shipmentInventories')).at(noOfRows).get('flightKeyDate').setValue(data.data.flightKeyDate);
        }

      }
      );
    }

    let shcArray = new Array();
    if (this.handledbyHouse) {
      request.houseInformation.hwbSHC.forEach(ele => {
        let shc: any = new Object();
        shc.shcInv = ele;
        shcArray.push(shc);
      })
    } else {
      request.shcList.forEach(ele => {
        let shc: any = new Object();
        shc.shcInv = ele;
        shcArray.push(shc);
      })
    }

    request.shipmentInventories.forEach(elem => {
      this.inventoryData = {
        flight_ID: elem.flight_ID,
        flightKey: elem.flightKey,
        flightKeyDate: elem.flightKeyDate
      }
    })

    request.arrivalFltlist.forEach(ele => {
      this.flightList = {
        flight_ID: ele.flight_ID,
        flightKey: ele.flightKey,
        flightDate: ele.flightDate,
        arrivalShipmentShcs: ele.arrivalShipmentShcs
      }
    });

    if (request.partShipment || (lastRow == null && request.arrivalFltlist.length == 0) || (lastRow != null && (lastRow.value.flightKey == null || lastRow.value.assignedUldTrolley))) {


      (<NgcFormArray>this.maintainLocationForm.get("shipmentInventories"))
        .addValue([{
          oldShipmentLocation: null, oldPiecesInv: null, oldWeightInv: null, oldChargeableWeightInv: null, oldWarehouseLocation: null,
          select: null, shipmentLocation: null, piecesInv: null, weightInv: 0.0, chargeableWeightInv: 0.0, warehouseLocation: null, actualLocation: null,
          flightId: null, shipmentId: this.ShipmentIDlist, houseId: this.houseIDlist, flightKeyOld: null, flightKeyDateOld: null,
          flightKey: null, flightKeyDate: null, OutboundflightKey: null, OutboundflightKeyDate: null,
          shcListInv: (shcArray && shcArray.length > 0 ? shcArray : []), handlingArea: userInfo.terminalId, hold: null, unableToLocate: null, deliveryRequestOrderNo: null,
          deliveryOrderNo: null, assignedUldTrolley: null, shcDummy: null, referenceDetails: null, autoloadFlag: null, partSuffix: request.partSuffix, accessLocation: true, sector: null, dipSvcSTATS: null, holdRemarks: null, byPass: null, packing: null
        }]);
    }
    else if (request.arrivalFltlist.length == 0) {
      (<NgcFormArray>this.maintainLocationForm.get("shipmentInventories"))
        .addValue([{
          oldShipmentLocation: null, oldPiecesInv: null, oldWeightInv: null, oldChargeableWeightInv: null, oldWarehouseLocation: null,
          select: null, shipmentLocation: null, piecesInv: null, weightInv: 0.0, chargeableWeightInv: 0.0, warehouseLocation: null, actualLocation: null,
          flightId: this.inventoryData.flight_ID, shipmentId: this.ShipmentIDlist, houseId: this.houseIDlist, flightKeyOld: null, flightKeyDateOld: null,
          flightKey: this.inventoryData.flightKey, flightKeyDate: this.inventoryData.flightKeyDate,
          OutboundflightKey: null, OutboundflightKeyDate: null,
          shcListInv: (shcArray && shcArray.length > 0 ? shcArray : []), handlingArea: userInfo.terminalId, hold: null, unableToLocate: null, deliveryRequestOrderNo: null,
          deliveryOrderNo: null, assignedUldTrolley: null, shcDummy: null, referenceDetails: null, autoloadFlag: null, partSuffix: request.partSuffix, accessLocation: true, sector: null, dipSvcSTATS: null, holdRemarks: null, byPass: null, packing: null
        }]);
    }
    else {
      let impFlightId; let impFlightKey; let impFightDate; let imparrivalShipmentShcs;
      if (this.flightList) {
        // Manifest Shcs List
        let impShcArray = new Array();
        this.flightList.arrivalShipmentShcs.forEach(ele => {
          let shc: any = new Object();
          shc.shcInv = ele;
          impShcArray.push(shc);
        })

        impFlightKey = this.flightList.flightKey;
        impFightDate = this.flightList.flightDate;
        //setting shipmentLevel Shcs
        imparrivalShipmentShcs = shcArray;
      }
      (<NgcFormArray>this.maintainLocationForm.get("shipmentInventories"))
        .addValue([{
          oldShipmentLocation: null, oldPiecesInv: null, oldWeightInv: null, oldChargeableWeightInv: null, oldWarehouseLocation: null,
          select: null, shipmentLocation: null, piecesInv: 0, weightInv: 0.0, chargeableWeightInv: 0.0, warehouseLocation: null, actualLocation: null,
          flightId: 0, shipmentId: this.ShipmentIDlist, houseId: this.houseIDlist, flightKeyOld: null, flightKeyDateOld: null,
          flightKey: impFlightKey, flightKeyDate: impFightDate,
          OutboundflightKey: null, OutboundflightKeyDate: null,
          shcListInv: (imparrivalShipmentShcs && imparrivalShipmentShcs.length > 0 ? imparrivalShipmentShcs : []), handlingArea: userInfo.terminalId, hold: null, unableToLocate: null, deliveryRequestOrderNo: null,
          deliveryOrderNo: null, assignedUldTrolley: null, shcDummy: null, referenceDetails: null, autoloadFlag: null, partSuffix: request.partSuffix, accessLocation: true, sector: null, dipSvcSTATS: null, holdRemarks: null, byPass: null, packing: null
        }]);
    }
    this.async(() => {
      try {
        (this.maintainLocationForm.get(['shipmentInventories', noOfRows, 'shipmentLocation']) as NgcFormControl).focus();
      } catch (e) { }
    }, 1);

  }

  onSave() {

    if (!this.isTableFlg) {
      return;
    }

    if (this.maintainLocationForm.invalid) {
      this.showErrorMessage('expaccpt.fill.all.mandatory.details');
      return;
    }
    if (!this.handledbyHouse) {
      this.maintainLocationForm.get('houseInformation').reset();
    }


    const requestform = this.maintainLocationForm.getRawValue();
    const request = (<NgcFormArray>this.maintainLocationForm.get("shipmentInventories")).getRawValue();
    const requestForFreightOutData = (<NgcFormArray>this.maintainLocationForm.get("freightOutArray")).getRawValue();
    const requestHouseInfo = this.maintainLocationForm.get("houseInformation").value;
    this.requestobj = requestform;

    if (!this.handledbyHouse) {
      requestform.hwbNumber = null;
    }
    else {
      this.requestobj.weight = requestHouseInfo.hwbWeight;
      this.requestobj.pieces = requestHouseInfo.hwbPieces;
      if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
        this.requestobj.chargeableWeight = requestHouseInfo.hwbChgWeight;
      }
    }

    const requestObject = {
      shipmentNumber: this.requestobj.shipmentNumber,
      shipmentType: this.requestobj.shipmentType,
      origin: this.requestobj.origin,
      destination: this.requestobj.destination,
      pieces: this.requestobj.pieces,
      weight: this.requestobj.weight,
      chargeableWeight: this.requestobj.chargeableWeight,
      shipmentTypeflag: this.requestobj.shipmentTypeflag,
      shcList: this.requestobj.shcList,
      lastUpdatedTime: this.lastUpdatedTime,
      shipmentInventories: request,
      houseInformation: requestHouseInfo,
      flightId: requestform.flightId,
      freightOutArray: requestForFreightOutData,
      hwbNumber: requestform.hwbNumber
    }

    this.resetFormMessages();
    this.awbManagementService.insertAddedDetails(requestObject).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        const response = data.data;
        if (response) {
          if (data.data.isShipmentTargetted) {
            this.showInfoStatus('awb.shipment.autokc.targeted');
          }
          this.onSearch();
          this.autoSearchShipmentInfo.emit(true)
          this.showSuccessStatus('g.completed.successfully');
        }
      }
    }, error => {
      this.showErrorStatus(error);
    });

  }

  onMerge() {
    let mergesave = this.maintainLocationForm.getRawValue();
    mergesave.shipmentType = this.shipmentType;
    let arraytoMerge = new Array();
    let errorIndex;
    let errorMessage;

    mergesave.shipmentInventories.forEach((element, index) => {
      if (element.select) {
        arraytoMerge.push(element);
      }
    });

    this.requestobj = mergesave;

    const requestObject = {
      shipmentTypeflag: this.requestobj.shipmentTypeflag,
      shipmentNumber: this.requestobj.shipmentNumber,
      shipmentType: this.requestobj.shipmentType,
      origin: this.requestobj.origin,
      destination: this.requestobj.destination,
      pieces: this.requestobj.pieces,
      weight: this.requestobj.weight,
      natureOfGoods: this.requestobj.natureOfGoods,
      shcList: this.requestobj.shcList,
      shipmentInventories: arraytoMerge,
      partSuffix: this.requestobj.partSuffix
    }

    if (arraytoMerge.length < 2) {
      this.showErrorStatus('awb.select.two.locations.merge');
    } else {
      for (let i of arraytoMerge) {
        if (i.flightKey != arraytoMerge[0].flightKey) {
          this.showErrorStatus('awb.diff.flight.cant.merge');
          return;
        }
      }
      this.navigateTo(this.router, '/awbmgmt/mergeshipmentLocation', requestObject);
    }
  }


  onSplit() {
    let splitsave = this.maintainLocationForm.getRawValue();
    splitsave.shipmentType = this.shipmentType;
    let arraytoSplit = new Array();

    for (const inventory of splitsave.shipmentInventories) {
      if (inventory.select) {
        arraytoSplit.push(inventory);
      }
    }
    let house = this.maintainLocationForm.get('houseInformation').value;

    this.requestobj = splitsave;

    const requestObject = {
      shipmentTypeflag: this.requestobj.shipmentTypeflag,
      shipmentNumber: this.requestobj.shipmentNumber,
      shipmentType: this.requestobj.shipmentType,
      origin: this.requestobj.origin,
      destination: this.requestobj.destination,
      pieces: this.requestobj.pieces,
      weight: this.requestobj.weight,
      natureOfGoods: this.requestobj.natureOfGoods,
      shcList: this.requestobj.shcList,
      shipmentInventories: arraytoSplit,
      partSuffix: this.requestobj.partSuffix,
      partSuffixListDisplay: this.partSuffixListDisplay,
      suffixValuesExist: this.suffixValuesExist,
      chargeableWeight: this.requestobj.chargeableWeight,
      handledbyHouse: this.handledbyHouse,
      hwbNumber: this.requestobj.houseInformation.hwbNumber,
      houseInformation: house
    }
    if (arraytoSplit.length == 1) {
      this.navigateTo(this.router, '/awbmgmt/splitshipmentLocation', requestObject);
    } else if (arraytoSplit.length > 1) {
      this.showErrorStatus('awb.multi.loc.cant.split');
    } else {
      this.showErrorStatus('awb.select.loc.to.split');
    }
  }

  deleteUld(event, index) {

    if (this.maintainLocationForm.get(['shipmentInventories', index, 'flagCRUD']).value === 'C') {
      (<NgcFormArray>this.maintainLocationForm.controls['shipmentInventories']).removeAt(index);
    } else {
      if (this.maintainLocationForm.get(['shipmentInventories', index, 'accessLocation']).value) {
        this.showErrorMessage("awb.cannot.del.loc");
        return;
      } else {
        this.maintainLocationForm.get(['shipmentInventories', index, 'flagDelete']).setValue('Y');
        let deleteInventory = this.maintainLocationForm.getRawValue();
        this.showConfirmMessage('export.wish.to.delete.confirmation').then(fulfilled => {
          this.awbManagementService.deleteInventory(deleteInventory).subscribe(data => {
            if (!this.showResponseErrorMessages(data)) {
              const response = data.data;
              if (response) {
                this.onSearch();
                this.showSuccessStatus('g.completed.successfully');
              }
            }
          }, error => {
            this.showErrorMessage(error);
          })
        })
      }
    }
  }

  public onBack(event) {
    this.navigateBack(this.maintainLocationForm.getRawValue);
  }

  public onHoldShipment() {
    const request = this.maintainLocationForm.getRawValue();
    const obj = {
      shipmentId: request.shipmentId,
      shipmentNumber: request.shipmentNumber,
      shipmentType: this.shipmentType,
      hwbNumber: request.hwbNumber
    }
    this.navigateTo(this.router, '/awbmgmt/shipmentonhold', obj);
  }

  public onDisplayUldTrolley() {
    const request = this.maintainLocationForm.getRawValue();
    this.UldCount = 0;
    request.shipmentInventories.forEach(ele => {
      if (ele.select) {
        this.UldCount++;
        this.UldorTrolley = ele.shipmentLocation;
      }
    });
    if (this.UldCount == 0) {
      this.showErrorMessage("import.delivery.inventory.mandatory");
    }
    else if (this.UldCount > 1) {
      this.showErrorMessage("awb.select.only.one.loc");
    } else {
      const obj = {
        uldTrolleyFlag: true,
        uldNumber: this.UldorTrolley
      }
      this.navigateTo(this.router, '/uld/uldenquire', obj);
    }
  }

  public onShipmentInformation() {
    const request = this.maintainLocationForm.getRawValue();
    const obj = {
      shipmentId: request.shipmentId,
      shipmentNumber: request.shipmentNumber,
      shipmentType: this.shipmentType
    }
    this.navigateTo(this.router, '/awbmgmt/shipmentinfoCR', obj);
  }

  public onHAWBInformation() {
    const request = this.maintainLocationForm.getRawValue();
    const obj = {
      shipmentId: request.shipmentId,
      shipmentNumber: request.shipmentNumber,
      shipmentType: this.shipmentType,
      hwbNumber: request.hwbNumber
    }
    this.navigateTo(this.router, 'awbmgmt/hwb-informationCR', obj);
  }

  public navigateToUploadPhoto(): void {
    let url = "/common/capturephoto";
    let shipmentData: any = null;
    shipmentData = {
      entityType: this.maintainLocationForm.get('shipmentType').value,
      entityKey: this.maintainLocationForm.get('shipmentNumber').value,
      entityKey2: this.maintainLocationForm.get('hwbNumber').value,
      associatedTo: "Shipment",
      stage: "Break_Down"
    };
    console.log(shipmentData);
    this.navigateTo(this.router, url, shipmentData);


  }
  public CalculateRemainingPieces(event, index) {
    const requestform = this.maintainLocationForm.getRawValue();
    let count = 0;
    // Pieces and Weight without row
    let notRowPieces = 0;
    let notRowWeight = 0;
    let notRowChargeableWeight = 0;
    this.inventoryPieces = 0;
    this.inventoryWeight = 0;
    this.inventoryChargeableWeight = 0;
    this.totalFrightPieces = 0;
    this.totalFreightWeight = 0;
    this.totalFreightChargeableWeight = 0;
    this.totalpieces = 0;
    let remainingManifestPieceWithoutCalculation = 0;
    let remainingManifestWeightWithoutCalculation = 0;
    let remainingManifestChargeableWeightWithoutCalculation = 0;
    //If AWB weight is equal to inventory weight, Weight will be auto populated
    const request = (<NgcFormArray>this.maintainLocationForm.get("shipmentInventories")).getRawValue();
    if (this.handledbyHouse) {
      remainingManifestPieceWithoutCalculation = requestform.houseInformation.hwbPieces;
      remainingManifestWeightWithoutCalculation = requestform.houseInformation.hwbWeight;
      if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
        remainingManifestChargeableWeightWithoutCalculation = requestform.houseInformation.hwbChgWeight;
      }
    } else {
      remainingManifestPieceWithoutCalculation = requestform.pieces;
      remainingManifestWeightWithoutCalculation = requestform.weight;
      if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
        remainingManifestChargeableWeightWithoutCalculation = requestform.chargeableWeight;
      }
    }
    requestform.shipmentInventories.forEach(ele => {
      this.inventoryPieces += Number(ele.piecesInv);
      this.inventoryWeight += Math.floor(Number(ele.weightInv) * 10) / 10;
      if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
        this.inventoryChargeableWeight += Math.floor(Number(ele.chargeableWeightInv) * 100) / 100;
      }
      if (this.handledbyHouse && index == 0 && Number(requestform.houseInformation.hwbPieces) == Number(request[0].piecesInv)) {
        ele.weightInv = Number(NgcUtility.getDisplayWeight((requestform.houseInformation.hwbWeight)));
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
          ele.chargeableWeightInv = Number(NgcUtility.getDisplayWeight((requestform.houseInformation.hwbChgWeight)));
        }
      }
      if (index == 0 && Number(requestform.pieces) == Number(request[0].piecesInv)) {
        ele.weightInv = Number(NgcUtility.getDisplayWeight((requestform.weight)));
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
          ele.chargeableWeightInv = Number(NgcUtility.getDisplayWeight((requestform.chargeableWeight)));
        }
      }


      if (count !== index) {
        notRowPieces += Number(ele.piecesInv);
        notRowWeight += Number(ele.weightInv);
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
          notRowChargeableWeight += Number(ele.chargeableWeightInv);
        }
        remainingManifestPieceWithoutCalculation = Number(remainingManifestPieceWithoutCalculation - ele.piecesInv);
        remainingManifestWeightWithoutCalculation = Number(remainingManifestWeightWithoutCalculation - ele.weightInv);
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
          remainingManifestChargeableWeightWithoutCalculation = Number(remainingManifestChargeableWeightWithoutCalculation - ele.chargeableWeightInv);

        }
      }
      count++;
    });
    if (this.showresp.freightOutArray != null) {
      this.showresp.freightOutArray.forEach(elem => {
        this.totalFrightPieces += Number(elem.piecesFreightOut);
        this.totalFreightWeight += Number(elem.weightFreightOut);
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
          this.totalFreightChargeableWeight += Number(elem.chargeableWeightFreightOut);
        }
      })
    }
    this.totalpieces = this.inventoryPieces + this.totalFrightPieces;
    if (this.handledbyHouse) {
      if (this.totalpieces > this.maintainLocationForm.get('houseInformation').get('hwbPieces').value) {
        this.maintainLocationForm.get('houseInformation').get('hwbPieces').value - this.totalpieces == 0;
      }

      if (this.inventoryPieces >= requestform.houseInformation.hwbPieces) {
        if (Number(requestform.houseInformation.hwbWeight - notRowWeight) > 0) {
          this.maintainLocationForm.get(['shipmentInventories', index, 'weightInv']).setValue(Number((requestform.houseInformation.hwbWeight - notRowWeight)).toFixed(1));
        } else {
          this.maintainLocationForm.get(['shipmentInventories', index, 'weightInv']).setValue(0.0);
        }
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
          if (Number(requestform.houseInformation.hwbChgWeight - notRowChargeableWeight) > 0) {
            this.maintainLocationForm.get(['shipmentInventories', index, 'chargeableWeightInv']).setValue(Number((requestform.houseInformation.hwbChgWeight - notRowChargeableWeight)).toFixed(2));
          } else {
            this.maintainLocationForm.get(['shipmentInventories', index, 'chargeableWeightInv']).setValue(0.0);
          }
        }
        return;
      }
      else {
        if (requestform.shipmentInventories.length > 1) {
          this.maintainLocationForm.get(['shipmentInventories', index, 'weightInv']).setValue(Number((event * (remainingManifestWeightWithoutCalculation / remainingManifestPieceWithoutCalculation))).toFixed(1));
          if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
            this.maintainLocationForm.get(['shipmentInventories', index, 'chargeableWeightInv']).setValue(Number((event * (remainingManifestChargeableWeightWithoutCalculation / remainingManifestPieceWithoutCalculation))).toFixed(2));
          }
        } else {
          this.maintainLocationForm.get(['shipmentInventories', index, 'weightInv']).setValue(Number((event * (requestform.houseInformation.hwbWeight / requestform.houseInformation.hwbPieces))).toFixed(1));
          if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
            this.maintainLocationForm.get(['shipmentInventories', index, 'chargeableWeightInv']).setValue(Number((event * (requestform.houseInformation.hwbChgWeight / requestform.houseInformation.hwbPieces))).toFixed(2));
          }
        }
      }

    }
    else {
      if (this.totalpieces > this.maintainLocationForm.get('pieces').value) {
        this.maintainLocationForm.get('pieces').value - this.totalpieces == 0;
      }
      if (this.inventoryPieces >= requestform.pieces) {
        if (Number(requestform.weight - notRowWeight) > 0) {
          this.maintainLocationForm.get(['shipmentInventories', index, 'weightInv']).setValue(Number((requestform.weight - notRowWeight)).toFixed(1));
        } else {
          this.maintainLocationForm.get(['shipmentInventories', index, 'weightInv']).setValue(0.0);
        }
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
          if (Number(requestform.chargeableWeight - notRowChargeableWeight) > 0) {
            this.maintainLocationForm.get(['shipmentInventories', index, 'chargeableWeightInv']).setValue(Number((requestform.chargeableWeight - notRowChargeableWeight)).toFixed(2));
          } else {
            this.maintainLocationForm.get(['shipmentInventories', index, 'chargeableWeightInv']).setValue(0.0);
          }
        }
        return;
      } else {
        if (requestform.shipmentInventories.length > 1) {
          this.maintainLocationForm.get(['shipmentInventories', index, 'weightInv']).setValue(Number((event * (remainingManifestWeightWithoutCalculation / remainingManifestPieceWithoutCalculation))).toFixed(1));
          if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
            this.maintainLocationForm.get(['shipmentInventories', index, 'chargeableWeightInv']).setValue(Number((event * (remainingManifestChargeableWeightWithoutCalculation / remainingManifestPieceWithoutCalculation))).toFixed(2));
          }
        } else {
          this.maintainLocationForm.get(['shipmentInventories', index, 'weightInv']).setValue(Number((event * (requestform.weight / requestform.pieces))).toFixed(1));
          if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
            this.maintainLocationForm.get(['shipmentInventories', index, 'chargeableWeightInv']).setValue(Number((event * (requestform.chargeableWeight / requestform.pieces))).toFixed(2));
          }
        }
      }
    }
  }

  public CalculateRemainingWeight() {
    const requestform = this.maintainLocationForm.getRawValue();
    this.inventoryPieces = 0;
    this.inventoryWeight = 0;
    this.inventoryChargeableWeight = 0;
    this.totalFrightPieces = 0;
    this.totalFreightWeight = 0;
    this.totalFreightChargeableWeight = 0;
    this.totalWeight = 0;
    this.remainingWeight = 0;
    requestform.shipmentInventories.forEach(ele => {
      this.inventoryPieces += Number(ele.piecesInv);
      this.inventoryWeight += Number(ele.weightInv);
      if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
        this.inventoryChargeableWeight += Number(ele.chargeableWeightFreightOut);
      }

    });
    if (this.showresp.freightOutArray != null) {
      this.showresp.freightOutArray.forEach(elem => {
        this.totalFrightPieces += Number(elem.piecesFreightOut);
        this.totalFreightWeight += Number(elem.weightFreightOut);
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
          this.totalFreightChargeableWeight += Number(elem.chargeableWeightFreightOut);
        }
      })
    }
    this.totalWeight = this.inventoryWeight + this.totalFreightWeight;
    if (!NgcUtility.isUndefined(this.handledbyHouse) && this.handledbyHouse) {
      if (this.totalWeight > this.maintainLocationForm.get('houseInformation').get('hwbWeight').value) {
        this.remainingWeight = 0;
      }
      else if (this.maintainLocationForm.get('houseInformation').get('hwbWeight').value >= this.totalWeight) {
        this.remainingWeight = this.maintainLocationForm.get('houseInformation').get('hwbWeight').value - this.totalWeight;
      }
    }
    else {
      if (this.totalWeight > this.maintainLocationForm.get('weight').value) {
        this.remainingWeight = 0;
      }
      else if (this.maintainLocationForm.get('weight').value >= this.totalWeight) {
        this.remainingWeight = this.maintainLocationForm.get('weight').value - this.totalWeight;

      }
    }
  }


  public CalculateRemainingChargeableWeight() {
    const requestform = this.maintainLocationForm.getRawValue();
    this.inventoryPieces = 0;
    this.inventoryWeight = 0;
    this.totalFrightPieces = 0;
    this.totalFreightWeight = 0;
    this.totalWeight = 0;
    requestform.shipmentInventories.forEach(ele => {
      this.inventoryPieces += Number(ele.piecesInv);
      this.inventoryWeight += Number(ele.weightInv);
    });
    if (this.showresp.freightOutArray != null) {
      this.showresp.freightOutArray.forEach(elem => {
        this.totalFrightPieces += Number(elem.piecesFreightOut);
        this.totalFreightWeight += Number(elem.weightFreightOut);
      })
    }
    this.totalWeight = this.inventoryWeight + this.totalFreightWeight;

    if (this.handledbyHouse && this.totalWeight > this.maintainLocationForm.get('houseInformation').get('hwbChgWeight').value) {
      this.maintainLocationForm.get('houseInformation').get('hwbChgWeight').value - this.totalWeight == 0;
    }
    if (!this.handledbyHouse && this.totalWeight > this.maintainLocationForm.get('chargeableWeight').value) {
      this.maintainLocationForm.get('chargeableWeight').value - this.totalWeight == 0;
    }
  }
  onCancel(event) {
    this.navigateBack(this.forwardedData);
  }


  private onShipmentSelect(event) {
    if (event.shipmentType) {
      this.maintainLocationForm.get('shipmentType').patchValue(event.shipmentType);
    }
    this.handledbyHouse = false;
    this.isTableFlg = false;
    this.maintainLocationForm.get('houseInformation').reset();
    this.maintainLocationForm.get('hwbNumber').patchValue(null);
    this.maintainLocationForm.get('hwbNumber').clearValidators();
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.hawbSourceParameters = this.createSourceParameter(this.maintainLocationForm.get('shipmentNumber').value);

      this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
        if (data != null && data.length > 0) {
          this.handledbyHouse = true;
          this.maintainLocationForm.get('hwbNumber').setValidators([Validators.required, Validators.maxLength(16)]);
          this.retrieveLOVRecords("HWBNUMBER", this.hawbSourceParameters).subscribe(data => {
            if (data != null && data.length == 1) {
              this.maintainLocationForm.get('hwbNumber').setValue(data[0].code);
            }

          })

        } else {
          this.handledbyHouse = false;
          this.maintainLocationForm.get('hwbNumber').clearValidators();
        }
      },
      );
    }
  }

  public fetchInboundFlightKeyandDate(event, index) {
    const requestform = this.maintainLocationForm.getRawValue();

    const request = (<NgcFormArray>this.maintainLocationForm.get("shipmentInventories")).getRawValue();
    let inv = new ShipmentInventory();
    inv.shipmentNumber = requestform.shipmentNumber;
    inv.partSuffix = this.maintainLocationForm.get(['shipmentInventories', index, 'partSuffix']).value;
    let flagCRUD = this.maintainLocationForm.get(['shipmentInventories', index, 'flagCRUD']).value;
    this.awbManagementService.retiveInboundFlightDetailsForPartSuffix(inv).subscribe(data => {
      if (data.data != null && flagCRUD == 'C') {
        this.maintainLocationForm.get(['shipmentInventories', index, 'flightKey']).setValue(data.data.flightKey);
        this.maintainLocationForm.get(['shipmentInventories', index, 'flightKeyDate']).setValue(data.data.flightKeyDate);
      }
    }
    );
  }

  onTabOutCheckHandledBy() {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      this.remainingWeight = 0;
      let search: SearchShipmentLocation = new SearchShipmentLocation();
      search.shipmentNumber = this.maintainLocationForm.get('shipmentNumber').value;
      search.shipmentType = this.shipmentType.shipmentType;
      search.appFeatures = null;
      this.awbManagementService.isHandledByHouse(search).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          if (data) {
            this.handledbyHouse = true;
            if (this.maintainLocationForm.get('houseInformation').get('hwbWeight').value >= this.totalWeight) {
              this.remainingWeight = this.maintainLocationForm.get('houseInformation').get('hwbWeight').value -
                this.totalWeight;
            }
          }
          else {
            this.handledbyHouse = false;
            if (this.maintainLocationForm.get('weight').value >= this.totalWeight) {
              this.remainingWeight = this.maintainLocationForm.get('weight').value -
                this.totalWeight;
            }
          }
        }
      })
    }
  }
  setAWBNumber(object) {
    this.isTableFlg = false;
    if (object.code == null) {
      this.hawbInvalid = true;
      this.showErrorStatus('hawb.invalid');
    }
    else {
      this.hawbInvalid = false;
      this.maintainLocationForm.get('hwbNumber').setValue(object.code);
    }
  }


  onLocationChange(data, index) {
    this.sectorId = data.parameter2;
    this.maintainLocationForm.get(['shipmentInventories', index, 'sector']).setValue(data.parameter2);
  }
  public createMaintainHouseForInventory(data, index) {
    this.maintainBreakdownHouseInfoFormGroup.get('houseNum').setValue('');
    this.maintainBreakdownHouseInfoFormGroup.get('breakdownHouseInfo').patchValue([]);
    this.shipmentInventoryId = data.value.shipmentInventoryId;
    this.shipmentId = data.value.shipmentId;
    this.maintainAddHouseIndex = index;
    this.inventoryPieces = data.value.piecesInv;
    this.inventoryWeight = data.value.weightInv;
    let houseModel = new ShipmentInventoryHouse();
    houseModel.shipmentId = data.value.shipmentId;
    houseModel.shipmentInventoryId = data.value.shipmentInventoryId;
    // this.awbManagementService.getInventoryHouseDetails(houseModel).subscribe((response) => {
    //   if (this.showResponseErrorMessages(response)) {
    //     return;
    //   }
    //   if (response.data != null) {
    //     this.maintainBreakdownHouseInfoFormGroup.get('breakdownHouseInfo').patchValue(response.data);
    //   }
    // })
    this.addMaintainHouseWindow.open();
  }
  onHouseWayBillPieceChange(event: any, index: any) {
    let hawbLineInfo = this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index]).value;
    hawbLineInfo.hawbBDWt = hawbLineInfo.hawbBDPcs * (hawbLineInfo.hawbWeight / hawbLineInfo.hawbPieces);
    (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbBDWt"]) as NgcFormControl).setValue(hawbLineInfo.hawbBDWt)
  }
  maintainAddNewHouse() {
    (<NgcFormArray>this.maintainBreakdownHouseInfoFormGroup.get('breakdownHouseInfo')).addValue([
      {
        shipmentInventoryId: this.shipmentInventoryId,
        shipmentId: this.shipmentId,
        shipmentHouseId: null,
        type: this.maintainLocationForm.get('shipmentType').value,
        houseNumber: null,
        hawbPieces: null,
        hawbWeight: null,
        hawbOrigin: null,
        hawbDestination: null,
        hawbNatureOfGoods: null,
        housePicecWeight: null,
        hawbBDPcs: null,
        hawbBDWt: null,
        hawbRemarks: null,
        flagCRUD: 'C'
      }
    ]);
  }
  saveMaintainHouseInfo(data: any, index: any) {
    let invalid = (<NgcFormArray>this.maintainBreakdownHouseInfoFormGroup.get("breakdownHouseInfo")).invalid;
    if (invalid) {
      this.showErrorMessage("import.please.enter.all.mandatory.fileds");
      return;
    }
    let controlData = (<NgcFormArray>this.maintainBreakdownHouseInfoFormGroup.get("breakdownHouseInfo")).value;
    if (controlData == null || controlData.length == 0) {
      this.showErrorMessage("export.add.atleast.one.record");
      return;
    }
    controlData.forEach(element => {
      element.shipmentInventoryId = Number(this.shipmentInventoryId);
      element.shipmentId = Number(this.shipmentId);
      element.shipmentNumber = this.maintainLocationForm.get('shipmentNumber').value;
      element.inventoryPieces = this.inventoryPieces;
      element.inventoryWeight = this.inventoryWeight;
    });
    // this.awbManagementService.createInventoryHouseWayBill(controlData).subscribe((response) => {
    //   if (this.showResponseErrorMessages(response)) {
    //     return;
    //   }
    //   this.showSuccessStatus('g.completed.successfully');
    //   this.addMaintainHouseWindow.close();
    //   this.onSearch();
    // })
  }
  setHouseInfo(data: any, index: any) {
    if (data.code != null) {
      (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "housePicecWeight"]) as NgcFormControl).setValue(data.param2 + "/" + data.param3);
      (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "shipmentHouseId"]) as NgcFormControl).setValue(Number(data.param1));
      (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbPieces"]) as NgcFormControl).setValue(Number(data.param2));
      (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbPieces"]) as NgcFormGroup).disable();
      (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbWeight"]) as NgcFormControl).setValue(Number(data.param3));
      (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbWeight"]) as NgcFormGroup).disable();
      (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbOrigin"]) as NgcFormControl).setValue(data.param4);
      (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbDestination"]) as NgcFormControl).setValue(data.param5);
      (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbNatureOfGoods"]) as NgcFormControl).setValue(data.param6);
    } else {
      (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbOrigin"]) as NgcFormControl).setValue(this.maintainLocationForm.get('origin').value);
      (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbDestination"]) as NgcFormControl).setValue(this.maintainLocationForm.get('destination').value);
      (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbNatureOfGoods"]) as NgcFormControl).setValue(this.maintainLocationForm.get('natureOfGoods').value);
    }
  }
  deleteBDHouse(data: any, index: any) {
    (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index]) as NgcFormControl).markAsDeleted();
  }

}
