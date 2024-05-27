// Angular
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
// Appliation
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcFormControl, NgcUtility, DateTimeKey,
  NgcButtonComponent, PageConfiguration
} from 'ngc-framework';
// Uld Transfer View
import { UldTransferViewDataRequest, UldTransferViewDataResponse } from '../../uld.shared';
import { UldService } from '../../uld.service';
import { ApplicationFeatures } from '../../../common/applicationfeatures';
/**
 * @export
 * @class UldtransferviewComponent
 * @extends {NgcPage}
 * @implements {OnInit}
 *
 */
@Component({
  selector: 'ngc-uldtransferview',
  templateUrl: './uldtransferview.component.html',
  styleUrls: ['./uldtransferview.component.scss'],
})

/**
 * Uld Transfer View List Page
 * This page allows user to view transfer list
 * and create a new transfer if required
 *
 */

@PageConfiguration({
  trackInit: true,
  autoBackNavigation: true,
  callNgOnInitOnClear: true//Because Implemented Custom Clear Function

})


export class UldtransferviewComponent extends NgcPage {
  transferAirport: any;
  private fromCarrierFeatureEnabled: boolean = false;
  private toCarrierFeatureEnabled: boolean = false;
  private fromDateTimeFeatureEnabled: boolean = false;
  private toDateTimeFeatureEnabled: boolean = false;
  // ngc form input and output controls
  @ViewChild('searchbutton') searchbutton: NgcButtonComponent;
  private uldTansferViewForm: NgcFormGroup = new NgcFormGroup
    ({
      transferFinalizedFlag: new NgcFormControl(false),
      transferCarrier: new NgcFormControl('', [Validators.pattern('[A-Z,0-9]{2,3}')]),
      transCarrierName: new NgcFormControl(),
      receivingCarrier: new NgcFormControl('', [Validators.pattern('[A-Z,0-9]{2,3}')]),
      receivCarrierName: new NgcFormControl(),
      lucTransactionNo: new NgcFormControl(),
      fromDateTime: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 30, DateTimeKey.DAYS),
        0, DateTimeKey.MINUTES), Validators.required),
      toDateTime: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59,
        DateTimeKey.MINUTES), Validators.required),
      uldTransList: new NgcFormArray(
        [
        ]
      ),
    });

  /**
   * Initialize
   *
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   * @param router Router
   * @param uldService UldService
   */
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router,
    private uldService: UldService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);

    // TODO Complete functionId implimentation
    // this.functionId = '';
  }
  /**
    * parameters used to request data
    *
    * @param errors array of error messages
    * @param errorMessage error message from backend
    * @param transList store subscribed data
    * @param dataDisplay  flag;
    * @param uldTransferDataList used to patch list value
  */
  onSearchClick = false;
  errors: any[];
  errorMessage: any;
  transList: any = {};
  dataDisplay = false;
  uldTransferDataList: any[];

  /**
  * On Initialization
  */
  ngOnInit() {
    this.fromCarrierFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ULD_Transfer_FromCarrier);
    this.toCarrierFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ULD_Transfer_ToCarrier);
    this.fromDateTimeFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ULD_Transfer_FromDateTime);
    this.toDateTimeFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ULD_Transfer_ToDateTime);
    if (this.fromCarrierFeatureEnabled) {
      (<NgcFormControl>this.uldTansferViewForm.get(['transferCarrier'])).setValidators([Validators.required]);
    }
    if (this.toCarrierFeatureEnabled) {
      (<NgcFormControl>this.uldTansferViewForm.get(['receivingCarrier'])).setValidators([Validators.required]);
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    const transferData = this.getNavigateData(this.activatedRoute);
    if (transferData === null) {
      return;
    }
    //Get Last Serached Criteria From the uldService , when Cancel clicked from  TransferNew Screen
    if (this.uldService.carrierFromLastSearchedForInULDTransfer != undefined && this.uldService.carrierToLastSearchedForInULDTransfer != undefined) {
      this.uldTansferViewForm.get('transferCarrier').setValue(this.uldService.carrierFromLastSearchedForInULDTransfer);
      this.uldTansferViewForm.get('receivingCarrier').setValue(this.uldService.carrierToLastSearchedForInULDTransfer);
      this.uldTansferViewForm.get('lucTransactionNo').setValue(this.uldService.transactionNumberLastSearchedForInULDTransfer);
      this.uldTansferViewForm.get('transferFinalizedFlag').setValue(this.uldService.unfinalizeCheckBoxLastSearchedForInULDTransfer);
      this.uldTansferViewForm.get('fromDateTime').setValue(NgcUtility.getCurrentDateOnly());
      this.uldTansferViewForm.get('toDateTime').setValue(NgcUtility.getCurrentDateOnly());
      this.getUldTransferList();
      this.dataDisplay = true;
    }

  }

  /**
   * Set all request parameters
   * Call getResponse method
   *
   * @memberof UldtransferviewComponent
   */


  public getUldTransferList() {
    this.onSearchClick = true;
    const uldtransferRequest: UldTransferViewDataRequest = new UldTransferViewDataRequest();

    if (this.fromCarrierFeatureEnabled) {
      if (this.uldTansferViewForm.get('transferCarrier').value) {
        if (this.toCarrierFeatureEnabled) {
          if (this.uldTansferViewForm.get('receivingCarrier').value) {

          } else {
            this.showErrorStatus('uld.recieving.carrier.cannot.be.blank');
            this.searchbutton.disabled = false;
            return;
          }
        }
      } else {
        this.showErrorStatus('uld.transfering.carrier.cannot.be.blank');
        this.searchbutton.disabled = false;
        return;
      }
    }

    if (this.fromDateTimeFeatureEnabled) {
      if (this.uldTansferViewForm.get('fromDateTime').value) {
        if (this.toDateTimeFeatureEnabled) {
          if (this.uldTansferViewForm.get('toDateTime').value) {
            uldtransferRequest.fromDateTime = this.uldTansferViewForm.get('fromDateTime').value;
            uldtransferRequest.toDateTime = this.uldTansferViewForm.get('toDateTime').value;
          } else {
            this.showErrorStatus('uld.toDate.cannot.be.blank');
            this.searchbutton.disabled = false;
            return;
          }
        }
      } else {
        this.showErrorStatus('uld.fromDate.cannot.be.blank');
        this.searchbutton.disabled = false;
        return;
      }
    }

    uldtransferRequest.transferId = this.uldTansferViewForm.get('lucTransactionNo').value;
    uldtransferRequest.receivingCarrier = this.uldTansferViewForm.get('receivingCarrier').value;
    uldtransferRequest.transferCarrier = this.uldTansferViewForm.get('transferCarrier').value;
    uldtransferRequest.transferFinalizedFlag = this.uldTansferViewForm.get('transferFinalizedFlag').value;
    this.getResponse(uldtransferRequest);
  }
  /**
   * To store response from service layer
   * Display the same on UI
   *
   * @param {UldTransferViewDataRequest} uldtransferRequest
   * @memberof UldtransferviewComponent
   */

  public getResponse(uldtransferRequest: UldTransferViewDataRequest) {
    this.searchbutton.disabled = true;
    this.uldService.fetchUldTransferData(uldtransferRequest).subscribe(data => {
      this.refreshFormMessages(data);
      if (data.data === null) {
        this.dataDisplay = false;
      }
      this.searchbutton.disabled = false;
      this.transList = data;
      this.uldTransferDataList = this.transList.data.uldTransfers;
      this.transferAirport = this.transList.data.transferAirport;
      if (this.uldTransferDataList) {
        this.addStatus();
        this.dataDisplay = true;
        (<NgcFormArray>this.uldTansferViewForm.controls['uldTransList']).patchValue(this.uldTransferDataList);
        this.onSearchClick = false;
        this.searchbutton.disabled = false;

        this.uldService.carrierFromLastSearchedForInULDTransfer = this.uldTansferViewForm.get('transferCarrier').value;
        this.uldService.carrierToLastSearchedForInULDTransfer = this.uldTansferViewForm.get('receivingCarrier').value;
        this.uldService.transactionNumberLastSearchedForInULDTransfer = this.uldTansferViewForm.get('lucTransactionNo').value;
        this.uldService.unfinalizeCheckBoxLastSearchedForInULDTransfer = this.uldTansferViewForm.get('transferFinalizedFlag').value;
      }

    },
      error => {
        this.showErrorStatus('uld.error.while.fetching.uld.transfer.list');
        this.searchbutton.disabled = false;
      });
  }

  /**
   * used to route to particular page
   * based on status
   *
   * @param {any} event
   * @memberof UldtransferviewComponent
   */
  public onLinkClick(event) {
    const uldTransData = event.record;
    const uldTransid = event.record.uid;
    console.log("uldTransid", uldTransid);
    console.log("uldTransid1", this.uldTransferDataList[uldTransid]);
    if (uldTransData.uldStatus === 'Finalized') {
      this.navigateTo(this.router, '/uld/transferviewdata',
        this.uldTransferDataList[uldTransid]);
    } else {
      this.navigateTo(this.router, '/uld/transfernew', this.uldTransferDataList[uldTransid]);
    }
  }

  /**
   * @memberof UldtransferviewComponent
   *
   */
  public navigateTocreateNewUldTransfer() {
    let routedData = new Object();
    this.uldService.transferUldData = new Object();
    if (!this.transferAirport) {
      this.transferAirport = NgcUtility.getTenantConfiguration().airportCode;
    }
    this.uldService.transferUldData = {
      'transferCarrier': this.uldTansferViewForm.get('transferCarrier').value,
      'transCarrierName': this.uldTansferViewForm.get('transCarrierName').value,
      'receivingCarrier': this.uldTansferViewForm.get('receivingCarrier').value,
      'receivCarrierName': this.uldTansferViewForm.get('receivCarrierName').value,
      //'uldTransfers': (<NgcFormArray>this.uldTansferViewForm.controls['uldTransList']).getRawValue(),
      'transferAirport': this.transferAirport, 'issueDateTime': this.getUserProfile().loginTime
    }
    this.router.navigate(['uld', 'transfernew']);
  }

  /**
   * To set value of form control on select of LOV
   *
   * @param {any} object
   * @memberof UldtransferviewComponent
   */
  public onSelect(object) {
    this.uldTansferViewForm.get('transferCarrier').setValue(object.code);
    this.uldTansferViewForm.get('transCarrierName').setValue(object.desc);
  }
  /**
   * To set value of form control on select of LOV
   *
   * @param {any} object
   * @memberof UldtransferviewComponent
   */
  public onSelectRecievecarrier(object) {
    this.uldTansferViewForm.get('receivingCarrier').setValue(object.code);
    this.uldTansferViewForm.get('receivCarrierName').setValue(object.desc);
  }
  /**
   * Used to add finalize date time and status column
   * in datatable
   *
   * @memberof UldtransferviewComponent
   */
  public addStatus() {
    for (let index = 0; index < this.uldTransferDataList.length; index++) {
      this.uldTransferDataList[index]['finalizedDateTime'] =
        NgcUtility.toDateFromLocalDate(this.uldTransferDataList[index]['issueDateTime']);
      if (!this.uldTransferDataList[index]['transferFinalizedFlag']) {
        this.uldTransferDataList[index]['uldStatus'] = 'Unfinalized';
        this.uldTransferDataList[index]['edit'] = 'Edit';
      } else {
        this.uldTransferDataList[index]['uldStatus'] = 'Finalized';
        this.uldTransferDataList[index]['edit'] = 'View';
      }
      this.uldTransferDataList[index]['transCarrierName']
        = this.uldTansferViewForm.get('transCarrierName').value;
      this.uldTransferDataList[index]['receivCarrierName']
        = this.uldTansferViewForm.get('receivCarrierName').value;
    }
  }


  clearFormData() {
    this.uldTansferViewForm.reset();
    this.dataDisplay = false;
    this.uldService.carrierFromLastSearchedForInULDTransfer = undefined;
    this.uldService.carrierToLastSearchedForInULDTransfer = undefined;
    this.uldService.transactionNumberLastSearchedForInULDTransfer = '';
    this.uldService.unfinalizeCheckBoxLastSearchedForInULDTransfer = false;
  }
}

