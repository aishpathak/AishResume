import { ConnectingTruckModule } from './connecting-truck.module';

describe('ConnectingTruckModule', () => {
  let connectingTruckModule: ConnectingTruckModule;

  beforeEach(() => {
    connectingTruckModule = new ConnectingTruckModule();
  });

  it('should create an instance', () => {
    expect(connectingTruckModule).toBeTruthy();
  });
});
