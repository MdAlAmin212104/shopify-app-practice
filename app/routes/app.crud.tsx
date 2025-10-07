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
      <s-text>We'd love to hear about your shopping experience</s-text>
      <s-text-area
        rows="4"
        label="How can we make your shopping experience better?"
      ></s-text-area>
      <s-button>Submit</s-button>
    </s-stack>
  </s-modal>
</div>
<s-divider></s-divider>

<progress value={0.5} max={1}></progress>

            </s-section>
        </s-page>
    )
}