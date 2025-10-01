import jsPDF from 'jspdf'
// import QRCode from 'qrcode'
import logoImage from '../assets/logo.png'
import { NetworkManager } from '../api/networkManager'
import type { CompanyProfileDto } from '../dto/response'

interface Facility {
  facility_id: number
  facility_name: string
  price: number
}

interface BookingProduct {
  product_id: number
  product_name: string
  booking_date: string
  start_time: string
  end_time: string
  price: number
  location_name: string
  facilities?: Facility[]
  spaceDetails?: {
    capacity?: number
    images?: string[]
  }
}

interface BookingItem {
  spaceId: number
  productType: string
  space: {
    name: string
    location: string
  }
  booking?: {
    startDate: string | null
    endDate: string | null
    startTime: string
    duration: string
  }
  subscription?: {
    startDate: string | null
    endDate: string | null
    packageType: string
  }
  totalPrice: number
  products?: BookingProduct[]
}

interface ReceiptData {
  bookings: BookingItem[]
  bookingId: string
  paymentMethod: string
  confirmedAt: string
  totalAmount: number
  guestInfo: {
    firstName: string
    lastName: string
    email?: string
  }
  orderId?: string
  products?: BookingProduct[]
  companyInfo?: CompanyProfileDto
}

export class PDFReceiptGenerator {
  private doc: jsPDF
  private pageWidth: number
  private pageHeight: number
  private margin: number
  private blackColor: [number, number, number] = [0, 0, 0] // Black
  private grayColor: [number, number, number] = [128, 128, 128] // Gray
  private lightGrayColor: [number, number, number] = [211, 211, 211] // Light Gray
  private whiteColor: [number, number, number] = [255, 255, 255] // White

  constructor() {
    this.doc = new jsPDF()
    this.pageWidth = this.doc.internal.pageSize.getWidth()
    this.pageHeight = this.doc.internal.pageSize.getHeight()
    this.margin = 20
  }

  async generateReceipt(receiptData: ReceiptData): Promise<void> {
    try {
      // Set up document properties
      this.doc.setProperties({
        title: `Invoice - ${receiptData.bookingId}`,
        subject: 'Booking Invoice',
        author: receiptData.companyInfo?.name || 'CoworkSpace Booking',
        keywords: 'invoice, booking, coworking, receipt',
        creator: 'CoworkSpace Booking System'
      });

      // Fetch company information if not provided
      let companyInfo = receiptData.companyInfo
      if (!companyInfo) {
        // Use default company information
        companyInfo = {
          name: 'WorkSpace',
          email: 'info@squarehub.com',
          phone: '+94771 118 254 / +94772 673 533',
          address: 'NO 210, Havelock Road Colombo 05',
          image: ''
        }
      }

      // Add company info to receipt data
      receiptData.companyInfo = companyInfo

      // Generate the beautiful invoice
      await this.addHeader(receiptData)
      this.addInvoiceDetails(receiptData)
      this.addCustomerInfo(receiptData)
      this.addItemsTable(receiptData)
      this.addTotalSection(receiptData)
      this.addFooter(receiptData)

      // Save the PDF
      this.doc.save(`invoice-${receiptData.bookingId}.pdf`)
    } catch (error) {
      console.error('Error generating PDF invoice:', error)
      throw error
    }
  }

  private async addHeader(receiptData: ReceiptData): Promise<void> {
    let yPos = 25

    // Simple black border at top
    this.doc.setDrawColor(...this.blackColor)
    this.doc.setLineWidth(1)
    this.doc.line(this.margin, 15, this.pageWidth - this.margin, 15)

    // Company Logo
    try {
      this.doc.addImage(logoImage, 'PNG', this.margin, 20, 40, 30)
    } catch (error) {
      console.log('Logo loading failed')
    }

    // Company name
    this.doc.setFontSize(20)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(...this.blackColor)
    this.doc.text('Ceylinco-Works', this.margin + 50, yPos + 15)

    // Company contact info
    this.doc.setFontSize(9)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(...this.grayColor)
    if (receiptData.companyInfo?.email) {
      this.doc.text(receiptData.companyInfo.email, this.margin + 50, yPos + 25)
    }
    if (receiptData.companyInfo?.phone) {
      this.doc.text(receiptData.companyInfo.phone, this.margin + 50, yPos + 32)
    }

    // Booking Receipt title
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(...this.blackColor)
    this.doc.text('BOOKING RECEIPT', this.pageWidth / 2, yPos + 50, { align: 'center' })

    // Underline for title
    this.doc.setDrawColor(...this.blackColor)
    this.doc.setLineWidth(0.5)
    this.doc.line(this.pageWidth / 2 - 60, yPos + 55, this.pageWidth / 2 + 60, yPos + 55)
  }

