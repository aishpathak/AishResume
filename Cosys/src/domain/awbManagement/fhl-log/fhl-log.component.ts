import { Component, OnInit, ElementRef, ViewContainerRef, ViewChild, NgZone, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// NGC framework imports
import { NgcPage, NgcFormGroup, NgcWindowComponent, NgcFormArray, NgcDropDownComponent, NgcUtility, NgcReportComponent, PageConfiguration, NgcFormControl, ReactiveModel } from 'ngc-framework';
import { FormsModule, Validators } from '@angular/forms';
import { AwbManagementService } from '../awbManagement.service';
import {
  AwbManagementform,
  FhlLogForm
} from './../awbManagement.shared';
import { Subscriber } from 'rxjs';
import { ApplicationEntities } from '../../common/applicationentities';

@Component({
  selector: 'app-fhl-log',
  templateUrl: './fhl-log.component.html',
  //styleUrls: ['./fhl-log.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
})
export class FhlLogComponent extends NgcPage {

  @Input('awbNumberData') awbNumberData: string;
  @Input('hawbNumberData') hawbNumberData: string;
  /* for saving the initial respose of search in a global object */
  response: any;
  /* successful response Flag */
  onSuccess: boolean;
  /* report paramter object, used only when Print is clicked */
  reportParameters: any;
  @ViewChild("reportWindow1") reportWindow1: NgcReportComponent;
  /* For forwarded data if navigating to or from any other screen */
  forwardedData: any;
  randomValue: number;
  hawbNumber: any;
  /* successful repost Flag */
  printFlag: boolean = false;
  /*
     Below parameters are used for collapsing / expanding of tabs used in the screen
  */
  expandAwbTab = false;
  expandShipperTab = false;
  expandConsigneeTab = false;
  expandNotifyTab = false;
  expandDOGoodsTab = false;
  expandLicenseTab = false;
  expandPermitTab = false;
  expandOCITab = false;
  expandChgDecTab = false;
  expandHarmonisedTab = false;
  expandOtherInfoTab = false;

  /* constructor for dependency injection */
  constructor(appZone: NgZone,
    appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router,
    private awbManagementService: AwbManagementService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }
  /* This form is used for fwbLogFormSearch Form =. It carries the search request to backend */
  private fhlLogFormSearch: NgcFormGroup = new NgcFormGroup({
    awbNumber: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    expandCollapse: new NgcFormControl()
  });

  /* 
  * Reactive Form
  */
  @ReactiveModel(AwbManagementform)
  /* This form is used for saving the respose of Current Object */
  public fhlLogFormAfterForm: NgcFormGroup;

  @ReactiveModel(AwbManagementform)
  /* This form is used for saving the respose of Previous Object */
  public fhlLogFormBeforeForm: NgcFormGroup;

  @ReactiveModel(FhlLogForm)
  public fhlLogFormBooleanForm: NgcFormGroup;

  /* Oninit function */
  ngOnInit() {
    super.ngOnInit();
    this.randomValue = Math.random();
  }

  /* On search : called when search is clicked */
  onSearch() {
    this.resetFormMessages();
    const searchRequest = this.fhlLogFormSearch.getRawValue();
    this.fhlLogFormSearch.validate();
    if (!this.fhlLogFormSearch.valid) {
      return;
    }
    this.onSuccess = false;
    // this.awbManagementService.fetchFhlLogDetailsOnSearch(searchRequest).subscribe(response => {
    //   this.resetFormMessages();
    //   this.fhlLogFormBeforeForm.reset();
    //   this.fhlLogFormAfterForm.reset();
    //   if (!this.showResponseErrorMessages(response)) {
    //     this.onSuccess = true;
    //     this.printFlag = true;
    //     this.refreshFormMessages(response);
    //     /* when current and previous FWB is received */
    //     this.response = response.data;
    //     if (this.response.current && this.response.previous) {
    //       /* comparer function called */
    //       this.comparer(this.response.current, this.response.previous);
    //       this.fhlLogFormAfterForm.patchValue(this.response.current);
    //       this.fhlLogFormBeforeForm.patchValue(this.response.previous);
    //       this.fhlLogFormSearch.get('expandCollapse').setValue(true, { onlySelf: true, emitEvent: false });
    //       this.expandAwbTab = true;
    //       this.expandShipperTab = true;
    //       this.expandConsigneeTab = true;
    //       this.expandNotifyTab = true;
    //       this.expandDOGoodsTab = true;
    //       this.expandLicenseTab = true;
    //       this.expandPermitTab = true;
    //       this.expandOCITab = true;
    //       this.expandChgDecTab = true;
    //       this.expandHarmonisedTab = true;
    //       this.expandOtherInfoTab = true;
    //     } else if (this.response.current && !this.response.previous) {
    //       this.onSuccess = false;
    //       this.printFlag = false;
    //       this.showErrorMessage('no.record');
    //     }
    //   }
    // })
  }
  /**
  @param  current , previous
  It is used for adding changeValueFlag for all the list in this screen
  */
  comparer(current, previous) {
    for (let key in current) {
      if (current[key] && (previous[key] && NgcUtility.isArray(current[key]) && (current[key].length > 0 || previous[key].length > 0))
        || (!NgcUtility.isArray(current[key]) && (key == 'shipper' || key == 'consignee' || key == 'notify'))) {
        for (const eachRow of this.arrayList) {
          if (eachRow.arrayName == key) {
            this.isChangedFlag(current[eachRow.arrayName], previous[eachRow.arrayName], eachRow.parameters, eachRow.arrayName, eachRow.arrayNameUse);
          }
        }
      }
    }
  }

  /* It is called only if any change in the list is found else
  the parameter will be in defalut color which is black as there are not any changes
  currentList: carries list of arrays changed
  previousList: carrier list of arrays changed
  comparingValue: parameter on which the comparison will occur
  arrayName: for which array the comparison will occur
  arrayNameUse: used for comparing value with current and previous
   */
  isChangedFlag(currentList, previousList, comparingValue, arrayName, arrayNameUse) {
    let currrentListLengthFlag = arrayNameUse ?
      currentList[arrayNameUse[0]][arrayNameUse[1]].length > 0 : currentList.length > 0 ? true : false;
    let previousListLengthFlag = arrayNameUse ?
      previousList[arrayNameUse[0]][arrayNameUse[1]].length > 0 : previousList.length > 0 ? true : false;
    if ((arrayNameUse ? currentList[arrayNameUse[0]][arrayNameUse[1]].length > 0 : currentList.length > 0)
      && ((arrayNameUse ? currentList[arrayNameUse[0]][arrayNameUse[1]].length == previousList[arrayNameUse[0]][arrayNameUse[1]].length :
        currentList.length == previousList.length))) {
      this.iterationToSet(currentList, previousList, comparingValue, true, arrayName, arrayNameUse);
    } else if ((currrentListLengthFlag || previousListLengthFlag) &&
      (!currrentListLengthFlag || !previousListLengthFlag)) {
      for (let index = 0;
        index < (arrayNameUse ?
          currentList[arrayNameUse[0]][arrayNameUse[1]].length > 0 ? currentList[arrayNameUse[0]][arrayNameUse[1]].length : previousList[arrayNameUse[0]][arrayNameUse[1]].length
          : (currentList.length > 0 ? currentList.length : previousList.length));
        index++) {
        if (currrentListLengthFlag) {
          for (const eachRow of this.arrayList) {
            if (eachRow.arrayName == arrayName) {
              if (arrayNameUse) {
                this.response.current[arrayName][arrayNameUse[0]][arrayNameUse[1]][index].changedFlag = true;
              } else {
                this.response.current[arrayName][index].changedFlag = true;
              }
            }
          }
        } else {
          for (const eachRow of this.arrayList) {
            if (eachRow.arrayName == arrayName) {
              if (arrayNameUse) {
                this.response.previous[arrayName][arrayNameUse[0]][arrayNameUse[1]][index].changedFlag = true;
              } else {
                this.response.previous[arrayName][index].changedFlag = true;
              }
            }
          }
        }
      }
    } else if (currrentListLengthFlag && previousListLengthFlag) {
      let isCurrentGreater = arrayNameUse ?
        (currentList[arrayNameUse[0]][arrayNameUse[1]].length > previousList[arrayNameUse[0]][arrayNameUse[1]].length)
        : (currentList.length > previousList.length) ? true : false;
      if (isCurrentGreater) {
        this.iterationToSet(currentList, previousList, comparingValue, true, arrayName, arrayNameUse);
      } else {
        this.iterationToSet(currentList, previousList, comparingValue, false, arrayName, arrayNameUse);
      }
    }
  }

  iterationToSet(currentList, previousList, comparingValue, flag, arrayName, arrayNameUse) {
    for (let comparingIndex = 0; comparingIndex < comparingValue.length; comparingIndex++) {
      if (flag) {
        for (let index = 0; index < (arrayNameUse ? currentList[arrayNameUse[0]][arrayNameUse[1]].length : currentList.length); index++) {
          const currentObject = arrayNameUse ? currentList[arrayNameUse[0]][arrayNameUse[1]][index] : currentList[index];
          const previousObject = arrayNameUse ? previousList[arrayNameUse[0]][arrayNameUse[1]][index] : previousList[index];
          if (previousObject
            && (currentObject[comparingValue[comparingIndex]] != previousObject[comparingValue[comparingIndex]])) {
            for (const eachRow of this.arrayList) {
              if (eachRow.arrayName == arrayName) {
                if (arrayNameUse) {
                  this.response.current[arrayName][arrayNameUse[0]][arrayNameUse[1]][index].changedFlag = true;
                  this.response.previous[arrayName][arrayNameUse[0]][arrayNameUse[1]][index].changedFlag = true;
                } else {
                  this.response.current[arrayName][index].changedFlag = true;
                  this.response.previous[arrayName][index].changedFlag = true;
                }
              }
            }
          } else if (!previousObject) {
            for (const eachRow of this.arrayList) {
              if (eachRow.arrayName == arrayName) {
                if (arrayNameUse) {
                  this.response.current[arrayName][arrayNameUse[0]][arrayNameUse[1]][index].changedFlag = true;
                } else {
                  this.response.current[arrayName][index].changedFlag = true;
                }
              }
            }
          }
        }
      } else {
        for (let index = 0; index < (arrayNameUse ? previousList[arrayNameUse[0]][arrayNameUse[1]].length : previousList.length); index++) {
          const currentObject = arrayNameUse ? currentList[arrayNameUse[0]][arrayNameUse[1]][index] : currentList[index];
          const previousObject = arrayNameUse ? previousList[arrayNameUse[0]][arrayNameUse[1]][index] : previousList[index];
          if (currentObject
            && (currentObject[comparingValue[comparingIndex]] != previousObject[comparingValue[comparingIndex]])) {
            for (const eachRow of this.arrayList) {
              if (eachRow.arrayName == arrayName) {
                if (arrayNameUse) {
                  this.response.current[arrayName][arrayNameUse[0]][arrayNameUse[1]][index].changedFlag = true;
                  this.response.previous[arrayName][arrayNameUse[0]][arrayNameUse[1]][index].changedFlag = true;
                } else {
                  this.response.current[arrayName][index].changedFlag = true;
                  this.response.previous[arrayName][index].changedFlag = true;
                }
              }
            }
          } else if (!currentObject) {
            for (const eachRow of this.arrayList) {
              if (eachRow.arrayName == arrayName) {
                if (arrayNameUse) {
                  this.response.previous[arrayName][arrayNameUse[0]][arrayNameUse[1]][index].changedFlag = true;
                } else {
                  this.response.previous[arrayName][index].changedFlag = true;
                }
              }
            }
          }
        }
      }
    }
  }


  onTabOutCheckHandledBy() {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      let search = this.fhlLogFormSearch.getRawValue();
    }
  }

  expandCollapse(value, tabName) {
    for (const eachRow of this.tabNameList) {
      if (eachRow.tabName == tabName && tabName == 'expandAwbTab') {
        this.expandAwbTab = !value;
      } else if (eachRow.tabName == tabName && tabName == 'expandShipperTab') {
        this.expandShipperTab = !value;
      } else if (eachRow.tabName == tabName && tabName == 'expandConsigneeTab') {
        this.expandConsigneeTab = !value;
      } else if (eachRow.tabName == tabName && tabName == 'expandNotifyTab') {
        this.expandNotifyTab = !value;
      } else if (eachRow.tabName == tabName && tabName == 'expandDOGoodsTab') {
        this.expandDOGoodsTab = !value;
      } else if (eachRow.tabName == tabName && tabName == 'expandLicenseTab') {
        this.expandLicenseTab = !value;
      } else if (eachRow.tabName == tabName && tabName == 'expandPermitTab') {
        this.expandPermitTab = !value;
      } else if (eachRow.tabName == tabName && tabName == 'expandOCITab') {
        this.expandOCITab = !value;
      } else if (eachRow.tabName == tabName && tabName == 'expandChgDecTab') {
        this.expandChgDecTab = !value;
      } else if (eachRow.tabName == tabName && tabName == 'expandHarmonisedTab') {
        this.expandHarmonisedTab = !value;
      } else if (eachRow.tabName == tabName && tabName == 'expandOtherInfoTab') {
        this.expandOtherInfoTab = !value;
      }
    }
  }
  /* Default list of tabs used for opening and closing of tabs */
  tabNameList = [{
    tabName: 'expandAwbTab'
  }, {
    tabName: 'expandShipperTab'
  }, {
    tabName: 'expandConsigneeTab'
  }, {
    tabName: 'expandNotifyTab'
  }, {
    tabName: 'expandDOGoodsTab'
  }, {
    tabName: 'expandLicenseTab'
  }, {
    tabName: 'expandPermitTab'
  }, {
    tabName: 'expandOCITab'
  }, {
    tabName: 'expandChgDecTab'
  }, {
    tabName: 'expandHarmonisedTab'
  }, {
    tabName: 'expandOtherInfoTab'
  }]
  /* Print function to print current and previous FWB */
  onPrint() {
    if (this.response.current && this.response.previous) {
      this.reportParameters = new Object();
      this.reportParameters.AwbNumber = this.fhlLogFormSearch.getRawValue().awbNumber;
      this.reportParameters.HawbNumber = this.fhlLogFormSearch.getRawValue().hawbNumber;
      this.reportWindow1.open();
    }
  }

  setAWBNumber(event) {
    this.hawbNumber = event.param1;
  }

  /*
   Below parameters are used for collapsing / expanding of tabs used in the screen
    */

  /** it is used for expanding of the all the tabs together */
  onExpand() {
    this.expandAwbTab = true;
    this.expandShipperTab = true;
    this.expandConsigneeTab = true;
    this.expandNotifyTab = true;
    this.expandDOGoodsTab = true;
    this.expandLicenseTab = true;
    this.expandPermitTab = true;
    this.expandOCITab = true;
    this.expandChgDecTab = true;
    this.expandHarmonisedTab = true;
    this.expandOtherInfoTab = true;
  }

  /** it is used for collapsing of the all the tabs together */
  collapseall() {
    this.expandAwbTab = false;
    this.expandShipperTab = false;
    this.expandConsigneeTab = false;
    this.expandNotifyTab = false;
    this.expandDOGoodsTab = false;
    this.expandLicenseTab = false;
    this.expandPermitTab = false;
    this.expandOCITab = false;
    this.expandChgDecTab = false;
    this.expandHarmonisedTab = false;
    this.expandOtherInfoTab = false;
  }

  /* List of all the arrays used in screen
 arrayName: is the name of array
 arrayNameUse: hierarcy of array
 parameters: the parameters on which comparison will occur
 */
  arrayList = [
    {
      arrayName: 'shipper',
      arrayNameUse: ['address', 'contacts'],
      parameters: ['type', 'detail']
    },
    {
      arrayName: 'consignee',
      arrayNameUse: ['address', 'contacts'],
      parameters: ['type', 'detail']
    }, {
      arrayName: 'notify',
      arrayNameUse: ['address', 'contacts'],
      parameters: ['type', 'detail']
    }, {
      arrayName: 'license',
      arrayNameUse: null,
      parameters: ['number']
    },
    {
      arrayName: 'permit',
      arrayNameUse: null,
      parameters: ['number']
    },
    {
      arrayName: 'descriptionOfGoods',
      arrayNameUse: null,
      parameters: ['content']
    }, {
      arrayName: 'tariffs',
      arrayNameUse: null,
      parameters: ['code']
    }, {
      arrayName: 'shc',
      arrayNameUse: null,
      parameters: ['code']
    }, {
      arrayName: 'oci',
      arrayNameUse: null,
      parameters: ['country', 'identifier', 'csrcIdentifier', 'scsrcInformation']
    }];
}

