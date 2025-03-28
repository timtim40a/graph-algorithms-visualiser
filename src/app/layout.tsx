export const metadata = {
  title: 'Graph Algorithms Visualiser',
  description: 'Final Year Project by Tymur Soroka (2025)',
  icon: 'icon.png',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
