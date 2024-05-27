import { ExportService } from './../export.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent,
  NgcButtonComponent, NgcUtility, PageConfiguration
} from 'ngc-framework';
import { SearchStockRequest, SIDSearchRequest, NeutralAWBMasters, CustomerInfo, AccountingInfo, AgentInfo, SHC, Routing, OtherCustomsInfo, PrepaidCollectChargeSummary, SSROSIInfo, OtherCharges, FlightBooking, RateDescription, RateDescOtherInfo, SearchNAWBRQ } from '../export.sharedmodel';

@Component({
  selector: 'ngc-neutral-airway-bill',
  templateUrl: './neutral-airway-bill.component.html',
  styleUrls: ['./neutral-airway-bill.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class NeutralAirwayBillComponent extends NgcPage {
  private shipperIndicatorIcon: string = "";
  private routingIndicatorIcon: string = "";
  private accountIndicatorIcon: string = "";
  private shcIndicatorIcon: string = "";
  private alsoNotifyIndicatorIcon: string = "";
  private commodityIndicatorIcon: string = "";

  private chargeIndicatorIcon: string = "";
  private customsIndicatorIcon: string = "";
  private remarksIndicatorIcon: string = "";
  private rateIndicatorIcon: string = "";
  disableStock: boolean;
  dataDetail: any;
  errors: any;
  arrayStock: any[];
  arrayNAWB: any[];
  response: any;

  public Charge_Code: any = ['CX', 'CZ', 'N', 'NP', 'NZ'];
  @ViewChild('stockButton') stockButton: NgcButtonComponent;
  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  @ViewChild('awbWindow') awbWindow: NgcWindowComponent;
  rateClassDropdown: string[];
  volumeCodeDropdown: string[];
  stockCategoryCode: string[];
  contactDetailIsDisabled = true;
  dataRetrieved: any;
  showPage = false;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private exportService: ExportService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  private stockForm: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    stockCategoryCode: new NgcFormControl(),
    stockId: new NgcFormControl(),
    awbListArray: new NgcFormArray([]),
  })
  private nawbForm: NgcFormGroup = new NgcFormGroup({

  });


  ngOnInit(): void {
    super.ngOnInit();
    this.disableStock = false;
    const awbMaster = new NeutralAWBMasters();

    awbMaster.shcCode.push(new SHC());
    this.updateSCHValue(awbMaster.shcCode);
    awbMaster.rateDescription.push(new RateDescription());
    awbMaster.rateDescriptionOtherInfo.push(new RateDescOtherInfo());
    awbMaster.otherCustomsInfo.push(new OtherCustomsInfo());

    awbMaster.ppdCol.push(new PrepaidCollectChargeSummary());
    awbMaster.ssrOsiInfo.push(new SSROSIInfo());
    //awbMaster.otherCharges.push(new OtherCharges());
    awbMaster.chargeDeclaration['prepaIdCollectChargeDeclarationPPD'] = awbMaster.chargeDeclaration.prepaIdCollectChargeDeclaration === 'P';
    awbMaster.chargeDeclaration['prepaIdCollectChargeDeclarationCollect'] = awbMaster.chargeDeclaration.prepaIdCollectChargeDeclaration === 'C';
    (awbMaster as any).abc = new Array<any>();
    (awbMaster as any).abc.push({ 'a': 1 });
    this.nawbForm.patchValue(awbMaster);
    this.showPage = true;
    try {
      this.dataRetrieved = this.getNavigateData(this.activatedRoute);
    } catch (e) {
    }
  }

  public ngAfterViewInit() {
    super.ngAfterViewInit();
    this.searchSidAndNawb();
    
  }


  public searchSidAndNawb() {
    if (this.dataRetrieved) {
      const request: SIDSearchRequest = new SIDSearchRequest();
      request.sidHeaderId = this.dataRetrieved.sidHeaderId;
      request.awbNumber = this.dataRetrieved.shipmentNumber;
      this.exportService.searchSIDByHeaderID(request).subscribe((resp) => {
        this.response = resp.data;
        this.updateSCHValue(this.response.shcCode);
       
        this.nawbForm.patchValue(this.response);
        this.showPage = true;
        if (this.dataRetrieved.shipmentNumber === null) {
          this.disableStock = false;
        } else {
          this.disableStock = true;
        }
      });
    }
  }

  /**
  * This function is responsible for adding new record to OCI Information
  */
  onOciAddRow() {
    (<NgcFormArray>this.nawbForm.get('accountingInfo')).addValue([
      {
        isoCountryCode: null,
        informationIdentifier: null,
        accountingInformation: null,
        supplementaryCustomerInformation: null
      }
    ]);
  }

  /**
 * This function is responsible for adding new record to RTD Details
 */
  onRtdAddRow() {
    (<NgcFormArray>this.nawbForm.get('rateDescription')).addValue([
      {

        shipmentFreightWayBillId: null,
        neutralAWBId: null,
        neutralAWBRateDescriptionId: null,
        rateLineNumber: null,
        grossWeight: 1,
        rateClassCode: null,
        commodityItemNo: 0,
        chargeableWeight: 0.0,
        rateChargeAmount: 0.0,
        totalChargeAmount: 0.0,
        natureOfGoodsDescription: null,
        numberOfPieces: null
      }
    ]);
  }

  /**
 * This function is responsible for adding new record to RTD Description
 */
  onRtdDetailsAddRow() {
    (<NgcFormArray>this.nawbForm.get('rateDescriptionOtherInfo')).addValue([
      {
        dimensionLength: null,
        measurementUnitCode: null,
        dimensionHeight: null,
        dimensionWIdth: null,
        numberOfPieces: null,
        volumeUnitCode: null,
        volumeAmount: null,
        uldNumber: null,
        slacCount: null,
        harmonisedCommodityCode: null,
        countryCode: null,
        serviceCode: null,

      }
    ]);
  }

  /**
* This function is responsible for adding new record to RTD Description
*/
  onRemarksAddRow() {
    (<NgcFormArray>this.nawbForm.get('ssrOsiInfo')).addValue([
      {
        remarksDetails: null,
      }
    ]);
    //this.deleteFunction();
  }
  onContactAdd() {
    (<NgcFormArray>this.nawbForm.get('customerContactInfo')).addValue([
      {
        contactType: null,
        contactDetail: null,
      }
    ]);
  }
  /**
  * Method to select rate class from dropdown
  */
  public onSelectRateClass(event) {

  }

  /**
  * Method to select service code from dropdown
  */
  public onSelectServiceCode(event) {

  }

  /**
  * Method to select rate class from dropdown
  */
  public onSelectVolumeCode(event) {

  }

  /**
   * Method to select AWB Number from Stock
   */
  public onStock(event) {
    this.awbWindow.open();
  }


  /**
 * This function is responsible for displaying the List of the SID
 * @param event
 */
  public onSearch(event) {
    const request: SearchStockRequest = new SearchStockRequest();
    request.stockCategoryCode = this.stockForm.get('stockCategoryCode').value;
    request.stockId = this.stockForm.get('stockId').value;
    request.carrierCode = this.stockForm.get('carrierCode').value;
    this.exportService.searchStock(request).subscribe(dataDetail => {
      this.response = dataDetail;
      this.arrayStock = this.response.data;
      this.resetFormMessages();
      if (this.arrayStock.length > 0) {

        (<NgcFormArray>this.stockForm.controls['awbListArray']).patchValue(this.arrayStock);
      } else {
        (<NgcFormArray>this.stockForm.get('awbListArray')).reset();
        this.showErrorStatus('NO_RECORDS_EXIST');
      }
    });
  }
  public onSave(event) {
    // this.shipperIndicatorIcon = "warning";
    let temp = this.nawbForm.get('flightBooking').get('carrierCode').value + this.nawbForm.get('flightBooking').get('flightNumber').value;
    this.nawbForm.get('flightBooking').get('flightKey').setValue(temp);
    const saveRequest = this.nawbForm.getRawValue();

    this.getOrigin(saveRequest);
    this.getdesc(saveRequest);
    this.getAirportCode(saveRequest);
    saveRequest.sidHeaderId = this.dataRetrieved.sidHeaderId;
    saveRequest.sidNumber = this.dataRetrieved.sidNumber;

    if (this.nawbForm.get('awbNumber').value === null) {
      this.showMessage('export.select.awb.number');
      return;
    }

    if ((this.nawbForm.get('chargeDeclaration.prepaIdCollectChargeDeclarationCollect').value === false) && (this.nawbForm.get('chargeDeclaration.prepaIdCollectChargeDeclarationPPD').value === false)) {
      this.showMessage('export.select.either.ppd.collect');
      return;
    }





    if (this.nawbForm.get('chargeDeclaration.prepaIdCollectChargeDeclarationPPD').value) {
      saveRequest.chargeDeclaration.prepaIdCollectChargeDeclaration = 'P';
    } else if (this.nawbForm.get('chargeDeclaration.prepaIdCollectChargeDeclarationCollect').value) {
      saveRequest.chargeDeclaration.prepaIdCollectChargeDeclaration = 'C';
    }
    // this.shcCodeValidation(saveRequest);

    this.exportService.saveNawb(saveRequest).subscribe((resp) => {
      this.response = resp;
      if (this.response.success) {
        
        this.showSuccessStatus('g.completed.successfully');
        this.disableStock = true;
       
      } else {
        this.disableStock = false;
        if (this.response) {
          const messageList: Array<any> = this.response.messageList;
          //
          messageList.forEach((message) => {
            if (message.referenceId) {
              // TODO! - Need to Fix in Service
              message.referenceId = message.referenceId.replace(/\]/g, "").replace(/\[/g, ".");
            }
          });
        }
        this.refreshFormMessages(this.response);
        // this.errors = this.response.messageList;
        // this.showErrorStatus(this.errors[0].message);
        if (this.nawbForm.get('shipperInfo').invalid === true
          || this.nawbForm.get('consigneeInfo').invalid === true
          || this.nawbForm.get('agentInfo').invalid === true) {
          this.shipperIndicatorIcon = "error";
        } else {
          this.shipperIndicatorIcon = "";
        }
        if (this.nawbForm.get('routing').invalid === true) {
          this.routingIndicatorIcon = "error";
        } else {
          this.routingIndicatorIcon = "";
        }
        if (this.nawbForm.get('chargeDeclaration').invalid === true) {
          this.accountIndicatorIcon = "error";
        }
        else {
          this.accountIndicatorIcon = "";
        }
        if (this.nawbForm.get('shcCode').invalid === true) {
          this.shcIndicatorIcon = "error";
        } else {
          this.shcIndicatorIcon = "";
        }

        if (this.nawbForm.get('rateDescription').invalid === true) {
          this.commodityIndicatorIcon = "error";
        } else {
          this.commodityIndicatorIcon = "";
        }
        if (this.nawbForm.get('neutralAWBLocalAuthDetails').invalid === true) {
          this.customsIndicatorIcon = "error";
        }

        else {
          this.customsIndicatorIcon = "";
        }
        if (this.nawbForm.get('consigneeInfo').invalid === true) {
          this.alsoNotifyIndicatorIcon = "error"
        }
        else {
          this.alsoNotifyIndicatorIcon = ""

        }

      }

    });


  }
  public getOrigin(nawb: any) {
    //nawb['origin'] = nawb.shcCode[0]['origin'];
    nawb['origin'] = nawb.routing['from'];
  }

  public getAirportCode(nawb: any) {
    nawb['airportCode'] = nawb.routing['to'];
  }

  public getdesc(nawb: any) {
    nawb['destination'] = nawb.routing['to'];
  }

  public searchNawb() {
    const searchNawb: SearchNAWBRQ = new SearchNAWBRQ();
    searchNawb.awbNumber = this.dataRetrieved.shipmentNumber;
    //searchNawb.sidHeaderId=this.dataRetrieved.sidHeaderId;
    this.exportService.searchNawb(searchNawb).subscribe((resp) => {
      this.response = resp;
      if (this.response.success) {
        this.refreshFormMessages(this.response);
        //this.response.data[0]['flagCRUD'] = 'U';
        this.nawbForm.patchValue(this.response.data[0]);
        this.showPage = true;
        //this.showSuccessStatus('g.completed.successfully');
      } else {
        this.refreshFormMessages(this.response);
        // this.errors = this.response.messageList;
        this.showErrorStatus(this.errors[0].message);
      }
    }, (error) => {
      this.showErrorStatus(error);
    });

  }

  public onRowClick(event) {
    this.nawbForm.get('awbNumber').setValue(event.args.row.awbNumber);
    this.awbWindow.close();
  }

  public onClear(event) {
    this.nawbForm.reset();
  }

  deleteRateDescription(index) {
    (<NgcFormArray>this.nawbForm.get('rateDescription')).deleteValueAt(index).reset();
  }

  deleteRateDescriptionOther(index) {
    (<NgcFormArray>this.nawbForm.get('rateDescriptionOtherInfo')).deleteValueAt(index).reset();
  }

  deleteOCI(index) {
    (<NgcFormArray>this.nawbForm.get('accountingInfo')).deleteValueAt(index).reset();
  }

  deleteRemarks(index) {
    (<NgcFormArray>this.nawbForm.get('ssrOsiInfo')).deleteValueAt(index).reset();
  }


  shcCodeValidation(request) {
    let index = 0;
    for (const each of request.shcshcCode) {
      ++index;
      const hashTable = {};
      for (let i = 1; i <= 9; ++i) {
        const shcValue = each['specialHandlingCode' + i];
        if (!shcValue) {
          continue;
        }
        if (!hashTable[shcValue]) {
          hashTable[shcValue] = 1;
        } else {
          this.showErrorStatus('export.duplicate.shc.not.allowed');
          return false;
        }
      }
    }
    return true;
  }


  updateSCHValue(data: any[]) {
    if (data) {
      for (var index = data.length; index < 9; index++) {
        const shc = new SHC();
        shc.flagCRUD = 'C'
        data.push(shc);

      }
    }
  }
}
