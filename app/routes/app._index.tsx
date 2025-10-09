import { Product } from "@shopify/app-bridge-react";
import { authenticate } from "app/shopify.server";
import { useEffect, useState } from "react";
import {
  LoaderFunctionArgs,
  useLoaderData,
  Form,
  useActionData,
  ActionFunctionArgs,
  useFetcher,
} from "react-router";

// 🟢 Loader → Load existing products
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

// 🟢 Action → Create, Update or Delete
export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const formDataObject = Object.fromEntries(formData);
  const _action = formDataObject._action;

  // 🗑️ Delete Product
  if (_action === "delete") {
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

  // ✏️ Update Product
  if (_action === "update") {
    const id = formData.get("id");
    const title = formData.get("title");
    const description = formData.get("description");

    const updateResponse = await admin.graphql(
      `#graphql
      mutation UpdateProduct($input: ProductInput!) {
        productUpdate(input: $input) {
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
            id,
            title,
            descriptionHtml: description,
          },
        },
      },
    );

    const updateJson = await updateResponse.json();
    if (updateJson.data.productUpdate.userErrors.length > 0) {
      return { error: updateJson.data.productUpdate.userErrors[0].message };
    }

    return { success: true, updated: updateJson.data.productUpdate.product };
  }

  // 🟢 Create Product
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

// 🧩 React Component
export default function Index() {
  const { products } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  useEffect(() => {
    if (actionData?.success) {
      setTitle("");
      setDescription("");
      setIsEditing(false);
      setEditingProductId(null);
    }
  }, [actionData]);

  if (!Array.isArray(products)) {
    return <div>❌ Something went wrong. No products found.</div>;
  }

  const handleDeleteClick = (id: string) => {
    fetcher.submit({ id, _action: "delete" }, { method: "post" });
  };

  const handleUpdateClick = (id: string) => {
    const productSelected = products.find((p: Product) => p.id === id);
    if (productSelected) {
      setTitle(productSelected.title || "");
      setDescription("");
      setIsEditing(true);
      setEditingProductId(id);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProductId(null);
    setTitle("");
    setDescription("");
  };

  return (
    <s-page heading="React Router App Template">
      <s-section heading="Product Generator">
        <Form method="post">
          <input type="hidden" name="_action" value={isEditing ? "update" : "create"} />
          {isEditing && <input type="hidden" name="id" value={editingProductId || ""} />}

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

          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <s-button variant="primary" type="submit">
              {isEditing ? "Update Product" : "Create Product"}
            </s-button>
            {isEditing && (
              <s-button onClick={handleCancelEdit} tone="critical">
                Cancel
              </s-button>
            )}
          </div>
        </Form>

        <div style={{ marginTop: "1rem" }}>
          {actionData?.success && (
            <s-banner tone="success">
              ✅ {isEditing ? "Product updated successfully" : "Product created successfully"}
            </s-banner>
          )}
          {actionData?.error && <s-banner tone="critical">⚠️ {actionData.error}</s-banner>}
        </div>
      </s-section>

      <s-section heading="Existing Products">
        <s-table>
          <s-table-header-row>
            <s-table-header>Product Title</s-table-header>
            <s-table-header>Status</s-table-header>
            <s-table-header>Created At</s-table-header>
            <s-table-header>Update</s-table-header>
            <s-table-header>Delete</s-table-header>
          </s-table-header-row>

          <s-table-body>
            {products.map((product: Product) => (
              <s-table-row key={product.id}>
                <s-table-cell>{product.title}</s-table-cell>
                <s-table-cell>
                  <s-badge tone={product.status === "ACTIVE" ? "success" : "neutral"}>
                    {product.status}
                  </s-badge>
                </s-table-cell>
                <s-table-cell>
                  {new Date(product.createdAt).toLocaleDateString()}
                </s-table-cell>
                <s-table-cell>
                  <s-button icon="edit" onClick={() => handleUpdateClick(product.id)}>
                    Edit
                  </s-button>
                </s-table-cell>
                <s-table-cell>
                  <s-button
                    icon="delete"
                    tone="critical"
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