  private addInvoiceDetails(receiptData: ReceiptData): void {
    let yPos = 100

    // Invoice details section
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(...this.blackColor)
    this.doc.text('Invoice Details', this.margin, yPos)

    yPos += 10

    // Invoice details in two columns
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(...this.blackColor)

    // Left column
    this.doc.text('Invoice Number:', this.margin, yPos)
    this.doc.text('Date:', this.margin, yPos + 8)
    this.doc.text('Order ID:', this.margin, yPos + 16)

    // Right column values
    this.doc.text(receiptData.bookingId, this.margin + 50, yPos)
    this.doc.text(new Date(receiptData.confirmedAt).toLocaleDateString(), this.margin + 50, yPos + 8)
    this.doc.text(receiptData.orderId || receiptData.bookingId, this.margin + 50, yPos + 16)

    yPos += 35

    // Billing Address section
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(...this.blackColor)
    this.doc.text('Billing Address', this.margin, yPos)

    yPos += 10
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(...this.blackColor)
    this.doc.text(`${receiptData.guestInfo.firstName} ${receiptData.guestInfo.lastName}`, this.margin, yPos)
    if (receiptData.guestInfo.email) {
      this.doc.text(receiptData.guestInfo.email, this.margin, yPos + 8)
    }

    // Billing Details section (right side)
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(...this.blackColor)
    this.doc.text('Billing Details', this.pageWidth - this.margin - 80, yPos - 10)

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(...this.blackColor)
    this.doc.text('Payment Method:', this.pageWidth - this.margin - 80, yPos + 8)
    this.doc.text(receiptData.paymentMethod, this.pageWidth - this.margin - 80, yPos + 16)
  }

  private addCustomerInfo(receiptData: ReceiptData): void {
    // This method is not used in the new black and white template
    // Customer info is included in the invoice details section above
  }

  private addItemsTable(receiptData: ReceiptData): void {
    let yPos = 180

    // Table Header
    this.doc.setFillColor(...this.lightGrayColor)
    this.doc.rect(this.margin, yPos - 2, this.pageWidth - 2 * this.margin, 12, 'F')
    this.doc.setDrawColor(...this.blackColor)
    this.doc.setLineWidth(0.5)
    this.doc.rect(this.margin, yPos - 2, this.pageWidth - 2 * this.margin, 12)

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(...this.blackColor)
    this.doc.text('DESCRIPTION', this.margin + 5, yPos + 5)
    this.doc.text('QTY', this.pageWidth - this.margin - 80, yPos + 5)
    this.doc.text('DATE', this.pageWidth - this.margin - 50, yPos + 5)
    this.doc.text('AMOUNT', this.pageWidth - this.margin - 5, yPos + 5, { align: 'right' })

    yPos += 15

    // Items
    const items = receiptData.products || []
    items.forEach((item: any, index: number) => {
      const rowHeight = 20

      // Alternate row backgrounds
      if (index % 2 === 1) {
        this.doc.setFillColor(248, 248, 248) // Very light gray
        this.doc.rect(this.margin, yPos - 2, this.pageWidth - 2 * this.margin, rowHeight, 'F')
      }

      // Main product row
      this.doc.setDrawColor(...this.grayColor)
      this.doc.setLineWidth(0.3)
      this.doc.rect(this.margin, yPos - 2, this.pageWidth - 2 * this.margin, rowHeight)

      // Product description
      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'normal')
      this.doc.setTextColor(...this.blackColor)
      const description = item.product_name || 'Workspace'
      const location = item.location_name || ''
      const date = item.booking_date ? new Date(item.booking_date).toLocaleDateString() : ''
      const time = item.start_time && item.end_time ? `${this.formatTime(item.start_time)} - ${this.formatTime(item.end_time)}` : ''

      let descText = description
      if (location) descText += ` - ${location}`
      if (time) descText += ` (${time})`

      this.doc.text(descText, this.margin + 5, yPos + 5)

      // Quantity
      this.doc.text('1', this.pageWidth - this.margin - 80, yPos + 5)

      // Date
      this.doc.text(date, this.pageWidth - this.margin - 50, yPos + 5)

      // Base price
      this.doc.text(`LKR ${item.price?.toLocaleString() || '0'}`, this.pageWidth - this.margin - 5, yPos + 5, { align: 'right' })

      yPos += rowHeight

      // Facilities as separate rows
      if (item.facilities && item.facilities.length > 0) {
        item.facilities.forEach((facility: Facility) => {
          this.doc.setDrawColor(...this.grayColor)
          this.doc.setLineWidth(0.3)
          this.doc.rect(this.margin, yPos - 2, this.pageWidth - 2 * this.margin, 15)

          this.doc.setFontSize(9)
          this.doc.setFont('helvetica', 'normal')
          this.doc.setTextColor(...this.grayColor)
          this.doc.text(`  + ${facility.facility_name}`, this.margin + 5, yPos + 5)

          // Facility price
          this.doc.text(`LKR ${facility.price.toLocaleString()}`, this.pageWidth - this.margin - 5, yPos + 5, { align: 'right' })

          yPos += 15
        })
      }
    })
  }

  private addTotalSection(receiptData: ReceiptData): void {
    const yPos = this.pageHeight - 60

    // Total section with border
    this.doc.setDrawColor(...this.blackColor)
    this.doc.setLineWidth(0.5)
    this.doc.rect(this.margin, yPos - 5, this.pageWidth - 2 * this.margin, 30)

    // Total text
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(...this.blackColor)
    this.doc.text('FINAL AMOUNT:', this.pageWidth - this.margin - 80, yPos + 12)

    this.doc.setFontSize(16)
    this.doc.text(`LKR ${receiptData.totalAmount.toLocaleString()}`, this.pageWidth - this.margin - 5, yPos + 12, { align: 'right' })
  }

  private addFooter(receiptData: ReceiptData): void {
    const yPos = this.pageHeight - 25

    // Footer line
    this.doc.setDrawColor(...this.blackColor)
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, yPos, this.pageWidth - this.margin, yPos)

    // Footer content
    this.doc.setFontSize(9)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(...this.grayColor)

    // Company information
    this.doc.text('Thank you for choosing our coworking space', this.pageWidth / 2, yPos + 8, { align: 'center' })

    if (receiptData.companyInfo?.address) {
      this.doc.text(receiptData.companyInfo.address, this.pageWidth / 2, yPos + 15, { align: 'center' })
    }

    if (receiptData.companyInfo?.email) {
      this.doc.text(receiptData.companyInfo.email, this.pageWidth / 2, yPos + 22, { align: 'center' })
    }

    if (receiptData.companyInfo?.phone) {
      this.doc.text(receiptData.companyInfo.phone, this.pageWidth / 2, yPos + 29, { align: 'center' })
    }
  }

  private formatTime(time: string): string {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }
}

