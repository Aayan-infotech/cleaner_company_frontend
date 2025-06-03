import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { ApiService } from '../../services/api.service';
import { EmpMgmtService } from '../../services/emp-mgmt.service';
import { Room } from '../../models/room';
import { Service } from '../../models/service';
import { ItemClean } from '../../models/item-clean';
import { DryCleaning } from '../../models/dry-cleaning';
import { HardSurface } from '../../models/hard-surface';
import { Method } from '../../models/method';
import { CalendarEventService } from '../../services/calendar-event.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { DatePipe } from '@angular/common';
import { EstimateService } from '../../services/estimate.service';


export interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  userName: string;
  clientName: string;
  clientEmail: string;
  address: string;
  clientContact: string;
  jobId: string;
  status: string;
}

interface SelectedServices {
  service?: { name: string; price: number };
  method?: { name: string; price: number };
  estimatedCost?: number;
}

interface Estimate {
  _id: string;
  jobId: string;
  room: { name: string };
  selectedServices: SelectedServices[];
}


@Component({
  selector: 'app-job-scheduling-management',
  standalone: false,
  templateUrl: './job-scheduling-management.component.html',
  styleUrl: './job-scheduling-management.component.scss',
  providers: [DatePipe]
})

export class JobSchedulingManagementComponent {

  allJobs: any[] = [];

  allServices: any[] = [];
  estimate: any = {
    selectedServices: [
      { service: '', method: '', estimatedCost: 0 }
    ]
  };

  allMethods: any[] =[];

  EventsService = inject(CalendarEventService);
  fb = inject(FormBuilder);
  dropForm!: FormGroup;

  visible: any;
  usersService = inject(UsersService);
  router = inject(Router)
  userData!: any;
  userArray!: any;
  visible2: any;
  estArray: Estimate[] = [];
  estData: any;
  eventData: any;
  eventArray: any;
  selectedJobId: any;

  toggleLiveDemo2() {
    this.visible2 = !this.visible2;
  }

