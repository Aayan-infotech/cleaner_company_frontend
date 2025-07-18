import { Component, ViewChild, ElementRef } from '@angular/core';
import { MarketingCategoriesService } from '../../services/marketing-categories.service';
import { Template2Service } from '../../services/template2.service';
import { GroupsService } from '../../services/groups.service';
import { CrmService } from '../../services/crm.service';
type ShareTab = 'group' | 'client';

@Component({
  selector: 'app-marketing',
  standalone: false,
  templateUrl: './marketing.component.html',
  styleUrl: './marketing.component.scss'
})
export class MarketingComponent {

  @ViewChild('colorInput') colorInput!: ElementRef<HTMLInputElement>;
  @ViewChild('bgColorInput') bgColorInput!: ElementRef<HTMLInputElement>;
  @ViewChild('textColorInput') textColorInput!: ElementRef<HTMLInputElement>;
  @ViewChild('previewContainer') previewContainer!: ElementRef;
  @ViewChild('titleContent') titleContent!: ElementRef;
  @ViewChild('descContent') descContent!: ElementRef;

  logoDataUrl: string | null = null;
  titleText: string = 'Title';
  descText: string = 'Description';
  allTemplates: any[] = [];
  hoveredTemplateId: string | null = null;
  deletingTemplateId: string | null = null;
  public visibleShareTemp = false;
  activeTab: string = 'group';
  shareTab: ShareTab = 'group';
  logoFile: File | null = null;
  logoPreviewUrl: string | null = null;

  isBold = false;
  isItalic = false;
  fontSize = 18;

  allCategories: any[] = [];
  selectedCategoryId: string = '';
  public visibleAddTemplate = false;

  layoutTemplateSlides: any[] = [];
  templateCarouselSlides: any[] = [];
  templateCarouselSlideChunks: any[][] = [];
  allGroups: any[] = [];
  groupSearchText: string = '';
  selectedGroupIds: string[] = [];
  allClients: any[] = [];
  searchClientText: string = '';


  // Custom slider state
  currentSlideIndex = 0;
  cardsPerSlide = 2;

  selectedFontColor: string = '#000000';
  selectedTextColor = '#000000';
  selectedColor = '#1c1c1c';
  backgroundColor = '#5f00ba';

  selectedTemplateId: string | null = null;
  selectedClientIds: string[] = [];
  isSharing: boolean = false;



  googleFonts: { name: string; css: string }[] = [
    { name: 'Arial', css: "'Arial', sans-serif" },
    { name: 'Times New Roman', css: "'Times New Roman', serif" },
    { name: 'Courier New', css: "'Courier New', monospace" },
    { name: 'Roboto', css: "'Roboto', sans-serif" },
    { name: 'Open Sans', css: "'Open Sans', sans-serif" },
    { name: 'Lobster', css: "'Lobster', cursive" },
    { name: 'Poppins', css: "'Poppins', sans-serif" },
    { name: 'Montserrat', css: "'Montserrat', sans-serif" },
    { name: 'Playfair Display', css: "'Playfair Display', serif" },
    { name: 'Inconsolata', css: "'Inconsolata', monospace" },
    { name: 'Pacifico', css: "'Pacifico', cursive" },
    { name: 'Raleway', css: "'Raleway', sans-serif" },
    { name: 'Merriweather', css: "'Merriweather', serif" },
    { name: 'Nunito', css: "'Nunito', sans-serif" },
    { name: 'Oswald', css: "'Oswald', sans-serif" }
  ];

  selectedFont = this.googleFonts[0].css;

  setFont(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedFont = value;
  }

  toggleBold() {
    this.isBold = !this.isBold;
  }

  toggleItalic() {
    this.isItalic = !this.isItalic;
  }

  increaseFontSize() {
    this.fontSize += 1;
  }

  decreaseFontSize() {
    if (this.fontSize > 6) this.fontSize -= 1;
  }

  constructor(
    private categoriesService: MarketingCategoriesService,
    private templateService: Template2Service,
    private groupsService: GroupsService,
    private clientService: CrmService,
  ) { };

  slides: any[] = new Array(3).fill({ id: -1, src: '', title: '', subtitle: '' });

  ngOnInit(): void {
    this.slides[0] = {
      id: 0,
      src: './assets/img/slide.jpg',
      title: 'Default Template1',
      subtitle: 'Nulla vitae elit libero, a pharetra augue mollis interdum.'
    };
    this.slides[1] = {
      id: 1,
      src: './assets/img/slide.jpg',
      title: 'Default Template2',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    };
    this.slides[2] = {
      id: 2,
      src: './assets/img/slide.jpg',
      title: 'Default Template3',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };


    this.layoutTemplateSlides[0] = {
      id: 0,
      src: './assets/img/slide.jpg',
      title: 'Template 1',
      subtitle: 'Template'
    };
    this.layoutTemplateSlides[1] = {
      id: 1,
      src: './assets/img/slide.jpg',
      title: 'Template 2',
      subtitle: 'Template'
    };
    this.layoutTemplateSlides[2] = {
      id: 2,
      src: './assets/img/slide.jpg',
      title: 'Template 3',
      subtitle: 'Template'
    };

    this.getAllCategories();
    this.getAllTemplates();
    this.getAllGroups();
    this.getAllClients();
  }

