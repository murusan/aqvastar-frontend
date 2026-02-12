export default function CalculatedResults({ calculated, loading }) {
  if (loading) return <p>Calculating…</p>;
  if (!calculated?.required_capacity_kw) return null;

  return (
    <fieldset>
      <legend>Calculated Results</legend>

      <div className="row">
        <label>Required Capacity (kW)</label>
        <span>{calculated.required_capacity_kw}</span>
      </div>

      <div className="row">
        <label>Base Price (₹)</label>
        <span>{calculated.base_price.toLocaleString()}</span>
      </div>

      <div className="row">
        <label>GST (₹)</label>
        <span>{calculated.gst_amount.toLocaleString()}</span>
      </div>

      <div className="row total">
        <label>Total Price (₹)</label>
        <strong>{calculated.total_price.toLocaleString()}</strong>
      </div>
    </fieldset>
  );
}
