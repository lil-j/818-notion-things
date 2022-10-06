import '../styles/globals.css'
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import NextNProgress from "nextjs-progressbar";
import {Toaster} from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  return <GeistProvider>
    <CssBaseline />
    <NextNProgress/>
    <Toaster/>
    <Component {...pageProps} />
  </GeistProvider>
}

export default MyApp
