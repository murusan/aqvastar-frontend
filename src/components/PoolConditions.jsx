export default function PoolConditions({ formData, setFormData }) {
  return (
    <fieldset>
      <legend>Pool Conditions</legend>

      <div className="row">
        <label>Location of Pool</label>
        <select
          value={formData.pool_location}
          onChange={(e) =>
            setFormData({ ...formData, pool_location: e.target.value })
          }
        >
          <option value="">Select</option>
          <option value="EAST">East</option>
          <option value="WEST">West</option>
          <option value="NORTH">North</option>
          <option value="SOUTH">South</option>
        </select>
      </div>

      <div className="row">
        <label>Hill Area</label>
        <input
          type="checkbox"
          checked={formData.hill_area}
          onChange={(e) =>
            setFormData({ ...formData, hill_area: e.target.checked })
          }
        />
      </div>

      <div className="row">
        <label>Outside Temp below 10°C</label>
        <input
          type="checkbox"
          checked={formData.below_10c}
          onChange={(e) =>
            setFormData({ ...formData, below_10c: e.target.checked })
          }
        />
      </div>

      <div className="row">
        <label>Pool Cover Acceptable</label>
        <input
          type="checkbox"
          checked={formData.pool_cover}
          onChange={(e) =>
            setFormData({ ...formData, pool_cover: e.target.checked })
          }
        />
      </div>

      <div className="row">
        <label>Type of Pool</label>
        <select
          value={formData.pool_type}
          onChange={(e) =>
            setFormData({ ...formData, pool_type: e.target.value })
          }
        >
          <option value="">Select</option>
          <option value="SKIMMER">Skimmer</option>
          <option value="OVERFLOW">Overflow</option>
        </select>
      </div>
    </fieldset>
  );
}
