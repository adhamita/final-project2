import { Component, OnInit } from '@angular/core';
import { categoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/proudct.service';
import { Router } from '@angular/router';
import { Category, product } from '../../core/models/data.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catagories',
  imports: [CommonModule],
  templateUrl: './catagories.component.html',
  styleUrl: './catagories.component.css'
})
export class CatagoriesComponent implements OnInit {
isLoading = false;
 products:product[] = [];
  categories:Category[] = [];
  shuffledCategories:Category[] = [];

  // Method to create a new random shuffle
  reshuffleCategories(): void {
    this.shuffledCategories = this.shuffleArray(this.categories);
  }

constructor(private productService: ProductService, private categoryService: categoryService ,private router : Router) {

}

ngOnInit(): void {
    this.getCategories();
}

getCategories(){
  this.isLoading = true;
  this.categoryService.getCategories().subscribe({
    next : (response)=>{
      this.isLoading = false;
      this.categories = response.data;
      this.reshuffleCategories(); // Shuffle only once when data loads
    },
    error: (error) => {
      this.isLoading = false;
      console.error(error);
    }

  })
}

// Method to shuffle array randomly
shuffleArray(array: Category[]): Category[] {
  const shuffled = [...array]; // Create a copy to avoid mutating original array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
 
}
