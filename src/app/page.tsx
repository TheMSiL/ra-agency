import AdsBlock from "@/components/AdsBlock";
import Cases from "@/components/Cases";
import Footer from "@/components/Footer";
import HeroHome from "@/components/HeroHome";
import Numbers from "@/components/Numbers";
import Reviews from "@/components/Reviews";
import Talk from "@/components/Talk";

const tgAds = {
  title: 'TELEGRAM ADS',
  subtitle: 'Effective Telegram advertising at any scale. Target audience and fast results',
  items: [
    'Channel research & hypothesis testing',
    'Campaign setup & daily optimization',
    'Full-funnel analytics (leads, sales)'
  ],
  icon: '/tg.png'
}

const metaAds = {
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

const googleAds = {
  title: 'Google Ads',
  subtitle: 'Search, YouTube, Display & Performance Max. Capturing hot demand + remarketing',
  items: [
    'Keyword research & account structure',
    'GA4 setup & clean tracking',
    'Conversion & ROI optimization',
    'Scaling without efficiency loss'
  ],
  icon: '/google.png'
}

export default function page() {
  return (
    <div className="wrapper">
      <HeroHome />
      <AdsBlock title={tgAds.title} subtitle={tgAds.subtitle} items={tgAds.items} icon={tgAds.icon} />
      <AdsBlock title={metaAds.title} subtitle={metaAds.subtitle} items={metaAds.items} icon={metaAds.icon} />
      <AdsBlock title={googleAds.title} subtitle={googleAds.subtitle} items={googleAds.items} icon={googleAds.icon} />
      <Numbers />
      <div className="underFooter">
        <Cases />
        <Reviews />
        <Talk />
      </div>
      <Footer />
    </div>
  );
}