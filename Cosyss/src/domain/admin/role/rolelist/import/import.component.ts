import { Component, OnInit, NgZone, ElementRef, ViewContainerRef} from '@angular/core';
import { NgcFormControl, NgcFormGroup, NgcPage, NgcFormArray, PageConfiguration } from 'ngc-framework';
@Component({
  selector: 'ngc-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
// TODO remove this component as this is not being used anywhere (all the four files).
@PageConfiguration({ trackInit: true })
export class ImportComponent extends NgcPage {

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef) { 
     super(appZone, appElement, appContainerElement);
    this.functionId = "PLAYGROUND";
  
  } public importform: NgcFormGroup = new NgcFormGroup({
    importList:new NgcFormArray(
        [
          new NgcFormGroup({
            function: new NgcFormControl(),
            allow: new NgcFormControl(),
           // allow: new NgcFormControl(),
            restricted: new NgcFormControl(),
           // lastmovementtype: new NgcFormControl(),
           // movementdetails: new NgcFormControl(),
            //sightedOn: new NgcFormControl(),
           // damagedetails: new NgcFormControl()

          })
        ]
      ),
  })

  ngOnInit() {
  }

}
