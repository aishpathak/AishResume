import { UnReserveTruckDockModule } from "./unreserve-truck-dock.module";

describe('ReleaseTruckDockModule', () => {
    let reserveTruckDockModule: UnReserveTruckDockModule;

    beforeEach(() => {
        reserveTruckDockModule = new UnReserveTruckDockModule();
    });

    it('should create an instance', () => {
        expect(UnReserveTruckDockModule).toBeTruthy();
    });
});
