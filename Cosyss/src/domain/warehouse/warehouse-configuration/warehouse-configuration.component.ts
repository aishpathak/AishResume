import { WarehouseService } from './../warehouse.service';
import { Router } from '@angular/router';
import { NgcPage, PageConfiguration, NgcWindowComponent } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-warehouse-configuration',
    templateUrl: './warehouse-configuration.component.html',
    styleUrls: ['./warehouse-configuration.component.scss']
})
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true
})
export class WarehouseConfigurationComponent extends NgcPage {
    listHandlingArea = [];
    listHandlingArea2 = [
        {
            terminalCode: 'AFT3 - Export',
            whsTerminalId: 177,
            sectorsList: [],
            locationList: []
        },
        {
            terminalCode: 'AFT1 - Mail',
            whsTerminalId: 177,
            sectorsList: [
                {
                    sectorCode: 'ACCEPTANCE',
                    whsSectorId: 122,
                    whsTerminalId: 177,
                    sectorsList: [],
                    locationList: [
                        [{
                            column: 1,
                            row: 'A',
                            code: 'default'
                        },
                        {
                            column: 2,
                            row: 'A',
                            code: 'alarm'
                        }, {
                            column: 3,
                            row: 'A',
                            code: 'default'
                        }, {
                            column: 4,
                            row: 'A',
                            code: 'default'
                        }, {
                            column: 5,
                            row: 'A',
                            code: 'default'
                        }, {
                            column: 6,
                            row: 'A',
                            code: 'default'
                        }, {
                            column: 7,
                            row: 'A',
                            code: 'default'
                        }, {
                            column: 8,
                            row: 'A',
                            code: 'default'
                        }],
                        [{
                            column: 1,
                            row: 'B',
                            code: 'default'
                        }, {
                            column: 2,
                            row: 'B',
                            code: 'default'
                        }, {
                            column: 3,
                            row: 'B',
                            code: 'default'
                        }, {
                            column: 4,
                            row: 'B',
                            code: 'default'
                        }, {
                            column: 5,
                            row: 'B',
                            code: 'default'
                        }, {
                            column: 6,
                            row: 'B',
                            code: 'default'
                        }, {
                            column: 7,
                            row: 'B',
                            code: 'default'
                        }, {
                            column: 8,
                            row: 'B',
                            code: 'default'
                        }
                        ],
                    ]
                }
            ],
            locationList: []
        },
        {
            terminalCode: 'AFT2 - Coolport',
            whsTerminalId: 177,
            sectorsList: [
                {
                    sectorCode: 'ACCEPTANCE',
                    whsSectorId: 122,
                    whsTerminalId: 177,
                    sectorsList: [
                        {
                            sectorCode: 'Lane 1',

                            whsSectorId: 122,
                            whsTerminalId: 177, sectorsList: [
                                {
                                    sectorCode: 'Sublane 1',

                                    whsSectorId: 122,
                                    whsTerminalId: 177, sectorsList: [],
                                    locationList: [
                                        {
                                            column: 1,
                                            row: 'A'
                                        },
                                        {
                                            column: 2,
                                            row: 'A'
                                        },
                                        {
                                            column: 3,
                                            row: 'D'
                                        }
                                    ]
                                },
                                {
                                    sectorCode: 'Sublane 2',

                                    whsSectorId: 122,
                                    whsTerminalId: 177, sectorsList: [],
                                    locationList: [
                                        {
                                            column: 1,
                                            row: 'A'
                                        },
                                        {
                                            column: 2,
                                            row: 'A'
                                        },
                                        {
                                            column: 3,
                                            row: 'A'
                                        }
                                    ]
                                },
                            ],
                            locationList: []
                        },
                        {
                            sectorCode: 'Lane 2',

                            whsSectorId: 122,
                            whsTerminalId: 177, sectorsList: [
                                {
                                    sectorCode: 'Sublane 1',

                                    whsSectorId: 122,
                                    whsTerminalId: 177, sectorsList: [],
                                    locationList: [
                                        {
                                            column: 1,
                                            row: 'A'
                                        },
                                        {
                                            column: 2,
                                            row: 'A'
                                        },
                                        {
                                            column: 3,
                                            row: 'D'
                                        }
                                    ]
                                },
                                {
                                    sectorCode: 'Sublane 2',

                                    whsSectorId: 122,
                                    whsTerminalId: 177, sectorsList: [],
                                    locationList: [
                                        {
                                            column: 1,
                                            row: 'A'
                                        },
                                        {
                                            column: 2,
                                            row: 'A'
                                        },
                                        {
                                            column: 3,
                                            row: 'A'
                                        }
                                    ]
                                }
                            ],
                            locationList: [
                            ]
                        },
                        {
                            sectorCode: 'Lane 3',

                            whsSectorId: 122,
                            whsTerminalId: 177, sectorsList: [],
                            locationList: [
                                {
                                    column: 1,
                                    row: 'K'
                                },
                                {
                                    column: 2,
                                    row: 'P'
                                },
                                {
                                    column: 3,
                                    row: 'K'
                                }
                            ]
                        },
                    ],
                    locationList: []
                },
                {
                    sectorCode: 'STORAGE',

                    whsSectorId: 122,
                    whsTerminalId: 177, sectorsList: [
                        {
                            sectorCode: 'Lane 1',

                            whsSectorId: 122,
                            whsTerminalId: 177, sectorsList: [],
                            locationList: [
                                {
                                    column: 1,
                                    row: 'A'
                                },
                                {
                                    column: 2,
                                    row: 'A'
                                },
                                {
                                    column: 3,
                                    row: 'A'
                                }
                            ]
                        }
                    ],
                    locationList: []
                }
            ],
            locationList: []
        },
    ];
    displayHandlingConstraint = true;
    windowIsOpen = false;
    @ViewChild('window')
    window: NgcWindowComponent;

    constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
        private warehouseService: WarehouseService, private router: Router) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        super.ngOnInit();
        this.fetchWareHouseLocations();
    }

    /**
     * Fetches all the terminals, sectors and locations to display on page load
     * 
     * @memberof WarehouseConfigurationComponent
     */
    fetchWareHouseLocations() {
        this.warehouseService.fetchWareHouseLocations({}).subscribe((resp) => {
            if (resp.data) {
                this.listHandlingArea = resp.data;
                this.showSuccessStatus('g.completed.successfully');
            } else {
                this.showErrorStatus('g.server.exception');
            }
        }, (err) => {
            this.showErrorStatus('g.unable.to.contact.server');
        });
    }

    /**
     * Sets AllParentsNames, AllParentsIds and TerminalModel in service and navigates to
     * a new page to add/udpate/delete sectors
     * 
     * @param {any} tabs 
     * @memberof WarehouseConfigurationComponent
     */
    onAddSector(tabs) {
        let index;
        let i = 0;
        for (const tab of tabs.tabs) {
            if (tab.selected) {
                index = i;
                break;
            }
            ++i;
        }
        console.log((this.listHandlingArea[index].terminalCode));
        this.warehouseService.setAllParentsNames(this.listHandlingArea[index].terminalCode);
        this.warehouseService.setAllParentsIds(this.listHandlingArea[index].whsTerminalId);
        this.warehouseService.setTerminalModel(this.listHandlingArea[index]);
        this.router.navigate(['warehouse', 'addsector']);
    }

    /**
     * popup window opened on click of add Handling Contraints button for corresponding terminal/sector
     * 
     * @param {any} terminal 
     * @memberof WarehouseConfigurationComponent
     */
    onAddHandlingConstraints(terminal) {
        this.windowIsOpen = false;
        setTimeout(() => {
            console.log(terminal);
            if (terminal.whsSectorId) {
                this.warehouseService.setReferences(terminal.whsSectorId, 'SECTOR');
            } else {
                this.warehouseService.setReferences(terminal.whsTerminalId, 'TERMINAL');
            }
            this.windowIsOpen = true;
            this.window.open();
        }, 0);
        this.displayHandlingConstraint = false;
    }

    onSave() {
        this.window.close();
        this.displayHandlingConstraint = true;
    }

    private addTerminal(event) {
    }

    private addSector(event) {
    }
}
