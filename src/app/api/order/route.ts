import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, email, productName, price, payMethod } = body;

    // Validate inputs
    if (!orderId || !email || !productName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Configure nodemailer transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.163.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const payMethodStr = payMethod === 'alipay' ? '支付宝' : '微信支付';

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0a0a0a; color: #ffffff; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">📦 新订单通知</h2>
        </div>
        <div style="padding: 24px; color: #333;">
          <p style="font-size: 16px; margin-bottom: 24px;">您有一笔新订单等待处理：</p>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666; width: 100px;">订单编号</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666;">商品名称</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600; color: #ff6600;">${productName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666;">支付金额</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600;">¥ ${price}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666;">支付方式</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600;">${payMethodStr}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666;">客户邮箱</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600;">
                  <a href="mailto:${email}" style="color: #0a0a0a; text-decoration: none;">${email}</a>
                </td>
              </tr>
            </tbody>
          </table>
          
          <p style="margin-top: 32px; font-size: 14px; color: #666; text-align: center;">
            请核对收款后，尽快通过客户邮箱发送卡密/商品。
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"订单系统" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `[新订单] 收到一笔新订单：${productName} (¥${price})`,
      html: htmlContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Notification sent successfully' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
