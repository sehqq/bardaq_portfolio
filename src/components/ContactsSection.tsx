import { ArrowUpRight } from 'lucide-react';

interface ContactLink {
  label: string;
  href: string;
}

const contactRows: ContactLink[][] = [
  [
    { label: 'EMAIL', href: 'mailto:pavlovskii.dd@gmail.com' },
    { label: 'TELEGRAM', href: 'https://t.me/bardaqindesign' },
    { label: 'VK', href: 'https://vk.ru/sehqq' },
  ],
  [
    { label: 'PINTEREST', href: 'https://ru.pinterest.com/sehqshk/' },
    { label: 'BEHANCE', href: 'https://www.behance.net/asehraesehq' },
  ],
  [
    { label: 'TIKTOK', href: 'https://www.tiktok.com/@asehrae?_r=1&_t=ZS-9AFKqERKJMa' },
    { label: 'THREADS', href: 'https://www.threads.com/@bardaqindesign' },
  ],
];

export const ContactsSection = () => {
  return (
    <footer
      id="contacts"
      className="relative w-full min-h-screen flex flex-col justify-between pt-28 md:pt-32 lg:pt-36 pb-12 px-6 md:px-12 lg:px-16"
    >
      {/* 1. Section Header */}
      <div className="w-full mb-8 sm:mb-12 pt-[15px]" style={{ paddingTop: '15px' }}>
        <span
          className="font-sans font-extralight text-xs sm:text-sm tracking-widest text-text-muted uppercase block"
          style={{ fontFamily: "'Geist', sans-serif", fontWeight: 200 }}
        >
          03 / Связь & Социальные сети
        </span>
      </div>

      {/* 2. Main Massive Contact Links (3 Rows) */}
      <div
        className="w-full flex flex-col select-none my-auto overflow-hidden"
        style={{
          marginTop: 'clamp(24px, 3.5vh, 48px)',
          marginBottom: 'clamp(24px, 3.5vh, 48px)',
          gap: 'clamp(4px, 1vh, 12px)',
        }}
      >
        {contactRows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="flex flex-wrap items-baseline gap-x-[1.2vw]"
            style={{ lineHeight: 'var(--contact-leading)' }}
          >
            {row.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link group relative inline-flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 font-display leading-[0.86] text-white cursor-pointer whitespace-nowrap"
                style={{
                  fontSize: 'var(--contact-font-size)',
                  lineHeight: 'var(--contact-leading)',
                }}
              >
                <span className="contact-link-label">
                  <span className="contact-link-fill">{link.label}</span>
                  <span className="contact-link-outline" aria-hidden="true">{link.label}</span>
                </span>
                <ArrowUpRight
                  size={42}
                  className="contact-link-arrow opacity-0 -translate-x-3 translate-y-3 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 transition-[opacity,transform,translate] duration-300 text-white stroke-[2.5] hidden md:inline-block"
                />
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* 3. Footer Bottom Bar */}
      <div
        className="w-full mt-16 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-sans font-extralight tracking-widest text-[#71717a] uppercase"
        style={{ fontFamily: "'Geist', sans-serif", fontWeight: 200 }}
      >
        <div className="flex items-center gap-2">
          <span>© Все права защищены.</span>
        </div>

        <div
          className="flex items-center gap-2 border border-white/15 rounded-full px-5 py-2 bg-white/5 text-white/90 font-sans font-extralight"
          style={{ fontFamily: "'Geist', sans-serif", fontWeight: 200 }}
        >
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          <span>Открыт к сотрудничеству</span>
        </div>
      </div>
    </footer>
  );
};

export const ContactSection = ContactsSection;
export const Contacts = ContactsSection;
