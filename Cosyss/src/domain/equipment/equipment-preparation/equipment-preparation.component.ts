import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from "@angular/core";
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcInputComponent, NgcUtility, NgcWindowComponent, NgcContainerComponent, PageConfiguration
} from "ngc-framework";
import { ActivatedRoute, Router } from "@angular/router";
import { NgcFormControl } from "ngc-framework";
import { EquipmentService } from "../equipment.service";
import { EquipmentPrepData, EquipmentReleaseInfo, EquipmentRequestContainerInfo, EquipmentReleaseContainerInfo } from "../equipmentsharedmodel";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-equipment-preparation",
  templateUrl: "./equipment-preparation.component.html",
  styleUrls: ["./equipment-preparation.component.scss"]
})
@PageConfiguration({
  trackInit: true,

  noAutoFocus: true,
  autoBackNavigation: true
})
export class EquipmentPreparationComponent extends NgcPage implements OnInit {
  forwardedData: any;
  requestFlightId: any;
  equipmentreqIDData: any[];
  dataType: any;
  resp: any;
  lastRow: any;
  private equip: NgcFormGroup = new NgcFormGroup({
    equipmentreqID: new NgcFormControl([])
  });

  private equipmentform: NgcFormGroup = new NgcFormGroup({
    customerCode: new NgcFormControl(),
    equipmentArray: new NgcFormArray([
      new NgcFormGroup({
        blocktimeDesc: new NgcFormControl(),
        typeOfCollection: new NgcFormControl(),
        equipmentReleaseHeaderLabel: new NgcFormControl(),
        numEstPDReq: new NgcFormControl(),
        requestUldTyp: new NgcFormArray([]),
        releaseInfo: new NgcFormArray([
          new NgcFormGroup({
            uldList: new NgcFormArray([]),
          })
        ]),
        specialInstructions: new NgcFormArray([
          new NgcFormGroup({
            instruction: new NgcFormControl()
          })
        ])

      })
    ])
  });

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private equipmentService: EquipmentService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    // getting the forwarded data
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    this.forwardedData.agent = this.forwardedData[0].agent;
    this.requestFlightId = this.forwardedData[0].flightId;

