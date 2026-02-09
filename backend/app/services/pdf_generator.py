from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO

def generate_invoice_pdf(invoice_data: dict) -> BytesIO:
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Header
    p.setFont("Helvetica-Bold", 24)
    p.drawString(50, height - 50, "COLLEGE ERP")

    p.setFont("Helvetica", 12)
    p.drawString(50, height - 80, f"Invoice #: {invoice_data['invoice_number']}")
    p.drawString(50, height - 100, f"Date: {invoice_data['created_at']}")
    p.drawString(50, height - 120, f"Status: {invoice_data['status']}")

    # Student Details
    p.drawString(50, height - 160, f"Student: {invoice_data.get('student_name', 'N/A')}")

    # Line Item
    p.line(50, height - 190, width - 50, height - 190)
    p.drawString(50, height - 210, "Description")
    p.drawString(400, height - 210, "Amount")
    p.line(50, height - 220, width - 50, height - 220)

    p.drawString(50, height - 240, f"{invoice_data.get('fee_structure', 'Tuition Fee')}")
    p.drawString(400, height - 240, f"${invoice_data['amount_due']}")

    # Total
    p.setFont("Helvetica-Bold", 12)
    p.drawString(300, height - 300, "Total Due:")
    p.drawString(400, height - 300, f"${invoice_data['amount_due']}")

    p.showPage()
    p.save()

    buffer.seek(0)
    return buffer

def generate_gatepass_pdf(pass_data: dict) -> BytesIO:
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    p.setFont("Helvetica-Bold", 20)
    p.drawString(200, height - 50, "GATE PASS")

    p.setFont("Helvetica", 14)
    p.drawString(50, height - 100, f"Pass ID: {pass_data['id']}")
    p.drawString(50, height - 130, f"Student: {pass_data.get('student_name', 'N/A')}")
    p.drawString(50, height - 160, f"Departure: {pass_data['departure_time']}")
    p.drawString(50, height - 190, f"Expected Return: {pass_data['expected_return']}")
    p.drawString(50, height - 220, f"Reason: {pass_data['reason']}")

    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, height - 280, f"STATUS: {pass_data['status']}")

    if pass_data['status'] == "Approved":
        p.rect(40, height - 295, 200, 30)

    p.showPage()
    p.save()

    buffer.seek(0)
    return buffer
