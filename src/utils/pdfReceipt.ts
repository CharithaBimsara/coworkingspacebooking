import jsPDF from 'jspdf'
import QRCode from 'qrcode'

interface BookingData {
  id: string
  status: string
  date: string
  duration: string
  spaceType: string
  guests: number
  totalAmount: number
  basePrice: number
  extraFees: number
  serviceFee: number
  taxes: number
  space: {
    id: number
    name: string
    location: string
    rating: number
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

  async generateReceipt(booking: BookingData): Promise<void> {
    try {
      // Header
      await this.addHeader()
      
      // Booking Information
      this.addBookingInfo(booking)
      
      // Space Details
      this.addSpaceDetails(booking)
      
      // Price Breakdown
      this.addPriceBreakdown(booking)
      
      // QR Code
      await this.addQRCode(booking)
      
      // Footer
      this.addFooter()
      
      // Download the PDF
      this.doc.save(`receipt-${booking.id}.pdf`)
    } catch (error) {
      console.error('Error generating PDF receipt:', error)
      throw error
    }
  }

  private async addHeader(): Promise<void> {
    // Company Logo/Name
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('CurryRealm Workspace', this.margin, 30)
    
    // Receipt Title
    this.doc.setFontSize(18)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('BOOKING RECEIPT', this.pageWidth - this.margin - 60, 30)
    
    // Date Generated
    this.doc.setFontSize(10)
    this.doc.text(`Generated: ${new Date().toLocaleString()}`, this.pageWidth - this.margin - 60, 40)
    
    // Horizontal line
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, 50, this.pageWidth - this.margin, 50)
  }

  private addBookingInfo(booking: BookingData): void {
    let yPos = 70
    
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('BOOKING INFORMATION', this.margin, yPos)
    
    yPos += 15
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    
    const bookingInfo = [
      ['Booking ID:', booking.id],
      ['Status:', booking.status],
      ['Date:', this.formatDate(booking.date)],
      ['Duration:', this.formatDuration(booking.duration)],
      ['Space Type:', this.formatSpaceType(booking.spaceType)],
      ['Number of Guests:', booking.guests.toString()]
    ]
    
    bookingInfo.forEach(([label, value]) => {
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(label, this.margin, yPos)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(value, this.margin + 40, yPos)
      yPos += 12
    })
  }

  private addSpaceDetails(booking: BookingData): void {
    let yPos = 170
    
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('SPACE DETAILS', this.margin, yPos)
    
    yPos += 15
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    
    const spaceInfo = [
      ['Space Name:', booking.space.name],
      ['Location:', booking.space.location],
      ['Rating:', `${booking.space.rating}/5.0 stars`]
    ]
    
    spaceInfo.forEach(([label, value]) => {
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(label, this.margin, yPos)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(value, this.margin + 40, yPos)
      yPos += 12
    })
  }

  private addPriceBreakdown(booking: BookingData): void {
    let yPos = 240
    
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('PRICE BREAKDOWN', this.margin, yPos)
    
    yPos += 15
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    
    const priceItems = [
      ['Base Price:', `$${booking.basePrice.toFixed(2)}`],
      ['Extra Fees:', `$${booking.extraFees.toFixed(2)}`],
      ['Service Fee:', `$${booking.serviceFee.toFixed(2)}`],
      ['Taxes:', `$${booking.taxes.toFixed(2)}`]
    ]
    
    priceItems.forEach(([label, value]) => {
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(label, this.margin, yPos)
      this.doc.text(value, this.pageWidth - this.margin - 30, yPos, { align: 'right' })
      yPos += 12
    })
    
    // Total line
    yPos += 5
    this.doc.setLineWidth(0.3)
    this.doc.line(this.margin, yPos, this.pageWidth - this.margin, yPos)
    
    yPos += 10
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('TOTAL AMOUNT:', this.margin, yPos)
    this.doc.text(`$${booking.totalAmount.toFixed(2)}`, this.pageWidth - this.margin - 30, yPos, { align: 'right' })
  }

  private async addQRCode(booking: BookingData): Promise<void> {
    try {
      // Generate QR code data
      const qrData = JSON.stringify({
        bookingId: booking.id,
        spaceId: booking.space.id,
        spaceName: booking.space.name,
        date: booking.date,
        status: booking.status,
        total: booking.totalAmount,
        verificationUrl: `https://curryrealmworkspace.com/verify/${booking.id}`
      })
      
      // Generate QR code as data URL
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 100,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      // Add QR code to PDF
      const qrSize = 60
      const qrX = this.pageWidth - this.margin - qrSize
      const qrY = 70
      
      this.doc.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize)
      
      // QR code label
      this.doc.setFontSize(8)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text('Scan to verify', qrX + (qrSize / 2), qrY + qrSize + 10, { align: 'center' })
      this.doc.text('booking details', qrX + (qrSize / 2), qrY + qrSize + 18, { align: 'center' })
      
    } catch (error) {
      console.error('Error generating QR code:', error)
      // Continue without QR code if generation fails
    }
  }

  private addFooter(): void {
    const footerY = this.pageHeight - 40
    
    // Footer line
    this.doc.setLineWidth(0.3)
    this.doc.line(this.margin, footerY - 10, this.pageWidth - this.margin, footerY - 10)
    
    this.doc.setFontSize(8)
    this.doc.setFont('helvetica', 'normal')
    
    // Company info
    this.doc.text('CurryRealm Workspace Solutions', this.margin, footerY)
    this.doc.text('Email: support@curryrealmworkspace.com', this.margin, footerY + 8)
    this.doc.text('Phone: +1 (555) 123-4567', this.margin, footerY + 16)
    
    // Terms
    this.doc.text('This receipt serves as proof of payment.', this.pageWidth - this.margin - 80, footerY)
    this.doc.text('For support, please contact us with your booking ID.', this.pageWidth - this.margin - 80, footerY + 8)
    this.doc.text('Terms and conditions apply.', this.pageWidth - this.margin - 80, footerY + 16)
  }

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  private formatDuration(duration: string): string {
    const durationMap: { [key: string]: string } = {
      'hourly': 'Hourly',
      'daily': 'Full Day',
      'weekly': 'Weekly',
      'monthly': 'Monthly'
    }
    return durationMap[duration] || 'Full Day'
  }

  private formatSpaceType(spaceType: string): string {
    const typeMap: { [key: string]: string } = {
      'hot-desk': 'Hot Desk',
      'dedicated-desk': 'Dedicated Desk',
      'private-office': 'Private Office',
      'meeting-room': 'Meeting Room',
      'coworking-space': 'Coworking Space'
    }
    return typeMap[spaceType] || spaceType
  }
}

// Export utility function for easy use
export const generatePDFReceipt = async (booking: BookingData): Promise<void> => {
  const generator = new PDFReceiptGenerator()
  await generator.generateReceipt(booking)
}