import nodemailer from 'nodemailer';
import { EMAIL, PORT, PSW_MAIL } from '../config/config.js';

export const emailRefreshPassword = async (user, token) => {
  const { email, first_name } = user
  //console.log(email, first_name, token);
  const transport = nodemailer.createTransport({
    service: 'gmail',
    user: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: PSW_MAIL,
    }
  });

  try {
    await transport.sendMail({
      from: '"CoderHouse - Ecommerce - Proyecto Final" <romanpiacquadio@gmail.com>',
      to: email,
      subject: "Reset your password",
      text: "Verify your account in the app",
      html: `
      <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title></title>
  <!--[if gte mso 9]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]-->
  <!--[if mso]> <style>*{font-family: sans-serif !important;}</style><![endif]-->
  <!--[if !mso]> <link rel="stylesheet" href="https://ui.mlstatic.com/webfonts/v2.0.0-rc.1/proxima-nova/300-400-600-700.min.css"><![endif]-->
  <style>
    /* What it does: Tells the email client that only light styles are provided but the client can transform them to dark. A duplicate of meta color-scheme meta tag above. */
    :root {
      color-scheme: light;
      supported-color-schemes: light;
    }

    /* What it does: Remove spaces around the email design added by some email clients. */
    /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
    html,
    body {
      margin: 0 auto !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
    }

    /* What it does: Stops email clients resizing small text. */
    * {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    /* What it does: Centers email on Android 4.4 */
    div[style*="margin: 16px 0"] {
      margin: 0 !important;
    }

    /* What it does: forces Samsung Android mail clients to use the entire viewport */
    #MessageViewBody,
    #MessageWebViewDiv {
      width: 100% !important;
    }

    /* What it does: Stops Outlook from adding extra spacing to tables. */
    table,
    td {
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
    }

    /* What it does: Uses a better rendering method when resizing images in IE. */
    img {
      -ms-interpolation-mode: bicubic;
    }

    /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
    a {
      text-decoration: none;
    }

    /* What it does: A work-around for email clients meddling in triggered links. */
    a[x-apple-data-detectors],
    /* iOS */
    .unstyle-auto-detected-links a,
    .aBn {
      border-bottom: 0 !important;
      cursor: default !important;
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    /* What it does: Prevents Gmail from changing the text color in conversation threads. */
    .im {
      color: inherit !important;
    }

    /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
    .a6S {
      display: none !important;
      opacity: 0.01 !important;
    }

    /* If the above doesn't work, add a .g-img class to any image in question. */
    img.g-img+div {
      display: none !important;
    }

    /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89 */
    /* Create one of these media queries for each additional viewport size you'd like to fix */
    /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
    @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
      u~div .email-container {
        min-width: 320px !important;
      }
    }

    /* iPhone 6, 6S, 7, 8, and X */
    @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
      u~div .email-container {
        min-width: 375px !important;
      }
    }

    /* iPhone 6+, 7+, and 8+ */
    @media only screen and (min-device-width: 414px) {
      u~div .email-container {
        min-width: 414px !important;
      }
    }

    /* ANDES EMAIL CONTENT */
    @media screen and (max-width: 480px) {
      .andes-email-content-td {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }

      .andes-email-content {
        width: 100% !important;
        text-align: center !important;
        margin: 0 auto !important;
        transition: all 0.6s ease !important;
      }
    }
  </style>
  <style>
    @media screen and (max-width: 480px) {
      .andes-emails-logo-content-td {
        padding-top: 20px !important;
        padding-bottom: 24px !important;
      }

      .andes-emails-header-td-40 {
        padding-right: 24px !important;
      }

      .andes-emails-card-td-40 {
        padding: 24px !important;
      }

      .andes-emails-button {
        width: 100% !important;
        text-align: center !important;
        margin: 0 auto !important;
        transition: all 0.6s ease !important;
      }

      .footer-column {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        direction: ltr !important;
        transition: all 0.6s ease !important;
      }
    }
  </style>
</head>

<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f5f5f5;">
  <center role="article" aria-roledescription="email" lang="en" style="width: 100%; background-color: #f5f5f5;">
    <!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5;"> <tr> <td><![endif]-->
      <!--Subject in variants/MLB.js-->
      <!--Preheader-->
      <!-- <div style="max-height:0; overflow:hidden; mso-hide:all;" aria-hidden="true">
        Eles serão devolvidos no mesmo veículo do envio.
    </div> -->
    <div
      style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
    </div>
    <div style="max-width: 640px; margin: 0 auto;" class="email-container">
      <!--[if mso]> <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="640"> <tr> <td><![endif]-->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center" class="andes-email-content"
        style="max-width: 640px;">
        <tbody>
          <tr>
            <td align="center" class="andes-email-content-td" style="padding-left: 60px; padding-right: 60px;">
              <div>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                  class="andes-emails-logo-content" style="width: 100%; max-width: 520px; margin: 0px auto;">
                  <tbody>
                    <tr>
                      <td valign="middle" align="left" class="andes-emails-logo-content-td"
                        style="width: 100%; max-width: 520px; padding-top: 24px; padding-bottom: 20px;">
                        <a href="http://localhost:8000/api/v1/login" target="_blank"
                          rel="noopener noreferrer" title="Ir a Mercado libre"
                          style="text-decoration: none; display: block;">
                          <img height="32" decoding="async"
                            src="https://jobs.coderhouse.com/assets/logos_coderhouse.png"
                            class="" alt="Mercado Livre" style="display: block;">
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" background="">
                <tbody>
                  <tr>
                    <td style="padding-bottom: 16px; padding-top: 0px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" draggable="true"
                        style="width: 100%; background: rgb(255, 255, 255); max-width: 520px; overflow: hidden; margin: 0px auto; border-radius: 6px; border-collapse: separate; border-width: 1px 1px 2px; border-style: solid; border-color: rgb(229, 229, 229);">
                        <tbody>
                          <tr>
                            <td class="andes-emails-card-td-40" style="padding: 40px;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" draggable="true">
                                <tbody>
                                  <tr>
                                    <td align="left">
                                      <p
                                        style="font-family: &quot;Proxima Nova&quot;, -apple-system, &quot;Helvetica Neue&quot;, Helvetica, Roboto, Arial, sans-serif; font-size: 20px; line-height: 20px; font-weight: 400; color: rgba(0, 0, 0, 0.8); margin: 0px; margin-top:0px; display: flex; justify-content: center;">
                                        <b>Hi, ${first_name}</b>
                                    </p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" draggable="true">
                                <tbody>
                                  <tr>
                                    <td align="left">
                                      <p
                                        style="font-family: &quot;Proxima Nova&quot;, -apple-system, &quot;Helvetica Neue&quot;, Helvetica, Roboto, Arial, sans-serif; font-size: 20px; line-height: 20px; font-weight: 400; color: rgba(0, 0, 0, 0.8); margin: 0px; margin-top:0px; display: flex; justify-content: center;">
                                        <b>Reset your Password</b>
                                    </p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" draggable="true">
                                <tbody>
                                  <tr>
                                    <td align="left">
                                      <p
                                        style="font-family: &quot;Proxima Nova&quot;, -apple-system, &quot;Helvetica Neue&quot;, Helvetica, Roboto, Arial, sans-serif; font-size: 16px; line-height: 20px; font-weight: 400; color: rgba(0, 0, 0, 0.8); margin: 0px; margin-top:40px;">
                                        <b>Can't remember what your password is?</b>
                                    </p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" draggable="true">
                                <tbody>
                                  <tr>
                                    <td align="left">
                                      <p style="font-family: &quot;Proxima Nova&quot;, _apple_system, &quot;Helvetica Neue&quot;, Helvetica, Roboto, Arial, sans-serif; font-size:16px;line-height:1.29;color: rgba(0, 0, 0, 0.8);margin:0px;padding: 16px 0 6px 0; font-weight: normal;"
                                      >Don't worry, we'll send you back to our website so that you can set a new one.</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" draggable="true">
                                <tbody>
                                  <tr>
                                    <td align="left">
                                      <p style="font-family: &quot;Proxima Nova&quot;, _apple_system, &quot;Helvetica Neue&quot;, Helvetica, Roboto, Arial, sans-serif; font-size:16px;line-height:1.29;color: rgba(0, 0, 0, 0.8);margin:0px;padding: 6px 0 6px 0; font-weight: normal;"
                                      >Please click the button bellow.</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table role="presentation" cellspacing="0" cellpadding="0"
                                width="100%"
                                style="max-width: 450px; text-align: left; border: 0px; border-collapse: collapse; margin: 16px auto 0px auto;">
                                <tbody>
                                  <tr class="mail__button-container" style="background-color: #FFF;">
                                    <td
                                      style="font-family: 'Proxima Nova', Helvetica, Arial ,sans-serif;font-size: 14px; color:#fff;">
                                      <a class=mail__button
                                        href="http://localhost:8000/api/v1/set-new-password/${token}"
                                        target="_blank"
                                        style="
                                          text-decoration:none;
                                          text-decoration-line: none;
                                          color:#fff;
                                          background: #3483FA;
                                          border-radius: 6px;
                                          padding: 17px 24px 15px 24px;
                                          line-height: 16px;
                                          margin: 10px 0 0px 0;
                                          display: flex;
                                          align-content: center;
                                          justify-content: center;
                                          align-items: center;
                                          width: 160px;
                                        "
                                      >
                                        <span
                                          style="
                                            font-family: 'Proxima Nova', -apple-system,
                                              'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;
                                              font-weight: 600;
                                              font-size: 16px;
                                              line-height: 16px;
                                          "
                                        >
                                        Reset my password
                                        </span>
                                      </a>
                                    </td>
                                  <tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="width: 100%; max-width: 520px; margin: 0px auto;">
                <tbody>
                  <tr>
                    <td valign="middle" align="left"
                      style="width: 100%; max-width: 520px; padding-top: 20px; padding-bottom: 40px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tbody>
                          <tr>
                            <td valign="middle" align="left" style="padding-bottom: 20px;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody>
                                  <tr>
                                    <td valign="middle" align="left">
                                      <p
                                        style="font-family: &quot;Proxima Nova&quot;, -apple-system, &quot;Helvetica Neue&quot;, Helvetica, Roboto, Arial, sans-serif; font-weight: 400; font-size: 14px; color: rgba(0, 0, 0, 0.45); margin: 0px;">
                                        If you didn't create this account please dismiss the email.
                                      </p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      
      
      </td>
      </tr>
      </tbody>
      </table>
      <!--[if mso]> </td></tr></table><![endif]-->
    </div>
    <!--[if mso | IE]> </td></tr></table><![endif]-->
  </center>
</body>

</html>
`,
    })
  } catch (error) {
    console.error(error);
  }
}