/* Auth @Shubham.11.s */
import { Component, OnInit, OnChanges } from '@angular/core';
import {
  NgZone,
  ElementRef,
  ViewContainerRef,
  ChangeDetectorRef
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  PageConfiguration,

} from "ngc-framework";
import { ImportService } from '../import.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-close-unclose-flight',
  templateUrl: './close-unclose-flight.component.html',
  styleUrls: ['./close-unclose-flight.component.scss']
})
export class CloseUncloseFlightComponent extends NgcPage implements OnInit {


  show: boolean;
  new_obj: any = [];
  obj: any = [];
  index: any;
  indexArray: any = [];
  private closeUncloseForm: NgcFormGroup = new NgcFormGroup({
    flightNumber: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    staffId: new NgcFormControl(),
    uncloseingRemark: new NgcFormControl(),
    closeUncloseFlight: new NgcFormArray([]),
  });


  constructor(appZone: NgZone,
    private importService: ImportService,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef) {
    super(appZone, appElement, appContainerElement);
  }


  ngOnInit() {

  }

  onSearch = (object) => {
    this.closeUncloseForm.get("uncloseingRemark").clearValidators();
    if (this.closeUncloseForm.status == "INVALID") {
      return true;
    }
    /* validate The form */
    this.closeUncloseForm.validate();
    if (this.closeUncloseForm.invalid) {
      return true;
    }
    if (object == true) {
      this.resetFormMessages();
    }

    let req = this.closeUncloseForm.getRawValue();
    this.closeUncloseForm.get("closeUncloseFlight").patchValue([]);
    // this.importService.getFlightinfo(req).subscribe(data => {
    //   if (data.data.closeUncloseFlight.length == 0) {
    //     this.showErrorStatus("SHCCODE036");
    //     return;
    //   }
    //   this.show = true;
    //   this.closeUncloseForm.get("closeUncloseFlight").patchValue([]);
    //   this.closeUncloseForm.patchValue(null);
    //   this.closeUncloseForm.patchValue(data.data);
    //   this.closeUncloseForm.get("uncloseingRemark").patchValue(null);
    //   console.log(data);
    // }
    //   , error => {
    //     this.showErrorStatus(error);
    //   }
    // )
  }

  checkSelectedData = () => {


  }

  onCloseFlight = () => {
    this.closeUncloseForm.get("uncloseingRemark").clearValidators();

    let value = this.closeUncloseForm.get("closeUncloseFlight").value;

    let counter = 0;
    value.forEach(element => {
      if (element.flag == true) {
        this.obj.push(element);
        counter++;
      }
    });

    if (counter == 0) {
      this.showErrorStatus('export.select.a.record');
      return;
    }
    if (counter != 1) {
      this.showErrorStatus('export.select.a.record');
      return;
    }
    this.closeUncloseForm.get("closeUncloseFlight").patchValue([]);
    let req = this.obj;

    // this.importService.closeFlt(req).subscribe(data => {
    //   if (this.showResponseErrorMessages(data)) {
    //     this.onSearch(false);
    //     return;
    //   }
    //   this.showSuccessStatus("g.completed.successfully");
    //   if (this.obj != null) {
    //     this.obj.length = 0;
    //   }
    //   this.onSearch(true);
    // }
    //   , error => {
    //     this.showErrorStatus(error);
    //   }
    // )


    if (req[0].flightCloseDate != null) {
      this.showErrorStatus('import.already.close.error');
      return;
    }


    this.importService.closeFlt(req).subscribe(data => {
      if (this.showResponseErrorMessages(data)) {
        return;
      }
      if (!this.showResponseErrorMessages(data)) {

        this.showSuccessStatus("g.completed.successfully");
        this.onSearch(true);
      }
    }
      , error => {
        this.showErrorStatus(error);
      }
    )

  }

  onUncloseFlight = () => {
    this.closeUncloseForm.get("uncloseingRemark").setValidators([Validators.required]);
    if (this.closeUncloseForm.status == "INVALID") {
      return true;
    }
    /* validate The form */
    this.closeUncloseForm.validate();
    if (this.closeUncloseForm.invalid) {
      return true;
    }
    let value = this.closeUncloseForm.get("closeUncloseFlight").value;

    let counter = 0;
    value.forEach(element => {
      if (element.flag == true) {
        this.new_obj.push(element);
        counter++;
      }
    });
    if (counter == 0) {
      this.showErrorStatus('export.select.a.record');
      return;
    }
    if (counter != 1) {
      this.showErrorStatus('Select only one Record');
      return;
    }
    this.closeUncloseForm.get("closeUncloseFlight").patchValue([]);
    let req = this.new_obj;

    // this.importService.unCloseFlt(req).subscribe(data => {
    //   if (data.data.messageList.length != 0) {
    //     this.onSearch(false);
    //     return;
    //   }
    //   this.showSuccessStatus("g.completed.successfully");
    //   if (this.new_obj != null) {
    //     this.new_obj.length = 0;
    //   }
    //   this.onSearch(true);
    // }
    //   , error => {
    //     this.showErrorStatus(error);
    //   }
    // )

    if (req[0].flightCloseDate == null) {
      this.showErrorStatus('import.already.unclose.error');
      return;
    }

    this.importService.unCloseFlt(req).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.showSuccessStatus("g.completed.successfully");
        this.onSearch(true);
      }
    }
      , error => {
        this.showErrorStatus(error);
      }
    )

  }

  checkLoadedParent(index, object) {
    if (object == false) {
      this.closeUncloseForm.get("uncloseingRemark").patchValue(null);
    }
    this.resetFormMessages();
    var value = this.closeUncloseForm.get("closeUncloseFlight").value;
    let counter = 0;
    value.forEach(element => {
      if (element.flag == true) {
        counter++;
      }
    });
    if (counter == 0) {
      this.showErrorStatus('export.select.a.record');
      return;
    }
    if (counter > 1) {
      this.showErrorStatus('Select only one Record');
      return;
    }
    this.index = index;
    //this.closeUncloseForm.get("uncloseingRemark").patchValue(value[index].unclosingRmrk);
  }

  onChangeRemarks() {
    var value = this.closeUncloseForm.get("closeUncloseFlight").value;
    this.closeUncloseForm.get(['closeUncloseFlight', this.index, 'unclosingRmrk']).patchValue(this.closeUncloseForm.get("uncloseingRemark").value);
  }
}
