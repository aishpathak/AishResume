import {
  Component,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild,
  OnInit, Input, Output, EventEmitter
} from '@angular/core';
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcUtility,
  NgcWindowComponent,
  DropDownListRequest,
  NgcButtonComponent, PageConfiguration
} from 'ngc-framework';
import {
  Validators,
  PatternValidator,
  FormControl,
  FormArray
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SearchIrregularityRequest,
  IrregularitySummary,
  IrregularityDetail,
  ShipmentInfoReqModel
} from '../awbManagement.shared';
import { AwbManagementService } from '../awbManagement.service';
import { element } from 'protractor';
import { ApplicationEntities } from '../../common/applicationentities';
import { AssociatedAirlinesForCustomer } from '../../admin/admin.sharedmodel';
import { ApplicationFeatures } from '../../common/applicationfeatures';



@Component({
  selector: 'app-maintain-shipment-irregularity',
  templateUrl: './maintain-shipment-irregularity.component.html',
  styleUrls: ['./maintain-shipment-irregularity.component.scss']
})
@PageConfiguration({
  trackInit: true,
  focusToBlank: true,
  callNgOnInitOnClear: true,
  //autoBackNavigation: true,
  restorePageOnBack: true,
  focusToMandatory: true
})
export class MaintainShipmentIrregularityComponent extends NgcPage
  implements OnInit {
  show: any = false;
  showButtons: any = false;
  maintain: IrregularitySummary;
  irr: IrregularityDetail;
  irrList: any[];
  irregularity: any = {};
  importFlag: any;
  importExportFlag: any;
  flightKeyFlag: any;
  flightDateFlag: any;
  addRowFlag: any;
  saveFlag: boolean = false;
  flagShowHAWBIrr: boolean = false;
  date: any;
  irrPieces: any;
  irregularityAdd: IrregularityDetail;
  irrDelete: any;
  search: any;
  status: any;
  fdlStatus = '';
  i: number;
  j = 1;
  k = 1;
  z = 0;
  y = 0;
  sum = 0;
  updatedIrregularityList: IrregularityDetail[] = [];
  update: number[] = [];
  ratio: any;
  nanFlagPiece = false;
  nanFlagWeight = false;
  sequenceNumber: number;
  shipmentNumber: string;
  hawbNumber: string;
  insert: IrregularitySummary;
  irrListLength = 0;
  shpType: any;
  irrListLength2: any;
  sourceIdSegmentDropdown: any;
  DropDownListRequest
  flagShowHAWBDetails: boolean = false;
  public maintainIrregularityform: NgcFormGroup = new NgcFormGroup({
    shipmentId: new NgcFormControl(),
    shipmentType: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(false),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    natureOfGoods: new NgcFormControl(),
    specialHandlingCodes: new NgcFormControl(),
    hawbshcs: new NgcFormControl(),
    bdPieceWeight: new NgcFormControl(),
    amPieceWeight: new NgcFormControl(),
    irregularityDetails: new NgcFormArray([]),
    irrType: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    maintainHouseList: new NgcFormArray([]),
    maintainhwbNumber: new NgcFormControl(),
    hwbDetails: new NgcFormGroup({
      hwbNumber: new NgcFormControl(),
      hwbOrigin: new NgcFormControl(),
      hwbDestination: new NgcFormControl(),
      hwbPieces: new NgcFormControl(),
      hwbWeight: new NgcFormControl(),
      hwbNatureOfGoods: new NgcFormControl(),
      hwbSHC: new NgcFormControl()
    })
  });
  totalDamagedPieces: any = 0;
  userName: any;
  irregularityType: any;
  transferData: any;
  handledbyHouse: boolean = false;
  rowShipmentIrregularityId = 0;
  mainMaintainHouseList: any[] = [];
  maintainError = new Map<String, String>();
  mapIrregularity = new Map<String, any>();
  hawbIrregularityType: String = "";
  maintainHouseIndex = "";

  @ViewChild('maintainHouse') maintainHouse: NgcWindowComponent;
  @ViewChild("shipmentType") shipmentType: any;
  @Input('shipmentNumberData') shipmentNumberData: string;
  @Input('shipmentTypeData') shipmentTypeData: string;
  @Input('hwbNumberData') hwbNumberData: string;
  @Input('showAsPopup') showAsPopup: boolean;
  @Output() closeShipmentIrregularityWindow = new EventEmitter<boolean>();
  @Output() autoSearchShipmentInfo = new EventEmitter<boolean>();
  constructor(
    private awbService: AwbManagementService,
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private irregularityService: AwbManagementService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.shipmentNumberData && this.shipmentTypeData) {
      this.maintainIrregularityform.get('shipmentNumber').patchValue(this.shipmentNumberData)
      this.maintainIrregularityform.get('shipmentType').patchValue(this.shipmentTypeData)
      this.maintainIrregularityform.get('hawbNumber').patchValue(this.hwbNumberData)
      this.getIrregularity()
    }
    else {
      this.maintainIrregularityform.get('shipmentType').patchValue('AWB');
      this.transferData = this.getNavigateData(this.activatedRoute);
      console.log(this.transferData);
      if (this.transferData != null) {
        this.maintainIrregularityform.patchValue(this.transferData);
        this.getIrregularity();
      }
    }
    this.userName = this.getUserProfile().userShortName;
  }

  public getIrregularity() {
    this.totalDamagedPieces = 0;
    this.show = false;
    this.flagShowHAWBIrr = false;
    this.maintainIrregularityform.get('hwbDetails').reset();
    this.flagShowHAWBDetails = false;
    const searchRequest: any = new Object();
    this.shipmentNumber = this.maintainIrregularityform.get('shipmentNumber').value;
    this.hawbNumber = this.maintainIrregularityform.get('hawbNumber').value;
    searchRequest.handledbyHouse = this.handledbyHouse;
    searchRequest.hawbNumber = this.hawbNumber;

    if (!this.shipmentNumber) {
      this.showErrorStatus('g.enter.awb')
      return;
    }
    else {
      this.saveFlag = true;
      if (this.transferData != null) {
        searchRequest.shipmentType = 'AWB';
      } else {
        searchRequest.shipmentType = this.shipmentType.shipmentType;

        if (searchRequest.shipmentType == null) {
          searchRequest.shipmentType = this.shipmentTypeData
        }
      }
      searchRequest.shipmentNumber = this.shipmentNumber;


      this.shpType = searchRequest.shipmentType;
      this.search = {
        shipmentType: searchRequest.shipmentType,
        shipmentNumber: searchRequest.shipmentNumber,
        hawbNumber: searchRequest.hawbNumber,
        handledbyHouse: searchRequest.handledbyHouse
      };

      this.irregularityService.getIrregularityDetails(this.search).subscribe(
        data => {
          let resp: any = data.data;
          if (!this.showResponseErrorMessages(data)) {

            this.irregularityType = this.createSourceParameter(this.shipmentType.shipmentType);
            this.insert = data.data;
            if (NgcUtility.isTenantCityOrAirport(resp.origin)) {
              this.importExportFlag = 'EXP';
            } else {
              this.importExportFlag = 'IMP';
            }
            if (resp.damageDetails) {
              resp.damageDetails.forEach(value => {
                this.totalDamagedPieces += value.damagedPieces;
              });
            }

            this.maintainIrregularityform.patchValue(resp);

            if (resp.irregularityDetails.length) {
              resp.irregularityDetails.forEach(e => {

                if (e['flightKey'] == null) {
                  e['flightKey'] = '';
                }
                e['flightDate'] = e['flightDate'];
                e['select'] = false;
                e['user'] =
                  e['createdBy'] +
                  ' ' +
                  NgcUtility.getDateAsString(e['createdOn']) +
                  ' ' +
                  NgcUtility.getTimeAsString(e['createdOn']);
                e['flagInsert'] = 'N';
                e['flagUpdate'] = 'N';
                e['flagDelete'] = 'N';
                e['flagCRUD'] = 'R';
                e['shipmentNumber'] = this.shipmentNumber;
                if (!e.pieces) {
                  e.pieces = '';
                }
                this.irrListLength++;
              });
            }
            (<NgcFormArray>this.maintainIrregularityform.controls[
              'irregularityDetails'
            ]).patchValue(data.data.irregularityDetails);
            //save HAWB Irregularity after reload
            const irregularityDetails: any[] = this.maintainIrregularityform.get('irregularityDetails').value;
            //HAWB irregularity
            if (resp.irregularityDetailsHAWB.length) {
              resp.irregularityDetailsHAWB.forEach(e => {

                if (e['flightKey'] == null) {
                  e['flightKey'] = '';
                }
                e['flightDate'] = e['flightDate'];
                e['select'] = false;
                e['user'] =
                  e['createdBy'] +
                  ' ' +
                  NgcUtility.getDateAsString(e['createdOn']) +
                  ' ' +
                  NgcUtility.getTimeAsString(e['createdOn']);
                e['flagInsert'] = 'N';
                e['flagUpdate'] = 'N';
                e['flagDelete'] = 'N';
                e['flagCRUD'] = 'R';
                e['shipmentNumber'] = this.shipmentNumber;
                if (!e.pieces) {
                  e.pieces = '';
                }
                this.irrListLength++;
              });
            }
            if (data.data.irregularityDetailsHAWB.length > 0) {
              (<NgcFormArray>this.maintainIrregularityform.controls[
                'irregularityDetailsHAWB'
              ]).patchValue(data.data.irregularityDetailsHAWB);
              this.flagShowHAWBIrr = true;
            } else {
              this.flagShowHAWBIrr = false;
            }



            if (data.data.shipmentHouseInfo != null) {
              this.maintainIrregularityform.controls['hwbDetails'].patchValue(data.data.shipmentHouseInfo);
              this.maintainIrregularityform.get('hwbDetails').get('hwbSHC').setValue(data.data.specialHandlingCodeHAWB);
              this.flagShowHAWBDetails = true;
            }
            console.log(this.maintainIrregularityform.get('hwbDetails').get('hwbSHC').value);

            console.log(this.maintainIrregularityform.value);
            this.retrieveDropDownListRecords('CARGO_IRREGULARITIES', 'query', {})
              .subscribe(response => {
                response.forEach(value => {
                  this.mapIrregularity.set(value.code, value);
                });
                let index = 0;
                data.data.irregularityDetails.forEach(value => {
                  let obj = this.mapIrregularity.get(value.irregularityType);
                  this.maintainIrregularityform.get(['irregularityDetails', index, 'irregularityCategory']).patchValue(obj.parameter2);
                  this.maintainIrregularityform.get(['irregularityDetails', index, 'irregularityWeightOnly']).patchValue(obj.booleanParameter2);
                  this.pieceValidCheck(value.irregularityType, index);
                  index++;
                });

                console.log(this.mapIrregularity);
              });

            this.showButtons = true;
            if (data.data.irregularityDetails.length > 0) {
              this.show = true;
            }
          } else {
            this.showButtons = false;
            this.show = false;
          }
          this.irrListLength = (<NgcFormArray>this.maintainIrregularityform.get(
            'irregularityDetails'
          )).length;


        },
        error => {
          this.showErrorMessage(error);
        }
      );
    }

  }

  public addRow(event) {
    this.date = new Date();
    this.show = true;
    this.sequenceNumber = (<NgcFormArray>this.maintainIrregularityform.get(
      'irregularityDetails'
    )).length + 1;
    (<NgcFormArray>this.maintainIrregularityform.controls[
      'irregularityDetails'
    ]).addValue([
      {
        select: false,
        sequenceNumber: this.sequenceNumber,
        shipmentNumber: this.maintainIrregularityform.get('shipmentNumber').value,
        irregularityType: '',
        shipmentIrregularityId: 0,
        pieces: '',
        weight: '',
        flightKey: '',
        flightDate: '',
        remark: '',
        fdlSentFlag: '',
        createdBy: this.userName,
        createdOn: this.date,
        user: '',
        flagInsert: 'Y',
        flagUpdate: 'N',
        flagDelete: 'N',
        additionalBulkWeight: 0.0,
        additionalBupWeight: 0.0,
        additionalActionRemarks: "",
        amPieceWeight: "0/0.0", bdPieceWeight: "0/0.0",
        irregularityCategory: "",
        irregularityWeightOnly: false,
        flightSegmentId: 0
      }
    ]);

  }

  public addRowHAWB(event) {
    this.date = new Date();
    this.flagShowHAWBIrr = true;
    this.sequenceNumber = (<NgcFormArray>this.maintainIrregularityform.get(
      'irregularityDetailsHAWB'
    )).length + 1;
    (<NgcFormArray>this.maintainIrregularityform.controls[
      'irregularityDetailsHAWB'
    ]).addValue([
      {
        select: false,
        sequenceNumber: this.sequenceNumber,
        shipmentNumber: this.maintainIrregularityform.get('shipmentNumber').value,
        irregularityType: '',
        pieces: '',
        weight: '',
        flightKey: '',
        flightDate: '',
        remark: '',
        fdlSentFlag: '',
        createdBy: this.userName,
        createdOn: this.date,
        user: '',
        flagInsert: 'Y',
        flagUpdate: 'N',
        flagDelete: 'N',
        flightSegmentId: 0
      }
    ]);

  }

  public onSave(event) {
    this.resetFormMessages();
    this.maintainError = new Map<String, String>();

    this.date = new Date();
    let req = this.maintainIrregularityform.getRawValue();
    let index = 0;
    let x = 0;
    let y = 0;
    let error = false;
    // check for finding sum of pieces for irregularity type MSCA
    let noSegment: boolean = false;

    req.irregularityDetails.forEach(a => {
      if (a.flightKey != null && a.flightDate != null && this.importExportFlag == 'IMP') {
        if (a.flightSegmentId == null || a.flightSegmentId == '') {
          noSegment = true;

        }

      }
      if ((a.pieces == a.oldpieces) && (a.weight == a.oldweight) && (a.remark == a.oldremark) && (a.flightKey == a.oldflightKey) &&
        (a.irregularityType == a.oldirregularityType && a.flightSegmentId == a.oldflightSegmentId) && a.flagCRUD == 'U' &&
        !(this.maintainIrregularityform.get(['irregularityDetails', index, 'additionalBulkWeight']).dirty ||
          this.maintainIrregularityform.get(['irregularityDetails', index, 'additionalBupWeight']).dirty ||
          this.maintainIrregularityform.get(['irregularityDetails', index, 'additionalActionRemarks']).dirty)) {
        a.flagCRUD = 'R';

      }


      // if (obj.parameter2 == "D" &&
      //   (a.additionalActionRemarks == "" || a.additionalActionRemarks == null)) {
      //   this.maintainError.set(a.irregularityType, "actionremarks.mandatory.dirregularity");
      // }
      index++;
    });

    this.maintainError.forEach((value: string, key: string) => {
      this.showErrorMessage(value);
    });
    if (this.maintainError.size != 0) {
      return;
    }
    index = 0;
    if (NgcUtility.isTenantCityOrAirport(req.origin)) {
      req.irregularityDetails.forEach(a => {
        if (a.irregularityType == 'MSCA') {
          x = x + a.pieces;

        }

      })

      if (req.pieces < x) {
        this.showErrorStatus("awb.msca.pcs.not.more.tot.pcs");
        return;
      }
    }

    if (NgcUtility.isTenantCityOrAirport(req.destination) || (!NgcUtility.isTenantCityOrAirport(req.destination) && !NgcUtility.isTenantCityOrAirport(req.origin))) {
      for (let item of req.irregularityDetails) {
        if (item.irregularityType == 'MSCA') {
          y = item.pieces
          if (req.pieces < y) {
            this.showErrorStatus("awb.msca.pcs.not.more.tot.pcs.flight");
            return;
          }
        }

      }
    }
    if (req.irregularityDetailsHAWB.length > 0 && req.irregularityDetailsHAWB != null) {
      let hawbPieces = 0;
      hawbPieces = this.maintainIrregularityform.get('hwbDetails').get('hwbPieces').value;
      for (let item of req.irregularityDetailsHAWB) {
        y = item.pieces
        if (item.irregularityType == 'MSCA') {
          if (y > hawbPieces) {
            this.showErrorStatus("awb.msca.pcs.not.more.tot.pcs.flight");
            return;
          }
        }

      }
    }





    if (req.irregularityDetails.length) {
      req.irregularityDetails.forEach(a => {
        this.maintainIrregularityform.get(['irregularityDetails', index, 'createdOn']).patchValue(this.date);
        this.maintainIrregularityform.get(['irregularityDetails', index, 'createdBy']).patchValue(this.userName);
        if (!a.pieces) {
          a.pieces = 0;
        }

        index++;
      })
    }
    if (req.irregularityDetails.length) {
      req.irregularityDetails.forEach(a => {
        a.flightDate = NgcUtility.getDateOnly(a.flightDate); // Added for Audit Trial
        index++;
      })
    }
    this.irregularityService
      .addUpdateIrregularityDetails(req).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus('g.operation.successful');

          this.getIrregularity();

          this.autoSearchShipmentInfo.emit(true)
        }
      }, error => {
        this.showErrorMessage(error);
      })

  }
  public onDelete(event) {
    if (!NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBInfo)) {

      let req = this.maintainIrregularityform.getRawValue();
      let index = 0;
      if (req.irregularityDetails.length) {
        req.irregularityDetails.forEach(a => {
          if (a['select']) {
            (<NgcFormArray>this.maintainIrregularityform.get('irregularityDetails')).markAsDeletedAt(index);
          }
          index++;
        });
      }
    } else {
      this.onDeletewithHouse(event);
    }
  }
  public onDeletewithHouse(event) {
    this.resetFormMessages();
    let req = this.maintainIrregularityform.getRawValue();
    let index = 0;
    if (req.irregularityDetails.length) {
      req.irregularityDetails.forEach(a => {
        if (a['select']) {
          let shipmentIrregularityId = this.maintainIrregularityform.get(['irregularityDetails', index, 'shipmentIrregularityId']).value;
          this.search.shipmentNumber = shipmentIrregularityId;
          if (shipmentIrregularityId == undefined) {
            this.maintainIrregularityform.get(['irregularityDetails', index, 'additionalBulkWeight']).reset();
            this.maintainIrregularityform.get(['irregularityDetails', index, 'additionalBupWeight']).reset();
            this.maintainIrregularityform.get(['irregularityDetails', index, 'additionalActionRemarks']).reset();
            (<NgcFormArray>this.maintainIrregularityform.get('irregularityDetails')).markAsDeletedAt(index);

          } else {
            const shipmentIrregularityIdD = this.maintainIrregularityform.get(['irregularityDetails', index, 'shipmentIrregularityId']).value;
            const removeIndex = index;
            const search = {
              shipmentType: this.search.shipmentType,
              hawbNumber: this.search.hawbNumber,
              handledbyHouse: this.search.handledbyHouse,
              shipmentNumber: shipmentIrregularityIdD
            };
            if (shipmentIrregularityIdD != undefined) {
              this.irregularityService.getIrregularityHWABDetails(search).subscribe((response: any) => {
                if (response.data == null || response.data.length == 0) {
                  (<NgcFormArray>this.maintainIrregularityform.get('irregularityDetails')).markAsDeletedAt(removeIndex);
                } else {
                  this.showErrorStatus('irregularity.cant.delete.house');
                  return;
                }
              });
            }
          }
        }
        index++;
      });
    }

    /*if (req.irregularityDetailsHAWB.length) {
      req.irregularityDetailsHAWB.forEach(a => {
        if (a['select']) {
          (<NgcFormArray>this.maintainIrregularityform.get('irregularityDetailsHAWB')).markAsDeletedAt(index);
        }
        index++;
      });
    }*/
  }

  public onDeleteHAWB(event) {

    let req = this.maintainIrregularityform.getRawValue();
    let index = 0;
    if (req.irregularityDetailsHAWB.length) {
      req.irregularityDetailsHAWB.forEach(a => {
        if (a['select']) {
          (<NgcFormArray>this.maintainIrregularityform.get('irregularityDetailsHAWB')).markAsDeletedAt(index);
        }
        index++;
      });
    }
  }

  onFdlSent(item, index) {
    let value = this.maintainIrregularityform.getRawValue();
    let flightDetails: any = new Object();
    flightDetails.flightNumber = value.irregularityDetails[index].flightKey;
    flightDetails.flightDate = value.irregularityDetails[index].flightDate;
    this.navigateTo(this.router, '/import/flightdiscrepancylist', flightDetails);
  }
  setIrregularity(data, index) {
    console.log(data);
    if (data.booleanParameter2) {
      this.maintainIrregularityform.get(['irregularityDetails', index, 'pieces']).clearValidators();
      this.maintainIrregularityform.get(['irregularityDetails', index, 'weight']).setValidators(Validators.required);

    } else {
      this.maintainIrregularityform.get(['irregularityDetails', index, 'pieces']).setValidators(Validators.required);
      this.maintainIrregularityform.get(['irregularityDetails', index, 'weight']).clearValidators();

    }

    this.maintainIrregularityform.get(['irregularityDetails', index, 'irregularityCategory']).setValue(data.parameter2);
    this.maintainIrregularityform.get(['irregularityDetails', index, 'irregularityWeightOnly']).setValue(data.booleanParameter2);
  }

  pieceValidCheck(item, index) {
    let obj = this.maintainIrregularityform.get(['irregularityDetails', index]).value;
    if (item == 'FDAW' || item == 'MSAW') {
      this.maintainIrregularityform.get(['irregularityDetails', index, 'pieces']).clearValidators();
    } else {
      this.maintainIrregularityform.get(['irregularityDetails', index, 'pieces']).setValidators(Validators.required);
    }
    if (obj.irregularityWeightOnly) {
      this.maintainIrregularityform.get(['irregularityDetails', index, 'pieces']).clearValidators();
      this.maintainIrregularityform.get(['irregularityDetails', index, 'weight']).setValidators(Validators.required);

    } else {
      this.maintainIrregularityform.get(['irregularityDetails', index, 'pieces']).setValidators(Validators.required);
      this.maintainIrregularityform.get(['irregularityDetails', index, 'weight']).clearValidators();

    }

  }

  pieceValidCheckHAWB(item, index) {
    if (item == 'FDAW' || item == 'MSAW') {
      this.maintainIrregularityform.get(['irregularityDetailsHAWB', index, 'pieces']).clearValidators();
    } else {
      this.maintainIrregularityform.get(['irregularityDetailsHAWB', index, 'pieces']).setValidators(Validators.required);
    }
  }


  onCancel(event) {
    this.navigateBack(this.transferData);
  }

  onFlightdetailsChange(index) {

    var requestdata = (<NgcFormArray>this.maintainIrregularityform.get(['irregularityDetails', index])).value;
    var parameters = { 'parameter1': requestdata.flightKey, 'parameter2': requestdata.flightDate };
    this.maintainIrregularityform.get(['irregularityDetails', index, 'flightSegmentId']).reset();
    var shipmentOrigin = this.maintainIrregularityform.get('origin').value;
    var shipmentDestination = this.maintainIrregularityform.get('destination').value;

    this.retrieveDropDownListRecords('IRREGULARITY_SEGMENT_DETAILS', 'query', parameters)
      .subscribe(response => {
        response.forEach(value => {
          if (NgcUtility.isTenantCityOrAirport(shipmentOrigin) && !NgcUtility.isTenantCityOrAirport(shipmentDestination)) {
            if (value.desc.includes(shipmentDestination)) {
              (<NgcFormArray>this.maintainIrregularityform.get(['irregularityDetails', index, 'flightSegmentId'])).setValue(value.code);
            }
          } else if (!NgcUtility.isTenantCityOrAirport(shipmentOrigin)) {
            if (value.desc.includes(shipmentOrigin)) {
              (<NgcFormArray>this.maintainIrregularityform.get(['irregularityDetails', index, 'flightSegmentId'])).setValue(value.code);
            }
          }
        });

      });
    if (requestdata.flightKey != "" && requestdata.flightDate != "") {
      this.irregularityService.searchAMBDPieceWeightByFlightKetDate(requestdata).subscribe((res: any) => {
        if (!this.showResponseErrorMessages(res)) {
          (<NgcFormArray>this.maintainIrregularityform.get(['irregularityDetails', index, 'amPieceWeight'])).setValue(res.data.amPieceWeight);
          (<NgcFormArray>this.maintainIrregularityform.get(['irregularityDetails', index, 'bdPieceWeight'])).setValue(res.data.bdPieceWeight);
        }

      });
    }
  }

  onFlightdetailsChangeHAWB(index) {

    var requestdata = (<NgcFormArray>this.maintainIrregularityform.get(['irregularityDetailsHAWB', index])).value;
    var parameters = { 'parameter1': requestdata.flightKey, 'parameter2': requestdata.flightDate };
    this.maintainIrregularityform.get(['irregularityDetailsHAWB', index, 'flightSegmentId']).reset();
    var shipmentOrigin = this.maintainIrregularityform.get('origin').value;
    var shipmentDestination = this.maintainIrregularityform.get('destination').value;
    this.retrieveDropDownListRecords('IRREGULARITY_SEGMENT_DETAILS', 'query', parameters)
      .subscribe(response => {
        response.forEach(value => {
          if (NgcUtility.isTenantCityOrAirport(shipmentOrigin) && !NgcUtility.isTenantCityOrAirport(shipmentDestination)) {
            if (value.desc.includes(shipmentDestination)) {
              (<NgcFormArray>this.maintainIrregularityform.get(['irregularityDetailsHAWB', index, 'flightSegmentId'])).setValue(value.code);
            }
          } else if (!NgcUtility.isTenantCityOrAirport(shipmentOrigin)) {
            if (value.desc.includes(shipmentOrigin)) {
              (<NgcFormArray>this.maintainIrregularityform.get(['irregularityDetailsHAWB', index, 'flightSegmentId'])).setValue(value.code);
            }
          }
        });

      })
  }
  onTabOutCheckHandledBy() {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      this.handledbyHouse = false;
      this.maintainIrregularityform.get('hawbNumber').patchValue("");
      this.maintainIrregularityform.get('hawbNumber').clearValidators();
      const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.maintainIrregularityform);
      const req: ShipmentInfoReqModel = new ShipmentInfoReqModel();
      req.shipmentNumber = searchFormGroup.get('shipmentNumber').value;
      this.handledbyHouse = false;
      this.awbService.isHandledByHouse(req).subscribe(response => {
        console.log(response);
        if (response) {
          this.handledbyHouse = true;
        }
        console.log(this.handledbyHouse);
      })
    }
  }
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  openMaintainHouse(index) {
    this.irregularity = this.maintainIrregularityform.get('irregularityDetails').value[index];
    this.maintainIrregularityform.get("maintainHouseList").patchValue([]);
    this.hawbIrregularityType = this.irregularity.irregularityType;
    this.irregularity.pieces;
    this.irregularity.weight;
    this.maintainHouseIndex = this.irregularity.irregularityType + this.irregularity.flightKey + this.convert(this.irregularity.flightDate);
    this.maintainHouse.open()
    this.rowShipmentIrregularityId = this.irregularity.shipmentIrregularityId;
    this.getHWABDataList();
  }
  getHWABDataList() {
    this.maintainError = new Map<String, String>();
    this.search.shipmentNumber = this.rowShipmentIrregularityId;
    if (this.rowShipmentIrregularityId != undefined) {
      this.irregularityService.getIrregularityHWABDetails(this.search).subscribe(data => {
        let resp: any = data.data;
        resp.map(obj => { obj.disable = true; obj.houseDisable = true; });
        console.log(resp)
        this.mainMaintainHouseList = resp;
        this.maintainIrregularityform.get("maintainHouseList").patchValue(resp);
      });
    }
  }
  checkHAWBNumberExist(index) {
    let reqObj = this.maintainIrregularityform.get("maintainHouseList").value[index];
    let error = false;
    let rowindex = 0;
    this.maintainIrregularityform.get("maintainHouseList").value.forEach(element => {
      if (rowindex != index && element.houseNumber == reqObj.houseNumber) {
        error = true;
        this.showErrorMessage(reqObj.houseNumber + " :duplicate House Number");
      }
      rowindex++;
    });

    if (error) {

      this.maintainError.set(index, reqObj.houseNumber + " :duplicate House Number")
    } else {
      this.maintainError.delete(index);
    }
    console.log(this.maintainIrregularityform.get(['maintainHouseList']).errors)
  }
  setHouseInfo(event, index) {
    if (event.code != null) {
      this.maintainIrregularityform.get(['maintainHouseList', index, 'houseDisable']).setValue(true);
      this.maintainIrregularityform.get(['maintainHouseList', index, 'piece']).setValue(event.param2);
      this.maintainIrregularityform.get(['maintainHouseList', index, 'weight']).setValue(event.param3);
    } else {
      let regex = /^[A-Za-z0-9 ]+$/
      if (!regex.test(this.maintainIrregularityform.get(['maintainHouseList', index, 'houseNumber']).value)) {
        this.maintainIrregularityform.get(['maintainHouseList', index, 'houseNumber']).setValue("");
      }
      this.maintainIrregularityform.get(['maintainHouseList', index, 'houseDisable']).setValue(false);
      this.maintainIrregularityform.get(['maintainHouseList', index, 'piece']).setValue(0);
      this.maintainIrregularityform.get(['maintainHouseList', index, 'weight']).setValue(0.0);
    }
  }
  addHawbListRow() {
    let date: any[];
    date = this.maintainIrregularityform.get("maintainHouseList").value;
    date.push({
      shipmentHouseIrregularityId: "",
      shipmentIrregularityId: this.rowShipmentIrregularityId,
      houseNumber: "",
      houseDisable: false,
      piece: 0,
      weight: 0.0,
      breakdownPiece: 0,
      breakdownWeight: 0.0,
      irregularityPiece: 0,
      irregularityWeight: 0.0,
      irregularityType: this.hawbIrregularityType,
      remarks: ""
    });
    this.mainMaintainHouseList = date;
    this.maintainIrregularityform.get("maintainHouseList").patchValue(date);
  }
  filterHawbListdate() {
    let searchHawb = this.maintainIrregularityform.get("maintainhwbNumber").value;
    if (searchHawb != undefined && searchHawb != "") {
      let filterdate = [];
      this.mainMaintainHouseList.forEach(element => {
        if (element.houseNumber === searchHawb) {
          filterdate.push(element);
        }
      });
      this.maintainIrregularityform.get("maintainHouseList").patchValue(filterdate);
    } else {
      this.maintainIrregularityform.get("maintainHouseList").patchValue(this.mainMaintainHouseList);
    }
  }
  saveHawbListdate() {
    let date: any[] = this.maintainIrregularityform.get("maintainHouseList").value;

    let finalData: any[] = [];
    let updateDate: any[] = [];
    let counter = 0;
    let index = 0;
    let irregularityPiece = 0;
    let irregularityWeight = 0.0;
    let bdPiece = 0;
    let bdWeight = 0.0;
    console.log(this.maintainError)
    if (this.maintainError.size != 0) {
      this.showErrorMessage("Error : " + this.maintainError.values)
      return;
    }
    date.forEach(obj => {
      if (obj.houseNumber == undefined || obj.houseNumber === "") {
        this.showErrorMessage("error.enter.hawb")
        return;
      }
      bdPiece += obj.breakdownPiece;
      bdWeight += obj.breakdownWeight;
      irregularityPiece += obj.irregularityPiece;
      irregularityWeight += obj.irregularityWeight;




      if (obj.shipmentHouseIrregularityId == "") {
        finalData.push(obj);
      } else if (this.maintainIrregularityform.get(['maintainHouseList', index, 'breakdownPiece']).dirty ||
        this.maintainIrregularityform.get(['maintainHouseList', index, 'breakdownWeight']).dirty ||
        this.maintainIrregularityform.get(['maintainHouseList', index, 'irregularityPiece']).dirty ||
        this.maintainIrregularityform.get(['maintainHouseList', index, 'irregularityWeight']).dirty ||
        this.maintainIrregularityform.get(['maintainHouseList', index, 'piece']).dirty ||
        this.maintainIrregularityform.get(['maintainHouseList', index, 'weight']).dirty ||
        this.maintainIrregularityform.get(['maintainHouseList', index, 'remarks']).dirty
      ) {
        updateDate.push(obj);
      }
      index++;
    });
    let data: any[] = this.irregularity.bdPieceWeight.split("/");
    if (bdPiece > parseInt(data[0])) {
      this.showErrorMessage("house.bdpiece.morethen.awb");
      return;
    }
    if (bdWeight > parseInt(data[1])) {
      this.showErrorMessage("house.bdweight.morethen.awb");
      return;
    }
    if (irregularityPiece > this.irregularity.pieces) {
      this.showErrorMessage("house.irrgpiece.morethen.awb");
      return;
    }
    if (irregularityWeight > this.irregularity.weight) {
      this.showErrorMessage("house.irrgweight.morethen.awb");
      return;
    }
    if (updateDate.length != 0) {
      updateDate.forEach(c => {
        delete c.hwabdisable;
        delete c.hawbPiece;
        delete c.hawbWeight;
      })
      this.updateHawbRow(updateDate);
    }
    if (finalData.length != 0) {
      finalData.forEach(c => {
        delete c.hwabdisable;
        delete c.hawbPiece;
        delete c.hawbWeight;
      })
      this.saveHawbRow(finalData);

    }

  }
  saveHawbRow(data: any[]) {
    this.irregularityService.addIrregularityHWABDetails(data).subscribe(res => {
      let resp: any = res.data;
      if (!this.showResponseErrorMessages(res)) {
        this.showSuccessStatus('g.operation.successful');
        this.getHWABDataList();
      } else {
        this.showErrorMessage('error.while.data.saving');
      };

    });
  }

  updateHawbRow(data: any[]) {
    this.irregularityService.updateIrregularityHWABDetails(data).subscribe(res => {
      let resp: any = res.data;
      if (!this.showResponseErrorMessages(res)) {
        this.showSuccessStatus('g.operation.successful');
        this.getHWABDataList();
      } else {
        this.showErrorMessage('export.error.while.updating.data');
      };

    });
  }

  deleteHawbRow(index) {
    let reqObj = this.maintainIrregularityform.get("maintainHouseList").value[index];
    if (reqObj.shipmentHouseIrregularityId == "") {
      let dateList: any[] = this.maintainIrregularityform.get("maintainHouseList").value;
      dateList.splice(index, 1);
      this.mainMaintainHouseList = dateList;
      this.maintainIrregularityform.get("maintainHouseList").patchValue(dateList);
    } else {
      this.irregularityService.deleteIrregularityHWABDetails(reqObj).subscribe(res => {
        let resp: any = res.data;
        if (!this.showResponseErrorMessages(res)) {
          this.showSuccessStatus('g.operation.successful');
          this.getHWABDataList();
        } else {
          this.showErrorMessage('master.error.unable.to.delete.data');
        }
      });
    }
  }
}
