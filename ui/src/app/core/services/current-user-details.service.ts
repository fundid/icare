import { Injectable } from "@angular/core";
import { from, Observable, of, zip } from "rxjs";
import { flatten } from "lodash";
import { catchError, expand, map, reduce, takeWhile } from "rxjs/operators";
import { BASE_URL } from "src/app/shared/constants/constants.constants";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { Api } from "src/app/shared/resources/openmrs";
import { ProviderAttributeModel } from "src/app/modules/maintenance/models/provider-attribute.model";

@Injectable({
  providedIn: "root",
})
export class CurrentUserService {
  constructor(private httpClient: OpenmrsHttpClientService, private api: Api) {}

  get(uuid: string): Observable<any> {
    return this.httpClient.get(`user/${uuid}`);
  }

  getProviderByUserDetails(userUuid: string): Observable<any> {
    return this.httpClient
      .get(
        `provider?user=${userUuid}&v=custom:(uuid,display,person:(uuid,display))`
      )
      .pipe(
        map((response) =>
          response?.results[0]
            ? {
                ...response?.results[0],
                signature:
                  response?.results[0]?.attributes?.length > 0
                    ? (
                        response?.results[0]?.attributes.filter(
                          (attribute) =>
                            attribute?.attributeType?.uuid ===
                            "ecc4e84e-823c-4a1e-94dc-c349b9c64cca"
                        ) || []
                      )?.length > 0
                      ? (response?.results[0]?.attributes.filter(
                          (attribute) =>
                            attribute?.attributeType?.uuid ===
                            "ecc4e84e-823c-4a1e-94dc-c349b9c64cca"
                        ) || [])[0]?.value
                      : null
                    : null,
              }
            : {}
        ),
        catchError((error) => of(error))
      );
  }

  getSessionDetails(): Observable<any> {
    return this.httpClient.get("session");
  }

  createProviderAttribute(parentUuid: string, data: any): Observable<any> {
    return from(
      this.api.provider.createProviderAttribute(parentUuid, data)
    ).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getRolesDetails(): Observable<any> {
    const pageSize = 100;

    return this.fetchRolesPage(0, pageSize).pipe(
      expand((response: any) => {
        // Check if there are more results to fetch
        const hasMoreResults =
          response.results && response.results.length === pageSize;
        return hasMoreResults
          ? this.fetchRolesPage(response.nextStartIndex, pageSize)
          : of({ results: [], nextStartIndex: 0, done: true });
      }),
      takeWhile((response: any) => !response.done, true),
      reduce((acc: any[], response: any) => {
        return [...acc, ...response.results];
      }, [])
    );
  }

  private fetchRolesPage(startIndex: number, limit: number): Observable<any> {
    return this.httpClient
      .get(
        `role?startIndex=${startIndex}&limit=${limit}&v=custom:(uuid,name,privileges:(uuid,name))`
      )
      .pipe(
        map((response) => {
          return {
            results: response?.results || [],
            nextStartIndex: startIndex + limit,
            done: false,
          };
        }),
        catchError((error) =>
          of({ results: [], nextStartIndex: 0, done: true })
        )
      );
  }

  getProviderAttributes(): Observable<ProviderAttributeModel[]> {
    return this.httpClient.get("providerattributetype").pipe(
      map((response) => {
        const attributes = response?.results;
        return attributes.map((attribute) => {
          return {
            uuid: attribute?.uuid,
            name: attribute?.display,
          };
        });
      })
    );
  }
}
