import type { Inquiry, VisitorEvent } from '@prisma/client';

const WEBHOOK_URL = process.env.FEISHU_WEBHOOK_URL || '';

interface FeishuCardHeader {
  title: { tag: 'plain_text'; content: string };
  template: string;
}

interface FeishuCardElement {
  tag: 'div' | 'markdown';
  text?: { tag: 'plain_text' | 'lark_md'; content: string };
  fields?: { is_short: boolean; text: { tag: 'lark_md'; content: string } }[];
}

interface FeishuCard {
  msg_type: 'interactive';
  card: {
    header: FeishuCardHeader;
    elements: FeishuCardElement[];
  };
}

async function sendFeishuCard(card: FeishuCard): Promise<void> {
  if (!WEBHOOK_URL) {
    console.log('[Feishu] Webhook not configured, skipping notification');
    return;
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });

    if (!res.ok) {
      console.error('[Feishu] Failed to send notification:', await res.text());
    }
  } catch (error) {
    console.error('[Feishu] Error sending notification:', error);
  }
}

export async function sendFeishuInquiryCard(inquiry: Inquiry & { product?: { name: string } | null; salesperson?: { name: string } | null }): Promise<void> {
  const card: FeishuCard = {
    msg_type: 'interactive',
    card: {
      header: {
        title: { tag: 'plain_text', content: '新询盘提醒｜请及时跟进' },
        template: 'red',
      },
      elements: [
        {
          tag: 'div',
          fields: [
            { is_short: true, text: { tag: 'lark_md', content: `**客户姓名：**${inquiry.customerName}` } },
            { is_short: true, text: { tag: 'lark_md', content: `**公司名称：**${inquiry.company || '-'}` } },
            { is_short: true, text: { tag: 'lark_md', content: `**联系方式：**${inquiry.phone || inquiry.whatsapp || inquiry.email || '-'}` } },
            { is_short: true, text: { tag: 'lark_md', content: `**感兴趣产品：**${inquiry.product?.name || '-'}` } },
            { is_short: false, text: { tag: 'lark_md', content: `**需求描述：**${inquiry.requirement}` } },
            { is_short: true, text: { tag: 'lark_md', content: `**来源端口：**${inquiry.salesperson?.name || '公共入口'}` } },
            { is_short: true, text: { tag: 'lark_md', content: `**提交时间：**${inquiry.createdAt.toLocaleString('zh-CN')}` } },
          ],
        },
        {
          tag: 'markdown',
          text: { tag: 'lark_md', content: '**建议动作：**请尽快联系客户，了解详细需求并提供对应产品方案。' },
        },
      ],
    },
  };

  await sendFeishuCard(card);
}

export async function sendFeishuBehaviorCard(event: VisitorEvent): Promise<void> {
  const eventNameMap: Record<string, string> = {
    document_download: '下载了产品资料',
    phone_click: '点击了拨打电话',
    wechat_click: '点击了微信咨询',
    whatsapp_click: '点击了WhatsApp联系',
    inquiry_submit: '提交了在线询盘',
  };

  const eventSummary = eventNameMap[event.eventType] || event.eventType;
  const intentMap: Record<string, string> = { L1: '普通访问', L2: '有效访问', L3: '高意向', L4: '强意向', L5: '成交线索' };

  const card: FeishuCard = {
    msg_type: 'interactive',
    card: {
      header: {
        title: { tag: 'plain_text', content: '客户行为提醒｜高意向客户' },
        template: 'orange',
      },
      elements: [
        {
          tag: 'div',
          fields: [
            { is_short: true, text: { tag: 'lark_md', content: `**客户行为：**${eventSummary}` } },
            { is_short: true, text: { tag: 'lark_md', content: `**意向等级：**${intentMap[event.intentLevel] || event.intentLevel}` } },
            { is_short: true, text: { tag: 'lark_md', content: `**浏览页面：**${event.pageUrl}` } },
            { is_short: true, text: { tag: 'lark_md', content: `**访问时间：**${event.createdAt.toLocaleString('zh-CN')}` } },
          ],
        },
        {
          tag: 'markdown',
          text: { tag: 'lark_md', content: '**建议动作：**请根据客户浏览内容，发送对应产品资料并主动询问客户需求。' },
        },
      ],
    },
  };

  await sendFeishuCard(card);
}
