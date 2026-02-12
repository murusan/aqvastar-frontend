export default function PoolDetails({ formData, setFormData }) {
  return (
    <fieldset>
      <legend>Pool Details</legend>



      <div className="row">
        <label>Length (m)</label>
        <input
          type="number"
          value={formData.pool_length}
          onChange={e => setFormData({ ...formData, pool_length: e.target.value })}
        />
      </div>

      <div className="row">
        <label>Width (m)</label>
        <input
          type="number"
          value={formData.pool_width}
          onChange={e => setFormData({ ...formData, pool_width: e.target.value })}
        />
      </div>

      <div className="row">
        <label>Depth (m)</label>
        <input
          type="number"
          value={formData.pool_depth}
          onChange={e => setFormData({ ...formData, pool_depth: e.target.value })}
        />
      </div>

           <div className="row">
        <label>Pool Area (m2)</label>
        <input
          type="number"
          value={formData.pool_area}
          onChange={e => setFormData({ ...formData, pool_area: e.target.value })}
          readOnly
        />
      </div>

            <div className="row">
        <label>Pool Volume (m³)</label>
        <input
          type="number"
          value={formData.pool_volume}
          onChange={e => setFormData({ ...formData, pool_volume: e.target.value })}
        readOnly
        />
      </div>

      <div className="row">
        <label>Balancing Tank Percent </label>
        <input
          type="number"
          value={formData.balancing_tank_percent}
          onChange={e => setFormData({ ...formData, balancing_tank_percent: e.target.value })}
        readOnly
        />
      </div>
     
     <div className="row">
        <label>Balancing Tank Volume (m³)</label>
        <input
          type="number"
          value={formData.balancing_tank_volume}
          onChange={e => setFormData({ ...formData, balancing_tank_volume: e.target.value })}
        readOnly
        />
      </div>
      

      <div className="row">
        <label>Total Water Capacity (m³)</label>
        <input
          type="number"
          value={formData.total_water_capacity}
          onChange={e => setFormData({ ...formData, total_water_capacity: e.target.value })}
        readOnly
        />
      </div>
      


    </fieldset>
  );
}
