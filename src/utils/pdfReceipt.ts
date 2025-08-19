import jsPDF from 'jspdf'
import QRCode from 'qrcode'

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
}

export class PDFReceiptGenerator {
  private doc: jsPDF
  private pageWidth: number
  private pageHeight: number
  private margin: number

  constructor() {
    this.doc = new jsPDF()
    this.pageWidth = this.doc.internal.pageSize.getWidth()
    this.pageHeight = this.doc.internal.pageSize.getHeight()
    this.margin = 20
  }

  async generateReceipt(receiptData: ReceiptData): Promise<void> {
    try {
      // Header
      await this.addHeader(receiptData)
      
      // Booking Information
      this.addBookingInfo(receiptData)
      
      // Items Breakdown
      this.addItemsBreakdown(receiptData.bookings)

      // Price Summary
      this.addPriceSummary(receiptData)
      
      // QR Code
      await this.addQRCode(receiptData)
      
      // Footer
      this.addFooter()
      
      // Download the PDF
      this.doc.save(`receipt-${receiptData.bookingId}.pdf`)
    } catch (error) {
      console.error('Error generating PDF receipt:', error)
      throw error
    }
  }

  private async addHeader(receiptData: ReceiptData): Promise<void> {
    // Company Logo/Name
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('CurryRealm Workspace', this.margin, 30)
    
    // Receipt Title
    this.doc.setFontSize(18)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('BOOKING RECEIPT', this.pageWidth - this.margin, 30, { align: 'right' })
    
    // Date Generated
    this.doc.setFontSize(10)
    this.doc.text(`Generated: ${new Date(receiptData.confirmedAt).toLocaleString()}`, this.pageWidth - this.margin, 40, { align: 'right' })
    
    // Horizontal line
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, 50, this.pageWidth - this.margin, 50)
  }

  private addBookingInfo(receiptData: ReceiptData): void {
    let yPos = 65
    
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Booking Confirmation', this.margin, yPos)
    
    yPos += 8
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    
    const bookingInfo = [
      ['Booking ID:', receiptData.bookingId],
      ['Guest Name:', `${receiptData.guestInfo.firstName} ${receiptData.guestInfo.lastName}`],
      ['Payment Method:', receiptData.paymentMethod],
    ]
    
    bookingInfo.forEach(([label, value]) => {
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(label, this.margin, yPos)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(value, this.margin + 40, yPos)
      yPos += 7
    })
  }

  private addItemsBreakdown(bookings: BookingItem[]): void {
    let yPos = 100
    
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Booked Items', this.margin, yPos)
    yPos += 8

    // Table Header
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Service/Product', this.margin, yPos)
    this.doc.text('Details', this.margin + 80, yPos)
    this.doc.text('Price', this.pageWidth - this.margin, yPos, { align: 'right' })
    yPos += 5
    this.doc.setLineWidth(0.2)
    this.doc.line(this.margin, yPos, this.pageWidth - this.margin, yPos)
    yPos += 8

    // Table Rows
    this.doc.setFont('helvetica', 'normal')
    bookings.forEach(booking => {
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(booking.space.name, this.margin, yPos)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(this.formatProductType(booking.productType), this.margin + 1, yPos + 5)

      const details = this.formatBookingDate(booking)
      this.doc.text(details, this.margin + 80, yPos, { maxWidth: 60 })

      this.doc.text(`${booking.totalPrice.toFixed(2)}`, this.pageWidth - this.margin, yPos, { align: 'right' })
      yPos += 15
    })
  }

  private addPriceSummary(receiptData: ReceiptData): void {
    let yPos = this.pageHeight - 80

    // Summary line
    this.doc.setLineWidth(0.3)
    this.doc.line(this.margin, yPos, this.pageWidth - this.margin, yPos)
    yPos += 10

    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Total Amount:', this.margin, yPos)
    this.doc.text(`${receiptData.totalAmount.toFixed(2)}`, this.pageWidth - this.margin, yPos, { align: 'right' })
  }

  private async addQRCode(receiptData: ReceiptData): Promise<void> {
    try {
      const qrData = JSON.stringify({
        bookingId: receiptData.bookingId,
        verificationUrl: `https://curryrealmworkspace.com/verify/${receiptData.bookingId}`
      })
      
      const qrCodeDataURL = await QRCode.toDataURL(qrData, { width: 80, margin: 1 })
      
      const qrSize = 40
      const qrX = this.pageWidth - this.margin - qrSize
      const qrY = 60
      
      this.doc.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize)
      this.doc.setFontSize(8)
      this.doc.text('Scan for details', qrX + qrSize / 2, qrY + qrSize + 5, { align: 'center' })
      
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  private addFooter(): void {
    const footerY = this.pageHeight - 40
    
    this.doc.setLineWidth(0.3)
    this.doc.line(this.margin, footerY - 10, this.pageWidth - this.margin, footerY - 10)
    
    this.doc.setFontSize(8)
    this.doc.setFont('helvetica', 'normal')
    
    this.doc.text('CurryRealm Workspace Solutions', this.margin, footerY)
    this.doc.text('Email: support@curryrealmworkspace.com | Phone: +1 (555) 123-4567', this.margin, footerY + 8)
    this.doc.text('Terms and conditions apply. This receipt is proof of payment.', this.margin, footerY + 16)
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