export default function CrudOpration() {
    return (
        <s-page heading="A page with CRUD operations">
            <s-section padding="base" heading="Details" >
                <div>
                    <s-stack direction="inline" gap="base">
                        <s-text>Check our latest offers</s-text>
                        <s-link commandFor="modal" command="--show"> Fill out the survey </s-link>
                    </s-stack>
                    <s-modal id="modal" heading="Tell us about your shopping experience">
                        <s-stack gap="base">
                            <s-text>We`d love to hear about your shopping experience</s-text>
                            <s-text-area
                                rows={4}
                                label="How can we make your shopping experience better?"
                            ></s-text-area>
                            <s-button>Submit</s-button>
                        </s-stack>
                    </s-modal>
                </div>
                <s-divider></s-divider>

                <progress value={0.8} max={1}></progress>
                <s-date-picker defaultView="2025-10" defaultValue="2025-10-03"></s-date-picker>


            </s-section>


            <s-section>
  <s-grid gridTemplateColumns="1fr auto" gap="small-400" alignItems="start">
    <s-grid
      gridTemplateColumns="@container (inline-size <= 480px) 1fr, auto auto"
      gap="base"
      alignItems="center"
    >
      <s-grid gap="small-200">
        <s-heading>Ready to create your custom puzzle?</s-heading>
        <s-paragraph>
          Start by uploading an image to your gallery or choose from one of our templates.
        </s-paragraph>
        <s-stack direction="inline" gap="small-200">
          <s-button> Upload image </s-button>
          <s-button tone="neutral" variant="tertiary"> Browse templates </s-button>
        </s-stack>
      </s-grid>
      <s-stack alignItems="center">
        <s-box maxInlineSize="200px" borderRadius="base" overflow="hidden">
          <s-image
            src="https://cdn.shopify.com/static/images/polaris/patterns/callout.png"
            alt="Customize checkout illustration"
            aspectRatio="1/0.5"
          ></s-image>
        </s-box>
      </s-stack>
    </s-grid>
    <s-button
      icon="x"
      tone="neutral"
      variant="tertiary"
      accessibilityLabel="Dismiss card"
    ></s-button>
  </s-grid>
</s-section>


<s-section accessibilityLabel="Empty state section">
  <s-grid gap="base" justifyItems="center" paddingBlock="large-400">
    <s-box maxInlineSize="200px" maxBlockSize="200px">
      <s-image
        aspectRatio="1/0.5"
        src="https://cdn.shopify.com/static/images/polaris/patterns/callout.png"
        alt="A stylized graphic of four characters, each holding a puzzle piece"
      />
    </s-box>
    <s-grid
      justifyItems="center"
      maxInlineSize="450px"
      gap="base"
    >
    <s-stack alignItems="center">
      <s-heading>Start creating puzzles</s-heading>
      <s-paragraph>
        Create and manage your collection of puzzles for players to enjoy.
      </s-paragraph>
    </s-stack>
    <s-button-group>
      <s-button slot="secondary-actions" aria-label="Learn more about creating puzzles"> Learn more </s-button>
      <s-button slot="primary-action" aria-label="Add a new puzzle"> Create puzzle </s-button>
    </s-button-group>
    </s-grid>
  </s-grid>
</s-section>

<s-section padding="none" accessibilityLabel="Puzzles table section">
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
            <s-link href="">Mountain View</s-link>
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
</s-section>

        </s-page>
    )
}