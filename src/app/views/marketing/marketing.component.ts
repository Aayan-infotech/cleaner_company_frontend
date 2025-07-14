import { Component, ViewChild, ElementRef } from '@angular/core';
import { MarketingCategoriesService } from '../../services/marketing-categories.service';
import { Template2Service } from '../../services/template2.service';

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


  selectedFont = "'Arial', sans-serif";
  isBold = false;
  isItalic = false;
  fontSize = 18;

  setFont(event: any) {
    this.selectedFont = event.target.value;
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
        console.log("Templates fetched:", this.allTemplates);
  
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
        },
        error: (err) => {
          console.error('Save error:', err);
        }
      });
    }, 0);
  }


  deleteTemplate(templateId: string): void {
    this.templateService.deleteTemplateService(templateId).subscribe({
      next: (res) => {
        console.log('Template deleted successfully:', res);
        this.getAllTemplates();
      },
      error: (err) => {
        console.error('Error deleting template:', err);
      }
    }); 
  }
  
  
  


}
