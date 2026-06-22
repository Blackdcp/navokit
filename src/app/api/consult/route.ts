import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, requirement, productName } = body;

    if (!email || !requirement || !productName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.163.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1677ff; color: #ffffff; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">📝 新增需求对接通知</h2>
        </div>
        <div style="padding: 24px; color: #333;">
          <p style="font-size: 16px; margin-bottom: 24px;">客户提交了针对资源/业务的定制需求，请尽快联系处理：</p>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666; width: 100px;">关联业务</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600;">${productName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666;">客户邮箱</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600;">
                  <a href="mailto:${email}" style="color: #1677ff; text-decoration: none;">${email}</a>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div style="margin-top: 24px;">
            <div style="color: #666; margin-bottom: 8px;">具体需求/链接描述：</div>
            <div style="background-color: #fafafa; border: 1px solid #eaeaea; padding: 16px; border-radius: 6px; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${requirement}</div>
          </div>
          
          <p style="margin-top: 32px; font-size: 14px; color: #999; text-align: center;">
            请直接回复该客户邮箱进行业务确认。
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"需求流转系统" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `[新需求] 客户 (${email}) 提交了 ${productName} 的定制需求`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Consultation request sent successfully' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
