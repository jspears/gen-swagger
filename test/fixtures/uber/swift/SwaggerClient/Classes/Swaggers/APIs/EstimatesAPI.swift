//
// EstimatesAPI.swift
//
// Generated by swagger-codegen
// https://github.com/swagger-api/swagger-codegen
//

import Alamofire



public class EstimatesAPI: APIBase {
    /**
     Price Estimates
     
     - parameter startLatitude: (query) Latitude component of start location. 
     - parameter startLongitude: (query) Longitude component of start location. 
     - parameter endLatitude: (query) Latitude component of end location. 
     - parameter endLongitude: (query) Longitude component of end location. 
     - parameter completion: completion handler to receive the data and the error objects
     */
    public class func estimatesPriceGet(startLatitude startLatitude: Double, startLongitude: Double, endLatitude: Double, endLongitude: Double, completion: ((data: [PriceEstimate]?, error: ErrorType?) -> Void)) {
        estimatesPriceGetWithRequestBuilder(startLatitude: startLatitude, startLongitude: startLongitude, endLatitude: endLatitude, endLongitude: endLongitude).execute { (response, error) -> Void in
            completion(data: response?.body, error: error);
        }
    }


    /**
     Price Estimates
     - GET /estimates/price
     - The Price Estimates endpoint returns an estimated price range for each product offered at a given location. The price estimate is provided as a formatted string with the full price range and the localized currency symbol.<br><br>The response also includes low and high estimates, and the [ISO 4217](http://en.wikipedia.org/wiki/ISO_4217) currency code for situations requiring currency conversion. When surge is active for a particular product, its surge_multiplier will be greater than 1, but the price estimate already factors in this multiplier.
     - examples: [{contentType=application/json, example=[ {
  "high_estimate" : 1.3579000000000001069366817318950779736042022705078125,
  "product_id" : "aeiou",
  "low_estimate" : 1.3579000000000001069366817318950779736042022705078125,
  "surge_multiplier" : 1.3579000000000001069366817318950779736042022705078125,
  "estimate" : "aeiou",
  "display_name" : "aeiou",
  "currency_code" : "aeiou"
} ]}]
     
     - parameter startLatitude: (query) Latitude component of start location. 
     - parameter startLongitude: (query) Longitude component of start location. 
     - parameter endLatitude: (query) Latitude component of end location. 
     - parameter endLongitude: (query) Longitude component of end location. 

     - returns: RequestBuilder<[PriceEstimate]> 
     */
    public class func estimatesPriceGetWithRequestBuilder(startLatitude startLatitude: Double, startLongitude: Double, endLatitude: Double, endLongitude: Double) -> RequestBuilder<[PriceEstimate]> {
        let path = "/estimates/price"
        let URLString = SwaggerClientAPI.basePath + path

        let nillableParameters: [String:AnyObject?] = [
            "start_latitude": startLatitude,
            "start_longitude": startLongitude,
            "end_latitude": endLatitude,
            "end_longitude": endLongitude
        ]
 
        let parameters = APIHelper.rejectNil(nillableParameters)
 
        let convertedParameters = APIHelper.convertBoolToString(parameters)
 
        let requestBuilder: RequestBuilder<[PriceEstimate]>.Type = SwaggerClientAPI.requestBuilderFactory.getBuilder()

        return requestBuilder.init(method: "GET", URLString: URLString, parameters: convertedParameters, isBody: false)
    }

    /**
     Time Estimates
     
     - parameter startLatitude: (query) Latitude component of start location. 
     - parameter startLongitude: (query) Longitude component of start location. 
     - parameter customerUuid: (query) Unique customer identifier to be used for experience customization. (optional)
     - parameter productId: (query) Unique identifier representing a specific product for a given latitude &amp; longitude. (optional)
     - parameter completion: completion handler to receive the data and the error objects
     */
    public class func estimatesTimeGet(startLatitude startLatitude: Double, startLongitude: Double, customerUuid: NSUUID? = nil, productId: String? = nil, completion: ((data: [Product]?, error: ErrorType?) -> Void)) {
        estimatesTimeGetWithRequestBuilder(startLatitude: startLatitude, startLongitude: startLongitude, customerUuid: customerUuid, productId: productId).execute { (response, error) -> Void in
            completion(data: response?.body, error: error);
        }
    }


    /**
     Time Estimates
     - GET /estimates/time
     - The Time Estimates endpoint returns ETAs for all products offered at a given location, with the responses expressed as integers in seconds. We recommend that this endpoint be called every minute to provide the most accurate, up-to-date ETAs.
     - examples: [{contentType=application/json, example=[ {
  "image" : "aeiou",
  "product_id" : "aeiou",
  "description" : "aeiou",
  "display_name" : "aeiou",
  "capacity" : "aeiou"
} ]}]
     
     - parameter startLatitude: (query) Latitude component of start location. 
     - parameter startLongitude: (query) Longitude component of start location. 
     - parameter customerUuid: (query) Unique customer identifier to be used for experience customization. (optional)
     - parameter productId: (query) Unique identifier representing a specific product for a given latitude &amp; longitude. (optional)

     - returns: RequestBuilder<[Product]> 
     */
    public class func estimatesTimeGetWithRequestBuilder(startLatitude startLatitude: Double, startLongitude: Double, customerUuid: NSUUID? = nil, productId: String? = nil) -> RequestBuilder<[Product]> {
        let path = "/estimates/time"
        let URLString = SwaggerClientAPI.basePath + path

        let nillableParameters: [String:AnyObject?] = [
            "start_latitude": startLatitude,
            "start_longitude": startLongitude,
            "customer_uuid": customerUuid,
            "product_id": productId
        ]
 
        let parameters = APIHelper.rejectNil(nillableParameters)
 
        let convertedParameters = APIHelper.convertBoolToString(parameters)
 
        let requestBuilder: RequestBuilder<[Product]>.Type = SwaggerClientAPI.requestBuilderFactory.getBuilder()

        return requestBuilder.init(method: "GET", URLString: URLString, parameters: convertedParameters, isBody: false)
    }

}
