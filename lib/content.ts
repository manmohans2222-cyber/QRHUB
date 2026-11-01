export type ContentType = 'link' | 'text' | 'wifi' | 'email' | 'phone' | 'sms' | 'geo' | 'vcard';

export type FieldDef = {
  key: string;
  label: string;
  placeholder: string;
  keyboard?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  multiline?: boolean;
  options?: string[];
};

export type TypeDef = {
  id: ContentType;
  name: string;
  icon: string;
  blurb: string;
  fields: FieldDef[];
  defaults: Record<string, string>;
};

export const TYPES: TypeDef[] = [
  {
    id: 'link',
    name: 'Link',
    icon: 'link-outline',
    blurb: 'Open a website instantly',
    fields: [{ key: 'url', label: 'URL', placeholder: 'https://yoursite.com', keyboard: 'url' }],
    defaults: { url: 'https://qrhub.app' },
  },
  {
    id: 'text',
    name: 'Text',
    icon: 'text-outline',
    blurb: 'Any plain message',
    fields: [{ key: 'text', label: 'Message', placeholder: 'Type anything…', multiline: true }],
    defaults: { text: 'Hello from QRHub 🐼' },
  },
  {
    id: 'wifi',
    name: 'Wi-Fi',
    icon: 'wifi-outline',
    blurb: 'One-tap network join',
    fields: [
      { key: 'ssid', label: 'Network name', placeholder: 'HomeNetwork' },
      { key: 'password', label: 'Password', placeholder: 'super-secret' },
      { key: 'security', label: 'Security', placeholder: 'WPA', options: ['WPA', 'WEP', 'None'] },
    ],
    defaults: { ssid: '', password: '', security: 'WPA' },
  },
  {
    id: 'email',
    name: 'Email',
    icon: 'mail-outline',
    blurb: 'Pre-filled email draft',
    fields: [
      { key: 'to', label: 'To', placeholder: 'hi@example.com', keyboard: 'email-address' },
      { key: 'subject', label: 'Subject', placeholder: 'Hello!' },
      { key: 'body', label: 'Body', placeholder: 'Message…', multiline: true },
    ],
    defaults: { to: '', subject: '', body: '' },
  },
  {
    id: 'phone',
    name: 'Call',
    icon: 'call-outline',
    blurb: 'Dial a number',
    fields: [{ key: 'number', label: 'Phone number', placeholder: '+1 555 010 9999', keyboard: 'phone-pad' }],
    defaults: { number: '' },
  },
  {
    id: 'sms',
    name: 'SMS',
    icon: 'chatbubble-outline',
    blurb: 'Draft a text message',
    fields: [
      { key: 'number', label: 'Phone number', placeholder: '+1 555 010 9999', keyboard: 'phone-pad' },
      { key: 'message', label: 'Message', placeholder: 'Hey!', multiline: true },
    ],
    defaults: { number: '', message: '' },
  },
  {
    id: 'geo',
    name: 'Place',
    icon: 'location-outline',
    blurb: 'Drop a map pin',
    fields: [
      { key: 'lat', label: 'Latitude', placeholder: '48.8584', keyboard: 'numeric' },
      { key: 'lng', label: 'Longitude', placeholder: '2.2945', keyboard: 'numeric' },
    ],
    defaults: { lat: '48.8584', lng: '2.2945' },
  },
  {
    id: 'vcard',
    name: 'Contact',
    icon: 'person-outline',
    blurb: 'Share a contact card',
    fields: [
      { key: 'name', label: 'Full name', placeholder: 'Ada Lovelace' },
      { key: 'org', label: 'Company', placeholder: 'Analytical Engines' },
      { key: 'phone', label: 'Phone', placeholder: '+1 555 010 9999', keyboard: 'phone-pad' },
      { key: 'email', label: 'Email', placeholder: 'ada@example.com', keyboard: 'email-address' },
      { key: 'url', label: 'Website', placeholder: 'https://example.com', keyboard: 'url' },
    ],
    defaults: { name: '', org: '', phone: '', email: '', url: '' },
  },
];

export function getType(id: ContentType): TypeDef {
  return TYPES.find((t) => t.id === id) ?? TYPES[0];
}

const esc = (s: string) => (s || '').replace(/([\\;,:"])/g, '\\$1');

export function buildContent(type: ContentType, f: Record<string, string>): string {
  switch (type) {
    case 'link': {
      const url = (f.url || '').trim();
      if (!url) return '';
      if (/^[a-z]+:\/\//i.test(url) || url.startsWith('mailto:')) return url;
      return 'https://' + url;
    }
    case 'text':
      return f.text || '';
    case 'wifi': {
      if (!f.ssid) return '';
      const t = f.security === 'None' ? 'nopass' : f.security || 'WPA';
      return `WIFI:T:${t};S:${esc(f.ssid)};P:${t === 'nopass' ? '' : esc(f.password || '')};;`;
    }
    case 'email': {
      if (!f.to) return '';
      const q: string[] = [];
      if (f.subject) q.push('subject=' + encodeURIComponent(f.subject));
      if (f.body) q.push('body=' + encodeURIComponent(f.body));
      return `mailto:${f.to.trim()}${q.length ? '?' + q.join('&') : ''}`;
    }
    case 'phone':
      return f.number ? `tel:${f.number.replace(/\s+/g, '')}` : '';
    case 'sms':
      return f.number ? `SMSTO:${f.number.replace(/\s+/g, '')}:${f.message || ''}` : '';
    case 'geo':
      return f.lat && f.lng ? `geo:${f.lat},${f.lng}` : '';
    case 'vcard': {
      if (!f.name && !f.phone && !f.email) return '';
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${f.name || ''}`,
        `FN:${f.name || ''}`,
        f.org ? `ORG:${f.org}` : '',
        f.phone ? `TEL;TYPE=CELL:${f.phone}` : '',
        f.email ? `EMAIL:${f.email}` : '',
        f.url ? `URL:${f.url}` : '',
        'END:VCARD',
      ]
        .filter(Boolean)
        .join('\n');
    }
  }
}

export function autoTitle(type: ContentType, f: Record<string, string>): string {
  switch (type) {
    case 'link':
      return (f.url || 'Link').replace(/^https?:\/\//, '').replace(/\/$/, '').slice(0, 40) || 'Link';
    case 'text':
      return (f.text || 'Text').slice(0, 40) || 'Text';
    case 'wifi':
      return f.ssid ? `Wi-Fi · ${f.ssid}` : 'Wi-Fi';
    case 'email':
      return f.to || 'Email';
    case 'phone':
      return f.number || 'Phone';
    case 'sms':
      return f.number ? `SMS · ${f.number}` : 'SMS';
    case 'geo':
      return `${f.lat || '?'}, ${f.lng || '?'}`;
    case 'vcard':
      return f.name || 'Contact';
  }
}
