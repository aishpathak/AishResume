import { RcarNumber } from "./../../admin/admin.sharedmodel";
import { addBagList } from "./../../import/import.shared";
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild,
  Directive
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcWindowComponent,
  PageConfiguration
} from "ngc-framework";
import { EcsdFetch, EcsdOciModel } from "./../export.sharedmodel";
import { ExportService } from "./../export.service";

@Component({
  selector: "app-electronic-consignment-security-declaration",
  templateUrl: "./electronic-consignment-security-declaration.component.html",
  styleUrls: ["./electronic-consignment-security-declaration.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ElectronicConsignmentSecurityDeclarationComponent extends NgcPage {
  deleteRegulated: any;
  //[x: string]: any;
  selected: any;
  disableFlag: boolean = false;
  exemption: boolean = true;
  screenMethod: boolean = true;
  ecsdCsrcIdentifier: any;
  resp: any;
  flag: boolean = true;
  isSearch: boolean = false;
  aomData: any;
  awbNumber: any;
  newArray: any;
  valueReceived: any;
  ground: any;
  name: any;
  datee: any;
  screen: any;
  createTable: boolean = false;
  concatTable: boolean = false;
  addInfo: boolean = false;
  displayInfo: boolean = false;
  rdata: any;
  other: any;
  ststusOfSecurity: any;
  date: any;
  data: any;
  flagCrud: any;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    private exportService: ExportService,
    appContainerElement: ViewContainerRef
  ) {
    super(appZone, appElement, appContainerElement);
  }
  private form: NgcFormGroup = new NgcFormGroup({
    screeningMethod: new NgcFormControl(),
    rcarNumber: new NgcFormControl(),
    securityStatus: new NgcFormControl(),
    ecsdCsrcIdentifier: new NgcFormControl(),
    ecsdSupplementaryInformation: new NgcFormControl(),
    additionaldata: new NgcFormControl(),
    regulatedEntity: new NgcFormControl(),
    regulatedEntity1: new NgcFormControl(),
    regulatedEntity2: new NgcFormControl(),
    regulatedEntity3: new NgcFormControl(),
    regulatedList: new NgcFormArray([]),
    concatArray: new NgcFormArray([]),
    additionalArray: new NgcFormArray([]),
    additional: new NgcFormArray([]),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
    transferTransitPoints: new NgcFormControl(),
    awb: new NgcFormControl(),
    contentsOfConsignmentFlag: new NgcFormControl(),
    contentsOfConsignment: new NgcFormControl(),
    groundsForExemption: new NgcFormControl(),
    securityStatusIssuedOn: new NgcFormControl(),
    securityStatusIssuedBy: new NgcFormControl(),
    otherScreeningMethod: new NgcFormControl()
  });
  ngOnInit() { }
  selectSecurity(item) {
    this.selected = item.code;

    if (this.selected == "SCO" || this.selected == "SPX") {
      this.exemption = false;
    } else {
      this.exemption = true;
    }

    if (
      this.selected == null ||
      this.selected == "" ||
      this.selected == undefined
    ) {
      this.screenMethod = true;
    } else {
      this.screenMethod = false;
    }

    if (this.selected == "SCO") {
      this.form.get("ecsdCsrcIdentifier").patchValue("AO");
      this.disableFlag = true;
      this.form.get("groundsForExemption").reset();
      this.form.get("screeningMethod").reset();
    }
    if (this.selected == "SPX") {
      this.form.get("ecsdCsrcIdentifier").patchValue("KC");
      this.form.get("groundsForExemption").reset();
      this.form.get("screeningMethod").reset();
      this.disableFlag = true;
    }
    if (this.selected == "SHR") {
      this.disableFlag = false;
      this.form.get("groundsForExemption").reset();
      this.form.get("screeningMethod").reset();
      this.form.get("ecsdCsrcIdentifier").reset();
    }
  }

  addRegulatedEntity() {
    const noOfRows = (<NgcFormArray>this.form.get("regulatedList")).length;
    const lastRow = noOfRows
      ? (<NgcFormArray>this.form.get("regulatedList")).controls[noOfRows - 1]
      : null;
    if (
      noOfRows === 0 ||
      (lastRow.get("countryCode").value &&
        lastRow.get("regulatedEntity1").value &&
        lastRow.get("regulatedEntity2").value &&
        lastRow.get("regulatedEntity3").value)
    ) {
      (<NgcFormArray>this.form.get("regulatedList")).addValue([
        {
          checkBox: false,
          countryCode: "",
          regulatedEntity1: "",
          regulatedEntity2: "",
          regulatedEntity3: ""
        }
      ]);
    } else {
      this.showInfoStatus(
        "fill.mandatory.details.to.add.another.row"
      );
    }
  }

  addSecurityInfo() {
    const noOfRows = (<NgcFormArray>this.form.get("additionalArray")).length;
    const lastRow = noOfRows
      ? (<NgcFormArray>this.form.get("additionalArray")).controls[noOfRows - 1]
      : null;
    if (noOfRows === 0 || lastRow.get("ecsdSupplementaryInformation").value) {
      (<NgcFormArray>this.form.get("additionalArray")).addValue([
        {
          check: false,
          ecsdSupplementaryInformation: ""
        }
      ]);
    } else {
      this.showInfoStatus(
        "fill.mandatory.details.to.add.another.row"
      );
    }
  }

  onSearch() {
    const request = new EcsdFetch();
    request.awbNumber = this.form.get("awbNumber").value;
    this.exportService.fetchData(request).subscribe(data => {
      this.resp = data.data;
      if (this.resp) {
        this.resetFormMessages();
        this.form.get("securityStatusIssuedOn").reset();
        this.form.get("securityStatusIssuedBy").reset();
        this.form.get("groundsForExemption").reset();
        this.form.get("screeningMethod").reset();
        this.form.get("securityStatus").reset();
        this.form.get("ecsdCsrcIdentifier").reset();
        this.form.get("contentsOfConsignment").reset();
        this.form.get("contentsOfConsignmentFlag").reset();
        this.form.get("otherScreeningMethod").reset();
        this.form.get("rcarNumber").patchValue(this.resp.rcarNumber);
        this.form
          .get("contentsOfConsignment")
          .patchValue(this.resp.contentsOfConsignment);
        this.form
          .get("contentsOfConsignmentFlag")
          .patchValue(this.resp.contentsOfConsignmentFlag);
        (<NgcFormArray>this.form.get("regulatedList")).reset();

        this.isSearch = true;
        this.form.get("origin").patchValue(this.resp.origin);
        this.form.get("destination").patchValue(this.resp.destination);
        this.form
          .get("awb")
          .patchValue(
            this.form.get("awbNumber").value.substring(0, 3) +
            "-" +
            this.form.get("awbNumber").value.substring(3)
          );
        this.form
          .get("transferTransitPoints")
          .patchValue(this.resp.transferTransitPoints);
        this.date = this.resp.awbDate;
        let newArray = [];
        let issArray = [];
        let stArray = [];
        let additionalArrayData = (<NgcFormArray>(
          this.form.get("additional")
        )).getRawValue();
        if (this.resp.ecsdoci) {
          this.resp.ecsdoci.forEach(element => {
            if (element.informationIdentifier == "SS") {
              this.ststusOfSecurity = element.ecsdSupplementaryInformation;
              this.form.get("securityStatus").patchValue(this.ststusOfSecurity);
            }
            if (element.informationIdentifier == "L") {
              this.ground = element.ecsdSupplementaryInformation;
              this.form.get("groundsForExemption").patchValue(this.ground);
            }
            if (element.informationIdentifier == "SS") {
              this.valueReceived = element.ecsdCsrcIdentifier;
              this.other = element.otherScreeningMethod;
              this.form
                .get("ecsdCsrcIdentifier")
                .patchValue(this.valueReceived);
              this.form.get("otherScreeningMethod").patchValue(this.other);
            }
            if (element.informationIdentifier == "SN") {
              this.name = element.ecsdSupplementaryInformation;
              this.form.get("securityStatusIssuedBy").patchValue(this.name);
            }
            if (element.informationIdentifier == "SD") {
              this.datee = element.ecsdSupplementaryInformation;
              this.form.get("securityStatusIssuedOn").patchValue(this.datee);
            }
            if (element.informationIdentifier == "SM") {
              newArray.push(element.ecsdSupplementaryInformation);
            }
            if (element.informationIdentifier == "ST") {
              stArray.push(element);
            }
          });
        }

        let nweArray = [];
        let regulatedEntity2 = [];
        if (this.resp.regulatedList) {
          this.resp.regulatedList.map(element => {
            if (element.issData === "ISS" || element.issData === "ED") {
              nweArray.push(element);
            }
            if (element.issData === "ED") {
              if (!element.countryCode && !element.regulatedEntity1)
                regulatedEntity2.push(element.regulatedEntity2);
            }

            return element;
          });
        }

        nweArray = nweArray.filter(element => {
          return element.countryCode && element.regulatedEntity1;
        });
        let i = 0;
        nweArray = nweArray.map(element => {
          element.regulatedEntity3 = regulatedEntity2[i];
          i++;
          return element;
        });

        this.form.get("additionalArray").patchValue(stArray);
        this.form.get("regulatedList").patchValue(nweArray);
        this.form.get("screeningMethod").patchValue(newArray);
        this.awbNumber = this.resp.awbNumber;
        this.flagCrud = this.resp.flagCRUD;
      } else {
        this.refreshFormMessages(data);
        this.isSearch = false;
      }
    });
  }

  onSave() {
    const response = new EcsdFetch();

    response.awbNumber = this.form.get("awbNumber").value;
    response.awbPrefix = this.form.get("awbNumber").value;
    response.awbPrefix = response.awbPrefix.substring(0, 3);
    response.awbSuffix = this.form.get("awbNumber").value;
    response.awbDate = this.date;
    response.awbSuffix = response.awbSuffix.substring(3);
    response.rcarNumber = this.form.get("rcarNumber").value;

    response.flagCRUD = this.flagCrud;
    response.contentsOfConsignmentFlag = this.form.get(
      "contentsOfConsignmentFlag"
    ).value;
    response.contentsOfConsignment = this.form.get(
      "contentsOfConsignment"
    ).value;
    response.origin = this.form.get("origin").value;
    response.destination = this.form.get("destination").value;
    response.transferTransitPoints = this.form.get(
      "transferTransitPoints"
    ).value;

    let innerList: any = new EcsdOciModel();
    innerList.securityStatus = this.form.get("securityStatus").value;
    innerList.groundsForExemption = this.form.get("groundsForExemption").value;
    innerList.securityStatusIssuedBy = this.form.get(
      "securityStatusIssuedBy"
    ).value;
    innerList.securityStatusIssuedOn = this.form.get(
      "securityStatusIssuedOn"
    ).value;
    innerList.ecsdCsrcIdentifier = this.form.get("ecsdCsrcIdentifier").value;
    innerList.otherScreeningMethod = this.form.get(
      "otherScreeningMethod"
    ).value;
    innerList.screeningMethod = [];
    innerList.screeningMethod = this.form.get("screeningMethod").value;
    response.ecsdoci.push(innerList);
    response.regulatedList = [];

    response.regulatedList = (<NgcFormArray>(
      this.form.get("regulatedList")
    )).getRawValue();
    response.regulatedList = response.regulatedList.map(element => {
      element.awbNumber = this.awbNumber;
      return element;
    });
    response.additionalArray = [];
    response.additionalArray = (<NgcFormArray>(
      this.form.get("additionalArray")
    )).getRawValue();

    this.exportService.saveEcsdData(response).subscribe(data => {
      this.resp = data.data;
      if (this.resp) {
        this.onSearch();
        this.showSuccessStatus("g.operation.successful");
        this.resetFormMessages();
      } else {
        this.refreshFormMessages(data);
      }
    });
  }

  deleteRow() {
    this.newArray = [];
    const request = new EcsdFetch();
    let y: any = this.form.getRawValue();
    y.regulatedList.forEach(value => {
      if (value.checkBox) {
        this.newArray.push(value);
      }
    });
    this.newArray.forEach(element => {
      element.flagCRUD = "D";
      element.awbNumber = this.form.get("awbNumber").value;
    });
    request.regulatedList = this.newArray;
    // request.awbNumber = this.form.get("awbNumber").value;
    if (this.newArray.length) {
      this.exportService.saveEcsdData(request).subscribe(data => {
        this.deleteRegulated = data.data;
        this.onSearch();
      });
    } else {
      this.showInfoStatus("export.select.atleast.one.row");
    }
  }
  deleteSecurityInfo() {
    this.newArray = [];
    const request = new EcsdFetch();
    let additionalArray: any = (<NgcFormArray>(
      this.form.get("additionalArray")
    )).getRawValue();
    additionalArray.forEach(value => {
      if (value.check) {
        this.newArray.push(value);
      }
    });
    this.newArray.forEach(element => {
      element.flagCRUD = "D";
    });
    request.additionalArray = this.newArray;
    if (this.newArray.length) {
      this.exportService.saveEcsdData(request).subscribe(data => {
        this.resp = data.data;
        this.onSearch();
      });
    } else {
      this.showInfoStatus("export.select.atleast.one.row");
    }
  }

  onConfirmAdditional(event) {
    let flag: boolean = false;

    const broadcast = (<NgcFormArray>(
      this.form.controls["additionalArray"]
    )).getRawValue();
    broadcast.forEach(element => {
      if (element.check) {
        flag = true;
      }
    });

    if (flag) {
      this.showConfirmMessage(
        "export.delete.selected.records.confirmation"
      ).then(fulfilled => {
        this.deleteSecurityInfo();
      });
    } else {
      this.showInfoStatus("export.select.atleast.one.row.to.delete");
    }
  }

  onConfirmRegulated(event) {
    let flag: boolean = false;

    const broadcast = (<NgcFormArray>(
      this.form.controls["regulatedList"]
    )).getRawValue();
    broadcast.forEach(element => {
      if (element.checkBox) {
        flag = true;
      }
    });

    if (flag) {
      this.showConfirmMessage(
        "export.delete.selected.records.confirmation"
      ).then(fulfilled => {
        this.deleteRow();
      });
    } else {
      this.showInfoStatus("export.select.atleast.one.row.to.delete");
    }
  }
}
