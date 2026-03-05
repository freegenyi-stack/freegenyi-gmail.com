import pikepdf

pdf = pikepdf.open("input.pdf")
pdf.save("output_compressed.pdf", compress_streams=True)
pdf.close()