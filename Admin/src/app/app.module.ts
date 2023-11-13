import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { HousesComponent } from "./Components/houses/houses.component";
import { ReservationsComponent } from "./Components/reservations/reservations.component";
import { UsersComponent } from "./Components/users/users.component";
import { AddHouseComponent } from "./Components/add-house/add-house.component";
import { CategoriesComponent } from "./Components/categories/categories.component";
import { AddCategoryComponent } from "./Components/add-category/add-category.component";
import { NavigationComponent } from "./Components/navigation/navigation.component";
import { TeamComponent } from "./Components/team/team.component";
import { SignInComponent } from "./Components/sign-in/sign-in.component";
import { AuthInterceptor } from "./Interceptors/auth.interceptor";
import { HouseDetailsComponent } from "./Components/house-details/house-details.component";
import { ReportsComponent } from "./Components/reports/reports.component";
import { FusionChartsModule } from "angular-fusioncharts";
import * as FusionCharts from "fusioncharts";
import * as Charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";

FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);

@NgModule({
  declarations: [
    AppComponent,
    HousesComponent,
    ReservationsComponent,
    UsersComponent,
    AddHouseComponent,
    CategoriesComponent,
    AddCategoryComponent,
    NavigationComponent,
    TeamComponent,
    SignInComponent,
    HouseDetailsComponent,
    ReportsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    LeafletModule,
    FusionChartsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
