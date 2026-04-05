/**
 * Captures a DOM element and converts it to a PDF Blob.
 * Uses html2canvas to rasterize the rendered template,
 * then jsPDF to produce a properly sized A4 document.
 *
 * Both libraries are dynamically imported to avoid SSR/Node.js bundling issues.
 */
export async function exportResumeToPDF(
  element: HTMLElement,
  title: string = "Resume"
): Promise<Blob> {
  // Dynamic imports — essential for Next.js compatibility
  const html2canvas = (await import("html2canvas-pro")).default
  const { jsPDF } = await import("jspdf")

  // A4 dimensions in mm
  const A4_WIDTH_MM = 210
  const A4_HEIGHT_MM = 297
  const DPI_SCALE = 2 // High resolution capture

  // Capture the element
  const canvas = await html2canvas(element, {
    scale: DPI_SCALE,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: 800, // Match our template max-width
  })

  const imgData = canvas.toDataURL("image/png")
  const imgWidth = canvas.width
  const imgHeight = canvas.height

  // Calculate PDF dimensions
  const pdfWidth = A4_WIDTH_MM
  const pdfHeight = (imgHeight * pdfWidth) / imgWidth

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // If the content is taller than one page, handle multi-page
  const pageHeight = A4_HEIGHT_MM
  let heightLeft = pdfHeight
  let position = 0

  pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight)
  heightLeft -= pageHeight

  while (heightLeft > 0) {
    position -= pageHeight
    pdf.addPage()
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight)
    heightLeft -= pageHeight
  }

  return pdf.output("blob")
}
