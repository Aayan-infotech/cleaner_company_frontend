
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { CalendarEventService } from '../../services/calendar-event.service';
import { UsersService } from '../../services/users.service';
import { EstimateService } from '../../services/estimate.service';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  providers: [DatePipe]
})

export class DashboardComponent {

  eventFb = inject(FormBuilder);
  EventsService = inject(CalendarEventService);
  estimateService = inject(EstimateService);
  eventForm!: FormGroup;
  router = inject(Router);
  eventData!: any;
  eventArray: any[] = [];
  editData: any;
  public visible = false;
  datePipe = inject(DatePipe);

  usersService = inject(UsersService);
  userForm!: FormGroup;
  userData!: any;
  userArray: any[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: this.eventArray
  };
  estArray: any;
  estData: any;



  constructor() { }

  // Lifecycle hook - Initialize form and fetch events
  ngOnInit(): void {
    this.eventForm = this.eventFb.group({
      title: ['', Validators.required],
      date: [{ value: '', disabled: true }, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      description: ['', Validators.required],
      userName: ['', Validators.required],
      clientName: ['', Validators.required],
      clientEmail: ['', Validators.required],
      address: ['', Validators.required],
      clientContact: ['', Validators.required]
    });
    this.getAllCals();
    this.getAllUsers();
    this.getAllEstimatesData()
  };

  getAllUsers() {
    this.usersService.getAllUsersService().subscribe({
      next: (res) => {
        this.userData = res;
        this.userArray = this.userData.data;
        console.log('User Array:', this.userArray);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  };

  getAllEstimatesData() {
    this.estimateService.getAllEstimates()
      .subscribe((res) => {
        this.estData = res;
        this.estArray = this.estData.data;
        console.log(this.estArray);
      });
  }

  handleDateClick(arg: DateClickArg) {
    this.visible = true;
    this.eventForm.patchValue({
      date: arg.dateStr
    });
  };

  toggleLiveDemo() {
    this.visible = !this.visible;
  };

  handleLiveDemoChange(event: any) {
    this.visible = event;
  };


  submit() {
    if (this.eventForm.valid) {
      const eventData: any = {
        title: this.eventForm.value.title,
        startTime: this.eventForm.get('startTime')?.value,
        endTime: this.eventForm.get('endTime')?.value,
        description: this.eventForm.get('description')?.value,
        userName: this.eventForm.get('userName')?.value,
        clientName: this.eventForm.get('clientName')?.value,
        clientEmail: this.eventForm.get('clientEmail')?.value,
        address: this.eventForm.get('address')?.value,
        clientContact: this.eventForm.get('clientContact')?.value
      };

      if (this.editData) {
        // Editing existing event
        eventData['_id'] = this.editData._id; // Assuming _id is present in editData
        this.EventsService.updateEventService(eventData, this.editData._id).subscribe({
          next: (res) => {
            alert("Event Updated");
            this.getAllCals();
            this.resetForm();
            this.toggleLiveDemo();

          },
          error: (err) => {
            console.error('Error updating event:', err);
          }
        });
      } else {
        // Creating new event
        eventData['date'] = this.eventForm.get('date')?.value;
        this.EventsService.createEventService(eventData).subscribe({
          next: (res) => {
            alert("Event Scheduled");
            this.getAllCals();
            this.resetForm();
            this.toggleLiveDemo();

          },
          error: (err) => {
            console.error('Error creating event:', err);
          }
        });
      }
    }
  };

  editEvent(event: any): void {
    this.editData = event;
    this.eventForm.patchValue({
      title: event.title,
      date: event.start,
      startTime: event.startTime,
      endTime: event.endTime,
      userName: event.userName,
      description: event.description,
      clientName:  event.clientName,
      clientEmail:  event.clientEmail,
      address:  event.address,
      clientContact:  event.clientContact
    });
    this.visible = true; // Show the modal for editing
  }


  clickAddMember() {
    this.resetForm();
  }
  resetForm(): void {
    this.eventForm.reset();

  }

  getAllCals() {
    this.EventsService.getAllEventsService().subscribe((res) => {
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
        this.updateCalendarOptions();
    });
}

  // getAllCals() {
  //   this.EventsService.getAllEventsService().subscribe((res) => {
  //     this.eventData = res;
  //     this.eventArray = this.eventData?.data?.map((event: any) => {
  //       const formattedEvent = {
  //         _id: event._id,
  //         title: event.title,
  //         start: event.date,
  //         time: event.startTime + ' - ' + event.endTime,
  //         description: event.description,
  //         userName: event.userName,
  //         clientName:  event.clientName,
  //         clientEmail:  event.clientEmail,
  //         address:  event.address,
  //         clientContact:  event.clientContact,
  //         jobId: event.jobId,
  //       };
  //       return formattedEvent;
  //     }) || [];
  //     console.log('Event Array:', this.eventArray);
  //     this.updateCalendarOptions();
  //   });
  // };

  updateCalendarOptions() {
    this.calendarOptions = { ...this.calendarOptions, events: [...this.eventArray] };
  };

  deleteEvent(id: any) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.EventsService.deleteEventService(id).subscribe({
        next: () => {
          this.getAllCals();
        },
        error: (err) => {
          console.error('Error deleting event:', err);
        }
      });
    }
  };
}