export const generatePDFReceipt = async (orderId: string): Promise<void> => {
  try {
    // Fetch invoice data from API
    const invoiceResponse = await NetworkManager.getInvoice(orderId)

    if (!invoiceResponse.success || !invoiceResponse.data) {
      throw new Error(invoiceResponse.message || 'Failed to fetch invoice data')
    }

    const invoiceData = invoiceResponse.data

    // Default company information
    const companyInfo = {
      name: 'WorkSpace',
      email: 'info@squarehub.com',
      phone: '+94771 118 254 / +94772 673 533',
      address: 'NO 210, Havelock Road Colombo 05',
      image: ''
    }

    // Transform API data to PDF format with correct price breakdown
    const receiptData: ReceiptData = {
      bookings: [], // Not used in simple template
      bookingId: invoiceData.order_id,
      paymentMethod: 'Card Payment',
      confirmedAt: new Date().toISOString(),
      totalAmount: invoiceData.total_amount,
      guestInfo: {
        firstName: invoiceData.first_name,
        lastName: invoiceData.last_name,
        email: invoiceData.email
      },
      orderId: invoiceData.order_id,
      companyInfo: companyInfo,
      products: invoiceData.products.map(product => {
        // Calculate base price by subtracting facility prices from total_price
        const facilityTotal = product.additional_facilities?.reduce((sum, facility) => sum + facility.price, 0) || 0
        const basePrice = product.total_price - facilityTotal

        return {
          product_id: product.product_id,
          product_name: product.product_type === 'meeting-room' ? 'Meeting Room' :
                       product.product_type === 'hot-desk' ? 'Hot Desk' :
                       product.product_type === 'coworking-space' ? 'Co-working Space' : product.product_type,
          booking_date: product.booking_date || '',
          start_time: product.start_time || '',
          end_time: product.end_time || '',
          price: basePrice, // Base price without facilities
          location_name: product.location_name,
          facilities: product.additional_facilities?.map(facility => ({
            facility_id: facility.facility_id,
            facility_name: facility.facility_name,
            price: facility.price
          })) || []
        }
      })
    }

    const generator = new PDFReceiptGenerator()
    await generator.generateReceipt(receiptData)
  } catch (error) {
    console.error('Error generating PDF invoice:', error)
    throw error
  }
}

export const generatePDFFromData = async (receiptData: ReceiptData): Promise<void> => {
  const generator = new PDFReceiptGenerator()
  await generator.generateReceipt(receiptData)
}