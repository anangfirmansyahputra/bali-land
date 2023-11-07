interface GeometryCoordinates {
  type: string;
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  coordinates: any[][];
}

export interface BadungDistrictTypes {
  id: string;
  type: "Feature";
  country: string;
  province: string;
  regency: string;
  village: string;
  geometry: GeometryCoordinates;
}