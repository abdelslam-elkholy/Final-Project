import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HousesComponent } from "./Components/houses/houses.component";
import { AddHouseComponent } from "./Components/add-house/add-house.component";
import { CategoriesComponent } from "./Components/categories/categories.component";
import { AddCategoryComponent } from "./Components/add-category/add-category.component";
import { UsersComponent } from "./Components/users/users.component";
import { ReservationsComponent } from "./Components/reservations/reservations.component";
import { TeamComponent } from "./Components/team/team.component";
import { SignInComponent } from "./Components/sign-in/sign-in.component";
import { AdminGuard } from "./Guards/admin.guard";
import { HouseDetailsComponent } from "./Components/house-details/house-details.component";
import { ReportsComponent } from "./Components/reports/reports.component";

const routes: Routes = [
  { path: "signin", component: SignInComponent, data: { title: "Login" } },

  {
    path: "home",
    component: ReportsComponent,
    data: { title: "Home Page" },
  },
  {
    path: "reports",
    component: ReportsComponent,
    data: { title: "Reports Page" },
  },
  {
    path: "houses",
    component: HousesComponent,
    data: { title: "Houses Page" },
  },
  {
    path: "add-house/:id",
    component: AddHouseComponent,
    data: { title: "Add House" },
  },
  {
    path: "categories",
    component: CategoriesComponent,
    data: { title: "Categories Page" },
  },
  {
    path: "add-category/:id",
    component: AddCategoryComponent,
    data: { title: "Add Category" },
  },
  {
    path: "users",
    component: UsersComponent,
    data: { title: "Users Page" },
  },
  {
    path: "reservations",
    component: ReservationsComponent,
    data: { title: "Reservations Page" },
  },
  {
    path: "team",
    component: TeamComponent,
    data: { title: "Team Page" },
  },

  { path: "house-details/:id", component: HouseDetailsComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", redirectTo: "/home", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
