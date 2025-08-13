// theme.config.js
export default {
  footer: (
    <small style={{ display: 'block', marginTop: '8rem' }}>
      <time>{new Date().getFullYear()}</time> © Juan A. Fernandez.
      <a href="/feed.xml">RSS</a>
      <style jsx>{`
        a {
          float: right;
        }
        @media screen and (max-width: 480px) {
          article {
            padding-top: 2rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </small>
  ),
  head: ({ title, meta }) => (
    <>
      {meta.description && (
        <meta name="description" content={meta.description} />
      )}
      {meta.tag && <meta name="keywords" content={meta.tag} />}
      {meta.author && <meta name="author" content={meta.author} />}
      
      {/* Enhanced SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#BE3455" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={meta.description} />
      
      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </>
  ),
  readMore: 'Read More →',
  postFooter: null,
  darkMode: true, // Enable dark mode toggle
  navs: [
    {
      url: 'https://github.com/sippinwindex',
      name: 'GitHub'
    },
    {
      url: 'https://www.linkedin.com/in/juan-fernandez-fullstack/',
      name: 'LinkedIn'
    }
  ]
}