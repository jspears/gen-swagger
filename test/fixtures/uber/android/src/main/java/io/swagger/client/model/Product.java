/**
 * Uber API
 * Move your app forward with the Uber API
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.swagger.client.model;


import io.swagger.annotations.*;
import com.google.gson.annotations.SerializedName;


@ApiModel(description = "")
public class Product  {
  
  @SerializedName("product_id")
  private String productId = null;
  @SerializedName("description")
  private String description = null;
  @SerializedName("display_name")
  private String displayName = null;
  @SerializedName("capacity")
  private String capacity = null;
  @SerializedName("image")
  private String image = null;

  /**
   * Unique identifier representing a specific product for a given latitude & longitude. For example, uberX in San Francisco will have a different product_id than uberX in Los Angeles.
   **/
  @ApiModelProperty(value = "Unique identifier representing a specific product for a given latitude & longitude. For example, uberX in San Francisco will have a different product_id than uberX in Los Angeles.")
  public String getProductId() {
    return productId;
  }
  public void setProductId(String productId) {
    this.productId = productId;
  }

  /**
   * Description of product.
   **/
  @ApiModelProperty(value = "Description of product.")
  public String getDescription() {
    return description;
  }
  public void setDescription(String description) {
    this.description = description;
  }

  /**
   * Display name of product.
   **/
  @ApiModelProperty(value = "Display name of product.")
  public String getDisplayName() {
    return displayName;
  }
  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  /**
   * Capacity of product. For example, 4 people.
   **/
  @ApiModelProperty(value = "Capacity of product. For example, 4 people.")
  public String getCapacity() {
    return capacity;
  }
  public void setCapacity(String capacity) {
    this.capacity = capacity;
  }

  /**
   * Image URL representing the product.
   **/
  @ApiModelProperty(value = "Image URL representing the product.")
  public String getImage() {
    return image;
  }
  public void setImage(String image) {
    this.image = image;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Product product = (Product) o;
    return (productId == null ? product.productId == null : productId.equals(product.productId)) &&
        (description == null ? product.description == null : description.equals(product.description)) &&
        (displayName == null ? product.displayName == null : displayName.equals(product.displayName)) &&
        (capacity == null ? product.capacity == null : capacity.equals(product.capacity)) &&
        (image == null ? product.image == null : image.equals(product.image));
  }

  @Override
  public int hashCode() {
    int result = 17;
    result = 31 * result + (productId == null ? 0: productId.hashCode());
    result = 31 * result + (description == null ? 0: description.hashCode());
    result = 31 * result + (displayName == null ? 0: displayName.hashCode());
    result = 31 * result + (capacity == null ? 0: capacity.hashCode());
    result = 31 * result + (image == null ? 0: image.hashCode());
    return result;
  }

  @Override
  public String toString()  {
    StringBuilder sb = new StringBuilder();
    sb.append("class Product {\n");
    
    sb.append("  productId: ").append(productId).append("\n");
    sb.append("  description: ").append(description).append("\n");
    sb.append("  displayName: ").append(displayName).append("\n");
    sb.append("  capacity: ").append(capacity).append("\n");
    sb.append("  image: ").append(image).append("\n");
    sb.append("}\n");
    return sb.toString();
  }
}
