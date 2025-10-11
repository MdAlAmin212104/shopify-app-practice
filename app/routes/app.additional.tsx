import { useState, useEffect } from "react";
import { All_Products_Count, All_Products, Customers_List, Product_Details, Search_Products } from "app/graphql/graphql";
import { LoaderFunctionArgs, useLoaderData, useNavigate, useSearchParams } from "react-router";
import { authenticate } from "app/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { admin } = await authenticate.admin(request);
	const url = new URL(request.url);
	const search = url.searchParams.get('search') || '';

	try {
		// 🟢 Fetch total product count
		const productsCountResponse = await admin.graphql(All_Products_Count);
		const productsCountData = await productsCountResponse.json();

		// 🟢 Fetch products (all or searched)
		let productsResponse;
		if (search.trim()) {
			productsResponse = await admin.graphql(Search_Products, {
				variables: { query: `title:*${search}*` }
			});
		} else {
			productsResponse = await admin.graphql(All_Products);
		}
		const productsData = await productsResponse.json();

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
			products: productsData?.data?.products?.nodes || [],
			CustomerListData: CustomerListData?.data?.customersCount?.count || 0,
			singleProduct: singleProductData?.data?.product || null,
			searchTerm: search,
		};
	} catch (error) {
		console.error("❌ Loader Error:", error);
		return {
			productCount: 0,
			products: [],
			CustomerListData: 0,
			singleProduct: null,
			searchTerm: '',
			error: "Failed to load product data.",
		};
	}
};