  handleLiveDemoChange2(event2: any) {
    this.visible2 = event2;
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  rooms: Room[] = [];
  services: Service[] = [];
  itemCleans: ItemClean[] = [];
  dryCleanings: DryCleaning[] = [];
  hardSurfaces: HardSurface[] = [];
  methods: Method[] = [];

  estimates: { room: string, length: number, width: number, totalSquareFoot: number, selectedServices: { service: string, method: string, estimatedCost: number }[] }[] = [];


  //calendar
  
  eventFb = inject(FormBuilder);
  eventForm!: FormGroup;

  calendarData!: any;
  calendarArray: any[] = [];
  editData: any;
  public visible3 = false;
  datePipe = inject(DatePipe);

  empMgmtService = inject(EmpMgmtService)
  userForm!: FormGroup;
  empData!: any;
  empArray: any[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    weekends: false ,
    plugins: [dayGridPlugin, interactionPlugin, interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
    dateClick: (arg) => this.handleDateClick(arg),
    events: this.calendarArray
  };

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
  }

  
  currentPage1: number = 1;
  totalPages1: number = 0;
  limit: number = 10;
  statusFilter: string = '';
  searchQuery: string = '';
  eventType = [
    "Job","Employee","Holiday","Office"
  ]
eventTypeColors: { [key: string]: string } = {
  Job: "#ffb879",
  Employee: "#ffe3b2",
  Holiday: "#a8faf3",
  Office: "#2996f7",
};
  selectedEventType = ''; 

  //  history

  historyArray: Event[] = [];
  historyData: any;

  constructor(private apiService: ApiService, private estimateService: EstimateService) { }

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
      clientContact: ['', Validators.required],
      eventType: ['', Validators.required],
    });
    this.apiService.getRooms().subscribe(data => this.rooms = data);
    this.apiService.getServices().subscribe(data => this.services = data);
    this.apiService.getItemCleans().subscribe(data => this.itemCleans = data);
    this.apiService.getDryCleanings().subscribe(data => this.dryCleanings = data);
    this.apiService.getHardSurfaces().subscribe(data => this.hardSurfaces = data);
    this.apiService.getMethods().subscribe(data => this.methods = data);
    this.getAllUsers();
    this.getAllEstimatesData();
    this.getAllHistory()
    this.getAllCalendar();
    this.getAllJobs();
    this.getAllServices();
  }

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

  // All estimates
  getAllEstimatesData() {
    this.estimateService.getAllEstimates()
      .subscribe((res) => {
        this.estData = res;
        this.estArray = this.estData.data;
        console.log("All estimates: ",this.estArray);
      });
  }

  // Get all Jobs
  getAllJobs(): void {
    this.estimateService.getAllJobsService().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.allJobs = res.data;
          console.log('All Jobs: ', this.allJobs);
        } else {
          console.error('Failed to fetch jobs:', res.message);
        }
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
      }
    })  
  };

  // Get All Services
  getAllServices(): void {
    this.estimateService.getAllServicesService().subscribe({
      next: (res) => {
        if (res.success && res.status === 200) {
          this.allServices = res.data;
          console.log('All services loadedssssssssssss:', this.allServices);
        } else {
          console.error('Failed to fetch services:', res.message);
        }
      },
      error: (err) => {
        console.error('API error:', err);
      }
    });
  }

  getServiceName(serviceId: string): string {
    const service = this.allServices.find(s => s._id === serviceId);
    return service ? service.name : 'Unknown Service';
  }

  // Returns array of method objects for the given service ID
  getMethodsForService(serviceId: string): any[] {
    const service = this.allServices.find(s => s._id === serviceId);
    if (service && service.methods) {
      // methods array contains { method: {...} } objects
      return service.methods.map((m: any) => m.method);
    }
    return [];
  }

  // Optional: clears method when service changes
  onServiceChange(index: number): void {
    this.estimates[index].selectedServices.forEach((selectedService, svcIdx) => {
      selectedService.method = '';
    });
  }
 
  
  onMethodChange(roomIndex: number): void {
    const room = this.estimates[roomIndex];
    room.selectedServices.forEach((selectedService) => {
      selectedService.estimatedCost = this.calculateServicePrice(selectedService);
    });
  }
  
  

  updateEstimateTotal(): void {
    this.estimate.totalPrice = this.estimate.selectedServices.reduce(
      (sum: number, s: any): number => sum + this.calculateServicePrice(s),
      0
    );
  }
  
  getTotalEstimatePrice(): number {
    return this.estimate.selectedServices.reduce((sum: number, selectedService: any) => {
      return sum + this.calculateServicePrice(selectedService);
    }, 0);
  }
  


  // Helper function to retrieve subitems based on the selected item ID
  getSubItems(itemCleanId: string) {
    const item = this.itemCleans.find(ic => ic._id === itemCleanId);
    return item ? item.subItems : [];
  }

  addRoom() {
    this.estimates.push({ room: '', length: 0, width: 0, totalSquareFoot: 0, selectedServices: [] });
  }

  addService(index: number) {
    this.estimates[index].selectedServices.push({ service: '', method: '', estimatedCost: 0 });
  }

  removeRoom(index: number) {
    this.estimates.splice(index, 1);
  }

  removeService(roomIndex: number, serviceIndex: number) {
    this.estimates[roomIndex].selectedServices.splice(serviceIndex, 1);
  }

 // Assuming selectedService: { service: string, method: string }
  calculateServicePrice(selectedService: any): number {
    const service = this.allServices.find(s => s._id === selectedService.service);
    const method = service?.methods?.find((m: any) => m._id === selectedService.method);

    const servicePrice = service?.price || 0;
    const methodPrice = method?.price || 0;

    return servicePrice + methodPrice;
  }



  calculateEstimate(): number {
    return this.estimates.reduce((total, estimate) => {
      return total + estimate.selectedServices.reduce((serviceTotal, selectedService) => {
        return serviceTotal + this.calculateServicePrice(selectedService);
      }, 0);
    }, 0);
  }


  submitEstimate1() {
    // Calculate estimated cost for each service and add it to the estimates
    this.estimates.forEach(estimate => {
      estimate.selectedServices.forEach(selectedService => {
        selectedService.estimatedCost = this.calculateServicePrice(selectedService);
      });
    });

    const estimateData = {
      jobId: this.selectedJobId,
      totalEstimate: this.calculateEstimate(),
      estimates: this.estimates
    };

    this.estimateService.submitEstimate(estimateData)
      .subscribe({
        next: (res) => {
          alert("Item Created");
          console.log("Estimate Submitted", res);
          this.resetEstimates();
          this.getAllEstimatesData();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  submitEstimate(): void {
    const estimatePayload = {
      jobId: this.selectedJobId,
      estimates: this.estimates.map(est => ({
        room: est.room,
        length: est.length,
        width: est.width,
        totalSquareFoot: est.totalSquareFoot,
        selectedServices: est.selectedServices.map(s => ({
          serviceId: s.service,  // rename here
          methodId: s.method,    // rename here
          estimatedCost: this.calculateServicePrice(s),
        }))
      }))
    };
  
    this.estimateService.submitEstimate(estimatePayload).subscribe({
      next: (res) => {
        console.log('Estimate submitted:', res);
        this.toggleLiveDemo2(); // Close modal
        this.getAllEstimatesData(); // Refresh
      },
      error: (err) => {
        console.error('Error submitting estimate:', err);
      }
    });
  }
  
  
  
  

  resetEstimates() {
    this.estimates = [];
  }

  getRoomName(roomId: string): string {
    const room = this.rooms.find(r => r._id === roomId);
    return room ? room.name : '';
  }

  // getServiceName(serviceId: string): string {
  //   const service = this.services.find(s => s._id === serviceId);
  //   return service ? service.name : '';
  // }


  
  

  // getItemCleanName(itemCleanId: string): string {
  //   const itemClean = this.itemCleans.find(ic => ic._id === itemCleanId);
  //   return itemClean ? itemClean.name : '';
  // }

  getItemCleanName(itemCleanId: string): string {
    const itemClean = this.itemCleans.find(ic => ic._id === itemCleanId);
    return itemClean ? itemClean.name : '';
  }

  getDryCleaningName(dryCleaningId: string): string {
    const dryCleaning = this.dryCleanings.find(dc => dc._id === dryCleaningId);
    return dryCleaning ? dryCleaning.name : '';
  }

  getHardSurfaceName(hardSurfaceId: string): string {
    const hardSurface = this.hardSurfaces.find(hs => hs._id === hardSurfaceId);
    return hardSurface ? hardSurface.name : '';
  }

  getMethodName(methodId: string): string {
    const method = this.methods.find(m => m._id === methodId);
    return method ? method.name : '';
  }

  deleteEstimate(id: any) {
    this.estimateService.deleteEstimateService(id)
      .subscribe(res => {
        alert('Estimate Deleted')
        this.getAllEstimatesData();
      })
  }

  // calender start


  handleDateClick(arg: DateClickArg) {
    this.resetForm(); // Reset the form
    this.visible3 = true;
    this.eventForm.patchValue({
      date: arg.dateStr
    });
  };

  toggleLiveDemo3() {
    this.visible3 = !this.visible3;
  };

  handleLiveDemoChange3(event: any) {
    this.visible3 = event;
  };


  submit() {
    if (this.eventForm.valid) {
      const calendarData: any = {
        title: this.eventForm.value.title,
        startTime: this.eventForm.get('startTime')?.value,
        endTime: this.eventForm.get('endTime')?.value,
        description: this.eventForm.get('description')?.value,
        employeeName: this.eventForm.get('employeeName')?.value,
        clientName: this.eventForm.get('clientName')?.value,
        clientEmail: this.eventForm.get('clientEmail')?.value,
        address: this.eventForm.get('address')?.value,
        clientContact: this.eventForm.get('clientContact')?.value,
        eventType: this.eventForm.get('eventType')?.value,
      };

      if (this.editData) {
        // Editing existing event
        calendarData['_id'] = this.editData._id; // Assuming _id is present in editData
        this.EventsService.updateEventService(calendarData, this.editData._id).subscribe({
          next: (res) => {
            alert("Event Updated");
            this.getAllCalendar();
            this.resetForm();
            this.toggleLiveDemo3();

          },
          error: (err) => {
            console.error('Error updating event:', err);
          }
        });
      } else {
        // Creating new event
        calendarData['date'] = this.eventForm.get('date')?.value;
        this.EventsService.createEventService(calendarData).subscribe({
          next: (res) => {
            alert("Event Scheduled");
            this.getAllCalendar();
            this.resetForm();
            this.toggleLiveDemo3();

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
      date: event.date || event.start,
      startTime: event.startTime,
      endTime: event.endTime,
      employeeName: event.employeeName,
      description: event.description,
      clientName:  event.clientName,
      clientEmail:  event.clientEmail,
      address:  event.address,
      clientContact:  event.clientContact,
      eventType: event.eventType
    });
    this.visible3 = true; // Show the modal for editing
  }


  clickAddMember() {
    this.resetForm();
  }
  resetForm(): void {
    this.eventForm.reset();
    this.editData = null; 
  }

  getAllCalendar() {
    this.EventsService.getAllEventsService().subscribe((res) => {
        this.calendarData = res;
        this.calendarArray = this.calendarData?.data?.map((event: any) => {
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
            
            const eventTypeColors: { [key: string]: string } = {
              Job:'#ffb879',
              Employee:'#ffe3b2',
              Holiday:'#a8faf3',
              Office: '#2996f7'
            };
            const eventColor = eventTypeColors[event.eventType] || '#007bff'; // Default Blue
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
                status: event.status,
                eventType: event.eventType,
                backgroundColor: eventColor,
                borderColor: eventColor,
            };
            return formattedEvent;
        }) || [];
        console.log('Event Array:', this.calendarArray);
        this.updateCalendarOptions();
    });
}

filterEvents() {
  const filteredEvents = this.selectedEventType
    ? this.calendarArray.filter((event) => event.eventType === this.selectedEventType)
    : this.calendarArray; // Show all events if no type is selected

  this.calendarOptions = { ...this.calendarOptions, events: filteredEvents };
}


updateCalendarOptions() {
  this.calendarOptions = {
    initialView: 'dayGridMonth',
    events: this.calendarArray,
    eventClick: (info) => {
      alert(
        `Event: ${info.event.title}\nType: ${info.event.extendedProps['eventType']}`
      );
    },
    eventContent: function (arg) {
      return {
        html: `<div style="color: black; font-weight: bold;">${arg.event.title}</div>`
      };
    },
  };
}

  deleteEvent(id: any) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.EventsService.deleteEventService(id).subscribe({
        next: () => {
          this.getAllCalendar();
        },
        error: (err) => {
          console.error('Error deleting event:', err);
        }
      });
    }
  };

    // calender end

    // history start

    getAllHistory() {
      this.EventsService.getAllEventsService().subscribe((res) => {
          this.historyData = res;
          this.historyArray = this.historyData?.data?.map((event: any) => {
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
          console.log('History Array:', this.historyArray);
      });
  }
    // history end


}