  chunkArray(array: any[], size: number): any[][] {
    const result: any[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  // Handle image upload
  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.logoFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.logoDataUrl = reader.result as string;
      };
      reader.readAsDataURL(this.logoFile);
    }
  }

  toggleAddTemplateDemo() {
    this.visibleAddTemplate = !this.visibleAddTemplate;
  }

  handleAddTemplateDemoChange(event: any) {
    this.visibleAddTemplate = event;
  }

  toggleShareTempDemo(): void {
    this.visibleShareTemp = !this.visibleShareTemp;

    if (this.visibleShareTemp) {
      this.getAllClients();
      this.getAllGroups();
    }
  }

  handleShareTempDemoChange(event: any) {
    this.visibleShareTemp = event;
  }

  getAllCategories(): void {
    this.categoriesService.getAllCategoryService().subscribe({
      next: (res) => {
        this.allCategories = res.data || [];
      },
      error: (err) => {
        console.error("Error fetch all categories", err);
      }
    })
  }

  getAllTemplates(): void {
    this.templateService.getAllTemplatesService().subscribe({
      next: (res) => {
        this.allTemplates = Array.isArray(res.data?.templates) ? res.data.templates : [];
      },
      error: (err) => {
        console.error("Error fetching templates:", err);
      }
    });
  }

  // Custom Slider Methods
  getVisibleCards(): any[] {
    return this.layoutTemplateSlides.slice(this.currentSlideIndex, this.currentSlideIndex + this.cardsPerSlide);
  }

  nextSlide(): void {
    const nextIndex = this.currentSlideIndex + this.cardsPerSlide;
    if (nextIndex < this.layoutTemplateSlides.length) {
      this.currentSlideIndex = nextIndex;
    }
  }

  prevSlide(): void {
    const prevIndex = this.currentSlideIndex - this.cardsPerSlide;
    if (prevIndex >= 0) {
      this.currentSlideIndex = prevIndex;
    }
  }

  onTextColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedTextColor = input.value;
  }

  triggerColorPicker(): void {
    this.colorInput.nativeElement.click();
  }

  onColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedColor = input.value;
  }

  triggerBgColorPicker(): void {
    this.bgColorInput.nativeElement.click();
  }

  onBgColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.backgroundColor = input.value;
  }

  triggerTextColorPicker(): void {
    this.textColorInput.nativeElement.click();
  }

  ngAfterViewInit(): void {
    if (this.titleContent?.nativeElement) {
      this.titleContent.nativeElement.innerHTML = 'Title';
    }
    if (this.descContent?.nativeElement) {
      this.descContent.nativeElement.innerHTML = 'Description';
    }
  }

  saveTemplate() {
    setTimeout(() => {
      if (!this.titleContent || !this.descContent) {
        console.error('Missing DOM references');
        return;
      }

      const titleHtml = this.titleContent.nativeElement.innerHTML;
      const descHtml = this.descContent.nativeElement.innerHTML;

      const formData = new FormData();

      // Append file if selected
      if (this.logoFile) {
        formData.append('logo', this.logoFile);
      }

      // Append form fields (with proper type conversion)
      formData.append('titleHtml', titleHtml);
      formData.append('descHtml', descHtml);
      formData.append('titleFontFamily', this.selectedFont);
      formData.append('titleFontSize', this.fontSize.toString());
      formData.append('titleFontColor', this.selectedFontColor);
      formData.append('titleisBold', this.isBold.toString());
      formData.append('titleisItalic', this.isItalic.toString());
      formData.append('desFontColor', this.selectedTextColor);
      formData.append('backgroundColor', this.backgroundColor);

      if (this.selectedCategoryId) {
        formData.append('categoryId', this.selectedCategoryId);
      }

      this.templateService.createTemplateService(formData).subscribe({
        next: (res) => {
          this.getAllTemplates();
          this.toggleAddTemplateDemo();
          alert('Template added successfully!');

          // Reset all formatting and content
          this.logoFile = null;
          this.logoDataUrl = '';
          this.selectedFont = 'Arial';
          this.selectedFontColor = '#000000';
          this.selectedTextColor = '#000000';
          this.fontSize = 16;
          this.isBold = false;
          this.isItalic = false;
          this.backgroundColor = '#5f00ba';
          this.selectedCategoryId = '';
          this.titleText = 'Title';
          this.descText = 'Description';

          // Reset contenteditable content with plain text
          setTimeout(() => {
            if (this.titleContent?.nativeElement) {
              this.titleContent.nativeElement.innerHTML = 'Title';
            }
            if (this.descContent?.nativeElement) {
              this.descContent.nativeElement.innerHTML = 'Description';
            }
          });
        },
        error: (err) => {
          console.error('Save error:', err);
          alert('Failed to save template!');
        }
      });
    }, 0);
  }

  deleteTemplate(templateId: string): void {
    this.deletingTemplateId = templateId;

    this.templateService.deleteTemplateService(templateId).subscribe({
      next: (res) => {
        alert(res.message || "Template deleted successfully.");
        this.getAllTemplates();
        this.deletingTemplateId = null;
      },
      error: (err) => {
        console.error('Error deleting template:', err);
        this.deletingTemplateId = null;
      }
    });
  }

  // Get All Groups
  getAllGroups(): void {
    this.groupsService.getAllGroupsService().subscribe({
      next: (res) => {
        this.allGroups = res.data || [];
      },
      error: (err) => {
        console.error("Error fetch get all groups", err);
      }
    })
  };

  filteredGroups(): any[] {
    if (!this.groupSearchText) return this.allGroups;
    const lower = this.groupSearchText.toLowerCase();
    return this.allGroups.filter(group => group.groupName.toLowerCase().includes(lower));
  }

  onGroupCheckboxChange(event: any, group: any): void {
    if (event.target.checked) {
      this.selectedGroupIds.push(group._id);
    } else {
      this.selectedGroupIds = this.selectedGroupIds.filter(id => id !== group._id);
    }
  }

  // Get All Clients
  getAllClients(): void {
    this.clientService.getAllCRM().subscribe({
      next: (res) => {
        if (Array.isArray(res.data?.crms)) {
          this.allClients = res.data.crms;
        } else {
          console.warn("Expected array but got:", res.data?.crms);
          this.allClients = [];
        }
      },
      error: (err) => {
        console.error("Error fetching all clients", err);
      }
    });
  }

  filteredClients(): any[] {
    if (!this.searchClientText) return this.allClients;
    const lower = this.searchClientText.toLowerCase();
    return this.allClients.filter(client =>
      (client.name?.toLowerCase().includes(lower) || client.email?.toLowerCase().includes(lower))
    );
  }

  // Title Truncation
  titleStripAndTruncateHtml(html: string, wordLimit: number = 2): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.split(/\s+/).slice(0, wordLimit).join(' ') + '...';
  }

  // Description Truncation
  stripAndTruncateHtml(html: string, wordLimit: number = 2): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.split(/\s+/).slice(0, wordLimit).join(' ') + '...';
  }
  
  onClientCheckboxChange(event: any, clientId: string): void {
    if (event.target.checked) {
      this.selectedClientIds.push(clientId);
    } else {
      this.selectedClientIds = this.selectedClientIds.filter(id => id !== clientId);
    }
  }

  openShareTemplateModal(templateId: string): void {
    this.selectedTemplateId = templateId;
    this.selectedClientIds = [];
    this.toggleShareTempDemo();  
  }

  shareTemplateToSelectedClients(): void {
    if (!this.selectedTemplateId) {
      alert("Please select a template to share.");
      return;
    }

    this.isSharing = true;

    if (this.shareTab === 'client') {
      if (this.selectedClientIds.length === 0) {
        alert("Please select at least one client.");
        this.isSharing = false;
        return;
      }

      this.templateService.shareTemplateClitesService(this.selectedTemplateId, this.selectedClientIds).subscribe({
        next: (res) => {
          alert(res.message || "Template shared to clients successfully.");
          this.selectedClientIds = [];
          this.visibleShareTemp = false;
          this.isSharing = false;
        },
        error: (err) => {
          console.error("Error sharing template to clients:", err);
          alert("Failed to share template to clients.");
          this.isSharing = false;
        }
      });

    } else if (this.shareTab === 'group') {
      if (this.selectedGroupIds.length === 0) {
        alert("Please select at least one group.");
        this.isSharing = false;
        return;
      }

      this.templateService.shareTemplateGroupsService(this.selectedTemplateId, this.selectedGroupIds).subscribe({
        next: (res) => {
          alert(res.message || "Template shared to group clients successfully.");
          this.selectedGroupIds = [];
          this.visibleShareTemp = false;
          this.isSharing = false;
        },
        error: (err) => {
          console.error("Error sharing template to groups:", err);
          alert("Failed to share template to groups.");
          this.isSharing = false;
        }
      });
    }
  }

}