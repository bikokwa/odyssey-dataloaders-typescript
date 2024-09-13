import { RESTDataSource } from "@apollo/datasource-rest";
import DataLoader from "dataloader";
import { Listing, Amenity, CreateListingInput } from "../types";

export class ListingAPI extends RESTDataSource {
  baseURL = "https://rt-airlock-services-listing.herokuapp.com/";

  private batchAmenities = new DataLoader(
    async (listingIds): Promise<Amenity[][]> => {
      console.log("Making one batched call with ", listingIds);

      const amenitiesLists = await this.get<Amenity[][]>("amenities/listings", {
        params: {
          ids: listingIds.join(","),
        },
      });
      console.log(amenitiesLists);

      return amenitiesLists;
    }
  );

  getFeaturedListings(): Promise<Listing[]> {
    console.log("Calling for featured listings");
    return this.get<Listing[]>("featured-listings");
  }

  getListing(listingId: string): Promise<Listing> {
    return this.get<Listing>(`listings/${listingId}`);
  }

  getAmenities(listingId: string): Promise<Amenity[]> {
    // console.log("Making a follow-up call for amenities with ", listingId);
    console.log("Passing listing ID to the data loader ", listingId);
    // return this.get<Amenity[]>(`listings/${listingId}/amenities`);
    return this.batchAmenities.load(listingId);
  }

  createListing(listing: CreateListingInput): Promise<Listing> {
    return this.post("listings", {
      body: {
        listing,
      },
    });
  }
}
