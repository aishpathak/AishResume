import { Component, ElementRef, NgZone, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey, NgcFileUploadComponent } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomACESService } from '../customs.service';
import { Validators } from '@angular/forms';
import { CreateAmendDcDetails } from '../customs.sharedmodel';

@Component({
  selector: 'app-amend-dc-details',
  templateUrl: './amend-dc-details.component.html',
  styleUrls: ['./amend-dc-details.component.scss']
})
export class AmendDcDetailsComponent extends NgcPage implements OnInit {
  showDataFlag: boolean;
  data: any;
  response: any;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private customsService: CustomACESService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private AmendDcSearchForm: NgcFormGroup = new NgcFormGroup({
    flightNo: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    shipmentType: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    content: new NgcFormControl(),
    permitNo: new NgcFormArray([
      new NgcFormGroup({
        permitNo: new NgcFormControl('', [Validators.maxLength(16)]),
      })
    ]),

    duitableList:
      new NgcFormArray([
        new NgcFormGroup({

          dcCode: new NgcFormControl(''),
          dcQty: new NgcFormControl(''),
          dcUnit: new NgcFormControl(''),
          dcPieces: new NgcFormControl(''),
          dcRemark: new NgcFormControl('')
        })
      ]),
    HawbList: new NgcFormArray([
      new NgcFormGroup({
        hawbNumber: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        noOfPermits: new NgcFormControl(),
        dcType: new NgcFormControl(),
        dcContent: new NgcFormControl()

      })
    ])
  });

  ngOnInit() {
  }

  defaultValuesAddShipment = {
    dcCode: '',
    dcQty: '',
    dcUnit: '',
    dcPieces: '',
    dcRemark: '',
    temporaryDeleteCheckBox: false,
  };

  onSearch() {
    let request = this.AmendDcSearchForm.getRawValue();
    console.log(request);
    this.customsService.fetchDcDetails(request).subscribe(response => {
      this.refreshFormMessages(response);
      this.data = response.data;
      this.showDataFlag = true;
      console.log(this.data);
      console.log(this.data.hawbList);

      this.AmendDcSearchForm.get('HawbList').patchValue(this.data.hawbList);
      this.AmendDcSearchForm.get('duitableList').patchValue(this.data.duitableList);
      this.AmendDcSearchForm.get('permitNo').patchValue(this.data.permitNo);
      if (this.data.hawbList.length > 0) {
        let sno1 = 1;
        this.data.hawbList.forEach(element => {
          element.sno = sno1;
          sno1 = sno1 + 1;
        });
      }

      console.log(this.AmendDcSearchForm.getRawValue());
    }, error => {
      this.showErrorStatus(error);
    })
  }


  //Add permit
  addPermit() {
    (<NgcFormArray>this.AmendDcSearchForm.get("permitNo")).addValue([
      {
        permitNo: "",
        customDutiableCommodityId: ""
      }
    ]);
  }

  //delete Permit
  deletePermit(index) {
    let perArr = (<NgcFormArray>this.AmendDcSearchForm.get("permitNo")).length;
    console.log(perArr);
    if (perArr > 1) {
      (this.AmendDcSearchForm.get(["permitNo", index]) as NgcFormGroup).markAsDeleted();
    }
  }

  onAddRow() {
    (<NgcFormArray>this.AmendDcSearchForm.
      controls['duitableList']).
      addValue([this.defaultValuesAddShipment]);
  }

  temporaryDeleteRow() {
    const DuitableList =
      this.AmendDcSearchForm.controls.
        duitableList.value;
    console.log(DuitableList);
    DuitableList.forEach(element => {
      if (element.temporaryDeleteCheckBox) {
        (<NgcFormArray>this.AmendDcSearchForm.controls['duitableList']).deleteValue([element]);
      }
    });
  }

  saveDcDetails() {

    let requestData = new CreateAmendDcDetails();
    requestData = this.AmendDcSearchForm.value;
    console.log(requestData);
    this.customsService.saveDcDetails(requestData).subscribe(data => {
      if (data.data) {
        this.resetFormMessages();
        this.showSuccessStatus("g.completed.successfully");
        this.response = data.data;
      }
    });
  }


}
