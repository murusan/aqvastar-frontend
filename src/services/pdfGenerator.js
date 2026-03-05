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
const logoHeight = 33;

doc.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);

doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.text("HEAT PUMP PROPOSAL", 18, 30);

doc.setFontSize(10);
doc.setFont("helvetica", "normal");
doc.text(
  `REF No: ${formData.quote_reference}`,
  pageWidth - 80,
  20
);
doc.text(
  `Date: ${new Date().toLocaleDateString()}`,
  pageWidth - 80,
  26
);

/* IMPORTANT: move content below logo */
let y = 42;

  /* CUSTOMER DETAILS */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("1. Pool Details", 14, y);
  y += 6;

autoTable(doc, {
  startY: y,
  theme: "grid",
  tableWidth: pageWidth - 28,   // full width (14mm margin on each side)
columnStyles: {
  0: { cellWidth: (pageWidth - 28) / 2 },
  1: { cellWidth: (pageWidth - 28) / 2 }
},
  head: [["Field", "Value"]],
  body: [
    ["Customer Name", formData.customer_name],
    ["Pool Location", formData.pool_location + (formData.hill_area ? ", HILL AREA" : "") + (formData.below_10c ? ", BELOW 10\u00B0C" : "")],
    ["Pool Type", `${formData.pool_type} ${formData.pool_cover ? 'WITH COVER' : 'WITHOUT COVER'}`],
    ["Pool Volume (m³)", formData.pool_volume],
    ["Total Water Capacity (m³)", formData.total_water_capacity],
    ["Desired Temperature", formData.temp_desired+"\u00B0C"]
  ],
  headStyles: { fillColor: [0, 63, 136] },
  styles: { fontSize: 9 },

  didParseCell: function (data) {
    // Row 0 = First body row ("Customer Name")
    // Column 1 = Value column
    if (data.section === "body" && data.row.index === 0 && data.column.index === 1) {
      data.cell.styles.fontStyle = "bold";
    }
  }
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
    tableWidth: pageWidth - 28,   // full width (14mm margin on each side)
columnStyles: {
  0: { cellWidth: (pageWidth - 28) / 2 },
  1: { cellWidth: (pageWidth - 28) / 2 }
},
    head: [["Field", "Value"]],
    body: [
      ["Minimum Required Capacity of Heat Pump KW", formData.min_capacity_pump],
      ["Initial Running Time", formData.initial_running_time],
      ["Daily Running Time", formData.daily_running_time],
      //["Electricity Rate (Rs/kWh))", formData.electricity_rate],
      ["Initial Running Cost (Rs)", formData.initial_running_cost],
      ["Daily Running Cost (Rs)", formData.daily_running_cost]
    ],
    headStyles: { fillColor: [0, 63, 136] },
    styles: { fontSize: 9 },
    didParseCell: function (data) {
    if (data.section === "body" && data.row.index === 0 && data.column.index === 1) {
      data.cell.styles.fontStyle = "bold";
    }
  }

  });

  y = doc.lastAutoTable.finalY + 10;


  /* PRICING */
let MRP = parseFloat(modelData?.MRP || 0);
let gstAmount = MRP * 0.18;
let totalPrice = MRP + gstAmount;

const formatCurrency = (value) => {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

let formattedMRP = formatCurrency(MRP);
let formattedGST = formatCurrency(gstAmount);
let formattedTotal = formatCurrency(totalPrice);

  doc.setFont("helvetica", "bold");
   doc.setFontSize(12);
  doc.text("3. Pricing Summary", 14, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    tableWidth: pageWidth - 28,   // full width (14mm margin on each side)
columnStyles: {
  0: { cellWidth: (pageWidth - 28) / 2 },
  1: { cellWidth: (pageWidth - 28) / 2 }
},
    head: [["Description", "Amount"]],
    body: [
      ["Model Code", modelData?.Model || "Contact Aqvastar"],
      ["Base Price Rs.", formattedMRP],
      [`GST 18%`, formattedGST],
      ["Total Price Rs", formattedTotal]
    ],
    headStyles: { fillColor: [0, 63, 136] },
    styles: { fontSize: 9 },
    didParseCell: function (data) {
    if (data.section === "body" && data.row.index === 0 && data.column.index === 1) {
      data.cell.styles.fontStyle = "bold";
    }
  }
  });

    y = doc.lastAutoTable.finalY + 10;
     doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
  doc.text("SCOPE OF WORK", 14, y);
  y += 6;

     autoTable(doc, {
    startY: y,
    theme: "grid",
    tableWidth: pageWidth - 28,   // full width (14mm margin on each side)
columnStyles: {
  0: { cellWidth: (pageWidth - 28) / 2 },
  1: { cellWidth: (pageWidth - 28) / 2 }
},
    head: [["AQVASTAR SCOPE","CLIENT SCOPE"]],
    body: [
      ["BRAND offered is AQVASTAR with 2 year warranty","1. Installing Outdoor"],
      ["AQVASTAR is also responsible for ","2. Unloading properly"],
      ["1. Providing DRGS for proposer installation & pipe DRGS for modification","3. Fixing as per recommendations"],
      [`2. Ensure heat of ${formData.temp_desired} DegC (with pool cover used extensively)`,
 "4. Ensuring electrical supply availability as required"],

      ["3. Support in commissioning","5. Desired water flow"],
    ],
    headStyles: { fillColor: [0,63,136] },
    styles: { fontSize: 9 }
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
