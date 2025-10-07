import { useState } from "react";


export default function AdditionalPage() {
  const [textValue, setTextValue] = useState('');
  const [numberValue, setNumberValue] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit', { textValue, numberValue });
  }



  return (
    <s-page>
      <form onSubmit={handleSubmit}>
        <s-section padding="base" heading="Details">
          <s-text-field label="Title" name="my-text"
            value={textValue}
            onChange={(e) => setTextValue((e.target as HTMLInputElement).value)}></s-text-field>
          <s-text-area label="Description"
            name="my-number"
            value={numberValue}
            onChange={(e) => setNumberValue((e.target as HTMLTextAreaElement).value)} />
        </s-section>
        <div style={{ marginTop: '1rem' }}>
          <s-button type="submit">Submit</s-button>
        </div>
      </form>

      <s-section heading="Status" slot="aside">
        <s-select>
          <s-option value="active">Active</s-option>
          <s-option value="draft">Draft</s-option>
        </s-select>
      </s-section>
    </s-page>
  )
}
