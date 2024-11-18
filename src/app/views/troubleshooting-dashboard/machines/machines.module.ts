import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachinesComponent } from './machines.component';
import { MachinesRoutingModule } from './machines-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [MachinesComponent],
  imports: [
    CommonModule,
    MachinesRoutingModule,
    PdfViewerModule
  ]
})
export class MachinesModule { }
