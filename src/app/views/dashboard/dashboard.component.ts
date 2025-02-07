
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { CalendarEventService } from '../../services/calendar-event.service';
import { UsersService } from '../../services/users.service';
import { DatePipe } from '@angular/common';
import { EmpMgmtService } from '../../services/emp-mgmt.service';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  providers: [DatePipe]
})

export class DashboardComponent {

  eventFb = inject(FormBuilder);
  EventsService = inject(CalendarEventService);
  eventForm!: FormGroup;
  router = inject(Router);
  eventData!: any;
  eventArray: any[] = [];
  editData: any;
  public visible = false;
  datePipe = inject(DatePipe);

  usersService = inject(UsersService);
  empMgmtService = inject(EmpMgmtService)
  userForm!: FormGroup;
  empData!: any;
  empArray: any[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: this.eventArray
  };
  estArray: any;
  estData: any;
  totalEmployees: number = 0;
  currentPage1: number = 1;
  totalPages1: number = 0;
  limit: number = 10;
  statusFilter: string = '';
  searchQuery: string = '';



  constructor() { }

  // Lifecycle hook - Initialize form and fetch events
  ngOnInit(): void {
    this.eventForm = this.eventFb.group({
      title: ['', Validators.required],
      date: [{ value: '', disabled: true }, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      description: ['', Validators.required],
      employeeName: ['', Validators.required],
      clientName: ['', Validators.required],
      clientEmail: ['', Validators.required],
      address: ['', Validators.required],
      clientContact: ['', Validators.required]
    });
    this.getAllCals();
    this.getAllUsers();
  };

  getAllUsers() {
    this.empMgmtService.getAllEmpMgmtsService( this.currentPage1,
      this.limit,
      this.statusFilter || '',
      this.searchQuery || '').subscribe({
      next: (res) => {
        console.log(res)
        this.empData = res;
        this.empArray = this.empData.data.employees;
        console.log('User Array:', this.empArray);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  };





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
        employeeName: this.eventForm.get('employeeName')?.value,
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
      employeeName: event.employeeName,
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
                employeeName: event.employeeName,
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