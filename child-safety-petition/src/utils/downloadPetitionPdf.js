import { jsPDF } from 'jspdf'
import { PETITION_DRAFT } from '../constants/petitionText'

export const downloadPetitionPdf = () => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Tamil Nadu Child Safety Petition', 40, 50)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  const lines = doc.splitTextToSize(PETITION_DRAFT, 510)
  doc.text(lines, 40, 80)

  doc.save('child-safety-petition.pdf')
}
