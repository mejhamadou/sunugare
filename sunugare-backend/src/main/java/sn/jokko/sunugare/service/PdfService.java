package sn.jokko.sunugare.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import sn.jokko.sunugare.entity.Billet;
import sn.jokko.sunugare.entity.Paiement;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    private final QrCodeService qrCodeService;

    public PdfService(QrCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    public byte[] genererBilletPdf(Billet billet, Paiement paiement) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A5); // Format A5 (demi-feuille)
            PdfWriter.getInstance(document, out);
            document.open();

            // Styles
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD, new java.awt.Color(30, 58, 138));
            Font normalFont = new Font(Font.HELVETICA, 12, Font.NORMAL);
            Font boldFont = new Font(Font.HELVETICA, 12, Font.BOLD);

            // Titre
            Paragraph title = new Paragraph("SUNUGARE - BILLET DE VOYAGE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" ")); // Saut de ligne

            // Détails
            document.add(new Paragraph("Numéro de billet : " + billet.getNumeroBillet(), boldFont));
            document.add(new Paragraph("Passager : " + billet.getNomPassager(), normalFont));
            document.add(new Paragraph("Téléphone : " + (billet.getTelephonePassager() != null ? billet.getTelephonePassager() : "-"), normalFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Trajet : " + billet.getVoyage().getLigne().getVilleDepart().getNom() + " -> " + billet.getVoyage().getLigne().getVilleArrivee().getNom(), boldFont));
            document.add(new Paragraph("Départ : " + billet.getVoyage().getDateDepart().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")), normalFont));
            document.add(new Paragraph("Quai : " + billet.getVoyage().getQuai().getNumero(), normalFont));
            document.add(new Paragraph("Siège : " + billet.getNumeroSiege(), normalFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Prix payé : " + billet.getVoyage().getPrix() + " FCFA", boldFont));
            document.add(new Paragraph("Méthode de paiement : " + (paiement != null ? paiement.getMethode() : "Non payé"), normalFont));
            document.add(new Paragraph(" "));

            // Ajout du QR Code
            byte[] qrCodeImage = qrCodeService.genererQrCode(billet.getNumeroBillet(), 150, 150);
            Image qrImage = Image.getInstance(qrCodeImage);
            qrImage.setAlignment(Element.ALIGN_CENTER);
            document.add(qrImage);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }
    }
}