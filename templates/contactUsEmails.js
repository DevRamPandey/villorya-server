function generateEmailTemplate({ firstName, referenceId, submissionDate }) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#ffffff;font-family:Arial, Helvetica, sans-serif;">
    <!-- Hidden preheader -->
    <div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#ffffff;line-height:1px;opacity:0;">
      Thanks for contacting Villorya. We received your message and will reach you soon.
    </div>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:24px 12px;background-color:#f3f3f3;">
          
          <!-- Main email container -->
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:100%;max-width:600px;border-collapse:collapse;">
            
            <!-- Header -->
            <tr>
              <td align="center" style="padding:20px 24px;background-color:#fff;border-top-left-radius:10px;border-top-right-radius:10px;">
                <img height="50" src="https://www.villorya.com/assets/villorya-logo-CIJtf7tR.png" alt="Villorya" width="50" style="display:block;border:0;outline:none;text-decoration:none;">
              </td>
            </tr>

            <!-- Card -->
            <tr>
              <td style="background-color:#ffffff;border:0px solid #000000;border-bottom-left-radius:10px;border-bottom-right-radius:10px;padding:28px 32px;">
                
                <h1 style="margin:0 0 12px 0;font-size:22px;line-height:26px;color:#000000;font-weight:700;">
                  Thanks for reaching out!
                </h1>

                <p style="margin:0 0 16px 0;font-size:16px;line-height:24px;color:#000000;">
                  Hi <strong style="font-weight:600;">[First Name]</strong>,<br>
                  We’ve received your message and our team is reviewing it. We’ll reach you soon to help with your request.
                </p>

                <!-- Info card -->
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:18px 0 18px 0;">
                  <tr>
                    <td style="background-color:#000000;color:#ffffff;padding:14px;border-radius:10px;">
                      <p style="margin:0;font-size:14px;line-height:20px;">
                        <strong>Reference ID:</strong> <span style="font-weight:600;">[#123456]</span><br>
                        <strong>Submitted:</strong> <span>[Submission Date]</span>
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Buttons -->
                <p style="margin:0 0 18px 0;">
                  <a href="https://www.villorya.com" style="display:inline-block;text-decoration:none;padding:12px 20px;border-radius:10px;background-color:#000000;color:#ffffff;font-weight:600;font-size:14px;">
                    Visit our site
                  </a>
                  <span style="display:inline-block;width:12px;"></span>
                  <a href="mailto:support@villorya.com" style="display:inline-block;text-decoration:none;padding:12px 20px;border-radius:10px;border:1px solid #000000;color:#000000;font-weight:600;font-size:14px;background-color:#ffffff;">
                    Contact support
                  </a>
                </p>

                <p style="margin:0 0 8px 0;font-size:14px;line-height:20px;color:#000000;">
                  Warm regards,<br>
                  <strong style="font-weight:700;">Villorya</strong>
                </p>

                <p style="margin:18px 0 0 0;font-size:12px;line-height:18px;color:#000000;">
                  If you didn’t submit this request or need immediate help, reply to this email or call us at <strong>+91 91168 95464</strong>.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding:20px 12px;">
                <!-- Social icons -->
                <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:0 6px;">
                      <a href="https://facebook.com/yourpage" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/128/254/254390.png" alt="Facebook" width="32" height="32" style="display:block;border-radius:10px;">
                      </a>
                    </td>
                    <td style="padding:0 6px;">
                      <a href="https://linkedin.com/company/yourpage" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/128/3536/3536569.png" alt="LinkedIn" width="32" height="32" style="display:block;border-radius:10px;">
                      </a>
                    </td>
                    <td style="padding:0 6px;">
                      <a href="https://instagram.com/yourpage" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/128/1400/1400829.png" alt="Instagram" width="32" height="32" style="display:block;border-radius:10px;">
                      </a>
                    </td>
                    <td style="padding:0 6px;">
                      <a href="https://youtube.com/yourchannel" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/128/254/254412.png" alt="YouTube" width="32" height="32" style="display:block;border-radius:10px;">
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Footer text -->
                <p style="margin:14px 0 0 0;font-size:12px;color:#000000;">
                  Villorya • 231P, Gyatripuram • Gorakhpur
                </p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

module.exports = generateEmailTemplate;
