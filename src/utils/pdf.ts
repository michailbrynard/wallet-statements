import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib';
import { WalletInfo, ProofOfFunds, SignedMessage } from '@/types';
import { formatCurrencyAmount } from '@/utils/currency';

export const generatePDF = async (proofOfFunds: ProofOfFunds): Promise<Uint8Array> => {
  const { walletInfo, signedMessages } = proofOfFunds;
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a new page
  let currentPage = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = currentPage.getSize();
  
  // Get the standard font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  
  // Professional color scheme
  const primaryColor = rgb(0.05, 0.2, 0.4); // Professional dark blue
  const secondaryColor = rgb(0.7, 0.7, 0.7); // Light gray for accents
  const accentColor = rgb(0.0, 0.4, 0.2); // Dark green for fiat values
  const bitcoinColor = rgb(0, 0, 0); // Changed from orange to black
  const backgroundHighlight = rgb(0.97, 0.97, 1); // Very light blue for highlights
  
  // Draw header background
  currentPage.drawRectangle({
    x: 0,
    y: height - 120,
    width,
    height: 120,
    color: rgb(0.97, 0.97, 0.97), // Very light gray
  });
  
  // Draw subtle horizontal separator line
  currentPage.drawLine({
    start: { x: 50, y: height - 120 },
    end: { x: width - 50, y: height - 120 },
    thickness: 1,
    color: secondaryColor,
  });
  
  // Add title
  currentPage.drawText('BITCOIN WALLET STATEMENT', {
    x: 50,
    y: height - 60,
    size: 24,
    font: timesRomanBold,
    color: primaryColor,
  });
  
  // Add date and exchange rate info if available
  currentPage.drawText(`Statement Date: ${walletInfo.reportDate}`, {
    x: 50,
    y: height - 90,
    size: 12,
    font: helveticaFont,
    color: rgb(0.3, 0.3, 0.3),
  });
  
  // If we have exchange rate info, show it in the header
  if (walletInfo.displayCurrency && walletInfo.exchangeRate) {
    const formattedRate = formatCurrencyAmount(walletInfo.exchangeRate, walletInfo.displayCurrency);
    currentPage.drawText(`Exchange Rate: 1 BTC = ${formattedRate}`, {
      x: 300,
      y: height - 90,
      size: 12,
      font: helveticaFont,
      color: rgb(0.3, 0.3, 0.3),
    });
  }
  
  // Start content section
  let yPos = height - 160;
  
  // Add wallet info section with professional styling
  currentPage.drawText('Account Information', {
    x: 50,
    y: yPos,
    size: 16,
    font: timesRomanBold,
    color: primaryColor,
  });
  
  yPos -= 30;
  
  // Draw subtle separator line
  currentPage.drawLine({
    start: { x: 50, y: yPos + 10 },
    end: { x: width - 50, y: yPos + 10 },
    thickness: 0.5,
    color: secondaryColor,
  });
  
  // Two-column layout for account info
  // Left column - labels
  const leftCol = 50;
  const rightCol = 200;
  
  // Account holder
  yPos -= 20;
  currentPage.drawText('Account Holder:', {
    x: leftCol,
    y: yPos,
    size: 12,
    font: helveticaBold,
    color: rgb(0.3, 0.3, 0.3),
  });
  
  currentPage.drawText(walletInfo.ownerName, {
    x: rightCol,
    y: yPos,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  // Wallet name
  yPos -= 20;
  currentPage.drawText('Wallet Name:', {
    x: leftCol,
    y: yPos,
    size: 12,
    font: helveticaBold,
    color: rgb(0.3, 0.3, 0.3),
  });
  
  currentPage.drawText(walletInfo.walletName, {
    x: rightCol,
    y: yPos,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  // Total balance - highlighted
  yPos -= 40;
  
  // Draw balance box
  currentPage.drawRectangle({
    x: 45,
    y: yPos - 5,
    width: 500,
    height: 30,
    color: backgroundHighlight,
    borderColor: rgb(0.8, 0.8, 0.9),
    borderWidth: 1,
  });
  
  currentPage.drawText('Total Balance:', {
    x: leftCol,
    y: yPos,
    size: 14,
    font: helveticaBold,
    color: primaryColor,
  });
  
  // Bitcoin value - show with Bitcoin symbol and color
  const formattedBitcoin = walletInfo.totalBalance.toFixed(8);
  currentPage.drawText(`${formattedBitcoin} BTC`, {
    x: rightCol,
    y: yPos,
    size: 14,
    font: helveticaBold,
    color: bitcoinColor,
  });
  
  // Add equivalent value in display currency if available
  if (walletInfo.displayCurrency && walletInfo.exchangeRate) {
    const fiatValue = walletInfo.totalBalance * walletInfo.exchangeRate;
    const formattedFiat = formatCurrencyAmount(fiatValue, walletInfo.displayCurrency);
    
    // Calculate width of Bitcoin value to position fiat properly
    const bitcoinWidth = helveticaBold.widthOfTextAtSize(`${formattedBitcoin} BTC`, 14);
    
    // Add equals sign in neutral color
    currentPage.drawText('=', {
      x: rightCol + bitcoinWidth + 15,
      y: yPos,
      size: 14,
      font: helveticaFont,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    // Draw fiat value in appropriate color
    currentPage.drawText(formattedFiat, {
      x: rightCol + bitcoinWidth + 35,
      y: yPos,
      size: 14,
      font: helveticaBold,
      color: accentColor,
    });
  }
  
  // Add addresses section
  yPos -= 60;
  currentPage.drawText('Bitcoin Addresses', {
    x: 50,
    y: yPos,
    size: 16,
    font: timesRomanBold,
    color: primaryColor,
  });
  
  yPos -= 30;
  
  // Draw subtle separator line
  currentPage.drawLine({
    start: { x: 50, y: yPos + 10 },
    end: { x: width - 50, y: yPos + 10 },
    thickness: 0.5,
    color: secondaryColor,
  });
  
  // Draw table header background
  currentPage.drawRectangle({
    x: 50,
    y: yPos - 20,
    width: width - 100,
    height: 25,
    color: primaryColor,
  });
  
  // Table header
  yPos -= 15;
  currentPage.drawText('#', {
    x: 60,
    y: yPos,
    size: 10,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  
  currentPage.drawText('Bitcoin Address', {
    x: 85,
    y: yPos,
    size: 10,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  
  currentPage.drawText('Balance (BTC)', {
    x: 380,
    y: yPos,
    size: 10,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  
  // Add equivalent currency column if available
  if (walletInfo.displayCurrency && walletInfo.exchangeRate) {
    currentPage.drawText(`Value (${walletInfo.displayCurrency})`, {
      x: 470,
      y: yPos,
      size: 10,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
  } else {
    // Show transactions if no display currency
    currentPage.drawText('Transactions', {
      x: 470,
      y: yPos,
      size: 10,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
  }
  
  yPos -= 20;
  
  const addressesPerPage = 12; // Reduced for better spacing
  let rowCounter = 0;
  
  for (let i = 0; i < walletInfo.addresses.length; i++) {
    const address = walletInfo.addresses[i];
    rowCounter++;
    
    // Add a new page if needed
    if (i > 0 && i % addressesPerPage === 0) {
      drawFooter(currentPage, width, 30, walletInfo.reportDate, helveticaFont);
      
      currentPage = pdfDoc.addPage([595.28, 841.89]);
      yPos = height - 50;
      
      // Draw header on new page
      drawHeader(currentPage, width, height, 'Bitcoin Wallet Statement (continued)', timesRomanBold, secondaryColor, primaryColor);
      
      // Draw table header background
      yPos -= 60;
      currentPage.drawRectangle({
        x: 50,
        y: yPos - 20,
        width: width - 100,
        height: 25,
        color: primaryColor,
      });
      
      // Table header on new page
      yPos -= 15;
      currentPage.drawText('#', {
        x: 60,
        y: yPos,
        size: 10,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      });
      
      currentPage.drawText('Bitcoin Address', {
        x: 85,
        y: yPos,
        size: 10,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      });
      
      currentPage.drawText('Balance (BTC)', {
        x: 380,
        y: yPos,
        size: 10,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      });
      
      // Add equivalent currency column if available
      if (walletInfo.displayCurrency && walletInfo.exchangeRate) {
        currentPage.drawText(`Value (${walletInfo.displayCurrency})`, {
          x: 470,
          y: yPos,
          size: 10,
          font: helveticaBold,
          color: rgb(1, 1, 1),
        });
      } else {
        // Show transactions if no display currency
        currentPage.drawText('Transactions', {
          x: 470,
          y: yPos,
          size: 10,
          font: helveticaBold,
          color: rgb(1, 1, 1),
        });
      }
      
      yPos -= 20;
      rowCounter = 1;
    }
    
    // Highlight alternating rows for better readability
    if (rowCounter % 2 === 0) {
      currentPage.drawRectangle({
        x: 50,
        y: yPos - 5,
        width: width - 100,
        height: 20,
        color: rgb(0.97, 0.97, 0.97),
      });
    }
    
    // Check if we need more room on this page
    if (yPos < 70) {
      drawFooter(currentPage, width, 30, walletInfo.reportDate, helveticaFont);
      
      currentPage = pdfDoc.addPage([595.28, 841.89]);
      yPos = height - 50;
      
      // Draw header on new page
      drawHeader(currentPage, width, height, 'Bitcoin Wallet Statement (continued)', timesRomanBold, secondaryColor, primaryColor);
      
      // Draw table header background
      yPos -= 60;
      currentPage.drawRectangle({
        x: 50,
        y: yPos - 20,
        width: width - 100,
        height: 25,
        color: primaryColor,
      });
      
      // Table header on new page
      yPos -= 15;
      currentPage.drawText('#', {
        x: 60,
        y: yPos,
        size: 10,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      });
      
      currentPage.drawText('Bitcoin Address', {
        x: 85,
        y: yPos,
        size: 10,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      });
      
      currentPage.drawText('Balance (BTC)', {
        x: 380,
        y: yPos,
        size: 10,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      });
      
      // Add equivalent currency column if available
      if (walletInfo.displayCurrency && walletInfo.exchangeRate) {
        currentPage.drawText(`Value (${walletInfo.displayCurrency})`, {
          x: 470,
          y: yPos,
          size: 10,
          font: helveticaBold,
          color: rgb(1, 1, 1),
        });
      } else {
        // Show transactions if no display currency
        currentPage.drawText('Transactions', {
          x: 470,
          y: yPos,
          size: 10,
          font: helveticaBold,
          color: rgb(1, 1, 1),
        });
      }
      
      yPos -= 20;
      rowCounter = 1;
    }
    
    // Row number
    currentPage.drawText(`${i + 1}`, {
      x: 60,
      y: yPos,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    // Display full address without truncation
    currentPage.drawText(address.address, {
      x: 85,
      y: yPos,
      size: 9,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    // Balance with Bitcoin symbol
    currentPage.drawText(`${address.balance.toFixed(8)} BTC`, {
      x: 380,
      y: yPos,
      size: 10,
      font: helveticaFont,
      color: bitcoinColor,
    });
    
    // Value in display currency or transactions
    if (walletInfo.displayCurrency && walletInfo.exchangeRate) {
      const fiatValue = address.balance * walletInfo.exchangeRate;
      currentPage.drawText(formatCurrencyAmount(fiatValue, walletInfo.displayCurrency), {
        x: 470,
        y: yPos,
        size: 10,
        font: helveticaFont,
        color: accentColor,
      });
    } else {
      // Transactions if no display currency
      currentPage.drawText(address.transactions.toString(), {
        x: 470,
        y: yPos,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    }
    
    yPos -= 20;
  }
  
  // Draw footer on the last address page
  drawFooter(currentPage, width, 30, walletInfo.reportDate, helveticaFont);
  
  // Add proof of ownership section
  if (signedMessages && signedMessages.length > 0) {
    let messagesPage = pdfDoc.addPage([595.28, 841.89]);
    
    // Draw header
    drawHeader(messagesPage, width, height, 'Cryptographic Proof of Ownership', timesRomanBold, secondaryColor, primaryColor);
    
    let messageYPos = height - 160;
    
    // Add explanatory text
    messagesPage.drawText('The following cryptographic signatures prove ownership of the Bitcoin addresses in this statement.', {
      x: 50,
      y: messageYPos,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    messageYPos -= 20;
    messagesPage.drawText('Each signature can be independently verified using standard Bitcoin verification tools.', {
      x: 50,
      y: messageYPos,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    messageYPos -= 40;
    
    for (let i = 0; i < signedMessages.length; i++) {
      const signedMessage = signedMessages[i];
      
      // Check if we need a new page
      if (messageYPos < 200) {
        // Draw footer
        drawFooter(messagesPage, width, 30, walletInfo.reportDate, helveticaFont);
        
        // Create new page
        messagesPage = pdfDoc.addPage([595.28, 841.89]);
        messageYPos = height - 50;
        
        // Draw header on new page
        drawHeader(messagesPage, width, height, 'Cryptographic Proof of Ownership (continued)', timesRomanBold, secondaryColor, primaryColor);
        
        messageYPos = height - 160;
      }
      
      // Certificate-like box for each proof
      messageYPos -= 20;
      
      // Heading for each verification in a styled box
      messagesPage.drawText(`Verification Certificate ${i + 1}`, {
        x: 60,
        y: messageYPos + 7,
        size: 14,
        font: timesRomanBold,
        color: primaryColor,
      });
      
      messageYPos -= 30;
      
      // Background box for the entire proof
      const boxStartY = messageYPos + 15;
      
      // Address label and value
      messagesPage.drawText('Bitcoin Address:', {
        x: 60,
        y: messageYPos,
        size: 10,
        font: helveticaBold,
        color: rgb(0.3, 0.3, 0.3),
      });
      
      messageYPos -= 20;
      
      // Format address to fit - display full address, breaking into multiple lines if needed
      const formattedAddress = signedMessage.address;
      const addressMaxWidth = 435;
      
      if (helveticaFont.widthOfTextAtSize(formattedAddress, 10) > addressMaxWidth) {
        // Split address into two parts roughly at the middle
        const midPoint = Math.floor(formattedAddress.length / 2);
        const firstPart = formattedAddress.substring(0, midPoint);
        const secondPart = formattedAddress.substring(midPoint);
        
        messagesPage.drawText(firstPart, {
          x: 80,
          y: messageYPos,
          size: 10,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        
        messageYPos -= 15;
        
        messagesPage.drawText(secondPart, {
          x: 80,
          y: messageYPos,
          size: 10,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      } else {
        messagesPage.drawText(formattedAddress, {
          x: 80,
          y: messageYPos,
          size: 10,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      }
      
      messageYPos -= 30;
      
      // Message
      messagesPage.drawText('Signed Message:', {
        x: 60,
        y: messageYPos,
        size: 10,
        font: helveticaBold,
        color: rgb(0.3, 0.3, 0.3),
      });
      
      messageYPos -= 20;
      
      // Word wrap the message
      const message = signedMessage.message;
      const messageMaxWidth = 455;
      const messageLines = wordWrap(message, helveticaFont, 10, messageMaxWidth);
      
      for (let j = 0; j < messageLines.length; j++) {
        messagesPage.drawText(messageLines[j], {
          x: 80,
          y: messageYPos - (j * 15),
          size: 10,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      }
      
      messageYPos -= (messageLines.length * 15 + 20);
      
      // Signature
      messagesPage.drawText('Cryptographic Signature:', {
        x: 60,
        y: messageYPos,
        size: 10,
        font: helveticaBold,
        color: rgb(0.3, 0.3, 0.3),
      });
      
      messageYPos -= 20;
      
      // Word wrap signature
      const signature = signedMessage.signature;
      const signatureLines = chunkString(signature, 65);
      
      for (let j = 0; j < signatureLines.length; j++) {
        messagesPage.drawText(signatureLines[j], {
          x: 80,
          y: messageYPos - (j * 15),
          size: 8,
          font: timesItalic,
          color: rgb(0, 0, 0),
        });
      }
      
      messageYPos -= (signatureLines.length * 15 + 20);
      
      // Draw box around the certificate content
      messagesPage.drawRectangle({
        x: 50,
        y: messageYPos,
        width: width - 100,
        height: boxStartY - messageYPos,
        borderColor: secondaryColor,
        borderWidth: 1,
        color: rgb(1, 1, 1),
        opacity: 0,
      });
      
      // Leave space between verification blocks
      messageYPos -= 30;
    }
    
    // Draw footer on the last page
    drawFooter(messagesPage, width, 30, walletInfo.reportDate, helveticaFont);
  }
  
  // Serialize the PDFDocument to bytes
  return await pdfDoc.save();
};

// Helper function to draw a consistent header
function drawHeader(
  page: PDFPage,
  width: number,
  height: number,
  title: string,
  titleFont: any,
  secondaryColor: any,
  primaryColor: any
) {
  // Draw header background
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width,
    height: 120,
    color: rgb(0.97, 0.97, 0.97), // Very light gray
  });
  
  // Draw subtle horizontal separator line
  page.drawLine({
    start: { x: 50, y: height - 120 },
    end: { x: width - 50, y: height - 120 },
    thickness: 1,
    color: secondaryColor,
  });
  
  // Add title
  page.drawText(title, {
    x: 50,
    y: height - 60,
    size: 24,
    font: titleFont,
    color: primaryColor,
  });
}

// Helper function to draw a consistent footer
function drawFooter(
  page: PDFPage,
  width: number,
  height: number,
  reportDate: string,
  font: any
) {
  // Draw footer line
  page.drawLine({
    start: { x: 50, y: height + 20 },
    end: { x: width - 50, y: height + 20 },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  });
  
  // Add page number and date
  page.drawText(`Generated on ${reportDate} | Bitcoin Wallet Statement`, {
    x: width / 2 - 120,
    y: height + 5,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
}

// Helper function for word wrapping
function wordWrap(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);
    
    if (testLineWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

// Helper function to chunk a string into fixed-length pieces
function chunkString(str: string, length: number): string[] {
  const chunks = [];
  for (let i = 0; i < str.length; i += length) {
    chunks.push(str.substring(i, i + length));
  }
  return chunks;
} 