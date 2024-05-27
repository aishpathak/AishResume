import {
  Component,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild,
  OnInit
} from "@angular/core";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcUtility,
  NgcButtonComponent, PageConfiguration
} from "ngc-framework";
import {
  Validators,
  PatternValidator,
  FormControl,
  FormArray
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DangerousgoodsService } from '../dangerousgoods.service';
import {
  Dgregulations,
  UnidDetails,
  SearchDgregulations,
  DgDetails,
  DgDetailsList,
  Count
} from "../../export.sharedmodel";
import { element } from "protractor";

@Component({
  selector: "app-dgRegulations",
  templateUrl: "./dgRegulations.component.html",
  styleUrls: ["./dgRegulations.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class DgRegulationsComponent extends NgcPage implements OnInit {
  public dgregulationform: NgcFormGroup = new NgcFormGroup({
    unid: new NgcFormControl(),
    psnn: new NgcFormControl(""),
    unidDetails: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(false),
        psn: new NgcFormControl(),
        tech: new NgcFormControl(false),
        classCode: new NgcFormControl(),
        shc: new NgcFormControl(),
        erg: new NgcFormControl(),
        sbr1: new NgcFormControl(),
        imp1: new NgcFormControl(),
        sbr2: new NgcFormControl(),
        imp2: new NgcFormControl(),
        dgDetails: new NgcFormArray([
          new NgcFormGroup({
            select: new NgcFormControl(false),
            pg: new NgcFormControl(),
            fbd: new NgcFormControl(),
            mlqPInfo: new NgcFormControl(),
            mlqQuantity: new NgcFormControl(),
            mlqUnit: new NgcFormControl(),
            mpcPInfo: new NgcFormControl(),
            mpcQuantity: new NgcFormControl(),
            mpcUnit: new NgcFormControl(),
            mcoPInfo: new NgcFormControl(),
            mcoQuantity: new NgcFormControl(),
            mcoUnit: new NgcFormControl(),
            remarks: new NgcFormControl()
          })
        ])
      })
    ])
  });

  showTable = false;
  unid: any;
  psn: any;
  unidDetails = new Array();
  search = new SearchDgregulations();

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private dgRegulationsService: DangerousgoodsService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.dgregulationform.get("psnn").patchValue('');
  }

  onSHCChange(item, index) {
    this.dgregulationform.get(['unidDetails', index, 'shc']).value;
    this.dgregulationform.get(['unidDetails', index, 'classCode']).patchValue(item.code);
  }

  onSbr1Change(item, index) {
    this.dgregulationform.get(['unidDetails', index, 'imp1']).value;
    this.dgregulationform.get(['unidDetails', index, 'sbr1']).patchValue(item.code);
  }

  onSbr2Change(item, index) {
    this.dgregulationform.get(['unidDetails', index, 'imp2']).value;
    this.dgregulationform.get(['unidDetails', index, 'sbr2']).patchValue(item.code);
  }

  onClassChange(item, index) {
    this.dgregulationform.get(['unidDetails', index, 'classCode']).value;
    this.dgregulationform.get(['unidDetails', index, 'shc']).patchValue(item.desc);
  }

  onSbr1ClassChange(item, index) {
    this.dgregulationform.get(['unidDetails', index, 'sbr1']).value;
    this.dgregulationform.get(['unidDetails', index, 'imp1']).patchValue(item.desc);
  }

  onSbr2ClassChange(item, index) {
    this.dgregulationform.get(['unidDetails', index, 'sbr2']).value;
    this.dgregulationform.get(['unidDetails', index, 'imp2']).patchValue(item.desc);
  }

  getPsn(item) {
    if (item && item.lovSelection) {
      this.dgregulationform.get("psnn").patchValue(item.desc);
    }
  }

  getDgdDetails() {
    this.resetFormMessages();
    this.unid = this.dgregulationform.get("unid").value;
    this.psn = this.dgregulationform.get("psnn").value;

    this.search.unid = this.unid;
    if (this.psn === null) {
      this.search.psn = "";
    } else {
      this.search.psn = this.psn;
    }
    this.dgRegulationsService.getDgRegulations(this.search).subscribe(
      data => {
        const resp: any = data.data;
        if (!this.showResponseErrorMessages(data)) {
          this.showTable = true;
          resp.forEach(e => {
            e["select"] = false;
            e.dgDetails.forEach(ele => {
              ele["select"] = false;
            });
          });
          this.unidDetails = resp;
          this.dgregulationform.get("unidDetails").patchValue(resp);
        } else {
          this.showTable = false;
          this.showErrorStatus('no.record');
        }
      },
      error => {
        this.showTable = false;
        this.showErrorStatus(error);
      }
    );
  }

  addPsn() {
    (<NgcFormArray>this.dgregulationform.get('unidDetails')).addValue([
      {
        select: false,
        psn: "",
        regId: null,
        tech: false,
        classCode: "",
        shc: "",
        erg: "",
        sbr1: "",
        imp1: "",
        sbr2: "",
        imp2: "",
        flagCRUD: "C",
        dgDetails: new Array()
      }
    ]);
  }

  addRow(item, index) {
    const check = this.dgregulationform.getRawValue().unidDetails[index].select;
    let flag = false;
    if (check) {
      flag = true;
    }
    (<NgcFormArray>this.dgregulationform.get(['unidDetails', index, 'dgDetails'])).addValue([
      {
        select: flag,
        pg: "",
        fbd: "",
        mlqPInfo: "",
        mlqQuantity: 0,
        mlqUnit: "",
        mpcPInfo: "",
        mpcQuantity: 0,
        mpcUnit: "",
        mcoPInfo: "",
        mcoQuantity: 0,
        mcoUnit: "",
        remarks: "",
        flagCRUD: "C"
      }
    ]);
  }

  onSave() {
    // For validating Array
    (<NgcFormArray>this.dgregulationform.get(['unidDetails'])).validate();
    if (this.dgregulationform.get(['unidDetails']).invalid) {
      return;
    }
    let index = 0;
    const detail: any = this.dgregulationform.getRawValue().unidDetails;
    detail.forEach(ele => {
      ele.unid = this.unid;
    });
    let detailList: any = new Object();
    detailList.unidDetails = detail;
    this.dgRegulationsService.saveDgRegulations(detailList).subscribe(
      data => {
        const resp: any = data.data;
        if (resp && resp.length) {
          if (!resp[0].messageList.length || resp[0].messageList[0].code != 'DG_CANNOT_DELETE') {
            if (!this.showResponseErrorMessages(data)) {
              this.getDgdDetails();
              this.showSuccessStatus("g.operation.successful");
            }
          } else {
            this.showErrorMessage('export.cannot.delete.as.it.has.been.already.used');
          }
        } else {
          this.getDgdDetails();
          this.showSuccessStatus("g.operation.successful");
        }
      }, error => {
        this.showErrorStatus(error);
      });
  }

  checkAll(item, index) {
    let subIndex = 0;
    let value = this.dgregulationform.getRawValue().unidDetails[index].select;
    if (value) {
      this.dgregulationform.getRawValue().unidDetails[index].dgDetails.forEach(a => {
        this.dgregulationform.get(['unidDetails', index, 'dgDetails', subIndex, 'select']).patchValue(true);
        subIndex++;
      })
    } else {
      this.dgregulationform.getRawValue().unidDetails[index].dgDetails.forEach(a => {
        this.dgregulationform.get(['unidDetails', index, 'dgDetails', subIndex, 'select']).patchValue(false);
        subIndex++;
      })
    }
  }

  checkOneRecord(item, index, subIndex) {
    let value = this.dgregulationform.getRawValue().unidDetails[index].dgDetails[subIndex].select;
    this.dgregulationform.get(['unidDetails', index, 'select']).patchValue(false);
  }

  onDelete() {
    let value = this.dgregulationform.getRawValue().unidDetails;
    let index = 0;
    value.forEach(a => {
      if (a.select) {
        (<NgcFormArray>this.dgregulationform.get('unidDetails')).markAsDeletedAt(index);
      } else {
        let subIndex = 0;
        a.dgDetails.forEach(b => {
          if (b.select) {
            (<NgcFormArray>this.dgregulationform.get(['unidDetails', index, 'dgDetails'])).markAsDeletedAt(subIndex);
          }
          subIndex++;
        })
      }
      index++;
    })
  }
}
