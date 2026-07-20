import Cases from "@/components/Cases";
import FloatingTelegramButton from "@/components/FloatingTelegramButton";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Numbers from "@/components/Numbers";
import Reviews from "@/components/Reviews";
import ServicesBlock from "@/components/ServicesBlock";
import Talk from "@/components/Talk";
import Trust from "@/components/Trust";

const telegramService = {
  title: 'TELEGRAM ADS',
  subtitle: 'Effective Telegram advertising at any scale. Target audience and fast results',
  items: [
    'Channel research & hypothesis testing',
    'Campaign setup & daily optimization',
    'Full-funnel analytics (leads, sales)'
  ],
  icon: '/tg.png'
}

const metaService = {
  title: 'META ADS',
  subtitle: 'Turnkey Facebook & Instagram ads. Funnel building and ROAS/CPA optimization',
  items: [
    'Strategy, funnel & media plan',
    'Pixel & Conversion API setup',
    'Pixel & Conversion API setup',
    'Static, video & UGC creative testing'
  ],
  icon: '/meta.png'
}

const googleService = {
  title: 'Google Ads',
  subtitle: 'Search, YouTube, Display & Performance Max. Capturing hot demand + remarketing',
  items: [
    'Keyword research & account structure',
    'GA4 setup & clean tracking',
    'Conversion & ROI optimization',
    'Scaling without efficiency loss'
  ],
  icon: '/googleAds.png'
}

export default function page() {
  return (
    <div className="wrapper">
      <Hero />
      <ServicesBlock title={telegramService.title} subtitle={telegramService.subtitle} items={telegramService.items} icon={telegramService.icon} href="/telegram-ads" />
      <ServicesBlock title={metaService.title} subtitle={metaService.subtitle} items={metaService.items} icon={metaService.icon} href="/meta-ads" />
      <ServicesBlock title={googleService.title} subtitle={googleService.subtitle} items={googleService.items} icon={googleService.icon} href="/google-ads" />
      <div className="section_background">
        <Numbers />
        <Cases />
        <Trust />
        <Reviews />
        <Talk />
      </div>
      <Footer />
      <FloatingTelegramButton />
    </div>
  );
}
