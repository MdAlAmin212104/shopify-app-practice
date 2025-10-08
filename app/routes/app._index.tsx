import { Product } from "@shopify/app-bridge-react";
import { authenticate } from "app/shopify.server";
import { LoaderFunctionArgs, useLoaderData } from "react-router";


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



export default function Index() {
  const { products } = useLoaderData<typeof loader>();

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
            <s-paragraph tone="subdued">0 out of 3 steps completed</s-paragraph>
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

      {/* <s-section padding="none" accessibilityLabel="Puzzles table section">
        <s-table>
          <s-grid slot="filters" gap="small-200" gridTemplateColumns="1fr auto">
            <s-text-field
              icon="search"
              placeholder="Searching all puzzles"
            ></s-text-field>
            <s-button
              icon="sort"
              variant="secondary"
              interestFor="sort-tooltip"
              commandFor="sort-actions"
            ></s-button>
            <s-tooltip id="sort-tooltip">
              <s-text>Sort</s-text>
            </s-tooltip>
            <s-popover id="sort-actions">
              <s-stack gap="none">
                <s-box padding="small">
                  <s-choice-list label="Sort by" name="Sort by">
                    <s-choice value="puzzle-name" selected>Puzzle name</s-choice>
                    <s-choice value="pieces">Pieces</s-choice>
                    <s-choice value="created">Created</s-choice>
                    <s-choice value="status">Status</s-choice>
                  </s-choice-list>
                </s-box>
                <s-divider></s-divider>
                <s-box padding="small">
                  <s-choice-list label="Order by" name="Order by">
                    <s-choice value="product-title" selected>A-Z</s-choice>
                    <s-choice value="created">Z-A</s-choice>
                  </s-choice-list>
                </s-box>
              </s-stack>
            </s-popover>
          </s-grid>
          <s-table-header-row>
            <s-table-header listSlot="primary">Puzzle</s-table-header>
            <s-table-header format="numeric">Pieces</s-table-header>
            <s-table-header>Created</s-table-header>
            <s-table-header listSlot="secondary">Status</s-table-header>
          </s-table-header-row>
          <s-table-body>
            <s-table-row clickDelegate="mountain-view-checkbox">
              <s-table-cell>
                <s-stack direction="inline" gap="small" alignItems="center">
                  <s-checkbox id="mountain-view-checkbox"></s-checkbox>
                  <s-clickable
                    href=""
                    accessibilityLabel="Mountain View puzzle thumbnail"
                    border="base"
                    borderRadius="base"
                    overflow="hidden"
                    inlineSize="40px"
                    blockSize="40px"
                  >
                    <s-image
                      objectFit="cover"
                      src="https://picsum.photos/id/29/80/80"
                    ></s-image>
                  </s-clickable>
                  <s-link href="">Product title</s-link>
                </s-stack>
              </s-table-cell>
              <s-table-cell>16</s-table-cell>
              <s-table-cell>Today</s-table-cell>
              <s-table-cell>
                <s-badge color="base" tone="success">Active</s-badge>
              </s-table-cell>
            </s-table-row>
            <s-table-row clickDelegate="ocean-sunset-checkbox">
              <s-table-cell>
                <s-stack direction="inline" gap="small" alignItems="center">
                  <s-checkbox id="ocean-sunset-checkbox"></s-checkbox>
                  <s-clickable
                    href=""
                    accessibilityLabel="Ocean Sunset puzzle thumbnail"
                    border="base"
                    borderRadius="base"
                    overflow="hidden"
                    inlineSize="40px"
                    blockSize="40px"
                  >
                    <s-image
                      objectFit="cover"
                      src="https://picsum.photos/id/12/80/80"
                    ></s-image>
                  </s-clickable>
                  <s-link href="">Ocean Sunset</s-link>
                </s-stack>
              </s-table-cell>
              <s-table-cell>9</s-table-cell>
              <s-table-cell>Yesterday</s-table-cell>
              <s-table-cell>
                <s-badge color="base" tone="success">Active</s-badge>
              </s-table-cell>
            </s-table-row>
            <s-table-row clickDelegate="forest-animals-checkbox">
              <s-table-cell>
                <s-stack direction="inline" gap="small" alignItems="center">
                  <s-checkbox id="forest-animals-checkbox"></s-checkbox>
                  <s-clickable
                    href=""
                    accessibilityLabel="Forest Animals puzzle thumbnail"
                    border="base"
                    borderRadius="base"
                    overflow="hidden"
                    inlineSize="40px"
                    blockSize="40px"
                  >
                    <s-image
                      objectFit="cover"
                      src="https://picsum.photos/id/324/80/80"
                    ></s-image>
                  </s-clickable>
                  <s-link href="">Forest Animals</s-link>
                </s-stack>
              </s-table-cell>
              <s-table-cell>25</s-table-cell>
              <s-table-cell>Last week</s-table-cell>
              <s-table-cell>
                <s-badge color="base" tone="neutral">Draft</s-badge>
              </s-table-cell>
            </s-table-row>
          </s-table-body>
        </s-table>
      </s-section> */}

      <s-section>
        <s-table>
          <s-table-header-row>
            <s-table-header listSlot="primary">Product Title</s-table-header>
            <s-table-header>Status</s-table-header>
            <s-table-header>Created At</s-table-header>
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
              </s-table-row>
            ))}
          </s-table-body>
        </s-table>
      </s-section>
    </s-page>
  );
}

