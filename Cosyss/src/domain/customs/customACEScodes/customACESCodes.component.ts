import { Component, OnInit } from "@angular/core";
import {
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
  ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormGroupDirective,
  FormArray,
  FormGroup,
  FormControl,
  FormControlName,
  Validators
} from "@angular/forms";
// Application
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  NgcWindowComponent,
  NgcUtility,
  NgcTabsComponent,
  PageConfiguration,
  CellsRendererStyle,
  NgcFormControl,
  NgcSHCInputComponent
} from "ngc-framework";
import { CustomACESService } from "./../customs.service";
import { CellsStyleClass } from "./../../../shared/shared.data";

@Component({
  selector: "app-customACESCodes",
  templateUrl: "./customACESCodes.component.html",
  styleUrls: ["./customACESCodes.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class CustomACESCodesComponent extends NgcPage {
  @ViewChild("addPopup")
  addPopup: NgcWindowComponent;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private customACESService: CustomACESService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  private customAcesForm: NgcFormGroup = new NgcFormGroup({
    acescode: new NgcFormControl(),
    addpopup: new NgcFormGroup({
      code: new NgcFormControl(),
      priority: new NgcFormControl(),
      matchedunmatched: new NgcFormControl(),
      displaytype: new NgcFormControl(),
      description: new NgcFormControl(),
      aedexemption: new NgcFormControl()
    }),
    customAces: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        code: new NgcFormControl(),
        priority: new NgcFormControl(),
        matchedunmatched: new NgcFormControl(),
        displaytype: new NgcFormControl(),
        description: new NgcFormControl(),
        aedexemption: new NgcFormControl()
      })
    ])
  });
  onSearchAcesCodes() {}
  onAddRow() {
    this.addPopup.open();
  }

  onLinkClick(event, index: any): void {
    let formArray: NgcFormArray = this.customAcesForm.get(
      "customAces"
    ) as NgcFormArray;
    formArray.controls.forEach((formGroup: NgcFormGroup) => {
      let selectItem: NgcFormControl = formGroup.get(
        "select"
      ) as NgcFormControl;
      if (selectItem && selectItem.value === true) {
        this.addPopup.open();
        this.customAcesForm.controls.addpopup
          .get("code")
          .patchValue(formGroup.get("code").value);
        this.customAcesForm.controls.addpopup
          .get("priority")
          .patchValue(formGroup.get("priority").value);
        this.customAcesForm.controls.addpopup
          .get("matchedunmatched")
          .patchValue(formGroup.get("matchedunmatched").value);
        this.customAcesForm.controls.addpopup
          .get("displaytype")
          .patchValue(formGroup.get("displaytype").value);
        this.customAcesForm.controls.addpopup
          .get("description")
          .patchValue(formGroup.get("description").value);
        this.customAcesForm.controls.addpopup
          .get("aedexemption")
          .patchValue(formGroup.get("aedexemption").value);
      }
    });
  }
  addpopupSave() {}
}
