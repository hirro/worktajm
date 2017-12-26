
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { WorktajmButtonDemoModule } from './buttons/button/buttondemo.module';
import { WorktajmSplitbuttonDemoModule } from './buttons/splitbutton/splitbuttondemo.module';

import { WorktajmDialogDemoModule } from './overlay/dialog/dialogdemo.module';
import { WorktajmConfirmDialogDemoModule } from './overlay/confirmdialog/confirmdialogdemo.module';
import { WorktajmLightboxDemoModule } from './overlay/lightbox/lightboxdemo.module';
import { WorktajmTooltipDemoModule } from './overlay/tooltip/tooltipdemo.module';
import { WorktajmOverlayPanelDemoModule } from './overlay/overlaypanel/overlaypaneldemo.module';
import { WorktajmSideBarDemoModule } from './overlay/sidebar/sidebardemo.module';

import { WorktajmInputTextDemoModule } from './inputs/inputtext/inputtextdemo.module';
import { WorktajmInputTextAreaDemoModule } from './inputs/inputtextarea/inputtextareademo.module';
import { WorktajmInputGroupDemoModule } from './inputs/inputgroup/inputgroupdemo.module';
import { WorktajmCalendarDemoModule } from './inputs/calendar/calendardemo.module';
import { WorktajmCheckboxDemoModule } from './inputs/checkbox/checkboxdemo.module';
import { WorktajmChipsDemoModule } from './inputs/chips/chipsdemo.module';
import { WorktajmColorPickerDemoModule } from './inputs/colorpicker/colorpickerdemo.module';
import { WorktajmInputMaskDemoModule } from './inputs/inputmask/inputmaskdemo.module';
import { WorktajmInputSwitchDemoModule } from './inputs/inputswitch/inputswitchdemo.module';
import { WorktajmPasswordIndicatorDemoModule } from './inputs/passwordindicator/passwordindicatordemo.module';
import { WorktajmAutoCompleteDemoModule } from './inputs/autocomplete/autocompletedemo.module';
import { WorktajmSliderDemoModule } from './inputs/slider/sliderdemo.module';
import { WorktajmSpinnerDemoModule } from './inputs/spinner/spinnerdemo.module';
import { WorktajmRatingDemoModule } from './inputs/rating/ratingdemo.module';
import { WorktajmSelectDemoModule } from './inputs/select/selectdemo.module';
import { WorktajmSelectButtonDemoModule } from './inputs/selectbutton/selectbuttondemo.module';
import { WorktajmListboxDemoModule } from './inputs/listbox/listboxdemo.module';
import { WorktajmRadioButtonDemoModule } from './inputs/radiobutton/radiobuttondemo.module';
import { WorktajmToggleButtonDemoModule } from './inputs/togglebutton/togglebuttondemo.module';
import { WorktajmEditorDemoModule } from './inputs/editor/editordemo.module';

import { WorktajmGrowlDemoModule } from './messages/growl/growldemo.module';
import { WorktajmMessagesDemoModule } from './messages/messages/messagesdemo.module';
import { WorktajmGalleriaDemoModule } from './multimedia/galleria/galleriademo.module';

import { WorktajmFileUploadDemoModule } from './fileupload/fileupload/fileuploaddemo.module';

import { WorktajmAccordionDemoModule } from './panel/accordion/accordiondemo.module';
import { WorktajmPanelDemoModule } from './panel/panel/paneldemo.module';
import { WorktajmTabViewDemoModule } from './panel/tabview/tabviewdemo.module';
import { WorktajmFieldsetDemoModule } from './panel/fieldset/fieldsetdemo.module';
import { WorktajmToolbarDemoModule } from './panel/toolbar/toolbardemo.module';
import { WorktajmGridDemoModule } from './panel/grid/griddemo.module';

import { WorktajmDataTableDemoModule } from './data/datatable/datatabledemo.module';
import { WorktajmDataGridDemoModule } from './data/datagrid/datagriddemo.module';
import { WorktajmDataListDemoModule } from './data/datalist/datalistdemo.module';
import { WorktajmDataScrollerDemoModule } from './data/datascroller/datascrollerdemo.module';
import { WorktajmPickListDemoModule } from './data/picklist/picklistdemo.module';
import { WorktajmOrderListDemoModule } from './data/orderlist/orderlistdemo.module';
import { WorktajmScheduleDemoModule } from './data/schedule/scheduledemo.module';
import { WorktajmTreeDemoModule } from './data/tree/treedemo.module';
import { WorktajmTreeTableDemoModule } from './data/treetable/treetabledemo.module';
import { WorktajmPaginatorDemoModule } from './data/paginator/paginatordemo.module';
import { WorktajmGmapDemoModule } from './data/gmap/gmapdemo.module';
import { WorktajmOrgChartDemoModule } from './data/orgchart/orgchartdemo.module';
import { WorktajmCarouselDemoModule } from './data/carousel/carouseldemo.module';

import { WorktajmBarchartDemoModule } from './charts/barchart/barchartdemo.module';
import { WorktajmDoughnutchartDemoModule } from './charts/doughnutchart/doughnutchartdemo.module';
import { WorktajmLinechartDemoModule } from './charts/linechart/linechartdemo.module';
import { WorktajmPiechartDemoModule } from './charts/piechart/piechartdemo.module';
import { WorktajmPolarareachartDemoModule } from './charts/polarareachart/polarareachartdemo.module';
import { WorktajmRadarchartDemoModule } from './charts/radarchart/radarchartdemo.module';

