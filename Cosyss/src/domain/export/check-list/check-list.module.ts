import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CheckListService } from './check-list.service';
import { PageHeaderComponent } from './page-header/page-header.component';
import { PageDetailComponent } from './page-detail/page-detail.component';
import { PageFooterComponent } from './page-footer/page-footer.component';
import { PageParameterComponent } from './page-parameter/page-parameter.component';
import { FillCheckListComponent } from './fill-check-list/fill-check-list.component';
import { EditCheckListComponent } from './edit-check-list/edit-check-list.component';
import { SetupChecklistStatusComponent } from './setup-checklist-status/setup-checklist-status.component';
import { CheckListTemplateEngineComponent } from './check-list-template-engine/check-list-template-engine.component';
import {
    QuestionnaireWithSubHeadingsComponent
} from './questionnaire-with-sub-headings/questionnaire-with-sub-headings.component';
import {
    QuestionnaireWithoutSubHeadingsComponent
} from './questionnaire-without-sub-headings/questionnaire-without-sub-headings.component';
import {
    NgcDomainModule, NgcDirectivesModule, NgcControlsModule, NgcCoreModule, NgcUtility
} from 'ngc-framework';

const routes: Routes = [
  { path: 'pagefooter', component: PageFooterComponent },
  { path: 'pageheader', component: PageHeaderComponent },
  { path: 'pagedetail', component: PageDetailComponent },
  { path: 'pageparameter', component: PageParameterComponent },
  { path: 'fillchecklist', component: FillCheckListComponent },
  { path: 'editchecklist', component: EditCheckListComponent },
  { path: 'checklisttemplate', component: CheckListTemplateEngineComponent },
  { path: 'setupcheckliststatus', component: SetupChecklistStatusComponent },
  { path: 'questionnairewithsubheadings', component: QuestionnaireWithSubHeadingsComponent },
  { path: 'questionnairewithoutsubheadings', component: QuestionnaireWithoutSubHeadingsComponent }
];

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        NgcCoreModule,
        NgcDomainModule,
        NgcControlsModule,
        NgcDirectivesModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    providers: [
        CheckListService
    ],
    declarations: [
        PageFooterComponent,
        PageHeaderComponent,
        PageDetailComponent,
        FillCheckListComponent,
        PageParameterComponent,
        SetupChecklistStatusComponent,
        CheckListTemplateEngineComponent,
        QuestionnaireWithSubHeadingsComponent,
        QuestionnaireWithoutSubHeadingsComponent,
        EditCheckListComponent
]
})

export class CheckListModule {

}