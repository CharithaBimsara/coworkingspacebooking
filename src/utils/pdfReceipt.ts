import jsPDF from 'jspdf'
import QRCode from 'qrcode'

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
        title: `Receipt - ${receiptData.bookingId}`,
        subject: 'Booking Confirmation Receipt',
        author: 'SpaceBooking',
        keywords: 'receipt, booking, coworking',
        creator: 'SpaceBooking System'
      });

      // Header with Logo
      await this.addHeader(receiptData)

      // Customer Information
      this.addCustomerInfo(receiptData)

      // Booking Details
      this.addBookingDetails(receiptData)

      // Items Breakdown
      this.addItemsBreakdown(receiptData)

      // Price Summary
      this.addPriceSummary(receiptData)

      // QR Code and Footer
      await this.addQRCode(receiptData)
      this.addFooter()

      // Download the PDF
      this.doc.save(`receipt-${receiptData.bookingId}.pdf`)
    } catch (error) {
      console.error('Error generating PDF receipt:', error)
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
      // Since we can't directly load images in this environment, we'll create a placeholder
      // In a real implementation, you'd load the logo from the public folder
      this.doc.setFillColor(255, 255, 255)
      this.doc.roundedRect(this.margin, 15, 40, 30, 3, 3, 'F')

      // Logo placeholder text
      this.doc.setFontSize(12)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setTextColor(...this.primaryColor)
      this.doc.text('SB', this.margin + 20, 35, { align: 'center' })
    } catch (error) {
      console.log('Logo loading failed, using text logo')
    }

    // Company Name
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(31, 41, 55) // Dark gray
    this.doc.text('SpaceBooking', this.margin + 50, 25)

    // Tagline
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(107, 114, 128) // Gray
    this.doc.text('Your Premium Coworking Experience', this.margin + 50, 32)

    // Receipt Title
    this.doc.setFontSize(18)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(31, 41, 55)
    this.doc.text('BOOKING RECEIPT', this.pageWidth - this.margin, 25, { align: 'right' })

    // Receipt Number
    this.doc.setFontSize(12)
    this.doc.setTextColor(107, 114, 128)
    this.doc.text(`#${receiptData.orderId || receiptData.bookingId}`, this.pageWidth - this.margin, 35, { align: 'right' })

    // Date Generated
    this.doc.setFontSize(9)
    this.doc.text(`Generated: ${new Date(receiptData.confirmedAt).toLocaleString()}`, this.pageWidth - this.margin, 45, { align: 'right' })
  }

  private addCustomerInfo(receiptData: ReceiptData): void {
    let yPos = 75

    // Section Header
    this.doc.setFillColor(249, 250, 251)
    this.doc.roundedRect(this.margin, yPos - 5, this.pageWidth - 2 * this.margin, 25, 3, 3, 'F')

    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(31, 41, 55)
    this.doc.text('Customer Information', this.margin + 5, yPos + 2)

    yPos += 15
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(55, 65, 81)

    const customerInfo = [
      ['Name:', `${receiptData.guestInfo.firstName} ${receiptData.guestInfo.lastName}`],
      ['Booking ID:', receiptData.bookingId],
      ['Payment Method:', receiptData.paymentMethod],
      ['Confirmation Date:', new Date(receiptData.confirmedAt).toLocaleDateString()],
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
    this.doc.text('Booking Details', this.margin + 5, yPos + 2)

    yPos += 20

    // Use products data if available, otherwise fall back to bookings
    const items = receiptData.products || receiptData.bookings.flatMap(booking =>
      booking.products || [booking as any]
    )

    items.forEach((item: any, index: number) => {
      // Item background
      this.doc.setFillColor(255, 255, 255)
      this.doc.roundedRect(this.margin, yPos - 3, this.pageWidth - 2 * this.margin, 35, 3, 3, 'F')
      this.doc.setDrawColor(229, 231, 235)
      this.doc.setLineWidth(0.5)
      this.doc.roundedRect(this.margin, yPos - 3, this.pageWidth - 2 * this.margin, 35, 3, 3, 'S')

      // Product icon
      this.doc.setFillColor(...this.primaryColor)
      this.doc.circle(this.margin + 8, yPos + 5, 3, 'F')

      // Product name
      this.doc.setFontSize(11)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setTextColor(31, 41, 55)
      this.doc.text(item.product_name || item.space?.name || 'Workspace', this.margin + 15, yPos + 2)

      // Location
      this.doc.setFontSize(9)
      this.doc.setFont('helvetica', 'normal')
      this.doc.setTextColor(107, 114, 128)
      this.doc.text(item.location_name || item.space?.location || '', this.margin + 15, yPos + 8)

      // Date and Time
      const dateStr = item.booking_date ? new Date(item.booking_date).toLocaleDateString() : 'Date not specified'
      const timeStr = item.start_time && item.end_time ? `${this.formatTime(item.start_time)} - ${this.formatTime(item.end_time)}` : ''
      this.doc.text(`${dateStr} ${timeStr}`, this.margin + 15, yPos + 14)

      // Capacity
      if (item.spaceDetails?.capacity) {
        this.doc.text(`Capacity: ${item.spaceDetails.capacity} people`, this.margin + 15, yPos + 20)
      }

      // Price
      this.doc.setFont('helvetica', 'bold')
      this.doc.setTextColor(...this.primaryColor)
      this.doc.text(`LKR ${item.price?.toLocaleString() || 'N/A'}`, this.pageWidth - this.margin - 5, yPos + 8, { align: 'right' })

      yPos += 40

      // Facilities if any
      if (item.facilities && item.facilities.length > 0) {
        this.doc.setFontSize(9)
        this.doc.setFont('helvetica', 'bold')
        this.doc.setTextColor(31, 41, 55)
        this.doc.text('Additional Facilities:', this.margin + 15, yPos - 5)

        item.facilities.forEach((facility: Facility) => {
          this.doc.setFont('helvetica', 'normal')
          this.doc.setTextColor(55, 65, 81)
          this.doc.text(`• ${facility.facility_name}`, this.margin + 20, yPos)
          this.doc.setTextColor(107, 114, 128)
          this.doc.text(`+LKR ${facility.price.toLocaleString()}`, this.pageWidth - this.margin - 5, yPos, { align: 'right' })
          yPos += 6
        })
        yPos += 5
      }
    })
  }

  private addItemsBreakdown(receiptData: ReceiptData): void {
    let yPos = this.pageHeight - 120

    // Section Header
    this.doc.setFillColor(249, 250, 251)
    this.doc.roundedRect(this.margin, yPos - 5, this.pageWidth - 2 * this.margin, 20, 3, 3, 'F')

    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(31, 41, 55)
    this.doc.text('Price Breakdown', this.margin + 5, yPos + 2)

    yPos += 20

    // Calculate breakdown
    const items = receiptData.products || receiptData.bookings.flatMap(booking =>
      booking.products || [booking as any]
    )

    let subtotal = 0
    let facilitiesTotal = 0

    // Base prices
    items.forEach((item: any) => {
      const basePrice = item.price || 0
      subtotal += basePrice

      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'normal')
      this.doc.setTextColor(55, 65, 81)
      this.doc.text(item.product_name || item.space?.name || 'Service', this.margin + 5, yPos)
      this.doc.setTextColor(31, 41, 55)
      this.doc.text(`LKR ${basePrice.toLocaleString()}`, this.pageWidth - this.margin - 5, yPos, { align: 'right' })
      yPos += 8

      // Facilities
      if (item.facilities && item.facilities.length > 0) {
        item.facilities.forEach((facility: Facility) => {
          facilitiesTotal += facility.price
          this.doc.setFontSize(9)
          this.doc.setTextColor(107, 114, 128)
          this.doc.text(`  + ${facility.facility_name}`, this.margin + 10, yPos)
          this.doc.setTextColor(55, 65, 81)
          this.doc.text(`LKR ${facility.price.toLocaleString()}`, this.pageWidth - this.margin - 5, yPos, { align: 'right' })
          yPos += 6
        })
      }
    })

    // Subtotal
    yPos += 5
    this.doc.setLineWidth(0.3)
    this.doc.setDrawColor(229, 231, 235)
    this.doc.line(this.margin + 20, yPos, this.pageWidth - this.margin - 20, yPos)
    yPos += 8

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(31, 41, 55)
    this.doc.text('Subtotal:', this.margin + 5, yPos)
    this.doc.text(`LKR ${(subtotal + facilitiesTotal).toLocaleString()}`, this.pageWidth - this.margin - 5, yPos, { align: 'right' })

    // Service Fee (estimated)
    yPos += 8
    const serviceFee = Math.round((subtotal + facilitiesTotal) * 0.1)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(107, 114, 128)
    this.doc.text('Service Fee (10%):', this.margin + 5, yPos)
    this.doc.text(`LKR ${serviceFee.toLocaleString()}`, this.pageWidth - this.margin - 5, yPos, { align: 'right' })

    // Taxes (estimated)
    yPos += 8
    const taxes = Math.round((subtotal + facilitiesTotal + serviceFee) * 0.08)
    this.doc.text('Taxes (8%):', this.margin + 5, yPos)
    this.doc.text(`LKR ${taxes.toLocaleString()}`, this.pageWidth - this.margin - 5, yPos, { align: 'right' })

    // Total
    yPos += 10
    this.doc.setLineWidth(1)
    this.doc.setDrawColor(...this.primaryColor)
    this.doc.line(this.margin + 10, yPos, this.pageWidth - this.margin - 10, yPos)
    yPos += 12

    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(...this.primaryColor)
    this.doc.text('TOTAL AMOUNT:', this.margin + 5, yPos)
    this.doc.text(`LKR ${receiptData.totalAmount.toLocaleString()}`, this.pageWidth - this.margin - 5, yPos, { align: 'right' })
  }

  private addPriceSummary(receiptData: ReceiptData): void {
    // This is now handled in addItemsBreakdown for more detail
  }

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

  private addFooter(): void {
    const footerY = this.pageHeight - 35

    // Footer background
    this.doc.setFillColor(248, 250, 252)
    this.doc.rect(0, footerY - 10, this.pageWidth, 35, 'F')

    // Accent line
    this.doc.setFillColor(...this.primaryColor)
    this.doc.rect(0, footerY - 10, this.pageWidth, 2, 'F')

    this.doc.setFontSize(8)
    this.doc.setTextColor(107, 114, 128)

    // Contact info
    this.doc.text('SpaceBooking Solutions', this.margin, footerY)
    this.doc.text('Email: support@spacebooking.com | Phone: +94 11 123 4567', this.margin, footerY + 6)
    this.doc.text('Website: www.spacebooking.com', this.margin, footerY + 12)

    // Terms
    this.doc.setFontSize(7)
    this.doc.text('This receipt is your proof of payment. Terms and conditions apply.', this.margin, footerY + 20)

    // Thank you message
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(...this.primaryColor)
    this.doc.text('Thank you for choosing SpaceBooking!', this.pageWidth - this.margin, footerY + 8, { align: 'right' })
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

export const generatePDFReceipt = async (receiptData: ReceiptData): Promise<void> => {
  const generator = new PDFReceiptGenerator()
  await generator.generateReceipt(receiptData)
}