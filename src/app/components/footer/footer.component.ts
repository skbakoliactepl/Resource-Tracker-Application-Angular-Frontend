import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from "@progress/kendo-angular-grid";
toolbar

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, GridModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
