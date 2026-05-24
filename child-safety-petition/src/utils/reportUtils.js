import { jsPDF } from 'jspdf'
import Papa from 'papaparse'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { PETITION_DRAFT } from '../constants/petitionText'

export const downloadCampaignPdf = ({ stats, supporters }) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Public Petition Report - Child Safety in Tamil Nadu', 40, 45)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  const contentLines = doc.splitTextToSize(PETITION_DRAFT, 510)
  doc.text(contentLines, 40, 75)

  let cursor = 75 + contentLines.length * 14 + 10
  if (cursor > 670) {
    doc.addPage()
    cursor = 50
  }

  doc.setFont('helvetica', 'bold')
  doc.text(`Total Signatures: ${stats.totalSignatures}`, 40, cursor)
  doc.text(`Districts Participated: ${stats.districtsParticipated}`, 40, cursor + 18)
  doc.text(`Today's Supporters: ${stats.todaysSupporters}`, 40, cursor + 36)

  cursor += 65
  doc.setFont('helvetica', 'normal')

  supporters.slice(0, 200).forEach((supporter, index) => {
    if (cursor > 760) {
      doc.addPage()
      cursor = 50
    }

    doc.text(
      `${index + 1}. ${supporter.name} | ${supporter.district} | ${new Date(
        supporter.createdAt,
      ).toLocaleString('en-IN')}`,
      40,
      cursor,
    )
    cursor += 14
  })

  if (cursor > 730) {
    doc.addPage()
    cursor = 50
  }

  doc.setFont('helvetica', 'bold')
  doc.text(
    'Submitted to Tamil Nadu Chief Minister Office & Tamil Nadu Police',
    40,
    cursor + 18,
  )

  doc.save('child-safety-petition-report.pdf')
}

export const downloadSupportersCsv = (supporters) => {
  const csv = Papa.unparse(
    supporters.map((item) => ({
      id: item.id,
      name: item.name,
      mobile: item.mobile,
      district: item.district,
      message: item.message,
      signatureUrl: item.signatureUrl,
      createdAt: new Date(item.createdAt).toISOString(),
    })),
  )

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, 'supporters.csv')
}

const fetchImageBlob = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Unable to download signature')
  }
  return response.blob()
}

export const downloadAllSignaturesZip = async (supporters) => {
  const zip = new JSZip()
  const folder = zip.folder('signatures')

  await Promise.all(
    supporters.map(async (item) => {
      try {
        const imageBlob = await fetchImageBlob(item.signatureUrl)
        folder.file(`${item.name.replace(/\s+/g, '_')}_${item.id}.png`, imageBlob)
      } catch {
        // Skip missing signatures and continue the archive generation.
      }
    }),
  )

  const archive = await zip.generateAsync({ type: 'blob' })
  saveAs(archive, 'all-signatures.zip')
}
