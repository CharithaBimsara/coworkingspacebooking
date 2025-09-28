import jsPDF from 'jspdf'
// import QRCode from 'qrcode'
import logoImage from '../assets/logo.png'
import { NetworkManager } from '../api/networkManager'

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
}

export class PDFReceiptGenerator {
  private doc: jsPDF
  private pageWidth: number
  private pageHeight: number
  private margin: number
  private primaryColor: [number, number, number] = [0, 254, 1] // #00FE01

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
        author: 'CoworkSpace Booking',
        keywords: 'invoice, booking, coworking',
        creator: 'CoworkSpace Booking System'
      });

      // Header with Logo
      await this.addHeader(receiptData)

      // Customer Information
      this.addCustomerInfo(receiptData)

      // Booking Details
      this.addBookingDetails(receiptData)

      // Price Summary
      this.addItemsBreakdown(receiptData)

      // Footer
      this.addFooter()

      // Download the PDF
      this.doc.save(`invoice-${receiptData.bookingId}.pdf`)
    } catch (error) {
      console.error('Error generating PDF invoice:', error)
      throw error
    }
  }

  private async addHeader(receiptData: ReceiptData): Promise<void> {
    // Add background gradient effect
    this.doc.setFillColor(248, 250, 252)
    this.doc.rect(0, 0, this.pageWidth, 60, 'F')

    // Add accent line
    this.doc.setFillColor(...this.primaryColor)
    this.doc.rect(0, 55, this.pageWidth, 5, 'F')

    // Company Logo
    try {
      // Add logo image using imported asset
      this.doc.addImage(logoImage, 'PNG', this.margin, 15, 40, 30)
    } catch (error) {
      console.log('Logo loading failed, using placeholder')
      // Fallback placeholder
      this.doc.setFillColor(255, 255, 255)
      this.doc.roundedRect(this.margin, 15, 40, 30, 3, 3, 'F')
      this.doc.setFontSize(12)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setTextColor(...this.primaryColor)
      this.doc.text('LOGO', this.margin + 20, 35, { align: 'center' })
    }

    // Invoice Title
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(31, 41, 55) // Dark gray
    this.doc.text('INVOICE', this.pageWidth - this.margin, 25, { align: 'right' })

    // Date Generated
    this.doc.setFontSize(10)
    this.doc.setTextColor(107, 114, 128)
    this.doc.text(`Date: ${new Date(receiptData.confirmedAt).toLocaleDateString()}`, this.pageWidth - this.margin, 40, { align: 'right' })
  }

  private addCustomerInfo(receiptData: ReceiptData): void {
    let yPos = 75

    // Section Header
    this.doc.setFillColor(249, 250, 251)
    this.doc.roundedRect(this.margin, yPos - 5, this.pageWidth - 2 * this.margin, 25, 3, 3, 'F')

    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(31, 41, 55)
    this.doc.text('Bill To', this.margin + 5, yPos + 2)

    yPos += 15
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(55, 65, 81)

    const customerInfo = [
      ['Customer:', `${receiptData.guestInfo.firstName} ${receiptData.guestInfo.lastName}`],
      ['Payment Method:', 'Card Payment'],
    ]

    customerInfo.forEach(([label, value]) => {
      this.doc.setFont('helvetica', 'bold')
      this.doc.setTextColor(31, 41, 55)
      this.doc.text(label, this.margin + 5, yPos)
      this.doc.setFont('helvetica', 'normal')
      this.doc.setTextColor(55, 65, 81)
      this.doc.text(value, this.margin + 45, yPos)
      yPos += 8
    })
  }

  private addBookingDetails(receiptData: ReceiptData): void {
    let yPos = 125

    // Section Header
    this.doc.setFillColor(249, 250, 251)
    this.doc.roundedRect(this.margin, yPos - 5, this.pageWidth - 2 * this.margin, 25, 3, 3, 'F')

    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(31, 41, 55)
    this.doc.text('Invoice Details', this.margin + 5, yPos + 2)

    yPos += 20

    // Table Header
    const tableStartY = yPos
    const colWidths = [80, 40, 30, 30] // Description, Date/Time, Qty, Amount
    const colPositions = [
      this.margin,
      this.margin + colWidths[0],
      this.margin + colWidths[0] + colWidths[1],
      this.margin + colWidths[0] + colWidths[1] + colWidths[2]
    ]

    // Table header background
    this.doc.setFillColor(31, 41, 55)
    this.doc.rect(this.margin, yPos - 2, this.pageWidth - 2 * this.margin, 12, 'F')

    // Table headers
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(255, 255, 255)
    this.doc.text('Description', colPositions[0] + 2, yPos + 5)
    this.doc.text('Date/Time', colPositions[1] + 2, yPos + 5)
    this.doc.text('Qty', colPositions[2] + 15, yPos + 5, { align: 'center' })
    this.doc.text('Amount', colPositions[3] + 25, yPos + 5, { align: 'right' })

    yPos += 15

    // Use products data if available, otherwise fall back to bookings
    const items = receiptData.products || receiptData.bookings.flatMap(booking =>
      booking.products || [booking as any]
    )

    // Table rows
    items.forEach((item: any, index: number) => {
      const rowHeight = 15

      // Alternate row background
      if (index % 2 === 0) {
        this.doc.setFillColor(249, 250, 251)
        this.doc.rect(this.margin, yPos - 2, this.pageWidth - 2 * this.margin, rowHeight, 'F')
      }

      // Product/Service description
      this.doc.setFontSize(9)
      this.doc.setFont('helvetica', 'normal')
      this.doc.setTextColor(31, 41, 55)
      const description = item.product_name || item.space?.name || 'Workspace'
      const location = item.location_name || item.space?.location || ''
      this.doc.text(`${description}${location ? ` - ${location}` : ''}`, colPositions[0] + 2, yPos + 5)

      // Date and Time
      const dateStr = item.booking_date ? new Date(item.booking_date).toLocaleDateString() : ''
      const timeStr = item.start_time && item.end_time ? `${this.formatTime(item.start_time)} - ${this.formatTime(item.end_time)}` : ''
      this.doc.setFontSize(8)
      this.doc.text(`${dateStr}${timeStr ? `\n${timeStr}` : ''}`, colPositions[1] + 2, yPos + 3)

      // Quantity (always 1 for now)
      this.doc.setFontSize(9)
      this.doc.text('1', colPositions[2] + 15, yPos + 5, { align: 'center' })

      // Amount
      this.doc.setFont('helvetica', 'bold')
      this.doc.setTextColor(...this.primaryColor)
      this.doc.text(`LKR ${item.price?.toLocaleString() || '0'}`, colPositions[3] + 25, yPos + 5, { align: 'right' })

      yPos += rowHeight

      // Facilities as separate rows
      if (item.facilities && item.facilities.length > 0) {
        item.facilities.forEach((facility: Facility) => {
          // Alternate row background
          if (index % 2 === 0) {
            this.doc.setFillColor(249, 250, 251)
            this.doc.rect(this.margin, yPos - 2, this.pageWidth - 2 * this.margin, rowHeight, 'F')
          }

          this.doc.setFontSize(9)
          this.doc.setFont('helvetica', 'normal')
          this.doc.setTextColor(107, 114, 128)
          this.doc.text(`  + ${facility.facility_name}`, colPositions[0] + 2, yPos + 5)

          this.doc.text('', colPositions[1] + 2, yPos + 5) // Empty date/time for facilities

          this.doc.text('1', colPositions[2] + 15, yPos + 5, { align: 'center' })

          this.doc.setFont('helvetica', 'bold')
          this.doc.setTextColor(...this.primaryColor)
          this.doc.text(`LKR ${facility.price.toLocaleString()}`, colPositions[3] + 25, yPos + 5, { align: 'right' })

          yPos += rowHeight
        })
      }
    })

    // Table border
    this.doc.setDrawColor(229, 231, 235)
    this.doc.setLineWidth(0.5)
    this.doc.rect(this.margin, tableStartY - 2, this.pageWidth - 2 * this.margin, yPos - tableStartY + 2)
  }

  private addItemsBreakdown(receiptData: ReceiptData): void {
    let yPos = this.pageHeight - 80

    // Total section background
    this.doc.setFillColor(249, 250, 251)
    this.doc.roundedRect(this.margin, yPos - 5, this.pageWidth - 2 * this.margin, 40, 3, 3, 'F')

    // Total line
    this.doc.setLineWidth(1)
    this.doc.setDrawColor(...this.primaryColor)
    this.doc.line(this.margin + 10, yPos + 25, this.pageWidth - this.margin - 10, yPos + 25)

    yPos += 12

    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(...this.primaryColor)
    this.doc.text('TOTAL:', this.margin + 5, yPos)
    this.doc.text(`LKR ${receiptData.totalAmount.toLocaleString()}`, this.pageWidth - this.margin - 5, yPos, { align: 'right' })
  }

  private addPriceSummary(receiptData: ReceiptData): void {
    // This is now handled in addItemsBreakdown for more detail
  }

  /*
  private async addQRCode(receiptData: ReceiptData): Promise<void> {
    try {
      const qrData = JSON.stringify({
        bookingId: receiptData.bookingId,
        orderId: receiptData.orderId,
        verificationUrl: `https://spacebooking.com/verify/${receiptData.bookingId}`,
        amount: receiptData.totalAmount
      })

      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 100,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      const qrSize = 35
      const qrX = this.pageWidth - this.margin - qrSize
      const qrY = 75

      this.doc.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize)

      this.doc.setFontSize(8)
      this.doc.setTextColor(107, 114, 128)
      this.doc.text('Scan for verification', qrX + qrSize / 2, qrY + qrSize + 8, { align: 'center' })

    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }
  */

  private addFooter(): void {
    const footerY = this.pageHeight - 25

    // Footer accent line
    this.doc.setFillColor(...this.primaryColor)
    this.doc.rect(0, footerY - 5, this.pageWidth, 2, 'F')

    this.doc.setFontSize(10)
    this.doc.setTextColor(107, 114, 128)

    // Website
    this.doc.text('www.coworkspacebooking.com', this.pageWidth - this.margin, footerY + 8, { align: 'right' })
  }

  private formatTime(time: string): string {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  private formatBookingDate(booking: BookingItem): string {
    const startDate = booking.booking?.startDate || booking.subscription?.startDate
    const endDate = booking.booking?.endDate || booking.subscription?.endDate

    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const formatOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
      return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', formatOptions)}`
    }
    return 'Date not specified'
  }

  private formatProductType(type: string): string {
    const types: Record<string, string> = {
      'meeting-room': 'Meeting Room',
      'hot-desk': 'Hot Desk',
      'coworking-space': 'Co-working Space'
    }
    return types[type] || type
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

    // Transform API data to PDF format
    const receiptData: ReceiptData = {
      bookings: [], // Will be populated from products
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
      products: invoiceData.products.map(product => ({
        product_id: product.product_id,
        product_name: product.product_type === 'meeting-room' ? 'Meeting Room' :
                     product.product_type === 'hot-desk' ? 'Hot Desk' :
                     product.product_type === 'coworking-space' ? 'Co-working Space' : product.product_type,
        booking_date: product.booking_date || '',
        start_time: product.start_time || '',
        end_time: product.end_time || '',
        price: product.total_price,
        location_name: product.location_name,
        facilities: product.additional_facilities?.map(facility => ({
          facility_id: facility.facility_id,
          facility_name: facility.facility_name,
          price: facility.price
        })) || []
      }))
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