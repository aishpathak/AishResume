import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild
} from "@angular/core";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcInputComponent,
  NgcUtility,
  NgcWindowComponent,
  NgcContainerComponent,
  PageConfiguration,
  CellsRendererStyle
} from "ngc-framework";
import { RouterModule, Router, ActivatedRoute } from "@angular/router";
import {
  FormArray,
  FormControl,
  AbstractControl,
  Validator,
  Validators,
  FormArrayName
} from "@angular/forms";
import { NgcFormControl } from "ngc-framework/core/model/formcontrol.model";
import { StatusMessage } from "ngc-framework";
import { MastersService } from "../masters.service";

import { BroadcastResponse } from "../masters.sharedmodel";
import { CellsStyleClass } from "../../../shared/shared.data";
import { ApplicationFeatures } from "../../common/applicationfeatures";

@Component({
  selector: "app-broadcastnotificationmessage",
  templateUrl: "./broadcastnotificationmessage.component.html",
  styleUrls: ["./broadcastnotificationmessage.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class BroadcastnotificationmessageComponent extends NgcPage {
  form: any;
  role: any;
  response: any;

  private broadcastForm: NgcFormGroup = new NgcFormGroup({
    notificationTitle: new NgcFormControl(),
    userGroupTo: new NgcFormControl(),
    userGroupList: new NgcFormControl(),
    roleCode: new NgcFormControl(),
    startDate: new NgcFormControl(),
    expiryDate: new NgcFormControl(),
    priority: new NgcFormControl(),
    message: new NgcFormControl(),
    carrierList: new NgcFormControl(),
    notificationType: new NgcFormControl(),
    dataArray: new NgcFormArray([])
  });
  //This flag is used for feature enable
  broadCastFeature: boolean;
  //This flag is used for enable or disable the carrier dropdown based on the 'To' dropdown
  enableSelection: boolean = false;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private masterService: MastersService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    //feature access for all tenants
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.General_BroadCastMessage_ByAirline)) {
      this.broadCastFeature = true;
    } else {
      this.broadCastFeature = false;
    }
    this.onSearch();
  }
  getRoleCode(item) {
    this.role = item.code;
  }

  onBroadcast() {
    this.broadcastForm.validate();
    if (!this.broadcastForm.valid) {
      return;
    }
    const request = new BroadcastResponse();
    request.notificationTitle = this.broadcastForm.get("notificationTitle").value;
    //passing multiselected dropdown values into the request
    request.userGroupList = this.broadcastForm.get("userGroupList").value;
    request.roleCode = this.broadcastForm.get("roleCode").value;
    request.startDate = this.broadcastForm.get("startDate").value;
    request.expiryDate = this.broadcastForm.get("expiryDate").value;
    request.priority = this.broadcastForm.get("priority").value;
    request.message = this.broadcastForm.get("message").value;
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.General_BroadCastMessage_ByAirline)) {
      //For AAT tenant the carrier list and notification type will be sended to backend
      request.carrierList = this.broadcastForm.get("carrierList").value;
      request.notificationType = this.broadcastForm.get("notificationType").value;
    }
    this.resetFormMessages();
    this.masterService.addData(request).subscribe(
      data => {
        this.response = data.data;
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus("g.completed.successfully");
          this.broadcastForm.reset();
          this.onSearch();

          //this.broadcastForm.patchValue(data.data);
        }
      },
      error => {
        this.showErrorStatus(error);
      }
    );
  }

  onSearch() {
    this.masterService.fetchBroadCastData().subscribe(data => {
      if (!data.data || data.data.length <= 0) {
        this.broadcastForm.get("dataArray").reset();
      }
      data.data.forEach(element => {
        if (element.message.length >= 200) {
          element.message1 = element.message.substring(0, 200) + '...';


        } else {
          element.message1 = element.message;


        }
      });

      this.broadcastForm.get("dataArray").patchValue(data.data);
    });
  }

  onDeleteBroadcastMessage() {
    let broadcastArray = [];
    const broadcastmsg: any = (<NgcFormArray>(
      this.broadcastForm.get("dataArray")
    )).getRawValue();
    broadcastmsg.forEach(value => {
      if (value.check) {
        broadcastArray.push(value);
      }
    });
    if (broadcastArray.length >= 0) {
      this.masterService.deleteData(broadcastArray).subscribe(data => {
        this.showSuccessStatus("g.completed.successfully");
        this.response = data.data;
        this.onSearch();
      });
    } else if (broadcastArray.length < 0) {
      this.showInfoStatus("master.select.atleast.one.row");
    }
  }

  onConfirm(event) {
    let flag: boolean = false;
    const broadcast = (<NgcFormArray>(
      this.broadcastForm.controls["dataArray"]
    )).getRawValue();
    broadcast.forEach(element => {
      if (element.check) flag = true;
    });

    if (flag) {
      this.showConfirmMessage(
        "delete.selected.records"
      ).then(fulfilled => {
        this.onDeleteBroadcastMessage();
      });
    } else {
      this.showInfoStatus("master.select.atleast.one.row.to.delete");
    }
  }

  /**
   * Cells Style Renderer
   *
   * @param value Value
   * @param rowData Row Data
   * @param level Level
   */
  public priorityCellsStyleRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    if (value == "HIGH") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (value == "MEDIUM") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    //
    return cellsStyle;
  };

  public mCellsStyleRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();

    return cellsStyle;
  };

  onViewMore(group) {
    const record = this.broadcastForm.getRawValue().dataArray[group];

    this.broadcastForm
      .get([
        "dataArray",
        group,
        "message1",

      ])
      .patchValue(record.message);

    this.broadcastForm.get(['dataArray', group, 'clickedItem']).patchValue(true);

  }

  onViewLess(group) {

    const record = this.broadcastForm.getRawValue().dataArray[group];
    if (record.message.length >= 200) {
      record.message = record.message.substring(0, 200) + '...';


    }

    this.broadcastForm
      .get([
        "dataArray",
        group,
        "message1",

      ])
      .patchValue(record.message);

    this.broadcastForm.get(['dataArray', group, 'clickedItem']).patchValue(false);
  }

  //This function is used to enable the carrier dropdown if user selects airlines in 'To' drodown.
  onSelectUserGroupList(event) {
    this.enableSelection = false;
    event.forEach(userGroupList => {
      if (userGroupList.desc == 'Airlines') {
        this.enableSelection = true;
      } else {
        this.broadcastForm.get('carrierList').patchValue(null);
      }
    });
  }

}