import { WorktajmDragDropDemoModule } from './dragdrop/dragdrop/dragdropdemo.module';


import { WorktajmMenuDemoModule } from './menu/menu/menudemo.module';
import { WorktajmContextMenuDemoModule } from './menu/contextmenu/contextmenudemo.module';
import { WorktajmPanelMenuDemoModule } from './menu/panelmenu/panelmenudemo.module';
import { WorktajmStepsDemoModule } from './menu/steps/stepsdemo.module';
import { WorktajmTieredMenuDemoModule } from './menu/tieredmenu/tieredmenudemo.module';
import { WorktajmBreadcrumbDemoModule } from './menu/breadcrumb/breadcrumbdemo.module';
import { WorktajmMegaMenuDemoModule } from './menu/megamenu/megamenudemo.module';
import { WorktajmMenuBarDemoModule } from './menu/menubar/menubardemo.module';
import { WorktajmSlideMenuDemoModule } from './menu/slidemenu/slidemenudemo.module';
import { WorktajmTabMenuDemoModule } from './menu/tabmenu/tabmenudemo.module';

import { WorktajmBlockUIDemoModule } from './misc/blockui/blockuidemo.module';
import { WorktajmCaptchaDemoModule } from './misc/captcha/captchademo.module';
import { WorktajmDeferDemoModule } from './misc/defer/deferdemo.module';
import { WorktajmInplaceDemoModule } from './misc/inplace/inplacedemo.module';
import { WorktajmProgressBarDemoModule } from './misc/progressbar/progressbardemo.module';
import { WorktajmRTLDemoModule } from './misc/rtl/rtldemo.module';
import { WorktajmTerminalDemoModule } from './misc/terminal/terminaldemo.module';
import { WorktajmValidationDemoModule } from './misc/validation/validationdemo.module';
import { WorktajmProgressSpinnerDemoModule } from './misc/progressspinner/progressspinnerdemo.module';

@NgModule({
    imports: [

        WorktajmMenuDemoModule,
        WorktajmContextMenuDemoModule,
        WorktajmPanelMenuDemoModule,
        WorktajmStepsDemoModule,
        WorktajmTieredMenuDemoModule,
        WorktajmBreadcrumbDemoModule,
        WorktajmMegaMenuDemoModule,
        WorktajmMenuBarDemoModule,
        WorktajmSlideMenuDemoModule,
        WorktajmTabMenuDemoModule,

        WorktajmBlockUIDemoModule,
        WorktajmCaptchaDemoModule,
        WorktajmDeferDemoModule,
        WorktajmInplaceDemoModule,
        WorktajmProgressBarDemoModule,
        WorktajmInputMaskDemoModule,
        WorktajmRTLDemoModule,
        WorktajmTerminalDemoModule,
        WorktajmValidationDemoModule,

        WorktajmButtonDemoModule,
        WorktajmSplitbuttonDemoModule,

        WorktajmInputTextDemoModule,
        WorktajmInputTextAreaDemoModule,
        WorktajmInputGroupDemoModule,
        WorktajmCalendarDemoModule,
        WorktajmChipsDemoModule,
        WorktajmInputMaskDemoModule,
        WorktajmInputSwitchDemoModule,
        WorktajmPasswordIndicatorDemoModule,
        WorktajmAutoCompleteDemoModule,
        WorktajmSliderDemoModule,
        WorktajmSpinnerDemoModule,
        WorktajmRatingDemoModule,
        WorktajmSelectDemoModule,
        WorktajmSelectButtonDemoModule,
        WorktajmListboxDemoModule,
        WorktajmRadioButtonDemoModule,
        WorktajmToggleButtonDemoModule,
        WorktajmEditorDemoModule,
        WorktajmColorPickerDemoModule,
        WorktajmCheckboxDemoModule,

        WorktajmGrowlDemoModule,
        WorktajmMessagesDemoModule,
        WorktajmGalleriaDemoModule,

        WorktajmFileUploadDemoModule,

        WorktajmAccordionDemoModule,
        WorktajmPanelDemoModule,
        WorktajmTabViewDemoModule,
        WorktajmFieldsetDemoModule,
        WorktajmToolbarDemoModule,
        WorktajmGridDemoModule,

        WorktajmBarchartDemoModule,
        WorktajmDoughnutchartDemoModule,
        WorktajmLinechartDemoModule,
        WorktajmPiechartDemoModule,
        WorktajmPolarareachartDemoModule,
        WorktajmRadarchartDemoModule,

        WorktajmDragDropDemoModule,

        WorktajmDialogDemoModule,
        WorktajmConfirmDialogDemoModule,
        WorktajmLightboxDemoModule,
        WorktajmTooltipDemoModule,
        WorktajmOverlayPanelDemoModule,
        WorktajmSideBarDemoModule,

        WorktajmDataTableDemoModule,
        WorktajmDataGridDemoModule,
        WorktajmDataListDemoModule,
        WorktajmDataScrollerDemoModule,
        WorktajmScheduleDemoModule,
        WorktajmOrderListDemoModule,
        WorktajmPickListDemoModule,
        WorktajmTreeDemoModule,
        WorktajmTreeTableDemoModule,
        WorktajmPaginatorDemoModule,
        WorktajmOrgChartDemoModule,
        WorktajmGmapDemoModule,
        WorktajmCarouselDemoModule,
        WorktajmProgressSpinnerDemoModule

    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorktajmprimengModule {}