export default function AdditionalPage() {
	const loaderData = useLoaderData<typeof loader>();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	
	const [textValue, setTextValue] = useState('');
	const [numberValue, setNumberValue] = useState('');
	const [searchTerm, setSearchTerm] = useState(loaderData.searchTerm || '');
	const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

	// Debounce search input for better UX
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchTerm);
		}, 0);

		return () => clearTimeout(timer);
	}, [searchTerm]);

	// Update URL when debounced search changes
	useEffect(() => {
		const params = new URLSearchParams(searchParams);
		
		if (debouncedSearch.trim()) {
			params.set('search', debouncedSearch);
		} else {
			params.delete('search');
		}
		
		navigate(`?${params.toString()}`, { replace: true });
	}, [debouncedSearch, navigate]);

	// Sync search term with URL on mount
	useEffect(() => {
		const urlSearch = searchParams.get('search');
		if (urlSearch !== null && urlSearch !== searchTerm) {
			setSearchTerm(urlSearch);
		}
	}, []);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('submit', { textValue, numberValue });
	};

	const handleSearchClear = () => {
		setSearchTerm('');
	};

	const products = loaderData.products;
	const isSearching = searchTerm.trim() !== '';

	console.log(loaderData);

	return (
		<s-page heading="A page with additional components">
			<s-section padding="base" heading="Details">
				<form onSubmit={handleSubmit}>
					<s-text-field 
						label="Title" 
						name="my-text"
						value={textValue}
						onChange={(e) => setTextValue((e.target as HTMLInputElement).value)}
					/>
					<s-text-area 
						label="Description"
						name="my-number"
						value={numberValue}
						onChange={(e) => setNumberValue((e.target as HTMLTextAreaElement).value)} 
					/>

					<div style={{ marginTop: '1rem' }}>
						<s-button type="submit">Submit</s-button>
					</div>
				</form>
			</s-section>

			<s-section heading="Status" slot="aside">
				<s-button command="--show" commandFor="modal-1">Open Modal</s-button>
				<s-modal id="modal-1" heading="Products" size="large">
					<s-section padding="none" accessibilityLabel="Products table section">
						{/* Search Bar - Always Visible */}
						<div style={{ padding: '1rem', borderBottom: '1px solid var(--s-border-color, #e0e0e0)' }}>
							<s-grid gap="small-200" gridTemplateColumns="1fr auto" alignItems="center">
								<s-text-field
									icon="search"
									placeholder="Search all Products"
									value={searchTerm}
									onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
								/>
								{isSearching && (
									<s-button variant="secondary" onClick={handleSearchClear}>
										Clear
									</s-button>
								)}
							</s-grid>
						</div>

						{/* Empty State - No Search Results */}
						{products.length === 0 && isSearching ? (
							<s-grid gap="base" justifyItems="center" paddingBlock="large-400" style={{ minHeight: '400px' }}>
								<s-box maxInlineSize="200px" maxBlockSize="200px">
									<s-image
										aspectRatio="1/0.5"
										src="https://cdn.shopify.com/static/images/polaris/patterns/callout.png"
										alt="No results found illustration"
									/>
								</s-box>
								<s-grid justifyItems="center" maxInlineSize="450px" gap="base">
									<s-stack alignItems="center" gap="small">
										<s-heading>No products found</s-heading>
										<s-paragraph style={{ textAlign: 'center' }}>
											No products match "<strong>{searchTerm}</strong>". Try adjusting your search or browse all products.
										</s-paragraph>
									</s-stack>
									<s-button-group>
										<s-button variant="primary" onClick={handleSearchClear} aria-label="Clear search and show all products">
											Show all products
										</s-button>
									</s-button-group>
								</s-grid>
							</s-grid>
						) : products.length === 0 ? (
							/* Empty State - No Products at All */
							<s-grid gap="base" justifyItems="center" paddingBlock="large-400" style={{ minHeight: '400px' }}>
								<s-box maxInlineSize="200px" maxBlockSize="200px">
									<s-image
										aspectRatio="1/0.5"
										src="https://cdn.shopify.com/static/images/polaris/patterns/callout.png"
										alt="Get started with products"
									/>
								</s-box>
								<s-grid justifyItems="center" maxInlineSize="450px" gap="base">
									<s-stack alignItems="center" gap="small">
										<s-heading>Start creating products</s-heading>
										<s-paragraph style={{ textAlign: 'center' }}>
											Create and manage your collection of products for customers to purchase.
										</s-paragraph>
									</s-stack>
									<s-button-group>
										<s-button variant="secondary" aria-label="Learn more about creating products">
											Learn more
										</s-button>
										<s-button variant="primary" aria-label="Add a new product">
											Create product
										</s-button>
									</s-button-group>
								</s-grid>
							</s-grid>
						) : (
							/* Products Table */
							<s-table>
								<s-table-header-row>
									<s-table-header listSlot="primary">Title</s-table-header>
									<s-table-header format="numeric">Variants</s-table-header>
									<s-table-header>Created</s-table-header>
									<s-table-header listSlot="secondary">Status</s-table-header>
								</s-table-header-row>
								<s-table-body>
									{products.map((product: any) => (
										<s-table-row key={product.id} clickDelegate={`${product.id}-checkbox`}>
											<s-table-cell>
												<s-stack direction="inline" gap="small" alignItems="center">
													<s-checkbox id={`${product.id}-checkbox`} />
													<s-clickable border="base" borderRadius="base" inlineSize="40px" blockSize="40px">
														<s-image
															objectFit="cover"
															src={product.featuredMedia?.preview?.image?.url || "https://picsum.photos/80"}
															alt={`${product.title} thumbnail`}
														/>
													</s-clickable>
													<s-link>{product.title}</s-link>
												</s-stack>
											</s-table-cell>
											<s-table-cell>{product.variants.edges.length}</s-table-cell>
											<s-table-cell>{new Date(product.createdAt).toLocaleDateString()}</s-table-cell>
											<s-table-cell>
												<s-badge 
													color="base" 
													tone={product.status === "DRAFT" ? "info" : "success"}
												>
													{product.status}
												</s-badge>
											</s-table-cell>
										</s-table-row>
									))}
								</s-table-body>
							</s-table>
						)}
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
					<s-select label="Status" name="status">
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
			</s-section>

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
	);
}