import { Component, OnInit, inject, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, } from '@angular/forms';
import { GroupsService } from '../../services/groups.service';

@Component({
  selector: 'app-groups',
  standalone: false,
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
})

export class GroupsComponent {
  
  groupForm: FormGroup;
  isEditMode = false;
  selectedGroupId: string | null = null;
  visible = false;
  newGroupName = '';
  searchTerm = '';
  selectedGroup = '';
  public visibleGroupDetails = false;
  groupData: any;

  groupList: any[] = [];
  clientList: any[] = [];
  filteredClients: any[] = [];

  clientModalVisible = false;
  selectedClientToAdd: any = null;

  groupDetails: any = null; 
  selectedGroupClients: any[] = [];
  selectedGroupName: string = '';
  loadingGroupId: string | null = null;
  isSubmittingGroup = false;

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private fb: FormBuilder,
    private groupsService: GroupsService,
  ) {
    this.groupForm = this.fb.group({
      groupName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllGroups();
    this.getAllClients();
  }

  // Add Group Modal
  toggleLiveDemo() {
    if (this.visible) {
      this.resetForm(); 
    } else {
      if (!this.isEditMode) {
        this.resetForm(); 
      }
    }
    this.visible = !this.visible;
  }
  

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  // Client Modal
  handleClientModalChange(event: any) {
    this.clientModalVisible = event;
  }

  // Add Client in group Modal
  toggleGroupDetails() {
    this.visibleGroupDetails = !this.visibleGroupDetails;
  }

  handleLiveGroupDetailsChange(event: any) {
    this.visibleGroupDetails = event;
  }

  getAllGroups(page: number = 1): void {
    this.groupsService.getAllGroupsService(page, this.pageSize).subscribe({
      next: (res) => {
        this.groupList = res.data || [];
        this.totalItems = res.pagination?.totalGroups || 0;
        this.currentPage = res.pagination?.page || 1;
      },
      error: (err) => {
        console.error("Error fetch get all groups", err);
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
  
  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getAllGroups(page);
    }
  }
  
  getAllClients(): void {
    this.groupsService.getAllClientsService().subscribe({
      next: (res) => {
        this.clientList = res.data?.crms || [];
      },
      error: (err) => {
        console.error('Failed to load clients:', err);
      }
    });
  }  

  submitGroup(): void {
    if (this.groupForm.invalid) return;

     const data = this.groupForm.value;
     this.isSubmittingGroup = true;

    if (this.isEditMode && this.selectedGroupId) {
      this.groupsService.updateGroupByIdService(this.selectedGroupId, data).subscribe({
        next: () => {
          this.getAllGroups();
          this.toggleLiveDemo();
          this.isSubmittingGroup = false;
        },
        error: (err) => {
          console.error('Update failed', err); 
          this.isSubmittingGroup = false;         
        }
      });
    } else {
      this.groupsService.createGroupService(data).subscribe({
        next: (res) => {
          this.getAllGroups();
          this.toggleLiveDemo();
          this.resetForm();
          this.isSubmittingGroup = false;
        },
        error: (err) => {
          console.error('Create failed', err);
          this.isSubmittingGroup = false;
        },
      });
    }
  }

  editGroup(data: any): void {
    this.groupForm.reset(); 
    this.groupForm.patchValue(data); 
    this.selectedGroupId = data._id;
    this.isEditMode = true;
    this.visible = true;
  }
  

  resetForm(): void {
    this.groupForm.reset();
    this.selectedGroupId = null;
    this.isEditMode = false;
  }
  

  filterGroups() {
    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clientList.filter((client) =>
      client.group.toLowerCase().includes(term)
    );
  }

  filterBySelectedGroup() {
    if (this.selectedGroup) {
      this.filteredClients = this.clientList.filter(
        (c) => c.group === this.selectedGroup
      );
    } else {
      this.filteredClients = [...this.clientList];
    }
  }

  openClientModal(group: string) {
    this.selectedGroup = group;
    this.clientModalVisible = true;
    this.selectedClientToAdd = null;
  }

  toggleManageClientModal() {
    this.visible = !this.visible;
  }

  handleManageClientModal(event: any) {
    this.visible = event;
  }

  closeClientModal() {
    this.clientModalVisible = false;
  }

  getClientsByGroup(group: string) {
    return this.clientList.filter((c) => c.group === group);
  }

  getUnassignedClients() {
    return this.clientList.filter(client => !client.group || client.group === '');
  }  

  addClientToGroup() {
    if (this.selectedClientToAdd) {
      this.selectedClientToAdd.group = this.selectedGroup;
      this.selectedClientToAdd = null;
    }
  }

  removeClientFromGroup(client: any) {
    client.group = ''; // or null, depending on your logic
  }

  getGroupById(id: any): void {
    this.loadingGroupId = id;

    this.groupsService.getGroupByIdService(id).subscribe({
      next: (res) => {
        console.log('Group data:', res);
        this.groupData = res.data;
        this.selectedGroupName = res.data.groupName || '';
        this.selectedGroupClients = res.data.clients || [];
        this.toggleGroupDetails();
        this.loadingGroupId = null;
        this.visibleGroupDetails = true;
      },
      error: (err) => {
        console.error('Error fetching group by ID:', err);
        this.loadingGroupId = null;
      }
    });
  }
  

  deleteGroupById(id: any): void {
    if (confirm('Are you sure you want to delete this group?')) {
      this.groupsService.deleteGroupByIdService(id).subscribe({
        next: (res) => {
          console.log('Group deleted:', res);
          this.getAllGroups();
        },
        error: (err) => {
          console.error('Error deleting group:', err);
        }
      });
    }
  }

  
}
