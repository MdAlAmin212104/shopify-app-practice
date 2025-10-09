// all products date fetching


export const All_Products_Count = `
#graphql
    query {
        productsCount(query: "id:>=1000") {
            count
        }
    }
`;


export const All_Products = `
#graphql
    query GetProducts {
        products(first: 10) {
            nodes {
            id
            title
            }
        }
    }
`;



export const Customers_List = `
#graphql
    query CustomerCount {
        customersCount {
            count
        }
    }
`