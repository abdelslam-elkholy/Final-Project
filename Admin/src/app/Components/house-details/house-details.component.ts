import { ReservationsService } from "./../../Services/reservations.service";
import { Component, OnInit } from "@angular/core";
import { IHouse } from "../../Models/IHouse";
import { HousesService } from "../../Services/houses.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IReservation } from "src/app/Models/IReservation";

@Component({
  selector: "app-house-details",
  templateUrl: "./house-details.component.html",
  styleUrls: ["./house-details.component.css"],
})
export class HouseDetailsComponent implements OnInit {
  currentHouse: IHouse = {
    _id: "",
    name: "",
    address: "",
    region: "",
    price: 0,
    currencySymbol: "",
    numberOfRooms: 0,
    numberOfBedrooms: 0,
    guestNumber: 0,
    rate: 0,
    description: "",
    reviews: "",
    images: [],
    category: "",
    userId: "",
    lat: 0,
    lng: 0,
    updatedAt: new Date(),
  };

  reservations: IReservation[] = [];

  constructor(
    private houseService: HousesService,
    private reservationsService: ReservationsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.paramMap.subscribe((params) => {
      this.ngOnInit();
    });
  }
  ngOnInit(): void {
    const houseId = this.route.snapshot.paramMap.get("id");
    if (!houseId) {
      this.router.navigate(["home"]);
    } else {
      this.houseService.getHouseById(houseId).subscribe((house: IHouse) => {
        this.currentHouse = house;
        console.log(this.currentHouse);
      });
    }
    this.reservationsService
      .getReservationsByHouseId(houseId!)
      .subscribe((reservations: IReservation[]) => {
        this.reservations = reservations;
        console.log(this.reservations);
      });
  }

  options: object = { year: "numeric", month: "long", day: "numeric" };

  formattedDate(inputDateString: Date): string {
    const inputDate = new Date(inputDateString);

    return inputDate.toLocaleDateString("en-US", this.options);
  }
}
