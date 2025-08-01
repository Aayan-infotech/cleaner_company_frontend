import { Component, OnInit, inject, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpMgmtService } from '../../services/emp-mgmt.service';
import { VanService } from '../../services/van.service';
import { EmpCertificateService } from '../../services/emp-certificate.service';
import { ChatService } from '../../services/chat.service';
import { TimetrackService } from '../../services/timetrack.service';
import { PushNotificationService } from '../../services/push-notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

export interface Van {
  _id: string;
  vanName: string;
}

@Component({
  selector: 'app-emp-mgmt',
  standalone: false,
  templateUrl: './emp-mgmt.component.html',
  styleUrl: './emp-mgmt.component.scss'
})

export class EmpMgmtComponent implements OnInit {



  @Input() empId: string | null = null;

  @Input() empCertId: string | null = null;
  @Input() employeeId: string | null = null;
  responseMessage: string | null = null;
  responseClass: string = '';
  employeeNotifications: any[] = [];

  employeeTimeLogs: any[] = [];
  currentPage = 1; // Default to the first page
  totalPages = 1;
  totalRecords = 0;
  recordsPerPage = 5; // Adjust as needed

  fb: FormBuilder = inject(FormBuilder);
  EmpMgmtService: EmpMgmtService = inject(EmpMgmtService);
  VanMgmtService: VanService = inject(VanService);
  ChatService: ChatService = inject(ChatService);
  EmpCertificate: EmpCertificateService = inject(EmpCertificateService);
  TimetrackService: TimetrackService = inject(TimetrackService);
  pushNotificationService = inject(PushNotificationService);
  router: Router = inject(Router);

  empMgmtForm!: FormGroup;
  empCertificateForm!: FormGroup;
  empMgmtData: any[] = [];
  vanMgmtData!: any;
  empCertificateData!: any;
  empMgmtArray!: any;
  empCertificateArray!: any;
  editData: any;
  public activePage = 2;

  vanArray: Van[] = [];
  vanItemsData!: any;
  vanNameItemData!: any;
  vanNameItemArray!: any;


  public visible = false;
  public visibleViewEmpDetails = false;

  public addCertificatesvisible = false;
  selectedEmployeeId!: string; // Holds the current employee ID
  selectedImages: File[] = [];
  empMgmtImage: any;

  selectedImagesCertificate: File[] = [];
  employeeCertificates: any;


  public isEditMode = false;
  isViewClicked: boolean = false;
  showSaveChanges: boolean = true;
  public visible2 = false;
  public visible3 = false;
  currentNote = '';
  notificationForm!: FormGroup
  leaveForm!: FormGroup
  deviceToken: string | null = null;
  errorMessage: string | null = null;
  // Add employee Model
  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  // View employee details
  toggleLiveViewEmpDetailsDemo() {
    this.visibleViewEmpDetails = !this.visibleViewEmpDetails;
  }

  handleLiveDemoViewEmpDetailsChange(event: any) {
    this.visibleViewEmpDetails = event;
  }


  openAddCertificateModal(employeeId: string): void {
    this.selectedEmployeeId = employeeId;
    this.toggleLiveAddCertificates();
  }

  toggleLiveAddCertificates(): void {
    this.addCertificatesvisible = !this.addCertificatesvisible;
  }
  // Add Certificates Model
  handleLiveAddCertificatesChange(event: any) {
    this.addCertificatesvisible = event;
  }

  employee_role: string[] = ['Company', 'Technicians'];
  role_assigned: string[] = ['PP Admin', 'PP Employee', 'Client Admin', 'Client Supervisor', 'Client Employee'];

  dummyChatMessages = [
    {
      sender: 'admin',
      message: 'Hello, welcome to the company!',
      timestamp: new Date('2023-12-01T09:00:00')
    },
    {
      sender: 'employee',
      message: 'Thank you! I am excited to be here.',
      timestamp: new Date('2023-12-01T09:05:00')
    },
    {
      sender: 'admin',
      message: 'Let me know if you need any help.',
      timestamp: new Date('2023-12-01T09:10:00')
    },

  ];


  toggleLiveDemo2() {
    this.visible2 = !this.visible2;
  }

  handleLiveDemoChange2(event: any) {
    this.visible2 = event;
  }

