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

  allCategories: any[] = [];
  selectedCategoryId: string = '';
  public visibleAddTemplate = false;

  layoutTemplateSlides: any[] = [];
  templateCarouselSlides: any[] = [];
  templateCarouselSlideChunks: any[][] = [];

  // Custom slider state
  currentSlideIndex = 0;
  cardsPerSlide = 2;

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

}
