import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png";

export const generateProposalPDF = (formData, modelData) => {
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();


  /* HEADER */
  const logoX = 14;
const logoY = 1;
const logoWidth = 53;
const logoHeight = 53;

doc.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);

doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.text("HEAT PUMP PROPOSAL", pageWidth - 80, 20);

doc.setFontSize(10);
doc.setFont("helvetica", "normal");
doc.text(
  `Date: ${new Date().toLocaleDateString()}`,
  pageWidth - 80,
  26
);

/* IMPORTANT: move content below logo */
let y = logoY + logoHeight + 10;

  /* CUSTOMER DETAILS */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("1. Pool Details", 14, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    head: [["Field", "Value"]],
    body: [
      ["Customer Name", formData.customer_name],
      ["Pool Location", formData.pool_location],
      ["Pool Type", formData.pool_type],
      ["Pool Volume (m³)", formData.pool_volume],
      ["Total Water Capacity (m³)", formData.total_water_capacity]
    ],
    styles: { fontSize: 9 }
  });

  y = doc.lastAutoTable.finalY + 10;

  /* APPROXIMATE POWER CONSUMPTION COSTING DETAILS */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("2. Approximate Power Consumption Costing Details", 14, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    head: [["Field", "Value"]],
    body: [
      ["Minimum Required Capacity of Heat Pump KW", formData.min_capacity_pump],
      ["Initial Running Time", formData.initial_running_time],
      ["Daily Running Time", formData.daily_running_time],
      ["Electricity Rate (Rs/kWh))", formData.electricity_rate],
      ["Initial Running Cost (Rs)", formData.initial_running_cost],
      ["Daily Running Cost (Rs)", formData.daily_running_cost]
    ],
    headStyles: { fillColor: [211, 211, 211] },
    styles: { fontSize: 9 }
  });

  y = doc.lastAutoTable.finalY + 10;


  /* PRICING */
  let MRP = parseFloat(modelData?.MRP || 0).toFixed(2);
  
  let gstAmount =
    parseFloat(MRP * 0.18).toFixed(2);

  let totalPrice =
    parseFloat(parseFloat(MRP)+parseFloat(gstAmount)).toFixed(2);

  doc.setFont("helvetica", "bold");
  doc.text("3. Pricing Summary", 14, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    head: [["Description", "Amount (₹)"]],
    body: [
      ["Model Code", modelData?.Model || "Contact Aqvastar"],
      ["Base Price Rs.", MRP],
      [`GST 18%`, gstAmount],
      ["Total Price Rs", totalPrice]
    ],
    headStyles: { fillColor: [0, 63, 136] },
    styles: { fontSize: 10 }
  });

    y = doc.lastAutoTable.finalY + 10;

     autoTable(doc, {
    startY: y,
    theme: "grid",
    head: [["Scope of Work"]],
    body: [
      ["BRAND offered is AQVASTAR with 2 year warranty"],
      ["AQVASTAR is also responsible for "],
      ["Providing DRGS for proposer installation & pipe DRGS for modification"],
      ["Ensure heat of 28 DegC ( with pool cover used extensively)"],
      ["Client scope:"],
      ["Unloading properly"],
      ["Fixing as per recommendations"],
      ["Ensuring electrical supply availability as required"],
      ["Pedestal works for Heat pump"]
    ],
    headStyles: { fillColor: [256,256,256] },
    styles: { fontSize: 8, textColor: [0,0,0] }
  });
  /* FOOTER */
  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setFontSize(8);
    doc.text(
      "Aqvastar | www.aqvastar.in",
      14,
      pageHeight - 10
    );

    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 30,
      pageHeight - 10
    );
  }

  doc.save(
    `Proposal_${formData.customer_name}_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`
  );
};
