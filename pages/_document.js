import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          {/* <!-- Custom fonts for this template--> */}
          <link
            href="/vendor/fontawesome-free/css/all.min.css"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
            rel="stylesheet"
          />

          {/* <!-- Custom styles for this template--> */}
          <link href="/css/sb-admin-2.css" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* <!-- Bootstrap core JavaScript--> */}
          <script src="/vendor/jquery/jquery.min.js" />
          <script src="/vendor/bootstrap/js/bootstrap.bundle.min.js" />

          {/* <!-- Core plugin JavaScript--> */}
          <script src="/vendor/jquery-easing/jquery.easing.min.js" />

          {/* <!-- Custom scripts for all pages--> */}
          <script src="/js/sb-admin-2.js" />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
