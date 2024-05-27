import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcButtonComponent, PageConfiguration, NgcReportComponent, NgcUtility, ReportFormat } from 'ngc-framework';
import { UldInventoryRequest, UldInventoryResponse, UldInventory } from '../uld.shared';
import { UldService } from '../uld.service';
import { Validators, PatternValidator } from '@angular/forms';
// import 'rxjs/add/operator/toPromise';
import { Request } from './../../model/resp';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationFeatures } from '../../common/applicationfeatures';

// TODO Selector of the component should be starting with ngc-
// TODO Use JSDoc style comments for functions, interfaces, enums, and classes
// TODO Remove all commented code(s), which is not required anymore in both html and ts
@Component({
  selector: 'app-uldinventory',
  templateUrl: './uldinventory.component.html',
  styleUrls: ['./uldinventory.component.scss']
})
@PageConfiguration({
  trackInit: true,
  autoBackNavigation: true,
  restorePageOnBack: true,
  callNgOnInitOnClear: true
})
export class UldInventoryComponent extends NgcPage implements OnInit {
  reportParameters: any;
  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
  @ViewChild("reportWindow1")
  reportWindow1: NgcReportComponent;
  // TODO spelling of decleration (should be declaration)
  // Parameters decleration
  uldInvList: any[];
  resp: any;
  uldList: any = {};
  selectCarrier: any;
  selectUldName: any;
  showTable: boolean;
  cCode: any;
  private uldGroupFeatureEnabled: boolean = false;
  private uldMovementTypeFeatureEnabled: boolean = false;
  private uldMovementDateFeatureEnabled: boolean = false;
  private warehouseLocationFeatureEnabled: boolean = false;
  /**
     * Initialize
     *
     * @param appZone Ng Zone
     * @param appElement Element Ref
     * @param appContainerElement View Container Ref
     */
  // ngc form input and output controls
  private uldInventoryform: NgcFormGroup = new NgcFormGroup
    ({
      uldCount: new NgcFormControl(),
      carrierCode: new NgcFormControl(),
      uldType: new NgcFormControl(),
      uldGroup: new NgcFormControl(),
      displayflag: new NgcFormControl(false),
      carrierName: new NgcFormControl(),
      uldName: new NgcFormControl(''),
      location: new NgcFormControl('AP1'),
      ownership: new NgcFormControl('Both'),
      conditionType: new NgcFormControl('Both'),
      status: new NgcFormControl('OnHand'),
      totalUld: new NgcFormControl(),
      uldInventoryList: new NgcFormArray([]),
      apronULDCount: new NgcFormControl(),
      cargoULDCount: new NgcFormControl(),
      agentULDCount: new NgcFormControl(),
      selectmovement: new NgcFormControl(),
      aging: new NgcFormControl(),
      agingDisplay: new NgcFormControl()
    });
  forwardedData: any;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router,
    private activatedRoute: ActivatedRoute,
    private uldService: UldService) {
    super(appZone, appElement, appContainerElement);
    // this.functionId = "PLAYGROUND";
  }
  ngOnInit() {
    super.ngOnInit();
    this.showTable = false;
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    this.warehouseLocationFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_Offload_WarehouseLocation);
    this.uldGroupFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ULD_UldGroup);
    this.uldMovementTypeFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ULD_UldMovementType);
    this.uldMovementDateFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ULD_UldMovementDate);

    if (this.uldService.uldinventoryData) {
      this.uldInventoryform.get('carrierCode').setValue(this.uldService.uldinventoryData.carrierCode);
      this.uldInventoryform.get('uldType').setValue(this.uldService.uldinventoryData.uldType);
      this.uldInventoryform.get('location').setValue(this.uldService.uldinventoryData.location);
      this.uldInventoryform.get('ownership').setValue(this.uldService.uldinventoryData.ownership);
      this.uldInventoryform.get('conditionType').setValue(this.uldService.uldinventoryData.conditionType);
      this.uldInventoryform.get('status').setValue(this.uldService.uldinventoryData.status);
      this.getUldList();
    }
  }
  public getUldList() {
    this.showTable = false;
    const displayUldList: any[] = [];

    //   this.displayUldTable=false;
    this.uldInventoryform.get('totalUld').setValue('');
    this.uldInventoryform.get('uldCount').setValue('');
    this.uldInventoryform.get('uldName').setValue('');
    this.uldInventoryform.get('carrierName').setValue('');

    const uldInventoryrequest: UldInventoryRequest = new UldInventoryRequest();
    uldInventoryrequest.carrierCode = this.uldInventoryform.get('carrierCode').value;
    this.cCode = this.uldInventoryform.get('carrierCode').value;
    uldInventoryrequest.uldType = this.uldInventoryform.get('uldType').value;
    if (this.uldInventoryform.get('location').value == 'AP1') {
      uldInventoryrequest.airportPosition = 'ALL';
    } else if (this.uldInventoryform.get('location').value == 'AP2') {
      uldInventoryrequest.airportPosition = 'AGT';
    } else {
      uldInventoryrequest.airportPosition = this.uldInventoryform.get('location').value;
    }
    uldInventoryrequest.uldOwnership = this.uldInventoryform.get('ownership').value;
    uldInventoryrequest.aging = this.uldInventoryform.get('aging').value;
    uldInventoryrequest.uldCondition = this.uldInventoryform.get('conditionType').value;
    uldInventoryrequest.uldAvailability = this.uldInventoryform.get('status').value;
    if (this.uldGroupFeatureEnabled) {
      uldInventoryrequest.uldGroup = this.uldInventoryform.get('uldGroup').value;
    }
    if (this.uldMovementTypeFeatureEnabled) {
      uldInventoryrequest.movmentTypeList = this.uldInventoryform.get('selectmovement').value;
    }
    this.searchButton.disabled = true;
    this.uldService.getUldInventoryDetails(uldInventoryrequest).subscribe(data => {
      this.refreshFormMessages(data);
      this.resp = data;
      if (!this.showResponseErrorMessages(data)) {
        if (this.resp.data) {
          this.uldInventoryform.get('totalUld').setValue(this.resp.data.uldCount);
          this.uldInventoryform.get('uldName').setValue(this.selectUldName);
          this.uldInventoryform.get('carrierName').setValue(this.selectCarrier);
          this.uldInvList = this.resp.data.uldList;
          if (this.uldInvList.length > 0) {
            this.uldInventoryform.get('uldCount').setValue(this.uldInvList.length);
            this.uldInventoryform.get('apronULDCount').setValue(this.resp.data.apronULDCount);
            this.uldInventoryform.get('cargoULDCount').setValue(this.resp.data.cargoULDCount);
            this.uldInventoryform.get('agentULDCount').setValue(this.resp.data.agentULDCount);
            this.uldInventoryform.get('agingDisplay').setValue(this.resp.data.agingdisplay);

            this.showTable = true;
            let i = 1;
            this.uldInvList.forEach(element => {
              element.serialNumber = i;
              i++;
            });
            (<NgcFormArray>this.uldInventoryform.controls['uldInventoryList']).patchValue(this.uldInvList);
            this.searchButton.disabled = true;
          }

        } else {
          this.uldInventoryform.get('uldCount').setValue(0);
          // TODO Change the message as per convention we have decided (see Asha's mail 11/28/17 12:07 pm IST)
          // this.showErrorStatus('No Records Found !!');
        }

      }
      this.searchButton.disabled = false;
    }, error => {
      this.showErrorStatus('uld.an.error.occured.please.try.again!!');
      this.searchButton.disabled = false;
    });


  }
  public onSelectCarrier(object) {
    this.uldInventoryform.get('carrierCode').setValue(object.code);
    this.selectCarrier = object.desc;
  }
  public onSelectUldType(object) {

    this.uldInventoryform.get('uldType').setValue(object.code);
    this.selectUldName = object.desc;
  }

  public onSelectUldGroup(object) {

    this.uldInventoryform.get('uldGroup').setValue(object.code);
    this.selectUldName = object.desc;
  }

  onCancel(event) {
    this.resetFormMessages();
    this.uldInventoryform.reset();
    this.navigateTo(this.router, '/', null);
  }

  onLinkClick(event) {
    console.log(event);
    let requestToNavigate = {
      'uldNumber': event.record.uldNumber,
      'carrierCode': this.cCode,
      'uldType': this.uldInventoryform.get('uldType').value,
      'location': this.uldInventoryform.get('location').value,
      'ownership': this.uldInventoryform.get('ownership').value,
      'conditionType': this.uldInventoryform.get('conditionType').value,
      'status': this.uldInventoryform.get('status').value
    };
    this.navigateTo(this.router, '/uld/uldenquire', requestToNavigate);
  }

  onPrint() {
    //if (this.data.reportseparateCount == 0) {

    if (this.uldInventoryform.get('location').value == 'AP1') {
      this.uldInventoryform.get('location').setValue('ALL');
    }
    this.reportParameters = new Object();
    this.reportParameters.Carrier = this.uldInventoryform.get('carrierCode').value;
    this.reportParameters.ULDTYPE = this.uldInventoryform.get('uldType').value;

    if (this.uldInventoryform.get('location').value == 'AP1') {
      this.reportParameters.AirportPosition = 'ALL';
    } else if (this.uldInventoryform.get('location').value == 'AP2') {
      this.reportParameters.AirportPosition = 'AGT';
    } else {
      if (this.uldInventoryform.get('location').value != null) {
        this.reportParameters.AirportPosition = this.uldInventoryform.get('location').value;
      } else {
        this.reportParameters.AirportPosition = 'ALL';
      }
    }

    if (this.uldInventoryform.get('ownership').value != null) {
      this.reportParameters.Ownership = this.uldInventoryform.get('ownership').value;
    } else {
      this.reportParameters.Ownership = 'BOTH';
    }

    if (this.uldInventoryform.get('conditionType').value != null) {
      this.reportParameters.ConditionType = this.uldInventoryform.get('conditionType').value;
    } else {
      this.reportParameters.ConditionType = 'BOTH';
    }

    if (this.uldInventoryform.get('status').value != null) {
      this.reportParameters.Status = this.uldInventoryform.get('status').value;
    } else {
      this.reportParameters.Status = 'BOTH';
    }

    this.reportParameters.login = this.getUserProfile().userLoginCode;
    this.reportWindow.open();
    //} 
  }
  exportToExcel() {
    let str = "";
    if (this.uldInventoryform.get('selectmovement').value) {
      this.uldInventoryform.get('selectmovement').value.forEach(element => {
        if (element != "%")
          str = str + "'" + element + "'" + " ,"
      });
      str = str.substring(0, str.lastIndexOf(","));
    }
    if (str != "")
      str = "( " + str + " )"


    this.reportParameters = new Object();
    this.reportParameters.carrierCode = this.uldInventoryform.get('carrierCode').value;
    this.reportParameters.uldType = this.uldInventoryform.get('uldType').value;
    if (this.uldGroupFeatureEnabled)
      this.reportParameters.uldGroup = this.uldInventoryform.get('uldGroup').value;
    if (this.uldMovementTypeFeatureEnabled)
      this.reportParameters.movmentTypeList = str;
    if (this.uldMovementDateFeatureEnabled) {
      this.reportParameters.isMovementDateEnabled = true;
    } else {
      this.reportParameters.isMovementDateEnabled = false;
    }
    this.reportParameters.isWarehouseLocationFeatureEnabled = this.warehouseLocationFeatureEnabled;

    if (this.uldInventoryform.get('location').value) {
      if (this.uldInventoryform.get('location').value == 'AP1') {
        this.uldInventoryform.get('location').setValue('ALL');
      }
      if (this.uldInventoryform.get('location').value == 'AP1') {
        this.reportParameters.airportPosition = 'ALL';
      } else if (this.uldInventoryform.get('location').value == 'AP2') {
        this.reportParameters.airportPosition = 'AGT';
      } else {
        if (this.uldInventoryform.get('location').value != null) {
          this.reportParameters.airportPosition = this.uldInventoryform.get('location').value;
        } else {
          this.reportParameters.airportPosition = 'ALL';
        }
      }
    }

    if (this.uldInventoryform.get('ownership').value != null) {
      this.reportParameters.uldOwnership = this.uldInventoryform.get('ownership').value;
    } else {
      this.reportParameters.uldOwnership = 'BOTH';
    }

    if (this.uldInventoryform.get('conditionType').value != null) {
      this.reportParameters.uldCondition = this.uldInventoryform.get('conditionType').value;
    } else {
      this.reportParameters.uldCondition = 'BOTH';
    }

    if (this.uldInventoryform.get('status').value != null) {
      this.reportParameters.uldAvailability = this.uldInventoryform.get('status').value;
    } else {
      this.reportParameters.uldAvailability = 'BOTH';
    }

    this.reportParameters.login = this.getUserProfile().userLoginCode;
    this.reportWindow1.format = ReportFormat.XLS;
    this.reportWindow1.downloadReport();
  }
}

