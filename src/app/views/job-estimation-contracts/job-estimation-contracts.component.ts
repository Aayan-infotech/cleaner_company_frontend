import { Component, OnInit, inject } from '@angular/core';
import {DropDownService} from '../../services/drop-down.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-job-estimation-contracts',
  standalone: false,
  templateUrl: './job-estimation-contracts.component.html',
  styleUrl: './job-estimation-contracts.component.scss'
})
export class JobEstimationContractsComponent implements OnInit {
  dropDownService = inject(DropDownService)
  dropData: any;
  dropArray: any;
  dataCondition: any;
  dataColor: any;
  dataLot: any;
  fb = inject(FormBuilder);
  catForm!: FormGroup;
  roomArray: any;
  specialServicesArray: any;
  ngOnInit(): void {
    this.catForm = this.fb.group({
      specialServices: ['',Validators.required],
      room: ['',Validators.required],
    })
    this.getAllDropdown();
  }
  getAllDropdown(){
    this.dropDownService.getAllDropDownService()
    .subscribe((res)=>{
     this.dropData = res
     console.log(this.dropData)
    this.roomArray = this.dropData.data[0].room
    this.specialServicesArray = this.dropData.data[0].specialServices
     console.log(this.roomArray)
   
    })
  }
}
