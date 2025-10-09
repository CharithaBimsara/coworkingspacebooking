import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoImage from "../assets/images/app-images/logo.png";
import { apiManager } from '../api/apiManager';

// Define interfaces directly here since we're having issues with imports
export interface InvoiceFacility {
  name: string;
  price: number;
}

export interface InvoiceItem {
  name: string;
  date: string;
  time?: string;
  price: number;
  location?: string;
  facilities?: InvoiceFacility[];
}

export interface InvoiceData {
  orderId: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  paymentMethod: string;
  items: InvoiceItem[];
  total: number;
}

class InvoiceGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private margin: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.margin = 20;
  }

  generateInvoice(data: InvoiceData): void {
    // ===== HEADER - Logo and Invoice title on same row =====
    try {
      // Logo on the left side
      this.doc.addImage(logoImage, "PNG", this.margin, 20, 50, 12);
    } catch (err) {
      console.warn("Logo loading failed:", err);
    }

    // Invoice title on the same line as logo
    this.doc.setFontSize(22).setFont("helvetica", "bold");
    this.doc.text("INVOICE", this.pageWidth - this.margin, 30, { align: "right" });

    this.doc.setFontSize(10).setFont("helvetica", "normal").setTextColor(80);
    this.doc.text(`Invoice No: ${data.orderId}`, this.pageWidth - this.margin, 45, { align: "right" });
    this.doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, this.pageWidth - this.margin, 52, { align: "right" });
    this.doc.text(`Order ID: ${data.orderId}`, this.pageWidth - this.margin, 59, { align: "right" });

    this.doc.setDrawColor(200, 200, 200); // Standardized gray
    this.doc.line(this.margin, 70, this.pageWidth - this.margin, 70);

    // ===== BILL TO / PAYMENT INFO =====
    this.doc.setFontSize(10).setFont("helvetica", "bold").setTextColor(0);
    this.doc.text("BILL TO:", this.margin, 85);
    this.doc.setFont("helvetica", "normal").setTextColor(50);
    this.doc.text(`${data.customer.name}`, this.margin, 92);
    this.doc.text(`${data.customer.email}`, this.margin, 99);
    if (data.customer.phone) {
      this.doc.text(`${data.customer.phone}`, this.margin, 106);
    }

    const rightX = this.pageWidth / 2 + 10;
    this.doc.setFont("helvetica", "bold").setTextColor(0);
    this.doc.text("PAYMENT INFORMATION:", rightX, 85);
    this.doc.setFont("helvetica", "normal").setTextColor(50);
    this.doc.text(`Payment Method: ${data.paymentMethod}`, rightX, 92);
    this.doc.text(`Payment Date: ${new Date(data.date).toLocaleDateString()}`, rightX, 99);

    // ===== ITEMS TABLE =====
    /**
     * Table structure implementation with hierarchical display of products and their facilities
     * 
     * The table has two types of rows:
     * 1. Product rows: Main rows showing product details (name, location, time, date, price)
     * 2. Facility sub-rows: Indented rows underneath products showing associated facilities
     *    - Displayed with bullet points and italics
     *    - Given a slightly different background color
     *    - Shows facility name and price
     */
    const tableRows: any[][] = [];
    
    // Track custom styling for each row (to distinguish products from facilities)
    // Empty object {} for product rows, custom style objects for facility rows
    const rowStyles: any[] = [];

    data.items.forEach((item: InvoiceItem) => {
      // Add the main product row
      tableRows.push([
        `${item.name}${item.location ? ` - ${item.location}` : ""}${item.time ? `\n${item.time}` : ""}`,
        item.date,
        `LKR ${formatPrice(item.price)}`
      ]);
      rowStyles.push({});  // Regular style for product rows

      // Add facility sub-rows if available
      if (item.facilities && item.facilities.length > 0) {
        item.facilities.forEach((facility: InvoiceFacility) => {
          // Create a facility sub-row with indentation and bullet point
          tableRows.push([
            `     • ${facility.name}`,
            "",
            `LKR ${formatPrice(facility.price)}`
          ]);
          // Custom style for facility rows - italics and lighter text color
          rowStyles.push({ fontStyle: 'italic', textColor: [80, 80, 80] });
        });
      }
    });

    autoTable(this.doc, {
      startY: 115,
      head: [["DESCRIPTION", "DATE", "AMOUNT"]],
      body: tableRows,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 6,
        lineColor: [200, 200, 200], // Standardized gray for lines
        lineWidth: 0.2
      },
      headStyles: {
        fillColor: [40, 40, 40], // Dark gray instead of blue
        textColor: 255,
        fontStyle: "bold",
        halign: "center"
      },
      bodyStyles: { textColor: [33, 33, 33] },
      alternateRowStyles: { fillColor: [248, 248, 248] }, // Lighter gray for subtle alternating rows
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 50, halign: "center" },
        2: { cellWidth: 50, halign: "right" }
      },
      /**
       * Custom styling for rows based on whether they are products or facilities
       * 
       * This callback function runs for each cell during table creation and:
       * 1. Applies the custom styles from the rowStyles array based on row index
       * 2. For facility rows (identified by italic style), applies a different 
       *    background color to visually distinguish them as sub-items
       * 3. This creates a clear visual hierarchy between products and their facilities
       */
      didParseCell: function(data) {
        // Apply custom styling if it's a facility row
        if (rowStyles[data.row.index]) {
          Object.assign(data.cell.styles, rowStyles[data.row.index]);
          
          // For facility rows, use a lighter background color to indicate it's a sub-item
          if (rowStyles[data.row.index].fontStyle === 'italic') {
            data.cell.styles.fillColor = [245, 245, 245];
          }
        }
      }
    });

    const finalY = (this.doc as any).lastAutoTable.finalY + 10;

    // ===== TOTAL SECTION =====
    const totalY = Math.min(finalY, this.doc.internal.pageSize.getHeight() - 70);

    this.doc.setDrawColor(200, 200, 200); // Standardized gray
    this.doc.line(this.pageWidth - 80, totalY + 5, this.pageWidth - this.margin, totalY + 5);

    this.doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(50);
    this.doc.text("Subtotal:", this.pageWidth - 70, totalY + 15);
    this.doc.text(`LKR ${formatPrice(data.total)}`, this.pageWidth - this.margin, totalY + 15, { align: "right" });

    this.doc.text("Tax (0%):", this.pageWidth - 70, totalY + 25);
    this.doc.text(`LKR ${formatPrice(0)}`, this.pageWidth - this.margin, totalY + 25, { align: "right" });

    // TOTAL Box - black instead of blue
    this.doc.setFillColor(40, 40, 40);
    this.doc.rect(this.pageWidth - 80, totalY + 35, 70, 12, "F");
    this.doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(255);
    this.doc.text("TOTAL:", this.pageWidth - 75, totalY + 43);
    this.doc.text(`LKR ${formatPrice(data.total)}`, this.pageWidth - this.margin - 5, totalY + 43, { align: "right" });

    // PAID badge - gray instead of green
    this.doc.setFillColor(120, 120, 120);
    this.doc.rect(this.pageWidth - 80, totalY + 50, 70, 12, "F");
    this.doc.setTextColor(255).setFont("helvetica", "bold").setFontSize(10);
    this.doc.text("PAID", this.pageWidth - 45, totalY + 58, { align: "center" });

    // ===== FOOTER =====
    const footerY = this.doc.internal.pageSize.getHeight() - 20;

    this.doc.setDrawColor(200, 200, 200); // Standardized gray
    this.doc.line(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5);

    this.doc.setFontSize(8).setFont("helvetica", "normal").setTextColor(100);
    this.doc.text("Thank you for your business!", this.pageWidth / 2, footerY - 8, { align: "center" });

    this.doc.text(
      "Ceylinco-Works | info@squarehub.com | +94 771 118 254",
      this.pageWidth / 2,
      footerY,
      { align: "center" }
    );

    // Save PDF
    this.doc.save(`invoice-${data.orderId}.pdf`);
  }
}

