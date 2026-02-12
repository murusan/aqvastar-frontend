export default function Commercials({ formData, setFormData }) {
  return (
    <fieldset>
      <legend>Approximate power consumption costing </legend>

     <div className="row">
        <label>Initial Running Time (Hrs)</label>
        <input
          type="number"
          value={formData.initial_running_time}
          onChange={e => setFormData({ ...formData, initial_running_time: e.target.value })}
        readOnly
        />
      </div>

           <div className="row">
        <label>Daily Running Time (Hrs)</label>
        <input
          type="number"
          value={formData.daily_running_time}
          onChange={e => setFormData({ ...formData, daily_running_time: e.target.value })}
        readOnly
        />
      </div>

      <div className="row">
        <label>Electricity Rate (₹/kWh)</label>
        <input
          type="number"
          value={formData.electricity_rate}
          onChange={e => setFormData({ ...formData, electricity_rate: e.target.value })}
        />
      </div>

      <div className="row">
        <label>Initial Running Cost (₹)</label>
        <input
          type="number"
          value={formData.initial_running_cost}
          onChange={e => setFormData({ ...formData, initial_running_cost: e.target.value })}
        readOnly
        />
      </div>
          <div className="row">
        <label>Daily Running Cost (₹)</label>
        <input
          type="number"
          value={formData.daily_running_cost}
          onChange={e => setFormData({ ...formData, daily_running_cost: e.target.value })}
        readOnly
        />
      </div>

      
    </fieldset>
  );
}
