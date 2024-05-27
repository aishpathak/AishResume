import { WeightLoadStatementModule } from './weight-load-statement.module';

describe('WeightLoadStatementModule', () => {
  let weightLoadStatementModule: WeightLoadStatementModule;

  beforeEach(() => {
    weightLoadStatementModule = new WeightLoadStatementModule();
  });

  it('should create an instance', () => {
    expect(weightLoadStatementModule).toBeTruthy();
  });
});