    this.onSearch(this.forwardedData);
    //this.onTransportOnly();
  }

  private onSearch(requestData) {
    const arrayRawValue = requestData;
    const searchRequest = {
      equipmentreqID: [],
      customerCode: arrayRawValue.agent,


    };
    for (const eachRow of arrayRawValue) {
      searchRequest.equipmentreqID.push((eachRow.equipmentReqId));
    }
    this.equipmentService.preparation(searchRequest).subscribe(data => {
      this.resp = data.data;
      if (this.resp) {

        // modifying  respone object  to get special instructions
        this.resp.forEach(
          response => {
            let splInstruction = new Array();
            response.specialInstructions.forEach(si => {
              splInstruction.push(
                {
                  instruction: si
                })
            })
            response.specialInstructions = splInstruction
          }
        )
        this.equipmentform.get("equipmentArray").patchValue(this.resp);
        if (this.resp != null && this.resp.length > 0)
          this.equipmentform.get("customerCode").patchValue(this.resp[0].customerCode);
        //this.equipmentform.get(['equipmentArray', 'specialinstructionarray']).patchValue(specialInstructionsArray)
      }
    });

  }

  public onSave(event) {
    this.resetFormMessages();
    let request = (this.equipmentform.get(["equipmentArray"]) as NgcFormArray).getRawValue();
    const saveFormGroup: NgcFormGroup = (<NgcFormGroup>this.equipmentform);
    saveFormGroup.validate();
    this.clearFormControlMessages();
    if (this.equipmentform.invalid) {
      return;
    }
    else {
      let isDup = false;
      request.forEach((reqObj, subIndex) => {
        reqObj.loggedInUser = this.getUserProfile().userLoginCode;

        let uniq_values = []

        reqObj.releaseInfo.forEach((releaseObj, index) => {
          releaseObj.flightId = this.requestFlightId;
          if (releaseObj.pdNumber != "") {
            if (uniq_values.indexOf(releaseObj.pdNumber) != -1) {
              isDup = true;
              return this.showFormControlErrorMessage(<NgcFormControl>this.equipmentform.get(['equipmentArray', subIndex, 'releaseInfo', index, 'pdNumber']), 'equipment.duplicate');

            }
          } else {
            uniq_values.push(releaseObj.pdNumber);
          }
        });
      });
      if (isDup) {
        return;
      }

      // adding spl instructions with  carrier code
      request.forEach(req => {
        let splInstructionArray = new Array();
        req.specialInstructions.forEach(spl => {
          splInstructionArray.push(spl.instruction);
        })
        req.specialInstructions = splInstructionArray;
        req.carriercode = this.forwardedData[0].carriercode;
      })

      this.equipmentService.savepreparation(request).subscribe(data => {
        this.refreshFormMessages(data);
        if (data.success) {
          this.resp = data;
          this.onSearch(this.forwardedData);
          this.showSuccessStatus("g.completed.successfully");
        } else {
          if (data.data && data.data[0].warnForForeignUld) {
            this.showConfirmMessage(NgcUtility.translateMessage("maintain.foreign.uld.check.4", [data.data[0].warnigInfoAndErrorMessage])).then(fulfilled => {
              request[0].ackForeignUld = true;
              this.equipmentService.savepreparation(request).subscribe(data => {
                this.refreshFormMessages(data);
                if (data.success) {
                  this.resp = data;
                  this.onSearch(this.forwardedData);
                  this.showSuccessStatus("g.completed.successfully");
                } this.showResponseErrorMessages(data);
                for (const row of data.messageList) {
                  if (row.code != null) {
                    const errorData = { 'equipmentArray': data };
                    this.refreshFormMessages(errorData);
                    return;
                  }
                }
                const errorScenario = { 'equipmentArray': data.data };
                //this.equipmentform.patchValue(this.resp);
                this.refreshFormMessages(errorScenario);
              });
            }
            ).catch(reason => {
            });
          }
          this.showResponseErrorMessages(data);
          for (const row of data.messageList) {
            if (row.code != null) {
              const errorData = { 'equipmentArray': data };
              this.refreshFormMessages(errorData);
              return;
            }
          }
          const errorScenario = { 'equipmentArray': data.data };
          //this.equipmentform.patchValue(this.resp);
          this.refreshFormMessages(errorScenario);

        }
      }
        , error => {
          this.showErrorStatus(error);
        });
    }

  }

  onAdd(item, index) {
    let temp = (<NgcFormArray>this.equipmentform.get(['equipmentArray', index, 'releaseInfo'])).getRawValue();
    temp.push({ pdNumber: 'PD', uldList: [], remarks: "", equipmentReleaseInfoId: null, assignedTo: null, equipmentRequestReleaseTripInfoId: null, transportOnly: false, flagCRUD: "C" });
    this.equipmentform.get(['equipmentArray', index, 'releaseInfo']).patchValue(temp);
    let countIndex = (<NgcFormArray>this.equipmentform.get(['equipmentArray', index, 'releaseInfo'])).length;
    countIndex = countIndex - 1;
    // Async; Let the View be Ready
    setTimeout(() => {
      (<NgcFormControl>this.equipmentform.get(['equipmentArray', index, 'releaseInfo', countIndex, 'pdNumber'])).focus();
    }, 0);

  }

  onAddULD(item, index) {
    this.lastRow = (<NgcFormArray>this.equipmentform.get(["equipmentArray", index, "releaseInfo"])).length;
    let maxPds = this.equipmentform.get(["equipmentArray", index, "numEstPDReq"]).value;

    //For first formcontrol of ULD list type
    if (!this.lastRow) {
      this.lastRow = 0;
      this.equipmentform.get(["equipmentArray", index, "releaseInfo"])
        .patchValue([{
          flagCRUD: "C", pdNumber: "", uldList: [], remarks: "", equipmentReleaseInfoId: null,
          assignedTo: null, equipmentRequestReleaseTripInfoId: null, transportOnly: false
        }]);
      this.equipmentform.get(["equipmentArray", index, "releaseInfo", this.lastRow, 'transportOnly']).disable(
        {
          onlySelf: true,
          emitEvent: true
        }
      )
    }
    else {
      //  if (this.lastRow < maxPds)
      if (this.lastRow) {
        (this.equipmentform.get(["equipmentArray", index, "releaseInfo"]) as NgcFormArray)
          .addValue([{
            flagCRUD: "C", pdNumber: "", uldList: [], remarks: "", equipmentReleaseInfoId: null,
            assignedTo: null, equipmentRequestReleaseTripInfoId: null, transportOnly: false
          }]);
        this.equipmentform.get(["equipmentArray", index, "releaseInfo", this.lastRow, 'transportOnly']).disable(
          {
            onlySelf: true,
            emitEvent: true
          }
        )
      }

    }


  }

  public onBack(event) {
    this.navigateBack(this.equipmentform.getRawValue());
  }

  onDelete(parentIndex, index) {

    (this.equipmentform.get(['equipmentArray', parentIndex, 'releaseInfo', index]) as NgcFormGroup).markAsDeleted()

  }

  onTransportOnly() {
    (this.equipmentform.get('equipmentArray').valueChanges.subscribe((vaule: any) => {
      ((this.equipmentform.get(['equipmentArray']) as NgcFormArray)).controls.forEach(
        (formGroup: NgcFormGroup, parentindex: number) => {
          (this.equipmentform.get(['equipmentArray', parentindex, 'releaseInfo']) as NgcFormArray).controls.forEach(
            (form: NgcFormGroup, childindex: number) => {
              if (form.get('transportOnly').value) {
                form.get('uldList').setValidators(null);
                // form.get('uldArray').setValue(null);
              }
              else {
                form.get('uldList').setValidators(Validators.required);
              }
            }
          )
        }
      )
    }
    ))
  }

  onTaskList() {
    this.navigateTo(this.router, 'equipment/tasklist', null);
  }
  onCreateTrip() {
    this.navigateTo(this.router, 'equipment/createtrip', null);
  }
  onRequest() {
    this.navigateTo(this.router, 'equipment/equipmentrequesting', null);
  }
}
