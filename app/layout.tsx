import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'PersonaPanel AI - Verified Competency Intelligence Platform',
  description: 'Multi-agent adaptive workplace simulations, cryptographic competency passports, recruiter talent audit rooms, and institutional cohort analytics.',
  openGraph: {
    title: 'PersonaPanel AI - Verified Competency Intelligence Platform',
    description: 'Multi-agent adaptive workplace simulations, cryptographic competency passports, recruiter talent audit rooms, and institutional cohort analytics.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PersonaPanel AI - Verified Competency Intelligence Platform',
    description: 'Multi-agent adaptive workplace simulations, cryptographic competency passports, recruiter talent audit rooms, and institutional cohort analytics.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('personapanel_theme');
                if (savedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
