import { useState } from "react";
import { All_Products_Count, All_Products, Customers_List } from "app/graphql/graphql";
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { authenticate } from "app/shopify.server";



export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  try {
    // 🟢 Fetch total product count
    const productsCountResponse = await admin.graphql(All_Products_Count);
    const productsCountData = await productsCountResponse.json();

    // 🟢 Fetch all products
    const allProductsResponse = await admin.graphql(All_Products);
    const allProductsData = await allProductsResponse.json();


	const CustomerList = await admin.graphql(Customers_List);
	const CustomerListData = await CustomerList.json();

    // ✅ Return both product count and product list
    return {
		productCount: productsCountData?.data?.productsCount?.count || 0,
		products: allProductsData?.data?.products?.nodes || [],
		CustomerListData: CustomerListData?.data?.customersCount?.count || 0,
    };
  } catch (error) {
    console.error("❌ Loader Error:", error);
    return {
      productCount: 0,
      products: [],
      error: "Failed to load product data.",
    };
  }
};


export default function AdditionalPage() {
	const loaderData = useLoaderData();
	const productCount = loaderData;
	const [textValue, setTextValue] = useState('');
	const [numberValue, setNumberValue] = useState('');

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('submit', { textValue, numberValue });
	}


	console.log(productCount);

	return (
		<s-page heading="A page with additional components">

			<s-section padding="base" heading="Details" >
				<form onSubmit={handleSubmit}>
					<s-text-field label="Title" name="my-text"
						value={textValue}
						onChange={(e) => setTextValue((e.target as HTMLInputElement).value)}></s-text-field>
					<s-text-area label="Description"
						name="my-number"
						value={numberValue}
						onChange={(e) => setNumberValue((e.target as HTMLTextAreaElement).value)} />

					<div style={{ marginTop: '1rem' }}>
						<s-button type="submit">Submit</s-button>
					</div>
				</form>
			</s-section>
			<s-section heading="Status" slot="aside">
				<s-button command="--show" commandFor="modal-1" >Open Modal</s-button>
				<s-modal id="modal-1" heading="Return Policy">
					<s-paragraph>
						We have a 30-day return policy, which means you have 30 days after receiving
						your item to request a return.
					</s-paragraph>
					<s-paragraph>
						To be eligible for a return, your item must be in the same condition that
						you received it, unworn or unused, with tags, and in its original packaging.
						You’ll also need the receipt or proof of purchase.
					</s-paragraph>
					<s-button
						variant="primary"
						command="--hide"
						commandFor="modal-1"
						slot="primary-action"
					>
						Close
					</s-button>
				</s-modal>

				<div style={{ marginTop: '1rem' }}>
					<s-select label="Status" name="status" >
						<s-option value="active">Active</s-option>
						<s-option value="draft">Draft</s-option>
					</s-select>
				</div>


			</s-section>

			<s-section heading="Actions">
				<div style={{ display: 'flex', gap: '0.5rem' }}>
					<s-button variant="primary">Save</s-button>
					<s-button variant="secondary">Cancel</s-button>
				</div>
			</s-section >


			<s-section>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						height: "100%",
						textAlign: "center",
					}}
				>
					<s-tooltip id="bold-tooltip">Bold</s-tooltip>
					<s-button interestFor="bold-tooltip" accessibilityLabel="Bold">B</s-button>
				</div>
			</s-section>

		</s-page>
	)
}
