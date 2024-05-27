import {
  Component,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ReflectiveInjector,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  Pipe,
  PipeTransform,
  ContentChildren,
  forwardRef,
  ViewChild,
  OnInit
} from "@angular/core";

import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  NgcWindowComponent,
  NgcUtility,
  NgcTabsComponent,
  NgcButtonComponent,
  PageConfiguration
} from "ngc-framework";
import { ActivatedRoute, Router } from "@angular/router";

import { FormControlName } from "@angular/forms";
import { AdminService } from "../../admin.service";
import {
  MaintainAgentLocation,
  DeleteRoleResponse
} from "../../admin.sharedmodel";

@Component({
  selector: "app-maintain-agent-location",
  templateUrl: "./maintain-agent-location.component.html",
  styleUrls: ["./maintain-agent-location.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class MaintainAgentLocationComponent extends NgcPage implements OnInit {
  @ViewChild("searchbutton") searchbutton: NgcButtonComponent;
  @ViewChild("updateInsertionWindow") updateInsertionWindow: NgcWindowComponent;

  /**
* This flag is used for displaying of table when the criteria is right
*/
  isTableFlg: boolean;
  arrayList: any[];
  resp: any;
  record: any;
  simpleArray: any;
  routedInformation: any;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private adminService: AdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private MaintainAgentForm: NgcFormGroup = new NgcFormGroup({
    customerCode: new NgcFormControl(),
    customerName: new NgcFormControl(),
    sno: new NgcFormControl(),
    deliveryLocation: new NgcFormControl(),
    AgentArray: new NgcFormArray([
      new NgcFormGroup({
        customerCode: new NgcFormControl(),
        customerName: new NgcFormControl(),
        deliveryLocation: new NgcFormControl(),
        Edit: new NgcFormControl()
      })
    ])
  });

  private EditAgentLocForm: NgcFormGroup = new NgcFormGroup({
    customerCode: new NgcFormControl(),
    customerName: new NgcFormControl(),
    MaintainAgentArray: new NgcFormArray([
      new NgcFormGroup({
        id: new NgcFormControl(false),
        deliveryLocation: new NgcFormControl()
      })
    ])
  });

  /**
  *
  *This method is called on search and return Agent Location list.
  * @memberof MaintainAgentLocationComponent
  */
  onSearch() {
    this.resetFormMessages();
    let i = 0;
    const request = this.MaintainAgentForm.getRawValue();
    if (request.customerCode == "") {
      request.customerCode = null;
    }
    this.adminService.fetchAgentLocList(request).subscribe(
      data => {
        this.resp = data;
        this.arrayList = this.resp.data;
        if (this.arrayList != null) {
          this.arrayList = this.arrayList.map(function (obj) {
            obj.deliveryLocationList = obj.dlvLocationList.join(", ");
            //Array of string is converted into Array of location object
            var deliveryLocationArray = new Array();
            obj.dlvLocationList.forEach(locationObj => {
              deliveryLocationArray.push({ deliveryLocation: locationObj });
            });
            obj.deliveryLocationArray = deliveryLocationArray;
            return obj;
          });
          //This is used to remove the Black listed agents
          this.arrayList.forEach(blacklist => {
            if (blacklist.blacklistEndDate != null) {
              this.arrayList.splice(i, 1);
            }
            i++;
          });
          this.MaintainAgentForm.controls["AgentArray"].patchValue(
            this.arrayList
          );
          this.isTableFlg = true;
        } else {
          this.isTableFlg = false;
          this.refreshFormMessages(data);
        }
      },
      error => {
        this.showErrorStatus("Error:" + error);
      }
    );
  }

  /**
    *
    *This method is called On click  edit link and navigate to popup for edit/delete.
    * @memberof MaintainAgentLocationComponent
    */
  onLinkClick(event) {
    this.EditAgentLocForm
      .get("customerName")
      .setValue(event.record.customerName);
    this.EditAgentLocForm
      .get("customerCode")
      .setValue(event.record.customerCode);
    this.arrayList[event.record.uid].deliveryLocationArray.forEach(select => {
      select["id"] = false;
      select["flagCRUD"] = "U";
    });
    this.simpleArray = this.arrayList[event.record.uid].deliveryLocationArray;
    (<NgcFormArray>this.EditAgentLocForm.get("MaintainAgentArray")).patchValue(
      this.simpleArray
    );
    if (event.column === "EDIT") {
      this.updateInsertionWindow.open();
    }
  }

  /**
     *
     *This method is called On click  of ADD Button to add blank row
     * @memberof MaintainAgentLocationComponent
     */
  onAdd(event) {
    const noOfRows = (<NgcFormArray>this.EditAgentLocForm.get(
      "MaintainAgentArray"
    )).length;
    const lastRow = noOfRows
      ? (<NgcFormArray>this.EditAgentLocForm.get("MaintainAgentArray"))
        .controls[noOfRows - 1]
      : null;
    if (noOfRows === 0 || lastRow.get("deliveryLocation").value) {
      (<NgcFormArray>this.EditAgentLocForm.get("MaintainAgentArray")).addValue([
        {
          id: false,
          flagCRUD: "C",
          deliveryLocation: ""
        }
      ]);
    } else {
      this.showErrorStatus(
        "Please fill the deliveryLocation first to add another row"
      );
    }
  }

  /**
     *
     *This method is called On click  of Save Button to save Delivery Location
     * @memberof MaintainAgentLocationComponent
     */
  save() {
    const request = this.EditAgentLocForm.getRawValue();
    let i = 0;
    let selectFlag = false;
    const savelocation = new Array<MaintainAgentLocation>();
    request.MaintainAgentArray.forEach(delLoc => {
      const modelData: MaintainAgentLocation = new MaintainAgentLocation();
      if (delLoc["flagCRUD"] === "U") {
        modelData.customerCode = this.EditAgentLocForm.get(
          "customerCode"
        ).value;
        modelData.customerName = this.EditAgentLocForm.get(
          "customerName"
        ).value;
        modelData.deliveryLocation = delLoc.deliveryLocation;
        modelData.flagCRUD = delLoc.flagCRUD;
        modelData.locId = this.simpleArray[i].deliveryLocation;
        savelocation.push(modelData);
        i++;
      }
      if (delLoc["flagCRUD"] === "C") {
        modelData.customerCode = this.EditAgentLocForm.get(
          "customerCode"
        ).value;
        modelData.customerName = this.EditAgentLocForm.get(
          "customerName"
        ).value;
        modelData.deliveryLocation = delLoc.deliveryLocation;
        modelData.flagCRUD = delLoc.flagCRUD;
        savelocation.push(modelData);
      }
    });

    savelocation.forEach(delivLocation => {
      if (!delivLocation.deliveryLocation) {
        selectFlag = true;
      }
    });

    if (selectFlag) {
      this.showErrorStatus("admin.add.delivery.location");
    } else {
      this.adminService.addDeliveryLoc(savelocation).subscribe(
        data => {
          if (!data.messageList) {
            this.onSearch();
            this.updateInsertionWindow.hide();
            this.showSuccessStatus("g.added.successfully");
          } else {
            this.refreshFormMessages(data);
          }
        },
        error => {
          this.showErrorStatus(error.messageList[0].message);
          this.updateInsertionWindow.hide();
        }
      );
    }
  }

  /**
      *
      *This method is called On click  of Delete Button to Delete selecetd Delivery Location
      * @memberof MaintainAgentLocationComponent
      */
  onDelete() {
    const request = this.EditAgentLocForm.getRawValue();
    const deleteArr = new Array<any>();
    let arrayDelete = (<NgcFormArray>this.EditAgentLocForm.controls[
      "MaintainAgentArray"
    ]).getRawValue();
    arrayDelete.forEach(addRow => {
      addRow.customerCode = this.EditAgentLocForm.get('customerCode').value;
      addRow.customerName = this.EditAgentLocForm.get('customerName').value;
      if (addRow.id == true) deleteArr.push(addRow);
    });
    this.adminService.deleteDeliveryLoc(deleteArr).subscribe(data => {
      (<NgcFormArray>this.EditAgentLocForm.get(
        "MaintainAgentArray"
      )).deleteValue(deleteArr);
      this.updateInsertionWindow.hide();
      this.onSearch();
      this.showSuccessStatus("g.deleted.successfully");
    });
  }

  /**
       *
       *This method is showing the confirmation message for deleting selecetd Delivery Location
       * @memberof MaintainAgentLocationComponent
       */
  onConfirm(event) {
    let arrayDel = (<NgcFormArray>this.EditAgentLocForm.controls[
      "MaintainAgentArray"
    ]).getRawValue();
    let selectFlag = false;
    arrayDel.forEach(addRow => {
      if (addRow.id == true) {
        selectFlag = true;
      }
    });
    if (selectFlag) {
      this.showConfirmMessage(
        "admin.delete.selected.records.confirmation"
      ).then(fulfilled => {
        this.onDelete();
      });
    } else {
      this.showErrorStatus("admin.select.one.record.delete");
    }
  }
  /**
       *
       *This method is used to  Auto populates agent Name
       * @memberof MaintainAgentLocationComponent
       */
  OnSelectCode(event) {
    this.MaintainAgentForm.get("customerName").setValue(event.desc);
  }

  /**
       *
       *This method is used to  Auto populates agent Code
       * @memberof MaintainAgentLocationComponent
       */
  OnSelectName(event) {
    this.MaintainAgentForm.get("customerCode").setValue(event.code);
  }

  public onBack(event) {
    if(this.routedInformation != null){
      this.navigateBack(this.routedInformation);
    }else{     
      this.navigateBack(this.MaintainAgentForm.getRawValue());
    }    
  }

  ngOnInit() {
    this.routedInformation = this.getNavigateData(this.activatedRoute);
    if(this.routedInformation != null){
      this.MaintainAgentForm.get("customerCode").setValue(this.routedInformation.agent);
      this.onSearch();
    }
  }
}
