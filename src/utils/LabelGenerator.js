import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export const generateShippingLabel = async (shipmentDetails) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100, 150] // Standard 4x6 label size approx
    });

    const qrDataUrl = await QRCode.toDataURL(shipmentDetails.id);

    // Border
    doc.setLineWidth(1);
    doc.rect(5, 5, 90, 140);

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("JIGNASA LOGISTICS", 50, 15, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.line(5, 20, 95, 20);

    // Tracking ID
    doc.setFontSize(10);
    doc.text("TRACKING #:", 10, 28);
    doc.setFontSize(14);
    doc.text(shipmentDetails.id, 10, 35);

    // QR Code
    doc.addImage(qrDataUrl, 'PNG', 60, 25, 30, 30);

    doc.line(5, 60, 95, 60);

    // From
    doc.setFontSize(8);
    doc.text("FROM:", 10, 65);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(shipmentDetails.sender, 10, 72);
    doc.text(shipmentDetails.origin, 10, 78);

    // To
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text("TO:", 50, 65);
    doc.setFontSize(12);
    doc.text(shipmentDetails.recipient, 50, 72);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(shipmentDetails.destination, 50, 78);

    doc.line(5, 90, 95, 90);

    // Details attached
    doc.setFontSize(10);
    doc.text(`Weight: ${shipmentDetails.weight} kg`, 10, 100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 100);

    doc.rect(10, 110, 80, 25);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(shipmentDetails.destination.split(',')[0].toUpperCase(), 50, 125, { align: 'center' });

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text("Thank you for recycling with Jignasa.", 50, 145, { align: 'center' });

    // Save
    doc.save(`label_${shipmentDetails.id}.pdf`);
};
