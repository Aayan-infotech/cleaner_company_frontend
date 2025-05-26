import { Component } from '@angular/core';

@Component({
  selector: 'app-groups',
  standalone: false,
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
})
export class GroupsComponent {
  visible = false;
  newGroupName = '';
  searchTerm = '';
  selectedGroup = '';
  

  groupList: string[] = ['Group A', 'Group B', 'Group C'];

  clientList = [
    {
      name: 'John Snow',
      email: 'snow@gmail.com',
      address: 'Castle Black',
      group: 'Group A',
      selected: false,
    },
    {
      name: 'Dragon Singh',
      email: 'dragon@gmail.com',
      address: 'Forest in Winters',
      group: 'Group A',
      selected: false,
    },
    {
      name: 'Arya Stark',
      email: 'arya@gmail.com',
      address: 'Winterfell',
      group: 'Group B',
      selected: false,
    },
  ];

  filteredClients = [...this.clientList];

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  handleClientModalChange(event: any) {
    this.clientModalVisible = event;
  }

  addGroup() {
    const trimmed = this.newGroupName.trim();
    if (trimmed && !this.groupList.includes(trimmed)) {
      this.groupList.push(trimmed);
    }
    this.newGroupName = '';
    this.toggleLiveDemo();
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

  clientModalVisible = false;
  selectedClientToAdd: any = null;

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
    return this.clientList.filter((c) => !this.groupList.includes(c.group));
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

  deleteGroup(groupToDelete: string) {
    this.groupList = this.groupList.filter((g) => g !== groupToDelete);
    this.clientList.forEach((c) => {
      if (c.group === groupToDelete) c.group = '';
    });
  }
}
