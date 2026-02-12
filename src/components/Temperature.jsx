export default function Temperature({ formData, setFormData }) {
  return (
    <fieldset>
      <legend>Power and Capacity Details</legend>

      <div className="row">
        <label>Current Temp (°C)</label>
        <input
          type="number"
          value={formData.temp_current}
          onChange={e => setFormData({ ...formData, temp_current: e.target.value })}
          readOnly
        />
      </div>

      <div className="row">
        <label>Desired Temp (°C)</label>
        <input
          type="number"
          value={formData.temp_desired}
          onChange={e => setFormData({ ...formData, temp_desired: e.target.value })}
        />
      </div>

      

      <div className="row">
        <label>Temperate rise required</label>
        <input
          type="number"
          value={formData.temp_rise_required}
          onChange={e => setFormData({ ...formData, temp_rise_required: e.target.value })}
        readOnly
        />
      </div>

     <div className="row">
        <label>Kcal required</label>
        <input
          type="number"
          value={formData.kcal_required}
          onChange={e => setFormData({ ...formData, kcal_required: e.target.value })}
        readOnly
        />
        </div>

      <div className="row">
        <label>KWH required</label>
        <input
          type="number"
          value={formData.kwh_required}
          onChange={e => setFormData({ ...formData, kwh_required: e.target.value })}
        readOnly
        />

      </div>

      <div className="row">
        <label>Running Hours / Day</label>
        <input
          type="number"
          value={formData.running_hours}
          onChange={e => setFormData({ ...formData, running_hours: e.target.value })}
        />
      </div>

      <div className="row">
        <label>COP</label>
        <input
          type="number"
          value={formData.cop}
          onChange={e => setFormData({ ...formData, cop: e.target.value })}
        readOnly
        />
      </div>

      <div className="row">
        <label>Total KW required</label>
        <input
          type="number"
          value={formData.required_kw}
          onChange={e => setFormData({ ...formData, required_kw: e.target.value })}
        readOnly
        />
        </div>

        <div className="row">
        <label>Minimum required capacity of Heat Pump</label>
        <input
          type="number"
          value={formData.min_capacity_pump}
          onChange={e => setFormData({ ...formData, min_capacity_pump: e.target.value })}
        readOnly
        />
        </div>



    </fieldset>
  );
}
