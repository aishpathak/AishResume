import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalCargoCollectionComponent } from './arrival-cargo-collection.component';

describe('ArrivalmanifestComponent', () => {
    let component: ArrivalCargoCollectionComponent;
    let fixture: ComponentFixture<ArrivalCargoCollectionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ArrivalCargoCollectionComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ArrivalCargoCollectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});