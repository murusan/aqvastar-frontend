import { useState, useEffect } from "react";
import PoolConditions from "./components/PoolConditions";
import PoolDetails from "./components/PoolDetails";
import Temperature from "./components/Temperature";
import Commercials from "./components/Commercials";
import logo from "./assets/logo.png";
import { generateProposalPDF } from "./services/pdfGenerator";
import Papa from "papaparse";
import "./styles.css";

/* -------------------- HELPERS -------------------- */

const calculateCurrentTemp = (location, below10) => {
  if (location === "NORTH" && !below10) return 15;
  if (below10) return 10;
  return 18;
};

const calculateTempCoeff = (location, below10) => {
  if (location === "NORTH") {
    if (below10) return 3.75;
    return 3.25;
  }
  if (below10) return 2.6;
  return 2.25;
};

/* -------------------- MAIN COMPONENT -------------------- */

export default function App() {
  const [formData, setFormData] = useState({
    inverter_model: false,
    quote_reference: "",
    customer_name: "",
    project_location: "",

    pool_location: "",
    pool_type: "",
    pool_volume: "",

    pool_length: "",
    pool_width: "",
    pool_depth: "",
    pool_area: "",

    balancing_tank_percent: 0,
    balancing_tank_volume: 0,
    total_water_capacity: "",

    hill_area: false,
    below_10c: false,
    pool_cover: false,

    temp_current: "",
    temp_desired: 28,
    temp_rise_required: "",

    running_hours: 12,
    cop: "",
    electricity_rate: 10,

    kcal_required: 0,
    kwh_required: 0,
    required_kw: 0,
    min_capacity_pump: 0,

    initial_running_time: 0,
    daily_running_time: 12,
    initial_running_cost: 0,
    daily_running_cost: 0
  });
  
/* -------------------- MODEL SELECTOR COMPONENT -------------------- */

function ModelSelector({ requiredPower, setModelData }) {
  const [loading, setLoading] = useState(false);

  const fetchModel = () => {
  if (!formData.min_capacity_pump) {
    alert("Required power not available");
    return;
  }

  setLoading(true);

 const csvFile = formData.inverter_model 
  ? "/ActiveInverterPricelist.csv"
  : "/ActivePricelist.csv";

  console.log("CSV FILE:", csvFile);
Papa.parse(csvFile, {
    download: true,
    header: true,
    complete: function (results) {
      const rows = results.data;
      const required = parseFloat(formData.min_capacity_pump);

      const selected = rows.find((row) => {
        const inputPower = parseFloat(row["Input Power"]);
        return inputPower >= required;
      });
console.log("First row:", results.data[0]);
      if (selected) {
        setModelData(selected);
      } else {
        setModelData(null);
      }

      setLoading(false);
    },
    error: function (err) {
      console.error(err);
      setLoading(false);
    }
  });
};

  return (
    <button onClick={fetchModel} style={{ marginTop: 20 }}>
      {loading ? "Selecting Model..." : "Select Suitable Model"}
    </button>
  );
}



  const [modelData, setModelData] = useState(null);

  /* -------------------- AREA + VOLUME -------------------- */

  useEffect(() => {
    const l = parseFloat(formData.pool_length) || 0;
    const w = parseFloat(formData.pool_width) || 0;
    const d = parseFloat(formData.pool_depth) || 0;

    if (l && w) {
      const area = l * w;
      const volume = d ? l * w * d : 0;

      setFormData(prev => ({
        ...prev,
        pool_area: area.toFixed(0),
        pool_volume: volume.toFixed(0)
      }));
    }
  }, [formData.pool_length, formData.pool_width, formData.pool_depth]);

  /* -------------------- BALANCING TANK -------------------- */

  useEffect(() => {
    const volume = parseFloat(formData.pool_volume) || 0;
    const percent = formData.pool_type === "SKIMMER" ? 0 : 0.08;
    const balVolume = volume * percent;

    setFormData(prev => ({
      ...prev,
      balancing_tank_percent: percent,
      balancing_tank_volume: balVolume.toFixed(0),
      total_water_capacity: (volume + balVolume).toFixed(0)
    }));
  }, [formData.pool_volume, formData.pool_type]);

  /* -------------------- CURRENT TEMP -------------------- */

  useEffect(() => {
    const temp = calculateCurrentTemp(
      formData.pool_location,
      formData.below_10c
    );

    let cop = formData.pool_location === "NORTH" ? 2.5 : 3.5;
cop = formData.inverter_model ? 2 * cop : cop;
    setFormData(prev => ({
      ...prev,
      temp_current: temp,
      cop: cop
    }));
  }, [formData.pool_location, formData.below_10c, formData.inverter_model]);

  /* -------------------- TEMP RISE -------------------- */

  useEffect(() => {
    const rise =
      (parseFloat(formData.temp_desired) || 0) -
      (parseFloat(formData.temp_current) || 0);

    setFormData(prev => ({
      ...prev,
      temp_rise_required: rise
    }));
  }, [formData.temp_desired, formData.temp_current]);

  /* -------------------- CAPACITY CALCULATION -------------------- */

  useEffect(() => {
    const total = parseFloat(formData.total_water_capacity) || 0;
    if (!total) return;

    const tempCoeff = calculateTempCoeff(
      formData.pool_location,
      formData.below_10c
    );

    let locCoeff = formData.pool_location === "NORTH" ? 1.035 : 1.025;
    let hillCoeff = formData.hill_area ? 1.125 : 1;
    let below10Coeff = formData.below_10c ? 1.15 : 1;
    let coverCoeff = formData.pool_cover ? 1 : 1.25;

    const kcal = total * tempCoeff * locCoeff * hillCoeff * below10Coeff * coverCoeff;
    const kwh = kcal * 1.163;

    const requiredKW =
      kwh /
      (parseFloat(formData.running_hours) || 1) /
      (parseFloat(formData.cop) || 1);

    setFormData(prev => ({
      ...prev,
      kcal_required: kcal.toFixed(2),
      kwh_required: kwh.toFixed(2),
      required_kw: requiredKW.toFixed(2),
      min_capacity_pump: requiredKW.toFixed(1)
    }));
  }, [
    formData.total_water_capacity,
    formData.pool_location,
    formData.below_10c,
    formData.hill_area,
    formData.pool_cover,
    formData.running_hours,
    formData.cop
  ]);
useEffect(() => { 
    const total = parseFloat(formData.total_water_capacity || 0); 
    const tempRise = parseFloat(formData.temp_rise_required || 0); 
    const cop = parseFloat(formData.cop || 0); 
    const minCap = parseFloat(formData.min_capacity_pump || 0); 
    if (!total || !tempRise || !cop || !minCap) return; 
    const initialRunningTime = total * tempRise / cop / minCap; 
    const dailyRunning = formData.running_hours; 
    setFormData(prev => ({ 
      ...prev, 
      initial_running_time: initialRunningTime.toFixed(0), 
      daily_running_time: dailyRunning 
    })); }, 
    [ formData.total_water_capacity, 
      formData.temp_rise_required, formData.cop, 
      formData.min_capacity_pump, formData.running_hours ]); 
      useEffect(() => { 
        let initialRunningCost = formData.initial_running_time*formData.electricity_rate*formData.required_kw; 
        let dailyRunncinCost = formData.daily_running_time*formData.electricity_rate*formData.required_kw; 
        setFormData(
          prev => ({ 
            ...prev, 
            initial_running_cost: Math.ceil(initialRunningCost), 
            daily_running_cost: Math.ceil(dailyRunncinCost)
           })); }, 
           [ formData.initial_running_time, 
            formData.electricity_rate, formData.required_kw, 
            formData.running_hours ]);

  /* -------------------- PDF EXPORT -------------------- */

  const handleExportPDF = () => {
    generateProposalPDF(formData, modelData);
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="container">
      <div className="header">
        <h2>Heat Pump Calculator</h2>
        <img src={logo} alt="Aqvastar Logo" className="logo" />
      </div>

      <fieldset>
        <legend>Quote Details</legend>
        <div className="row">
          <label>Quote Reference Number:</label>
          <input
            type="text"
            value={formData.quote_reference}
            onChange={e =>
              setFormData({ ...formData, quote_reference: e.target.value })
            }
          />
          </div>
             
        <div className="row">
          <label>Customer Name</label>
          <input
            type="text"
            value={formData.customer_name}
            onChange={e =>
              setFormData({ ...formData, customer_name: e.target.value })
            }
          />
        </div>
         <div className="row">
        <label>Is inverter Model</label>
      <input
          type="checkbox"
          checked={formData.inverter_model}
          onChange={(e) =>
            setFormData({ ...formData, inverter_model: e.target.checked })
          }
        />
      </div>
      </fieldset>

      <PoolConditions formData={formData} setFormData={setFormData} />
      <PoolDetails formData={formData} setFormData={setFormData} />
      <Temperature formData={formData} setFormData={setFormData} />
      <Commercials formData={formData} setFormData={setFormData} />

      <ModelSelector
        requiredPower={formData.min_capacity_pump}
        setModelData={setModelData}
      />

      {modelData && (
        <div className="result-box">
          <h3>Selected Model</h3>

          <p>
            <b>Model:</b>{" "}
            {modelData.Model
              ? modelData.Model
              : "Please Contact Aqvastar Office"}
          </p>

          {parseFloat(modelData["Input Power"]) !== 100000 && (
  <p>
    <b>Input Power:</b> {modelData["Input Power"]}
  </p>
)}
          <p><b>MRP Rs.:</b> {modelData.MRP}</p>
          <p><b>GST %:</b> {18}%</p>
          <p>
            <b>Total Price:</b> ₹{" "}
            {(modelData.MRP * (1 + 18 / 100)).toFixed(2)}
          </p>

          <button onClick={handleExportPDF}>
            Generate Proposal PDF
          </button>
        </div>
      )}
    </div>
  );
}
