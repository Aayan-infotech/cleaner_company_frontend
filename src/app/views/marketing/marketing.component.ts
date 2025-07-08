import { Component, ViewChild, ElementRef } from '@angular/core';
import { MarketingCategoriesService } from '../../services/marketing-categories.service';
import { TemplateService } from '../../services/template.service';

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
    private templateService: TemplateService,
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

    this.templateCarouselSlides = [
      { id: 0, title: 'Template A', subtitle: 'Description A' },
      { id: 1, title: 'Template B', subtitle: 'Description B' },
      { id: 2, title: 'Template C', subtitle: 'Description C' },
      { id: 3, title: 'Template D', subtitle: 'Description D' },
      { id: 4, title: 'Template E', subtitle: 'Description E' },
      { id: 5, title: 'Template F', subtitle: 'Description F' }
    ];

    this.templateCarouselSlideChunks = this.chunkArray(this.templateCarouselSlides, 3);

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

  getAllTemplates(): void { }

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


  saveStyledTemplate() {
    setTimeout(() => {
      if (!this.titleContent || !this.descContent || !this.previewContainer) {
        console.error('Missing one or more DOM references.');
        return;
      }
  
      const titleHtml = this.titleContent.nativeElement.innerHTML;
      const descHtml = this.descContent.nativeElement.innerHTML;
  
      const htmlContent = `
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 0;
                background-color: #f8f9fa;
                font-family: ${this.selectedFont};
              }
  
              .template-wrapper {
                max-width: 500px;
                margin: 2rem auto;
                background-color: ${this.backgroundColor};
                padding: 1rem;
                border-radius: 8px;
                text-align: center;
              }
  
              .top-white-box {
                width: 150px;
                height: 180px;
                background-color: white;
                margin: 0 auto 1rem auto;
                display: flex;
                align-items: center;
                justify-content: center;
              }
  
              .top-white-box img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border: 1px solid white;
              }
  
              .title-block {
                background-color: white;
                color: ${this.selectedFontColor};
                font-family: ${this.selectedFont};
                font-weight: ${this.isBold ? 'bold' : 'normal'};
                font-style: ${this.isItalic ? 'italic' : 'normal'};
                font-size: ${this.fontSize}px;
                padding: 0.5rem 0;
                margin-bottom: 0.5rem;
              }
  
              .desc-block {
                background-color: white;
                min-height: 280px;
                padding: 1rem;
                color: ${this.selectedTextColor};
                font-size: 14px;
                font-family: ${this.selectedFont};
                text-align: left;
              }
            </style>
          </head>
          <body>
            <div class="template-wrapper">
              <div class="top-white-box">
                ${
                  this.logoDataUrl
                    ? `<img src="${this.logoDataUrl}" alt="Logo" />`
                    : 'Logo'
                }
              </div>
  
              <div class="title-block">
                ${titleHtml}
              </div>
  
              <div class="desc-block">
                ${descHtml}
              </div>
            </div>
          </body>
        </html>
      `;
  
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'styled-template.html';
      link.click();
    }, 0);
  }


}
