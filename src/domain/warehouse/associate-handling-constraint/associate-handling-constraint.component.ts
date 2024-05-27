import { WarehouseService } from './../warehouse.service';
import { NgcContainer, NgcFormGroup, NgcFormArray } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'ngc-associate-handling-constraint',
    templateUrl: './associate-handling-constraint.component.html',
    styleUrls: ['./associate-handling-constraint.component.scss']
})
export class AssociateHandlingConstraintComponent extends NgcContainer {
    // @ViewChild('window')
    // window;
    @Output()
    public save = new EventEmitter();
    @Input()
    currentConstraintId;
    @Input()
    whsAssociateHandlingConstraintWithAreaId;
    form = new NgcFormGroup({
        handlingConstraintsList: new NgcFormArray([])
    })

    // handlingConstraintsList = [
    //   {name: 'cargo constraint' },
    //   {name: 'cargo constraint 1' },
    //   {name: 'cargo constraint 2' }
    // ]
    newHandlingConstraint;
    newHandlingConstraintId;
    constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
        private warehouseService: WarehouseService) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        super.ngOnInit();
        this.warehouseService.fetchHandlingConstraints({}).subscribe((resp) => {
            console.log(resp.data);
            for (let handlingConstraint of resp.data) {
                if (this.currentConstraintId === handlingConstraint.whsHandlingConstraintsId)
                    handlingConstraint.select = true;
            }
            if (resp.data) {
                this.form.get('handlingConstraintsList').patchValue(resp.data);
            } else {
            }
        }, (err) => {
        }, () => {
        });
    }

    onSave() {
        console.log(this.form.getRawValue());
        const handlingConstraintsList = this.form.getRawValue().handlingConstraintsList;
        let request: any = this.warehouseService.getReferences();
        for (let handlingConstraint of handlingConstraintsList) {
            if (handlingConstraint.select) {
                request.whsHandlingConstraintsId = this.newHandlingConstraintId = handlingConstraint.whsHandlingConstraintsId;
                this.newHandlingConstraint = handlingConstraint.name;
                request.whsAssociateHandlingConstraintWithAreaId = this.whsAssociateHandlingConstraintWithAreaId;
                break;
            }
        }
        this.warehouseService.modifyHandlingConstraintsArea(request).subscribe((resp) => {
            if (resp.data) {
                this.whsAssociateHandlingConstraintWithAreaId = resp.data.whsAssociateHandlingConstraintWithAreaId;
                this.save.emit(
                    {
                        newHandlingConstraint: this.newHandlingConstraint,
                        newHandlingConstraintId: this.newHandlingConstraintId,
                        whsAssociateHandlingConstraintWithAreaId: this.whsAssociateHandlingConstraintWithAreaId
                    }
                );
            } else {
            }
        }, (err) => {
        }, () => {
        });
    }

    onDelete() {
        const request: any = {};
        request.whsAssociateHandlingConstraintWithAreaId = this.whsAssociateHandlingConstraintWithAreaId;
        this.warehouseService.modifyHandlingConstraintsArea(request).subscribe((resp) => {
            if (resp.data) {
                this.whsAssociateHandlingConstraintWithAreaId = 0;
                this.save.emit(
                    {
                        whsAssociateHandlingConstraintWithAreaId: 0
                    }
                );
            } else {
            }
        }, (err) => {
        }, () => {
        });
    }

}
