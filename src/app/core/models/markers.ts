import { LatLngExpression } from "leaflet";

export class Marker {
  id!: number;
  name!: string;
  description!: string;
  position!: LatLngExpression;
}