  toggleLiveDemo3() {
    this.visible3 = !this.visible3;
  }

  handleLiveDemoChange3(event: any) {
    this.visible3 = event;
  }

  totalEmployees: number = 0;
  currentPage1: number = 1;
  totalPages1: number = 0;
  limit: number = 5;
  statusFilter: string = '';
  searchQuery: string = '';
  isExpanded = false;
  toggleViewMore() {
    this.isExpanded = !this.isExpanded;
  }

  chatMessages: any[] = [];
  newMessage = '';
  userRole = 'admin'; // Set dynamically based on logged-in user
  adminId : any
  private subscription!: Subscription;
  
  ngOnInit(): void {
    this.adminId = localStorage.getItem('user_id');
    this.empMgmtForm = this.fb.group({
      employee_name: ['', Validators.required],
      employee_email: ['', Validators.compose([Validators.required, Validators.email])],
      employee_password: ['', Validators.required],
      employee_address: ['', Validators.required],
      employee_contact: ['', Validators.required],
      employee_photo: [''],
      employee_role: ['', Validators.required],
      employee_vanAssigned: ['', Validators.required],
      employee_SocialSecurityNumber: ['', Validators.required],
      employee_EmContactName: ['', Validators.required],
      employee_EmContactNumber: ['', Validators.required],
      employee_EmContactEmail: ['', Validators.required],
      employee_EmContactAddress: ['', Validators.required],
      employee_addNote: ['', Validators.required],
      role_assigned: ['', Validators.required]

    });

    if (!this.chatMessages || this.chatMessages.length === 0) {
      this.chatMessages = this.dummyChatMessages;
    }

    this.empCertificateForm = this.fb.group({
      certificate_file: ['', Validators.required],
      certificate_note: ['', Validators.required],
    })

    this.notificationForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
    })

    this.leaveForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    })

    if (this.empId) {
      this.getAllVanMgmts();
      this.getEmpMgmtById(this.empId);
    }
    this.getAllEmpMgmts();
    this.getAllVanMgmts();
 
  };



  // upload Certificates code Start

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImagesCertificate = [file]; // Keep only one file for now
      this.empCertificateForm.patchValue({ certificate_file: file });
    }
  }

  uploadCertificates(): void {
    if (this.empCertificateForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    const file = this.empCertificateForm.get('certificate_file')?.value;
    const note = this.empCertificateForm.get('certificate_note')?.value;

    formData.append('certificate_file', file);
    formData.append('certificate_note', note);

    // Use the dynamically set employee ID
    this.EmpCertificate.addEmpCertificateByEmpIdService(this.selectedEmployeeId, formData).subscribe({
      next: (response) => {
        alert('Certificate uploaded successfully!');
        this.toggleLiveAddCertificates(); // Close the modal
        this.empCertificateForm.reset(); // Reset the form
      },
      error: (err) => {
        console.error(err);
        alert('Error uploading certificate.');
      },
    });
  }

  // upload Certificates code End

  onFileChanged(event: any): void {
    this.selectedImages = Array.from(event.target.files);
    this.empMgmtForm.patchValue({
      employee_photo: this.selectedImages.length > 0 ? this.selectedImages : '',
    });
  }

  resetForm(): void {
    this.empMgmtForm.reset();
    this.empCertificateForm.reset();
    this.notificationForm.reset();
    this.empId = null;
    this.isEditMode = false;
    this.selectedImages = [];
    this.isViewClicked = false;
    this.showSaveChanges = true;
    this.employeeId = null;
    this.leaveForm.reset();
  };

  // Manage Employee Code Start

  submitEmpMgmtForm() {
    console.log(this.empMgmtForm.value)
    const formData = new FormData();
    // fill fields
    formData.append('employee_name', this.empMgmtForm.get('employee_name')?.value,);
    formData.append('employee_email', this.empMgmtForm.get('employee_email')?.value,);
    formData.append('employee_password', this.empMgmtForm.get('employee_password')?.value,);
    formData.append('employee_address', this.empMgmtForm.get('employee_address')?.value,);
    formData.append('employee_contact', this.empMgmtForm.get('employee_contact')?.value,);
    formData.append('employee_SocialSecurityNumber', this.empMgmtForm.get('employee_SocialSecurityNumber')?.value,);
    formData.append('employee_role', this.empMgmtForm.get('employee_role')?.value,);
    formData.append('employee_vanAssigned', this.empMgmtForm.get('employee_vanAssigned')?.value,);

    formData.append('employee_EmContactName', this.empMgmtForm.get('employee_EmContactName')?.value,);
    formData.append('employee_EmContactNumber', this.empMgmtForm.get('employee_EmContactNumber')?.value,);
    formData.append('employee_EmContactEmail', this.empMgmtForm.get('employee_EmContactEmail')?.value,);
    formData.append('employee_EmContactAddress', this.empMgmtForm.get('employee_EmContactAddress')?.value,);
    formData.append('employee_addNote', this.empMgmtForm.get('employee_addNote')?.value,);
    formData.append('role_assigned', this.empMgmtForm.get('role_assigned')?.value,);




    this.selectedImages.forEach((file) => {
      formData.append('employee_photo', file, file.name);
    });

    if (this.empId) {
      // Update Employee
      this.EmpMgmtService.updateEmpMgmtService(this.empId, formData)
        .subscribe({
          next: () => {
            alert('Employee details Updated successfully');
            this.selectedImages = [];
         
            this.getAllEmpMgmts();
            this.resetForm();
          },
          error: (err: any) => {
            console.log(err);
          }
        });
    }
    else {
      // Create new Employee
      this.EmpMgmtService.createEmpMgmtService(formData)
        .subscribe({
          next: (res: any) => {
            alert('Employee Created successfully');
            console.log(formData)
            this.selectedImages = [];
            this.resetForm();
            this.getAllEmpMgmts();
          },
          error: (err: any) => {
            console.log(err);
          }
        });
    }
  };


  onVanChange(event: Event): void {
    const selectedVanId = (event.target as HTMLSelectElement).value;


    const selectedVan = this.vanArray.find(van => van._id === selectedVanId);
    if (selectedVan) {
      this.empMgmtForm.patchValue({
        employee_vanAssigned: selectedVan._id, // Store only the van ID in the form
      });
    }
  }




  clickAddMember() {
    this.empMgmtForm.reset();
    this.empCertificateForm.reset();
    this.notificationForm.reset();
    this.leaveForm.reset();
    this.empId = null;
    this.isEditMode = false;
    this.isViewClicked = false;
    this.showSaveChanges = true;
  };

  getAllEmpMgmts(): void {
    this.EmpMgmtService.getAllEmpMgmtsService(
      this.currentPage1,
      this.limit,
      this.statusFilter,
      this.searchQuery
    ).subscribe((res: any) => {
      this.empMgmtData = res.data.employees;
      this.totalEmployees = res.data.totalEmployees;
      this.totalPages1 = res.data.totalPages;
    });
  }
  onSearch(): void {
    this.currentPage1 = 1; // Reset to the first page on new search
    this.getAllEmpMgmts();
  }

  onFilterChange(): void {
    this.currentPage1 = 1; // Reset to the first page on status filter change
    this.getAllEmpMgmts();
  }

  onPageChange(newPage: number): void {
    this.currentPage1 = newPage;
    this.getAllEmpMgmts();
  }


  getAllVanMgmts() {
    this.VanMgmtService.getAllVans()
      .subscribe((res: any) => {
        this.vanMgmtData = res;
        this.vanArray = this.vanMgmtData.data || [];
        console.log("All Vans:", this.vanArray);
      });
  }

  getEmpMgmtById(id: any) {
    this.EmpMgmtService.getEmpMgmtByIdService(id)
      .subscribe((data: any) => {

        this.editData = data
        const assignedVanId = this.editData.data.employee_vanAssigned?._id;
        //console.log(this.editData.data);


        this.empId = this.editData.data._id;
        this.empMgmtForm.patchValue({
          employee_name: this.editData.data.employee_name,
          employee_email: this.editData.data.employee_email,
          employee_password: this.editData.data.employee_password,
          employee_address: this.editData.data.employee_address,
          employee_contact: this.editData.data.employee_contact,
          role_assigned: this.editData.data.role_assigned,
          employee_role: this.editData.data.employee_role,
          employee_vanAssigned: assignedVanId,
          employee_SocialSecurityNumber: this.editData.data.employee_SocialSecurityNumber,
          employee_photo: this.editData.data.employee_photo, // Updated key

          employee_EmContactName: this.editData.data.employee_EmContactName,
          employee_EmContactNumber: this.editData.data.employee_EmContactNumber,
          employee_EmContactEmail: this.editData.data.employee_EmContactEmail,
          employee_EmContactAddress: this.editData.data.employee_EmContactAddress,
          employee_addNote: this.editData.data.employee_addNote,

        });


        this.isEditMode = true;
        this.isViewClicked = false;
        this.showSaveChanges = true;
      });
  };

  getVanNameById(vanId: string): void {
    this.VanMgmtService.getVanById(vanId)
      .subscribe((vanData: any) => {
        this.vanNameItemData = vanData.data.vanName;
      }, (error: any) => {
        console.error('Error fetching van details', error);
        this.vanNameItemData = 'N/A';
      });
  }

  viewEmpMgmtById(id: any) {
    this.EmpMgmtService.getEmpMgmtByIdService(id)
      .subscribe((data: any) => {
        this.editData = data;
        this.visibleViewEmpDetails = true;
        this.empId = this.editData.data._id;

        this.empMgmtForm.patchValue({
          employee_name: this.editData.data.employee_name,
          employee_email: this.editData.data.employee_email,
          employee_password: this.editData.data.employee_password,
          employee_address: this.editData.data.employee_address,
          employee_contact: this.editData.data.employee_contact,
          employee_photo: this.editData.data.employee_photo,
          employee_role: this.editData.data.employee_role,
          employee_vanAssigned: this.editData.data.employee_vanAssigned,
          employee_SocialSecurityNumber: this.editData.data.employee_SocialSecurityNumber,
          role_assigned :this.editData.data.role_assigned,
          employee_EmContactName: this.editData.data.employee_EmContactName,
          employee_EmContactNumber: this.editData.data.employee_EmContactNumber,
          employee_EmContactEmail: this.editData.data.employee_EmContactEmail,
          employee_EmContactAddress: this.editData.data.employee_EmContactAddress,
          employee_addNote: this.editData.data.employee_addNote,
        });

        // Fetch certificates
        if (this.empId) {
          this.EmpCertificate.getAllEmpCertificatesByEmpIdService(this.empId)
            .subscribe((certificates: any) => {
              this.employeeCertificates = certificates;
              this.employeeCertificates = this.employeeCertificates.data
            });

          this.pushNotificationService.getNotifications(this.empId).subscribe((notifications: any) => {
            if (notifications.success) {
              this.employeeNotifications = notifications.data; // Store notifications
              console.log(this.employeeNotifications)
            } else {
              console.warn('No notifications found for this employee:', notifications.message);
              this.employeeNotifications = [];
            }
          });

          this.ChatService.getMessages(this.empId, this.adminId).subscribe((messages) => {
            this.chatMessages = messages.map((chat) => ({
              ...chat,
              timestamp: chat.timestamp?.toDate ? chat.timestamp.toDate() : chat.timestamp,
            }));
          });
          
          
        } else {
          console.error('Employee ID is null or undefined');
        }


        this.fetchTimeLogs();



        this.isEditMode = false;
        this.isViewClicked = true;
        this.showSaveChanges = false;
      });
  }


  deleteEmpMgmtById(id: any) {
    if (confirm("Are you sure you want to delete this Employee ?")) {
      this.EmpMgmtService.deleteEmpMgmtByIdService(id)
        .subscribe({
          next: (res: any) => {
            this.getAllEmpMgmts();
          },
          error: (error: any) => {
            console.error(error);
            alert('Failed to delete Employee.')
          }
        });
    }
  };

  toggleStatus(empId: any): void {
    console.log('Toggling status for employee ID:', empId);
    this.EmpMgmtService.toggleEmpStatus(empId).subscribe({
      next: (response: any) => {
        console.log('Status updated successfully:', response);
        const updatedEmployee = this.empMgmtData.find((emp: any) => emp._id === empId);
        if (updatedEmployee) {
          updatedEmployee.employee_employeeStatus = updatedEmployee.employee_employeeStatus === 'Active' ? 'Block' : 'Active';
        }
        alert('Employee status updated successfully');
      },
      error: (err: any) => {
        console.error('Error updating status:', err);
        alert('Failed to update employee status');
      },
    });
  }

  // Manage Employee Code End
  


  //timetrack start

  fetchTimeLogs() {
    if (this.empId) {
      this.TimetrackService.getTimeLogsByEmployeeId(this.empId, this.currentPage, this.recordsPerPage)
        .subscribe((timeLogs: any) => {
          console.log("time", timeLogs)
          this.employeeTimeLogs = timeLogs?.data?.records || [];
          this.currentPage = timeLogs?.data?.currentPage || 1;
          this.totalPages = timeLogs?.data?.totalPages || 1;
          this.totalRecords = timeLogs?.data?.totalRecords || 0;
        });
    } else {
      console.error('Employee ID is null or undefined');
    }
  }

  // Pagination Handlers
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchTimeLogs();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchTimeLogs();
    }
  }

  //timetrack end

  // notification start

  handleNotificationClick(employeeId: any) {
    this.getUserToken(employeeId); // Fetch the token
  }

  getUserToken(id: any) {
    const observer = {
      next: (response: any) => {
        this.employeeId = response.deviceToken?.employeeId || 'No UserIf found'
        this.deviceToken = response.deviceToken?.token || 'No token found';
        this.errorMessage = null;
        //  console.log(this.deviceToken);
        // Open the modal if token retrieval is successful
        this.toggleLiveDemo2();
      },
      error: (error: any) => {
        // console.error('Error fetching token:', error);
        this.errorMessage = 'Failed to fetch the device token. Please try again.';
        this.deviceToken = null;
        // Show an alert if token retrieval fails
        alert('He needs to Login first through Mobile APP');
      },
    };

    this.pushNotificationService.getTokenByUserId(id).subscribe(observer);
  }

  sendNotification() {
    if (this.notificationForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    const notificationData = {
      employeeId: this.employeeId || '', // Fallback to an empty string if null
      token: this.deviceToken || '', // Fallback to an empty string if null
      title: this.notificationForm.value.title,
      body: this.notificationForm.value.body,
    };

    this.pushNotificationService.sendNotification(notificationData).subscribe({
      next: (response) => {
        console.log('Notification sent successfully:', response.message);
        alert('Notification sent successfully');
        this.toggleLiveDemo2(); // Close the modal after success
        this.notificationForm.reset();
      },
      error: (error) => {
        console.error('Error sending notification:', error);
        alert('Failed to send notification. Please try again.');
        this.notificationForm.reset();
      },
    });
  }


  //notification end


  //leave start

  applyLeave(): void {
    if (this.leaveForm.valid) {
      const { startDate, endDate } = this.leaveForm.value;
      
      // Check if empId is valid
      if (this.empId) {
        const employeeId = this.empId; // Use empId directly
        this.TimetrackService.applyLeave(employeeId, startDate, endDate).subscribe({
          next: (response) => {
            this.responseMessage = response.message || 'Leave applied successfully!';
            this.responseClass = 'text-success';
            this.leaveForm.reset();
            alert("Leave Applied Successfully");
            this.toggleLiveDemo3(); // Close the modal after submission
          },
          error: (error: HttpErrorResponse) => {
            this.responseMessage = error.error.message || 'An error occurred!';
            this.responseClass = 'text-danger';
          },
        });
      } else {
        // Handle case when empId is invalid
        alert("Employee ID is missing or invalid.");
      }
    }
  }
  

  

  // leave end

// chat

sendMessage() {
  if (!this.newMessage.trim()) {
    console.error('Message cannot be empty');
    return;
  }

  if (!this.empId || !this.adminId) {
    console.error('Employee ID or Admin ID is missing');
    return;
  }

  this.ChatService
    .sendMessage(this.adminId, this.newMessage, this.empId, this.adminId)
    .then(() => {
      this.newMessage = ''; // Clear the input field after sending the message
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
}

getBubbleClass(senderId: string): string {
  return senderId === this.empId ? 'bg-info text-white' : 'bg-light';
}

ngOnDestroy(): void {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
}
}


