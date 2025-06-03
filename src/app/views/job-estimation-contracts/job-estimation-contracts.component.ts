import { Component, OnInit, inject } from '@angular/core';
import {DropDownService} from '../../services/drop-down.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstimateService } from '../../services/estimate.service';

@Component({
  selector: 'app-job-estimation-contracts',
  standalone: false,
  templateUrl: './job-estimation-contracts.component.html',
  styleUrl: './job-estimation-contracts.component.scss'
})

export class JobEstimationContractsComponent implements OnInit {

  estimateService = inject(EstimateService);
  estArray: any
  estData: any;

  ngOnInit(): void {
    this.getAllEstimatesData();
  }

  getAllEstimatesData() {
    this.estimateService.getAllEstimates()
      .subscribe((res) => {
        this.estData = res;
        this.estArray = this.estData.data;
        console.log(this.estArray);
      });
  }

  deleteEstimate(id: any) {
    this.estimateService.deleteEstimateService(id)
      .subscribe(res => {
        alert('Estimate Deleted')
        this.getAllEstimatesData();
      })
  }

}
