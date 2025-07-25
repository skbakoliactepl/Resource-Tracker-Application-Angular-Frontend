import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { NotificationModule } from '@progress/kendo-angular-notification';
import {
  KENDO_INDICATORS,
  LoaderType,
  LoaderThemeColor,
  LoaderSize,
} from "@progress/kendo-angular-indicators";
import { LoaderServiceService } from './services/loader-service.service';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NotificationModule, KENDO_INDICATORS, CommonModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-practice';
  loading$ = this.loaderService.loading$;

  constructor(private loaderService: LoaderServiceService, private cdr: ChangeDetectorRef) {
    console.log("Is Production: ", environment.production);
    console.log("API URI: ", environment.apiBaseUrl);
  }


  ngAfterViewInit(): void {
    // Force recheck after first view is rendered
    this.loading$.subscribe(() => {
      this.cdr.detectChanges();
    });
  };
}
