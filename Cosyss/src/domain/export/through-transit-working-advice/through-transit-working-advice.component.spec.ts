import {
    NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcPage, NgcButtonComponent, PageConfiguration, NgcFormControl
} from 'ngc-framework';
import {
    Component, OnInit, ViewEncapsulation, ViewChild, ViewChildren, QueryList, NgZone, ElementRef, ViewContainerRef
} from '@angular/core';
import { Validator, Validators } from '@angular/forms';

@Component({
    selector: 'ngc-through-transit-working-advice',
    templateUrl: './through-transit-working-advice.component.html',
    encapsulation: ViewEncapsulation.None
})
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true
})
export class ThroughTransitWorkingAdviceComponent extends NgcPage {

}