// Helper functions
/**
 * Format time string to AM/PM format
 */
function formatTime(time: string): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Using global format utilities
import { parsePrice, formatPrice } from './formatUtils';

/**
 * Format product type to display name
 */
function formatProductType(type: string): string {
  switch (type) {
    case 'meeting-room': return 'Meeting Room';
    case 'hot-desk': return 'Hot Desk';
    case 'coworking-space': return 'Co-working Space';
    default: return type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ');
  }
}

/**
 * Generate PDF receipt from API data
 * @param orderId Order ID to fetch invoice data for
 */
export const generatePDFReceipt = async (orderId: string): Promise<void> => {
  try {
    // Fetch invoice data from API
    const invoiceResponse = await apiManager.getInvoice(orderId);

    if (!invoiceResponse.success || !invoiceResponse.data) {
      throw new Error(invoiceResponse.message || 'Failed to fetch invoice data');
    }

    const apiData = invoiceResponse.data;

    // Transform API data to our invoice format
    const invoiceData: InvoiceData = {
      orderId: apiData.order_id,
      date: new Date().toISOString(),
      customer: {
        name: `${apiData.first_name} ${apiData.last_name}`,
        email: apiData.email,
        phone: apiData.phone
      },
      paymentMethod: 'Card Payment',
      items: apiData.products.map(product => {
        // Calculate base price (excluding facilities)
        // Calculate base price (excluding facilities)
        const facilityTotal = product.additional_facilities?.reduce(
          (sum, facility) => sum + parsePrice(facility.price), 0
        ) || 0;
        
        // Parse product total price
        const productTotalPrice = parsePrice(product.total_price);
        
        const basePrice = productTotalPrice - facilityTotal;

        // Format time if available
        const timeInfo = product.start_time && product.end_time 
          ? `${formatTime(product.start_time)} - ${formatTime(product.end_time)}`
          : undefined;

        return {
          name: formatProductType(product.product_type),
          date: product.booking_date ? new Date(product.booking_date).toLocaleDateString() : '-',
          time: timeInfo,
          price: basePrice,
          location: product.location_name,
          facilities: product.additional_facilities?.map(facility => ({
            name: facility.facility_name,
            price: parsePrice(facility.price)
          }))
        };
      }),
      // Parse total amount
      total: parsePrice(apiData.total_amount)
    };

    // Generate and download PDF
    const generator = new InvoiceGenerator();
    generator.generateInvoice(invoiceData);
  } catch (error) {
    console.error('Error generating PDF invoice:', error);
    throw error;
  }
};

/**
 * Generate PDF from predefined data structure
 * For testing or direct usage without API
 */
export const generatePDFFromData = async (receiptData: InvoiceData): Promise<void> => {
  const generator = new InvoiceGenerator();
  generator.generateInvoice(receiptData);
};

export default InvoiceGenerator;
