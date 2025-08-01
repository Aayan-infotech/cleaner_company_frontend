import { Component, OnInit, inject, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
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
  public visibleGroupDetails = false;
  groupData: any;

  groupList: any[] = [];
  filteredClients: any[] = [];
  selectedGroup: any = null;
  loadingGroups: boolean = false;
  selectedClientsToAdd: any[] = [];

  // client
  addClientForm!: FormGroup;
  clientList: any[] = [];
  selectedClientToAdd: any = null;
  assignedClients: any[] = [];
  clientModalVisible = false;
  isAddingClient: boolean = false;
  removingClientId: string | null = null;
  duplicateClientMsg: string | null = null;
  groupDetails: any = null;
  selectedGroupClients: any[] = [];
  selectedGroupName: string = '';
  loadingGroupId: string | null = null;
  isSubmittingGroup = false;
  groupSearchText: string = '';


  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(private fb: FormBuilder, private groupsService: GroupsService) {
    // Group Form
    this.groupForm = this.fb.group({
      groupName: ['', Validators.required],
    });

    // Client Form
    this.addClientForm = this.fb.group({
      clients: ['', Validators.required],
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

  toggleGroupDetails() {
    this.visibleGroupDetails = !this.visibleGroupDetails;
  }

  handleLiveGroupDetailsChange(event: any) {
    this.visibleGroupDetails = event;
  }

  getAllGroups(page: number = 1): void {
    this.loadingGroups = true;

    this.groupsService.getAllGroupsService(page, this.pageSize).subscribe({
      next: (res) => {
        this.groupList = res.data || [];
        this.totalItems = res.pagination?.totalGroups || 0;
        this.currentPage = res.pagination?.page || 1;
        this.loadingGroups = false;
      },
      error: (err) => {
        console.error('Error fetch get all groups', err);
        this.loadingGroups = false;
      },
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  totalPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getAllGroups(page);
    }
  }

  submitGroup(): void {
    if (this.groupForm.invalid) return;

    const data = this.groupForm.value;
    this.isSubmittingGroup = true;

    if (this.isEditMode && this.selectedGroupId) {
      this.groupsService
        .updateGroupByIdService(this.selectedGroupId, data)
        .subscribe({
          next: () => {
            this.getAllGroups();
            this.toggleLiveDemo();
            this.isSubmittingGroup = false;
          },
          error: (err) => {
            console.error('Update failed', err);
            this.isSubmittingGroup = false;
          },
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

  getGroupById(id: any): void {
    this.loadingGroupId = id;

    this.groupsService.getGroupByIdService(id).subscribe({
      next: (res) => {
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
      },
    });
  }

  deleteGroupById(id: any): void {
    if (confirm('Are you sure you want to delete this group?')) {
      this.groupsService.deleteGroupByIdService(id).subscribe({
        next: (res) => {
          this.getAllGroups();
        },
        error: (err) => {
          console.error('Error deleting group:', err);
        },
      });
    }
  }

  // Client Section

  toggleManageClientModal() {
    this.visible = !this.visible;
  }

  handleClientModalChange(visible: boolean): void {
    this.clientModalVisible = visible;
  }

  getAllClients(): void {
    this.groupsService.getAllClientsService().subscribe({
      next: (res) => {
        this.clientList = res.data || [];
      },
      error: (err) => {
        console.error('Failed to load clients:', err);
      },
    });
  }

  openClientModal(group: any): void {
    this.selectedGroup = group;
    this.selectedClientToAdd = null;
    this.clientModalVisible = true;
    this.getAllClients();
    this.assignedClients = group.clients || [];
  }

  closeClientModal(): void {
    this.clientModalVisible = false;
    this.selectedGroup = null;
    this.selectedClientToAdd = null;
    this.assignedClients = [];
  }

  onClientSelectChange(): void {
    this.duplicateClientMsg = null;
  }

  addClientToGroup(): void {
    if (!this.selectedGroup || this.selectedClientsToAdd.length === 0) return;

    const groupId = this.selectedGroup._id;
    const selectedClientIds = this.selectedClientsToAdd.map(client => client._id);

    // Filter out duplicates
    const alreadyAssignedIds = this.assignedClients.map(c => c._id);
    const newClientIds = selectedClientIds.filter(id => !alreadyAssignedIds.includes(id));

    if (newClientIds.length === 0) {
      this.duplicateClientMsg = 'Selected client(s) are already assigned to the group.';
      return;
    }

    this.isAddingClient = true;
    this.duplicateClientMsg = null;

    this.groupsService.addClientsToGroup(groupId, newClientIds).subscribe({
      next: (res) => {
        if (res.success) {
          this.assignedClients = res.data?.clients || [];
          this.selectedClientsToAdd = []; 
        }
        this.isAddingClient = false;
      },
      error: (err) => {
        console.error('Failed to add client:', err);
        this.isAddingClient = false;
      },
    });
  }


  removeClientFromGroup(clientId: string): void {
    const groupId = this.selectedGroup?._id;
    if (!groupId) return;

    this.removingClientId = clientId;

    this.groupsService.removeClientFromGroup(groupId, clientId).subscribe({
      next: (res) => {
        this.assignedClients = this.assignedClients.filter(
          (c) => c._id !== clientId
        );
        this.removingClientId = null;
      },
      error: (err) => {
        console.error('Failed to remove client:', err);
        this.removingClientId = null;
      },
    });
  }

  // Search Section
  get filteredGroupList(): any[] {
    if (!this.searchTerm.trim()) {
      return this.groupList;
    }

    const term = this.searchTerm.trim().toLowerCase();

    return this.groupList.filter(
      (group) =>
        (group.groupName ?? '').toLowerCase().includes(term) ||
        (group?.description ?? '').toLowerCase().includes(term) ||
        (group.clients ?? []).some((c: any) =>
          (c.name ?? '').toLowerCase().includes(term)
        )
    );
  }

  isClientSelected(client: any): boolean {
    return this.selectedClientsToAdd.some(c => c._id === client._id);
  }

  onClientCheckboxChange(event: any, client: any): void {
    if (event.target.checked) {
      if (!this.isClientSelected(client)) {
        this.selectedClientsToAdd.push(client);
      }
    } else {
      this.selectedClientsToAdd = this.selectedClientsToAdd.filter(c => c._id !== client._id);
    }
  }

  // Check if all clients are already selected
  areAllClientsSelected(): boolean {
    return this.clientList.length > 0 && this.clientList.every(client =>
      this.selectedClientsToAdd.some(selected => selected._id === client._id)
    );
  }

  // Toggle select/deselect all clients
  toggleSelectAllClients(event: any): void {
    if (event.target.checked) {
      this.selectedClientsToAdd = [...this.clientList];
    } else {
      this.selectedClientsToAdd = [];
    }
  }

  // Search Clients
  get filteredClientList(): any[] {
    if (!this.groupSearchText.trim()) {
      return this.clientList;
    }
  
    const term = this.groupSearchText.trim().toLowerCase();
  
    return this.clientList.filter(client =>
      (client.name && client.name.toLowerCase().includes(term)) ||
      (client.email && client.email.toLowerCase().includes(term))
    );
  }
  

}
