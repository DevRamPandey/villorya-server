const contactUsEmail = (userName, ticketId, date) => {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Villorya | Message Received</title>
    <style>
      body {
        font-family: "Poppins", "Segoe UI", Arial, sans-serif;
        background-color: #ffffff;
        color: #111111;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 20px;
        overflow: hidden;
        border: 1px solid #e5e5e5;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
        animation: fadeIn 0.8s ease-in-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(15px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .header {
        background: linear-gradient(180deg, #ffffff 70%, #00000010 100%);
        text-align: center;
        padding: 40px 20px 30px;
        border-bottom: 1px solid #e5e5e5;
      }

      .logo {
        width: 130px;
        margin-bottom: 16px;
        animation: floatUp 1.2s ease forwards;
        filter: brightness(0) invert(0);
      }

      @keyframes floatUp {
        0% {
          transform: translateY(10px);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .header h1 {
        font-size: 30px;
        font-weight: 700;
        margin: 0;
        color: #000000;
        letter-spacing: -0.5px;
      }

      .content {
        padding: 35px 30px;
        text-align: center;
        line-height: 1.7;
      }

      .content h2 {
        font-size: 22px;
        color: #111111;
        margin-bottom: 10px;
        font-weight: 600;
      }

      .content p {
        font-size: 15px;
        color: #333333;
        margin: 10px 0;
      }

      .ticket-box {
        background: #f9f9f9;
        border: 1px dashed #ccc;
        display: inline-block;
        padding: 10px 20px;
        border-radius: 12px;
        margin-top: 15px;
        font-size: 14px;
        font-weight: 500;
        color: #000000;
      }

      .button {
        display: inline-block;
        margin-top: 25px;
        background: #000000;
        color: #ffffff !important;
        padding: 14px 30px;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
        letter-spacing: 0.5px;
        transition: all 0.3s ease;
      }

      .button:hover {
        background: #ffffff;
        color: #000000 !important;
        border: 1px solid #000000;
      }

      .divider {
        height: 1px;
        background: #e5e5e5;
        margin: 35px 0;
      }

      .socials {
        display: flex;
        justify-content: center;
        gap: 18px;
        margin: 15px 0;
      }

      .socials img {
        width: 18px;
        height: 18px;
        filter: grayscale(100%) brightness(0.9);
      }

      .footer {
        text-align: center;
        padding: 20px 20px 35px;
        font-size: 12px;
        color: #666666;
      }

      .footer a {
        color: #000000;
        text-decoration: none;
        font-weight: 500;
      }

      .footer a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <img
          src="https://www.villorya.com/assets/villorya-logo-CIJtf7tR.png"
          alt="Villorya Logo"
          class="logo"
        />
        <h1>Villorya</h1>
      </div>

      <!-- Content -->
      <div class="content">
        <h2>Hello ${userName},</h2>
        <p>Thank you for reaching out to <strong>Villorya</strong>.</p>
        <p>
          Your message has been received successfully.  
          Our team will get back to you as soon as possible.
        </p>

        <div class="ticket-box">
          📩 Ticket ID: <strong>${ticketId}</strong>
        </div>

        <p>
          We appreciate your interest in our pure, natural, and authentic products.
        </p>

        <a href="https://villorya.com" class="button">Visit Our Website</a>

        <div class="divider"></div>

        <p>Stay connected with us</p>
        <div class="socials">
          <a href="https://www.facebook.com/people/Villorya-Organics/61582125782084/" target="_blank">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/villorya_organics/" target="_blank">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" />
          </a>
          <a href="https://www.linkedin.com/company/villorya-organics" target="_blank">
            <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" />
          </a>
          <a href="https://x.com/villorya_org" target="_blank">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" />
          </a>
          <a href="https://www.youtube.com/@VilloryaOrganics" target="_blank">
            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" />
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        © Villorya. Crafted with care, delivered with love.  
        <br />
        <span style="color:#999;">Sent on ${date}</span>
        <br />
        <a href="https://villorya.com">www.villorya.com</a>
      </div>
    </div>
  </body>
</html>
`;
}

module.exports = {
    contactUsEmail
}