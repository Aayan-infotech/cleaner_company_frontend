
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarEventService } from '../../services/calendar-event.service';
import { UsersService } from '../../services/users.service';
import { EstimateService } from '../../services/estimate.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-job-history-overview',
  standalone: false,
  templateUrl: './job-history-overview.component.html',
  styleUrl: './job-history-overview.component.scss',
  providers: [DatePipe]
})

export class JobHistoryOverviewComponent {

  eventsService = inject(CalendarEventService);
  eventArray: any;
  eventData: any;
  datePipe = inject(DatePipe);

  ngOnInit(): void {
    this.getAllCals();
  };

  getAllCals() {
    this.eventsService.getAllEventsService().subscribe((res) => {
        this.eventData = res;
        this.eventArray = this.eventData?.data?.map((event: any) => {
            // Format date and times
            const formattedDate = this.datePipe.transform(event.date, 'yyyy-MM-dd');

            // Convert start and end times to AM/PM format
            const formatTimeToAMPM = (timeStr: string) => {
                const [hours, minutes] = timeStr.split(':').map(Number);
                const period = hours >= 12 ? 'PM' : 'AM';
                const adjustedHours = hours % 12 || 12;
                return `${adjustedHours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
            };

            const startTime = formatTimeToAMPM(event.startTime);
            const endTime = formatTimeToAMPM(event.endTime);

            const formattedEvent = {
                _id: event._id,
                title: event.title,
                date: formattedDate,
                time: `${startTime} - ${endTime}`,
                description: event.description,
                userName: event.userName,
                clientName: event.clientName,
                clientEmail: event.clientEmail,
                address: event.address,
                clientContact: event.clientContact,
                jobId: event.jobId,
                status: event.status
            };
            return formattedEvent;
        }) || [];
        console.log('Event Array:', this.eventArray);
    });
}



  // getAllCals() {
  //   this.eventsService.getAllEventsService().subscribe((res) => {
  //     this.eventData = res;
  //     const currentDate = new Date();
  //     console.log('Current Date:', currentDate);

  //     this.eventArray = this.eventData?.data ?.map((event: any) => {
  //         // Constructing full timestamps for comparison
  //         const endTimeString = event.date.split('T')[0] + 'T' + event.endTime + ':00.000Z';
  //         const endTime = new Date(endTimeString);
  //         const startTimeString = event.date.split('T')[0] + 'T' + event.startTime + ':00.000Z';
  //         const startTime = new Date(startTimeString);
  //         console.log(`Processing Event: ${event.title}`);
  //         console.log('Event End Time:', endTime);

  //         return {
  //           _id: event._id,
  //           title: event.title,
  //           date: event.date,
  //           startTime: startTime,
  //           endTime: endTime,          
  //           time: event.startTime + ' - ' + event.endTime,
  //           description: event.description,
  //           userName: event.userName,
  //           status: event.status
  //         };
  //       })
  //       .filter((event: any) => {
  //         console.log(`Comparing event end time (${event.endTime}) with current date (${currentDate})`);

  //         // Compare both date and time parts
  //         if (event.endTime < currentDate) {
  //           return true;
  //         } else if (event.endTime.toDateString() === currentDate.toDateString()) {
  //           // If endTime is on the same date, compare times
  //           return event.endTime.getHours() < currentDate.getHours() ||
  //             (event.endTime.getHours() === currentDate.getHours() && event.endTime.getMinutes() < currentDate.getMinutes());
  //         } else {
  //           return false;
  //         }
  //       }) || [];

  //     console.log('Event Array:', this.eventArray);
  //   });
  // }
}
