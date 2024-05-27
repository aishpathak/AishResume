import { NgcContainer } from 'ngc-framework';
import { WarehouseService } from './../../warehouse.service';
import { Component, OnInit, NgZone, ElementRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'ngc-display-constraint',
    templateUrl: './display-constraint.component.html',
    styleUrls: ['./display-constraint.component.scss']
})
export class DisplayConstraintComponent extends NgcContainer {
    @Input()
    constraintName;
    @Input()
    newConstraintName;
    @Output()
    displayConstraintName = new EventEmitter<any>();
    constructor(containerZone: NgZone, containerElement: ElementRef,
        private service: WarehouseService) {
        super(containerZone, containerElement, null);
    }

    ngOnInit() {
        // For the given referenceType and referenceId, get the handling constraint. If there is no
        // such handling constraint, display "No Constraint"
        // this.service.fetchHandlingConstraint({ referenceType: this.referenceType, referenceId: this.referenceId }).subscribe((resp) => {
        //     if (resp.data) {
        //         this.constraintName = resp.data.name;
        //     }
        // })
    }

    ngAfterViewInit() {
        this.displayConstraintName.emit(this.constraintName);
    }

}
