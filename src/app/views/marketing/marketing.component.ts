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


  isBold = false;
  isItalic = false;
  fontSize = 18;

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
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.logoDataUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
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
        this.allTemplates = res.data || [];

        // Split fetched templates into carousel chunks
        this.templateCarouselSlideChunks = this.chunkArray(this.allTemplates, 3);
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


  saveTemplateToDb() {
    setTimeout(() => {
      if (!this.titleContent || !this.descContent) {
        console.error('Missing DOM references');
        return;
      }

      const titleHtml = this.titleContent.nativeElement.innerHTML;
      const descHtml = this.descContent.nativeElement.innerHTML;

      const payload = {
        logo: this.logoDataUrl,
        titleHtml,
        descHtml,
        fontFamily: this.selectedFont,
        fontSize: this.fontSize,
        fontColor: this.selectedFontColor,
        fontWeight: this.isBold ? 'bold' : 'normal',
        fontStyle: this.isItalic ? 'italic' : 'normal',
        backgroundColor: this.backgroundColor,
        textColor: this.selectedTextColor,
      };

      this.templateService.createTemplateService(payload).subscribe({
        next: (res) => {
          this.getAllTemplates();
          this.toggleAddTemplateDemo();
          alert('Template added successfully!');
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
        console.log('Template deleted successfully:', res);
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
        console.log("All groups: ", this.allGroups );
      },
      error: (err) => {
        console.error("Error fetch get all groups", err );
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
        this.allClients = res.data?.crms || [];
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
  
  


}
