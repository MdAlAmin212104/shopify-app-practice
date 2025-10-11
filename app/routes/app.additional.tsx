import { useState } from "react";
import { All_Products_Count, All_Products, Customers_List, Product_Details } from "app/graphql/graphql";
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { authenticate } from "app/shopify.server";
import { Product } from "@shopify/app-bridge-react";



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


		// 🟢 Fetch single product details
		const singleProductResponse = await admin.graphql(Product_Details, {
			variables: {
				ownerId: "gid://shopify/Product/8089192595490",
			},
		});
		const singleProductData = await singleProductResponse.json();

		// ✅ Return both product count and product list
		return {
			productCount: productsCountData?.data?.productsCount?.count || 0,
			products: allProductsData?.data?.products?.nodes || [],
			CustomerListData: CustomerListData?.data?.customersCount?.count || 0,
			singleProduct: singleProductData?.data?.product || null,
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
				<s-modal id="modal-1" heading="Products" size="large">
					<s-section padding="none" accessibilityLabel="Products table section">
						<s-table>
							<s-grid slot="filters" gap="small-200" gridTemplateColumns="1fr auto">
								<s-text-field
									icon="search"
									placeholder="Searching all Products"
								></s-text-field>
							</s-grid>
							<s-table-header-row>
								<s-table-header listSlot="primary">Title</s-table-header>
								<s-table-header format="numeric">Pieces</s-table-header>
								<s-table-header>Created</s-table-header>
								<s-table-header listSlot="secondary">Status</s-table-header>
							</s-table-header-row>
							<s-table-body>
								{productCount.products.map((product: any) => (
									<s-table-row key={product.id} clickDelegate={`${product.id}-checkbox`}>
										<s-table-cell>
											<s-stack direction="inline" gap="small" alignItems="center">
												<s-checkbox id={`${product.id}-checkbox`}></s-checkbox>
												<s-clickable border="base" borderRadius="base" inlineSize="40px" blockSize="40px">
													<s-image
														objectFit="cover"
														src={product.featuredMedia?.preview?.image?.url || "https://picsum.photos/80"}
													></s-image>
												</s-clickable>
												<s-link>{product.title}</s-link>
											</s-stack>
										</s-table-cell>
										<s-table-cell>{product.variants?.length}</s-table-cell>
										<s-table-cell>{new Date(product.createdAt).toDateString()}</s-table-cell>
										<s-table-cell>
											{ product.status === "DRAFT" ? (
												<s-badge color="base" tone="info">
													{product.status || "Draft"}
												</s-badge>
											) : (
												<s-badge color="base" tone="success">
												{product.status || "Active"}
											</s-badge>)}
										</s-table-cell>
									</s-table-row>
								))}
							</s-table-body>
						</s-table>
					</s-section>

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
