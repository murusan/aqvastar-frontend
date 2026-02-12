export default function PrintableQuote({ formData, calculated }) {
  return (
    <div className="print-area">
      <h3>Quote Preview</h3>

      <p><b>Pool Volume:</b> {formData.pool_volume} m³</p>
      <p><b>Required Capacity:</b> {calculated.required_kw} kW</p>
      <p><b>Initial Cost:</b> ₹ {calculated.initial_running_cost}</p>
      <p><b>Daily Cost:</b> ₹ {calculated.daily_running_cost}</p>

      <button onClick={() => window.print()}>Print / Save PDF</button>
    </div>
  );
}
