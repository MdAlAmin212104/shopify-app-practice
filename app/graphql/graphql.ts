// all products date fetching


export const All_Products_Count = `#graphql
    query {
        productsCount(query: "id:>=1000") {
            count
        }
    }
`;


export const All_Products = `#graphql
    query GetProducts {
        products(first: 10) {
            nodes {
            id
            title
            }
        }
    }
`;



export const Customers_List = `#graphql
    query CustomerCount {
        customersCount {
            count
        }
    }
`



export const Product_Details = `#graphql
  query ProductMetafields($ownerId: ID!) {
    product(id: $ownerId) {
      id
      title
      descriptionHtml
      metafields(first: 10) {
        edges {
          node {
            namespace
            key
            value
          }
        }
      }
    }
  }
`;



// product create mutation 

export const Create_Product = `#graphql
mutation populateProduct($product: ProductCreateInput!) {
    productCreate(product: $product) {
        product {
        id
        title
        handle
        status
        variants(first: 10) {
            edges {
            node {
                id
                price
                barcode
                createdAt
            }
            }
        }
        }
    }
}`;



// product variant update mutation

export const Update_Product_Variant = `#graphql
mutation shopifyReactRouterTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
            id
            price
            barcode
            createdAt
        }
    }
}`;