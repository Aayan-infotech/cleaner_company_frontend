import { Component } from '@angular/core';

@Component({
  selector: 'app-groups',
  standalone: false,
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent {
  selectedGroup: string = '';
  groupList: string[] = ['Group A', 'Group B', 'Group C'];
   public visible = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
}
