import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgcFormArray, NgcUtility, NgcFormControl, NgcFormGroup, NgcPage, NgcWindowComponent, PageConfiguration } from "ngc-framework";
import { ApplicationEntities } from "../../common/applicationentities";
import { ImportService } from "../import.service";

@Component({
  selector: "app-maintainserviceprovider",
  templateUrl: "./maintainserviceprovider.component.html",
  styleUrls: ["./maintainserviceprovider.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  focusToBlank: true,
  focusToMandatory: true
})
export class MaintainserviceproviderComponent extends NgcPage
  implements OnInit {
  @ViewChild("windowAdd") windowAdd: NgcWindowComponent;
  response: any;
  responseArray: any[];
  errors: any;
  typeAll: string[] = ["PAX", "FRT"];
  showTable: boolean;
  shownCustomerName: boolean
  showButtons: boolean;
  currentDate: Date = NgcUtility.getCurrentDateOnly();
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }
  ngOnInit() {
    super.ngOnInit();
    let serviceProviderData = this.getNavigateData(this.route);
    if (serviceProviderData != null && serviceProviderData != "") {
      this.maintainServiceProviderForm.get('searchServiceProvider.serviceProviderType').setValue(serviceProviderData.serviceType);
      this.maintainServiceProviderForm.get('searchServiceProvider.carrier').setValue(serviceProviderData.carrierCode);
      this.onSearch();
    }
  }
  private maintainServiceProviderForm: NgcFormGroup = new NgcFormGroup({
    serviceCode: new NgcFormControl(),
    customerShortName: new NgcFormControl(),
    customerCode: new NgcFormControl(),
    customerName: new NgcFormControl(),
    searchServiceProvider: new NgcFormGroup({
      serviceCode: new NgcFormControl(),
      customerShortName: new NgcFormControl(),
      serviceProviderType: new NgcFormControl(),
      carrier: new NgcFormControl()
    }),

    serviceProviderList: new NgcFormArray([
      new NgcFormGroup({
        scInds: new NgcFormControl(),
        serviceProviderType: new NgcFormControl(),
        terminalCode: new NgcFormControl(),
        carrier: new NgcFormControl(),
        flightKey: new NgcFormControl(),
        flightType: new NgcFormControl(),
        bodyType: new NgcFormControl(),
        ldwaiveApplicable: new NgcFormControl(),
        ldwaiveApplicablelimit: new NgcFormControl(),
        effectiveDateFrom: new NgcFormControl(),
        effectiveDateTo: new NgcFormControl(),
        stdFrom: new NgcFormControl(),
        stdTo: new NgcFormControl(),
        staFrom: new NgcFormControl(),
        staTo: new NgcFormControl(),
        customerCode: new NgcFormControl(),
        customerShortName: new NgcFormControl(),
        manageMail: new NgcFormArray([])
      })
    ]),
    manageMail: new NgcFormArray([
      new NgcFormGroup({
        communicationType: new NgcFormControl()
      })
    ])
  });
  /**
    * On Next (nextPage)
    *
    * @param event Event
    */
  public onAddService(event) {
    const indices: any = [];

    for (let index = this.responseArray.length - 1; index >= 0; index--) {
      const item = (<NgcFormArray>this.maintainServiceProviderForm.get("serviceProviderList"))["controls"][index]["value"];
      if (item.scInds) {
        indices.push(item);
      }
    }
    if (!indices[0]) {
      this.showErrorStatus("imp.err131");
      return;
    }
    this.importService.editServiceDetails(indices).subscribe(data => {
      this.response = data;
      this.responseArray = this.response.data;
      if (this.responseArray !== null) {
        //  this.importService.dataServiceList = this.responseArray;
        this.navigate("import/changeserviceprovider", this.responseArray);
      } else {
        this.errors = this.response.messageList;
      }
    });
  }

  /**
     * To add new text box
     */
  addEmailText(event) {
    // this.disableAddRow.disabled = true;
    (<NgcFormArray>this.maintainServiceProviderForm.controls["manageMail"]).addValue([{
      communicationType: "",
      Delete: ""
    }]);
  }
  /**
   * This function, get Selected value from Customer Master and show the description 
   *
  */
  public onSelectCarrier(event, item) {
    if (event.code) {
      this.maintainServiceProviderForm.get(["searchServiceProvider", "customerShortName"]).setValue(event.desc);
      this.responseArray = [];
      (<NgcFormArray>this.maintainServiceProviderForm.controls["serviceProviderList"]).patchValue(this.responseArray);
      this.maintainServiceProviderForm.get('serviceProviderList').reset();
      this.shownCustomerName = true;
    }
  }
  public onSelectCarrierCode(event, item) {
    if (event.code) {
      item.get(["customerShortName"]).setValue(event.desc);
    }
  }
  public onSave(event) {
    let dateCheckError: boolean = false;
    const formArray: NgcFormArray = this.maintainServiceProviderForm.get("serviceProviderList") as NgcFormArray;

    const items = this.maintainServiceProviderForm.getRawValue().searchServiceProvider;

    const item = (<NgcFormArray>this.maintainServiceProviderForm.get("serviceProviderList")).getRawValue();

    let listOfServceiProviders = [];

    for (let element of item) {

      if (element.scInds == true && (element.effectiveDateFrom == null || element.effectiveDateFrom < this.currentDate)) {
        this.showErrorStatus('warehouse.ed.less.cd.error');
        return;
      }

      if (element.effectiveDateFrom !== null && element.effectiveDateFrom)
        if (element.effectiveDateFrom !== null && element.effectiveDateTo !== null && element.effectiveDateFrom > element.effectiveDateTo) {
          dateCheckError = true;
          break;
        }
    }
    if (dateCheckError) {
      this.showErrorStatus("admin.effectivedaterror");
      return;
    }

    if (items.serviceCode !== null) {
      item.forEach(element => {
        if (element.scInds) {
          element.customerCode = items.serviceCode;
          element.customerShortName = items.customerShortName;
          listOfServceiProviders.push(element);
        }
      });
    } else {
      if (NgcUtility.isBlank(item[0].customerCode)) {
        this.showErrorStatus("imp.please.select.service.provider");
        return;
      }
      item.forEach(element => {
        if (element.scInds) {
          if (element.customerCode == null || element.customerCode == '') {
            element.customerCode = item[0].customerCode;
            element.customerShortName = item[0].customerShortName;
          }
          listOfServceiProviders.push(element);
        }
      });
    }
    console.log(listOfServceiProviders.length);
    if (listOfServceiProviders.length > 0) {
      this.importService.saveServiceList(listOfServceiProviders).subscribe(data => {
        this.response = data;
        this.refreshFormMessages(data);
        if (this.response.data !== null) {
          this.onSearch();
          this.showSuccessStatus("g.completed.successfully");
        }
      },
        error => {
          this.showErrorStatus("error.import.enter.mandatory.fields");
        }
      );
    } else {
      this.showInfoStatus("import.info105");
    };

  }
  onSearch() {

    // this.showList = false;
    //  let newArray: any = new Array();
    const serviceProviderList = this.maintainServiceProviderForm.getRawValue().searchServiceProvider;

    if (!serviceProviderList.serviceCode) {
      // this.showErrorStatus("Service Code is Mandatory");
      // return;
      this.shownCustomerName = false;
    } else {
      this.shownCustomerName = true
    }
    this.importService.getServiceProviderList(serviceProviderList).subscribe(data => {
      this.response = data;
      this.responseArray = this.response.data;
      this.refreshFormMessages(data);
      if (this.response.data.length !== 0) {
        this.showTable = true;
        this.showButtons = true;
        (<NgcFormArray>this.maintainServiceProviderForm.controls["serviceProviderList"]).patchValue(this.response.data);
      } else {
        this.showTable = false;
        this.showButtons = true;
        this.showErrorMessage("no.record.found");
      }
    },
      // tslint:disable-next-line:no-shadowed-variable
      error => {
        this.showErrorStatus("no.record.found");
      }
    );
    // }
  }

  /**
       * To add new text box
       */
  onAddProvider(event) {
    if (!this.showTable) {
      this.showTable = true;
      (<NgcFormArray>this.maintainServiceProviderForm.controls["serviceProviderList"]).deleteValueAt(0);
      this.newRow();
    } else {
      this.showTable = true;
      this.newRow();
    }
  }


  newRow() {
    (<NgcFormArray>this.maintainServiceProviderForm.controls["serviceProviderList"]).addValue([{
      scInds: false,
      serviceProviderType: null,
      terminalCode: null,
      carrier: null,
      flightKey: null,
      flightType: null,
      bodyType: null,
      ldwaiveApplicable: null,
      ldwaiveApplicablelimit: null,
      effectiveDateFrom: null,
      effectiveDateTo: null,
      stdFrom: null,
      staFrom: null,
      stdTo: null,
      staTo: null,
      customerCode: this.maintainServiceProviderForm.get(["searchServiceProvider", "serviceCode"]).value,
      customerShortName: this.maintainServiceProviderForm.get(["searchServiceProvider", "customerShortName"]).value
    }]);
  }

  /**
  * This function is  delete for uld type data
  */
  public deleteData() {
    const serviceData = (<NgcFormArray>this.maintainServiceProviderForm.get("serviceProviderList")).getRawValue();
    const indices: any = [];
    let i = 0;
    for (const eachRow of serviceData) {
      if (eachRow.scInds) {
        indices.push(eachRow);
        (<NgcFormArray>this.maintainServiceProviderForm.get("serviceProviderList")).deleteValueAt(eachRow);
        --i;
      }
      ++i;
    }
    this.importService.deleteServiceProvider(indices).subscribe(
      data => {
        this.refreshFormMessages(data);
        this.response = data;
        this.onSearch();
      },
      error => {
        this.showErrorStatus("imp.err132");
      }
    );
  }
  /**
 * This Function will work for Window Cancel Button
 */
  public onCancel(event) {
    this.windowAdd.hide();
  }
}
