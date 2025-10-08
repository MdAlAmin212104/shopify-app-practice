import { Product } from "@shopify/app-bridge-react";
import { authenticate } from "app/shopify.server";
import { useState } from "react";
import { LoaderFunctionArgs, useLoaderData, Form, useActionData, useNavigation, ActionFunctionArgs, useFetcher} from "react-router";


// 🟢 Loader → existing products দেখানোর জন্য
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
    query GetProducts {
      products(first: 100) {
        nodes {
          id
          title
          status
          createdAt
        }
      }
    }`,
  );
  const json = await response.json();
  const products = json.data?.products?.nodes || [];
  return { products };
};


// 🟢 Action → create OR delete product
export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const formDataObject = Object.fromEntries(formData);

  // const actionType = formData.get("_action");

  // 🗑️ Delete Product Logic
   if (formDataObject._action === "delete") {
    const productId = formData.get("id");
    const deleteResponse = await admin.graphql(
      `#graphql
      mutation DeleteProduct($input: ProductDeleteInput!) {
        productDelete(input: $input) {
          deletedProductId
          userErrors {
            message
          }
        }
      }`,
      {
        variables: {
          input: { id: productId },
        },
      },
    );

    const deleteJson = await deleteResponse.json();
    if (deleteJson.data.productDelete.userErrors.length > 0) {
      return { error: deleteJson.data.productDelete.userErrors[0].message };
    }

    return { success: true, deleted: deleteJson.data.productDelete.deletedProductId };
  }

  // 🟢 Create Product Logic
  const title = formData.get("title");
  const description = formData.get("description");

  const response = await admin.graphql(
    `#graphql
    mutation CreateProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
        }
        userErrors {
          message
        }
      }
    }`,
    {
      variables: {
        input: {
          title,
          descriptionHtml: description,
        },
      },
    },
  );

  const json = await response.json();
  if (json.data.productCreate.userErrors.length > 0) {
    return { error: json.data.productCreate.userErrors[0].message };
  }

  return { success: true, product: json.data.productCreate.product };
};


export default function Index() {
  const { products } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fetcher = useFetcher();

  



  if (!Array.isArray(products)) {
    return <div>❌ Something went wrong. No products found.</div>;
  }

  const handleDeleteClick = (id: string) => {
    fetcher.submit({ id, _action: "delete" }, { method: "post" });
  };

  return (
    <s-page heading="React Router app template">
      <s-section>
        <s-grid gap="base">
          <s-grid gap="small-200">
            <s-grid gridTemplateColumns="1fr auto auto" gap="small-300" alignItems="center">
              <s-heading>Setup Guide</s-heading>
              <s-button
                accessibilityLabel="Dismiss Guide"
                variant="tertiary"
                tone="neutral"
                icon="x"
              ></s-button>
              <s-button
                accessibilityLabel="Toggle setup guide"
                variant="tertiary"
                tone="neutral"
                icon="chevron-up"
              ></s-button>
            </s-grid>
            <s-paragraph>
              Use this personalized guide to get your store ready for sales.
            </s-paragraph>
            <s-paragraph>0 out of 3 steps completed</s-paragraph>
          </s-grid>
          <s-box borderRadius="base" border="base" background="base">
            <s-box>
              <s-grid gridTemplateColumns="1fr auto" gap="base" padding="small">
                <s-checkbox
                  label="Upload an image for your puzzle"
                ></s-checkbox>
                <s-button
                  accessibilityLabel="Toggle step 1 details"
                  variant="tertiary"
                  icon="chevron-up"
                ></s-button>
              </s-grid>
              <s-box padding="small" paddingBlockStart="none">
                <s-box padding="base" background="subdued" borderRadius="base">
                  <s-grid gridTemplateColumns="1fr auto" gap="base" alignItems="center">
                    <s-grid gap="small-200">
                      <s-paragraph>
                        Start by uploading a high-quality image that will be used to create your
                        puzzle. For best results, use images that are at least 1200x1200 pixels.
                      </s-paragraph>
                      <s-stack direction="inline" gap="small-200">
                        <s-button variant="primary">
                          Upload image
                        </s-button>
                        <s-button variant="tertiary" tone="neutral"> Image requirements </s-button>
                      </s-stack>
                    </s-grid>
                    <s-box maxBlockSize="80px" maxInlineSize="80px">
                      <s-image
                        src="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                        alt="Customize checkout illustration"
                      ></s-image>
                    </s-box>
                  </s-grid>
                </s-box>
              </s-box>
            </s-box>
            <s-divider></s-divider>
            <s-box>
              <s-grid gridTemplateColumns="1fr auto" gap="base" padding="small">
                <s-checkbox
                  label="Choose a puzzle template"
                ></s-checkbox>
                <s-button
                  accessibilityLabel="Toggle step 2 details"
                  variant="tertiary"
                  icon="chevron-down"
                ></s-button>
              </s-grid>
              <s-box padding="small" paddingBlockStart="none"></s-box>
            </s-box>
            <s-divider></s-divider>
            <s-box>
              <s-grid gridTemplateColumns="1fr auto" gap="base" padding="small">
                <s-checkbox
                  label="Customize puzzle piece shapes"
                ></s-checkbox>
                <s-button
                  accessibilityLabel="Toggle step 3 details"
                  variant="tertiary"
                  icon="chevron-down"
                ></s-button>
              </s-grid>
              <s-box padding="small" paddingBlockStart="none"></s-box>
            </s-box>
          </s-box>
        </s-grid>
      </s-section>

      {/* Product Generator */}
      <s-section heading="Product Generator">
        <Form method="post">
          <div style={{ marginBottom: "1rem", marginTop: "1rem" }}>
            <s-text-field
              label="Product Title"
              name="title"
              value={title}
              onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
              required
            />
          </div>
          <s-text-area
            label="Description"
            name="description"
            value={description}
            onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
            rows={4}
          />
          <div style={{ marginTop: "1rem" }}>
            <s-button variant="primary" type="submit" >
              Add Product
            </s-button>
          </div>
        </Form>

        {actionData?.success && (
          <s-banner tone="success">
            ✅ Product created successfully: {actionData.product.title}
          </s-banner>
        )}
        {actionData?.error && (
          <s-banner tone="critical">⚠️ Error: {actionData.error}</s-banner>
        )}
      </s-section>


      <s-section>
        <s-table>
          <s-table-header-row>
            <s-table-header listSlot="primary">Product Title</s-table-header>
            <s-table-header>Status</s-table-header>
            <s-table-header>Created At</s-table-header>
            <s-table-header>Update</s-table-header>
            <s-table-header>Detete</s-table-header>
          </s-table-header-row>

          <s-table-body>
            {products.map((product: Product) => (
              <s-table-row key={product.id}>
                <s-table-cell>
                  <s-link href={`shopify:admin/products/${product.id.replace("gid://shopify/Product/", "")}`}>
                    {product.title}
                  </s-link>
                </s-table-cell>
                <s-table-cell>
                  <s-badge tone={product.status === "ACTIVE" ? "success" : "neutral"}>
                    {product.status}
                  </s-badge>
                </s-table-cell>
                <s-table-cell>{new Date(product.createdAt).toLocaleDateString()}</s-table-cell>
                <s-table-cell><s-button icon="edit"> Update</s-button></s-table-cell>
                <s-table-cell>
                    <s-button
                      icon="delete"
                      tone="critical"
                      variant="primary"
                      type="submit"
                      loading={isLoading}
                      onClick={() => handleDeleteClick(product.id)}
                    >
                      Delete
                    </s-button>
                </s-table-cell>

              </s-table-row>
            ))}
          </s-table-body>
        </s-table>
      </s-section>
    </s-page>
  );
}

